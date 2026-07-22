import express from 'express';
import apiRouter from './routes/index.js';

const app = express()

app.use(express.json())

app.use('/api', apiRouter);

app.use((_request, response) => {
  response.status(404).json({status: 'error', message: 'Ruta inexistente'});
})


export default app;



