import TransactionForm from '../components/TransactionForm';
import { removeTransaction } from '../services/firestore';
import { dateText, money } from '../utils/format';

export default function Transactions({ user, categories, transactions }) {
  return <section className="grid">
    <div className="panel">
      <h2>Add Transaction</h2>
      <TransactionForm user={user} categories={categories} />
    </div>
    <div className="panel">
      <h2>Transactions</h2>
      {transactions.length === 0 ? <p>No transactions yet.</p> : transactions.map(t => {
        const cat = categories.find(c => c.id === t.categoryId);
        return <div className="tx" key={t.id}>
          <div>
            <strong>{money(t.amount)}</strong> <span className={`pill ${t.type || 'expense'}`}>{t.type || 'expense'}</span>
            <br/><small>{cat?.icon} {cat?.name || 'Unknown'} • {t.note || 'No note'} {dateText(t.createdAt)}</small>
          </div>
          <button onClick={() => removeTransaction(user.uid, t.id)}>Delete</button>
        </div>;
      })}
    </div>
  </section>;
}
