import Role from "../models/role.js";
import User from "../models/user.js";
import { roleNames } from "../../configs/constants.js";

const isAdmin = async (req, res, next) => {
    const userId = req.userId;
    try {
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error('User not found.');
            error.statusCode = 404;
            return next(error);
        }

        const adminRole = await Role.findOne({ name: roleNames.ADMIN });

        if (user.role.toString() !== adminRole._id.toString()) {
            const error = new Error('Your account is not an administrator.');
            error.statusCode = 401;
            return next(error);
        }

    } catch (err) {
        next(err);
    }

    next();
}

export default isAdmin;