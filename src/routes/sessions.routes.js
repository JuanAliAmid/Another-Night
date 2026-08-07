import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";
import authMiddle from "../middlewares/auth.js";

const router = Router();

router.get('/status', SessionsController.SessionsStatus);
router.post('/register', SessionsController.Sessionsregister);
router.get('/current', authMiddle.auth, SessionsController.SessionsCurrent);
router.post('/login', SessionsController.SessionsLogin);
router.post('/logout', SessionsController.SessionLogout);

export default router;