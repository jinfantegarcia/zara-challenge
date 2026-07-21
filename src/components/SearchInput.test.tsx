import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SearchInput from './SearchInput';

const { replaceMock, searchParamsRef } = vi.hoisted(() => ({
  replaceMock: vi.fn(),
  searchParamsRef: { current: new URLSearchParams() },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: replaceMock }),
  useSearchParams: () => searchParamsRef.current,
}));

describe('SearchInput', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    replaceMock.mockClear();
    searchParamsRef.current = new URLSearchParams();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the Figma placeholder and an accessible label', () => {
    render(<SearchInput defaultValue="" />);

    const input = screen.getByLabelText(/search for a smartphone/i);
    expect(input).toHaveAttribute('placeholder', 'Search for a smartphone...');
    expect(input).toHaveAttribute('type', 'search');
  });

  it('does not show the clear button when the query is empty', () => {
    render(<SearchInput defaultValue="" />);

    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
  });

  it('replaces the URL with the debounced value after ~300ms', () => {
    render(<SearchInput defaultValue="" />);

    fireEvent.change(screen.getByLabelText(/search for a smartphone/i), {
      target: { value: 'pixel' },
    });
    expect(replaceMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(replaceMock).toHaveBeenCalledWith('/?search=pixel');
  });

  it('cancels a superseded debounce timer so only the final value is applied', () => {
    render(<SearchInput defaultValue="" />);

    const input = screen.getByLabelText(/search for a smartphone/i);
    fireEvent.change(input, { target: { value: 'pix' } });
    vi.advanceTimersByTime(200);
    fireEvent.change(input, { target: { value: 'pixel' } });
    vi.advanceTimersByTime(300);

    expect(replaceMock).toHaveBeenCalledTimes(1);
    expect(replaceMock).toHaveBeenCalledWith('/?search=pixel');
  });

  it('clears the query and removes the search param immediately', () => {
    render(<SearchInput defaultValue="pixel" />);

    fireEvent.click(screen.getByRole('button', { name: /clear search/i }));

    expect(replaceMock).toHaveBeenCalledWith('/');
    expect(screen.getByLabelText(/search for a smartphone/i)).toHaveValue('');
  });

  it('synchronizes the displayed value when the canonical query prop changes', () => {
    const { rerender } = render(<SearchInput defaultValue="pixel" />);
    expect(screen.getByLabelText(/search for a smartphone/i)).toHaveValue('pixel');

    rerender(<SearchInput defaultValue="galaxy" />);
    expect(screen.getByLabelText(/search for a smartphone/i)).toHaveValue('galaxy');
  });
});
