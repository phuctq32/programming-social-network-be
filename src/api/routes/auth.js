import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';
import { signupValidations, loginValidations, forgotPasswordValidations, resetPasswordValidations } from '../validations/auth.js';

const router = Router();

router.post('/signup', signupValidations, validationErrorHandler, authController.signup );

router.post('/verification/:token', authController.verify);

router.post('/login', loginValidations, validationErrorHandler, authController.login);

router.post('/forgot-password', forgotPasswordValidations, validationErrorHandler, authController.forgotPassword);

router.post('/reset-password/:token', resetPasswordValidations, validationErrorHandler, authController.resetPassword);

export default router;