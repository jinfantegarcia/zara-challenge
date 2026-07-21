import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CartProvider, useCart } from '@/context/CartContext';
import type { ColorOption, StorageOption } from '@/types/product';
import ProductConfiguration from './ProductConfiguration';

const storageOptions: StorageOption[] = [
  { capacity: '256 GB', price: 1229 },
  { capacity: '512 GB', price: 1329 },
];

const colorOptions: ColorOption[] = [
  { name: 'Titanium Violet', hexCode: '#8E6F96', imageUrl: 'https://example.com/violet.webp' },
  { name: 'Titanium Black', hexCode: '#000000', imageUrl: 'https://example.com/black.webp' },
];

function CartCount() {
  const cart = useCart();
  return <span data-testid="cart-count">{cart.length}</span>;
}

function CartLines() {
  const cart = useCart();
  return <output data-testid="cart-lines">{JSON.stringify(cart)}</output>;
}

function renderConfiguration(props: Partial<ComponentProps<typeof ProductConfiguration>> = {}) {
  return render(
    <CartProvider>
      <ProductConfiguration
        productId="SMG-S24U"
        name="Galaxy S24 Ultra"
        brand="Samsung"
        storageOptions={storageOptions}
        colorOptions={colorOptions}
        minPrice={1229}
        {...props}
      />
      <CartCount />
      <CartLines />
    </CartProvider>,
  );
}

describe('ProductConfiguration', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows the "From" minimum price with no storage selected', () => {
    renderConfiguration();

    expect(screen.getByText('From 1229 EUR')).toBeInTheDocument();
  });

  it('replaces the "From" price with the selected storage price', () => {
    renderConfiguration();

    fireEvent.click(screen.getByRole('radio', { name: '512 GB' }));

    expect(screen.getByText('1329 EUR')).toBeInTheDocument();
    expect(screen.queryByText(/From/)).not.toBeInTheDocument();
  });

  it('renders no colour selected initially and no colour name shown', () => {
    renderConfiguration();

    for (const radio of screen.getAllByRole('radio', { name: /titanium/i })) {
      expect(radio).not.toBeChecked();
    }
    expect(screen.queryByText('Titanium Violet')).not.toBeInTheDocument();
  });

  it('shows the selected colour name and swaps the primary image', () => {
    renderConfiguration();

    fireEvent.click(screen.getByRole('radio', { name: 'Titanium Black' }));

    expect(screen.getByText('Titanium Black')).toBeInTheDocument();
    const image = screen.getByAltText('Samsung Galaxy S24 Ultra en Titanium Black');
    expect(image.getAttribute('src') ?? '').toContain(encodeURIComponent('black.webp'));
  });

  it('does not throw and disables AÑADIR when there are no colour options', () => {
    renderConfiguration({ colorOptions: [] });

    fireEvent.click(screen.getByRole('radio', { name: '256 GB' }));

    expect(screen.getByRole('button', { name: 'AÑADIR' })).toBeDisabled();
  });

  it('keeps AÑADIR disabled until both storage and colour are selected', () => {
    renderConfiguration();

    const addButton = screen.getByRole('button', { name: 'AÑADIR' });
    expect(addButton).toBeDisabled();

    fireEvent.click(screen.getByRole('radio', { name: '256 GB' }));
    expect(addButton).toBeDisabled();

    fireEvent.click(screen.getByRole('radio', { name: 'Titanium Violet' }));
    expect(addButton).toBeEnabled();
  });

  it('dispatches and persists the exact configured cart line', async () => {
    renderConfiguration();

    fireEvent.click(screen.getByRole('radio', { name: '512 GB' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Titanium Black' }));
    fireEvent.click(screen.getByRole('button', { name: 'AÑADIR' }));

    expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
    const expectedLine = {
      productId: 'SMG-S24U',
      name: 'Galaxy S24 Ultra',
      brand: 'Samsung',
      imageUrl: 'https://example.com/black.webp',
      capacity: '512 GB',
      colorName: 'Titanium Black',
      price: 1329,
    };
    expect(JSON.parse(screen.getByTestId('cart-lines').textContent ?? '[]')).toEqual([
      expectedLine,
    ]);
    await waitFor(() => {
      expect(JSON.parse(window.localStorage.getItem('smartphone-store:cart:v1') ?? '[]')).toEqual([
        expectedLine,
      ]);
    });
  });

  it('creates independent lines when the same configuration is added twice', () => {
    renderConfiguration();

    fireEvent.click(screen.getByRole('radio', { name: '512 GB' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Titanium Black' }));
    const addButton = screen.getByRole('button', { name: 'AÑADIR' });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
  });

  it('resets both selections when the component remounts under a different product id', () => {
    const { rerender } = render(
      <CartProvider>
        <ProductConfiguration
          key="SMG-S24U"
          productId="SMG-S24U"
          name="Galaxy S24 Ultra"
          brand="Samsung"
          storageOptions={storageOptions}
          colorOptions={colorOptions}
          minPrice={1229}
        />
      </CartProvider>,
    );

    fireEvent.click(screen.getByRole('radio', { name: '512 GB' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Titanium Black' }));
    expect(screen.getByRole('button', { name: 'AÑADIR' })).toBeEnabled();

    rerender(
      <CartProvider>
        <ProductConfiguration
          key="APL-I15PM"
          productId="APL-I15PM"
          name="iPhone 15 Pro Max"
          brand="Apple"
          storageOptions={storageOptions}
          colorOptions={colorOptions}
          minPrice={999}
        />
      </CartProvider>,
    );

    expect(screen.getByText('From 999 EUR')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'AÑADIR' })).toBeDisabled();
  });
});
