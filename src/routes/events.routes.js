import { Router } from "express";
import EventsController from '../controllers/events.controller.js';

const router = Router();

router.get('/', EventsController.list);

export default router;