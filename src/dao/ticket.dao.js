import ticketModel from "../models/ticket.model.js";

const getAllTicketsDao = async () => {
    const tickets = await ticketModel.find();
    return tickets;
};

const createTicketDao = async (ticketData) => {
    const newTicket = await ticketModel.create(ticketData);
    return newTicket;
};

const getMyTicketDao = async (_id) => {
    const ticketFound = await ticketModel.find({ user: _id });
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
    getAllTicketsDao,
    cancelledTicketsDao,
    viewEventTicketsDao,
    getMyTicketDao,
    createTicketDao
};