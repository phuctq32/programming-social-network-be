import mongoose from "mongoose";

const Schema = mongoose.Schema;

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