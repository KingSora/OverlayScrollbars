import { XY, PartialOptions } from 'support';
import { OverlayScrollbarsOptions } from 'options';
export interface InitializationStrategy {
    _padding: boolean;
    _content: boolean;
}
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
    _cssCustomProperties: boolean;
    _addListener(listener: OnEnvironmentChanged): void;
    _removeListener(listener: OnEnvironmentChanged): void;
    _getInitializationStrategy(): InitializationStrategy;
    _setInitializationStrategy(newInitializationStrategy: Partial<InitializationStrategy>): void;
    _getDefaultOptions(): OverlayScrollbarsOptions;
    _setDefaultOptions(newDefaultOptions: PartialOptions<OverlayScrollbarsOptions>): void;
    _defaultInitializationStrategy: InitializationStrategy;
    _defaultDefaultOptions: OverlayScrollbarsOptions;
}
export declare const getEnvironment: () => Environment;
