import { config } from "dotenv";

config();

const required = ['PORT', 'MONGO_URL', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'NODE_ENV'];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Falta la variable de entorno obligatoria: ${key}`)
    }
}

export const env = {
    port: Number(process.env.PORT),
    mongo_url: process.env.MONGO_URL,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires_in: process.env.JWT_EXPIRES_IN,
    node_env: process.env.NODE_ENV
}