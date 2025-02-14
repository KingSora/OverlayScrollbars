import { describe, test, expect } from 'vitest';
import type {
  InstancePlugin,
  Plugin,
  PluginModuleInstance,
  StaticPlugin,
} from '../../../src/plugins';
import {
  addPlugins,
  pluginModules,
  registerPluginModuleInstances,
  staticPluginModuleInstances,
  getStaticPluginModuleInstance,
} from '../../../src/plugins';
import { OverlayScrollbars } from '../../../src/overlayscrollbars';

describe('plugins', () => {
  test('pluginModules', () => {
    expect(pluginModules).toEqual({});
  });

  test('addPlugins', () => {
    const myPlugin = {
      myPluginModule: {},
    };
    const myPlugin2 = {
      myPlugin2Module: {},
    };
    const myPlugin3 = {
      myPlugin3Module1: {},
      myPlugin3Module2: {},
    };

    addPlugins([myPlugin, myPlugin2]);

    expect(pluginModules.myPluginModule).toBe(myPlugin.myPluginModule);
    expect(pluginModules.myPlugin2Module).toBe(myPlugin2.myPlugin2Module);
    expect(Object.entries(pluginModules)).toHaveLength(2);

    addPlugins([myPlugin3]);

    expect(pluginModules.myPlugin3Module1).toBe(myPlugin3.myPlugin3Module1);
    expect(pluginModules.myPlugin3Module2).toBe(myPlugin3.myPlugin3Module2);
    expect(Object.entries(pluginModules)).toHaveLength(4);
  });

  test('registerPluginModuleInstances', () => {
    const staticTestPlugin = {
      staticTestPlugin: {
        static: () => ({
          staticTestPluginInstance: 'static',
        }),
      },
    } satisfies StaticPlugin;

    const instanceTestPlugin = {
      instanceTestPlugin: {
        instance: () => ({
          instanceTestPluginInstance: 'instance',
        }),
      },
    } satisfies InstancePlugin;

    const testPlugin = {
      testPlugin: {
        static: () => ({
          testPluginInstance: 'static',
        }),
        instance: () => ({
          testPluginInstance: 'instance',
        }),
      },
    } satisfies Plugin;

    const map: Record<string, PluginModuleInstance> = {};
    const instance = {} as OverlayScrollbars; // fake instance
    const event = (() => {}) as any; // fake event

    registerPluginModuleInstances(staticTestPlugin, OverlayScrollbars);
    registerPluginModuleInstances(instanceTestPlugin, OverlayScrollbars, [instance, event, map]);
    registerPluginModuleInstances(testPlugin, OverlayScrollbars);
    registerPluginModuleInstances(testPlugin, OverlayScrollbars, [instance, event, map]);

    expect(staticPluginModuleInstances['staticTestPlugin']).toEqual(
      staticTestPlugin.staticTestPlugin.static()
    );
    expect(staticPluginModuleInstances['instanceTestPlugin']).not.toBeDefined();
    expect(staticPluginModuleInstances['testPlugin']).toEqual(testPlugin.testPlugin.static());
    expect(map['instanceTestPlugin']).toEqual(instanceTestPlugin.instanceTestPlugin.instance());
    expect(map['testPlugin']).toEqual(testPlugin.testPlugin.instance());
  });

  test('getStaticPluginModuleInstance', () => {
    const staticPlugin = {
      staticPlugin: {
        static: () => ({
          staticPluginInstance: 'static',
        }),
      },
    } satisfies StaticPlugin;

    registerPluginModuleInstances(staticPlugin, OverlayScrollbars);

    const pluginInstance = getStaticPluginModuleInstance<typeof staticPlugin>('staticPlugin');
    expect(pluginInstance?.staticPluginInstance).toBe('static');
  });
});
