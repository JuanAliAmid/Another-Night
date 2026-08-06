import { config } from "dotenv";

config();

const required = ['PORT', 'MONGO_URL', 'JWT_SECRET'];

for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Falta la variable de entorno obligatoria: ${key}`)
    }
}

export const env = {
    port: Number(process.env.PORT),
    mongo_url: process.env.MONGO_URL,
    jwt_secret: process.env.JWT_SECRET
}