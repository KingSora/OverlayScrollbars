import { XY } from 'support';
declare type OnEnvironmentChanged = (env: Environment) => void;
export declare class Environment {
    #private;
    autoUpdateLoop: boolean;
    nativeScrollbarSize: XY;
    nativeScrollbarIsOverlaid: XY<boolean>;
    nativeScrollbarStyling: boolean;
    rtlScrollBehavior: {
        n: boolean;
        i: boolean;
    };
    supportPassiveEvents: boolean;
    supportResizeObserver: boolean;
    constructor();
    addListener(listener: OnEnvironmentChanged): void;
    removeListener(listener: OnEnvironmentChanged): void;
}
export {};
