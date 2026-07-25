import eventService from '../services/event.service.js';

const getaAllEventsController = {
    async list(_request, response, next) {
        try {
            const events = await eventService.getAllEventsService();
            return response.status(200).json({ status: 'success', total: events.length, payload: events });
        } catch (error) {
            return next(error);
        }
    }
}

export default  getaAllEventsController;