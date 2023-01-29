import { Router } from 'express';
import * as userController from '../controllers/user.js';
import isAuth from '../middlewares/isAuth.js';
import { changePwValidation } from '../validations/user.js';
import validationErrorHandler from '../middlewares/validationErrorHandler.js';
const router = Router();

router.get('/users/:userId', userController.getUser);

router.put(
    '/users/change-password', 
    isAuth, 
    changePwValidation, 
    validationErrorHandler,
    userController.changePassword
);

router.put('/users/:userId/follow', isAuth, userController.toggleFollow);
router.put('/users/:userId/unfollow', isAuth, userController.toggleFollow);



export default router;
