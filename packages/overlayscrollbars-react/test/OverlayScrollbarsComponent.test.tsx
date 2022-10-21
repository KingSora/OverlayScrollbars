import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OverlayScrollbarsComponent } from '~/overlayscrollbars-react';

test('renders learn react link', () => {
  render(<OverlayScrollbarsComponent msg="hi" />);
  const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
