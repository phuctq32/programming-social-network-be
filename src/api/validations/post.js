import { body } from "express-validator";

const postValidations = [
    body('title')
        .trim()
        .isLength({ min: 4 }).withMessage('Title must be at least 4 characters!'),
    body('content')
        .trim()
        .isLength({ min: 6 }).withMessage('Content must be at least 6 characters!'),
    body('categoryId')
        .isMongoId(),
    body('tagId')
        .isMongoId()
];

export {
    postValidations
};