import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/user.js';
import * as roleService from '../services/role.js';
import * as tokenService from '../services/token.js';
import sendMail, { get_html_reset_password, get_html_verify } from '../utils/sendMail.js'

dotenv.config();

const createUser = async (userData) => {
    try {
        const user = new User({
            email: userData.email,
            password: userData.hashedPassword,
            name: userData.name,
            role: userData.role,
            birthday: userData.birthday,
        });
        await user.save();

        return user;
    } catch (err) {
        throw err;
    }
}

const getUserByEmail = async (email, options) => {
    try {
        const user = await User.findOne({ email: email }).populate(options);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw err;
        }

        return user;
    } catch (err) {
        throw err;
    }
}

const getUserById = async (id, options) => {
    try {
        const user = await User.findOne(id).populate(options);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        return user;
    } catch (err) {
        throw err;
    }
}

const signUp = async (userData) => {
    const { email, name, password, roleId, birthday } = userData;

    try {
        const role = await roleService.getRoleById(roleId);
        const hashedPassword = bcrypt.hashSync(password, 12);

        let verifiedToken;
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                return next(err);
            }

            verifiedToken = buffer.toString('hex');
        });
        
        const user = await createUser(email, name, hashedPassword, role._id, birthday);
        const token = await tokenService.createToken(verifiedToken, Date.now() + 3600000, user._id);

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

const verify = async (token) => {
    try {
        const token = await tokenService.getTokenByValue(token);
        
        const userId = token.userId;
        const user = getUserById(userId);
        user.isVerified = true;
        await user.save();

        await tokenService.deleteManyToken(userId);
    } catch (err) { 
        throw err;
    }
}

const login = async (email, password) => {
    try {
        const user = await getUserByEmail(email, { path: 'role'});

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
            { expiresIn: '1h' }
        );

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
        const user = await getUserByEmail(email);
        const token = tokenService.createToken(tokenString, Date.now() + 3600000, user._id);

        sendMail({
            from: process.env.EMAIL,
            to: req.body.email,
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
        const token = await tokenService.getTokenByValue(resetToken);
        const user = await getUserById(token.userId);

        const hashedPassword = bcrypt.hashSync(newPassword);
        user.password = hashedPassword;
        await user.save();

        await tokenService.deleteManyToken(userId);
    } catch (err) {
        throw err;
    }
}

export { 
    signUp,
    login,
    verify,
    forgotPassword,
    resetPassword
};