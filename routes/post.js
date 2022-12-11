import { Router } from "express";
import { body, check } from "express-validator";
import * as postController from '../controllers/post.js';
import isAuth from "../middlewares/is-auth.js";
import multer from "../utils/multer.js";

const router = Router();

const postValidation = [
    body('title')
        .trim()
        .isLength({ min: 4 }).withMessage('Title must be at least 4 characters!'),
    body('content')
        .trim()
        .isLength({ min: 6 }).withMessage('Content must be at least 6 characters!'),
    body('categoryId')
        .isMongoId(),
    body('tagId')
        .isMongoId()
];

router.get('/posts', postController.getPosts);

router.get('/posts/:postId', postController.getPost);

router.post('/post', isAuth, multer.array('images'), postValidation, postController.createPost);

router.put('/posts/:postId/edit', isAuth, multer.array('images'), postValidation, postController.editPost);

router.delete('/posts/:postId/delete', isAuth, postController.deletePost);

export default router;