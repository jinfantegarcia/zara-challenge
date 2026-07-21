import { getProducts, DEFAULT_LIST_LIMIT } from '@/services/api';
import ProductGrid from '@/components/ProductGrid';

export default async function HomePage() {
  const products = await getProducts({ limit: DEFAULT_LIST_LIMIT });

  return (
    <main>
      <ProductGrid products={products} />
    </main>
  );
}
