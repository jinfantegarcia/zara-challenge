import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CartLine } from '@/types/cart';
import { CartProvider, useCart, useCartDispatch } from './CartContext';

const STORAGE_KEY = 'smartphone-store:cart:v1';

const line: CartLine = {
  productId: 'p1',
  name: 'Phone One',
  brand: 'Brand',
  imageUrl: 'https://example.com/p1.jpg',
  capacity: '128GB',
  colorName: 'Black',
  price: 999,
};

function TestConsumer() {
  const cart = useCart();
  const dispatch = useCartDispatch();

  return (
    <div>
      <span data-testid="count">{cart.length}</span>
      <button onClick={() => dispatch({ type: 'ADD_ITEM', payload: line })}>Add</button>
      <button
        onClick={() =>
          dispatch({
            type: 'REMOVE_ITEM',
            payload: {
              productId: line.productId,
              capacity: line.capacity,
              colorName: line.colorName,
            },
          })
        }
      >
        Remove
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <CartProvider>
      <TestConsumer />
    </CartProvider>,
  );
}

describe('CartProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders an empty cart initially', () => {
    renderWithProvider();

    expect(screen.getByTestId('count')).toHaveTextContent('0');
  });

  it('hydrates valid persisted lines after mount', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([line]));

    renderWithProvider();

    expect(await screen.findByTestId('count')).toHaveTextContent('1');
  });

  it('ignores malformed persisted data and keeps an empty cart', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ foo: 'bar' }]));

    renderWithProvider();

    expect(await screen.findByTestId('count')).toHaveTextContent('0');
  });

  it('keeps the cart usable when localStorage is unavailable', async () => {
    vi.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(() => {
      throw new Error('unavailable');
    });

    const user = userEvent.setup();
    renderWithProvider();

    expect(await screen.findByTestId('count')).toHaveTextContent('0');

    await user.click(screen.getByText('Add'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('persists state after add and remove', async () => {
    const user = userEvent.setup();
    renderWithProvider();

    await screen.findByTestId('count');
    await user.click(screen.getByText('Add'));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([line]);

    await user.click(screen.getByText('Remove'));
    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([]);
  });

  it('throws when used outside of a provider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow();

    consoleError.mockRestore();
  });
});
