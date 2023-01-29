import { Router } from 'express';
import * as userController from '../controllers/user.js';
import isAuth from '../middlewares/isAuth.js';
import { changePwValidation } from '../validations/user.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';
const router = Router();

router.put(
    '/users/change-password', 
    isAuth, 
    changePwValidation, 
    validationErrorHandler,
    userController.changePassword
);

export default router;
