import { request, response } from "express";
import jwt from "jsonwebtoken";
import { env } from '../config/env.js';


const auth = (request, response, next) => {

    if (!request.cookies.cookietoken) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(401).json({ error: `No hay usuarios autenticados` });
    }

    let token = request.cookies.cookietoken;

    try {
        let payload = jwt.verify(token, env.jwt_secret);
        request.user = payload;
    } catch (error) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(401).json({ error: `Error de token` });
    }

    next();
}

export default {
    auth
}