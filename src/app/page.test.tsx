import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the store heading', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { level: 1, name: /smartphone store/i }),
    ).toBeInTheDocument();
  });
});
