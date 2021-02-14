export interface XY<T = number> {
    x: T;
    y: T;
}
export declare const absoluteCoordinates: (elm: HTMLElement | null | undefined) => XY;
export declare const offsetCoordinates: (elm: HTMLElement | null | undefined) => XY;
