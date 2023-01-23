import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true,
        },
        images: [
            {
                type: String,
            }
        ],
        tag: {
            type: Schema.Types.ObjectId,
            ref: 'Tag',
            required: true
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        views: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ]
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

postSchema.virtual('numComments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    count: true
});

postSchema.statics.getById = async (id) => {
    try {
        const post = await Post.findById(id)
            .populate('category')
            .populate('tag', 'name')
            .populate('creator', 'name');
        if (!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            throw error;
        }

        return post;
    } catch (err) {
        throw err;
    }
}

const Post = mongoose.model('Post', postSchema);
export default Post;