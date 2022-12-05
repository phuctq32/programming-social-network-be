import { Router } from 'express';

import * as authController from '../controllers/auth';

const router = Router();

router.post('/signup', authController.signup);

export default router;