import { assignDeep, each, isArray } from 'support';
import { OverlayScrollbars, OverlayScrollbarsStatic } from 'overlayscrollbars';

export type OSPluginInstance =
  | Record<string, unknown>
  | ((staticObj: OverlayScrollbarsStatic, instanceObj: OverlayScrollbars) => void);
export type OSPlugin<T extends OSPluginInstance = OSPluginInstance> = [string, T];

const pluginRegistry: Record<string, OSPluginInstance> = {};

export const getPlugins = () => assignDeep({}, pluginRegistry);

export const addPlugin = (addedPlugin: OSPlugin | OSPlugin[]) =>
  each((isArray(addedPlugin) ? addedPlugin : [addedPlugin]) as OSPlugin[], (plugin) => {
    pluginRegistry[plugin[0]] = plugin[1];
  });
