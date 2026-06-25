import { generateAdvice } from '../services/ai';

export default function AIInsights({ summary, categories, transactions }) {
  const advice = generateAdvice(summary, categories, transactions);
  return <section className="panel">
    <h2>AI Coach</h2>
    <p>This version uses rule-based advice. Later you can connect Gemini/OpenAI for deeper coaching.</p>
    {advice.map((a, i) => <p className="advice" key={i}>{a}</p>)}
  </section>;
}
