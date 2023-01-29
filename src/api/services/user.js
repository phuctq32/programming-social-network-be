import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import * as imageHandler from '../utils/imageHandler.js';
import { DEFAULT_AVATAR_URL } from '../../configs/constants.js';

const changePassword = async (userId, currentPassword, newPassword) => {
    try {
        const user = await User.getById(userId);

        const isMatch = bcrypt.compareSync(currentPassword, user.password);
        if (!isMatch) {
            const error = new Error('Current Password is incorrect!');
            error.statusCode = 401;
            throw error;
        }

        if (newPassword === currentPassword) {
            const error = new Error('New password is match to current password!');
            error.statusCode = 422;
            throw error;
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        return user;
    } catch (err) {
        throw err;
    }
}

const getUser = async (userId) => {
    try {
        let user = await User.getById(
            userId, 
            'email name avatar role birthday lastLoginAt following -_id',
        )
        await user.populate('role', 'name -_id')
        await user.populate('following', 'name -_id')
        const followers = await User.find(
            { following: { $elemMatch: { $eq: userId }} },
            'name -_id'
        );
        user = user.toObject();
        user.followers = followers;
        return user;
    } catch (err) {
        throw err;
    }
}

const updateUser = async (userId, { name, birthday, avatar }) => {
    try {
        const user = await User.getById(userId);

        if (name) {
            user.name = name;
        }

        if (birthday) {
            user.birthday = birthday;
        }

        console.log(avatar);
        if (avatar) {
            // Delete current avatar
            if (user.avatar !== DEFAULT_AVATAR_URL) {
                await imageHandler.deleteFolder(imageHandler.path.forAvatar(user._id.toString()));
            }

            const uploadedImage = await imageHandler.upload(avatar.path, {
                fileName: 'avatar',
                folder: imageHandler.path.forAvatar(user._id.toString()),
            });
            user.avatar = uploadedImage.url;
        }

        await user.save();

        return user;
    } catch (err) {
        throw err;
    }
}

const toggleFollow = async (userId, followingId) => {
    try {
        const user = await User.getById(userId);

        let following = user.following;
        if (following.includes(followingId.toString())) {
            following = following.filter(follow => follow.toString() !== followingId.toString());
        } else {
            following.push(followingId);
        }
        user.following = following;
        await user.save();

        return user;
    } catch (err) {
        throw err;
    }
}

export {
    changePassword,
    getUser,
    toggleFollow,
    updateUser
};