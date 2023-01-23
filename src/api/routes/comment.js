import { Router } from "express";

const router = Router();

router.get('/:postId/comments');

router.post('/:postId');

router.post('/:postId/:commentId');

router.delete('/:postId/:commentId');

export default router;