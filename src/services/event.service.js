import eventRepository from "../repositories/event.repository.js";

const getAllEventsService = async () => {
    const events = await eventRepository.getAllEvents()
    return events;
}

export default {
    getAllEventsService
}