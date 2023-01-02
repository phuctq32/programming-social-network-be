import mongoose from "mongoose";
import { roleNames } from "../../configs/constants.js";

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {
        type: String,
        enum: roleNames,
        default: roleNames.MEMBER,
        required: true,
    }
});

roleSchema.statics.getById = async (id) => {
    const role = await Role.findById(id);
    if (!role) {
        const error = new Error('Role is not existing!');
        error.statusCode = 404;
        throw error;
    }

    return role;
}

const Role = mongoose.model('Role', roleSchema);
export default Role;


