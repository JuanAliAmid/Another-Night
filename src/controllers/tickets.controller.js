import ticketService from '../services/ticket.service.js';
import nodeMailerService from '../services/nodeMailer.service.js';
import resDto from '../utils/res.dto.js';

const createTicketController = async (req, res, next) => {
    const { _id, first_name, email } = req.user;
    const { eid } = req.params;
    const { quantity } = req.body;

    try {

        if (!_id) {
            const error = new Error('Usuario inexistente');
            error.status = 404;
            throw error;
        } else if (!eid) {
            const error = new Error('Evento inexistente');
            error.status = 404;
            throw error;
        } else if (!quantity) {
            const error = new Error('Debe ingresar cantidad');
            error.status = 404;
            throw error;
        };

        const { ticket, event } = await ticketService.createTicketService({ user: _id, event: eid, quantity });

        await nodeMailerService.sendTicketConfirmationEmail({ to: email, userName: first_name, eventTitle: event.title, ticketCode: ticket.code });

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
            const error = new Error('No se encontró el ticket buscado');
            error.status = 404;
            throw error;
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
            const error = new Error('No hay tickets registrados en este evento');
            error.status = 404;
            throw error;
        }

        const restoTickets = tickets.map(ticket => resDto.ticketDto(ticket.toObject()));

        return res.status(200).json({ status: 'success', payload: restoTickets });
    } catch (error) {
        return next(error);
    }
};

const cancelledTicketsController = async (req, res, next) => {
    const { tid } = req.params;
    const { _id, role, first_name, email } = req.user;

    try {

        const { ticketCancelled, event } = await ticketService.cancelledTicketsService(tid, _id, role, { status: 'cancelled', cancelledAt: new Date() });

        if (!ticketCancelled) {
            const error = new Error('Ticket inexistente');
            error.status = 404;
            throw error;
        };

        await nodeMailerService.sendTicketCancellationEmail({ to: email, userName: first_name, eventTitle: event.title, ticketCode: ticketCancelled.code });


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