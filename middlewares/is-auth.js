import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

const isAuth = async (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(" ")[1];

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error("Not authenticated.");
        error.statusCode = 401;
        throw error;
    }

    try {
        const user = await User.findById(decodedToken.userId);
        if (!user) {
            const error = new Error("User not found.");
            error.statusCode = 404;
            throw error;
        }

        if (!user.isVerified) {
            const error = new Error("User is not verified.");
            error.statusCode = 401;
            throw error;
        }
    } catch (err) {
        err.statusCode = err.statusCode || 500;
        return next(err);
    }

    req.userId = decodedToken.userId;
    next();
}

export default isAuth;