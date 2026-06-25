import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar } from 'recharts';

export default function BudgetChart({ categories, summary }) {
  const data = categories.map(c => ({ name: c.name, used: summary.spentByCategory[c.id] || 0, limit: Number(c.limit || 0) }));
  return <ResponsiveContainer width="100%" height={280}>
    <BarChart data={data}>
      <XAxis dataKey="name" hide />
      <YAxis />
      <Tooltip />
      <Bar dataKey="used" />
      <Bar dataKey="limit" />
    </BarChart>
  </ResponsiveContainer>;
}
