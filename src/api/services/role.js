import Role from "../models/role.js";

const getRoleById = async (id) => {
    const role = await Role.findById(id);
    if (!role) {
        const error = new Error('Role is not existing!');
        error.statusCode = 404;
        throw error;
    }

    return role;
}

const getRoles = async () => {
    try {
        const roles = await Role.find();
        const numberOfRoles = roles.length;

        return { roles, numberOfRoles };
    } catch (err) {
        throw err;
    }
}

export {
    getRoleById,
    getRoles
};