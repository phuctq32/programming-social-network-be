import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Role from '../models/role.js';
import Token from '../models/token.js';
import { getRoleById } from '../services/role.js';
import sendMail, { get_html_reset_password, get_html_verify } from '../utils/sendMail.js';

dotenv.config();

export const signup = async (req, res, next) => {
    const {
        email,
        name,
        roleId,
        password,
        birthday
    } = req.body;
    try {
        console.log('das');
        // const role = await Role.findById(roleId);
        // if (!role) {
        //     const error = new Error('Role is not existing!');
        //     error.statusCode = 404;
        //     return next(error);
        // }
        const role = await getRoleById(roleId);

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
            password: hashedPassword,
            name,
            role: role,
            birthday
        });
        await user.save();

        const token = new Token({
            value: verifiedToken,
            expiredAt: Date.now() + 3600000,
            userId: user._id
        });
        await token.save();

        sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Verification Email',
            html: get_html_verify(`${process.env.LOCAL_HOST}/api/verification/${verifiedToken}`)
        });

        res.status(201).json({ message: 'Created a user successfully! Please check email to verify your account.'});
    } catch (err) {
        next(err);
    }
}

export const verify = async (req, res, next) => {
    const verifiedToken = req.params.token;
    
    try {
        const token = await Token.findOne({ value: verifiedToken });
        if (!token) {
            const error = new Error('Invalid token.');
            error.statusCode = 498;
            return next(error);
        }

        if (token.expiredAt < Date.now()) {
            const error = new Error('Token is expired.');
            error.statusCode = 419;
            return next(error);
        }

        const userId = token.userId;
        const user = await User.findById(userId);
        user.isVerified = true;
        await user.save();

        await Token.deleteMany({ userId: userId });
        res.json({ message: 'Account is verified!'});
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email: email });

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            const error = new Error('Password is incorrect.');
            error.statusCode = 401;
            return next(error);
        }

        // check if user is verified
        if (!user.isVerified) {
            const error = new Error('Account is not verified.');
            error.statusCode = 401;
            return next(error);
        }

        // check if user is banned
        if (user.isBanned) {
            const error = new Error('Account is banned.');
            error.statusCode = 403;
            return next(error);
        }

        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        const role = await Role.findById(user.role);
        
        res.status(200).json({ token, user, role });
    } catch (err) {
        next(err);
    }
}

export const forgotPassword = async (req, res, next) => {
    let tokenString;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return next(err);
        }

        tokenString = buffer.toString('hex');
    });

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            const error = new Error('Could not find user with token.');
            error.statusCode = 404;
            return next(error);
        }
        const token = new Token({
            value: tokenString,
            expiredAt: Date.now() + 3600000,
            userId: user._id
        });
        await token.save();

        sendMail({
            from: process.env.EMAIL,
            to: req.body.email,
            subject: 'Reset Password',
            html: get_html_reset_password(`http://localhost:8080/api/reset-password/${tokenString}`)
        });

        res.status(200).json({
            message: 'An email was sent to your email account. Please check to reset your password!',
            token: tokenString,
        })
    } catch (err) {
        next(err);
    }
}

export const resetPassword = async (req, res, next) => {
    const passwordResetToken = req.params.token;
    const newPassword = req.body.password;

    try {
        const token = await Token.findOne({ value: passwordResetToken });
        if (!token) {
            const error = new Error('Invalid token.');
            error.statusCode = 498;
            return next(error);
        }

        if (token.expiredAt < Date.now()) {
            const error = new Error('Token is expired.');
            error.statusCode = 419;
            return next(error);
        }

        const userId = token.userId;
        const user = await User.findById(token.userId);
        if (!user) {
            const error = new Error('Could not find user with token.');
            error.statusCode = 404;
            return next(error);
        }

        const hashedPassword = bcrypt.hashSync(newPassword);
        user.password = hashedPassword;
        await user.save();

        await Token.deleteMany({ userId: userId });
        res.status(200).json({
            message: 'Reset password successfully!'
        });
    } catch (err) {
        next(err);
    }
}