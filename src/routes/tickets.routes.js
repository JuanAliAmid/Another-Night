import { Router } from "express";
import TicketsController from '../controllers/tickets.controller.js';

const router = Router();

router.get('/', TicketsController.getAllTicketsController);

export default router;