const userDto = (user) => {
    const { password, ...resto } = user;
    return resto;
};
const ticketDto = (ticket) => {
    const { user, _id: id, ...Ticket } = ticket;
    if (!user || user.email === undefined) {
        return { id, user, ...Ticket };  // lo dejo tal cual, sin tocar nada
    }
    const { password, ...restoUser } = user;
    return { id, user: restoUser, ...Ticket };
};
const eventDto = (event) => {
    const { _id: id, ...resto } = event;
    return { id, ...resto };
};

export default {
    userDto,
    ticketDto,
    eventDto
};