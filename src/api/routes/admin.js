import { Router } from "express";
import * as adminController from '../controllers/admin.js';
import isAdmin from "../middlewares/isAdmin.js";
import isAuth from "../middlewares/isAuth.js";

const router = Router();

router.get('/admin/get-all-members', isAuth, isAdmin, adminController.getAllMembers);

router.put('/admin/ban', isAuth, isAdmin);
router.put('/admin/unban', isAuth, isAdmin);




export default router;