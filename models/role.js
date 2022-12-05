const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleEnum = {
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

exports.roleEnum = roleEnum;
exports.roleSchema = mongoose.model('Role', roleSchema);

