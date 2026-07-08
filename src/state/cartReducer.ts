import type { CartAction, CartState } from "./types";
import { entryKey } from "./types";

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "INCREMENT": {
      const key = entryKey(action.productId, action.variantId);
      const next = (state.quantities[key] ?? 0) + 1;
      return {
        ...state,
        quantities: { ...state.quantities, [key]: next },
      };
    }
    case "DECREMENT": {
      const key = entryKey(action.productId, action.variantId);
      const current = state.quantities[key] ?? 0;
      if (current <= 0) return state;
      const next = current - 1;
      const nextQuantities = { ...state.quantities };
      if (next === 0) delete nextQuantities[key];
      else nextQuantities[key] = next;
      return { ...state, quantities: nextQuantities };
    }
    case "SET_QUANTITY": {
      const key = entryKey(action.productId, action.variantId);
      const qty = Math.max(0, Math.floor(action.qty));
      const nextQuantities = { ...state.quantities };
      if (qty === 0) delete nextQuantities[key];
      else nextQuantities[key] = qty;
      return { ...state, quantities: nextQuantities };
    }
    case "SELECT_VARIANT": {
      return {
        ...state,
        activeVariant: {
          ...state.activeVariant,
          [action.productId]: action.variantId,
        },
      };
    }
    case "SET_OPEN_STEP": {
      return { ...state, openStep: action.step };
    }
    case "HYDRATE": {
      return action.state;
    }
    default:
      return state;
  }
}
