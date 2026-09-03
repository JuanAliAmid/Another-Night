import ticketService from '../services/ticket.service.js';
import nodeMailerService from '../services/nodeMailer.service.js';

const createTicketController = async (req, res, next) => {
    const { _id, first_name, email } = req.user;
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

        const { ticket, event } = await ticketService.createTicketService({ user: _id, event: eid, quantity });

        const sendMail = await nodeMailerService.sendTicketConfirmationEmail({ to: email, userName: first_name, eventTitle: event.title, ticketCode: ticket.code });

        return res.status(201).json({ status: 'success', payload: ticket });
    } catch (error) {
        return next(error);
    }
};

const getMyTicketController = async (req, res, next) => {
    const { _id } = req.user;
    try {

        const ticket = await ticketService.getMyTicketService(_id);

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

        const tickets = await ticketService.viewEventTicketsService(eventId);

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
    const { _id, role } = req.user;
    try {

        const ticketCancelled = await ticketService.cancelledTicketsService(tid, _id, role, { status: 'cancelled', cancelledAt: new Date() });

        if (!ticketCancelled) {
            return res.status(404).json({ status: 'error', message: 'Ticket inexistente' });
        };

        return res.status(200).json({ status: 'success', payload: ticketCancelled });
    } catch (error) {
        return next(error);
    }
};

export default {
    createTicketController,
    getMyTicketController,
    viewEventTicketsController,
    cancelledTicketsController
};