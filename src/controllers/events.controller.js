import eventService from '../services/event.service.js';

const getaAllEventsController = async (_req, res, next) => {

    try {
        const events = await eventService.getAllEventsService();
        return res.status(200).json({ status: 'success', total: events.length, payload: events });
    } catch (error) {
        return next(error);
    };

}

const createEventController = async (req, res) => {
    const { title, description, starts_at } = req.body;
    const { _id: organizer } = req.user;
    try {
        const eventData = { title, description, starts_at, organizer };
        const newEvent = await eventService.createEventService(eventData);
        return res.status(201).json({ status: "success", payload: newEvent });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error del servidor ' });
    };
}

const updateEventController = async (req, res) => {
    const { title, description, starts_at } = req.body;

    const { id } = req.params;

    try {
        const eventExist = await eventService.getEventByIdService(id);
        if (!eventExist) {
            return res.status(404).json({ status: 'error', message: 'Evento no encontrado' })
        }
        if (req.user.role === 'organizer' && req.user._id.toString() !== eventExist.organizer.toString()) {
            return res.status(403).json({ status: 'error', message: 'Falta de permisos' });
        }
        const eventUpdate = await eventService.updateService(id, { title, description, starts_at });
        res.status(200).json({ status: 'success', payload: eventUpdate });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Error del servidor' });
    };

}

export default {
    getaAllEventsController,
    createEventController,
    updateEventController
};