(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('overlayscrollbars')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'overlayscrollbars'], factory) :
    (global = global || self, factory(global.OverlayScrollbarsNgx = {}, global.ng.core, global.OverlayScrollbars));
}(this, (function (exports, core, OverlayScrollbars) { 'use strict';

    OverlayScrollbars = OverlayScrollbars && Object.prototype.hasOwnProperty.call(OverlayScrollbars, 'default') ? OverlayScrollbars['default'] : OverlayScrollbars;

    var OverlayScrollbarsComponent = (function () {
        function OverlayScrollbarsComponent(_osTargetRef, ngZone) {
            this.ngZone = ngZone;
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
            var _this = this;
            this.ngZone.runOutsideAngular((function () {
                _this._osInstance = OverlayScrollbars(_this.osTarget(), _this._options || {}, _this._extensions);
            }));
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
                        host: { 'class': 'os-host' },
                        template: "\n        <div class=\"os-resize-observer-host\"></div>\n        <div class=\"os-padding\">\n            <div class=\"os-viewport\">\n                <div class=\"os-content\">\n                    <ng-content></ng-content>\n                </div>\n            </div>\n        </div>\n        <div class=\"os-scrollbar os-scrollbar-horizontal \">\n            <div class=\"os-scrollbar-track\">\n                <div class=\"os-scrollbar-handle\"></div>\n            </div>\n        </div>\n        <div class=\"os-scrollbar os-scrollbar-vertical\">\n            <div class=\"os-scrollbar-track\">\n                <div class=\"os-scrollbar-handle\"></div>\n            </div>\n        </div>\n        <div class=\"os-scrollbar-corner\"></div>\n    ",
                        styles: [':host { display: block; }']
                    },] },
        ];
        OverlayScrollbarsComponent.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.NgZone }
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

})));
//# sourceMappingURL=overlayscrollbars-ngx.js.map
