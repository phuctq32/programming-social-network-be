import mongoose from "mongoose";

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
    token: String,
    tokenExpiration: Date,
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);
export default Account;