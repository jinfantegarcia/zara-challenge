import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { productDetailFixture } from '@/test/mocks/fixtures/products';
import ProductDetailPage from './page';

const minimumStoragePrice = Math.min(
  ...productDetailFixture.storageOptions.map((option) => option.price),
);

describe('ProductDetailPage', () => {
  it('renders the requested product name and image without a visible brand on a direct request', async () => {
    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({}),
    });
    render(ui);

    expect(
      screen.getByRole('heading', { level: 1, name: productDetailFixture.name }),
    ).toBeInTheDocument();
    expect(screen.queryByText(productDetailFixture.brand)).not.toBeInTheDocument();
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
    render(ui);

    expect(screen.getByText(`From ${minimumStoragePrice} EUR`)).toBeInTheDocument();
  });

  it('targets "/" for BACK when no search query is present', async () => {
    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({}),
    });
    render(ui);

    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/');
  });

  it('preserves the search query when returning via BACK', async () => {
    const ui = await ProductDetailPage({
      params: Promise.resolve({ id: productDetailFixture.id }),
      searchParams: Promise.resolve({ search: 'pixel' }),
    });
    render(ui);

    expect(screen.getByRole('link', { name: /back/i })).toHaveAttribute('href', '/?search=pixel');
  });
});
