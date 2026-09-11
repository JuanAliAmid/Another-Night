import { Router } from "express";
import UsersController from '../controllers/users.controller.js';
import authMiddle from "../middlewares/authMiddle.js";
import roleAuth from "../middlewares/roleAuth.js";

const router = Router();

router.get('/', authMiddle.auth, roleAuth.rolesAuth('admin'), UsersController.list);

export default router;



