import ticketDao from "../dao/ticket.dao.js";

const getAllTickets = async () => {
    const tickets = await ticketDao.getAllTicketsDao();
    return tickets
}

const createTicket = async (ticketData) => {
    const newTicket = await ticketDao.createTicketDao(ticketData);
    return newTicket;
};

const getMyTicket = async (_id) => {
    const ticketFound = await ticketDao.getMyTicketDao(_id);
    return ticketFound;
};

const viewEventTickets= async (eventId) => {
    const tickets = await ticketDao.viewEventTickestDao(eventId);
    return tickets;
};

const cancelledTickets = async (_id, ticketData) => {
    const ticketCancelled = await ticketDao.cancelledTicketsDao(_id, ticketData);
    return ticketCancelled;
};


export default {
    getAllTickets,
    cancelledTickets,
    viewEventTickets,
    getMyTicket,
    createTicket
}