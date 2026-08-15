import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";
import authMiddle from "../middlewares/auth.js";
import passport from "passport";
import userDto from "../utils/user.dto.js";
import { env } from "../config/env.js";
import jwtLoginVerify from '../utils/jwt.js';

const router = Router();


router.post('/login', (req, res, next) => {
    passport.authenticate('login', (err, user, info) => {

        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }

        switch (info?.message) {
            case 'Complete los campos "email" y "password"':
                return res.status(400).json({ status: "error", message: 'Complete los campos "email" y "password"' });
            case 'Credenciales inválidas':
                return res.status(401).json({ status: "error", message: 'Credenciales inválidas' });
        }

        if (!user) {
            return res.status(401).json({ status: "error", message: 'Credenciales inválidas' });
        }

        const { _id: id, email: email_user, role } = user;

        const payload = {
            id: id,
            email: email_user,
            role: role
        }

        const token = jwtLoginVerify.generateToken(payload);

        res.cookie('currentUser', token, { maxAge: 3600000, httpOnly: true, sameSite: 'lax', secure: env.node_env === 'production' })

        return res.status(200).json({ status: "success", message: "Login correcto" });
    })(req, res, next);
})

router.post('/register', (req, res, next) => {
    passport.authenticate('register', (err, user, info) => {

        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }

        switch (info?.message) {
            case 'Todos los campos son obligatorios':
                return res.status(400).json({ status: "error", message: 'Todos los campos son obligatorios' });
            case 'Ya existe un usuario registrado con ese email':
                return res.status(409).json({ status: "error", message: 'Ya existe un usuario registrado con ese email' });
            case 'Formato de email incorrecto':
                return res.status(400).json({ status: "error", message: 'Formato de email incorrecto' })
            case 'Formato de contraseña inválido':
                return res.status(422).json({ status: "error", message: 'Formato de contraseña inválido' })
        }

        if (!user) {
            return res.status(401).json({ status: "error", message: 'Credenciales inválidas' });
        }

        const resto = userDto(user.toObject());

        return res.status(201).json({ status: "success", payload: resto });
    })(req, res, next);
})


router.get('/current', (req, res, next) => {
    passport.authenticate("jwt", (err, user, info) => {

        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }

        if (!user) {
            return res.status(401).json({ status: "error", message: 'Credenciales inválidas' });
        }

        const { _id: id, email: email_user, role } = user;

        const payload = {
            id: id,
            email: email_user,
            role: role
        }
        return res.status(200).json({ status: 'success', payload: payload })

    })(req, res, next);
});

router.post('/logout', authMiddle.auth, SessionsController.SessionLogout);
router.get('/status', SessionsController.SessionsStatus);

export default router;




