import { Router } from 'express';
import * as categoryController from '../controllers/category.js';

const router = Router();

router.get('/categories', categoryController.getCategories);

export default router;