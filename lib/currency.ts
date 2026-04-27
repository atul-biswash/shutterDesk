const wholeFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const CURRENCY_SYMBOL = "৳";

export const formatBDT = (amount: number): string =>
  `${CURRENCY_SYMBOL}${wholeFormatter.format(amount)}`;

export const formatBDTWithDecimals = (amount: number): string =>
  `${CURRENCY_SYMBOL}${decimalFormatter.format(amount)}`;
