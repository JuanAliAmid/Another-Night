import eventsController from "../controllers/events.controller.js";
import EventModel from "../models/event.model.js";

const getAllEventsDao = async () => {
    const event = await EventModel.find();
    return event;
}

const createEventDao = async (eventData) => {
    const newEvent = await EventModel.create(eventData);
    return newEvent;
}

const getEventByIdDao = async (_id) => {
    const eventEncontrado = await EventModel.findById(_id)
    return eventEncontrado;
}

const updateDao = async (_id, data) => {
    const eventUpdate = await EventModel.findByIdAndUpdate(_id, data, { new: true });
    return eventUpdate;
}

export default {
    getAllEventsDao,
    createEventDao,
    getEventByIdDao,
    updateDao
}