!function(o, r) {
    "object" == typeof exports && "object" == typeof module ? module.exports = r() : "function" == typeof define && define.amd ? define([], r) : "object" == typeof exports ? exports.OverlayScrollbars = r() : o.OverlayScrollbars = r();
}(window, (function() {
    return (() => {
        "use strict";
        var o = {
            95: (o, r, e) => {
                e.d(r, {
                    default: () => u
                });
                function s(o) {
                    return "function" == typeof o;
                }
                function t(o) {
                    return Array.isArray(o);
                }
                function n(o) {
                    const r = !!o && o.length;
                    return t(o) || !s(o) && function(o) {
                        return "number" == typeof o;
                    }(r) && r > -1 && r % 1 == 0;
                }
                function i(o, r) {
                    let e = 0;
                    if (n(o)) for (;e < o.length && !1 !== r(o[e], e, o); e++) ; else if (o) for (e in o) if (!1 === r(o[e], e, o)) break;
                    return o;
                }
                const c = o => {
                    if (n(o)) i(Array.from(o), o => c(o)); else if (o) {
                        const r = o.parentNode;
                        r && r.removeChild(o);
                    }
                }, l = o => {
                    const r = document.createElement("div");
                    return r.innerHTML = o.trim(), i((o => o ? Array.from(o.childNodes) : [])(r), o => c(o));
                };
                const a = o => o.charAt(0).toUpperCase() + o.slice(1), d = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ], f = {}, v = ((o => {
                    let r = f[o] || window[o];
                    f.hasOwnProperty(o) || (i(d, e => (r = r || window[e + a(o)], !r)), f[o] = r);
                })("ResizeObserver"), JSON.stringify, [ "__TPL_", "_TYPE__" ]);
                [ "boolean", "number", "string", "array", "object", "function", "null" ].reduce((o, r) => (o[r] = v[0] + r + v[1], 
                o), {});
                new Set, new WeakMap;
                const u = () => l('    <div class="os-host">        <div class="os-resize-observer-host"></div>        <div class="os-padding">            <div class="os-viewport">                <div class="os-content">                    fdfhdfgh                </div>            </div>        </div>        <div class="os-scrollbar os-scrollbar-horizontal">            <div class="os-scrollbar-track">                <div class="os-scrollbar-handle"></div>            </div>        </div>        <div class="os-scrollbar os-scrollbar-vertical">            <div class="os-scrollbar-track">                <div class="os-scrollbar-handle"></div>            </div>        </div>        <div class="os-scrollbar-corner"></div>    </div>');
            }
        }, r = {};
        function e(s) {
            if (r[s]) return r[s].exports;
            var t = r[s] = {
                exports: {}
            };
            return o[s](t, t.exports, e), t.exports;
        }
        return e.d = (o, r) => {
            for (var s in r) e.o(r, s) && !e.o(o, s) && Object.defineProperty(o, s, {
                enumerable: !0,
                get: r[s]
            });
        }, e.o = (o, r) => Object.prototype.hasOwnProperty.call(o, r), e(95);
    })().default;
}));
//# sourceMappingURL=overlayscrollbars.esm.js.map