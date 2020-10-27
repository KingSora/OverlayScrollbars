import 'overlayscrollbars.scss';
import { Environment } from 'environment';

window.envInstance = new Environment();
document.body.textContent = JSON.stringify(window.envInstance);

export { Environment };
