import { XY, PartialOptions } from 'support';
import { OSOptions } from 'options';
export interface InitializationStrategy {
    _padding: boolean;
    _content: boolean;
}
export declare type OnEnvironmentChanged = (env: Environment) => void;
export interface Environment {
    _nativeScrollbarSize: XY;
    _nativeScrollbarIsOverlaid: XY<boolean>;
    _nativeScrollbarStyling: boolean;
    _rtlScrollBehavior: {
        n: boolean;
        i: boolean;
    };
    _flexboxGlue: boolean;
    _cssCustomProperties: boolean;
    _addListener(listener: OnEnvironmentChanged): void;
    _removeListener(listener: OnEnvironmentChanged): void;
    _getInitializationStrategy(): InitializationStrategy;
    _setInitializationStrategy(newInitializationStrategy: Partial<InitializationStrategy>): void;
    _getDefaultOptions(): OSOptions;
    _setDefaultOptions(newDefaultOptions: PartialOptions<OSOptions>): void;
    _defaultInitializationStrategy: InitializationStrategy;
    _defaultDefaultOptions: OSOptions;
}
export declare const getEnvironment: () => Environment;
