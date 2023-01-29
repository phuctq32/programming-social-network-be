import Comment from '../models/comment.js';
import User from '../models/user.js';
import Post from '../models/post.js';

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
        const comments = await Comment.find({ post: postId, parentComment }).populate('author', 'email name avatar');
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

const updateComment = async (commentId, userId, commentData) => {
    try {
        const editedComment = await Comment.getById(commentId);

        // Check if user is comment's author
        if (userId.toString() !== editedComment.author._id.toString()) {
            console.log(userId.toString(), editedComment.author._id.toString());
            const error = new Error('User is not the creator');
            error.statusCode = 403;
            throw error;
        }

        editedComment.content = commentData.content;
        await editedComment.save();

        return editedComment;
    } catch (err) {
        throw err;
    }
}

const destroyOneComment = async (commentId, userId) => {
    try {
        const comment = await Comment.getById(commentId);

        // Check if user is comment's author
        if (userId.toString() !== comment.author._id.toString()) {
            const error = new Error('User is not the creator');
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

export { 
    createComment,
    getCommentsByPostId,
    updateComment,
    destroyAllComment,
    destroyOneComment,
    toggleLikeComment
};
