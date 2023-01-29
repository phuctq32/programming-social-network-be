import User from "../models/user.js";
import Role from "../models/role.js";
import { roleNames } from "../../configs/constants.js";

const getAllMembers = async () => {
    try {
        const memberRole = await Role.findOne({ name: roleNames.MEMBER });
        const allMembers = await User
            .find({ role: memberRole._id.toString() }, 'email name isVerified isBanned lastLoginAt avatar')
            .populate('role', 'name -_id');

        return allMembers;
    } catch (err) {
        throw err;
    }
}

export {
    getAllMembers
}