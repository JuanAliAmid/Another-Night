import ticketRepository from "../repositories/ticket.repository.js";
import eventService from "./event.service.js";

const getAllTicketsService = async () => {
    const tickets = await ticketRepository.getAllTickets()
    return tickets;
}

const createTicketService = async (ticketData) => {
    const event = await eventService.getEventByIdService(ticketData.event);
    if (!event) {
        const error = new Error('Evento inexistente');
        error.status = 404;
        throw error;
    }
    if (event.status !== 'published') {
        const error = new Error('No se puede crear un ticket con un evento no');
        error.status = 404;
        throw error;
    };
    if (ticketData.quantity <= 0 || !Number(ticketData.quantity)) {
        const error = new Error('Número de entradas incorrecto');
        error.status = 404;
        throw error;
    }
    if (event.status === 'cancelled' && event.capacity < ticketData.quantity) {
        const error = new Error('No hay cupos disponibles');
        error.status = 404;
        throw error;
    };

    const ticketCount = await viewEventTickest(ticketData.event);
    const actives = ticketCount.filter(tick => tick.status === 'active');
    const totalQuantity = actives.reduce((a, b) => a + b.quantity, 0);

    const cuposDisponibles = event.capacity - totalQuantity;

    if (cuposDisponibles < ticketData.quantity) {
        const error = new Error('No hay cupos disponibles');
        error.status = 404;
        throw error;
    };

    if (ticketCount.some(a => a.status === 'active' && a.user.equals(ticketData.user))) {
        const error = new Error('El usuario ya tiene un ticket activo para el evento');
        error.status = 404;
        throw error;
    }

    const newTicket = await ticketRepository.createTicket(ticketData);
    return newTicket;
};

const getMyTicketService = async (_id) => {
    const ticketFound = await ticketRepository.getMyTicket(_id);
    return ticketFound;
};

const viewEventTicketsService = async (eventId) => {
    const tickets = await ticketRepository.viewEventTickets(eventId);
    return tickets;
};

const cancelledTicketsService = async (_id, ticketData) => {
    const ticketCancelled = await ticketRepository.cancelledTickets(_id, ticketData);
    return ticketCancelled;
};

export default {
    getAllTicketsService,
    createTicketService,
    getMyTicketService,
    viewEventTicketsService,
    cancelledTicketsService
}