import { each, isArray, keys, push } from 'support';
import { OverlayScrollbars, OverlayScrollbarsStatic } from 'overlayscrollbars';

export type PluginInstance =
  | Record<string, unknown>
  | ((staticObj?: OverlayScrollbarsStatic, instanceObj?: OverlayScrollbars) => void);
export type Plugin<T extends PluginInstance = PluginInstance> = {
  [pluginName: string]: T;
};

const pluginRegistry: Record<string, PluginInstance> = {};

export const getPlugins = () => pluginRegistry;

export const addPlugin = (addedPlugin: Plugin | Plugin[]): Plugin[] => {
  const result: Plugin[] = [];
  each((isArray(addedPlugin) ? addedPlugin : [addedPlugin]) as Plugin[], (plugin) => {
    // multiple "sub-plugins" per plugin object possible to support "static", "instanceObj" and "staticObj" sub-plugins per plugin
    const pluginNameKeys = keys(plugin);
    each(pluginNameKeys, (key) => {
      push(result, (pluginRegistry[key] = plugin[key]));
    });
  });
  return result;
};
