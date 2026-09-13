import ticketService from '../services/ticket.service.js';
import nodeMailerService from '../services/nodeMailer.service.js';
import resDto from '../dto/res.dto.js';

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
            error.status = 400;
            throw error;
        };

        const { ticket, event } = await ticketService.createTicketService({ user: _id, event: eid, quantity });

        await nodeMailerService.sendTicketConfirmationEmail({ to: email, userName: first_name, eventTitle: event.title, ticketCode: ticket.reservationCode });

        return res.status(201).json({ status: 'success', payload: resDto.ticketDto(ticket.toObject()) });
    } catch (error) {
        return next(error);
    };
};

const getMyTicketController = async (req, res, next) => {
    const { _id } = req.user;

    try {

        const ticket = await ticketService.getMyTicketService(_id);
        const ticketsDto = ticket.map(b => resDto.ticketDto(b.toObject()));

        return res.status(200).json({ status: 'success', payload: ticketsDto });
    } catch (error) {
        return next(error);
    };
};

const viewEventTicketsController = async (req, res, next) => {
    const { _id: eventId } = req.event;

    try {

        const tickets = await ticketService.viewEventTicketsService(eventId);
        const restoTickets = tickets.map(ticket => resDto.ticketDto(ticket.toObject()));

        return res.status(200).json({ status: 'success', payload: restoTickets });
    } catch (error) {
        return next(error);
    };
};

const cancelledTicketsController = async (req, res, next) => {
    const { tid } = req.params;
    const { _id, role, first_name, email } = req.user;

    try {

        const { ticketCancelled, event } = await ticketService.cancelledTicketsService(tid, _id, role, { status: 'cancelled', cancelledAt: new Date() });
        await nodeMailerService.sendTicketCancellationEmail({ to: email, userName: first_name, eventTitle: event.title, ticketCode: ticketCancelled.reservationCode });

        return res.status(200).json({ status: 'success', payload: resDto.ticketDto(ticketCancelled.toObject()) });
    } catch (error) {
        return next(error);
    };
};

export default {
    createTicketController,
    getMyTicketController,
    viewEventTicketsController,
    cancelledTicketsController
};