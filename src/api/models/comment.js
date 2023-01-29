import mongoose from 'mongoose';

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
            default: null,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

commentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment',
});

commentSchema.statics.getById = async (id) => {
    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            const error = new Error('Comment not found');
            error.statusCode = 404;
            throw error;
        }

        return comment;
    } catch (err) {
        throw err;
    }
};

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
