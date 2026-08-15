
//----------------------------STATUS----------------------------
const SessionsStatus = async (_request, response, next) => {
    try {
        return response.status(200).json({ status: 'success', message: "Recurso sessions preparado. Sin logica de autenticacion en sessions" });
    } catch (error) {
        return next(error);
    }
};

//----------------------------LOGOUT----------------------------
const SessionLogout = (request, response) => {
    response.clearCookie('currentUser');
    response.setHeader('Content-Type', 'application/json');
    return response.status(200).json({ status: 'success', payload: 'Logout exitoso' });
}


export default {
    SessionsStatus,
    SessionLogout,
};