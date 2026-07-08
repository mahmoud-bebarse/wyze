/** Format a number as USD with 2 decimals, no leading whitespace. */
export function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}
