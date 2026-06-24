import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PieChart, Pie, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import './style.css';

const API = 'https://budgetflow-ke.onrender.com/api';
const labels = {
  groceries: 'Groceries', fare: 'Fare', food: 'Food', airtime: 'Airtime',
  longTermSavings: 'Long-term savings', emergencyFund: 'Emergency fund', shortTermSavings: 'Short-term savings'
};

function App() {
  const [data, setData] = useState(null);
  const [form, setForm] = useState({ amount: '', category: 'food', note: '' });
  const [sms, setSms] = useState('MPESA Confirmed. Ksh100 paid to KIBANDA FOOD on 24/6/26.');

  async function load() {
    const res = await fetch(`${API}/budget`);
    setData(await res.json());
  }
  useEffect(() => { load(); }, []);

  async function addTransaction(e) {
    e.preventDefault();
    await fetch(`${API}/transactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ amount: '', category: 'food', note: '' });
    load();
  }

  async function testSms() {
    await fetch(`${API}/sms`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sender: 'MPESA', message: sms }) });
    load();
  }

  async function remove(id) {
    await fetch(`${API}/transactions/${id}`, { method: 'DELETE' });
    load();
  }

  const chartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data.budgets).map(([key, max]) => ({ name: labels[key], used: data.summary.spentByCategory[key] || 0, max }));
  }, [data]);

  if (!data) return <main><h1>Loading...</h1></main>;

  return <main>
    <header>
      <h1>BudgetFlow KE</h1>
      <p>Track your KSh 3,000 budget and understand your money flow.</p>
    </header>

    <section className="cards">
      <Card title="Total Budget" value={`KSh ${data.summary.totalBudget}`} />
      <Card title="Used" value={`KSh ${data.summary.totalUsed}`} />
      <Card title="Remaining" value={`KSh ${data.summary.remaining}`} danger={data.summary.remaining < 0} />
    </section>

    <section className="grid">
      <div className="panel">
        <h2>Add spending/saving</h2>
        <form onSubmit={addTransaction}>
          <input type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {Object.entries(labels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <input placeholder="Note" value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} />
          <button>Add</button>
        </form>
      </div>

      <div className="panel">
        <h2>Test SMS Forwarder</h2>
        <textarea value={sms} onChange={e => setSms(e.target.value)} />
        <button onClick={testSms}>Send SMS to webhook</button>
      </div>
    </section>

    <section className="grid">
      <div className="panel">
        <h2>Category flow</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}><XAxis dataKey="name" hide /><YAxis /><Tooltip /><Bar dataKey="used" /><Bar dataKey="max" /></BarChart>
        </ResponsiveContainer>
      </div>
      <div className="panel">
        <h2>AI Coach</h2>
        {data.advice.map((a, i) => <p className="advice" key={i}>{a}</p>)}
      </div>
    </section>

    <section className="panel">
      <h2>Budget categories</h2>
      <div className="budgets">
        {chartData.map(c => <div key={c.name} className="budget-row"><span>{c.name}</span><strong>KSh {c.used} / {c.max}</strong></div>)}
      </div>
    </section>

    <section className="panel">
      <h2>Transactions</h2>
      {data.transactions.length === 0 ? <p>No transactions yet.</p> : data.transactions.map(t => <div className="tx" key={t.id}>
        <div><strong>KSh {t.amount}</strong> — {labels[t.category]}<br /><small>{t.note || t.rawMessage}</small></div>
        <button onClick={() => remove(t.id)}>Delete</button>
      </div>)}
    </section>
  </main>;
}

function Card({ title, value, danger }) { return <div className={danger ? 'card danger' : 'card'}><span>{title}</span><strong>{value}</strong></div>; }
createRoot(document.getElementById('root')).render(<App />);
