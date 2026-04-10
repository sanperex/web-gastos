import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI no está definido en las variables de entorno');
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(mongoUri);
}
