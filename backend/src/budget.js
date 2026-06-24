export const budgets = {
  groceries: 250,
  fare: 250,
  food: 500,
  airtime: 140,
  longTermSavings: 500,
  emergencyFund: 360,
  shortTermSavings: 500
};

export const categoryLabels = {
  groceries: 'Groceries',
  fare: 'Fare',
  food: 'Food',
  airtime: 'Airtime',
  longTermSavings: 'Long-term savings',
  emergencyFund: 'Emergency fund',
  shortTermSavings: 'Short-term savings'
};

export function totals(transactions) {
  const spentByCategory = Object.fromEntries(Object.keys(budgets).map(k => [k, 0]));
  for (const t of transactions) {
    if (spentByCategory[t.category] !== undefined) spentByCategory[t.category] += Number(t.amount || 0);
  }
  const totalBudget = Object.values(budgets).reduce((a, b) => a + b, 0);
  const totalUsed = Object.values(spentByCategory).reduce((a, b) => a + b, 0);
  return { totalBudget, totalUsed, remaining: totalBudget - totalUsed, spentByCategory };
}
