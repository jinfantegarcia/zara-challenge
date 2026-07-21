import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CartProvider } from '@/context/CartContext';
import { productDetailFixture } from '@/test/mocks/fixtures/products';
import ProductDetailPage from './page';

const minimumStoragePrice = Math.min(
  ...productDetailFixture.storageOptions.map((option) => option.price),
);

function renderDetail(ui: Awaited<ReturnType<typeof ProductDetailPage>>) {
  return render(<CartProvider>{ui}</CartProvider>);
}

describe('ProductDetailPage', () => {
  it('renders the requested product name and image without a visible brand on a direct request', async () => {
    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({}),
    });
    renderDetail(ui);

    const heading = screen.getByRole('heading', { level: 1, name: productDetailFixture.name });
    expect(heading).toBeInTheDocument();
    expect(heading.parentElement).not.toHaveTextContent(productDetailFixture.brand);
    expect(
      screen.getByAltText(`${productDetailFixture.brand} ${productDetailFixture.name}`),
    ).toBeInTheDocument();
  });

  it('shows the minimum storage-option price, not basePrice, when they differ', async () => {
    expect(minimumStoragePrice).not.toBe(productDetailFixture.basePrice);

    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({}),
    });
    renderDetail(ui);

    expect(screen.getByText(`From ${minimumStoragePrice} EUR`)).toBeInTheDocument();
  });

  it('targets "/" for BACK when no search query is present', async () => {
    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({}),
    });
    renderDetail(ui);

    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/');
  });

  it('preserves the search query when returning via BACK', async () => {
    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({ search: 'pixel' }),
    });
    renderDetail(ui);

    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/?search=pixel');
  });

  it('renders the specifications table from the server-fetched product', async () => {
    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({}),
    });
    renderDetail(ui);

    expect(screen.getByRole('heading', { name: 'SPECIFICATIONS' })).toBeInTheDocument();
    expect(screen.getByText(productDetailFixture.specs.processor)).toBeInTheDocument();
  });

  it('renders similar products carrying the active search into their detail links', async () => {
    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({ search: 'pixel' }),
    });
    renderDetail(ui);

    expect(screen.getByRole('heading', { name: 'SIMILAR ITEMS' })).toBeInTheDocument();
    const [firstSimilar] = productDetailFixture.similarProducts;
    const link = screen.getByRole('link', {
      name: `${firstSimilar!.brand} ${firstSimilar!.name}`,
    });
    expect(link).toHaveAttribute('href', `/product/${firstSimilar!.id}?search=pixel`);
  });
});
