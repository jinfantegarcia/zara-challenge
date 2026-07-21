import Link from 'next/link';
import ProductConfiguration from '@/components/ProductConfiguration';
import { getProductById } from '@/services/api';
import styles from './page.module.scss';

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string }>;
}

function ChevronLeftIcon() {
  return (
    <svg
      className={styles.backIcon}
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.8232 5.64645L12.5303 6.35355L8.88388 10L12.5303 13.6464L11.8232 14.3536L7.46967 10L11.8232 5.64645Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default async function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
  const [{ id }, { search }] = await Promise.all([params, searchParams]);
  const product = await getProductById(id);
  const fromPrice = Math.min(...product.storageOptions.map((option) => option.price));
  const backHref = search ? `/?search=${encodeURIComponent(search)}` : '/';

  return (
    <main>
      <div className={styles.backRow}>
        <Link href={backHref} className={styles.back}>
          <ChevronLeftIcon />
          <span>Back</span>
        </Link>
      </div>
      <div className={styles.content}>
        <div className={styles.productInfo}>
          <ProductConfiguration
            key={product.id}
            productId={product.id}
            name={product.name}
            brand={product.brand}
            storageOptions={product.storageOptions}
            colorOptions={product.colorOptions}
            minPrice={fromPrice}
          />
        </div>
      </div>
    </main>
  );
}
