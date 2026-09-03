import { env } from './config/env.js';
import app from './app.js';
import connectBD from './config/database.js';

connectBD()

const PORT = env.port;
app.listen(PORT, () => {
   console.log(`Server corriendo en http://localhost:${PORT}`);
});