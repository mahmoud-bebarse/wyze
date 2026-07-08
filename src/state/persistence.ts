import type { CartState } from "./types";

const STORAGE_KEY = "wyze-builder-state:v1";

export function loadPersistedState(): CartState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CartState;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.quantities !== "object" ||
      typeof parsed.activeVariant !== "object"
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function savePersistedState(state: CartState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / disabled storage */
  }
}

export function clearPersistedState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
