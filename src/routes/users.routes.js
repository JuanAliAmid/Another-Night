import { Router } from "express";
import UsersController from '../src/controllers/users.controller.js';

const router = Router();

router.get('/', UsersController.list);


export default router;



