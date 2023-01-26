import { Router } from "express";
import * as commentController from "../controllers/comment.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router();

router.get('/:postId/comments');

router.post('/:postId', isAuth, commentController.createComment);

router.post('/:postId/:commentId');

router.delete('/:postId/:commentId');

export default router;