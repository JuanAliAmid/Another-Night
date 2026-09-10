import passport from "passport";
import resDto from "../utils/res.dto.js";
import { env } from "../config/env.js";
import jwtLoginVerify from "../utils/jwt.js";


const sessionsStatus = async (_request, response, next) => {
    try {
        return response.status(200).json({ status: 'success', message: "Recurso sessions preparado. Sin logica de autenticacion en sessions" });
    } catch (error) {
        return next(error);
    }
};

const sessionLogout = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {

        if (err) return next(err);
        if (!user) {
            const error = new Error('No autenticado');
            error.status = 401;
            return next(error);
        }

        req.user = user;

        req.logout((err) => {
            if (err) return next(err);
            res.clearCookie('currentUser');
            res.status(200).json({ status: 'success', message: 'Logout exitoso' });
        });

    })(req, res, next);
}

const sessionsRegister = async (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, _info) => {

        if (err) {
            return next(err);
        }

        const resto = resDto.userDto(user.toObject());

        return res.status(201).json({ status: "success", payload: resto });
    })(req, res, next);
}

const sessionsLogin = async (req, res, next) => {
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

        res.cookie('currentUser', token, { maxAge: 3600000, httpOnly: true, sameSite: 'lax', secure: env.node_env === 'production' });

        return res.status(200).json({ status: "success", message: "Login correcto" });
    })(req, res, next);
}

const sessionsCurrent = async (req, res, _next) => {
    const { _id: id, email: email_user, role } = req.user;

    const payload = {
        id: id,
        email: email_user,
        role: role
    };
    return res.status(200).json({ status: 'success', payload: payload });
}

export default {
    sessionsStatus,
    sessionLogout,
    sessionsLogin,
    sessionsRegister,
    sessionsCurrent
};