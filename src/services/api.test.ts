// @vitest-environment node
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API_TEST_URL } from '@/test/mocks/handlers';
import { server } from '@/test/mocks/server';
import { ApiError, getProductById, getProducts } from './api';

describe('getProducts', () => {
  it('sends the x-api-key header and a default limit of 20', async () => {
    let capturedRequest: Request | undefined;
    server.use(
      http.get(`${API_TEST_URL}/products`, ({ request }) => {
        capturedRequest = request;
        return HttpResponse.json([]);
      }),
    );

    await getProducts();

    expect(capturedRequest?.headers.get('x-api-key')).toBe('test-api-key');
    expect(new URL(capturedRequest!.url).searchParams.get('limit')).toBe('20');
  });

  it('filters by search through the API', async () => {
    const products = await getProducts({ search: 'apple' });

    expect(products).toHaveLength(1);
    expect(products[0]?.name).toBe('iPhone 15 Pro Max');
  });

  it('normalizes image urls to https', async () => {
    const products = await getProducts();

    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(product.imageUrl).toMatch(/^https:\/\//);
    }
  });

  it('keeps duplicated ids returned by the API', async () => {
    const products = await getProducts();

    const ids = products.map((product) => product.id);
    expect(ids.filter((id) => id === 'XMI-RN13P5G')).toHaveLength(2);
  });
});

describe('getProductById', () => {
  it('returns the product detail with color and similar images normalized to https', async () => {
    const detail = await getProductById('SMG-S24U');

    expect(detail.name).toBe('Galaxy S24 Ultra');
    for (const color of detail.colorOptions) {
      expect(color.imageUrl).toMatch(/^https:\/\//);
    }
    for (const similar of detail.similarProducts) {
      expect(similar.imageUrl).toMatch(/^https:\/\//);
    }
  });

  it('throws an ApiError with the response status when the API fails', async () => {
    const promise = getProductById('UNKNOWN-ID');

    await expect(promise).rejects.toBeInstanceOf(ApiError);
    await expect(promise).rejects.toMatchObject({ status: 404 });
  });
});
