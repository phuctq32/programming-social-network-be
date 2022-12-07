import { Router } from 'express';
import * as roleController from '../controllers/role.js';

const router = Router();

router.get('/roles', roleController.getRoles);

export default router;