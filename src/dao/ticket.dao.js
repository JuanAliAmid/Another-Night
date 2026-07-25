import ticketModel from "../models/ticket.model.js";

const getAllTicketsDao = async () => {
    const tickets = await ticketModel.find();
    return tickets;
}

export default {
    getAllTicketsDao
}