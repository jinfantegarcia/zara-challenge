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

    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toHaveAttribute('href', '/cart');
    expect(cartLink).toHaveTextContent('0');
  });

  it('omits the cart control on the /cart route', () => {
    usePathname.mockReturnValue('/cart');

    renderHeader();

    expect(screen.queryByRole('link', { name: /cart/i })).not.toBeInTheDocument();
  });
});
