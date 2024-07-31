import { builtinEnvironments } from 'vitest/environments';

export default {
  name: String(performance.now()),
  ...builtinEnvironments.jsdom,
};
