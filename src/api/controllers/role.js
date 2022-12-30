import * as roleService from '../services/role.js';

export const getRoles = async (req, res, next) => {
    try {   
        const { roles, numberOfRoles } = await roleService.getRoles();
        
        res.status(200).json({ roles, numberOfRoles });
    } catch (err) {
        next(err);
    }
}