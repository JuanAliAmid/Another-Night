import express from 'express';
import apiRouter from './routes/index.js';
import sessionsRouter from '../src/routes/sessions.routes.js';

const app = express()

app.use(express.json())

app.use('/api', apiRouter);
app.use('/api/sessions', sessionsRouter);

app.use((_request, response) => {
    response.status(404).json({ status: 'error', message: 'Ruta inexistente' });
})

app.use((err, _req, res, _next) => {

    const status = err.status || 500;

    res.status(status).json({ status: 'error', message: err.message })

})

export default app;



