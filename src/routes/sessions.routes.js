import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";

const router = Router();

router.get('/status', SessionsController.SessionsStatus);
router.post('/register', SessionsController.Sessionsregister);
router.post('/login', SessionsController.SessionsLogin);

export default router;