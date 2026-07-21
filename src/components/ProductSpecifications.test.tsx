import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { productDetailFixture } from '@/test/mocks/fixtures/products';
import ProductSpecifications from './ProductSpecifications';

const EXPECTED_ROWS: Array<[string, string]> = [
  ['Brand', productDetailFixture.brand],
  ['Name', productDetailFixture.name],
  ['Description', productDetailFixture.description],
  ['Screen', productDetailFixture.specs.screen],
  ['Resolution', productDetailFixture.specs.resolution],
  ['Processor', productDetailFixture.specs.processor],
  ['Main Camera', productDetailFixture.specs.mainCamera],
  ['Selfie Camera', productDetailFixture.specs.selfieCamera],
  ['Battery', productDetailFixture.specs.battery],
  ['OS', productDetailFixture.specs.os],
  ['Screen Refresh Rate', productDetailFixture.specs.screenRefreshRate],
];

describe('ProductSpecifications', () => {
  it('renders the literal SPECIFICATIONS heading', () => {
    render(<ProductSpecifications product={productDetailFixture} />);

    expect(screen.getByRole('heading', { name: 'SPECIFICATIONS' })).toBeInTheDocument();
  });

  it('renders exactly eleven rows in the required order with their values', () => {
    render(<ProductSpecifications product={productDetailFixture} />);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(EXPECTED_ROWS.length);

    rows.forEach((row, index) => {
      const [label, value] = EXPECTED_ROWS[index]!;
      expect(row).toHaveTextContent(label);
      expect(row).toHaveTextContent(value);
    });
  });

  it('never renders the rating value', () => {
    render(<ProductSpecifications product={productDetailFixture} />);

    expect(screen.queryByText(String(productDetailFixture.rating))).not.toBeInTheDocument();
  });
});
