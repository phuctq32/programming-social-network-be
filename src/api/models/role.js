import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const roleEnum = {
    ADMIN: 'admin',
    MEMBER: 'member'
};

const roleSchema = new Schema({
    name: {
        type: String,
        enum: roleEnum,
        default: roleEnum.MEMBER,
        required: true,
    }
});

const Role = mongoose.model('Role', roleSchema);
export default Role;


