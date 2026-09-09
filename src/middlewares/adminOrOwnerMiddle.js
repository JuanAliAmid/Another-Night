import eventService from "../services/event.service.js";

const adminOrOwner = async (req, _res, next) => {

    const { id, eid } = req.params;

    const _id = id || eid;

    const eventFound = await eventService.getEventByIdService(_id);

    if (!eventFound) {
        const error = new Error('Evento no encontrado');
        error.status = 404;
        return next(error);
    };

    if (!eventFound.organizer.equals(req.user._id) && !(req.user.role === 'admin')) {
        const error = new Error('No tiene permisos');
        error.status = 403;
        return next(error);
    };

    req.event = eventFound;
    next();
};

export default {
    adminOrOwner
};