import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LoadingBar from './LoadingBar';

describe('LoadingBar', () => {
  it('renders a purely decorative element hidden from assistive technology', () => {
    const { container } = render(<LoadingBar />);

    const track = container.firstElementChild;
    expect(track).toHaveAttribute('aria-hidden', 'true');
    expect(track?.firstElementChild).not.toBeNull();
  });
});
