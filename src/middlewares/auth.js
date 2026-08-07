import jwtLoginVerify from '../utils/jwt.js';

const auth = (request, response, next) => {

    if (!request.cookies.currentUser) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(401).json({ status: 'error', message: `No autenticado` });
    }

    let token = request.cookies.currentUser;

    try {
        let payload = jwtLoginVerify.verifyToken(token);
        request.user = payload;
    } catch (error) {
        response.setHeader('Content-Type', 'application/json');
        return response.status(401).json({ status: 'error', message: `No autenticado` });
    }

    next();
}

export default {
    auth
}