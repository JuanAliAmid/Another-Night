import { Router } from "express";
import EventsController from '../controllers/events.controller.js';
import roleAuth from "../middlewares/roleAuth.js";
import authMiddle from "../middlewares/authMiddle.js";

const router = Router();

router.get('/', EventsController.getaAllEventsController.list);

router.post('/', authMiddle.auth, roleAuth.rolesAuth('organizer', 'admin'), EventsController.createEventController);

router.patch('/:id', authMiddle.auth, roleAuth.rolesAuth('organizer', 'admin'), EventsController.updateEventController);

export default router;