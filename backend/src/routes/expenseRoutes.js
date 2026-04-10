import { Router } from 'express';
import {
  createExpense,
  deleteExpense,
  listExpenses,
  updateExpense,
} from '../controllers/expenseController.js';

const router = Router();

router.get('/user/:userId', listExpenses);
router.post('/user/:userId', createExpense);
router.put('/user/:userId/:expenseId', updateExpense);
router.delete('/user/:userId/:expenseId', deleteExpense);

export default router;
