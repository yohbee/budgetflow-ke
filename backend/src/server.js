import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { v4 as uuid } from 'uuid';
import { budgets, totals } from './budget.js';
import { parseSms } from './parser.js';
import { getAdvice } from './aiCoach.js';

const app = express();
const PORT = process.env.PORT || 5000;
let transactions = [];

app.use(cors());
app.use(express.json());

app.get('/api/budget', (req, res) => {
  res.json({ budgets, transactions, summary: totals(transactions), advice: getAdvice(transactions) });
});

app.post('/api/transactions', (req, res) => {
  const { amount, category, note } = req.body;
  if (!amount || !category) return res.status(400).json({ error: 'amount and category are required' });
  const tx = { id: uuid(), amount: Number(amount), category, note: note || '', source: 'manual', createdAt: new Date().toISOString() };
  transactions.unshift(tx);
  res.status(201).json(tx);
});

app.post('/api/sms', (req, res) => {
  const { message, sender } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });
  if (!String(sender || '').toLowerCase().includes('mpesa') && !message.toLowerCase().includes('mpesa')) {
    return res.status(202).json({ ignored: true, reason: 'Only payment/M-Pesa messages should be stored.' });
  }
  const parsed = parseSms(message, sender);
  if (!parsed.amount) return res.status(202).json({ ignored: true, reason: 'No amount detected.' });
  const tx = { id: uuid(), ...parsed };
  transactions.unshift(tx);
  res.status(201).json(tx);
});

app.delete('/api/transactions/:id', (req, res) => {
  transactions = transactions.filter(t => t.id !== req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`BudgetFlow KE backend running on http://localhost:${PORT}`));
