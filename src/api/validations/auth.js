import { body } from 'express-validator';

const validator = {
    email: body('email').isEmail().withMessage('Email is not valid.').normalizeEmail({ gmail_remove_dots: false }),
    name: body('name', 'Name is required.').notEmpty().trim(),
    password: body('password', 'Password must have aleast 6 characters.').isLength({ min: 6 }).isAlphanumeric().trim(),
    confirmPassword: body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Confirm Password does not match!');
        }
        return true;
    }),
    date: body('birthday', 'Date is not valid.').isDate()
};

const signupValidations = [ validator.email, validator.name, validator.password, validator.confirmPassword, validator.date ];

const loginValidations = [ validator.email ];

const forgotPasswordValidations = [ validator.email ];

const resetPasswordValidations = [ validator.password, validator.confirmPassword ];

export {
    signupValidations,
    loginValidations,
    forgotPasswordValidations,
    resetPasswordValidations
};



