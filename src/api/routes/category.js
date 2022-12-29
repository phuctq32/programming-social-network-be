import { Router } from 'express';
import { body } from 'express-validator';
import * as categoryController from '../controllers/category.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAuth from '../middlewares/isAuth.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';
import Category from '../models/category.js';

const router = Router();

router.get('/categories', categoryController.getCategories);

router.post(
    '/category',
    isAuth,
    isAdmin,
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Category name is required.')
            .custom((value, { req }) => {
                return Category.findOne({ name: value }).then((categoryDoc) => {
                    if (categoryDoc) {
                        return Promise.reject('Category is existing.');
                    }
                });
            }),
    ],
    validationErrorHandler,
    categoryController.createCategory
);

export default router;