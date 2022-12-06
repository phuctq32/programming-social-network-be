import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

import Account from '../models/account.js';
import User from '../models/user.js';
import Role, {roleEnum} from '../models/role.js';

export const signup = async (req, res, next) => {
    const errors = validationResult(req);
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
        });
        await account.save();
        
        const user = new User({
            name,
            role: roleId,
            birthday
        });
        await user.save();
        res.status(200).json({ message: 'Created an account successfully!'});
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
}

export const login = async (req, res, next) => {

}