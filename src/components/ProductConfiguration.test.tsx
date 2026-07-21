import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { StorageOption } from '@/types/product';
import ProductConfiguration from './ProductConfiguration';

const storageOptions: StorageOption[] = [
  { capacity: '256 GB', price: 1229 },
  { capacity: '512 GB', price: 1329 },
  { capacity: '1TB', price: 1529 },
];

describe('ProductConfiguration', () => {
  it('shows the "From" minimum price with no option selected', () => {
    render(<ProductConfiguration storageOptions={storageOptions} minPrice={1229} />);

    expect(screen.getByText('From 1229 EUR')).toBeInTheDocument();
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).not.toBeChecked();
    }
  });

  it('renders each capacity exactly as returned by the API, including inconsistent formatting', () => {
    render(<ProductConfiguration storageOptions={storageOptions} minPrice={1229} />);

    expect(screen.getByRole('radio', { name: '256 GB' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '512 GB' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '1TB' })).toBeInTheDocument();
  });

  it('replaces the "From" price with the selected option\'s exact price', () => {
    render(<ProductConfiguration storageOptions={storageOptions} minPrice={1229} />);

    fireEvent.click(screen.getByRole('radio', { name: '512 GB' }));

    expect(screen.getByText('1329 EUR')).toBeInTheDocument();
    expect(screen.queryByText(/From/)).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '512 GB' })).toBeChecked();
  });

  it('never derives the selected or initial price from basePrice', () => {
    render(<ProductConfiguration storageOptions={storageOptions} minPrice={1229} />);

    fireEvent.click(screen.getByRole('radio', { name: '1TB' }));

    expect(screen.getByText('1529 EUR')).toBeInTheDocument();
  });

  it('only allows one selected option at a time', () => {
    render(<ProductConfiguration storageOptions={storageOptions} minPrice={1229} />);

    fireEvent.click(screen.getByRole('radio', { name: '256 GB' }));
    fireEvent.click(screen.getByRole('radio', { name: '512 GB' }));

    expect(screen.getByRole('radio', { name: '256 GB' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: '512 GB' })).toBeChecked();
  });
});
