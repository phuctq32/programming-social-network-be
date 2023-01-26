import { Router } from "express";
import * as commentController from "../controllers/comment.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router();

router.get('/posts/:postId/comments', commentController.getCommentsByPostId);

router.post('/posts/:postId', isAuth, commentController.createComment);

router.post('/posts/:postId/:commentId');

router.delete('/posts/:postId/:commentId');

export default router;