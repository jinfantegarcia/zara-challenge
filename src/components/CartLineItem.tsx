import Image from 'next/image';
import type { CartLine } from '@/types/cart';
import styles from './CartLineItem.module.scss';

export default function CartLineItem({ line, onRemove }: { line: CartLine; onRemove: () => void }) {
  return (
    <li className={styles.item}>
      <div className={styles.imageWrapper}>
        <Image
          src={line.imageUrl}
          alt={`${line.brand} ${line.name} en ${line.colorName}`}
          fill
          sizes="(min-width: 1280px) 262px, 160px"
          className={styles.image}
        />
      </div>
      <div className={styles.infoDelete}>
        <div className={styles.info}>
          <div className={styles.nameGroup}>
            <p className={styles.name}>{line.name}</p>
            <p className={styles.spec}>
              {line.capacity} | {line.colorName}
            </p>
          </div>
          <p className={styles.price}>{line.price} EUR</p>
        </div>
        <button type="button" className={styles.remove} onClick={onRemove}>
          Eliminar
        </button>
      </div>
    </li>
  );
}
