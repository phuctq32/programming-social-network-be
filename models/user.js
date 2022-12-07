import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: { 
        type: Schema.Types.ObjectId, 
        ref: 'Role', 
        required: true 
    },
    account: {
        type: Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    avatar: {
        type: String,
        default: 'https://simulacionymedicina.es/wp-content/uploads/2015/11/default-avatar-300x300-1.jpg'
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
});

const User = mongoose.model('User', userSchema);
export default User;