import 'overlayscrollbars.scss';
import './index.scss';
import { createStructureLifecycle } from 'overlayscrollbars/lifecycles/StructureLifecycle';

const targetElm = document.querySelector('#target') as HTMLElement;

const structureLifecycle = createStructureLifecycle(targetElm);
