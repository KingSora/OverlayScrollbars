import { addPlugins, pluginModules } from '~/plugins';

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
});
