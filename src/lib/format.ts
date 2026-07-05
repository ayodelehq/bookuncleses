export function formatPrice(price: number | null): string {
  if (price === null) return "Price on request";
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(
    price,
  );
}
