import 'overlayscrollbars.scss';
import { Environment } from 'environment';

const envInstance = new Environment();
document.body.textContent = JSON.stringify(envInstance);

export { envInstance };
