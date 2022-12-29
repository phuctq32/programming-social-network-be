import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    replies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    totalLikes: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        min: [1, 'The min level of comment is 1'],
        max: [3, 'The max level of comment is 3']
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;