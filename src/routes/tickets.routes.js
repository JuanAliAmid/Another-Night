import { Router } from "express";
import TicketsController from '../controllers/tickets.controller.js';
import authMiddle from "../middlewares/authMiddle.js";
import ticketsController from "../controllers/tickets.controller.js";

const router = Router();

router.get('/my-tickets', authMiddle.auth, ticketsController.getMyTicketController);
router.patch('/:tid/cancel', authMiddle.auth, ticketsController.cancelledTicketsController);

export default router;