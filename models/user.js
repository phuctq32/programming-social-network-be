import { Schema } from 'mongoose';

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
        name: { type: String, required: true },
    },
    avatar: {
        type: String
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