import eventService from '../services/event.service.js';
import resDto from '../dto/res.dto.js';

const getaAllEventsController = async (req, res, next) => {

   const { status, category, location, dateFrom, dateTo, page = 1, limit = 10, sort = '-date' } = req.query;
   const pages = Number(page);
   const limits = Number(limit);
   try {
      const events = await eventService.getAllEventsService({ status, category, location, dateFrom, dateTo, pages, limits, sort });
      const eventsDto = events.event.map(event => resDto.eventDto(event.toObject()))
      return res.status(200).json({ status: 'success', data: eventsDto, page: events.pages, limit: events.limits, total: events.totalEvents, totalPages: events.totalPages });
   } catch (error) {
      return next(error);
   };

};

const getEventByIdController = async (req, res, next) => {

   const { id } = req.params;

   try {
      const event = await eventService.getEventByIdService(id);
      return res.status(200).json({ status: 'success', payload: resDto.eventDto(event.toObject()) });
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
      return res.status(201).json({ status: "success", payload: resDto.eventDto(newEvent.toObject()) });
   } catch (error) {
      next(error);
   };
};

const updateEventController = async (req, res, next) => {

   const { title, description, date, capacity, price, category, location } = req.body;

   const { id } = req.params;

   try {
      const eventUpdate = await eventService.updateService(id, { title, description, date, capacity, price, category, location }, req.event.status);
      res.status(200).json({ status: 'success', payload: resDto.eventDto(eventUpdate.toObject()) });
   } catch (error) {
      next(error);
   };

};

const updateEventStatusController = async (req, res, next) => {

   const { status } = req.body;

   try {
      const eventUpdate = await eventService.updateStatusService(req.event.id, req.event.status, status);
      res.status(200).json({ status: 'success', payload: resDto.eventDto(eventUpdate.toObject()) });
   } catch (error) {
      next(error);
   };
};

export default {
   getaAllEventsController,
   createEventController,
   updateEventController,
   getEventByIdController,
   updateEventStatusController
};

