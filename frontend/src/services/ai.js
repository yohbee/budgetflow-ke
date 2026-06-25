export function generateAdvice(summary, categories, transactions) {
  const advice = [];
  if (summary.remaining < 0) advice.push('You are over your available budget. Pause non-essential spending.');
  else advice.push(`You still have ${summary.remaining.toLocaleString()} available.`);
  if (summary.totalSavings > 0) advice.push(`Good job. You saved ${summary.totalSavings.toLocaleString()} this period.`);
  if (summary.totalExpenses > summary.totalBudget * 0.7) advice.push('Your spending is above 70% of the budget. Watch the next few purchases.');
  const top = categories.map(c => ({ ...c, used: summary.spentByCategory[c.id] || 0 })).sort((a,b)=>b.used-a.used)[0];
  if (top?.used) advice.push(`Your highest spending category is ${top.name}.`);
  if (transactions.length === 0) advice.push('Start by adding your first income or expense.');
  return advice;
}
