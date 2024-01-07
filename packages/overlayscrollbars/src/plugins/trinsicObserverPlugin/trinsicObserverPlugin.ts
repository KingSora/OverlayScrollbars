import { createTrinsicObserver } from '~/observers/trinsicObserver';
import type { StaticPlugin } from '../plugins';

export const trinsicObserverPluginName = '__osTrinsicObserverPlugin';

export const TrinsicObserverPlugin = /* @__PURE__ */ (() => ({
  [trinsicObserverPluginName]: {
    static: () => createTrinsicObserver,
  },
}))() satisfies StaticPlugin<typeof trinsicObserverPluginName>;
