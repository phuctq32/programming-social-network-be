import * as userService from '../services/user.js';

export const changePassword = async (req, res, next) => {
    try {
        const user = await userService.changePassword(req.userId, req.body.currentPassword, req.body.newPassword);

        res.status(200).json({ message: 'Changed password successfully' });
    } catch (err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.params.userId);

        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}

export const toggleFollow = async (req, res, next) => {
    try {
        const user = await userService.toggleFollow(req.userId, req.params.userId);

        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}