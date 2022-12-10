import { Router } from "express";
import * as postController from '../controllers/post.js';

const router = Router();

router.get('/api/posts', postController.getPosts);

export default router;