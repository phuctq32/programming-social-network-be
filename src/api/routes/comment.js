import { Router } from 'express';
import * as commentController from '../controllers/comment.js';
import isAuth from '../middlewares/isAuth.js';

const router = Router();

// router.get('/comment/get-by-id/:commentId', commentController.getCommentsByPostId);
router.get('/comment/:postId', commentController.getCommentsByPostId);

router.post('/comment', isAuth, commentController.createComment);

router.put('/comment/toggle-like/:commentId', isAuth, commentController.toggleLikeComment);
router.put('/comment/:commentId', isAuth, commentController.editComment);

router.delete('/comment/:commentId', isAuth, commentController.destroyOneComment);
router.delete('/comment', commentController.destroyAllComment);

export default router;
