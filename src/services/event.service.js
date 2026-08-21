import eventRepository from "../repositories/event.repository.js";

const getAllEventsService = async () => {
    const events = await eventRepository.getAllEvents()
    return events;
}

const createEventService = async (eventData) => {
    const newEvent = await eventRepository.createEvent(eventData);
    return newEvent;
}

const getEventByIdService = async (_id) => {
    const eventEncontrado = await eventRepository.getEventById(_id);
    return eventEncontrado;
}

const updateService = async (_id, data) => {
    const eventUpdate = await eventRepository.update(_id, data);
    return eventUpdate;
}

export default {
    getAllEventsService,
    createEventService,
    getEventByIdService,
    updateService
}