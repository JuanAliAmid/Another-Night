import { connect } from "mongoose";
import { env } from './env.js';

const connectBD = async () => {
    try {
        await connect(env.mongo_url);
        console.log('Conexión exitosa');
    } catch (error) {
        console.error('Error al conectar', error.message);
    }
}
export default connectBD;