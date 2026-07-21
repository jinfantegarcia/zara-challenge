import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProductListItem } from '@/types/product';
import { productListFixture } from '@/test/mocks/fixtures/products';
import SimilarProducts from './SimilarProducts';

describe('SimilarProducts', () => {
  it('renders the literal SIMILAR ITEMS heading and one card per product', () => {
    render(<SimilarProducts products={productListFixture} />);

    expect(screen.getByRole('heading', { name: 'SIMILAR ITEMS' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(productListFixture.length);
  });

  it('renders nothing when there are no similar products', () => {
    const { container } = render(<SimilarProducts products={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('links each card to its detail route, carrying search when present', () => {
    render(<SimilarProducts products={productListFixture} search="pixel" />);

    const first = productListFixture[0]!;
    const link = screen.getByRole('link', { name: `${first.brand} ${first.name}` });
    expect(link).toHaveAttribute('href', `/product/${first.id}?search=pixel`);
  });

  it('omits the search parameter when none is active', () => {
    render(<SimilarProducts products={productListFixture} />);

    const first = productListFixture[0]!;
    const link = screen.getByRole('link', { name: `${first.brand} ${first.name}` });
    expect(link).toHaveAttribute('href', `/product/${first.id}`);
  });

  it('explicitly lazy-loads similar product images', () => {
    render(<SimilarProducts products={productListFixture} />);

    for (const img of screen.getAllByRole('presentation', { hidden: true })) {
      expect(img).toHaveAttribute('loading', 'lazy');
    }
  });

  it('exposes a keyboard-focusable scroll region', () => {
    render(<SimilarProducts products={productListFixture} />);

    expect(screen.getByRole('region', { name: 'Similar items' })).toHaveAttribute('tabIndex', '0');
  });

  it('renders duplicate product ids without a React key warning', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const duplicated: ProductListItem[] = [productListFixture[0]!, productListFixture[0]!];

    render(<SimilarProducts products={duplicated} />);

    const keyWarning = consoleError.mock.calls.some((args) =>
      String(args[0]).includes('unique "key" prop'),
    );
    expect(keyWarning).toBe(false);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);

    consoleError.mockRestore();
  });
});
