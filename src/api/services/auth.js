import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Token from '../models/token.js';
import Role from '../models/role.js';
import sendMail, { get_html_reset_password, get_html_verify } from '../utils/sendMail.js'

dotenv.config();

const getUsers = async () => {
    try {
        const users = await User.find();

        return users;
    } catch (err) {
        throw err;
    }
}

const signUp = async (userData) => {
    const { email, name, password, roleId, birthday } = userData;

    try {
        if (await User.exists({ email: email })) {
            const error = new Error('Email already exists');
            error.statusCode = 409;
            throw error;
        }

        const role = await Role.getById(roleId);
        const hashedPassword = bcrypt.hashSync(password, 12);

        let verifiedToken;
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                return next(err);
            }

            verifiedToken = buffer.toString('hex');
        });
        
        const user = new User({
            email,
            name,
            password: hashedPassword,
            role: role._id.toString(),
            birthday: birthday,
        });
        await user.save();
        const token = new Token({
            value: verifiedToken,
            expiredAt: Date.now() + 3600000,
            userId: user._id.toString(),
        });
        await token.save();

        sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Verification Email',
            html: get_html_verify(`${process.env.LOCAL_HOST}/api/verification/${verifiedToken}`)
        });
    } catch (err) {
        throw err;
    }
}

const verify = async (verifiedToken) => {
    try {
        const token = await Token.getByValue(verifiedToken);
        
        const userId = token.userId;
        const user = await User.getById(userId);
        user.isVerified = true;
        await user.save();

        await Token.deleteMany({ userId: userId });
    } catch (err) { 
        throw err;
    }
}

const login = async (email, password) => {
    try {
        const user = await User.getByEmail(email, { path: 'role'});

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            const error = new Error('Password is incorrect.');
            error.statusCode = 401;
            throw error;
        }

        // check if user is verified
        if (!user.isVerified) {
            const error = new Error('Account is not verified.');
            error.statusCode = 401;
            throw error;
        }

        // check if user is banned
        if (user.isBanned) {
            const error = new Error('Account is banned.');
            error.statusCode = 403;
            throw error;
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: '2 days' }
        );

        user.lastLoginAt = Date.now();
        await user.save();

        return { token, user };
    } catch (err) {
        throw err;
    }
}

const forgotPassword = async (email) => {
    let tokenString;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return next(err);
        }

        tokenString = buffer.toString('hex');
    });

    try {
        const user = await User.getByEmail(email);
        const token = new Token({
            value: tokenString,
            expiredAt: Date.now() + 3600000,
            userId: user._id.toString(),
        });
        await token.save();

        sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset Password',
            html: get_html_reset_password(`http://localhost:8080/api/reset-password/${token.value}`)
        });

        return token.value;
    } catch (err) {
        throw err;
    }
}

const resetPassword = async (resetToken, newPassword) => {
    try {
        const token = await Token.getByValue(resetToken);
        const user = await User.getById(token.userId);

        const hashedPassword = bcrypt.hashSync(newPassword);
        user.password = hashedPassword;
        await user.save();

        await Token.deleteMany({ userId: userId });
    } catch (err) {
        throw err;
    }
}

export { 
    signUp,
    login,
    verify,
    forgotPassword,
    resetPassword,
    getUsers,
};