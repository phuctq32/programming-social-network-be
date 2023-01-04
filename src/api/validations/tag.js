import { body } from "express-validator";

const tagValidation = [
    body('name')
        .notEmpty().withMessage('The name of tag is required.')
        .trim()
];

export {
    tagValidation
};