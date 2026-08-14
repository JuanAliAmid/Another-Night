import express from 'express';
import apiRouter from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { env } from '../src/config/env.js';
import './config/passport.config.js';
import passport from 'passport';


const app = express()

app.use(cookieParser())

app.use(express.json())

app.use(passport.initialize())

app.use('/api', apiRouter);

/*app.use(sessions({
    secret: env.secret,
    resave: false,
    saveUninitialized: false
}))*/

app.use((_request, response) => {
    response.status(404).json({ status: 'error', message: 'Ruta inexistente' });
})

app.use(errorHandler.error)

export default app;



