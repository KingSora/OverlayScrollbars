import { OverlayScrollbarsLifecycle } from 'overlayscrollbars/lifecycles';

export interface StructureLifecycleOptions {
  _paddingAbsolute: boolean;
  _autoSizeCapable: boolean;
  _heightAuto: boolean;
  _widthAuto: boolean;
  _border: [number, number, number, number];
  _padding: [number, number, number, number];
  _margin: [number, number, number, number];
}

export class StructureLifecycle extends OverlayScrollbarsLifecycle<StructureLifecycleOptions> {
  // eslint-disable-next-line
  _update(options?: StructureLifecycleOptions): void {}
  // eslint-disable-next-line
  _destruct(): void {}
}
