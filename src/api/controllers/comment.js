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