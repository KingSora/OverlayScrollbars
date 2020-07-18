!function(r, n) {
    "object" == typeof exports && "object" == typeof module ? module.exports = n() : "function" == typeof define && define.amd ? define([], n) : "object" == typeof exports ? exports.OverlayScrollbars = n() : r.OverlayScrollbars = n();
}(window, (function() {
    return function() {
        "use strict";
        var r = {
            95: function(r, n, o) {
                o.d(n, {
                    default: function() {
                        return p;
                    }
                });
                function e(r) {
                    return "function" == typeof r;
                }
                function t(r) {
                    return Array.isArray(r);
                }
                function i(r) {
                    var n = !!r && r.length;
                    return t(r) || !e(r) && function(r) {
                        return "number" == typeof r;
                    }(n) && n > -1 && n % 1 == 0;
                }
                function s(r, n) {
                    var o = 0;
                    if (i(r)) for (;o < r.length && !1 !== n(r[o], o, r); o++) ; else if (r) for (o in r) if (!1 === n(r[o], o, r)) break;
                    return r;
                }
                var c = function(r) {
                    if (i(r)) s(Array.from(r), (function(r) {
                        return c(r);
                    })); else if (r) {
                        var n = r.parentNode;
                        n && n.removeChild(r);
                    }
                }, u = function(r) {
                    var n = document.createElement("div");
                    return n.innerHTML = r.trim(), s(function(r) {
                        return r ? Array.from(r.childNodes) : [];
                    }(n), (function(r) {
                        return c(r);
                    }));
                };
                var a, f, l = function(r) {
                    return r.charAt(0).toUpperCase() + r.slice(1);
                }, d = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ], v = {}, b = (f = v[a = "ResizeObserver"] || window[a], 
                v.hasOwnProperty(a) || (s(d, (function(r) {
                    return !(f = f || window[r + l(a)]);
                })), v[a] = f), JSON.stringify, [ "__TPL_", "_TYPE__" ]);
                [ "boolean", "number", "string", "array", "object", "function", "null" ].reduce((function(r, n) {
                    return r[n] = b[0] + n + b[1], r;
                }), {});
                new Set, new WeakMap;
                var p = function() {
                    return u('    <div class="os-host">        <div class="os-resize-observer-host"></div>        <div class="os-padding">            <div class="os-viewport">                <div class="os-content">                    fdfhdfgh                </div>            </div>        </div>        <div class="os-scrollbar os-scrollbar-horizontal">            <div class="os-scrollbar-track">                <div class="os-scrollbar-handle"></div>            </div>        </div>        <div class="os-scrollbar os-scrollbar-vertical">            <div class="os-scrollbar-track">                <div class="os-scrollbar-handle"></div>            </div>        </div>        <div class="os-scrollbar-corner"></div>    </div>');
                };
            }
        }, n = {};
        function o(e) {
            if (n[e]) return n[e].exports;
            var t = n[e] = {
                exports: {}
            };
            return r[e](t, t.exports, o), t.exports;
        }
        return o.d = function(r, n) {
            for (var e in n) o.o(n, e) && !o.o(r, e) && Object.defineProperty(r, e, {
                enumerable: !0,
                get: n[e]
            });
        }, o.o = function(r, n) {
            return Object.prototype.hasOwnProperty.call(r, n);
        }, o(95);
    }().default;
}));
//# sourceMappingURL=overlayscrollbars.js.map