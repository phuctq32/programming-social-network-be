import { body } from 'express-validator';

const categoryValidations = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required.')
];

export {
    categoryValidations
};