import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { StorageOption } from '@/types/product';
import StorageSelector from './StorageSelector';

const options: StorageOption[] = [
  { capacity: '256 GB', price: 1229 },
  { capacity: '512 GB', price: 1329 },
];

describe('StorageSelector', () => {
  it('renders the literal storage heading and a radiogroup with one radio per option', () => {
    render(<StorageSelector options={options} selected={undefined} onSelect={vi.fn()} />);

    expect(
      screen.getByRole('group', { name: 'STORAGE ¿HOW MUCH SPACE DO YOU NEED?' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });

  it('calls onSelect with the capacity when a keyboard user activates a radio', () => {
    const onSelect = vi.fn();
    render(<StorageSelector options={options} selected={undefined} onSelect={onSelect} />);

    const radio = screen.getByRole('radio', { name: '512 GB' });
    radio.focus();
    fireEvent.click(radio);

    expect(onSelect).toHaveBeenCalledWith('512 GB');
  });

  it('applies the selected visual treatment only to the chosen option', () => {
    render(<StorageSelector options={options} selected="256 GB" onSelect={vi.fn()} />);

    const selectedLabel = screen.getByRole('radio', { name: '256 GB' }).closest('label');
    const otherLabel = screen.getByRole('radio', { name: '512 GB' }).closest('label');

    expect(selectedLabel?.className).toMatch(/selected/);
    expect(otherLabel?.className).not.toMatch(/selected/);
  });

  it('gives the focused control a visible focus indication independent of selection', () => {
    render(<StorageSelector options={options} selected="256 GB" onSelect={vi.fn()} />);

    const unselectedRadio = screen.getByRole('radio', { name: '512 GB' });
    unselectedRadio.focus();

    expect(unselectedRadio).toHaveFocus();
  });
});
