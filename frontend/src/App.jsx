import { useState } from 'react';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import BudgetSettings from './pages/BudgetSettings';
import AIInsights from './pages/AIInsights';
import { useAuth } from './hooks/useAuth';
import { useBudget } from './hooks/useBudget';

export default function App() {
  const { user, authReady, logout } = useAuth();
  const [page, setPage] = useState('dashboard');
  const budget = useBudget(user);

  if (!authReady) return <main><h1>Loading...</h1></main>;
  if (!user) return <Login />;
  if (budget.loading) return <main><h1>Loading your budget...</h1></main>;

  return <main>
    <Header user={user} logout={logout} page={page} setPage={setPage} />
    {page === 'dashboard' && <Dashboard {...budget} setPage={setPage} />}
    {page === 'transactions' && <Transactions user={user} {...budget} />}
    {page === 'budget' && <BudgetSettings user={user} {...budget} />}
    {page === 'ai' && <AIInsights {...budget} />}
  </main>;
}
