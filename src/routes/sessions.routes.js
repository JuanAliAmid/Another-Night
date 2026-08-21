import { Router } from "express";
import SessionsController from "../controllers/sessions.controller.js";
import passport from "passport";
import userDto from "../utils/user.dto.js";
import { env } from "../config/env.js";
import jwtLoginVerify from '../utils/jwt.js';
import roleAuth from "../middlewares/roleAuth.js";
import authMiddle from "../middlewares/authMiddle.js";
import usersDao from "../dao/users.dao.js";

const router = Router();


router.post('/login', (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {

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
        };

        const token = jwtLoginVerify.generateToken(payload);

        res.cookie('currentUser', token, { maxAge: 3600000, httpOnly: true, sameSite: 'lax', secure: env.node_env === 'production' })

        return res.status(200).json({ status: "success", message: "Login correcto" });
    })(req, res, next);
})

router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {

        if (err) {
            return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
        }

        switch (info?.message) {
            case 'Todos los campos son obligatorios':
                return res.status(400).json({ status: "error", message: 'Todos los campos son obligatorios' });
            case 'Ya existe un usuario registrado con ese email':
                return res.status(409).json({ status: "error", message: 'Ya existe un usuario registrado con ese email' });
            case 'Formato de email incorrecto':
                return res.status(400).json({ status: "error", message: 'Formato de email incorrecto' });
            case 'Formato de contraseña inválido':
                return res.status(422).json({ status: "error", message: 'Formato de contraseña inválido' });
        }

        if (!user) {
            return res.status(401).json({ status: "error", message: 'Credenciales inválidas' });
        }

        const resto = userDto(user.toObject());

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

router.get('/users', authMiddle.auth, roleAuth.rolesAuth('admin'), async (_req, res) => {
    try {
        const users = await usersDao.getAllUsersDao();
        res.status(200).json({ status: 'success', payload: users });

    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error de servidor' });
    }
});


router.get('/status', SessionsController.SessionsStatus);

export default router;




