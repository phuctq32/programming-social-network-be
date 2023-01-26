import Comment from "../models/comment.js";
import User from "../models/user.js";
import Post from "../models/post.js";

const createComment = async ({ userId, postId, parentCommentId, content }) => {
    try {
        const author = await User.getById(userId);
        const post = await Post.findById(postId);
        let parentComment;
        if (parentCommentId) {
            parentComment = await Comment.getById(parentCommentId);
        }
        
        const comment = new Comment({ 
            post: post._id.toString(), 
            author: author._id.toString(), 
            parentComment: parentComment ? parentComment._id.toString() : null, 
            content 
        });
        await comment.save();

        return comment;
    } catch (err) {
        throw err;
    }
}

const getCommentsByPostId = async (postId) => {
    try {
        const comments = await Comment
            .find({ post: postId, parentComment: null })
            .populate('author', 'name -_id')
            .populate({
                path: 'replies',
                populate: {
                    path: 'author',
                    select: 'name -_id',
                }
            });

        return comments;
    } catch (err) {
        throw err;
    }
}

export {
    createComment, 
    getCommentsByPostId
};