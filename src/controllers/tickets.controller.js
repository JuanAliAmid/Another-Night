import ticketService from '../services/ticket.service.js';

const getAllTicketsController = async (_request, response, next) => {
    try {
        const tickets = await ticketService.getAllTicketsService()
        return response.status(200).json({ status: 'success', total: tickets.length, payload: tickets });
    } catch (error) {
        return next(error);
    }
}

const createTicketController = async (req, res, next) => {
    const { _id } = req.user;
    const { eid } = req.params;
    const { quantity } = req.body;

    try {

        if (!_id) {
            return res.status(404).json({ status: 'error', message: 'Usuario inexistente' });
        } else if (!eid) {
            return res.status(404).json({ status: 'error', message: 'Evento inexistente' })
        } else if (!quantity) {
            return res.status(404).json({ status: 'error', message: 'Debe ingresar cantidad' })
        };

        const newTicket = await ticketService.createTicket({ user: _id, event: eid, quantity });

        return res.status(201).json({ status: 'success', payload: newTicket });
    } catch (error) {
        return next(error);
    }
};

const getMyTicketController = async (req, res, next) => {
    const { _id } = req.user;
    try {

        const ticket = await ticketService.getMyTicket(_id);

        if (!ticket || ticket.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No se encontró el ticket buscado' });
        };

        return res.status(200).json({ status: 'success', payload: ticket });
    } catch (error) {
        return next(error);
    }
};

const viewEventTicketsController = async (req, res, next) => {
    const { _id: eventId } = req.event;
    try {

        const tickets = await ticketService.viewEventTickest(eventId);

        if (!tickets || tickets.length === 0) {
            return res.status(404).json({ status: 'error', message: 'No hay tickets registrados en este evento' });
        }

        return res.status(200).json({ status: 'success', payload: tickets });
    } catch (error) {
        return next(error);
    }
};

const cancelledTicketsController = async (req, res, next) => {
    const { tid } = req.params;
    try {

        const ticketCancelled = await ticketService.cancelledTickets(tid, { status: 'cancelled' });

        if (!ticketCancelled) {
            return res.status(404).json({ status: 'error', message: 'Ticket inexistente' });
        };

        return res.status(200).json({ status: 'success', payload: ticketCancelled });
    } catch (error) {
        return next(error);
    }
};

export default {
    getAllTicketsController,
    createTicketController,
    getMyTicketController,
    viewEventTicketsController,
    cancelledTicketsController
};