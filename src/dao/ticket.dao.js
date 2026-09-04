import ticketModel from "../models/ticket.model.js";

const getTicketByIdDao = async (ticketId) => {
    const ticket = await ticketModel.findOne({_id: ticketId});
    return ticket;
};

const createTicketDao = async (ticketData) => {
    const newTicket = await ticketModel.create(ticketData);
    return newTicket;
};

const getMyTicketDao = async (_id) => {
    const ticketFound = await ticketModel.find({ user: _id }).populate('event', 'title date location');
    return ticketFound;
};

const viewEventTicketsDao = async (eventId) => {
    const tickets = await ticketModel.find({ event: eventId });
    return tickets;
};

const cancelledTicketsDao = async (_id, ticketData) => {
    const ticketCancelled = await ticketModel.findByIdAndUpdate(_id, ticketData, { new: true });
    return ticketCancelled;
};

export default {
    getTicketByIdDao,
    cancelledTicketsDao,
    viewEventTicketsDao,
    getMyTicketDao,
    createTicketDao
};