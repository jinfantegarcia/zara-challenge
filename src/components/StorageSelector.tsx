import type { StorageOption } from '@/types/product';
import styles from './StorageSelector.module.scss';

export default function StorageSelector({
  options,
  selected,
  onSelect,
}: {
  options: StorageOption[];
  selected: string | undefined;
  onSelect: (capacity: string) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>STORAGE ¿HOW MUCH SPACE DO YOU NEED?</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label
            key={option.capacity}
            className={
              selected === option.capacity ? `${styles.option} ${styles.selected}` : styles.option
            }
          >
            <input
              type="radio"
              name="storage"
              className={styles.input}
              value={option.capacity}
              checked={selected === option.capacity}
              onChange={() => onSelect(option.capacity)}
            />
            {option.capacity}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
