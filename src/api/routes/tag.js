import { Router } from 'express';
import * as tagController from '../controllers/tag.js';
import isAuth from '../middlewares/isAuth.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';
import { tagValidation } from '../validations/tag.js';

const router = Router();

router.get('/:categoryId/tags', tagController.getTagsByCategoryId);

router.post('/tag', isAuth, tagValidation,  validationErrorHandler, tagController.createTag);

export default router;