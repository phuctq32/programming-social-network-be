import { Router } from 'express';
import { body } from 'express-validator';
import * as tagController from '../controllers/tag.js';
import isAdmin from '../middlewares/is-admin.js';
import isAuth from '../middlewares/is-auth.js';

const router = Router();

router.get('/tags/:categoryId', tagController.getTagsByCategoryId);

router.post('/tag/:categoryId', isAuth);

export default router;