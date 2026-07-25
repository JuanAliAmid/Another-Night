import ticketRepository from "../repositories/ticket.repository.js";

const getAllTicketsService = async () => {
    const tickets = await ticketRepository.getAllTickets()
    return tickets;
}

export default {
    getAllTicketsService
}