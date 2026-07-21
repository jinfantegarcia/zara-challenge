import Image from 'next/image';
import Link from 'next/link';
import type { ProductListItem } from '@/types/product';
import styles from './ProductCard.module.scss';

export default function ProductCard({
  product,
  search,
  loading = 'lazy',
}: {
  product: ProductListItem;
  search?: string;
  loading?: 'lazy' | 'eager';
}) {
  const href = search
    ? `/product/${encodeURIComponent(product.id)}?search=${encodeURIComponent(search)}`
    : `/product/${encodeURIComponent(product.id)}`;

  return (
    <Link href={href} aria-label={`${product.brand} ${product.name}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={product.imageUrl}
          alt=""
          fill
          loading={loading}
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 50vw, 100vw"
          className={styles.image}
        />
      </div>
      <div className={styles.info}>
        <div className={styles.brandName}>
          <p className={styles.brand}>{product.brand}</p>
          <p className={styles.name}>{product.name}</p>
        </div>
        <p className={styles.price}>{product.basePrice} EUR</p>
      </div>
    </Link>
  );
}
