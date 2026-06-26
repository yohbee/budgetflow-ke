import { useEffect, useMemo, useState } from 'react';
import { ensureUserSetup, listenCategories, listenSettings, listenTransactions } from '../services/firestore';

export function useBudget(user) {
  const [settings, setSettings] = useState({ totalBudget: 3000, currency: 'KES' });
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let unsubSettings;
    let unsubCategories;
    let unsubTransactions;

    async function start() {
      await ensureUserSetup(user.uid);
      unsubSettings = listenSettings(user.uid, setSettings);
      unsubCategories = listenCategories(user.uid, setCategories);
      unsubTransactions = listenTransactions(user.uid, setTransactions);
      setLoading(false);
    }

    start();
    return () => {
      if (unsubSettings) unsubSettings();
      if (unsubCategories) unsubCategories();
      if (unsubTransactions) unsubTransactions();
    };
  }, [user]);

  const summary = useMemo(() => {
    const expenses = transactions.filter(t => (t.type || 'expense') === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    const savings = transactions.filter(t => t.type === 'savings');

    const spentByCategory = {};
    expenses.forEach(t => {
      spentByCategory[t.categoryId] = (spentByCategory[t.categoryId] || 0) + Number(t.amount || 0);
    });

    const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const totalIncome = income.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const totalSavings = savings.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const totalBudget = Number(settings.totalBudget || 0);

    return {
      totalBudget,
      totalIncome,
      totalExpenses,
      totalSavings,
      remaining: totalBudget + totalIncome - totalExpenses - totalSavings,
      spentByCategory,
      savingsRate: totalIncome ? Math.round((totalSavings / totalIncome) * 100) : 0
    };
  }, [transactions, settings]);

  return { loading, settings, setSettings, categories, transactions, summary };
