import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    tokenExpiration: {
        type: Date,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Token = mongoose.model('Token', tokenSchema);
export default Token;