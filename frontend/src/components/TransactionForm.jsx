import { useState } from 'react';
import { addTransaction } from '../services/firestore';

export default function TransactionForm({ user, categories }) {
  const [form, setForm] = useState({ amount: '', type: 'expense', categoryId: '', note: '' });

  async function submit(e) {
    e.preventDefault();
    if (!form.amount) return;
    await addTransaction(user.uid, { ...form, categoryId: form.categoryId || categories[0]?.id || '' });
    setForm({ amount: '', type: 'expense', categoryId: categories[0]?.id || '', note: '' });
  }

  return <form onSubmit={submit} className="stack">
    <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
    <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
      <option value="expense">Expense</option>
      <option value="income">Income</option>
      <option value="savings">Savings</option>
    </select>
    <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
      {categories.map(c => <option key={c.id} value={c.id}>{c.icon || '🏷️'} {c.name}</option>)}
    </select>
    <input placeholder="Note or merchant" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
    <button>Add Transaction</button>
  </form>;
}
