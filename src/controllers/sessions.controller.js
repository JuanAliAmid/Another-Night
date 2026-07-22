import SessionsModel from '../models/category.model.js';

const SessionsController = {
    async status(_request, response, next) {
        try {
            return response.status(200).json({ status: 'success', message: "Recurso sessions preparado. Sin logica de autenticacion en sessions" });
        } catch (error) {
            return next(error);
        }
    },

    async getById(request, response, next) {
        try {
            const { id } = request.params;
            const encontrado = await SessionsMondel.findById(id)
            if (!encontrado) return response.status(404).json({ status: 'error', message: 'no encontrado' });
            return response.status(200).json({ status: 'success', item: encontrado });
        } catch (error) {
            return next(error);
        }
    }

}
export default SessionsController;