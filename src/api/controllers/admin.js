import * as adminService from '../services/admin.js';

export const getAllMembers = async (req, res, next) => {
    try {
        const allMembers = await adminService.getAllMembers();

        res.status(200).json({ allMembers });
    } catch (err) {
        next(err);
    }
}

