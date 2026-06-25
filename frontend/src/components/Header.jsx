import { LogOut } from 'lucide-react';

export default function Header({ user, logout, page, setPage }) {
  const nav = ['dashboard', 'transactions', 'budget', 'ai'];
  return <header className="topbar">
    <div>
      <h1>BudgetFlow KE</h1>
      <p>Hello {user?.displayName?.split(' ')[0] || 'there'} 👋</p>
    </div>
    <nav>
      {nav.map(n => <button key={n} className={page === n ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>)}
    </nav>
    <button className="icon-btn" onClick={logout}><LogOut size={18}/> Logout</button>
  </header>;
}
