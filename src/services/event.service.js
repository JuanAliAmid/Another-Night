import eventRepository from "../repositories/event.repository.js";

const getAllEventsService = async ({ status, category, location, dateFrom, dateTo, pages, limits, sort }) => {

    const filtrado = {};

    if (status) {
        filtrado.status = status;
    };
    if (category) {
        filtrado.category = category;
    };
    if (location) {
        filtrado.location = location;
    };
    if (dateFrom) {
        filtrado.date = { ...filtrado.date, $gte: dateFrom };
    };
    if (dateTo) {
        filtrado.date = { ...filtrado.date, $lte: dateTo };
    };

    const skip = (pages - 1) * limits;

    const { event, totalEvents } = await eventRepository.getAllEvents({ filtrado, limits, skip, sort });
    const totalPages = Math.ceil(totalEvents / limits)
    return { event, pages, limits, totalEvents, totalPages };
}

const createEventService = async (eventData) => {
    const date = new Date(eventData.date)
    if (date < new Date()) {
        const error = new Error('No puede crear un evento con una fecha pasada');
        error.status = 400;
        throw error;
    };

    if (eventData.price < 0) {
        const error = new Error('Precio inválido');
        error.status = 400;
        throw error;
    } else if (eventData.capacity <= 0) {
        const error = new Error('Capacidad inválida');
        error.status = 400;
        throw error;
    };

    const newEvent = await eventRepository.createEvent(eventData);
    return newEvent;
}

const getEventByIdService = async (_id) => {
    const eventEncontrado = await eventRepository.getEventById(_id);
    return eventEncontrado;
}

const updateService = async (_id, data, currentStatus) => {
    if (currentStatus === 'cancelled') {
        const error = new Error('No se puede editar un evento cancelado');
        error.status = 409;
        throw error;
    };

    const eventUpdate = await eventRepository.update(_id, data);
    return eventUpdate;
}

const updateStatusService = async (id, currentStatus, newStatus) => {
    if (currentStatus === 'cancelled' || currentStatus === 'finished') {
        const error = new Error('No se puede modificar estado de un evento cancelado o finalizado');
        error.status = 400;
        throw error;
    }
    const statusUpdate = await eventRepository.update(id, { status: newStatus })
    return statusUpdate;
}

export default {
    getAllEventsService,
    createEventService,
    getEventByIdService,
    updateService,
    updateStatusService
}