import { Router } from 'express';
import { body } from 'express-validator';

import * as authController from '../controllers/auth.js';
import Account from '../models/account.js';

const router = Router();

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email is not valid.')
            .custom((value, { req }) => {
                return Account.findOne({ email: value }).then(accountDoc => {
                    if (accountDoc) {
                        return Promise.reject('Email already exists!');
                    }
                });
            })
            .normalizeEmail(),
        body('name', 'Name is required.').notEmpty().trim(),
        body('password', 'Password must have aleast 6 characters.')
            .isLength({ min: 6 })
            .isAlphanumeric()
            .trim(),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm Password does not match!');
            }
            return true;
        }),
        body('birthday', 'Date is not valid.').isDate(),
    ],
    authController.signup
);

router.post('/login', authController.login);

export default router;