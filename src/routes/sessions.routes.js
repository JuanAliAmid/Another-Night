import { Router } from "express";
import sessionsController from "../controllers/sessions.controller.js";
import authMiddle from "../middlewares/authMiddle.js";

const router = Router();


router.post('/login', sessionsController.sessionsLogin);

router.post('/register', sessionsController.sessionsRegister)

router.get('/current', authMiddle.auth, sessionsController.sessionsCurrent);

router.post('/logout', sessionsController.sessionLogout);

router.get('/status', sessionsController.sessionsStatus);

export default router;




