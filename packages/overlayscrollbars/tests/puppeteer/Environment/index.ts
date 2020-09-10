import { Environment } from 'environment';
import 'some.scss';
import 'some.css';

document.body.append(JSON.stringify(new Environment()));

export { Environment };
