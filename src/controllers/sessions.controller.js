import { request, response } from "express";
import { isValidPassword } from "../utils/hash.js";
import userDto from "../utils/user.dto.js";
import userService from "../services/user.service.js";

const SessionsStatus = async (_request, response, next) => { //STATUS

    try {
        return response.status(200).json({ status: 'success', message: "Recurso sessions preparado. Sin logica de autenticacion en sessions" });
    } catch (error) {
        return next(error);
    }

};

const Sessionsregister = async (request, response) => { //REGISTER

    try {

        let { first_name, last_name, email, password } = request.body;
        password = String(password);

        if (!first_name || !last_name || !email || !password) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(400).json({ error: "error", message: 'Faltan campos obligatorios' });
        };
 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(400).json({ error: "error", message: 'Formato de email incorrecto' });
        }

        const existeEmail = await userService.findUserByEmail(email);

        if (existeEmail) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(409).json({ error: "error", message: 'El email ya está registrado' });
        };

        const newUser = await userService.createUser({ first_name, last_name, email, password });

        const resto = userDto(newUser.toObject());

        response.setHeader('Content-Type', 'application/json');
        response.status(201).json({ message: 'Registro exitoso', resto });

    } catch (error) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(400).json({ error: error.message });
    };

};

const SessionsLogin = async (request, response) => { //LOGIN
    const { email, password } = request.body;

    if (!email || !password) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(400).json({ error: "error", message: 'Complete los campos "email" y "password"' });
    }

    try {
        const user = await userService.findUserByEmail(email);

        if (!user) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(401).json({ error: "error", message: 'Credenciales inválidas' });
        }

        const esValido = await isValidPassword(password, user.password);

        if (!esValido) {
            response.setHeader('Content-Type', 'application/json');
            return response.status(401).json({ error: "error", message: 'Credenciales inválidas' });
        }

        const resto = userDto(user);

        response.setHeader('Content-Type', 'application/json');
        return response.status(200).json({ message: 'Login exitoso', resto });

    } catch (error) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(400).json({ error: error.message });
    }

};

export default {
    SessionsStatus,
    Sessionsregister,
    SessionsLogin
};