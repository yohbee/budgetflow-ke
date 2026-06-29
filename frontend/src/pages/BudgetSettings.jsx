import { useEffect, useState } from 'react';
import CategoryEditor from '../components/CategoryEditor';
import { updateSettings } from '../services/firestore';

export default function BudgetSettings({ user, settings, setSettings, categories, summary }) {
  const [totalBudget, setTotalBudget] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [status, setStatus] = useState('');

  useEffect(() => {
    setTotalBudget(settings?.totalBudget ?? 3000);
    setCurrency(settings?.currency || 'KES');
  }, [settings]);

  async function save(e) {
    e.preventDefault();

    const updatedSettings = {
      totalBudget: Number(totalBudget || 0),
      currency
    };

    setSettings(updatedSettings);
    await updateSettings(user.uid, updatedSettings);

    setStatus('Settings saved ✅');
    setTimeout(() => setStatus(''), 2500);
  }

  return (
    <section className="grid">
      <div className="panel">
        <h2>Budget Settings</h2>

        <form onSubmit={save} className="stack">
          <label>
            Total Budget
            <input
              type="number"
              value={totalBudget}
              onChange={e => setTotalBudget(e.target.value)}
              placeholder="Enter total budget"
            />
          </label>

          <label>
            Currency
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="KES">KES</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>

          <button type="submit">Save Settings</button>

          {status && <p>{status}</p>}
        </form>
      </div>

      <div className="panel wide">
        <h2>Categories</h2>
        <CategoryEditor
    user={user}
    categories={categories}
    summary={summary}
    currency={settings.currency || 'KES'}
  />
      </div>
    </section>
  );
}
