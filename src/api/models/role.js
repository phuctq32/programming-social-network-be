import mongoose from "mongoose";
import { roleNames } from "../../configs/constants";

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {
        type: String,
        enum: roleNames,
        default: roleNames.MEMBER,
        required: true,
    }
});

const Role = mongoose.model('Role', roleSchema);
export default Role;


