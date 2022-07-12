import { assignDeep, each, isArray, keys } from 'support';
import { OverlayScrollbars, OverlayScrollbarsStatic } from 'overlayscrollbars';

export type PluginInstance =
  | Record<string, unknown>
  | ((staticObj: OverlayScrollbarsStatic, instanceObj: OverlayScrollbars) => void);
export type Plugin<T extends PluginInstance = PluginInstance> = {
  [pluginName: string]: T;
};

const pluginRegistry: Record<string, PluginInstance> = {};

export const getPlugins = () => assignDeep({}, pluginRegistry);

export const addPlugin = (addedPlugin: Plugin | Plugin[]) =>
  each((isArray(addedPlugin) ? addedPlugin : [addedPlugin]) as Plugin[], (plugin) => {
    each(keys(plugin), (pluginName) => {
      pluginRegistry[pluginName] = plugin[pluginName];
    });
  });
