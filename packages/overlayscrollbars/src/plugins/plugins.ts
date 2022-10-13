import { each, isArray, keys, push } from '~/support';
import type { OverlayScrollbars, OverlayScrollbarsStatic } from '~/overlayscrollbars';

/** Describes the instance of a OverlayScrollbars plugin. */
export type PluginInstance =
  /** A `static` plugin. Its neither bound to a instance nor to the static object. */
  | Record<string, unknown>
  /**
   * A plugin which is bound to either a instance or to the static object.
   * The function will be called multiple times. Once with the static object and each time a new instance is created.
   * The plugin then can add new methods or fields to thow objects.
   * These plugins should be side-effect free and deterministic. (same input produces same output)
   */
  | ((staticObj?: OverlayScrollbarsStatic, instanceObj?: OverlayScrollbars) => void);

/** Describes a OverlayScrollbars plugin. */
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
