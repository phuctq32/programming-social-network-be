import * as authService from '../services/auth.js';

export const signup = async (req, res, next) => {
    try {
        await authService.signUp(req.body);

        res.status(201).json({ message: 'Created a user successfully! Please check email to verify your account.'});
    } catch (err) {
        next(err);
    }
}

export const verify = async (req, res, next) => {
    const verifiedToken = req.params.token;
    
    try {
        await authService.verify(verifiedToken);

        res.status(200).json({ message: 'Account is verified!'});
    } catch (err) {
        next(err);
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const { token, user } = await authService.login(email, password);
        
        res.status(200).json({ token, user });
    } catch (err) {
        next(err);
    }
}

export const forgotPassword = async (req, res, next) => {
    try {
        const token = await authService.forgotPassword(req.body.email);

        res.status(200).json({
            message: 'An email was sent to your email account. Please check to reset your password!',
            token: token,
        })
    } catch (err) {
        next(err);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        await authService.resetPassword(req.params.token, req.body.password);

        res.status(200).json({
            message: 'Reset password successfully!'
        });
    } catch (err) {
        next(err);
    }
}