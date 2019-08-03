import { ElementRef, SimpleChanges, OnDestroy, OnChanges, AfterViewInit } from '@angular/core';
import OverlayScrollbars from 'overlayscrollbars';
export declare class OverlayScrollbarsComponent implements OnDestroy, OnChanges, AfterViewInit {
    private _options;
    private _extensions;
    private _osInstance;
    private _osTargetRef;
    constructor(_osTargetRef: ElementRef);
    osInstance(): OverlayScrollbars | null;
    osTarget(): HTMLDivElement | null;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
