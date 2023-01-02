import Role from "../models/role.js";

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
    getRoles
};