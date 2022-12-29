import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    value: {
        type: String,
        required: true
    },
    expiredAt: {
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