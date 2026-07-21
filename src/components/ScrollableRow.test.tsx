import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ScrollableRow from './ScrollableRow';

function mockScrollMetrics(
  el: HTMLElement,
  { scrollWidth, clientWidth }: { scrollWidth: number; clientWidth: number },
) {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth });
}

function renderRow() {
  const utils = render(
    <ScrollableRow ariaLabel="Similar items">
      <span>content</span>
    </ScrollableRow>,
  );
  const region = screen.getByRole('region', { name: 'Similar items' });
  const track = region.nextElementSibling as HTMLElement;
  const thumb = track.firstElementChild as HTMLElement;
  return { ...utils, region, track, thumb };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('ScrollableRow', () => {
  it('exposes a keyboard-focusable region with the given label', () => {
    const { region } = renderRow();

    expect(region).toHaveAttribute('tabindex', '0');
  });

  it('keeps the thumb at full width when the content does not overflow', () => {
    const { region, thumb } = renderRow();

    mockScrollMetrics(region, { scrollWidth: 400, clientWidth: 400 });
    fireEvent.scroll(region);

    expect(thumb.style.width).toBe('100%');
    expect(thumb.style.left).toBe('0%');
  });

  it('sizes and moves the thumb proportionally to the scroll position', () => {
    const { region, thumb } = renderRow();

    mockScrollMetrics(region, { scrollWidth: 1000, clientWidth: 500 });
    region.scrollLeft = 250;
    fireEvent.scroll(region);

    // clientWidth/scrollWidth = 50% width; scrolled halfway -> left = 25%.
    expect(thumb.style.width).toBe('50%');
    expect(thumb.style.left).toBe('25%');
  });

  it('scrolls the region when the track is clicked', () => {
    const { region, track } = renderRow();

    mockScrollMetrics(region, { scrollWidth: 1000, clientWidth: 500 });
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 500,
      top: 0,
      right: 500,
      bottom: 4,
      height: 4,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent(track, new MouseEvent('pointerdown', { bubbles: true, clientX: 500 }));

    // ratio 1 -> scrollLeft = min(maxScroll, scrollWidth - clientWidth / 2) = 500.
    expect(region.scrollLeft).toBe(500);
  });

  it('keeps following the pointer while dragging and stops on release', () => {
    const { region, track } = renderRow();

    mockScrollMetrics(region, { scrollWidth: 1000, clientWidth: 500 });
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 500,
      top: 0,
      right: 500,
      bottom: 4,
      height: 4,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent(track, new MouseEvent('pointerdown', { bubbles: true, clientX: 0 }));
    expect(region.scrollLeft).toBe(0);

    fireEvent(window, new MouseEvent('pointermove', { clientX: 250 }));
    const draggedPosition = region.scrollLeft;
    expect(draggedPosition).toBeGreaterThan(0);

    fireEvent(window, new MouseEvent('pointerup', {}));
    fireEvent(window, new MouseEvent('pointermove', { clientX: 0 }));
    expect(region.scrollLeft).toBe(draggedPosition);
  });
});
