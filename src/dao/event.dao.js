import EventModel from "../models/event.model.js";

const getAllEventsDao = async (data) => {
    const {limits, skip, filtrado, sort} = data;
    const event =  await EventModel.find(filtrado).sort(sort).skip(skip).limit(limits);
    const totalEvents = await EventModel.countDocuments(filtrado)
    return {event, totalEvents};
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