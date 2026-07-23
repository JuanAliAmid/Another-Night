import EventModel from '../models/event.model.js';

const EventsController = {
    async list(_request, response, next) {
        try {
            return response.status(200).json({ status: 'success', total: 0, items: [] });
        } catch (error) {
            return next(error);
        }
    }
}

export default  EventsController;