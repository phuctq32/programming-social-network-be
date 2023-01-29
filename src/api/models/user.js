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
    lastLoginAt: {
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

userSchema.statics.getById = async (id, select, options) => {
    try {
        const user = await User.findById(id, select).populate(options);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        return user;
    } catch (err) {
        throw err;
    }
}

userSchema.statics.getByEmail = async (email, options) => {
    try {
        const user = await User.findOne({ email: email }).populate(options);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            throw error;
        }

        return user;
    } catch (err) {
        throw err;
    }
}



const User = mongoose.model('User', userSchema);
export default User;