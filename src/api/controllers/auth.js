import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Role from '../models/role.js';
import Token from '../models/token.js';
import sendMail, { get_html_reset_password, get_html_verify } from '../utils/sendMail.js';

import * as userService from '../services/user.js';

dotenv.config();

export const signup = async (req, res, next) => {
    try {
        await userService.signUp(req.body);

        res.status(201).json({ message: 'Created a user successfully! Please check email to verify your account.'});
    } catch (err) {
        next(err);
    }
}

export const verify = async (req, res, next) => {
    const verifiedToken = req.params.token;
    
    try {
        await userService.v
        res.json({ message: 'Account is verified!'});
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const { token, user } = await userService.login(email, password);
        
        res.status(200).json({ token, user });
    } catch (err) {
        next(err);
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const token = await userService.forgotPassword(req.body.email);

        res.status(200).json({
            message: 'An email was sent to your email account. Please check to reset your password!',
            token: token,
        })
    } catch (err) {
        next(err);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        await userService.resetPassword(req.body.password, req.params.token);

        res.status(200).json({
            message: 'Reset password successfully!'
        });
    } catch (err) {
        next(err);
    }
}