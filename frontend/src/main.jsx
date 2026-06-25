import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BarChart, Bar, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { db, auth, googleProvider } from './firebase';
import './style.css';

const defaultCategories = [
  { name: 'Groceries', limit: 250 },
  { name: 'Fare', limit: 250 },
  { name: 'Food', limit: 500 },
  { name: 'Airtime', limit: 140 },
  { name: 'Long-term savings', limit: 500 },
  { name: 'Emergency fund', limit: 360 },
  { name: 'Short-term savings', limit: 500 }
];

function App() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const [settings, setSettings] = useState({ totalBudget: 3000 });
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [form, setForm] = useState({ amount: '', categoryId: '', note: '' });
  const [newCategory, setNewCategory] = useState({ name: '', limit: '' });

  useEffect(() => {
    return onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    const settingsRef = doc(db, 'users', user.uid, 'settings', 'main');
    const categoriesRef = collection(db, 'users', user.uid, 'categories');
    const transactionsRef = collection(db, 'users', user.uid, 'transactions');

    async function setup() {
      const settingsSnap = await getDoc(settingsRef);

      if (!settingsSnap.exists()) {
        await setDoc(settingsRef, { totalBudget: 3000 });
      }

      const unsubSettings = onSnapshot(settingsRef, snap => {
        if (snap.exists()) {
          setSettings(snap.data());
        }
      });

      const unsubCategories = onSnapshot(categoriesRef, snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCategories(list);

        if (list.length === 0) {
          defaultCategories.forEach(c => addDoc(categoriesRef, c));
        }

        if (!form.categoryId && list.length > 0) {
          setForm(f => ({ ...f, categoryId: list[0].id }));
        }
      });

      const unsubTransactions = onSnapshot(transactionsRef, snap => {
        setTransactions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      return () => {
        unsubSettings();
        unsubCategories();
        unsubTransactions();
      };
    }

    let cleanup;

    setup().then(unsub => {
      cleanup = unsub;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [user]);

  const summary = useMemo(() => {
    const spentByCategory = {};

    transactions.forEach(t => {
      spentByCategory[t.categoryId] =
        (spentByCategory[t.categoryId] || 0) + Number(t.amount || 0);
    });

    const totalUsed = transactions.reduce(
      (sum, t) => sum + Number(t.amount || 0),
      0
    );

    const totalBudget = Number(settings.totalBudget || 0);

    return {
      spentByCategory,
      totalUsed,
      totalBudget,
      remaining: totalBudget - totalUsed
    };
  }, [transactions, settings]);

  const chartData = categories.map(c => ({
    name: c.name,
    used: summary.spentByCategory[c.id] || 0,
    max: Number(c.limit || 0)
  }));

  async function updateTotalBudget(e) {
    e.preventDefault();

    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid, 'settings', 'main'), {
      totalBudget: Number(settings.totalBudget || 0)
    });
  }

  async function addCategory(e) {
    e.preventDefault();

    if (!user || !newCategory.name || !newCategory.limit) return;

    await addDoc(collection(db, 'users', user.uid, 'categories'), {
      name: newCategory.name,
      limit: Number(newCategory.limit)
    });

    setNewCategory({ name: '', limit: '' });
  }

  async function editCategory(id, field, value) {
    if (!user) return;

    await updateDoc(doc(db, 'users', user.uid, 'categories', id), {
      [field]: field === 'limit' ? Number(value || 0) : value
    });
  }

  async function deleteCategory(id) {
    if (!user) return;

    await deleteDoc(doc(db, 'users', user.uid, 'categories', id));
  }

  async function addTransaction(e) {
    e.preventDefault();

    if (!user || !form.amount || !form.categoryId) return;

    await addDoc(collection(db, 'users', user.uid, 'transactions'), {
      amount: Number(form.amount),
      categoryId: form.categoryId,
      note: form.note,
      createdAt: serverTimestamp()
    });

    setForm({ amount: '', categoryId: categories[0]?.id || '', note: '' });
  }

  async function removeTransaction(id) {
    if (!user) return;

    await deleteDoc(doc(db, 'users', user.uid, 'transactions', id));
  }

  if (!authReady) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <header>
          <h1>BudgetFlow KE</h1>
          <p>Sign in to manage your personal budget.</p>
        </header>

        <section className="panel">
          <button onClick={() => signInWithPopup(auth, googleProvider)}>
            Sign in with Google
          </button>
        </section>
      </main>
    );
  }

  return (
    <main>
      <header>
        <h1>BudgetFlow KE</h1>
        <p>Track, edit, and manage your money flow online.</p>
        <button onClick={() => signOut(auth)}>Logout</button>
      </header>

      <section className="cards">
        <Card title="Total Budget" value={`KSh ${summary.totalBudget}`} />
        <Card title="Used" value={`KSh ${summary.totalUsed}`} />
        <Card
          title="Remaining"
          value={`KSh ${summary.remaining}`}
          danger={summary.remaining < 0}
        />
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Budget Settings</h2>

          <form onSubmit={updateTotalBudget}>
            <input
              type="number"
              value={settings.totalBudget}
              onChange={e =>
                setSettings({ ...settings, totalBudget: e.target.value })
              }
              placeholder="Total budget"
            />
            <button>Save Total Budget</button>
          </form>
        </div>

        <div className="panel">
          <h2>Add Category</h2>

          <form onSubmit={addCategory}>
            <input
              placeholder="Category name"
              value={newCategory.name}
              onChange={e =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Limit"
              value={newCategory.limit}
              onChange={e =>
                setNewCategory({ ...newCategory, limit: e.target.value })
              }
            />

            <button>Add Category</button>
          </form>
        </div>
      </section>

      <section className="panel">
        <h2>Edit Categories</h2>

        {categories.map(c => (
          <div className="tx" key={c.id}>
            <input
              value={c.name}
              onChange={e => editCategory(c.id, 'name', e.target.value)}
            />

            <input
              type="number"
              value={c.limit}
              onChange={e => editCategory(c.id, 'limit', e.target.value)}
            />

            <button onClick={() => deleteCategory(c.id)}>Delete</button>
          </div>
        ))}
      </section>

      <section className="grid">
        <div className="panel">
          <h2>Add Transaction</h2>

          <form onSubmit={addTransaction}>
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />

            <select
              value={form.categoryId}
              onChange={e => setForm({ ...form, categoryId: e.target.value })}
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Note"
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
            />

            <button>Add</button>
          </form>
        </div>

        <div className="panel">
          <h2>Category Flow</h2>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <Tooltip />
              <Bar dataKey="used" />
              <Bar dataKey="max" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <h2>Transactions</h2>

        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map(t => {
            const cat = categories.find(c => c.id === t.categoryId);

            return (
              <div className="tx" key={t.id}>
                <div>
                  <strong>KSh {t.amount}</strong> — {cat?.name || 'Unknown'}
                  <br />
                  <small>{t.note}</small>
                </div>

                <button onClick={() => removeTransaction(t.id)}>Delete</button>
              </div>
            );
          })
        )}
      </section>
    </main>
  );
}

function Card({ title, value, danger }) {
  return (
    <div className={danger ? 'card danger' : 'card'}>
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);