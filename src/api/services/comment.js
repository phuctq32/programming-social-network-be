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

const deleteComment = async (postId, commentId, userId) => {
    try {
        const post = await Post.getById(postId);
        const comment = await Comment.getById(commentId);
        const user = await User.getById(userId);

        if (user._id.toString() !== comment.author.toString()) {
            const error = new Error("User is not the comment's author");
            error.statusCode = 403;
            throw error;
        }

        await Comment.deleteMany({ post: post._id, parentComment: comment._id });
        await Comment.findByIdAndDelete(comment._id);
    } catch (err) {
        throw err;
    }
}

const voteComment = async (postId, commentId, userId) => {
    try {
        await Post.getById(postId);
        const comment = await Comment.getById(commentId);
        const user = await User.getById(userId);

        const updatedVotes = comment.votes;
        if (!updatedVotes.includes(user._id.toString())) {
            updatedVotes.push(user._id.toString());
            comment.votes = updatedVotes;
            await comment.save();
        }
        await comment.populate('votes', 'name');
        
        return comment;
    } catch (err) {
        throw err;
    }  
}

const unvoteComment = async (postId, commentId, userId) => {
    try {
        await Post.getById(postId);
        const comment = await Comment.getById(commentId);
        const user = await User.getById(userId);
        let updatedVotes = comment.votes;
        if (updatedVotes.includes(user._id.toString())) {
            updatedVotes = updatedVotes.filter(vote => vote.toString() !== user._id.toString());
            comment.votes = updatedVotes;
            await comment.save();
        }
        await comment.populate('votes', 'name');

        return comment;
    } catch (err) {
        throw err;
    }
}

export {
    createComment, 
    getCommentsByPostId,
    deleteComment,
    voteComment,
    unvoteComment
};