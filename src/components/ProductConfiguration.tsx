'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCartDispatch } from '@/context/CartContext';
import type { ColorOption, StorageOption } from '@/types/product';
import ColorSelector from './ColorSelector';
import StorageSelector from './StorageSelector';
import styles from './ProductConfiguration.module.scss';

export default function ProductConfiguration({
  productId,
  name,
  brand,
  storageOptions,
  colorOptions,
  minPrice,
}: {
  productId: string;
  name: string;
  brand: string;
  storageOptions: StorageOption[];
  colorOptions: ColorOption[];
  minPrice: number;
}) {
  const [selectedCapacity, setSelectedCapacity] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>(undefined);
  const dispatch = useCartDispatch();
  const router = useRouter();

  const selectedStorage = storageOptions.find((option) => option.capacity === selectedCapacity);
  const displayPrice = selectedStorage ? `${selectedStorage.price} EUR` : `From ${minPrice} EUR`;
  const previewImage = selectedColor ?? colorOptions[0];
  const canAdd = Boolean(selectedStorage && selectedColor);

  function handleAdd() {
    if (!selectedStorage || !selectedColor) {
      return;
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId,
        name,
        brand,
        imageUrl: selectedColor.imageUrl,
        capacity: selectedStorage.capacity,
        colorName: selectedColor.name,
        price: selectedStorage.price,
      },
    });
    router.push('/cart');
  }

  return (
    <>
      {previewImage && (
        <div className={styles.imageWrapper}>
          <Image
            src={previewImage.imageUrl}
            alt={selectedColor ? `${brand} ${name} en ${selectedColor.name}` : `${brand} ${name}`}
            fill
            priority
            sizes="(min-width: 1280px) 510px, (min-width: 768px) 337px, 260px"
            className={styles.image}
          />
        </div>
      )}
      <div className={styles.info}>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.price}>{displayPrice}</p>
        <StorageSelector
          options={storageOptions}
          selected={selectedCapacity}
          onSelect={setSelectedCapacity}
        />
        <ColorSelector
          options={colorOptions}
          selected={selectedColor?.name}
          onSelect={setSelectedColor}
        />
        <button type="button" className={styles.addButton} disabled={!canAdd} onClick={handleAdd}>
          AÑADIR
        </button>
      </div>
    </>
  );
}
