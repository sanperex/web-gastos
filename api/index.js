import { app } from '../backend/src/app.js';
import { connectDB } from '../backend/src/config/db.js';

export default async function handler(req, res) {
  try {
    // Intentar conectar a la base de datos (con lógica de reutilización en db.js)
    await connectDB();
    
    // Dejar que Express maneje la petición
    return app(req, res);
  } catch (error) {
    console.error('Error en la función de Vercel:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
