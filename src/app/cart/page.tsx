'use client';

import Link from 'next/link';
import CartLineItem from '@/components/CartLineItem';
import { useCart, useCartDispatch } from '@/context/CartContext';
import styles from './page.module.scss';

export default function CartPage() {
  const cart = useCart();
  const dispatch = useCartDispatch();
  const total = cart.reduce((sum, line) => sum + line.price, 0);

  function handleRemove(index: number) {
    dispatch({ type: 'REMOVE_ITEM', payload: { index } });
  }

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.heading}>{`CART (${cart.length})`}</h1>
        {cart.length > 0 && (
          <ul className={styles.list}>
            {cart.map((line, index) => (
              <CartLineItem
                key={`${line.productId}-${line.capacity}-${line.colorName}-${index}`}
                line={line}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </ul>
        )}
      </div>
      <div className={styles.footer}>
        {cart.length > 0 && (
          <div className={styles.total}>
            <span>Total</span>
            <span>{total} EUR</span>
          </div>
        )}
        <Link href="/" className={styles.continue}>
          CONTINUE SHOPPING
        </Link>
        {cart.length > 0 && (
          <button type="button" className={styles.pay}>
            PAY
          </button>
        )}
      </div>
    </main>
  );
}
