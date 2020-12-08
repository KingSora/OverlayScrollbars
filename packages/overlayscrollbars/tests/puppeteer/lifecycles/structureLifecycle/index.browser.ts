import 'overlayscrollbars.scss';
import './index.scss';
import { createStructureLifecycle } from 'lifecycles/structureLifecycle';

const targetElm = document.querySelector('#target') as HTMLElement;

const structureLifecycle = createStructureLifecycle(targetElm);
