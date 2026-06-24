const categoryRules = [
  ['fare', ['uber', 'bolt', 'matatu', 'bus', 'taxi', 'fuel', 'stage']],
  ['food', ['restaurant', 'kibanda', 'food', 'cafe', 'hotel', 'chicken', 'pizza', 'lunch', 'breakfast', 'supper']],
  ['groceries', ['supermarket', 'naivas', 'quickmart', 'carrefour', 'market', 'grocery', 'shop']],
  ['airtime', ['airtime', 'safaricom', 'telkom', 'airtel', 'bundles', 'data']],
  ['longTermSavings', ['long term', 'long-term', 'savings long']],
  ['emergencyFund', ['emergency']],
  ['shortTermSavings', ['short term', 'short-term']]
];

export function categorize(text) {
  const lower = text.toLowerCase();
  for (const [category, words] of categoryRules) {
    if (words.some(w => lower.includes(w))) return category;
  }
  return 'food';
}

export function parseSms(message, sender = 'UNKNOWN') {
  const amountMatch = message.match(/(?:ksh|kes|ksh\.|sh)\s*([0-9,]+(?:\.\d{1,2})?)/i) || message.match(/([0-9,]+(?:\.\d{1,2})?)\s*(?:ksh|kes)/i);
  const amount = amountMatch ? Number(amountMatch[1].replace(/,/g, '')) : 0;
  return {
    source: 'sms',
    sender,
    rawMessage: message,
    amount,
    category: categorize(message),
    note: message.slice(0, 120),
    createdAt: new Date().toISOString()
  };
}
