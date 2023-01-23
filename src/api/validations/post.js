import { body } from "express-validator";

const postValidations = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 4 }).withMessage('Title must be at least 4 characters!'),
    body('content')
        .optional()
        .trim()
        .isLength({ min: 6 }).withMessage('Content must be at least 6 characters!'),
    body('categoryId')
        .optional()
        .isMongoId(),
    body('tagId')
        .optional()
        .isMongoId()
];

export {
    postValidations
};