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

tokenSchema.statics.getByValue = async (value) => {
    try {
        const token = await Token.findOne({ value: value });
        if (!token) {
            const error = new Error('Invalid token.');
            error.statusCode = 498;
            throw error;
        }

        if (token.expiredAt < Date.now()) {
            const error = new Error('Token is expired.');
            error.statusCode = 419;
            throw error;
        }

        return token;
    } catch (err) {
        throw err;
    }
}

const Token = mongoose.model('Token', tokenSchema);
export default Token;