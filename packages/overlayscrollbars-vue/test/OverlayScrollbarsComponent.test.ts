import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { OverlayScrollbarsComponent } from '~/overlayscrollbars-vue';

describe('OverlayScrollbarsComponent', () => {
  it('renders properly', () => {
    const wrapper = mount(OverlayScrollbarsComponent, { propsData: { msg: 'Hello Vitest' } });
    expect(wrapper.text()).toContain('Hello Vitest');
  });
});
