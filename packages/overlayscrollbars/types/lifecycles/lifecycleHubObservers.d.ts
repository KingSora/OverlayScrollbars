import { LifecycleHub, LifecycleCheckOption, LifecycleUpdateHints } from 'lifecycles/lifecycleHub';
export declare const lifecycleHubOservers: (instance: LifecycleHub, updateLifecycles: (updateHints?: Partial<LifecycleUpdateHints> | null | undefined) => unknown) => {
    _trinsicObserver: false | import("observers/trinsicObserver").TrinsicObserver;
    _sizeObserver: import("observers/sizeObserver").SizeObserver;
    _updateObserverOptions: (checkOption: LifecycleCheckOption) => void;
};
