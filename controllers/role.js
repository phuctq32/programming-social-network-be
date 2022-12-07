import Role, { roleEnum } from '../models/role.js';

export const getRoles = async (req, res, next) => {
    try {   
        const roles = await Role.find();
        
        res.status(200).json({
            roles,
            totalRoles: roles.length
        });
    } catch (err) {
        next(err);
    }
}