import { Environment } from 'environment/environment';

export * from 'environment/environment';
export type OSEnvironment = Omit<Environment, 'addListener' | 'removeListener'>;
