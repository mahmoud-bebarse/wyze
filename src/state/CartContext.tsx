import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import catalogJson from "../data/catalog.json";
import { cartReducer } from "./cartReducer";
import {
  clearPersistedState,
  loadPersistedState,
  savePersistedState,
} from "./persistence";
import type { Catalog, CartAction, CartState } from "./types";

const catalog = catalogJson as unknown as Catalog;

interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  catalog: Catalog;
  saveForLater: () => void;
  resetToSeed: () => void;
  lastSavedAt: number | null;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    catalog.initialState,
    (seed) => {
      const persisted = loadPersistedState();
      return persisted ?? seed;
    },
  );

  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      dispatch,
      catalog,
      lastSavedAt,
      saveForLater: () => {
        savePersistedState(state);
        setLastSavedAt(Date.now());
      },
      resetToSeed: () => {
        clearPersistedState();
        dispatch({ type: "HYDRATE", state: catalog.initialState });
        setLastSavedAt(null);
      },
    }),
    [state, lastSavedAt],
  );

  // Auto-clear the "Saved!" indicator after a few seconds.
  useEffect(() => {
    if (lastSavedAt === null) return;
    const timer = setTimeout(() => setLastSavedAt(null), 2500);
    return () => clearTimeout(timer);
  }, [lastSavedAt]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
