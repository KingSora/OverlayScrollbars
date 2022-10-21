import { describe, it, expect, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/svelte';
import { OverlayScrollbarsComponent } from '~/overlayscrollbars-svelte';

describe('Hello.svelte', () => {
  // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
  afterEach(() => cleanup());

  it('mounts', () => {
    const { container } = render(OverlayScrollbarsComponent);
    expect(container).toBeTruthy();
    expect(container.innerHTML).toContain('Welcome to your library project');
  });
});
