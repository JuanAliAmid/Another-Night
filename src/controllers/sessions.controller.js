import { request, response } from "express";
import { isValidPassword } from "../utils/hash.js";
import userDto from "../utils/user.dto.js";
import userService from "../services/user.service.js";
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import jwtLoginVerify from '../utils/jwt.js';

//----------------------------STATUS----------------------------
const SessionsStatus = async (_request, response, next) => {

    try {
        return response.status(200).json({ status: 'success', message: "Recurso sessions preparado. Sin logica de autenticacion en sessions" });
    } catch (error) {
        return next(error);
    }

};

//----------------------------REGISTER----------------------------
const Sessionsregister = async (request, response) => {

    try {

        let { first_name, last_name, email, password } = request.body;
        password = String(password);

        if (!first_name || !last_name || !email || !password) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(400).json({ status: "error", message: 'Faltan campos obligatorios' });
        };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(400).json({ status: "error", message: 'Formato de email incorrecto' });
        }

        const existeEmail = await userService.findUserByEmail(email);

        if (existeEmail) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(409).json({ status: "error", message: 'El email ya está registrado' });
        };

        const newUser = await userService.createUser({ first_name, last_name, email, password });

        const resto = userDto(newUser.toObject());

        response.setHeader('Content-Type', 'application/json');
        response.status(201).json({ status: 'success', payload: resto });

    } catch (error) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(400).json({ status: 'error', message: `Error al crear usuario` });
    };
};

//----------------------------LOGIN----------------------------
const SessionsLogin = async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(400).json({ status: "error", message: 'Complete los campos "email" y "password"' });
    }

    try {
        const user = await userService.findUserByEmail(email);

        if (!user) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(401).json({ status: "error", message: 'Credenciales inválidas' });
        }

        const { _id: id, email: email_user, role } = user;

        const esValido = await isValidPassword(password, user.password);

        if (!esValido) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(401).json({ status: "error", message: 'Credenciales inválidas' });
        }

        const payload = {
            id: id,
            email: email_user,
            role: role
        }
        const token = jwtLoginVerify.generateToken(payload);

        response.cookie('currentUser', token, { maxAge: 3600000, httpOnly: true, sameSite: 'lax', secure: env.node_env === 'production' })
        response.setHeader('Content-Type', 'application/json');
        return response.status(200).json({ status: "success", message: "Login correcto" });

    } catch (error) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(400).json({ status: "error", message: "Error al iniciar sesión" });
    }
};

//----------------------------LOGOUT----------------------------
const SessionLogout = (request, response) => {
    response.clearCookie('currentUser');
    response.setHeader('Content-Type', 'application/json');
    return response.status(200).json({ status: 'success', payload: 'Logout exitoso' });
}

//----------------------------CURRENT----------------------------
const SessionsCurrent = (request, response) => {
    return response.status(200).json({ status: 'success', payload: request.user })
}

export default {
    SessionsStatus,
    Sessionsregister,
    SessionsLogin,
    SessionLogout,
    SessionsCurrent
};