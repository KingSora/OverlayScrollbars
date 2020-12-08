import { XY } from 'support';
export declare type OnEnvironmentChanged = (env: Environment) => void;
export interface Environment {
    _autoUpdateLoop: boolean;
    _nativeScrollbarSize: XY;
    _nativeScrollbarIsOverlaid: XY<boolean>;
    _nativeScrollbarStyling: boolean;
    _rtlScrollBehavior: {
        n: boolean;
        i: boolean;
    };
    _flexboxGlue: boolean;
    _addListener(listener: OnEnvironmentChanged): void;
    _removeListener(listener: OnEnvironmentChanged): void;
}
export declare const getEnvironment: () => Environment;
