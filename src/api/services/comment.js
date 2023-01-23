import Comment from "../models/comment.js";


const createComment = async ({userId, postId, commentId, content}) => {
    try {
        await User.findById(userId);
        await Post.findById(postId);
    } catch (err) {
        throw err;
    }
}

export {

};