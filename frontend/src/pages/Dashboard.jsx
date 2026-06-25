import Card from '../components/Card';
import BudgetChart from '../components/BudgetChart';
import { money } from '../utils/format';
import { generateAdvice } from '../services/ai';

export default function Dashboard({ settings, categories, transactions, summary, setPage }) {
  const advice = generateAdvice(summary, categories, transactions);
  return <>
    <section className="cards">
      <Card title="Income" value={money(summary.totalIncome)} />
      <Card title="Expenses" value={money(summary.totalExpenses)} />
      <Card title="Savings" value={money(summary.totalSavings)} hint={`${summary.savingsRate}% rate`} />
      <Card title="Remaining" value={money(summary.remaining)} danger={summary.remaining < 0} />
    </section>

    <section className="grid">
      <div className="panel">
        <h2>Category Flow</h2>
        <BudgetChart categories={categories} summary={summary} />
      </div>
      <div className="panel">
        <h2>AI Coach</h2>
        {advice.map((a, i) => <p className="advice" key={i}>{a}</p>)}
        <button onClick={() => setPage('transactions')}>Add Transaction</button>
      </div>
    </section>
  </>;
}
