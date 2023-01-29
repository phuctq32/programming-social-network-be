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
        console.log(comments);

        return comments;
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

export { createComment, getCommentsByPostId, destroyAllComment };
