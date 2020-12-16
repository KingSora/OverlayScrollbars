import { Component, ElementRef, Input, SimpleChanges, OnDestroy, OnChanges, AfterViewInit, NgZone } from '@angular/core';
import OverlayScrollbars from 'overlayscrollbars';

@Component({
    selector: 'overlay-scrollbars', //https://angular.io/guide/styleguide#component-selectors
    host: { 'class': 'os-host' },
    template: `
        <div class="os-resize-observer-host"></div>
        <div class="os-padding">
            <div class="os-viewport">
                <div class="os-content">
                    <ng-content></ng-content>
                </div>
            </div>
        </div>
        <div class="os-scrollbar os-scrollbar-horizontal ">
            <div class="os-scrollbar-track">
                <div class="os-scrollbar-handle"></div>
            </div>
        </div>
        <div class="os-scrollbar os-scrollbar-vertical">
            <div class="os-scrollbar-track">
                <div class="os-scrollbar-handle"></div>
            </div>
        </div>
        <div class="os-scrollbar-corner"></div>
    `,
    styles: [':host { display: block; }']
})
export class OverlayScrollbarsComponent implements OnDestroy, OnChanges, AfterViewInit {
    @Input('options') _options: OverlayScrollbars.Options;
    @Input('extensions') _extensions: OverlayScrollbars.Extensions;
    private _osInstance: OverlayScrollbars | null = null;
    private _osTargetRef: ElementRef;

    constructor(_osTargetRef: ElementRef, private ngZone: NgZone) {
        this._osTargetRef = _osTargetRef;
    }

    osInstance(): OverlayScrollbars | null {
        return this._osInstance;
    }

    osTarget(): HTMLDivElement | null {
        return this._osTargetRef.nativeElement || null;
    }

    ngAfterViewInit() {
        this.ngZone.runOutsideAngular(() => {
            this._osInstance = OverlayScrollbars(this.osTarget(), this._options || {}, this._extensions);
        });
    }

    ngOnDestroy() {
        if (OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.destroy();
            this._osInstance = null;
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const optionsChange = changes._options;
        if (optionsChange && OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.options(optionsChange.currentValue);
        }
    }
}