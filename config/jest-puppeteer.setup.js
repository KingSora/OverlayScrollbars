const setDefaultOptions = require('expect-puppeteer').setDefaultOptions;

jest.setTimeout(60000);
setDefaultOptions({ timeout: 60000 });
