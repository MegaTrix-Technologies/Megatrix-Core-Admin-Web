/**
 * MegaTrix Pakistan Localization & Financial Standards
 */

export const CURRENCY = 'PKR';
export const CURRENCY_LABEL = 'PKR';
export const CURRENCY_SYMBOL = 'PKR';

/**
 * Standard Pakistani Payment Rails & Commercial Transaction Methods
 */
export const PAKISTAN_PAYMENT_METHODS = [
  'Bank Transfer (IBFT / Raast)',
  'JazzCash',
  'EasyPaisa',
  'SadaPay',
  'NayaPay',
  'Cash',
  'Cheque / Pay Order',
  'Debit / Credit Card',
];

export const DEFAULT_PAYMENT_METHOD = 'Bank Transfer (IBFT / Raast)';

/**
 * Format any numerical figure to PKR currency string.
 * Example:
 *  - 35000 -> "PKR 35,000"
 *  - -24830 -> "-PKR 24,830"
 *  - 0 -> "PKR 0"
 */
export const fmtPKR = (num = 0) => {
  const val = Number(num) || 0;
  const formatted = Math.abs(val).toLocaleString('en-PK', {
    maximumFractionDigits: 0,
  });
  return val < 0 ? `-PKR ${formatted}` : `PKR ${formatted}`;
};

export default fmtPKR;
