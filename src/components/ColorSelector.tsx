'use client';

import type { CSSProperties } from 'react';
import type { ColorOption } from '@/types/product';
import styles from './ColorSelector.module.scss';

export default function ColorSelector({
  options,
  selected,
  onSelect,
}: {
  options: ColorOption[];
  selected: string | undefined;
  onSelect: (option: ColorOption) => void;
}) {
  if (options.length === 0) {
    return null;
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>COLOR. PICK YOUR FAVOURITE.</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label
            key={option.name}
            className={
              selected === option.name ? `${styles.swatch} ${styles.selected}` : styles.swatch
            }
          >
            <input
              type="radio"
              name="color"
              className={styles.input}
              aria-label={option.name}
              value={option.name}
              checked={selected === option.name}
              onChange={() => onSelect(option)}
            />
            <span
              className={styles.swatchFill}
              style={{ '--swatch-color': option.hexCode } as CSSProperties}
            />
          </label>
        ))}
      </div>
      {selected && <p className={styles.selectedName}>{selected}</p>}
    </fieldset>
  );
}
