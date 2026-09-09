const userDto = (user) => {
    const { password, ...resto } = user;
    return resto;
};
const ticketDto = (ticket) => {
    const { password, ...resto } = ticket;
    return resto;
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