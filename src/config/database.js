import { connect } from "mongoose";
import { env } from './env.js';

const connectBD = async () => {
    try {
        await connect(env.mongo_url);
        console.info('Conexión exitosa');
    } catch (error) {
        console.info('Error al conectar', error.message);
    };
};
export default connectBD;