import { budgets, categoryLabels, totals } from './budget.js';

export function getAdvice(transactions) {
  const t = totals(transactions);
  const lines = [];

  for (const [category, budget] of Object.entries(budgets)) {
    const used = t.spentByCategory[category] || 0;
    const left = budget - used;
    const label = categoryLabels[category];
    if (used > budget) lines.push(`You exceeded ${label} by KSh ${Math.abs(left)}. Reduce this category next.`);
    else if (used >= budget * 0.8) lines.push(`${label} is almost finished. You have KSh ${left} left.`);
    else if (used > 0) lines.push(`${label} is okay. You still have KSh ${left} left.`);
  }

  if (t.remaining < 0) lines.unshift(`You are over your total budget by KSh ${Math.abs(t.remaining)}.`);
  else lines.unshift(`You have KSh ${t.remaining} remaining from your KSh ${t.totalBudget} budget.`);

  return lines;
}
