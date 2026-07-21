import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_LIST_LIMIT } from '@/services/api';
import { productListFixture } from '@/test/mocks/fixtures/products';
import HomePage from './page';

const { getProductsMock } = vi.hoisted(() => ({ getProductsMock: vi.fn() }));

vi.mock('@/services/api', async () => {
  const actual = await vi.importActual<typeof import('@/services/api')>('@/services/api');
  return {
    ...actual,
    getProducts: getProductsMock,
  };
});

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('HomePage', () => {
  it('requests the default limit and renders every returned product when no search is given', async () => {
    getProductsMock.mockResolvedValue(productListFixture);

    const ui = await HomePage({ searchParams: Promise.resolve({}) });
    render(ui);

    expect(getProductsMock).toHaveBeenCalledWith({ limit: DEFAULT_LIST_LIMIT, search: undefined });
    expect(screen.getAllByRole('listitem')).toHaveLength(productListFixture.length);
    expect(screen.getByText(`${productListFixture.length} RESULTS`)).toHaveAttribute(
      'aria-live',
      'polite',
    );
  });

  it('passes a non-empty search query to the product service', async () => {
    getProductsMock.mockResolvedValue(productListFixture);

    const ui = await HomePage({ searchParams: Promise.resolve({ search: 'pixel' }) });
    render(ui);

    expect(getProductsMock).toHaveBeenCalledWith({
      limit: DEFAULT_LIST_LIMIT,
      search: 'pixel',
    });
  });

  it('restores the default request when the search value is empty or whitespace', async () => {
    getProductsMock.mockResolvedValue(productListFixture);

    const ui = await HomePage({ searchParams: Promise.resolve({ search: '   ' }) });
    render(ui);

    expect(getProductsMock).toHaveBeenCalledWith({ limit: DEFAULT_LIST_LIMIT, search: undefined });
  });

  it('renders no product cards and "0 RESULTS" when the search has no matches', async () => {
    getProductsMock.mockResolvedValue([]);

    const ui = await HomePage({ searchParams: Promise.resolve({ search: 'nonexistent' }) });
    render(ui);

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByText('0 RESULTS')).toBeInTheDocument();
  });
});
