/// <reference types="vite/client" />
import type { OverlayScrollbarsPluginSmoothOptions } from 'overlayscrollbars-plugin-smooth';

declare module 'overlayscrollbars' {
  export interface PluginsOptions extends OverlayScrollbarsPluginSmoothOptions {}
}
