import { Router } from "express";
import EventsController from '../controllers/events.controller.js';
import roleAuth from "../middlewares/roleAuth.js";
import authMiddle from "../middlewares/authMiddle.js";
import adminOrOwnerMiddle from "../middlewares/adminOrOwnerMiddle.js";
import eventsController from "../controllers/events.controller.js";

const router = Router();

router.get('/', EventsController.getaAllEventsController);

router.get('/:id', EventsController.getEventByIdController)

router.post('/', authMiddle.auth, roleAuth.rolesAuth('organizer', 'admin'), EventsController.createEventController);

router.patch('/:id/status', authMiddle.auth, adminOrOwnerMiddle.adminOrOwner, EventsController.updateEventStatusController);

router.put('/:id', authMiddle.auth, adminOrOwnerMiddle.adminOrOwner, eventsController.updateEventController);

export default router;