import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider } from '@/context/CartContext';
import type { CartLine } from '@/types/cart';
import CartPage from './page';

const STORAGE_KEY = 'smartphone-store:cart:v1';

const lineA: CartLine = {
  productId: 'p1',
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  imageUrl: 'https://example.com/a.jpg',
  capacity: '512 GB',
  colorName: 'Violeta Titanium',
  price: 1199,
};

const lineB: CartLine = {
  productId: 'p2',
  name: 'iPhone 15 Pro Max',
  brand: 'Apple',
  imageUrl: 'https://example.com/b.jpg',
  capacity: '256 GB',
  colorName: 'Black Titanium',
  price: 1329,
};

function renderCart(initial?: CartLine[]) {
  if (initial) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  }
  return render(
    <CartProvider>
      <CartPage />
    </CartProvider>,
  );
}

describe('CartPage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the empty state with only the heading and continue shopping link', async () => {
    renderCart();

    expect(await screen.findByRole('heading', { name: 'CART (0)' })).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.queryByText('Total')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'PAY' })).not.toBeInTheDocument();
    const continueLink = screen.getByRole('link', { name: 'CONTINUE SHOPPING' });
    expect(continueLink).toHaveAttribute('href', '/');
  });

  it('ignores malformed persisted storage and falls back to the empty state', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([{ foo: 'bar' }]));

    renderCart();

    expect(await screen.findByRole('heading', { name: 'CART (0)' })).toBeInTheDocument();
  });

  it('hydrates persisted lines and renders the heading count', async () => {
    renderCart([lineA, lineB]);

    expect(await screen.findByRole('heading', { name: 'CART (2)' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders each line image alt, name, capacity/colour and price', async () => {
    renderCart([lineA]);
    await screen.findByRole('heading', { name: 'CART (1)' });

    const list = within(screen.getByRole('list'));
    expect(screen.getByAltText('Samsung Galaxy S24 Ultra en Violeta Titanium')).toBeInTheDocument();
    expect(list.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
    expect(list.getByText('512 GB | Violeta Titanium')).toBeInTheDocument();
    expect(list.getByText('1199 EUR')).toBeInTheDocument();
  });

  it('derives and displays the total across all lines', async () => {
    renderCart([lineA, lineB]);
    await screen.findByRole('heading', { name: 'CART (2)' });

    expect(screen.getByText('2528 EUR')).toBeInTheDocument();
  });

  it('removes exactly one line when Eliminar is clicked, updating heading, total and storage', async () => {
    renderCart([lineA, lineB]);
    await screen.findByRole('heading', { name: 'CART (2)' });

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]!);

    expect(await screen.findByRole('heading', { name: 'CART (1)' })).toBeInTheDocument();
    expect(screen.queryByText('Galaxy S24 Ultra')).not.toBeInTheDocument();
    expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument();
    expect(within(screen.getByRole('list')).getByText('1329 EUR')).toBeInTheDocument();
    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([lineB]);
    });
  });

  it('removes exactly one entry among two identical configurations', async () => {
    renderCart([lineA, lineA]);
    await screen.findByRole('heading', { name: 'CART (2)' });

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0]!);

    expect(await screen.findByRole('heading', { name: 'CART (1)' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('drops total and PAY once the last line is removed', async () => {
    renderCart([lineA]);
    await screen.findByRole('heading', { name: 'CART (1)' });

    fireEvent.click(screen.getByRole('button', { name: 'Eliminar' }));

    expect(await screen.findByRole('heading', { name: 'CART (0)' })).toBeInTheDocument();
    expect(screen.queryByText('Total')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'PAY' })).not.toBeInTheDocument();
  });

  it('renders a no-op PAY button that changes nothing when clicked', async () => {
    renderCart([lineA]);
    await screen.findByRole('heading', { name: 'CART (1)' });

    const payButton = screen.getByRole('button', { name: 'PAY' });
    expect(payButton).toHaveAttribute('type', 'button');

    fireEvent.click(payButton);

    expect(screen.getByRole('heading', { name: 'CART (1)' })).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual([lineA]);
  });
});
