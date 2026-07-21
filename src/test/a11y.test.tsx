import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import * as matchers from 'vitest-axe/matchers';
import CartPage from '@/app/cart/page';
import HomePage from '@/app/page';
import ProductDetailPage from '@/app/product/[id]/page';
import Header from '@/components/Header';
import { CartProvider } from '@/context/CartContext';
import { productDetailFixture } from '@/test/mocks/fixtures/products';
import type { CartLine } from '@/types/cart';

expect.extend(matchers);

// jsdom cannot compute rendered colors (no canvas), so the color-contrast
// rule is excluded here; contrast is reviewed manually against the tokens.
const axeOptions = {
  rules: { 'color-contrast': { enabled: false } },
} as const;

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

const STORAGE_KEY = 'smartphone-store:cart:v1';

const cartLine: CartLine = {
  productId: 'p1',
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  imageUrl: 'https://example.com/a.jpg',
  capacity: '512 GB',
  colorName: 'Violeta Titanium',
  price: 1199,
};

describe('accessibility (axe)', () => {
  it('product list view has no violations', async () => {
    const ui = await HomePage({ searchParams: Promise.resolve({}) });
    const { container } = render(
      <CartProvider>
        <Header />
        {ui}
      </CartProvider>,
    );

    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('product detail view has no violations', async () => {
    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({}),
    });
    const { container } = render(
      <CartProvider>
        <Header />
        {ui}
      </CartProvider>,
    );

    expect(await axe(container, axeOptions)).toHaveNoViolations();
  });

  it('cart view with lines has no violations', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([cartLine]));
    const { container } = render(
      <CartProvider>
        <Header />
        <CartPage />
      </CartProvider>,
    );

    expect(await axe(container, axeOptions)).toHaveNoViolations();
    window.localStorage.clear();
  });
});
