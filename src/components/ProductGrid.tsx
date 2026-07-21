import type { ProductListItem } from '@/types/product';
import ProductCard from './ProductCard';
import styles from './ProductGrid.module.scss';

export default function ProductGrid({ products }: { products: ProductListItem[] }) {
  return (
    <ul className={styles.grid}>
      {products.map((product, index) => (
        <li key={`${product.id}-${index}`}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
