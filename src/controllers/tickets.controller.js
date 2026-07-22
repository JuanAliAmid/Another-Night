import TicketsModel from '../models/ticket.model.js';

const TicketsController = {
    async list(_request, response, next) {
        try {
            return response.status(200).json({ status: 'success', total: 0, items: [] });
        } catch (error) {
            return next(error);
        }
    },

    async getById(request, response, next) {
        try {
            const { id } = request.params;
            const encontrado = await TicketsMondel.findById(id)
            if (!encontrado) return response.status(404).json({ status: 'error', message: 'no encontrado' });
            return response.status(200).json({ status: 'success', item: encontrado });
        } catch (error) {
            return next(error);
        }
    }

}
export default TicketsController;