import 'server-only';

import type { ProductDetail, ProductListItem } from '@/types/product';

export const DEFAULT_LIST_LIMIT = 20;

// The API runs on Render's free tier: cold starts can take up to ~1 minute.
const REQUEST_TIMEOUT_MS = 60_000;
const REVALIDATE_SECONDS = 60;

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface GetProductsParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListItem[]> {
  const { search, limit = DEFAULT_LIST_LIMIT, offset } = params;
  const products = await apiFetch<ProductListItem[]>('/products', { search, limit, offset });

  return products.map(normalizeListItem);
}

export async function getProductById(id: string): Promise<ProductDetail> {
  const product = await apiFetch<ProductDetail>(`/products/${encodeURIComponent(id)}`);

  return normalizeDetail(product);
}

async function apiFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const { baseUrl, apiKey } = getConfig();
  const url = new URL(path, baseUrl);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, String(value));
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { 'x-api-key': apiKey },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });
  } catch {
    throw new ApiError(`Network error while requesting ${path}`);
  }

  if (!response.ok) {
    throw new ApiError(`Request to ${path} failed with status ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}

function getConfig(): { baseUrl: string; apiKey: string } {
  const baseUrl = process.env.API_BASE_URL;
  const apiKey = process.env.API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error(
      'Missing API_BASE_URL or API_KEY environment variables. Copy .env.example to .env to configure them.',
    );
  }

  return { baseUrl, apiKey };
}

// The API returns every imageUrl with an http:// scheme. The same host serves
// them over https, so we normalize to avoid mixed-content warnings in production.
function toHttps(url: string): string {
  return url.replace(/^http:\/\//, 'https://');
}

function normalizeListItem(item: ProductListItem): ProductListItem {
  return { ...item, imageUrl: toHttps(item.imageUrl) };
}

function normalizeDetail(detail: ProductDetail): ProductDetail {
  return {
    ...detail,
    colorOptions: detail.colorOptions.map((color) => ({
      ...color,
      imageUrl: toHttps(color.imageUrl),
    })),
    similarProducts: detail.similarProducts.map(normalizeListItem),
  };
}
