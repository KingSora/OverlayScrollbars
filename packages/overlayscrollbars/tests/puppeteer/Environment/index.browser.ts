import 'overlayscrollbars.scss';
import { getEnvironment } from 'environment';

const envInstance = getEnvironment();
document.body.textContent = JSON.stringify(envInstance);

export { envInstance };
