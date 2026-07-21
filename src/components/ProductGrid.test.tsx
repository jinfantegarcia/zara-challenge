import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProductListItem } from '@/types/product';
import { productListFixture } from '@/test/mocks/fixtures/products';
import ProductGrid from './ProductGrid';

const [firstProduct] = productListFixture;
if (!firstProduct) {
  throw new Error('productListFixture must contain at least one product');
}

describe('ProductGrid', () => {
  it('renders a semantic list with one item per product, including duplicate ids', () => {
    render(<ProductGrid products={productListFixture} />);

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(productListFixture.length);
  });

  it('renders every product without a duplicate-key console warning', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<ProductGrid products={productListFixture} />);

    const keyWarning = consoleError.mock.calls.some((args) =>
      String(args[0]).includes('unique "key" prop'),
    );
    expect(keyWarning).toBe(false);

    consoleError.mockRestore();
  });

  it('renders the twenty-item contract when given twenty products', () => {
    const twenty: ProductListItem[] = Array.from({ length: 20 }, (_, index) => ({
      ...firstProduct,
      id: `product-${index}`,
    }));

    render(<ProductGrid products={twenty} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(20);
  });

  it("renders each product's brand, name and price, and links to its detail page", () => {
    render(<ProductGrid products={productListFixture} />);

    expect(screen.getByText(firstProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(firstProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`${firstProduct.basePrice} EUR`)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: `${firstProduct.brand} ${firstProduct.name}` });
    expect(link).toHaveAttribute('href', `/product/${firstProduct.id}`);
  });

  it('includes the active search query in the detail link when present', () => {
    render(<ProductGrid products={productListFixture} search="pixel" />);

    const link = screen.getByRole('link', { name: `${firstProduct.brand} ${firstProduct.name}` });
    expect(link).toHaveAttribute('href', `/product/${firstProduct.id}?search=pixel`);
  });
});
