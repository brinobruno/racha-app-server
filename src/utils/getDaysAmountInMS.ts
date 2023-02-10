export function getDaysAmountInMS(amountOfDays: number) {
  // 1 day in milliseconds * X days
  return 1000 * 60 * 60 * 24 * amountOfDays
}
