import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";
import passport from "passport";
import resDto from "../utils/user.dto.js";
import { env } from "../config/env.js";
import jwtLoginVerify from '../utils/jwt.js';
import authMiddle from "../middlewares/authMiddle.js";

const router = Router();


router.post('/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, _info) => {

        if (err) {
            return next(err);     
        }

        const { _id: id, email: email_user, role } = user;

        const payload = {
            id: id,
            email: email_user,
            role: role
        };

        const token = jwtLoginVerify.generateToken(payload);

        res.cookie('currentUser', token, { maxAge: 3600000, httpOnly: true, sameSite: 'lax', secure: env.node_env === 'production' })

        return res.status(200).json({ status: "success", message: "Login correcto" });
    })(req, res, next);
})

router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {

        if (err) {
            return next(err);
        }

        const resto = resDto(user.toObject());

        return res.status(201).json({ status: "success", payload: resto });
    })(req, res, next);
})

router.get('/current', authMiddle.auth, async (req, res) => {

    const { _id: id, email: email_user, role } = req.user;

    const payload = {
        id: id,
        email: email_user,
        role: role
    };
    return res.status(200).json({ status: 'success', payload: payload })

});

router.post('/logout', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {

        if (err) return next(err);
        if (!user) {
            return res.status(401).json({ status: 'error', message: 'No autenticado' });
        }

        req.user = user;

        req.logout((err) => {
            if (err) return next(err);
            res.clearCookie('currentUser');
            res.status(200).json({ status: 'success', message: 'Logout exitoso' });
        });

    })(req, res, next);
});

router.get('/status', SessionsController.SessionsStatus);

export default router;




