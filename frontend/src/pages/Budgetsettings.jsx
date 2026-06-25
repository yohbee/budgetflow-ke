import CategoryEditor from '../components/CategoryEditor';
import { updateSettings } from '../services/firestore';

export default function BudgetSettings({ user, settings, setSettings, categories }) {
  async function save(e) {
    e.preventDefault();
    await updateSettings(user.uid, { totalBudget: Number(settings.totalBudget || 0), currency: settings.currency || 'KES' });
  }

  return <section className="grid">
    <div className="panel">
      <h2>Budget Settings</h2>
      <form onSubmit={save} className="stack">
        <input type="number" value={settings.totalBudget || ''} onChange={e => setSettings({ ...settings, totalBudget: e.target.value })} placeholder="Total budget" />
        <select value={settings.currency || 'KES'} onChange={e => setSettings({ ...settings, currency: e.target.value })}>
          <option value="KES">KES</option>
          <option value="USD">USD</option>
        </select>
        <button>Save Settings</button>
      </form>
    </div>
    <div className="panel wide">
      <h2>Categories</h2>
      <CategoryEditor user={user} categories={categories} />
    </div>
  </section>;
}
