import type { ProductListItem } from '@/types/product';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.scss';

export default function ProductGrid({
  products,
  search,
}: {
  products: ProductListItem[];
  search?: string;
}) {
  return (
    <ul className={styles.grid}>
      {products.map((product, index) => (
        <li key={`${product.id}-${index}`}>
          <ProductCard product={product} search={search} />
        </li>
      ))}
    </ul>
  );
}
