/**
 * Formats a number to exact Indian Currency style: ₹12,34,567.89
 */
export function formatExactIndianCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a number to compact Indian Currency style (e.g. ₹1.25 Lakh, ₹2.84 Crore)
 * Active only for amounts >= ₹1,00,000.
 */
export function formatCompactIndianCurrency(amount: number): string {
  const absVal = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  // Rule 1: Under 1 Lakh (₹1,00,000), show exact amount
  if (absVal < 100000) {
    return formatExactIndianCurrency(amount);
  }

  // Rule 2: 1 Lakh or greater, show smart compact formatting
  let formattedVal = '';
  let unit = '';

  if (absVal >= 100000000000) { // 1 Kharab = 10^11
    formattedVal = (absVal / 100000000000).toFixed(2);
    unit = ' Kharab';
  } else if (absVal >= 1000000000) { // 1 Arab = 10^9
    formattedVal = (absVal / 1000000000).toFixed(2);
    unit = ' Arab';
  } else if (absVal >= 10000000) { // 1 Crore = 10^7
    formattedVal = (absVal / 10000000).toFixed(2);
    unit = ' Crore';
  } else { // 1 Lakh = 10^5
    formattedVal = (absVal / 100000).toFixed(2);
    unit = ' Lakh';
  }

  // Trim trailing decimal zeros (e.g. 18.40 -> 18.4)
  const numericStr = parseFloat(formattedVal).toString();
  return `₹${sign}${numericStr}${unit}`;
}
