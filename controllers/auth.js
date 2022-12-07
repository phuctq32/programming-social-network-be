import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import Account from '../models/account.js';
import User from '../models/user.js';
import Role, {roleEnum} from '../models/role.js';

dotenv.config();

export const signup = async (req, res, next) => {
    console.log(errors);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
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
            console.log(error);
            throw error;
        }

        const hashedPassword = bcrypt.hashSync(password, 12);
        const account = new Account({
            email,
            password: hashedPassword
        })
        await account.save();
        
        const user = new User({
            name,
            role: role,
            account: account,
            birthday
        });
        await user.save();
        res.status(201).json({ message: 'Created an account successfully!'});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const account = await Account.findOne({ email });
        if (!account) {
            const error = new Error('Email is not existing.');
            error.statusCode = 401;
            throw error;
        }

        const isValidPassword = bcrypt.compareSync(password, account.password);
        if (!isValidPassword) {
            const error = new Error('Password is incorrect.');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                username: account.username,
                accountId: account._id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        const user = await User.findOne({ account: account._id });
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }
        const role = await Role.findById(user.role);
        
        res.status(200).json({ token, user, role });
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        next(err);
    }
}