import { each, keys } from '~/support';
import type { OverlayScrollbars, OverlayScrollbarsStatic } from '~/overlayscrollbars';

export type PluginModuleInstance = Record<string | number | symbol, any>;

/**
 * Describes a OverlayScrollbars plugin module.
 * Plugin modules must be side-effect free and deterministic. (same input produces same output)
 */
export type PluginModule<
  S extends PluginModuleInstance | void = PluginModuleInstance | void,
  I extends PluginModuleInstance | void = PluginModuleInstance | void
> = (S extends PluginModuleInstance
  ? {
      /**
       * Creates a plugin which is bound to the static object.
       * The function will be called once with the static object as soon as the plugin is registered.
       * The plugin can add new methods or fields to the passed static object.
       * @param osStatic The static object the plugin is bound to.
       * @returns The plugins instance object or a falsy value if the plugin doesn't need any instance object.
       */
      static: (osStatic: OverlayScrollbarsStatic) => S | void;
    }
  : object) &
  (I extends PluginModuleInstance
    ? {
        /**
         * Creates a A plugin which is bound to an instance.
         * The function will be called each time a new instance is created.
         * The plugin can add new methods or fields to the passed instance object.
         * @param osInstance The instance object the plugin is bound to.
         * @param osStatic The static object the plugin is bound to.
         * @returns The plugins instance object or a falsy value if the plugin doesn't need any instance object.
         */
        instance: (osInstance: OverlayScrollbars, osStatic: OverlayScrollbarsStatic) => I | void;
      }
    : object);

/**
 * Describes a OverlayScrollbar plugin.
 */
export type Plugin<
  Name extends string = string,
  S extends PluginModuleInstance | void = PluginModuleInstance | void,
  I extends PluginModuleInstance | void = PluginModuleInstance | void
> = {
  /** The field is the plugins name. Plugin names must be globally unique, please choose wisely. */
  [pluginName in Name]: PluginModule<S, I>;
};

/**
 * Describes a OverlayScrollbar plugin which has only a static module.
 */
export type StaticPlugin<
  Name extends string = string,
  T extends PluginModuleInstance = PluginModuleInstance
> = Plugin<Name, T, void>;

/**
 * Describes a OverlayScrollbar plugin which has only a instance module.
 */
export type InstancePlugin<
  Name extends string = string,
  T extends PluginModuleInstance = PluginModuleInstance
> = Plugin<Name, void, T>;

/**
 * Infers the type of the static modules instance of the passed plugin.
 */
export type InferStaticPluginModuleInstance<T extends StaticPlugin> = T extends StaticPlugin<
  infer Name
>
  ? T[Name]['static'] extends (...args: any[]) => any
    ? ReturnType<T[Name]['static']>
    : void
  : void;

/**
 * Infers the type of the instance modules instance of the passed plugin.
 */
export type InferInstancePluginModuleInstance<T extends InstancePlugin> = T extends InstancePlugin<
  infer Name
>
  ? T[Name]['instance'] extends (...args: any[]) => any
    ? ReturnType<T[Name]['instance']>
    : void
  : void;

/** All registered plugin modules. */
export const pluginModules: Record<string, PluginModule> = {};

/** All static plugin module instances. */
export const staticPluginModuleInstances: Record<string, PluginModuleInstance | void> = {};

/**
 * Adds plugins.
 * @param addedPlugin The plugin(s) to add.
 * @returns The added plugin modules of the registered plugins.
 */
export const addPlugins = (addedPlugin: Plugin[]) => {
  each(addedPlugin, (plugin) =>
    each(plugin, (_, key) => {
      pluginModules[key] = plugin[key];
    })
  );
};

export const registerPluginModuleInstances = (
  plugin: Plugin,
  staticObj: OverlayScrollbarsStatic,
  instanceObj?: OverlayScrollbars,
  map?: Record<string, PluginModuleInstance>
): Array<PluginModuleInstance | void> =>
  keys(plugin).map((name) => {
    const { static: osStatic, instance: osInstance } = (
      plugin as Plugin<string, PluginModuleInstance, PluginModuleInstance>
    )[name];
    const ctor = instanceObj ? osInstance : osStatic;
    if (ctor) {
      const instance = instanceObj
        ? (
            ctor as Extract<
              typeof ctor,
              (
                osInstance: OverlayScrollbars,
                osStatic: OverlayScrollbarsStatic
              ) => PluginModuleInstance | void
            >
          )(instanceObj, staticObj)
        : (
            ctor as Extract<
              typeof ctor,
              (osStatic: OverlayScrollbarsStatic) => PluginModuleInstance | void
            >
          )(staticObj);
      return ((map || staticPluginModuleInstances)[name] = instance);
    }
  });

export const getStaticPluginModuleInstance = <T extends StaticPlugin>(
  pluginModuleName: T extends StaticPlugin<infer N> ? N : never
): InferStaticPluginModuleInstance<T> | undefined =>
  staticPluginModuleInstances[pluginModuleName] as InferStaticPluginModuleInstance<T> | undefined;
