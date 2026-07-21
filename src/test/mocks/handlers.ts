import { http, HttpResponse } from 'msw';
import { productDetailFixture, productListFixture } from './fixtures/products';

export const API_TEST_URL = 'https://api.test';

export const handlers = [
  http.get(`${API_TEST_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const offset = Number(url.searchParams.get('offset') ?? 0);

    const filtered = productListFixture.filter(
      (product) =>
        product.name.toLowerCase().includes(search) || product.brand.toLowerCase().includes(search),
    );

    return HttpResponse.json(filtered.slice(offset, offset + limit));
  }),

  http.get(`${API_TEST_URL}/products/:id`, ({ params }) => {
    if (params.id === productDetailFixture.id) {
      return HttpResponse.json(productDetailFixture);
    }

    return HttpResponse.json({ error: 'Not Found', message: 'Product not found' }, { status: 404 });
  }),
];
