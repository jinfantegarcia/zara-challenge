import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CartProvider } from '@/context/CartContext';
import Header from './Header';

const { usePathname } = vi.hoisted(() => ({ usePathname: vi.fn() }));

vi.mock('next/navigation', () => ({ usePathname }));

function renderHeader() {
  return render(
    <CartProvider>
      <Header />
    </CartProvider>,
  );
}

describe('Header', () => {
  it('renders an accessible home link', () => {
    usePathname.mockReturnValue('/');

    renderHeader();

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
  });

  it('shows the cart link with the current quantity outside /cart', () => {
    usePathname.mockReturnValue('/');

    renderHeader();

    const cartLink = screen.getByRole('link', { name: 'Cart, 0 items' });
    expect(cartLink).toHaveAttribute('href', '/cart');
    expect(cartLink).toHaveTextContent('0');
  });

  it('uses a singular accessible label when the cart holds one unit', async () => {
    usePathname.mockReturnValue('/');
    window.localStorage.setItem(
      'smartphone-store:cart:v1',
      JSON.stringify([
        {
          productId: 'p1',
          name: 'Galaxy S24 Ultra',
          brand: 'Samsung',
          imageUrl: 'https://example.com/a.jpg',
          capacity: '512 GB',
          colorName: 'Violeta Titanium',
          price: 1199,
        },
      ]),
    );

    renderHeader();

    expect(await screen.findByRole('link', { name: 'Cart, 1 item' })).toBeInTheDocument();
    window.localStorage.clear();
  });

  it('omits the cart control on the /cart route', () => {
    usePathname.mockReturnValue('/cart');

    renderHeader();

    expect(screen.queryByRole('link', { name: /cart/i })).not.toBeInTheDocument();
  });
});
