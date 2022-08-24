import { addPlugin, getPlugins } from 'plugins';

describe('plugins', () => {
  test('getPlugins', () => {
    const plugins = getPlugins();
    expect(plugins).toEqual({});
  });

  test('addPlugin single', () => {
    const myPlugin = {};
    const myPlugin2 = {};
    const addedPlugins = addPlugin({
      myPlugin,
      myPlugin2,
    });
    expect(addedPlugins.length).toBe(2);
    expect(addedPlugins[0]).toBe(myPlugin);
    expect(addedPlugins[1]).toBe(myPlugin2);

    const plugins = getPlugins();
    expect(plugins.myPlugin).toBe(myPlugin);
    // multiple "sub-plugins" per plugin object possible to support "static", "instanceObj" and "staticObj" sub-plugins per plugin
    expect(plugins.myPlugin2).toBe(myPlugin2);
  });

  test('addPlugin multiple', () => {
    const myPlugin = {};
    const myPlugin2 = {};
    const addedPlugins = addPlugin([
      {
        myPlugin,
      },
      {
        myPlugin2,
      },
    ]);

    expect(addedPlugins.length).toBe(2);
    expect(addedPlugins[0]).toBe(myPlugin);
    expect(addedPlugins[1]).toBe(myPlugin2);

    const plugins = getPlugins();
    expect(plugins.myPlugin).toBe(myPlugin);
    expect(plugins.myPlugin2).toBe(myPlugin2);
  });
});
