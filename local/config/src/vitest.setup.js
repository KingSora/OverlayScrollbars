import matchers from '@testing-library/jest-dom/matchers';
import { expect } from 'vitest';
import { mockAnimationApi, mockComputedStyles } from './mocks';

expect.extend(matchers);

mockAnimationApi();
mockComputedStyles();
