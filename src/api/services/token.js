import Token from "../models/token.js";

const createToken = async (value, expiredAt, userId) => {
    try {
        const token = new Token(value, expiredAt, userId);
        await token.save();
        
        return token;
    } catch (err) {
        throw err;
    }
}

const getTokenByValue = async (token) => {
    try {
        const token = await Token.findOne({ value: token });
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

const deleteManyToken = async (userId) => {
    try {

    } catch (err) {
        throw err;
    }
}

export {
    createToken,
    getTokenByValue,
    deleteManyToken
};