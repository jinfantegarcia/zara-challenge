import type { ProductDetail } from '@/types/product';
import styles from './ProductSpecifications.module.scss';

const ROWS: Array<{ label: string; value: (product: ProductDetail) => string }> = [
  { label: 'Brand', value: (product) => product.brand },
  { label: 'Name', value: (product) => product.name },
  { label: 'Description', value: (product) => product.description },
  { label: 'Screen', value: (product) => product.specs.screen },
  { label: 'Resolution', value: (product) => product.specs.resolution },
  { label: 'Processor', value: (product) => product.specs.processor },
  { label: 'Main Camera', value: (product) => product.specs.mainCamera },
  { label: 'Selfie Camera', value: (product) => product.specs.selfieCamera },
  { label: 'Battery', value: (product) => product.specs.battery },
  { label: 'OS', value: (product) => product.specs.os },
  { label: 'Screen Refresh Rate', value: (product) => product.specs.screenRefreshRate },
];

export default function ProductSpecifications({ product }: { product: ProductDetail }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>SPECIFICATIONS</h2>
      <table className={styles.table}>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className={styles.row}>
              <th scope="row" className={styles.label}>
                {row.label}
              </th>
              <td className={styles.value}>{row.value(product)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
