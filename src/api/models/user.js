import mongoose from "mongoose";
import { DEFAULT_AVATAR_URL } from "../../configs/constants.js";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    isBanned: {
        type: Boolean,
        required: true,
        default: false
    },
    lastActiveAt: {
        type: Date,
        min: '2022-09-05'
    },
    role: { 
        type: Schema.Types.ObjectId, 
        ref: 'Role', 
        required: true 
    },
    avatar: {
        type: String,
        default: DEFAULT_AVATAR_URL
    },
    birthday: {
        type: Date,
        required: true,
        default: '1901/01/01'
    },
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    savedPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post',
        }
    ],
    following: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    ]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;