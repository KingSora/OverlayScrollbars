/// <reference types="jest" />
export declare const generateSelectCallback: (targetElms: HTMLElement[] | HTMLElement | null, callback: (targetAffectedElm: HTMLElement, possibleValues: string[], selectedValue: string) => any) => (event: Event | HTMLSelectElement | null) => void;
export declare const generateClassChangeSelectCallback: (targetElms: HTMLElement[] | HTMLElement | null) => (event: Event | HTMLSelectElement | null) => void;
export declare const selectOption: (select: HTMLSelectElement | null, selectedOption: string | number) => boolean;
export declare const iterateSelect: <T>(select: HTMLSelectElement | null, options?: {
    filter?: ((value: string, index: number, array: string[]) => boolean) | undefined;
    beforeEach?: (() => T | Promise<T>) | undefined;
    check?: ((input: T, selectedOptions: string) => void | Promise<void>) | undefined;
    afterEach?: (() => void | Promise<void>) | undefined;
} | undefined) => Promise<void>;
