import { ElementRef, SimpleChanges, OnDestroy, OnChanges, AfterViewInit, NgZone } from '@angular/core';
import OverlayScrollbars from 'overlayscrollbars';
export declare class OverlayScrollbarsComponent implements OnDestroy, OnChanges, AfterViewInit {
    private ngZone;
    _options: OverlayScrollbars.Options;
    _extensions: OverlayScrollbars.Extensions;
    private _osInstance;
    private _osTargetRef;
    constructor(_osTargetRef: ElementRef, ngZone: NgZone);
    osInstance(): OverlayScrollbars | null;
    osTarget(): HTMLDivElement | null;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    ngOnChanges(changes: SimpleChanges): void;
}
