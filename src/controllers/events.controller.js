import eventService from '../services/event.service.js';

const getaAllEventsController = async (req, res, next) => {

   const { status, category, location, dateFrom, dateTo, page = 1, limit = 10, sort = '-date' } = req.query;
   const pages = Number(page);
   const limits = Number(limit);
   try {
      const events = await eventService.getAllEventsService({ status, category, location, dateFrom, dateTo, pages, limits, sort });
      return res.status(200).json({ status: 'success', data: events.event, page: events.pages, limit: events.limits, total: events.totalEvents, totalPages: events.totalPages });
   } catch (error) {
      return next(error);
   };

};

const getEventByIdController = async (req, res, next) => {

   const { id } = req.params;

   try {
      const event = await eventService.getEventByIdService(id);

      if (!event) {
         return res.status(404).json({ message: 'Evento no encontrado' });
      }

      return res.status(200).json({ status: 'success', payload: event });
   } catch (error) {
      return next(error);
   };
};

const createEventController = async (req, res, next) => {

   const { title, description, date, capacity, price, category, location } = req.body;
   const { _id: organizer } = req.user;

   try {
      const eventData = { title, description, date, organizer, capacity, price, category, location };
      const newEvent = await eventService.createEventService(eventData);
      return res.status(201).json({ status: "success", payload: newEvent });
   } catch (error) {
      next(error);
   };
};

const updateEventController = async (req, res, next) => {

   const { title, description, date, capacity, price, category, location } = req.body;

   const { id } = req.params;

   try {
      const eventExist = await eventService.getEventByIdService(id);

      if (!eventExist) {
         return res.status(404).json({ status: 'error', message: 'Evento no encontrado' })
      }

      if (req.user.role === 'organizer' && req.user._id.toString() !== eventExist.organizer.toString()) {
         return res.status(403).json({ status: 'error', message: 'Falta de permisos' });
      }

      const eventUpdate = await eventService.updateService(id, { title, description, date, capacity, price, category, location }, req.event.status);
      res.status(200).json({ status: 'success', payload: eventUpdate });
   } catch (error) {
      next(error);
   };

};

const updateEventStatusController = async (req, res, next) => {

   const { status } = req.body;

   try {

      if (status !== 'draft' && status !== 'published' && status !== 'cancelled' && status !== 'finished') {
         return res.status(400).json({ message: 'Error de estado' });
      }

      const eventUpdate = await eventService.updateStatusService(req.event.id, req.event.status, status);
      res.status(200).json({ status: 'success', payload: eventUpdate });
   } catch (error) {
      next(error);
   }
}

export default {
   getaAllEventsController,
   createEventController,
   updateEventController,
   getEventByIdController,
   updateEventStatusController
};

