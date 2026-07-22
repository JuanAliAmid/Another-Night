import { connect } from "mongoose";
import { env } from './env.js';

const connectBD = async () => {
    try {
        await connect(env.mongodb_uri);
        console.log('Conexión exitosa');
    } catch (error) {
        console.error('Error al conectar', error.message);
    }
}
export default connectBD;