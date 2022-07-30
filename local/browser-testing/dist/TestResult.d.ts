import { waitForOptions } from '@testing-library/dom';
export declare const setTestResult: (result: boolean | null) => void;
export declare const testPassed: () => boolean;
export declare const waitForOrFailTest: <T>(callback: () => T | Promise<T>, options?: waitForOptions) => Promise<T>;
