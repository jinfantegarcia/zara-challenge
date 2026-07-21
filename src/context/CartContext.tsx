'use client';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { CartLine } from '@/types/cart';

const STORAGE_KEY = 'smartphone-store:cart:v1';

export type CartAction =
  | { type: 'HYDRATE'; payload: CartLine[] }
  | { type: 'ADD_ITEM'; payload: CartLine }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; capacity: string; colorName: string } };

const CartStateContext = createContext<CartLine[] | undefined>(undefined);
const CartDispatchContext = createContext<Dispatch<CartAction> | undefined>(undefined);

export function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'ADD_ITEM':
      return [...state, action.payload];
    case 'REMOVE_ITEM': {
      const index = state.findIndex(
        (line) =>
          line.productId === action.payload.productId &&
          line.capacity === action.payload.capacity &&
          line.colorName === action.payload.colorName,
      );
      if (index === -1) {
        return state;
      }
      return [...state.slice(0, index), ...state.slice(index + 1)];
    }
    default:
      return state;
  }
}

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const line = value as Record<string, unknown>;
  return (
    typeof line.productId === 'string' &&
    typeof line.name === 'string' &&
    typeof line.brand === 'string' &&
    typeof line.imageUrl === 'string' &&
    typeof line.capacity === 'string' &&
    typeof line.colorName === 'string' &&
    typeof line.price === 'number'
  );
}

function readPersistedCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isCartLine)) {
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

function writePersistedCart(lines: CartLine[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  } catch {
    // Storage unavailable or full: keep the in-memory cart usable.
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, []);
  const hasHydrated = useRef(false);

  useEffect(() => {
    dispatch({ type: 'HYDRATE', payload: readPersistedCart() });
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) {
      return;
    }
    writePersistedCart(state);
  }, [state]);

  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>{children}</CartDispatchContext.Provider>
    </CartStateContext.Provider>
  );
}

export function useCart(): CartLine[] {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function useCartDispatch(): Dispatch<CartAction> {
  const context = useContext(CartDispatchContext);
  if (context === undefined) {
    throw new Error('useCartDispatch must be used within a CartProvider');
  }
  return context;
}
