import { env } from "../config/env.js";
import jwt from 'jsonwebtoken';

const generateToken = (payload) => {

    let token = jwt.sign(payload, env.jwt_secret, { expiresIn: env.jwt_expires_in });

    return token;
}
const verifyToken = (token) => {

    let tokenVerificado = jwt.verify(token, env.jwt_secret);

    return tokenVerificado;
}

export default {
    generateToken,
    verifyToken
}