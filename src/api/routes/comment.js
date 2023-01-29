import { Router } from "express";
import * as commentController from "../controllers/comment.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router();

router.get('/posts/:postId/comments', commentController.getCommentsByPostId);

router.post('/posts/:postId', isAuth, commentController.createComment);

router.post('/posts/:postId/:commentId', isAuth, commentController.createComment);

router.delete('/posts/:postId/:commentId/delete', isAuth, commentController.deleteComment);

router.put('/posts/:postId/:commentId/vote', isAuth, commentController.voteComment);

router.put('/posts/:postId/:commentId/unvote', isAuth, commentController.unvoteComment);

router.put('posts/:postId/:commentId');

export default router;