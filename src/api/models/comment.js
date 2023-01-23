import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema(
    {
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
            required: false,
            default: null
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
    }, 
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true } 
    }
);

commentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;