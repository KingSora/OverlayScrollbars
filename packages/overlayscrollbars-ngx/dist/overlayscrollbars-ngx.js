(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('overlayscrollbars')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'overlayscrollbars'], factory) :
    (global = global || self, factory(global.OverlayScrollbarsNgx = {}, global.ng.core, global.OverlayScrollbars));
}(this, function (exports, core, OverlayScrollbars) { 'use strict';

    OverlayScrollbars = OverlayScrollbars && OverlayScrollbars.hasOwnProperty('default') ? OverlayScrollbars['default'] : OverlayScrollbars;

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
            { type: core.Component, args: [{
                        selector: 'overlay-scrollbars',
                        template: '<ng-content></ng-content>',
                        styles: [':host { display: block; }']
                    },] },
        ];
        OverlayScrollbarsComponent.ctorParameters = function () { return [
            { type: core.ElementRef }
        ]; };
        OverlayScrollbarsComponent.propDecorators = {
            _options: [{ type: core.Input, args: ['options',] }],
            _extensions: [{ type: core.Input, args: ['extensions',] }]
        };
        return OverlayScrollbarsComponent;
    }());

    var OverlayscrollbarsModule = (function () {
        function OverlayscrollbarsModule() {
        }
        OverlayscrollbarsModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [],
                        declarations: [OverlayScrollbarsComponent],
                        exports: [OverlayScrollbarsComponent]
                    },] },
        ];
        return OverlayscrollbarsModule;
    }());

    exports.OverlayScrollbarsComponent = OverlayScrollbarsComponent;
    exports.OverlayscrollbarsModule = OverlayscrollbarsModule;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=overlayscrollbars-ngx.js.map
