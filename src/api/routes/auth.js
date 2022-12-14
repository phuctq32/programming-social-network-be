import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';

const router = Router();

router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email is not valid.')
            .normalizeEmail({ gmail_remove_dots: false }),
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
    validationErrorHandler,
    authController.signup
);

router.post('/verification/:token', authController.verify);

router.post(
    '/login',
    [
        body("email")
            .isEmail()
            .withMessage("Email is not valid.")
            .normalizeEmail({ gmail_remove_dots: false }),
    ],
    validationErrorHandler,
    authController.login);

router.post(
    '/forgot-password',
    [
        body("email")
            .isEmail()
            .withMessage("Email is not valid.")
            .normalizeEmail({ gmail_remove_dots: false }),
    ],
    validationErrorHandler,
    authController.forgotPassword
);

router.post(
    '/reset-password/:token',
    [
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
    ],
    validationErrorHandler,
    authController.resetPassword
);

export default router;