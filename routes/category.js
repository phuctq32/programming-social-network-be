import { Router } from 'express';
import { body } from 'express-validator';
import * as categoryController from '../controllers/category.js';
import isAdmin from '../middlewares/is-admin.js';
import isAuth from '../middlewares/is-auth.js';
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
    categoryController.createCategory
);

export default router;