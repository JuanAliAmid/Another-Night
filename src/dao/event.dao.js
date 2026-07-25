import EventModel from "../models/event.model.js";

const getAllEventsDao = async () => {
    const event = await EventModel.find();
    return event;
}

export default {
    getAllEventsDao
}