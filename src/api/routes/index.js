import { Router } from "express";
import authRoutes from './auth.js';
import roleRoutes from './role.js';
import categoryRoutes from './category.js';
import tagRoutes from './tag.js';
import postRoutes from './post.js';

const router = Router();

router.use('/api', authRoutes);
router.use('/api', postRoutes);
router.use('/api', roleRoutes);
router.use('/api', categoryRoutes);
router.use('/api', tagRoutes);

export default router;