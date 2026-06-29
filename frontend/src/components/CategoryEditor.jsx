import { useState } from 'react';
import { addCategory, removeCategory, updateCategory } from '../services/firestore';

export default function CategoryEditor({ user, categories, summary, currency = 'KES' }) {
  const [newCat, setNewCat] = useState({ name: '', limit: '', icon: '🏷️' });

  async function create(e) {
    e.preventDefault();
    if (!newCat.name || !newCat.limit) return;
    await addCategory(user.uid, newCat);
    setNewCat({ name: '', limit: '', icon: '🏷️' });
  }

  return (
    <div className="stack">
      <form onSubmit={create} className="inline-form">
        <input value={newCat.icon} onChange={e => setNewCat({ ...newCat, icon: e.target.value })} />
        <input placeholder="Category name" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} />
        <input type="number" placeholder="Limit" value={newCat.limit} onChange={e => setNewCat({ ...newCat, limit: e.target.value })} />
        <button>Add</button>
      </form>

      {categories.map(c => {
        const limit = Number(c.limit || 0);
        const spent = Number(summary?.spentByCategory?.[c.id] || 0);
        const remaining = limit - spent;

        return (
          <div className="tx" key={c.id}>
            <input value={c.icon || '🏷️'} onChange={e => updateCategory(user.uid, c.id, { icon: e.target.value })} />
            <input value={c.name} onChange={e => updateCategory(user.uid, c.id, { name: e.target.value })} />
            <input type="number" value={c.limit} onChange={e => updateCategory(user.uid, c.id, { limit: Number(e.target.value || 0) })} />

            <div>
              <strong>{currency} {remaining} remaining</strong>
              <br />
              <small>Used: {currency} {spent} / {currency} {limit}</small>
            </div>

            <button onClick={() => removeCategory(user.uid, c.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}