import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    monto: {
      type: Number,
      required: true,
      min: 0,
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
    },
    fecha: {
      type: String,
      required: true,
      trim: true,
    },
    metodoPago: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = mongoose.model('Expense', expenseSchema);
