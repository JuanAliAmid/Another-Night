import TicketsModel from '../models/ticket.model.js';

const TicketsController = {
    async list(_request, response, next) {
        try {
            return response.status(200).json({ status: 'success', total: 0, items: [] });
        } catch (error) {
            return next(error);
        }
    },

}
export default TicketsController;