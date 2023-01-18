import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: false
    },
    votes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

commentSchema.statics.getAllCommentsByPostId = async (postId) => {
    result = await Comment.find({ post: postId });
    if (!parentComment) {
        return 
    }
}

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;