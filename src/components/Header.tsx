'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './Header.module.scss';

function LogoMark() {
  return (
    <svg
      className={styles.logoMark}
      viewBox="0 0 29 24"
      width="29"
      height="24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12.8454 2.23917C11.485 0.857001 9.59259 0 7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15C9.50619 15 11.3284 14.2123 12.6742 12.9293C11.6202 11.4554 11 9.65014 11 7.7C11 5.64651 11.6877 3.75364 12.8454 2.23917Z"
        transform="translate(0 5)"
        fill="currentColor"
      />
      <rect x="18.43" y="5.43" width="3.14" height="14.57" fill="currentColor" />
      <rect
        x="18.43"
        y="5.43"
        width="3.14"
        height="14.57"
        transform="rotate(45 20 12.71)"
        fill="currentColor"
      />
      <rect
        x="18.43"
        y="5.43"
        width="3.14"
        height="14.57"
        transform="rotate(90 20 12.71)"
        fill="currentColor"
      />
      <rect
        x="18.43"
        y="5.43"
        width="3.14"
        height="14.57"
        transform="rotate(135 20 12.71)"
        fill="currentColor"
      />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      className={styles.bagIcon}
      viewBox="0 0 12.2353 16"
      width="18"
      height="16"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.47059 0H3.76471V3.76471H0V16H12.2353V3.76471H8.47059V0ZM7.52941 4.70588V7.05882H8.47059V4.70588H11.2941V15.0588H0.941176V4.70588H3.76471V7.05882H4.70588V4.70588H7.52941ZM7.52941 3.76471V0.941176H4.70588V3.76471H7.52941Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const cart = useCart();
  const isCartRoute = pathname === '/cart';

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="Home">
        <LogoMark />
        <span className={styles.logoText}>MBST</span>
      </Link>
      {!isCartRoute && (
        <Link href="/cart" className={styles.cart} aria-label={`Cart, ${cart.length} items`}>
          <BagIcon />
          <span aria-hidden="true">{cart.length}</span>
        </Link>
      )}
    </header>
  );
}
