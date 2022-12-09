import { Router } from 'express';
import { body } from 'express-validator';
import * as tagController from '../controllers/tag.js';
import isAdmin from '../middlewares/is-admin.js';
import isAuth from '../middlewares/is-auth.js';
import Tag from '../models/tag.js';

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
    tagController.createTag);

export default router;