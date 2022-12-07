import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/user.js';
import Role, {roleEnum} from '../models/role.js';

dotenv.config();

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }

    const {
        email,
        name,
        roleId,
        password,
        birthday
    } = req.body;
    try {
        const role = await Role.findById(roleId);
        if (!role) {
            const error = new Error('Role is not existing!');
            error.statusCode = 404;
            return next(error);
        }

        const hashedPassword = bcrypt.hashSync(password, 12);
        
        const user = new User({
            email,
            password: hashedPassword,
            name,
            role: role,
            birthday
        });
        await user.save();
        res.status(201).json({ message: 'Created a user successfully!'});
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('Email is not existing.');
            error.statusCode = 401;
            return next(error);
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            const error = new Error('Password is incorrect.');
            error.statusCode = 401;
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

export const resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error(errors.array()[0].msg);
        error.statusCode = 422;
        error.validationErrors = errors.array();
        return next(error);
    }

    
}