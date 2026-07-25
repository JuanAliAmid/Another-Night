import ticketDao from "../dao/ticket.dao.js";

const getAllTickets = async () => {
    const tickets = await ticketDao.getAllTicketsDao();
    return tickets
} 
export default {
    getAllTickets
}