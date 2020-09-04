import { Environment } from 'environment/environment';
export * from 'environment/environment';
export declare type OSEnvironment = Omit<Environment, 'addListener' | 'removeListener'>;
