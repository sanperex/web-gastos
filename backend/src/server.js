import dotenv from 'dotenv';
import { app } from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const port = Number(process.env.PORT || 4000);

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Backend escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el backend:', error.message);
    process.exit(1);
  }
}

startServer();
