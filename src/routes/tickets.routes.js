import { Router } from "express";
import TicketsController from '../controllers/tickets.controller.js';

const router = Router();

router.get('/', TicketsController.list);

export default router;