declare type ResizeListener = (width: number, height: number) => void;
export declare const resize: (element: HTMLElement) => {
    addResizeListener(listener: ResizeListener): void;
};
export {};
