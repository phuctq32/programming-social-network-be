import bcrypt from 'bcryptjs';
import User from '../models/user.js';


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

export {
    changePassword
};