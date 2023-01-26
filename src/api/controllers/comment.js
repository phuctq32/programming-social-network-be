import * as commentService from '../services/comment.js';

export const createComment = async (req, res, next) => {
    try {   
        const comment = await commentService.createComment({
            postId: req.params.postId,
            userId: req.userId,
            parentCommentId: req.body.parentCommentId,
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