export interface AutoUpdateLoop {
    _add(fn: (delta: number) => any): () => void;
    _interval(newInterval: number): () => void;
    _interval(): number;
}
export declare const getAutoUpdateLoop: () => AutoUpdateLoop;
