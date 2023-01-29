import * as adminService from '../services/admin.js';

export const getAllMembers = async (req, res, next) => {
    try {
        const allMembers = await adminService.getAllMembers();

        res.status(200).json({ allMembers });
    } catch (err) {
        next(err);
    }
}

export const toggleBan = async (req, res, next) => {
    try {
        const user = await adminService.toggleBan(req.body.userId);

        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
}

