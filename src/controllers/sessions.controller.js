
const SessionsController = {
    async status(_request, response, next) {
        try {
            return response.status(200).json({ status: 'success', message: "Recurso sessions preparado. Sin logica de autenticacion en sessions" });
        } catch (error) {
            return next(error);
        }
    }
}
export default SessionsController;