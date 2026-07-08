export type Category = "cameras" | "plan" | "sensors" | "accessories";

export type StepIndex = 1 | 2 | 3 | 4;

export interface Variant {
  id: string;
  label: string;
  swatch: string;
}

export interface Product {
  id: string;
  category: Category;
  step: StepIndex;
  showInStep: boolean;
  title: string;
  description?: string;
  learnMoreUrl?: string;
  image: string;
  thumbnail: string;
  badge?: string;
  price: number;
  compareAt?: number;
  priceSuffix?: string;
  variants?: Variant[];
  isFree?: boolean;
  isRequired?: boolean;
}

export interface StepMeta {
  index: StepIndex;
  title: string;
  icon: string;
  nextLabel: string | null;
}

export interface Shipping {
  label: string;
  price: number;
  compareAt?: number;
  isFree?: boolean;
}

export interface Catalog {
  steps: StepMeta[];
  products: Product[];
  shipping: Shipping;
  financingMonthly: number;
  initialState: CartState;
}

export interface CartState {
  quantities: Record<string, number>;
  activeVariant: Record<string, string>;
  openStep: StepIndex | null;
}

export type CartAction =
  | { type: "INCREMENT"; productId: string; variantId?: string }
  | { type: "DECREMENT"; productId: string; variantId?: string }
  | { type: "SET_QUANTITY"; productId: string; variantId?: string; qty: number }
  | { type: "SELECT_VARIANT"; productId: string; variantId: string }
  | { type: "SET_OPEN_STEP"; step: StepIndex | null }
  | { type: "HYDRATE"; state: CartState };

/** Composite key for a cart entry — variant-aware. */
export const entryKey = (productId: string, variantId?: string): string =>
  variantId ? `${productId}:${variantId}` : productId;
