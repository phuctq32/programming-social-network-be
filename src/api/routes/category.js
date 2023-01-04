import { Router } from 'express';
import * as categoryController from '../controllers/category.js';
import isAdmin from '../middlewares/isAdmin.js';
import isAuth from '../middlewares/isAuth.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';
import { categoryValidations } from '../validations/category.js';

const router = Router();

router.get('/categories', categoryController.getCategories);

router.post('/category', isAuth, isAdmin, categoryValidations, validationErrorHandler, categoryController.createCategory);

export default router;