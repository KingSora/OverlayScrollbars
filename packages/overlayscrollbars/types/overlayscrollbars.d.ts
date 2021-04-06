import { OSTarget, OSTargetObject } from 'typings';
import { PartialOptions } from 'support';
import { OSOptions } from 'options';
export interface OverlayScrollbarsStatic {
    (target: OSTarget | OSTargetObject, options?: PartialOptions<OSOptions>, extensions?: any): OverlayScrollbars;
}
export interface OverlayScrollbars {
    options(): OSOptions;
    options(newOptions?: PartialOptions<OSOptions>): OSOptions;
    update(force?: boolean): void;
}
export declare const OverlayScrollbars: OverlayScrollbarsStatic;
