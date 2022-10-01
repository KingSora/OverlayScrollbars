import '~/index.scss';
import { createDOM, appendChildren } from '~/support';
import { getEnvironment } from '~/environment';

const envInstance = getEnvironment();
appendChildren(document.body, createDOM(`<div>${JSON.stringify(envInstance)}</div>`)[0]);

export { envInstance };
