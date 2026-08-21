import eventsDao from "../dao/event.dao.js";

const getAllEvents = async () => {
    const events = await eventsDao.getAllEventsDao();
    return events
}

const createEvent = async (eventData) => {
    const newEvent = await eventsDao.createEventDao(eventData);
    return newEvent;
}

const getEventById = async (_id) => {
    const eventEncontrado = await eventsDao.getEventByIdDao(_id);
    return eventEncontrado;
}

const update = async (_id, data) => {
    const eventUpdate = await eventsDao.updateDao(_id, data);
    return eventUpdate;
}

export default {
    getAllEvents,
    createEvent,
    getEventById,
    update
}





