import { Router } from 'express';
import { body } from 'express-validator';
import * as categoryController from '../controllers/category.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAuth from '../middlewares/isAuth.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';

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
    ],
    validationErrorHandler,
    categoryController.createCategory
);

export default router;