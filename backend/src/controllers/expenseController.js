import mongoose from 'mongoose';
import { Expense } from '../models/Expense.js';

const parseExpensePayload = (body, userId) => ({
  userId,
  descripcion: String(body.descripcion || '').trim(),
  monto: Number(body.monto),
  categoria: String(body.categoria || '').trim(),
  fecha: String(body.fecha || '').trim(),
  metodoPago: String(body.metodoPago || '').trim(),
});

const isValidExpense = (expense) =>
  expense.userId &&
  expense.descripcion &&
  Number.isFinite(expense.monto) &&
  expense.monto >= 0 &&
  expense.categoria &&
  expense.fecha &&
  expense.metodoPago;

export async function listExpenses(req, res) {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Usuario invalido' });
  }

  const expenses = await Expense.find({ userId }).sort({ fecha: 1, createdAt: 1 }).lean();
  return res.status(200).json({ expenses });
}

export async function createExpense(req, res) {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Usuario invalido' });
  }

  const expenseData = parseExpensePayload(req.body, userId);

  if (!isValidExpense(expenseData)) {
    return res.status(400).json({ message: 'Todos los campos del gasto son obligatorios' });
  }

  const expense = await Expense.create(expenseData);
  return res.status(201).json({ expense });
}

export async function updateExpense(req, res) {
  const { userId, expenseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(expenseId)) {
    return res.status(400).json({ message: 'Identificador invalido' });
  }

  const expenseData = parseExpensePayload(req.body, userId);

  if (!isValidExpense(expenseData)) {
    return res.status(400).json({ message: 'Todos los campos del gasto son obligatorios' });
  }

  const expense = await Expense.findOneAndUpdate(
    { _id: expenseId, userId },
    expenseData,
    { new: true, runValidators: true }
  );

  if (!expense) {
    return res.status(404).json({ message: 'Gasto no encontrado' });
  }

  return res.status(200).json({ expense });
}

export async function deleteExpense(req, res) {
  const { userId, expenseId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(expenseId)) {
    return res.status(400).json({ message: 'Identificador invalido' });
  }

  const expense = await Expense.findOneAndDelete({ _id: expenseId, userId });

  if (!expense) {
    return res.status(404).json({ message: 'Gasto no encontrado' });
  }

  return res.status(200).json({ message: 'Gasto eliminado' });
}
