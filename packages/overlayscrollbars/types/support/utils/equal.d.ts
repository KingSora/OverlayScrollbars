import { WH, XY, TRBL } from 'support/dom';
import { PlainObject } from 'typings';
export declare const equal: <T extends PlainObject<any>>(a: T | undefined, b: T | undefined, props: (keyof T)[]) => boolean;
export declare const equalWH: (a?: WH<number> | undefined, b?: WH<number> | undefined) => boolean;
export declare const equalXY: (a?: XY<number> | undefined, b?: XY<number> | undefined) => boolean;
export declare const equalTRBL: (a?: TRBL | undefined, b?: TRBL | undefined) => boolean;
