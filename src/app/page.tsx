import { getProducts, DEFAULT_LIST_LIMIT } from '@/services/api';
import ProductGrid from '@/components/ProductGrid';
import SearchInput from '@/components/SearchInput';
import styles from './page.module.scss';

interface HomePageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const search = params.search?.trim() || undefined;
  const products = await getProducts({ limit: DEFAULT_LIST_LIMIT, search });

  return (
    <main className={styles.content}>
      <div className={styles.searchSection}>
        <SearchInput defaultValue={search ?? ''} />
        <p className={styles.results} aria-live="polite">
          {products.length} RESULTS
        </p>
      </div>
      <ProductGrid products={products} search={search} />
    </main>
  );
}
