import { body } from "express-validator";

const changePwValidation = [
    body('newPassword', 'Password must have aleast 6 characters.')
        .isLength({ min: 6 })
        .isAlphanumeric()
        .trim(),
    body('confirmNewPassword')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Confirm Password does not match!');
            }
            return true;
        })
];

export {
    changePwValidation
};
