import type {
  Catalog,
  CartState,
  Category,
  Product,
  StepIndex,
  Variant,
} from "./types";

export interface LineItem {
  key: string;
  product: Product;
  variant?: Variant;
  qty: number;
  lineTotal: number;
  lineCompareAt: number;
}

/** Parse a cart key back into its productId and optional variantId. */
export function parseKey(key: string): {
  productId: string;
  variantId?: string;
} {
  const idx = key.indexOf(":");
  if (idx === -1) return { productId: key };
  return { productId: key.slice(0, idx), variantId: key.slice(idx + 1) };
}

export function findProduct(
  catalog: Catalog,
  productId: string,
): Product | undefined {
  return catalog.products.find((p) => p.id === productId);
}

export function findVariant(
  product: Product,
  variantId?: string,
): Variant | undefined {
  if (!variantId || !product.variants) return undefined;
  return product.variants.find((v) => v.id === variantId);
}

/** Get quantity for the currently-active variant of a product (or the bare product). */
export function getActiveQty(state: CartState, product: Product): number {
  const variantId = product.variants
    ? state.activeVariant[product.id] ?? product.variants[0]?.id
    : undefined;
  const key = variantId ? `${product.id}:${variantId}` : product.id;
  return state.quantities[key] ?? 0;
}

/** All line items with qty > 0, in a stable order matching catalog order. */
export function getLineItems(
  state: CartState,
  catalog: Catalog,
): LineItem[] {
  const items: LineItem[] = [];
  for (const product of catalog.products) {
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        const key = `${product.id}:${variant.id}`;
        const qty = state.quantities[key] ?? 0;
        if (qty <= 0) continue;
        items.push({
          key,
          product,
          variant,
          qty,
          lineTotal: product.price * qty,
          lineCompareAt: (product.compareAt ?? product.price) * qty,
        });
      }
    } else {
      const key = product.id;
      const qty = state.quantities[key] ?? 0;
      if (qty <= 0) continue;
      items.push({
        key,
        product,
        qty,
        lineTotal: product.price * qty,
        lineCompareAt: (product.compareAt ?? product.price) * qty,
      });
    }
  }
  return items;
}

/** Group line items by category, preserving canonical category order. */
export function groupByCategory(
  items: LineItem[],
): { category: Category; items: LineItem[] }[] {
  const order: Category[] = ["cameras", "sensors", "accessories", "plan"];
  return order
    .map((category) => ({
      category,
      items: items.filter((i) => i.product.category === category),
    }))
    .filter((g) => g.items.length > 0);
}

export interface Totals {
  subtotal: number;
  compareAtSubtotal: number;
  savings: number;
}

/** Sum of all line totals. Free items contribute 0. */
export function getTotals(state: CartState, catalog: Catalog): Totals {
  const items = getLineItems(state, catalog);
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
  const compareAtSubtotal = items.reduce((s, i) => s + i.lineCompareAt, 0);
  return {
    subtotal,
    compareAtSubtotal,
    savings: Math.max(0, compareAtSubtotal - subtotal),
  };
}

/** Number of distinct cart entries (variant-aware) in the given step with qty > 0. */
export function getSelectedCountForStep(
  state: CartState,
  catalog: Catalog,
  step: StepIndex,
): number {
  const items = getLineItems(state, catalog);
  return items.filter((i) => i.product.step === step).length;
}
