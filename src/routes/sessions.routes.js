import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";
import authMiddle from "../middlewares/auth.js";
import passport from "passport";
const router = Router();

router.post('/register', passport.authenticate("register", {session: false}), SessionsController.Sessionsregister);
router.post('/login', passport.authenticate("login", {session: false}), SessionsController.SessionsLogin);
router.get('/current', passport.authenticate("jwt", {session: false}), SessionsController.SessionsCurrent);
router.post('/logout', authMiddle.auth, SessionsController.SessionLogout);
router.get('/status', SessionsController.SessionsStatus);

export default router;