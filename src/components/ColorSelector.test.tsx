import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ColorOption } from '@/types/product';
import ColorSelector from './ColorSelector';

const options: ColorOption[] = [
  { name: 'Titanium Violet', hexCode: '#8E6F96', imageUrl: 'https://example.com/violet.webp' },
  { name: 'Titanium Black', hexCode: '#000000', imageUrl: 'https://example.com/black.webp' },
];

describe('ColorSelector', () => {
  it('renders the literal colour heading and one radio per option with no initial selection', () => {
    render(<ColorSelector options={options} selected={undefined} onSelect={vi.fn()} />);

    expect(screen.getByRole('group', { name: 'COLOR. PICK YOUR FAVOURITE.' })).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(2);
    for (const radio of radios) {
      expect(radio).not.toBeChecked();
    }
  });

  it("exposes each swatch's full colour name as its accessible label", () => {
    render(<ColorSelector options={options} selected={undefined} onSelect={vi.fn()} />);

    expect(screen.getByRole('radio', { name: 'Titanium Violet' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Titanium Black' })).toBeInTheDocument();
  });

  it('calls onSelect with the option when a colour is chosen', () => {
    const onSelect = vi.fn();
    render(<ColorSelector options={options} selected={undefined} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Titanium Black' }));

    expect(onSelect).toHaveBeenCalledWith(options[1]);
  });

  it('applies the selected treatment only to the chosen swatch and shows its name', () => {
    render(<ColorSelector options={options} selected="Titanium Violet" onSelect={vi.fn()} />);

    const selectedLabel = screen.getByRole('radio', { name: 'Titanium Violet' }).closest('label');
    const otherLabel = screen.getByRole('radio', { name: 'Titanium Black' }).closest('label');

    expect(selectedLabel?.className).toMatch(/selected/);
    expect(otherLabel?.className).not.toMatch(/selected/);
    expect(screen.getByText('Titanium Violet')).toBeInTheDocument();
  });

  it('renders nothing when there are no colour options', () => {
    const { container } = render(
      <ColorSelector options={[]} selected={undefined} onSelect={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
