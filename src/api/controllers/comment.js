import * as commentService from '../services/comment.js';

export const createComment = async (req, res, next) => {
    try {
        const comment = await commentService.createComment({
            postId: req.body.postId,
            userId: req.userId,
            parentCommentId: req.body.parentCommentId,
            content: req.body.content,
        });

        res.status(201).json({
            message: 'Created Comment successfully!',
            comment,
        });
    } catch (err) {
        next(err);
    }
};

export const getCommentsByPostId = async (req, res, next) => {
    try {
        const comments = await commentService.getCommentsByPostId(req.params.postId);

        res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
};

export const destroyOneComment = async (req, res, next) => {
    try {
        const result = await commentService.destroyOneComment(req.params.commentId, req.userId);

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const destroyAllComment = async (req, res, next) => {
    try {
        const result = await commentService.destroyAllComment();

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
