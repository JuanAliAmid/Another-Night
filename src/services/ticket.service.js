import ticketRepository from "../repositories/ticket.repository.js";
import eventService from "./event.service.js";

const createTicketService = async (ticketData) => {
    const event = await eventService.getEventByIdService(ticketData.event);
    if (!event) {
        const error = new Error('Evento inexistente');
        error.status = 404;
        throw error;
    }
    if (event.status !== 'published') {
        const error = new Error('No se puede crear un ticket con un evento cancelado o finalizado');
        error.status = 409;
        throw error;
    };
    if (ticketData.quantity <= 0 || !Number(ticketData.quantity)) {
        const error = new Error('Número de entradas incorrecto');
        error.status = 400;
        throw error;
    }

    const ticketCount = await ticketRepository.viewEventTickets(ticketData.event);
    const actives = ticketCount.filter(tick => tick.status === 'confirmed');
    const totalQuantity = actives.reduce((a, b) => a + b.quantity, 0);

    const cuposDisponibles = event.capacity - totalQuantity;

    if (cuposDisponibles < ticketData.quantity) {
        const error = new Error('No hay cupos disponibles');
        error.status = 409;
        throw error;
    };

    if (ticketCount.some(a => a.status === 'confirmed' && a.user.equals(ticketData.user))) {
        const error = new Error('El usuario ya tiene un ticket activo para el evento');
        error.status = 409;
        throw error;
    }

    ticketData.code = Math.random().toString(36).substring(2, 10);

    const newTicket = await ticketRepository.createTicket(ticketData);
    return { ticket: newTicket, event };
};

const getMyTicketService = async (_id) => {
    const ticketFound = await ticketRepository.getMyTicket(_id);
    return ticketFound;
};

const viewEventTicketsService = async (eventId) => {
    const tickets = await ticketRepository.viewEventTickets(eventId);
    return tickets;
};

const cancelledTicketsService = async (ticketId, userId, role, ticketData) => {

    const ticket = await ticketRepository.getTicketById(ticketId);

    if (!ticket) {
        const error = new Error('Ticket inexistente');
        error.status = 404;
        throw error;
    } else if (!ticket.user.equals(userId) && role !== 'admin') {
        const error = new Error('No tiene permisos');
        error.status = 403;
        throw error;
    } else if (ticket.status === 'cancelled') {
        const error = new Error('El ticket ya se encuentra cancelado');
        error.status = 409;
        throw error;
    };


    const ticketCancelled = await ticketRepository.cancelledTickets(ticketId, ticketData);
    return ticketCancelled;
};

export default {
    createTicketService,
    getMyTicketService,
    viewEventTicketsService,
    cancelledTicketsService
}