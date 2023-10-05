import { each, keys } from '~/support';
import type { OverlayScrollbars, OverlayScrollbarsStatic } from '~/overlayscrollbars';

export type PluginModuleInstance =
  | Record<string | number | symbol, any>
  | ((...args: any[]) => any);

/**
 * Describes a OverlayScrollbars plugin module.
 * Plugin modules must be side-effect free and deterministic. (same input produces same output)
 */
export interface PluginModule<
  Static extends PluginModuleInstance | void = PluginModuleInstance | void,
  Instance extends PluginModuleInstance | void = PluginModuleInstance | void
> {
  /**
   * Describes and creates a plugin which is bound to the static object.
   * The function will be called once with the static object as soon as the plugin is registered.
   * The plugin can add new methods or fields to the passed static object.
   * @param osStatic The static object the plugin is bound to.
   * @returns The plugins instance object or a falsy value if the plugin doesn't need any instance object.
   */
  osStatic?: (osStatic: OverlayScrollbarsStatic) => Static | false | null | undefined | void;
  /**
   * Describes and creates a A plugin which is bound to an instance.
   * The function will be called each time a new instance is created.
   * The plugin can add new methods or fields to the passed instance object.
   * @param osInstance The instance object the plugin is bound to.
   * @returns The plugins instance object or a falsy value if the plugin doesn't need any instance object.
   */
  osInstance?: (
    osInstance: OverlayScrollbars,
    osStatic: OverlayScrollbarsStatic
  ) => Instance | false | null | undefined | void;
}

/**
 * Describes a OverlayScrollbar plugin.
 */
export type Plugin<
  Name extends string = string,
  Static extends PluginModuleInstance | void = PluginModuleInstance | void,
  Instance extends PluginModuleInstance | void = PluginModuleInstance | void
> = {
  /** The field is the plugin (module) name. Module names must be globally unique, please choose wisely. */
  [pluginName in Name]: PluginModule<Static, Instance>;
};

export type StaticPlugin<
  Name extends string = string,
  T extends PluginModuleInstance | void = PluginModuleInstance | void
> = Plugin<Name, T, PluginModuleInstance | void>;

export type InstancePlugin<
  Name extends string = string,
  T extends PluginModuleInstance | void = PluginModuleInstance | void
> = Plugin<Name, PluginModuleInstance | void, T>;

export type InferStaticPluginModuleInstance<T extends StaticPlugin> = T extends StaticPlugin<
  infer Name
>
  ? T[Name]['osStatic'] extends (...args: any[]) => any
    ? ReturnType<T[Name]['osStatic']>
    : void
  : void;

export type InferInstancePluginModuleInstance<T extends InstancePlugin> = T extends InstancePlugin<
  infer Name
>
  ? T[Name]['osInstance'] extends (...args: any[]) => any
    ? ReturnType<T[Name]['osInstance']>
    : void
  : void;

/** All registered plugin modules. */
export const pluginModules: Record<string, PluginModule> = {};

/** All static plugin module instances. */
export const staticPluginModuleInstances: Record<string, PluginModuleInstance> = {};

/**
 * Adds plugins.
 * @param addedPlugin The plugin(s) to add.
 * @returns The added plugin modules of the registered plugins.
 */
export const addPlugins = (addedPlugin: Plugin[]) => {
  each(addedPlugin, (plugin) => {
    each(keys(plugin), (key) => {
      pluginModules[key] = plugin[key];
    });
  });
};

export const registerPluginModuleInstances = (
  plugin: Plugin,
  staticObj: OverlayScrollbarsStatic,
  instanceObj?: OverlayScrollbars,
  map?: Record<string, PluginModuleInstance>
): Array<PluginModuleInstance | void> =>
  keys(plugin).map((name) => {
    const { osStatic, osInstance } = plugin[name];
    const ctor = instanceObj ? osInstance : osStatic;
    if (ctor) {
      const instance = instanceObj
        ? (ctor as Exclude<PluginModule['osInstance'], undefined>)(instanceObj, staticObj)
        : (ctor as Exclude<PluginModule['osStatic'], undefined>)(staticObj);
      instance && ((map || staticPluginModuleInstances)[name] = instance);
      return instance || undefined;
    }
  });

export const getStaticPluginModuleInstance = <N extends string, T extends StaticPlugin<N>>(
  pluginModuleName: N
): T extends StaticPlugin<N> ? InferStaticPluginModuleInstance<T> | undefined : undefined =>
  staticPluginModuleInstances[pluginModuleName] as T extends StaticPlugin<N>
    ? InferStaticPluginModuleInstance<T> | undefined
    : undefined;
