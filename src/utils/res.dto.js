const userDto = (user) => {
    const { password, ...resto } = user;
    return resto;
};
const ticketDto = (ticket) => {
    const { user, ...Ticket } = ticket;
    const { password, ...restoUser } = user || {};
    return { user: restoUser, ...Ticket };
};
const eventDto = (event) => {
    const { organizer, ...resto } = event;
    return resto;
};

export default {
    userDto,
    ticketDto,
    eventDto
};