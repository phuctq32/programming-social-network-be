import * as commentService from '../services/comment.js';

export const createComment = async (req, res, next) => {
    try {   
        const comment = await commentService.createComment({
            postId: req.params.postId,
            userId: req.userId,
            parentCommentId: req.params.commentId,
            content: req.body.content
        });

        res.status(201).json({ 
            message: 'Created Comment successfully!',
            comment 
        });
    } catch (err) {
        next(err);
    }
}

export const getCommentsByPostId = async (req, res, next) => {
    try {
        const comments = await commentService.getCommentsByPostId(req.params.postId);

        res.status(200).json({ comments });
    } catch (err) {
        next(err);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        await commentService.deleteComment(req.params.postId, req.params.commentId, req.userId);

        res.status(204).json({ message: 'Comment deleted successfully' });
    } catch (err) {
        next(err);
    }
}

export const voteComment = async (req, res, next) => {
    try {
        const comment = await commentService.voteComment(req.params.postId, req.params.commentId, req.userId);

        res.status(200).json({ comment });
    } catch (err) {
        next(err);
    }
}

export const unvoteComment = async (req, res, next) => {
    try {
        const comment = await commentService.unvoteComment(req.params.postId, req.params.commentId, req.userId);

        res.status(200).json({ comment });
    } catch (err) {
        next(err);
    }
}