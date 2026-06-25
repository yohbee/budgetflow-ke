export default function Card({ title, value, danger, hint }) {
  return <div className={danger ? 'card danger' : 'card'}>
    <span>{title}</span>
    <strong>{value}</strong>
    {hint && <small>{hint}</small>}
  </div>;
}
