import { Router } from "express";
import eventsRouter from './events.routes.js';
import ticketsRouter from './tickets.routes.js';
import sessionsRouter from './sessions.routes.js';
import usersRouter from './users.routes.js';
import express from 'express';

const router = Router();

router.get('/health', (request, response) => {
    response.status(200).json({ status: "ok", message: "Servidor activo" });
})
router.use('/users', usersRouter);
router.use('/sessions', sessionsRouter);
router.use('/events', eventsRouter);
router.use('/tickets', ticketsRouter);

export default router;