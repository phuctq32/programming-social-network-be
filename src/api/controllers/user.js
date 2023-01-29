import * as userService from '../services/user.js';

export const changePassword = async (req, res, next) => {
    try {
        const user = await userService.changePassword(req.userId, req.body.currentPassword, req.body.newPassword);

        res.status(200).json({ message: 'Changed password successfully' });
    } catch (err) {
        next(err);
    }
}