'use client';

import { useState } from 'react';
import type { StorageOption } from '@/types/product';
import StorageSelector from './StorageSelector';
import styles from './ProductConfiguration.module.scss';

export default function ProductConfiguration({
  storageOptions,
  minPrice,
}: {
  storageOptions: StorageOption[];
  minPrice: number;
}) {
  const [selectedCapacity, setSelectedCapacity] = useState<string | undefined>(undefined);
  const selectedOption = storageOptions.find((option) => option.capacity === selectedCapacity);
  const displayPrice = selectedOption ? `${selectedOption.price} EUR` : `From ${minPrice} EUR`;

  return (
    <>
      <p className={styles.price}>{displayPrice}</p>
      <StorageSelector
        options={storageOptions}
        selected={selectedCapacity}
        onSelect={setSelectedCapacity}
      />
    </>
  );
}
