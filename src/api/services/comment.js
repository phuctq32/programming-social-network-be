import Comment from '../models/comment.js';
import User from '../models/user.js';
import { roleNames } from '../../configs/constants.js';

const createComment = async ({ userId, postId, parentCommentId, content }) => {
    try {
        let parentComment;
        if (parentCommentId) {
            parentComment = await Comment.getById(parentCommentId);
        }

        const comment = new Comment({
            post: postId,
            author: userId,
            parentComment: parentComment ? parentComment._id.toString() : null,
            content,
        });
        await comment.save();

        return comment;
    } catch (err) {
        throw err;
    }
};

async function getCommentsByParent(postId, parentComment = null) {
    try {
        const comments = await Comment.find({ post: postId, parentComment })
            .populate('author', 'email name avatar')
            .populate('likes', 'email name avatar');
        if (comments.length === 0) {
            return [];
        }

        const commentsWithRepliesPromiseArray = comments.map(async (comment) => {
            const replies = await getCommentsByParent(postId, comment._id);
            return {
                ...comment.toObject(),
                replies,
            };
        });

        return Promise.all(commentsWithRepliesPromiseArray);
    } catch (err) {
        throw err;
    }
}

const getCommentsByPostId = async (postId) => {
    try {
        const comments = await getCommentsByParent(postId);
        return comments;
    } catch (err) {
        throw err;
    }
};

const destroyOneComment = async (commentId, userId) => {
    try {
        const comment = await Comment.getById(commentId);
        const user = await User.getById(userId);

        // Check if user is comment's author
        if (user._id.toString() !== comment.author._id.toString() && user.role.name !== roleNames.ADMIN) {
            const error = new Error('User is not the creator or administrator');
            error.statusCode = 403;
            throw error;
        }

        await Comment.findByIdAndDelete(commentId);

        return { success: true };
    } catch (err) {
        throw err;
    }
};

const destroyAllComment = async () => {
    try {
        await Comment.deleteMany();

        return { success: true };
    } catch (err) {
        throw err;
    }
};

const toggleLikeComment = async (commentId, userId) => {
    try {
        let comment = await Comment.findById(commentId);

        if (!comment) {
            const error = new Error('Cannot find comment');
            error.statusCode = 401;
            throw error;
        }

        let likes = comment.likes;
        if (likes.includes(userId)) {
            likes = likes.filter((like) => like.toString() !== userId.toString());
        } else {
            likes.push(userId);
        }

        comment = await Comment.findByIdAndUpdate(commentId, { likes }, { new: true });

        return { comment: comment };
    } catch (err) {
        throw err;
    }
};

const editComment = async (commentId, newFields, userId) => {
    try {
        const updateObject = {};
        let comment = await Comment.findById(commentId);

        if (!comment) {
            const error = new Error('Cannot find comment');
            error.statusCode = 401;
            throw error;
        }

        // Check if user is cmt's creator
        if (userId.toString() !== comment.author._id.toString()) {
            const error = new Error('User is not the creator');
            error.statusCode = 403;
            throw error;
        }

        if (newFields.content) {
            updateObject.content = newFields.content;
        }

        comment = await Comment.findByIdAndUpdate(commentId, updateObject, { new: true });

        return { comment: comment };
    } catch (err) {
        throw err;
    }
};

export { createComment, getCommentsByPostId, destroyAllComment, destroyOneComment, toggleLikeComment, editComment };
