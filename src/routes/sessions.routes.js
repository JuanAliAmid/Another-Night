import { Router } from "express";
import SessionsController from '../../src/controllers/sessions.controller.js'

const router = Router();

router.get('/', SessionsController.status);


export default router;