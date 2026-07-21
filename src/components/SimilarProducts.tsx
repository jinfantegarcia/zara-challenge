import type { ProductListItem } from '@/types/product';
import ProductCard from './ProductCard';
import ScrollableRow from './ScrollableRow';
import styles from './SimilarProducts.module.scss';

export default function SimilarProducts({
  products,
  search,
}: {
  products: ProductListItem[];
  search?: string;
}) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>SIMILAR ITEMS</h2>
      <ScrollableRow ariaLabel="Similar items">
        <ul className={styles.list}>
          {products.map((product, index) => (
            <li key={`${product.id}-${index}`} className={styles.item}>
              <ProductCard product={product} search={search} loading="lazy" />
            </li>
          ))}
        </ul>
      </ScrollableRow>
    </section>
  );
}
