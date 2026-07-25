import eventsDao from "../dao/event.dao.js";

const getAllEvents = async () => {
    const events = await eventsDao.getAllEventsDao();
    return events
} 
export default {
    getAllEvents
}