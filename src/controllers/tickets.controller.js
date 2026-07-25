import ticketService from '../services/ticket.service.js';

const getAllTicketsController = {
    async list(_request, response, next) {
        try {
            const tickets = await ticketService.getAllTicketsService()
            return response.status(200).json({ status: 'success', total: tickets.length, payload: tickets });
        } catch (error) {
            return next(error);
        }
    },

}
export default getAllTicketsController;