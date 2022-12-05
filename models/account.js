const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isBanned: {
        type: Boolean,
        required: true,
        default: false
    },
    lastActiveAt: {
        type: Date,
        min: '2022-09-05'
    },
    resetToken: String,
    resetTokenExpiration: Date,
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);