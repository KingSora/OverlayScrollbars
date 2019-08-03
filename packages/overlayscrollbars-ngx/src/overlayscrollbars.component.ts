import { Component, ElementRef, Input, SimpleChanges, OnDestroy, OnChanges, AfterViewInit } from '@angular/core';
import OverlayScrollbars from 'overlayscrollbars';

@Component({
    selector: 'overlay-scrollbars', //https://angular.io/guide/styleguide#component-selectors
    template: '<ng-content></ng-content>',
    styles: [':host { display: block; }']
})
export class OverlayScrollbarsComponent implements OnDestroy, OnChanges, AfterViewInit {
    @Input('options') private _options: OverlayScrollbars.Options;
    @Input('extensions') private _extensions: OverlayScrollbars.Extensions;
    private _osInstance: OverlayScrollbars | null = null;
    private _osTargetRef: ElementRef;

    constructor(_osTargetRef: ElementRef) {
        this._osTargetRef = _osTargetRef;
    }

    osInstance(): OverlayScrollbars | null {
        return this._osInstance;
    }

    osTarget(): HTMLDivElement | null {
        return this._osTargetRef.nativeElement || null;
    }

    ngAfterViewInit() {
        this._osInstance = OverlayScrollbars(this.osTarget(), this._options || {}, this._extensions);
    }

    ngOnDestroy() {
        if (OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.destroy();
            this._osInstance = null;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        let optionsChange = changes._options;
        if (optionsChange && OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.options(optionsChange.currentValue);
        }
    }
}