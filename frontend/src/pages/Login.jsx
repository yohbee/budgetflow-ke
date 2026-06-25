import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  return <main className="login-page">
    <section className="login-card">
      <h1>BudgetFlow KE</h1>
      <p>Track your income, expenses, savings, categories, and money flow from anywhere.</p>
      <button onClick={login}>Sign in with Google</button>
    </section>
  </main>;
}
