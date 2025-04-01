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

/**
 * Converts a monetary amount to its value in cents.
 *
 * @param amount - The monetary amount to convert, which can be a number or a string.
 * @returns The equivalent value in cents as a number.
 * @throws {CurrencyConversionError} If the provided amount is invalid (e.g., not a number or negative).
 */
const convertToCents = (amount: number | string): number => {
  if (typeof amount !== "number") {
    amount = parseFloat(amount);
  }

  if (isNaN(amount) || amount < 0) {
    throw new CurrencyConversionError(`Invalid amount of ${amount}`);
  }

  return Math.round(amount * 100);
};

export { Currencies, CurrencyConversionError, convertToCents };
