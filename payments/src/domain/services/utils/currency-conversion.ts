enum Currencies {
  USD = "usd",
  EUR = "eur",
}

class CurrencyConversionError extends Error {
  constructor(message: string = "Currency conversion error") {
    super(message);
    this.name = "CurrencyConversionError";
  }
}

const convertToCents = (amount: number): number => Math.round(amount * 100);
/**
 * Converts the given amount to the specified currency.
 *
 * @param amount - The amount to be converted.
 * @param to - The target currency to convert the amount to.
 * @returns The converted amount in the target currency.
 * @throws Will throw an error if the specified currency is unsupported.
 */
const convertAmountTo = (amount: number | string, to: Currencies): number => {
  if (typeof amount !== "number") {
    amount = parseFloat(amount);
  }

  if (isNaN(amount) || amount < 0) {
    throw new CurrencyConversionError(`Invalid amount of ${amount}`);
  }

  switch (to) {
    case Currencies.USD:
      return convertToCents(amount);
    default:
      throw new CurrencyConversionError(`Unsupported currency: ${to}`);
  }
};

export { convertAmountTo, Currencies, CurrencyConversionError };
