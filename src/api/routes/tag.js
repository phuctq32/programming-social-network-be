import { Router } from 'express';
import { body } from 'express-validator';
import * as tagController from '../controllers/tag.js';
import isAuth from '../middlewares/isAuth.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';

const router = Router();

router.get('/:categoryId/tags', tagController.getTagsByCategoryId);

router.post(
    '/tag',
    isAuth,
    [
        body('name')
            .notEmpty().withMessage('The name of tag is required.')
            .trim()
    ], 
    validationErrorHandler,
    tagController.createTag);

export default router;