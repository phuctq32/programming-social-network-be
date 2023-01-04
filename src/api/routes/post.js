import { Router } from "express";
import * as postController from '../controllers/post.js';
import isAuth from "../middlewares/isAuth.js";
import validationErrorHandler from "../middlewares/validationErrorHandler.js";
import multer from "../utils/multer.js";
import { postValidations } from "../validations/post.js";

const router = Router();

router.get('/posts', postController.getPosts);

router.get('/posts/:postId', postController.getPost);

router.post('/post', isAuth, multer.array('images'), postValidations, validationErrorHandler, postController.createPost);

router.put('/posts/:postId/edit', isAuth, multer.array('images'), postValidations, validationErrorHandler, postController.editPost);

router.delete('/posts/:postId/delete', isAuth, postController.deletePost);

router.put('/posts/:postId/like', isAuth, postController.like);

router.put('/posts/:postId/unlike', isAuth, postController.unlike);

router.put('/posts/:postId/view', isAuth, postController.view);

router.put('/posts/:postId/save', isAuth, postController.save);

router.put('/posts/:postId/unsave', isAuth, postController.unsave);

export default router;