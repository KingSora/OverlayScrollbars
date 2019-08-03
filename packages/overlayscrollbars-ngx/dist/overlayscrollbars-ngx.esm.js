import { Component, ElementRef, Input, NgModule } from '@angular/core';
import OverlayScrollbars from 'overlayscrollbars';

var OverlayScrollbarsComponent = (function () {
    function OverlayScrollbarsComponent(_osTargetRef) {
        this._osInstance = null;
        this._osTargetRef = _osTargetRef;
    }
    OverlayScrollbarsComponent.prototype.osInstance = function () {
        return this._osInstance;
    };
    OverlayScrollbarsComponent.prototype.osTarget = function () {
        return this._osTargetRef.nativeElement || null;
    };
    OverlayScrollbarsComponent.prototype.ngAfterViewInit = function () {
        this._osInstance = OverlayScrollbars(this.osTarget(), this._options || {}, this._extensions);
    };
    OverlayScrollbarsComponent.prototype.ngOnDestroy = function () {
        if (OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.destroy();
            this._osInstance = null;
        }
    };
    OverlayScrollbarsComponent.prototype.ngOnChanges = function (changes) {
        var optionsChange = changes._options;
        if (optionsChange && OverlayScrollbars.valid(this._osInstance)) {
            this._osInstance.options(optionsChange.currentValue);
        }
    };
    OverlayScrollbarsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'overlay-scrollbars',
                    template: '<ng-content></ng-content>',
                    styles: [':host { display: block; }']
                },] },
    ];
    OverlayScrollbarsComponent.ctorParameters = function () { return [
        { type: ElementRef }
    ]; };
    OverlayScrollbarsComponent.propDecorators = {
        _options: [{ type: Input, args: ['options',] }],
        _extensions: [{ type: Input, args: ['extensions',] }]
    };
    return OverlayScrollbarsComponent;
}());

var OverlayscrollbarsModule = (function () {
    function OverlayscrollbarsModule() {
    }
    OverlayscrollbarsModule.decorators = [
        { type: NgModule, args: [{
                    imports: [],
                    declarations: [OverlayScrollbarsComponent],
                    exports: [OverlayScrollbarsComponent]
                },] },
    ];
    return OverlayscrollbarsModule;
}());

export { OverlayScrollbarsComponent, OverlayscrollbarsModule };
//# sourceMappingURL=overlayscrollbars-ngx.esm.js.map
