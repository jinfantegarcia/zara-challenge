'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import styles from './SearchInput.module.scss';

const DEBOUNCE_MS = 300;

function ClearIcon() {
  return (
    <svg
      className={styles.clearIcon}
      viewBox="0 0 20 20"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M9.22887 9.855L6 13.0839L6.62613 13.71L9.855 10.4811L13.0839 13.71L13.71 13.0839L10.4811 9.855L13.71 6.62613L13.0839 6L9.855 9.22887L6.62613 6L6 6.62613L9.22887 9.855Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function SearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [, startTransition] = useTransition();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  function replaceSearchParam(term: string) {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = term.trim();

    if (trimmed) {
      params.set('search', trimmed);
    } else {
      params.delete('search');
    }

    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname);
    });
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;
    setValue(nextValue);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => replaceSearchParam(nextValue), DEBOUNCE_MS);
  }

  function handleClear() {
    clearTimeout(timeoutRef.current);
    setValue('');
    replaceSearchParam('');
  }

  return (
    <div className={styles.search}>
      <label htmlFor="search" className="visually-hidden">
        Search for a smartphone
      </label>
      <input
        id="search"
        type="search"
        className={styles.input}
        placeholder="Search for a smartphone..."
        value={value}
        onChange={handleChange}
      />
      {value && (
        <button
          type="button"
          className={styles.clearButton}
          aria-label="Clear search"
          onClick={handleClear}
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
}
