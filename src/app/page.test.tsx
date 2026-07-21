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

describe('HomePage', () => {
  it('requests the default limit and renders every returned product', async () => {
    getProductsMock.mockResolvedValue(productListFixture);

    const ui = await HomePage();
    render(ui);

    expect(getProductsMock).toHaveBeenCalledWith({ limit: DEFAULT_LIST_LIMIT });
    expect(screen.getAllByRole('listitem')).toHaveLength(productListFixture.length);
    productListFixture.forEach((product) => {
      expect(screen.getAllByText(product.name).length).toBeGreaterThan(0);
    });
  });
});
