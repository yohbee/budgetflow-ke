export function parseMpesaSms(message) {
  const amountMatch = message.match(/Ksh\s?([\d,]+(?:\.\d+)?)/i);
  const amount = amountMatch ? Number(amountMatch[1].replaceAll(',', '')) : 0;
  let type = 'expense';
  if (/received|you have received|credited/i.test(message)) type = 'income';
  return { amount, type, note: message };
}
