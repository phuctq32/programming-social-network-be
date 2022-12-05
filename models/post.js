import { Schema } from 'mongoose';

const postSchema = new Schema({
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
    ],
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);
export default Post;