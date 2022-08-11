import { addPlugin, getPlugins } from 'plugins';

describe('plugins', () => {
  test('getPlugins', () => {
    const plugins = getPlugins();
    expect(plugins).toEqual({});
  });

  test('addPlugin single', () => {
    const myPlugin = {};
    const myPlugin2 = {};
    addPlugin({
      myPlugin,
      myPlugin2,
    });
    const plugins = getPlugins();
    expect(plugins.myPlugin).toBe(myPlugin);
    expect(plugins.myPlugin2).toBe(undefined); // one plugin per object
  });

  test('addPlugin multiple', () => {
    const myPlugin = {};
    const myPlugin2 = {};
    addPlugin([
      {
        myPlugin,
      },
      {
        myPlugin2,
      },
    ]);
    const plugins = getPlugins();
    expect(plugins.myPlugin).toBe(myPlugin);
    expect(plugins.myPlugin2).toBe(myPlugin2);
  });
});
