import { XY } from 'support';
declare type OnEnvironmentChanged = (env: Environment) => void;
export declare class Environment {
    #private;
    _autoUpdateLoop: boolean;
    _nativeScrollbarSize: XY;
    _nativeScrollbarIsOverlaid: XY<boolean>;
    _nativeScrollbarStyling: boolean;
    _rtlScrollBehavior: {
        n: boolean;
        i: boolean;
    };
    _supportPassiveEvents: boolean;
    _supportResizeObserver: boolean;
    constructor();
    addListener(listener: OnEnvironmentChanged): void;
    removeListener(listener: OnEnvironmentChanged): void;
}
export {};
