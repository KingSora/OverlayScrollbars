(function(r, a) {
  "object" === typeof exports && "undefined" !== typeof module ? a(exports) : "function" === typeof define && define.amd ? define([ "exports" ], a) : (r = "undefined" !== typeof globalThis ? globalThis : r || self, 
  a(r.OverlayScrollbars = {}));
})(this, (function(r) {
  "use strict";
  function each(r, a) {
    if (h(r)) {
      for (var e = 0; e < r.length; e++) {
        if (false === a(r[e], e, r)) {
          break;
        }
      }
    } else if (r) {
      each(Object.keys(r), (function(e) {
        return a(r[e], e, r);
      }));
    }
    return r;
  }
  function style(r, a) {
    var e = l(a);
    var n = d(a) || e;
    if (n) {
      var t = e ? "" : {};
      if (r) {
        var i = window.getComputedStyle(r, null);
        t = e ? Ar(r, i, a) : a.reduce((function(a, e) {
          a[e] = Ar(r, i, e);
          return a;
        }), t);
      }
      return t;
    }
    r && each(E(a), (function(e) {
      return Pr(r, e, a[e]);
    }));
  }
  function getDefaultExportFromCjs(r) {
    return r && r.v && Object.prototype.hasOwnProperty.call(r, "default") ? r["default"] : r;
  }
  var a = function createCache(r, a) {
    var e = r.o, n = r.u, t = r.g;
    var i = e;
    var v;
    var o = function cacheUpdateContextual(r, a) {
      var e = i;
      var o = r;
      var u = a || (n ? !n(e, o) : e !== o);
      if (u || t) {
        i = o;
        v = e;
      }
      return [ i, u, v ];
    };
    var u = function cacheUpdateIsolated(r) {
      return o(a(i, v), r);
    };
    var f = function getCurrentCache(r) {
      return [ i, !!r, v ];
    };
    return [ a ? u : o, f ];
  };
  var e = Node.ELEMENT_NODE;
  var n = Object.prototype, t = n.toString, i = n.hasOwnProperty;
  var v = function isUndefined(r) {
    return void 0 === r;
  };
  var o = function isNull(r) {
    return null === r;
  };
  var u = function type(r) {
    return v(r) || o(r) ? "" + r : t.call(r).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
  };
  var f = function isNumber(r) {
    return "number" === typeof r;
  };
  var l = function isString(r) {
    return "string" === typeof r;
  };
  var c = function isBoolean(r) {
    return "boolean" === typeof r;
  };
  var s = function isFunction(r) {
    return "function" === typeof r;
  };
  var d = function isArray(r) {
    return Array.isArray(r);
  };
  var g = function isObject(r) {
    return "object" === typeof r && !d(r) && !o(r);
  };
  var h = function isArrayLike(r) {
    var a = !!r && r.length;
    var e = f(a) && a > -1 && a % 1 == 0;
    return d(r) || !s(r) && e ? a > 0 && g(r) ? a - 1 in r : true : false;
  };
  var p = function isPlainObject(r) {
    if (!r || !g(r) || "object" !== u(r)) {
      return false;
    }
    var a;
    var e = "constructor";
    var n = r[e];
    var t = n && n.prototype;
    var o = i.call(r, e);
    var f = t && i.call(t, "isPrototypeOf");
    if (n && !o && !f) {
      return false;
    }
    for (a in r) {}
    return v(a) || i.call(r, a);
  };
  var w = function isHTMLElement(r) {
    var a = HTMLElement;
    return r ? a ? r instanceof a : r.nodeType === e : false;
  };
  var b = function isElement(r) {
    var a = Element;
    return r ? a ? r instanceof a : r.nodeType === e : false;
  };
  var m = function indexOf(r, a, e) {
    return r.indexOf(a, e);
  };
  var y = function push(r, a, e) {
    !e && !l(a) && h(a) ? Array.prototype.push.apply(r, a) : r.push(a);
    return r;
  };
  var S = function from(r) {
    var a = Array.from;
    var e = [];
    if (a && r) {
      return a(r);
    }
    if (r instanceof Set) {
      r.forEach((function(r) {
        y(e, r);
      }));
    } else {
      each(r, (function(r) {
        y(e, r);
      }));
    }
    return e;
  };
  var C = function isEmptyArray(r) {
    return !!r && 0 === r.length;
  };
  var O = function runEachAndClear(r, a, e) {
    var n = function runFn(r) {
      return r && r.apply(void 0, a || []);
    };
    each(r, n);
    !e && (r.length = 0);
  };
  var x = function hasOwnProperty(r, a) {
    return Object.prototype.hasOwnProperty.call(r, a);
  };
  var E = function keys(r) {
    return r ? Object.keys(r) : [];
  };
  var A = function assignDeep(r, a, e, n, t, i, v) {
    var u = [ a, e, n, t, i, v ];
    if (("object" !== typeof r || o(r)) && !s(r)) {
      r = {};
    }
    each(u, (function(a) {
      each(E(a), (function(e) {
        var n = a[e];
        if (r === n) {
          return true;
        }
        var t = d(n);
        if (n && (p(n) || t)) {
          var i = r[e];
          var v = i;
          if (t && !d(i)) {
            v = [];
          } else if (!t && !p(i)) {
            v = {};
          }
          r[e] = assignDeep(v, n);
        } else {
          r[e] = n;
        }
      }));
    }));
    return r;
  };
  var P = function isEmptyObject(r) {
    for (var a in r) {
      return false;
    }
    return true;
  };
  var T = function getSetProp(r, a, e, n) {
    if (v(n)) {
      return e ? e[r] : a;
    }
    e && !o(n) && false !== n && (e[r] = n);
  };
  var z = function attr(r, a, e) {
    if (v(e)) {
      return r ? r.getAttribute(a) : null;
    }
    r && r.setAttribute(a, e);
  };
  var L = function attrClass(r, a, e, n) {
    if (e) {
      var t = z(r, a) || "";
      var i = new Set(t.split(" "));
      i[n ? "add" : "delete"](e);
      z(r, a, S(i).join(" ").trim());
    }
  };
  var D = function hasAttrClass(r, a, e) {
    var n = z(r, a) || "";
    var t = new Set(n.split(" "));
    return t.has(e);
  };
  var H = function removeAttr(r, a) {
    r && r.removeAttribute(a);
  };
  var M = function scrollLeft(r, a) {
    return T("scrollLeft", 0, r, a);
  };
  var R = function scrollTop(r, a) {
    return T("scrollTop", 0, r, a);
  };
  var I = Element.prototype;
  var V = function find(r, a) {
    var e = [];
    var n = a ? b(a) ? a : null : document;
    return n ? y(e, n.querySelectorAll(r)) : e;
  };
  var j = function findFirst(r, a) {
    var e = a ? b(a) ? a : null : document;
    return e ? e.querySelector(r) : null;
  };
  var k = function is(r, a) {
    if (b(r)) {
      var e = I.matches || I.msMatchesSelector;
      return e.call(r, a);
    }
    return false;
  };
  var B = function contents(r) {
    return r ? S(r.childNodes) : [];
  };
  var F = function parent(r) {
    return r ? r.parentElement : null;
  };
  var q = function closest(r, a) {
    if (b(r)) {
      var e = I.closest;
      if (e) {
        return e.call(r, a);
      }
      do {
        if (k(r, a)) {
          return r;
        }
        r = F(r);
      } while (r);
    }
    return null;
  };
  var U = function liesBetween(r, a, e) {
    var n = r && q(r, a);
    var t = r && j(e, n);
    return n && t ? n === r || t === r || q(q(r, e), a) !== n : false;
  };
  var N = function before(r, a, e) {
    if (e) {
      var n = a;
      var t;
      if (r) {
        if (h(e)) {
          t = document.createDocumentFragment();
          each(e, (function(r) {
            if (r === n) {
              n = r.previousSibling;
            }
            t.appendChild(r);
          }));
        } else {
          t = e;
        }
        if (a) {
          if (!n) {
            n = r.firstChild;
          } else if (n !== a) {
            n = n.nextSibling;
          }
        }
        r.insertBefore(t, n || null);
      }
    }
  };
  var Y = function appendChildren(r, a) {
    N(r, null, a);
  };
  var W = function insertBefore(r, a) {
    N(F(r), r, a);
  };
  var G = function insertAfter(r, a) {
    N(F(r), r && r.nextSibling, a);
  };
  var X = function removeElements(r) {
    if (h(r)) {
      each(S(r), (function(r) {
        return removeElements(r);
      }));
    } else if (r) {
      var a = F(r);
      if (a) {
        a.removeChild(r);
      }
    }
  };
  var Z = function createDiv(r) {
    var a = document.createElement("div");
    if (r) {
      z(a, "class", r);
    }
    return a;
  };
  var $ = function createDOM(r) {
    var a = Z();
    a.innerHTML = r.trim();
    return each(B(a), (function(r) {
      return X(r);
    }));
  };
  var J = function firstLetterToUpper(r) {
    return r.charAt(0).toUpperCase() + r.slice(1);
  };
  var K = function getDummyStyle() {
    return Z().style;
  };
  var Q = [ "-webkit-", "-moz-", "-o-", "-ms-" ];
  var rr = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ];
  var ar = {};
  var er = {};
  var nr = function cssProperty(r) {
    var a = er[r];
    if (x(er, r)) {
      return a;
    }
    var e = J(r);
    var n = K();
    each(Q, (function(t) {
      var i = t.replace(/-/g, "");
      var v = [ r, t + r, i + e, J(i) + e ];
      return !(a = v.find((function(r) {
        return void 0 !== n[r];
      })));
    }));
    return er[r] = a || "";
  };
  var tr = function jsAPI(r) {
    var a = ar[r] || window[r];
    if (x(ar, r)) {
      return a;
    }
    each(rr, (function(e) {
      a = a || window[e + J(r)];
      return !a;
    }));
    ar[r] = a;
    return a;
  };
  var ir = tr("MutationObserver");
  var vr = tr("IntersectionObserver");
  var or = tr("ResizeObserver");
  var ur = tr("cancelAnimationFrame");
  var fr = tr("requestAnimationFrame");
  var lr = window.setTimeout;
  var cr = window.clearTimeout;
  var sr = /[^\x20\t\r\n\f]+/g;
  var dr = function classListAction(r, a, e) {
    var n = r && r.classList;
    var t;
    var i = 0;
    var v = false;
    if (n && a && l(a)) {
      var o = a.match(sr) || [];
      v = o.length > 0;
      while (t = o[i++]) {
        v = !!e(n, t) && v;
      }
    }
    return v;
  };
  var gr = function hasClass(r, a) {
    return dr(r, a, (function(r, a) {
      return r.contains(a);
    }));
  };
  var hr = function removeClass(r, a) {
    dr(r, a, (function(r, a) {
      return r.remove(a);
    }));
  };
  var pr = function addClass(r, a) {
    dr(r, a, (function(r, a) {
      return r.add(a);
    }));
    return hr.bind(0, r, a);
  };
  var _r = function equal(r, a, e, n) {
    if (r && a) {
      var t = true;
      each(e, (function(e) {
        var i = n ? n(r[e]) : r[e];
        var v = n ? n(a[e]) : a[e];
        if (i !== v) {
          t = false;
        }
      }));
      return t;
    }
    return false;
  };
  var wr = function equalWH(r, a) {
    return _r(r, a, [ "w", "h" ]);
  };
  var br = function equalXY(r, a) {
    return _r(r, a, [ "x", "y" ]);
  };
  var mr = function equalTRBL(r, a) {
    return _r(r, a, [ "t", "r", "b", "l" ]);
  };
  var yr = function equalBCRWH(r, a, e) {
    return _r(r, a, [ "width", "height" ], e && function(r) {
      return Math.round(r);
    });
  };
  var Sr = function noop() {};
  var Cr = function debounce(r, a) {
    var e;
    var n;
    var t;
    var i = Sr;
    var v = a || {}, o = v.p, u = v._, l = v.m;
    var c = function invokeFunctionToDebounce(a) {
      i();
      cr(e);
      e = n = void 0;
      i = Sr;
      r.apply(this, a);
    };
    var d = function mergeParms(r) {
      return l && n ? l(n, r) : r;
    };
    var g = function flush() {
      if (i !== Sr) {
        c(d(t) || t);
      }
    };
    var h = function debouncedFn() {
      var r = S(arguments);
      var a = s(o) ? o() : o;
      var v = f(a) && a >= 0;
      if (v) {
        var l = s(u) ? u() : u;
        var h = f(l) && l >= 0;
        var p = a > 0 ? lr : fr;
        var w = a > 0 ? cr : ur;
        var b = d(r);
        var m = b || r;
        var y = c.bind(0, m);
        i();
        var C = p(y, a);
        i = function clear() {
          return w(C);
        };
        if (h && !e) {
          e = lr(g, l);
        }
        n = t = m;
      } else {
        c(r);
      }
    };
    h.S = g;
    return h;
  };
  var Or = {
    opacity: 1,
    zindex: 1
  };
  var xr = function parseToZeroOrNumber(r, a) {
    var e = a ? parseFloat(r) : parseInt(r, 10);
    return e === e ? e : 0;
  };
  var Er = function adaptCSSVal(r, a) {
    return !Or[r.toLowerCase()] && f(a) ? a + "px" : a;
  };
  var Ar = function getCSSVal(r, a, e) {
    return null != a ? a[e] || a.getPropertyValue(e) : r.style[e];
  };
  var Pr = function setCSSVal(r, a, e) {
    try {
      var n = r.style;
      if (!v(n[a])) {
        n[a] = Er(a, e);
      } else {
        n.setProperty(a, e);
      }
    } catch (t) {}
  };
  var Tr = function directionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var zr = function topRightBottomLeft(r, a, e) {
    var n = a ? a + "-" : "";
    var t = e ? "-" + e : "";
    var i = n + "top" + t;
    var v = n + "right" + t;
    var o = n + "bottom" + t;
    var u = n + "left" + t;
    var f = style(r, [ i, v, o, u ]);
    return {
      t: xr(f[i]),
      r: xr(f[v]),
      b: xr(f[o]),
      l: xr(f[u])
    };
  };
  var Lr = {
    w: 0,
    h: 0
  };
  var Dr = function windowSize() {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    };
  };
  var Hr = function offsetSize(r) {
    return r ? {
      w: r.offsetWidth,
      h: r.offsetHeight
    } : Lr;
  };
  var Mr = function clientSize(r) {
    return r ? {
      w: r.clientWidth,
      h: r.clientHeight
    } : Lr;
  };
  var Rr = function scrollSize(r) {
    return r ? {
      w: r.scrollWidth,
      h: r.scrollHeight
    } : Lr;
  };
  var Ir = function fractionalSize(r) {
    var a = parseFloat(style(r, "height")) || 0;
    var e = parseFloat(style(r, "height")) || 0;
    return {
      w: e - Math.round(e),
      h: a - Math.round(a)
    };
  };
  var Vr = function getBoundingClientRect(r) {
    return r.getBoundingClientRect();
  };
  var jr;
  var kr = function supportPassiveEvents() {
    if (v(jr)) {
      jr = false;
      try {
        window.addEventListener("test", null, Object.defineProperty({}, "passive", {
          get: function get() {
            jr = true;
          }
        }));
      } catch (r) {}
    }
    return jr;
  };
  var Br = function splitEventNames(r) {
    return r.split(" ");
  };
  var Fr = function off(r, a, e, n) {
    each(Br(a), (function(a) {
      r.removeEventListener(a, e, n);
    }));
  };
  var qr = function on(r, a, e, n) {
    var t;
    var i = kr();
    var v = null != (t = i && n && n.C) ? t : i;
    var o = n && n.O || false;
    var u = n && n.A || false;
    var f = [];
    var l = i ? {
      passive: v,
      capture: o
    } : o;
    each(Br(a), (function(a) {
      var n = u ? function(t) {
        r.removeEventListener(a, n, o);
        e && e(t);
      } : e;
      y(f, Fr.bind(null, r, a, n, o));
      r.addEventListener(a, n, l);
    }));
    return O.bind(0, f);
  };
  var Ur = function stopPropagation(r) {
    return r.stopPropagation();
  };
  var Nr = function preventDefault(r) {
    return r.preventDefault();
  };
  var Yr = {
    x: 0,
    y: 0
  };
  var Wr = function absoluteCoordinates(r) {
    var a = r ? Vr(r) : 0;
    return a ? {
      x: a.left + window.pageYOffset,
      y: a.top + window.pageXOffset
    } : Yr;
  };
  var Gr = function manageListener(r, a) {
    each(d(a) ? a : [ a ], r);
  };
  var Xr = function createEventListenerHub(r) {
    var a = new Map;
    var e = function removeEvent(r, e) {
      if (r) {
        var n = a.get(r);
        Gr((function(r) {
          if (n) {
            n[r ? "delete" : "clear"](r);
          }
        }), e);
      } else {
        a.forEach((function(r) {
          r.clear();
        }));
        a.clear();
      }
    };
    var n = function addEvent(r, n) {
      var t = a.get(r) || new Set;
      a.set(r, t);
      Gr((function(r) {
        r && t.add(r);
      }), n);
      return e.bind(0, r, n);
    };
    var t = function triggerEvent(r, e) {
      var n = a.get(r);
      each(S(n), (function(r) {
        if (e && !C(e)) {
          r.apply(0, e);
        } else {
          r();
        }
      }));
    };
    var i = E(r);
    each(i, (function(a) {
      n(a, r[a]);
    }));
    return [ n, e, t ];
  };
  var Zr = function getPropByPath(r, a) {
    return r ? a.split(".").reduce((function(r, a) {
      return r && x(r, a) ? r[a] : void 0;
    }), r) : void 0;
  };
  var $r = function createOptionCheck(r, a, e) {
    return function(n) {
      return [ Zr(r, n), e || void 0 !== Zr(a, n) ];
    };
  };
  var Jr = function createState(r) {
    var a = r;
    return [ function() {
      return a;
    }, function(r) {
      a = A({}, a, r);
    } ];
  };
  var Kr = "os-environment";
  var Qr = Kr + "-flexbox-glue";
  var ra = Qr + "-max";
  var aa = "data-overlayscrollbars";
  var ea = aa + "-overflow-x";
  var na = aa + "-overflow-y";
  var ta = "overflowVisible";
  var ia = "scrollbarHidden";
  var va = "updating";
  var oa = "os-padding";
  var ua = "os-viewport";
  var fa = ua + "-arrange";
  var la = "os-content";
  var ca = ua + "-scrollbar-hidden";
  var sa = "os-overflow-visible";
  var da = "os-size-observer";
  var ga = da + "-appear";
  var ha = da + "-listener";
  var pa = ha + "-scroll";
  var _a = ha + "-item";
  var wa = _a + "-final";
  var ba = "os-trinsic-observer";
  var ma = "os-scrollbar";
  var ya = ma + "-rtl";
  var Sa = ma + "-horizontal";
  var Ca = ma + "-vertical";
  var Oa = ma + "-track";
  var xa = ma + "-handle";
  var Ea = ma + "-visible";
  var Aa = ma + "-cornerless";
  var Pa = ma + "-transitionless";
  var Ta = ma + "-interaction";
  var za = ma + "-unusable";
  var La = ma + "-auto-hidden";
  var Da = Oa + "-interactive";
  var Ha = xa + "-interactive";
  var Ma = function opsStringify(r) {
    return JSON.stringify(r, (function(r, a) {
      if (s(a)) {
        throw new Error;
      }
      return a;
    }));
  };
  var Ra = {
    paddingAbsolute: false,
    showNativeOverlaidScrollbars: false,
    updating: {
      elementEvents: [ [ "img", "load" ] ],
      debounce: [ 0, 33 ],
      attributes: null,
      ignoreMutation: null
    },
    overflow: {
      x: "scroll",
      y: "scroll"
    },
    scrollbars: {
      theme: "os-theme-dark",
      visibility: "auto",
      autoHide: "never",
      autoHideDelay: 800,
      dragScroll: true,
      clickScroll: false,
      pointers: [ "mouse", "touch", "pen" ]
    }
  };
  var Ia = function getOptionsDiff(r, a) {
    var e = {};
    var n = E(a).concat(E(r));
    each(n, (function(n) {
      var t = r[n];
      var i = a[n];
      if (g(t) && g(i)) {
        A(e[n] = {}, getOptionsDiff(t, i));
      } else if (x(a, n) && i !== t) {
        var v = true;
        if (d(t) || d(i)) {
          try {
            if (Ma(t) === Ma(i)) {
              v = false;
            }
          } catch (o) {}
        }
        if (v) {
          e[n] = i;
        }
      }
    }));
    return e;
  };
  var Va = {};
  var ja = function getPlugins() {
    return A({}, Va);
  };
  var ka = function addPlugin(r) {
    each(d(r) ? r : [ r ], (function(r) {
      each(E(r), (function(a) {
        Va[a] = r[a];
      }));
    }));
  };
  var Ba = {
    exports: {}
  };
  (function(r) {
    function _extends() {
      r.exports = _extends = Object.assign ? Object.assign.bind() : function(r) {
        for (var a = 1; a < arguments.length; a++) {
          var e = arguments[a];
          for (var n in e) {
            if (Object.prototype.hasOwnProperty.call(e, n)) {
              r[n] = e[n];
            }
          }
        }
        return r;
      }, r.exports.v = true, r.exports["default"] = r.exports;
      return _extends.apply(this, arguments);
    }
    r.exports = _extends, r.exports.v = true, r.exports["default"] = r.exports;
  })(Ba);
  var Fa = getDefaultExportFromCjs(Ba.exports);
  var qa = {
    boolean: "__TPL_boolean_TYPE__",
    number: "__TPL_number_TYPE__",
    string: "__TPL_string_TYPE__",
    array: "__TPL_array_TYPE__",
    object: "__TPL_object_TYPE__",
    function: "__TPL_function_TYPE__",
    null: "__TPL_null_TYPE__"
  };
  var Ua = function validateRecursive(r, a, e, n) {
    var t = {};
    var i = Fa({}, a);
    var o = E(r).filter((function(r) {
      return x(a, r);
    }));
    each(o, (function(o) {
      var f = a[o];
      var c = r[o];
      var s = p(c);
      var g = n ? n + "." : "";
      if (s && p(f)) {
        var h = validateRecursive(c, f, e, g + o), w = h[0], b = h[1];
        t[o] = w;
        i[o] = b;
        each([ i, t ], (function(r) {
          if (P(r[o])) {
            delete r[o];
          }
        }));
      } else if (!s) {
        var m = false;
        var S = [];
        var C = [];
        var O = u(f);
        var x = !d(c) ? [ c ] : c;
        each(x, (function(r) {
          var a;
          each(qa, (function(e, n) {
            if (e === r) {
              a = n;
            }
          }));
          var e = v(a);
          if (e && l(f)) {
            var n = r.split(" ");
            m = !!n.find((function(r) {
              return r === f;
            }));
            y(S, n);
          } else {
            m = qa[O] === r;
          }
          y(C, e ? qa.string : a);
          return !m;
        }));
        if (m) {
          t[o] = f;
        } else if (e) {
          console.warn('The option "' + g + o + "\" wasn't set, because it doesn't accept the type [ " + O.toUpperCase() + ' ] with the value of "' + f + '".\r\n' + "Accepted types are: [ " + C.join(", ").toUpperCase() + " ].\r\n" + (S.length > 0 ? "\r\nValid strings are: [ " + S.join(", ") + " ]." : ""));
        }
        delete i[o];
      }
    }));
    return [ t, i ];
  };
  var Na = function validateOptions(r, a, e) {
    return Ua(r, a, e);
  };
  var Ya;
  var Wa = qa.number;
  var Ga = qa.boolean;
  var Xa = [ qa.array, qa.null ];
  var Za = "hidden scroll visible visible-hidden";
  var $a = "visible hidden auto";
  var Ja = "never scroll leavemove";
  var Ka = {
    paddingAbsolute: Ga,
    showNativeOverlaidScrollbars: Ga,
    updating: {
      elementEvents: Xa,
      attributes: Xa,
      debounce: [ qa.number, qa.array, qa.null ],
      ignoreMutation: [ qa.function, qa.null ]
    },
    overflow: {
      x: Za,
      y: Za
    },
    scrollbars: {
      theme: [ qa.string, qa.null ],
      visibility: $a,
      autoHide: Ja,
      autoHideDelay: Wa,
      dragScroll: Ga,
      clickScroll: Ga,
      pointers: [ qa.array, qa.null ]
    }
  };
  var Qa = "__osOptionsValidationPlugin";
  Ya = {}, Ya[Qa] = {
    P: function _(r, a) {
      var e = Na(Ka, r, a), n = e[0], t = e[1];
      return Fa({}, t, n);
    }
  }, Ya;
  var re;
  var ae = 3333333;
  var ee = "scroll";
  var ne = "__osSizeObserverPlugin";
  var te = (re = {}, re[ne] = {
    P: function _(r, a, e) {
      var n = $('<div class="' + _a + '" dir="ltr"><div class="' + _a + '"><div class="' + wa + '"></div></div><div class="' + _a + '"><div class="' + wa + '" style="width: 200%; height: 200%"></div></div></div>');
      Y(r, n);
      pr(r, pa);
      var t = n[0];
      var i = t.lastChild;
      var v = t.firstChild;
      var o = null == v ? void 0 : v.firstChild;
      var u = Hr(t);
      var f = u;
      var l = false;
      var c;
      var s = function reset() {
        M(v, ae);
        R(v, ae);
        M(i, ae);
        R(i, ae);
      };
      var d = function onResized(r) {
        c = 0;
        if (l) {
          u = f;
          a(true === r);
        }
      };
      var g = function onScroll(r) {
        f = Hr(t);
        l = !r || !wr(f, u);
        if (r) {
          Ur(r);
          if (l && !c) {
            ur(c);
            c = fr(d);
          }
        } else {
          d(false === r);
        }
        s();
      };
      var h = y([], [ qr(v, ee, g), qr(i, ee, g) ]);
      style(o, {
        width: ae,
        height: ae
      });
      fr(s);
      return [ e ? g.bind(0, false) : s, h ];
    }
  }, re);
  var ie;
  var ve = 0;
  var oe = Math.round, ue = Math.abs;
  var fe = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var a = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / a;
  };
  var le = function diffBiggerThanOne(r, a) {
    var e = ue(r);
    var n = ue(a);
    return !(e === n || e + 1 === n || e - 1 === n);
  };
  var ce = "__osScrollbarsHidingPlugin";
  var se = (ie = {}, ie[ce] = {
    T: function _createUniqueViewportArrangeElement(r) {
      var a = r.L, e = r.D, n = r.H;
      var t = !n && !a && (e.x || e.y);
      var i = t ? document.createElement("style") : false;
      if (i) {
        z(i, "id", fa + "-" + ve);
        ve++;
      }
      return i;
    },
    M: function _overflowUpdateSegment(r, a, e, n, t, i, v) {
      var o = function arrangeViewport(a, i, v, o) {
        if (r) {
          var u = t(), f = u.R;
          var l = a.I, c = a.V;
          var s = c.x, d = c.y;
          var g = l.x, h = l.y;
          var p = o ? "paddingRight" : "paddingLeft";
          var w = f[p];
          var b = f.paddingTop;
          var m = i.w + v.w;
          var y = i.h + v.h;
          var S = {
            w: h && d ? h + m - w + "px" : "",
            h: g && s ? g + y - b + "px" : ""
          };
          if (n) {
            var C = n.sheet;
            if (C) {
              var O = C.cssRules;
              if (O) {
                if (!O.length) {
                  C.insertRule("#" + z(n, "id") + " + ." + fa + "::before {}", 0);
                }
                var x = O[0].style;
                x.width = S.w;
                x.height = S.h;
              }
            }
          } else {
            style(e, {
              "--os-vaw": S.w,
              "--os-vah": S.h
            });
          }
        }
        return r;
      };
      var u = function undoViewportArrange(n, o, u) {
        if (r) {
          var f = u || i(n);
          var l = t(), c = l.R;
          var s = f.V;
          var d = s.x, g = s.y;
          var h = {};
          var p = function assignProps(r) {
            return each(r.split(" "), (function(r) {
              h[r] = c[r];
            }));
          };
          if (d) {
            p("marginBottom paddingTop paddingBottom");
          }
          if (g) {
            p("marginLeft marginRight paddingLeft paddingRight");
          }
          var w = style(e, E(h));
          hr(e, fa);
          if (!a) {
            h.height = "";
          }
          style(e, h);
          return [ function() {
            v(f, o, r, w);
            style(e, w);
            pr(e, fa);
          }, f ];
        }
        return [ Sr ];
      };
      return [ o, u ];
    },
    j: function _envWindowZoom() {
      var r = {
        w: 0,
        h: 0
      };
      var a = 0;
      return function(e, n, t) {
        var i = Dr();
        var v = {
          w: i.w - r.w,
          h: i.h - r.h
        };
        if (0 === v.w && 0 === v.h) {
          return;
        }
        var o = {
          w: ue(v.w),
          h: ue(v.h)
        };
        var u = {
          w: ue(oe(i.w / (r.w / 100))),
          h: ue(oe(i.h / (r.h / 100)))
        };
        var f = fe();
        var l = o.w > 2 && o.h > 2;
        var c = !le(u.w, u.h);
        var s = f !== a && f > 0;
        var d = l && c && s;
        if (d) {
          var g = n(), h = g[0], p = g[1];
          A(e.k, h);
          if (p) {
            t();
          }
        }
        r = i;
        a = f;
      };
    }
  }, ie);
  var de;
  var ge = function getNativeScrollbarSize(r, a, e, n) {
    Y(r, a);
    var t = Mr(a);
    var i = Hr(a);
    var v = Ir(e);
    n && X(a);
    return {
      x: i.h - t.h + v.h,
      y: i.w - t.w + v.w
    };
  };
  var he = function getNativeScrollbarsHiding(r) {
    var a = false;
    var e = pr(r, ca);
    try {
      a = "none" === style(r, nr("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (n) {}
    e();
    return a;
  };
  var pe = function getRtlScrollBehavior(r, a) {
    var e = "hidden";
    style(r, {
      overflowX: e,
      overflowY: e,
      direction: "rtl"
    });
    M(r, 0);
    var n = Wr(r);
    var t = Wr(a);
    M(r, -999);
    var i = Wr(a);
    return {
      i: n.x === t.x,
      n: t.x !== i.x
    };
  };
  var _e = function getFlexboxGlue(r, a) {
    var e = pr(r, Qr);
    var n = Vr(r);
    var t = Vr(a);
    var i = yr(t, n, true);
    var v = pr(r, ra);
    var o = Vr(r);
    var u = Vr(a);
    var f = yr(u, o, true);
    e();
    v();
    return i && f;
  };
  var we = function createEnvironment() {
    var r = document, e = r.body;
    var n = $('<div class="' + Kr + '"><div></div></div>');
    var t = n[0];
    var i = t.firstChild;
    var v = Xr(), o = v[0], u = v[2];
    var f = a({
      o: ge(e, t, i),
      u: br
    }, ge.bind(0, e, t, i, true)), l = f[0], c = f[1];
    var s = c(), d = s[0];
    var g = he(t);
    var h = {
      x: 0 === d.x,
      y: 0 === d.y
    };
    var p = {
      host: null,
      padding: !g,
      viewport: function viewport(r) {
        return g && r === r.ownerDocument.body && r;
      },
      content: false,
      scrollbarsSlot: true,
      cancel: {
        nativeScrollbarsOverlaid: true,
        body: null
      }
    };
    var w = A({}, Ra);
    var b = {
      k: d,
      D: h,
      L: g,
      H: "-1" === style(t, "zIndex"),
      B: pe(t, i),
      F: _e(t, i),
      q: function _addListener(r) {
        return o("_", r);
      },
      U: A.bind(0, {}, p),
      N: function _setDefaultInitialization(r) {
        A(p, r);
      },
      Y: A.bind(0, {}, w),
      W: function _setDefaultOptions(r) {
        A(w, r);
      },
      G: A({}, p),
      X: A({}, w)
    };
    H(t, "style");
    X(t);
    if (!g && (!h.x || !h.y)) {
      var m;
      window.addEventListener("resize", (function() {
        var r = ja()[ce];
        m = m || r && r.j();
        m && m(b, l, u.bind(0, "_"));
      }));
    }
    return b;
  };
  var be = function getEnvironment() {
    if (!de) {
      de = we();
    }
    return de;
  };
  var me = function resolveInitialization(r, a) {
    return s(r) ? r.apply(0, a) : r;
  };
  var ye = function staticInitializationElement(r, a, e, n) {
    var t = v(n) ? e : n;
    var i = me(t, r);
    return i || a();
  };
  var Se = function dynamicInitializationElement(r, a, e, n) {
    var t = v(n) ? e : n;
    var i = me(t, r);
    return !!i && (w(i) ? i : a());
  };
  var Ce = function cancelInitialization(r, a) {
    var e = r || {}, n = e.nativeScrollbarsOverlaid, t = e.body;
    var i = a.Z, u = a.$;
    var f = be(), l = f.U, c = f.D;
    var s = l().cancel, d = s.nativeScrollbarsOverlaid, g = s.body;
    var h = null != n ? n : d;
    var p = v(t) ? g : t;
    var w = (c.x || c.y) && h;
    var b = i && (o(p) ? !u : p);
    return !!w || !!b;
  };
  var Oe = Z.bind(0, "");
  var xe = function unwrap(r) {
    Y(F(r), B(r));
    X(r);
  };
  var Ee = function addDataAttrHost(r, a) {
    z(r, aa, a);
    return H.bind(0, r, aa);
  };
  var Ae = function createStructureSetupElements(r) {
    var a = be();
    var e = a.U, n = a.L;
    var t = ja()[ce];
    var i = t && t.T;
    var v = e(), o = v.host, u = v.viewport, f = v.padding, l = v.content;
    var c = w(r);
    var s = c ? {} : r;
    var d = s.host, g = s.padding, h = s.viewport, p = s.content;
    var b = c ? r : s.target;
    var S = k(b, "textarea");
    var C = b.ownerDocument;
    var x = b === C.body;
    var A = C.defaultView;
    var P = ye.bind(0, [ b ]);
    var T = Se.bind(0, [ b ]);
    var z = P(Oe, u, h);
    var M = z === b;
    var R = {
      J: b,
      K: S ? P(Oe, o, d) : b,
      rr: z,
      ar: !M && T(Oe, f, g),
      er: !M && T(Oe, l, p),
      nr: !M && !n && i && i(a),
      tr: x ? C.documentElement : z,
      ir: x ? C : z,
      vr: A,
      ur: C,
      lr: S,
      Z: x,
      cr: c,
      $: M,
      sr: function _viewportHasClass(r, a) {
        return M ? D(z, aa, a) : gr(z, r);
      },
      dr: function _viewportAddRemoveClass(r, a, e) {
        return M ? L(z, aa, a, e) : (e ? pr : hr)(z, r);
      }
    };
    var I = E(R).reduce((function(r, a) {
      var e = R[a];
      return y(r, e && !F(e) ? e : false);
    }), []);
    var V = function elementIsGenerated(r) {
      return r ? m(I, r) > -1 : null;
    };
    var j = R.J, q = R.K, U = R.ar, N = R.rr, Z = R.er, $ = R.nr;
    var J = [];
    var K = S && V(q);
    var Q = S ? j : B([ Z, N, U, q, j ].find((function(r) {
      return false === V(r);
    })));
    var rr = Z || N;
    var ar = function appendElements() {
      var r = Ee(q, M ? "viewport" : "host");
      var a = pr(U, oa);
      var e = pr(N, !M && ua);
      var t = pr(Z, la);
      var i = x ? pr(F(b), ca) : Sr;
      if (K) {
        G(j, q);
        y(J, (function() {
          G(q, j);
          X(q);
        }));
      }
      Y(rr, Q);
      Y(q, U);
      Y(U || q, !M && N);
      Y(N, Z);
      y(J, (function() {
        i();
        r();
        H(N, ea);
        H(N, na);
        if (V(Z)) {
          xe(Z);
        }
        if (V(N)) {
          xe(N);
        }
        if (V(U)) {
          xe(U);
        }
        a();
        e();
        t();
      }));
      if (n && !M) {
        y(J, hr.bind(0, N, ca));
      }
      if ($) {
        W(N, $);
        y(J, X.bind(0, $));
      }
    };
    return [ R, ar, O.bind(0, J) ];
  };
  var Pe = function createTrinsicUpdateSegment(r, a) {
    var e = r.er;
    var n = a[0];
    return function(r) {
      var a = be(), t = a.F;
      var i = n(), v = i.gr;
      var o = r.hr;
      var u = (e || !t) && o;
      if (u) {
        style(e, {
          height: v ? "" : "100%"
        });
      }
      return {
        pr: u,
        _r: u
      };
    };
  };
  var Te = function createPaddingUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.K, v = r.ar, o = r.rr, u = r.$;
    var f = a({
      u: mr,
      o: zr()
    }, zr.bind(0, i, "padding", "")), l = f[0], c = f[1];
    return function(r, a, e) {
      var i = c(e), f = i[0], s = i[1];
      var d = be(), g = d.L, h = d.F;
      var p = n(), w = p.wr;
      var b = r.pr, m = r._r, y = r.br;
      var S = a("paddingAbsolute"), C = S[0], O = S[1];
      var x = !h && m;
      if (b || s || x) {
        var E = l(e);
        f = E[0];
        s = E[1];
      }
      var P = !u && (O || y || s);
      if (P) {
        var T = !C || !v && !g;
        var z = f.r + f.l;
        var L = f.t + f.b;
        var D = {
          marginRight: T && !w ? -z : 0,
          marginBottom: T ? -L : 0,
          marginLeft: T && w ? -z : 0,
          top: T ? -f.t : 0,
          right: T ? w ? -f.r : "auto" : 0,
          left: T ? w ? "auto" : -f.l : 0,
          width: T ? "calc(100% + " + z + "px)" : ""
        };
        var H = {
          paddingTop: T ? f.t : 0,
          paddingRight: T ? f.r : 0,
          paddingBottom: T ? f.b : 0,
          paddingLeft: T ? f.l : 0
        };
        style(v || o, D);
        style(o, H);
        t({
          ar: f,
          mr: !T,
          R: v ? H : A({}, D, H)
        });
      }
      return {
        yr: P
      };
    };
  };
  var ze = Math.max;
  var Le = ze.bind(0, 0);
  var De = "visible";
  var He = "hidden";
  var Me = 42;
  var Re = {
    u: wr,
    o: {
      w: 0,
      h: 0
    }
  };
  var Ie = {
    u: br,
    o: {
      x: He,
      y: He
    }
  };
  var Ve = function getOverflowAmount(r, a) {
    var e = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
    var n = {
      w: Le(r.w - a.w),
      h: Le(r.h - a.h)
    };
    return {
      w: n.w > e ? n.w : 0,
      h: n.h > e ? n.h : 0
    };
  };
  var je = function conditionalClass(r, a, e) {
    return e ? pr(r, a) : hr(r, a);
  };
  var ke = function overflowIsVisible(r) {
    return 0 === r.indexOf(De);
  };
  var Be = function createOverflowUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.K, v = r.ar, o = r.rr, u = r.nr, f = r.$, l = r.dr;
    var c = be(), s = c.k, d = c.F, g = c.L, h = c.D;
    var p = ja()[ce];
    var w = !f && !g && (h.x || h.y);
    var b = a(Re, Ir.bind(0, o)), m = b[0], y = b[1];
    var S = a(Re, Rr.bind(0, o)), C = S[0], O = S[1];
    var x = a(Re), E = x[0], A = x[1];
    var P = a(Re), T = P[0], D = P[1];
    var H = a(Ie), M = H[0];
    var R = function fixFlexboxGlue(r, a) {
      style(o, {
        height: ""
      });
      if (a) {
        var e = n(), t = e.mr, v = e.ar;
        var u = r.Sr, f = r.I;
        var l = Ir(i);
        var c = Mr(i);
        var s = "content-box" === style(o, "boxSizing");
        var d = t || s ? v.b + v.t : 0;
        var g = !(h.x && s);
        style(o, {
          height: c.h + l.h + (u.x && g ? f.x : 0) - d
        });
      }
    };
    var I = function getViewportOverflowState(r, a) {
      var e = !g && !r ? Me : 0;
      var n = function getStatePerAxis(r, n, t) {
        var i = style(o, r);
        var v = a ? a[r] : i;
        var u = "scroll" === v;
        var f = n ? e : t;
        var l = u && !g ? f : 0;
        var c = n && !!e;
        return [ i, u, l, c ];
      };
      var t = n("overflowX", h.x, s.x), i = t[0], v = t[1], u = t[2], f = t[3];
      var l = n("overflowY", h.y, s.y), c = l[0], d = l[1], p = l[2], w = l[3];
      return {
        Cr: {
          x: i,
          y: c
        },
        Sr: {
          x: v,
          y: d
        },
        I: {
          x: u,
          y: p
        },
        V: {
          x: f,
          y: w
        }
      };
    };
    var V = function setViewportOverflowState(r, a, e, n) {
      var t = function setAxisOverflowStyle(r, a) {
        var e = ke(r);
        var n = a && e && r.replace(De + "-", "") || "";
        return [ a && !e ? r : "", ke(n) ? "hidden" : n ];
      };
      var i = t(e.x, a.x), v = i[0], o = i[1];
      var u = t(e.y, a.y), f = u[0], l = u[1];
      n.overflowX = o && f ? o : v;
      n.overflowY = l && v ? l : f;
      return I(r, n);
    };
    var j = function hideNativeScrollbars(r, a, e, t) {
      var i = r.I, v = r.V;
      var o = v.x, u = v.y;
      var f = i.x, l = i.y;
      var c = n(), s = c.R;
      var d = a ? "marginLeft" : "marginRight";
      var g = a ? "paddingLeft" : "paddingRight";
      var h = s[d];
      var p = s.marginBottom;
      var w = s[g];
      var b = s.paddingBottom;
      t.width = "calc(100% + " + (l + -1 * h) + "px)";
      t[d] = -l + h;
      t.marginBottom = -f + p;
      if (e) {
        t[g] = w + (u ? l : 0);
        t.paddingBottom = b + (o ? f : 0);
      }
    };
    var k = p ? p.M(w, d, o, u, n, I, j) : [ function() {
      return w;
    }, function() {
      return [ Sr ];
    } ], B = k[0], F = k[1];
    return function(r, a, e) {
      var u = r.pr, c = r.Or, s = r._r, p = r.yr, w = r.hr, b = r.br;
      var S = n(), x = S.gr, P = S.wr;
      var H = a("showNativeOverlaidScrollbars"), k = H[0], q = H[1];
      var U = a("overflow"), N = U[0], Y = U[1];
      var W = k && h.x && h.y;
      var G = !f && !d && (u || s || c || q || w);
      var X = ke(N.x);
      var Z = ke(N.y);
      var $ = X || Z;
      var J = y(e);
      var K = O(e);
      var Q = A(e);
      var rr = D(e);
      var ar;
      if (q && g) {
        l(ca, ia, !W);
      }
      if (G) {
        ar = I(W);
        R(ar, x);
      }
      if (u || p || s || b || q) {
        if ($) {
          l(sa, ta, false);
        }
        var er = F(W, P, ar), nr = er[0], tr = er[1];
        var ir = J = m(e), vr = ir[0], or = ir[1];
        var ur = K = C(e), fr = ur[0], lr = ur[1];
        var cr = Mr(o);
        var sr = fr;
        var dr = cr;
        nr();
        if ((lr || or || q) && tr && !W && B(tr, fr, vr, P)) {
          dr = Mr(o);
          sr = Rr(o);
        }
        var gr = {
          w: Le(ze(fr.w, sr.w) + vr.w),
          h: Le(ze(fr.h, sr.h) + vr.h)
        };
        var hr = {
          w: Le(dr.w + Le(cr.w - fr.w) + vr.w),
          h: Le(dr.h + Le(cr.h - fr.h) + vr.h)
        };
        rr = T(hr);
        Q = E(Ve(gr, hr), e);
      }
      var pr = rr, _r = pr[0], wr = pr[1];
      var br = Q, mr = br[0], yr = br[1];
      var Sr = K, Cr = Sr[0], Or = Sr[1];
      var xr = J, Er = xr[0], Ar = xr[1];
      var Pr = {
        x: mr.w > 0,
        y: mr.h > 0
      };
      var Tr = X && Z && (Pr.x || Pr.y) || X && Pr.x && !Pr.y || Z && Pr.y && !Pr.x;
      if (p || b || Ar || Or || wr || yr || Y || q || G) {
        var zr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Lr = V(W, Pr, N, zr);
        var Dr = B(Lr, Cr, Er, P);
        if (!f) {
          j(Lr, P, Dr, zr);
        }
        if (G) {
          R(Lr, x);
        }
        if (f) {
          z(i, ea, zr.overflowX);
          z(i, na, zr.overflowY);
        } else {
          style(o, zr);
        }
      }
      L(i, aa, ta, Tr);
      je(v, sa, Tr);
      !f && je(o, sa, $);
      var Hr = M(I(W).Cr), Ir = Hr[0], Vr = Hr[1];
      t({
        Cr: Ir,
        Er: {
          x: _r.w,
          y: _r.h
        },
        Ar: {
          x: mr.w,
          y: mr.h
        },
        Pr: Pr
      });
      return {
        Tr: Vr,
        zr: wr,
        Lr: yr
      };
    };
  };
  var Fe = function prepareUpdateHints(r, a, e) {
    var n = {};
    var t = a || {};
    var i = E(r).concat(E(t));
    each(i, (function(a) {
      var i = r[a];
      var v = t[a];
      n[a] = !!(e || i || v);
    }));
    return n;
  };
  var qe = function createStructureSetupUpdate(r, a) {
    var e = r.rr, n = r.dr;
    var t = be(), i = t.L, v = t.D, o = t.F;
    var u = !i && (v.x || v.y);
    var f = [ Pe(r, a), Te(r, a), Be(r, a) ];
    return function(r, a, t) {
      var i = Fe(A({
        pr: false,
        yr: false,
        br: false,
        hr: false,
        zr: false,
        Lr: false,
        Tr: false,
        Or: false,
        _r: false
      }, a), {}, t);
      var v = u || !o;
      var l = v && M(e);
      var c = v && R(e);
      n("", va, true);
      var s = i;
      each(f, (function(a) {
        s = Fe(s, a(s, r, !!t) || {}, t);
      }));
      M(e, l);
      R(e, c);
      n("", va);
      return s;
    };
  };
  var Ue = 3333333;
  var Ne = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var Ye = function createSizeObserver(r, e, n) {
    var t = n || {}, i = t.Dr, v = void 0 === i ? false : i, o = t.Hr, u = void 0 === o ? false : o;
    var f = ja()[ne];
    var l = be(), s = l.B;
    var h = $('<div class="' + da + '"><div class="' + ha + '"></div></div>');
    var p = h[0];
    var w = p.firstChild;
    var b = Tr.bind(0, r);
    var m = a({
      o: void 0,
      g: true,
      u: function _equal(r, a) {
        return !(!r || !Ne(r) && Ne(a));
      }
    }), S = m[0];
    var C = function onSizeChangedCallbackProxy(r) {
      var a = d(r) && r.length > 0 && g(r[0]);
      var n = !a && c(r[0]);
      var t = false;
      var i = false;
      var o = true;
      if (a) {
        var u = S(r.pop().contentRect), f = u[0], l = u[2];
        var h = Ne(f);
        var w = Ne(l);
        t = !l || !h;
        i = !w && h;
        o = !t;
      } else if (n) {
        o = r[1];
      } else {
        i = true === r;
      }
      if (v && o) {
        var b = n ? r[0] : Tr(p);
        M(p, b ? s.n ? -Ue : s.i ? 0 : Ue : Ue);
        R(p, Ue);
      }
      if (!t) {
        e({
          pr: !n,
          Mr: n ? r : void 0,
          Hr: !!i
        });
      }
    };
    var x = [];
    var E = u ? C : false;
    return [ function() {
      O(x);
      X(p);
    }, function() {
      if (or) {
        var e = new or(C);
        e.observe(w);
        y(x, (function() {
          e.disconnect();
        }));
      } else if (f) {
        var n = f.P(w, C, u), t = n[0], i = n[1];
        E = t;
        y(x, i);
      }
      if (v) {
        var o = a({
          o: !b()
        }, b), l = o[0];
        y(x, qr(p, "scroll", (function(r) {
          var a = l();
          var e = a[0], n = a[1];
          if (n) {
            hr(w, "ltr rtl");
            if (e) {
              pr(w, "rtl");
            } else {
              pr(w, "ltr");
            }
            C(a);
          }
          Ur(r);
        })));
      }
      if (E) {
        pr(p, ga);
        y(x, qr(p, "animationstart", E, {
          A: !!or
        }));
      }
      Y(r, p);
    } ];
  };
  var We = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var Ge = function createTrinsicObserver(r, e) {
    var n;
    var t = Z(ba);
    var i = [];
    var v = a({
      o: false
    }), o = v[0];
    var u = function triggerOnTrinsicChangedCallback(r, a) {
      if (r) {
        var n = o(We(r));
        var t = n[1];
        if (t) {
          !a && e(n);
          return [ n ];
        }
      }
    };
    var f = function intersectionObserverCallback(r, a) {
      if (r && r.length > 0) {
        return u(r.pop(), a);
      }
    };
    return [ function() {
      O(i);
      X(t);
    }, function() {
      if (vr) {
        n = new vr((function(r) {
          return f(r);
        }), {
          root: r
        });
        n.observe(t);
        y(i, (function() {
          n.disconnect();
        }));
      } else {
        var a = function onSizeChanged() {
          var r = Hr(t);
          u(r);
        };
        var e = Ye(t, a), v = e[0], o = e[1];
        y(i, v);
        o();
        a();
      }
      Y(r, t);
    }, function() {
      if (n) {
        return f(n.takeRecords(), true);
      }
    } ];
  };
  var Xe = function createEventContentChange(r, a, e) {
    var n;
    var t = false;
    var i = function destroy() {
      t = true;
    };
    var v = function updateElements(i) {
      if (e) {
        var v = e.reduce((function(a, e) {
          if (e) {
            var n = e[0];
            var t = e[1];
            var v = t && n && (i ? i(n) : V(n, r));
            if (v && v.length && t && l(t)) {
              y(a, [ v, t.trim() ], true);
            }
          }
          return a;
        }), []);
        each(v, (function(r) {
          return each(r[0], (function(e) {
            var i = r[1];
            var v = n.get(e);
            if (v) {
              var o = v[0];
              var u = v[1];
              if (o === i) {
                u();
              }
            }
            var f = qr(e, i, (function(r) {
              if (t) {
                f();
                n.delete(e);
              } else {
                a(r);
              }
            }));
            n.set(e, [ i, f ]);
          }));
        }));
      }
    };
    if (e) {
      n = new WeakMap;
      v();
    }
    return [ i, v ];
  };
  var Ze = function createDOMObserver(r, a, e, n) {
    var t = false;
    var i = n || {}, v = i.Rr, o = i.Ir, u = i.Vr, f = i.jr, c = i.kr, s = i.Br;
    var d = Cr((function() {
      if (t) {
        e(true);
      }
    }), {
      p: 33,
      _: 99
    });
    var g = Xe(r, d, u), h = g[0], p = g[1];
    var w = v || [];
    var b = o || [];
    var S = w.concat(b);
    var O = function observerCallback(t, i) {
      var v = c || Sr;
      var o = s || Sr;
      var u = [];
      var d = [];
      var g = false;
      var h = false;
      var w = false;
      each(t, (function(e) {
        var t = e.attributeName, i = e.target, c = e.type, s = e.oldValue, p = e.addedNodes;
        var S = "attributes" === c;
        var C = "childList" === c;
        var O = r === i;
        var x = S && l(t) ? z(i, t) : 0;
        var E = 0 !== x && s !== x;
        var A = m(b, t) > -1 && E;
        if (a && !O) {
          var P = !S;
          var T = S && A;
          var L = T && f && k(i, f);
          var D = L ? !v(i, t, s, x) : P || T;
          var H = D && !o(e, !!L, r, n);
          y(d, p);
          h = h || H;
          w = w || C;
        }
        if (!a && O && E && !v(i, t, s, x)) {
          y(u, t);
          g = g || A;
        }
      }));
      if (w && !C(d)) {
        p((function(r) {
          return d.reduce((function(a, e) {
            y(a, V(r, e));
            return k(e, r) ? y(a, e) : a;
          }), []);
        }));
      }
      if (a) {
        !i && h && e(false);
        return [ false ];
      }
      if (!C(u) || g) {
        !i && e(u, g);
        return [ u, g ];
      }
    };
    var x = new ir((function(r) {
      return O(r);
    }));
    x.observe(r, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: S,
      subtree: a,
      childList: a,
      characterData: a
    });
    t = true;
    return [ function() {
      if (t) {
        h();
        x.disconnect();
        t = false;
      }
    }, function() {
      if (t) {
        d.S();
        var r = x.takeRecords();
        return !C(r) && O(r, true);
      }
    } ];
  };
  var $e = "[" + aa + "]";
  var Je = "." + ua;
  var Ke = [ "tabindex" ];
  var Qe = [ "wrap", "cols", "rows" ];
  var rn = [ "id", "class", "style", "open" ];
  var an = function createStructureSetupObservers(r, e, n) {
    var t;
    var i;
    var v;
    var o = e[1];
    var u = r.K, c = r.rr, g = r.er, h = r.lr, p = r.$, w = r.sr, b = r.dr;
    var S = be(), C = S.F;
    var O = a({
      u: wr,
      o: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = w(sa, ta);
      var a = w(fa, "");
      var e = a && M(c);
      var n = a && R(c);
      b(sa, ta);
      b(fa, "");
      b("", va, true);
      var t = Rr(g);
      var i = Rr(c);
      var v = Ir(c);
      b(sa, ta, r);
      b(fa, "", a);
      b("", va);
      M(c, e);
      R(c, n);
      return {
        w: i.w + t.w + v.w,
        h: i.h + t.h + v.h
      };
    })), x = O[0];
    var P = h ? Qe : rn.concat(Qe);
    var T = Cr(n, {
      p: function _timeout() {
        return t;
      },
      _: function _maxDelay() {
        return i;
      },
      m: function _mergeParams(r, a) {
        var e = r[0];
        var n = a[0];
        return [ E(e).concat(E(n)).reduce((function(r, a) {
          r[a] = e[a] || n[a];
          return r;
        }), {}) ];
      }
    });
    var L = function updateViewportAttrsFromHost(r) {
      each(r || Ke, (function(r) {
        if (m(Ke, r) > -1) {
          var a = z(u, r);
          if (l(a)) {
            z(c, r, a);
          } else {
            H(c, r);
          }
        }
      }));
    };
    var D = function onTrinsicChanged(r, a) {
      var e = r[0], t = r[1];
      var i = {
        hr: t
      };
      o({
        gr: e
      });
      !a && n(i);
      return i;
    };
    var I = function onSizeChanged(r) {
      var a = r.pr, e = r.Mr, t = r.Hr;
      var i = !a || t ? n : T;
      var v = false;
      if (e) {
        var u = e[0], f = e[1];
        v = f;
        o({
          wr: u
        });
      }
      i({
        pr: a,
        br: v
      });
    };
    var V = function onContentMutation(r, a) {
      var e = x(), t = e[1];
      var i = {
        _r: t
      };
      var v = r ? n : T;
      if (t) {
        !a && v(i);
      }
      return i;
    };
    var j = function onHostMutation(r, a, e) {
      var n = {
        Or: a
      };
      if (a) {
        !e && T(n);
      } else if (!p) {
        L(r);
      }
      return n;
    };
    var k = g || !C ? Ge(u, D) : [ Sr, Sr, Sr ], B = k[0], F = k[1], N = k[2];
    var Y = !p ? Ye(u, I, {
      Hr: true,
      Dr: true
    }) : [ Sr, Sr ], W = Y[0], G = Y[1];
    var X = Ze(u, false, j, {
      Ir: rn,
      Rr: rn.concat(Ke)
    }), Z = X[0], $ = X[1];
    var J = p && or && new or(I.bind(0, {
      pr: true
    }));
    J && J.observe(u);
    L();
    return [ function() {
      B();
      W();
      v && v[0]();
      J && J.disconnect();
      Z();
    }, function() {
      G();
      F();
    }, function() {
      var r = {};
      var a = $();
      var e = N();
      var n = v && v[1]();
      if (a) {
        A(r, j.apply(0, y(a, true)));
      }
      if (e) {
        A(r, D.apply(0, y(e, true)));
      }
      if (n) {
        A(r, V.apply(0, y(n, true)));
      }
      return r;
    }, function(r) {
      var a = r("updating.ignoreMutation"), e = a[0];
      var n = r("updating.attributes"), o = n[0], u = n[1];
      var l = r("updating.elementEvents"), h = l[0], p = l[1];
      var w = r("updating.debounce"), b = w[0], m = w[1];
      var y = p || u;
      var S = function ignoreMutationFromOptions(r) {
        return s(e) && e(r);
      };
      if (y) {
        if (v) {
          v[1]();
          v[0]();
        }
        v = Ze(g || c, true, V, {
          Ir: P.concat(o || []),
          Rr: P.concat(o || []),
          Vr: h,
          jr: $e,
          Br: function _ignoreContentChange(r, a) {
            var e = r.target, n = r.attributeName;
            var t = !a && n ? U(e, $e, Je) : false;
            return t || !!q(e, "." + ma) || !!S(r);
          }
        });
      }
      if (m) {
        T.S();
        if (d(b)) {
          var C = b[0];
          var O = b[1];
          t = f(C) ? C : false;
          i = f(O) ? O : false;
        } else if (f(b)) {
          t = b;
          i = false;
        } else {
          t = false;
          i = false;
        }
      }
    } ];
  };
  var en = {
    x: 0,
    y: 0
  };
  var nn = {
    ar: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    mr: false,
    R: {
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    },
    Er: en,
    Ar: en,
    Cr: {
      x: "hidden",
      y: "hidden"
    },
    Pr: {
      x: false,
      y: false
    },
    gr: false,
    wr: false
  };
  var tn = function createStructureSetup(r, a) {
    var e = $r(a, {});
    var n = Jr(nn);
    var t = Xr(), i = t[0], v = t[1], o = t[2];
    var u = n[0];
    var f = Ae(r), l = f[0], c = f[1], s = f[2];
    var d = qe(l, n);
    var g = function triggerUpdateEvent(r, a, e) {
      var n = E(r).some((function(a) {
        return r[a];
      }));
      if (n || !P(a) || e) {
        o("u", [ r, a, e ]);
      }
    };
    var h = an(l, n, (function(r) {
      g(d(e, r), {}, false);
    })), p = h[0], w = h[1], b = h[2], m = h[3];
    var y = u.bind(0);
    y.Fr = function(r) {
      i("u", r);
    };
    y.qr = function() {
      w();
      c();
    };
    y.Ur = l;
    return [ function(r, e) {
      var n = $r(a, r, e);
      m(n);
      g(d(n, b(), e), r, !!e);
    }, y, function() {
      v();
      p();
      s();
    } ];
  };
  var vn = Math.round;
  var un = function getClientOffset(r) {
    return {
      x: r.clientX,
      y: r.clientY
    };
  };
  var fn = function getScale(r) {
    var a = Vr(r), e = a.width, n = a.height;
    var t = Hr(r), i = t.w, v = t.h;
    return {
      x: vn(e) / i || 1,
      y: vn(n) / v || 1
    };
  };
  var ln = function continuePointerDown(r, a, e) {
    var n = a.scrollbars;
    var t = r.button, i = r.isPrimary, v = r.pointerType;
    var o = n.pointers;
    return 0 === t && i && n[e] && (o || []).includes(v);
  };
  var cn = function createRootClickStopPropagationEvents(r, a) {
    return qr(r, "mousedown", qr.bind(0, a, "click", Ur, {
      A: true,
      O: true
    }), {
      O: true
    });
  };
  var sn = function createDragScrollingEvents(r, a, e, n, t, i) {
    var v = be(), o = v.B;
    var u = e.Nr, f = e.Yr, l = e.Wr;
    var c = "scroll" + (i ? "Left" : "Top");
    var s = i ? "x" : "y";
    var d = i ? "w" : "h";
    var g = function createOnPointerMoveHandler(r, a, e) {
      return function(v) {
        var g = t(), h = g.Ar;
        var p = (un(v)[s] - a) * e;
        var w = Hr(f)[d] - Hr(u)[d];
        var b = p / w;
        var m = b * h[s];
        var y = Tr(l);
        var S = y && i ? o.n || o.i ? 1 : -1 : 1;
        n[c] = r + m * S;
      };
    };
    return qr(u, "pointerdown", (function(e) {
      if (ln(e, r, "dragScroll")) {
        var t = qr(a, "selectstart", (function(r) {
          return Nr(r);
        }), {
          C: false
        });
        var i = qr(u, "pointermove", g(n[c] || 0, un(e)[s], 1 / fn(n)[s]));
        qr(u, "pointerup", (function(r) {
          t();
          i();
          u.releasePointerCapture(r.pointerId);
        }), {
          A: true
        });
        u.setPointerCapture(e.pointerId);
      }
    }));
  };
  var dn = function createScrollbarsSetupEvents(r, a) {
    return function(e, n, t, i, v) {
      var o = e.Wr;
      return O.bind(0, [ qr(o, "pointerenter", (function() {
        n(Ta, true);
      })), qr(o, "pointerleave pointercancel", (function() {
        n(Ta);
      })), cn(o, t), sn(r, t, e, i, a, v) ]);
    };
  };
  var gn = Math.min, hn = Math.max, pn = Math.abs, _n = Math.round;
  var wn = function getScrollbarHandleLengthRatio(r, a, e, n) {
    if (n) {
      var t = e ? "x" : "y";
      var i = n.Ar, v = n.Er;
      var o = v[t];
      var u = i[t];
      return hn(0, gn(1, o / (o + u)));
    }
    var f = e ? "w" : "h";
    var l = Hr(r)[f];
    var c = Hr(a)[f];
    return hn(0, gn(1, l / c));
  };
  var bn = function getScrollbarHandleOffsetRatio(r, a, e, n, t, i) {
    var v = be(), o = v.B;
    var u = i ? "x" : "y";
    var f = i ? "Left" : "Top";
    var l = n.Ar;
    var c = _n(l[u]);
    var s = pn(e["scroll" + f]);
    var d = i && t;
    var g = o.i ? s : c - s;
    var h = d ? g : s;
    var p = gn(1, h / c);
    var w = wn(r, a, i);
    return 1 / w * (1 - w) * p;
  };
  var mn = function createScrollbarsSetupElements(r, a, e) {
    var n = be(), t = n.U;
    var i = t(), v = i.scrollbarsSlot;
    var o = a.ur, u = a.J, f = a.K, l = a.rr, s = a.cr, d = a.tr;
    var g = s ? {} : r, h = g.scrollbarsSlot;
    var p = Se([ u, f, l ], (function() {
      return f;
    }), v, h);
    var w = function scrollbarStructureAddRemoveClass(r, a, e) {
      var n = e ? pr : hr;
      each(r, (function(r) {
        n(r.Wr, a);
      }));
    };
    var b = function scrollbarsHandleStyle(r, a) {
      each(r, (function(r) {
        var e = a(r), n = e[0], t = e[1];
        style(n, t);
      }));
    };
    var m = function scrollbarStructureRefreshHandleLength(r, a, e) {
      b(r, (function(r) {
        var n;
        var t = r.Nr, i = r.Yr;
        return [ t, (n = {}, n[e ? "width" : "height"] = (100 * wn(t, i, e, a)).toFixed(5) + "%", 
        n) ];
      }));
    };
    var S = function scrollbarStructureRefreshHandleOffset(r, a, e) {
      var n = e ? "X" : "Y";
      b(r, (function(r) {
        var t = r.Nr, i = r.Yr, v = r.Wr;
        var o = bn(t, i, d, a, Tr(v), e);
        var u = o === o;
        return [ t, {
          transform: u ? "translate" + n + "(" + (100 * o).toFixed(5) + "%)" : ""
        } ];
      }));
    };
    var x = [];
    var E = [];
    var A = [];
    var P = function scrollbarsAddRemoveClass(r, a, e) {
      var n = c(e);
      var t = n ? e : true;
      var i = n ? !e : true;
      t && w(E, r, a);
      i && w(A, r, a);
    };
    var T = function refreshScrollbarsHandleLength(r) {
      m(E, r, true);
      m(A, r);
    };
    var z = function refreshScrollbarsHandleOffset(r) {
      S(E, r, true);
      S(A, r);
    };
    var L = function generateScrollbarDOM(r) {
      var a = r ? Sa : Ca;
      var n = r ? E : A;
      var t = C(n) ? Pa : "";
      var i = Z(ma + " " + a + " " + t);
      var v = Z(Oa);
      var u = Z(xa);
      var f = {
        Wr: i,
        Yr: v,
        Nr: u
      };
      Y(i, v);
      Y(v, u);
      y(n, f);
      y(x, [ X.bind(0, i), e(f, P, o, d, r) ]);
      return f;
    };
    var D = L.bind(0, true);
    var H = L.bind(0, false);
    var M = function appendElements() {
      Y(p, E[0].Wr);
      Y(p, A[0].Wr);
      lr((function() {
        P(Pa);
      }), 300);
    };
    D();
    H();
    return [ {
      Gr: T,
      Xr: z,
      Zr: P,
      $r: {
        Jr: E,
        Kr: D,
        Qr: b.bind(0, E)
      },
      ra: {
        Jr: A,
        Kr: H,
        Qr: b.bind(0, A)
      }
    }, M, O.bind(0, x) ];
  };
  var yn = function createSelfCancelTimeout(r) {
    var a;
    var e = r ? lr : fr;
    var n = r ? cr : ur;
    return [ function(t) {
      n(a);
      a = e(t, s(r) ? r() : r);
    }, function() {
      return n(a);
    } ];
  };
  var Sn = function createScrollbarsSetup(r, a, e) {
    var n;
    var t;
    var i;
    var v;
    var o;
    var u = 0;
    var f = Jr({});
    var l = f[0];
    var c = yn(), s = c[0], d = c[1];
    var g = yn(), h = g[0], p = g[1];
    var w = yn(100), b = w[0], m = w[1];
    var y = yn(100), S = y[0], C = y[1];
    var x = yn((function() {
      return u;
    })), E = x[0], A = x[1];
    var P = mn(r, e.Ur, dn(a, e)), T = P[0], z = P[1], L = P[2];
    var D = e.Ur, H = D.K, I = D.rr, V = D.tr, j = D.ir, k = D.$, B = D.Z;
    var q = T.$r, U = T.ra, N = T.Zr, Y = T.Gr, W = T.Xr;
    var G = q.Qr;
    var X = U.Qr;
    var Z = function styleScrollbarPosition(r) {
      var a = r.Wr;
      var e = k && !B && F(a) === I && a;
      return [ e, {
        transform: e ? "translate(" + M(V) + "px, " + R(V) + "px)" : ""
      } ];
    };
    var $ = function manageScrollbarsAutoHide(r, a) {
      A();
      if (r) {
        N(La);
      } else {
        var e = function hide() {
          return N(La, true);
        };
        if (u > 0 && !a) {
          E(e);
        } else {
          e();
        }
      }
    };
    var J = function onHostMouseEnter() {
      v = t;
      v && $(true);
    };
    var K = [ m, A, C, p, d, L, qr(H, "pointerover", J, {
      A: true
    }), qr(H, "pointerenter", J), qr(H, "pointerleave", (function() {
      v = false;
      t && $(false);
    })), qr(H, "pointermove", (function() {
      n && s((function() {
        m();
        $(true);
        S((function() {
          n && $(false);
        }));
      }));
    })), qr(j, "scroll", (function() {
      h((function() {
        W(e());
        i && $(true);
        b((function() {
          i && !v && $(false);
        }));
      }));
      k && G(Z);
      k && X(Z);
    })) ];
    var Q = l.bind(0);
    Q.Ur = T;
    Q.qr = z;
    return [ function(r, v, f) {
      var l = f.zr, c = f.Lr, s = f.Tr, d = f.br;
      var g = $r(a, r, v);
      var h = e();
      var p = h.Ar, w = h.Cr, b = h.wr;
      var m = g("scrollbars.theme"), y = m[0], S = m[1];
      var C = g("scrollbars.visibility"), O = C[0], x = C[1];
      var E = g("scrollbars.autoHide"), A = E[0], P = E[1];
      var T = g("scrollbars.autoHideDelay"), z = T[0];
      var L = g("scrollbars.dragScroll"), D = L[0], H = L[1];
      var M = g("scrollbars.clickScroll"), R = M[0], I = M[1];
      var V = l || c || d;
      var j = s || x;
      var k = function setScrollbarVisibility(r, a) {
        var e = "visible" === O || "auto" === O && "scroll" === r;
        N(Ea, e, a);
        return e;
      };
      u = z;
      if (S) {
        N(o);
        N(y, true);
        o = y;
      }
      if (P) {
        n = "move" === A;
        t = "leave" === A;
        i = "never" !== A;
        $(!i, true);
      }
      if (H) {
        N(Ha, D);
      }
      if (I) {
        N(Da, R);
      }
      if (j) {
        var F = k(w.x, true);
        var q = k(w.y, false);
        var U = F && q;
        N(Aa, !U);
      }
      if (V) {
        Y(h);
        W(h);
        N(za, !p.x, true);
        N(za, !p.y, false);
        N(ya, b && !B);
      }
    }, Q, O.bind(0, K) ];
  };
  var Cn = new Set;
  var On = new WeakMap;
  var xn = function addInstance(r, a) {
    On.set(r, a);
    Cn.add(r);
  };
  var En = function removeInstance(r) {
    On.delete(r);
    Cn.delete(r);
  };
  var An = function getInstance(r) {
    return On.get(r);
  };
  var Pn = function OverlayScrollbars(r, a, e) {
    var n = false;
    var t = be(), i = t.Y, v = t.q;
    var o = ja();
    var u = w(r);
    var f = u ? r : r.target;
    var l = An(f);
    if (l) {
      return l;
    }
    var c = o[Qa];
    var d = function validateOptions(r) {
      var a = r || {};
      var e = c && c.P;
      return e ? e(a, true) : a;
    };
    var g = A({}, i(), d(a));
    var h = Xr(e), p = h[0], b = h[1], m = h[2];
    var y = tn(r, g), S = y[0], C = y[1], O = y[2];
    var x = Sn(r, g, C), T = x[0], z = x[1], L = x[2];
    var D = function update(r, a) {
      S(r, !!a);
    };
    var H = v(D.bind(0, {}, true));
    var M = function destroy(r) {
      En(f);
      H();
      L();
      O();
      n = true;
      m("destroyed", [ R, !!r ]);
      b();
    };
    var R = {
      options: function options(r) {
        if (r) {
          var a = Ia(g, d(r));
          if (!P(a)) {
            A(g, a);
            D(a);
          }
        }
        return A({}, g);
      },
      on: p,
      off: function off(r, a) {
        r && a && b(r, a);
      },
      state: function state() {
        var r = C(), a = r.Er, e = r.Ar, t = r.Cr, i = r.Pr, v = r.ar, o = r.mr, u = r.wr;
        return A({}, {
          overflowEdge: a,
          overflowAmount: e,
          overflowStyle: t,
          hasOverflow: i,
          padding: v,
          paddingAbsolute: o,
          directionRTL: u,
          destroyed: n
        });
      },
      elements: function elements() {
        var r = C.Ur, a = r.J, e = r.K, n = r.ar, t = r.rr, i = r.er;
        return A({}, {
          target: a,
          host: e,
          padding: n || t,
          viewport: t,
          content: i || t
        });
      },
      update: function update(r) {
        D({}, r);
        return R;
      },
      destroy: M.bind(0)
    };
    C.Fr((function(r, a, e) {
      T(a, e, r);
    }));
    each(E(o), (function(r) {
      var a = o[r];
      if (s(a)) {
        a(OverlayScrollbars, R);
      }
    }));
    if (Ce(!u && r.cancel, C.Ur)) {
      M(true);
      return R;
    }
    C.qr();
    z.qr();
    xn(f, R);
    m("initialized", [ R ]);
    C.Fr((function(r, a, e) {
      var n = r.pr, t = r.br, i = r.hr, v = r.zr, o = r.Lr, u = r.Tr, f = r._r, l = r.Or;
      m("updated", [ R, {
        updateHints: {
          sizeChanged: n,
          directionChanged: t,
          heightIntrinsicChanged: i,
          overflowEdgeChanged: v,
          overflowAmountChanged: o,
          overflowStyleChanged: u,
          contentMutation: f,
          hostMutation: l
        },
        changedOptions: a,
        force: e
      } ]);
    }));
    return R.update(true);
  };
  Pn.plugin = ka;
  Pn.env = function() {
    var r = be(), a = r.k, e = r.D, n = r.L, t = r.B, i = r.F, v = r.H, o = r.G, u = r.X, f = r.U, l = r.N, c = r.Y, s = r.W;
    return A({}, {
      scrollbarsSize: a,
      scrollbarsOverlaid: e,
      scrollbarsHiding: n,
      rtlScrollBehavior: t,
      flexboxGlue: i,
      cssCustomProperties: v,
      staticDefaultInitialization: o,
      staticDefaultOptions: u,
      getDefaultInitialization: f,
      setDefaultInitialization: l,
      getDefaultOptions: c,
      setDefaultOptions: s
    });
  };
  r.OverlayScrollbars = Pn;
  r.scrollbarsHidingPlugin = se;
  r.sizeObserverPlugin = te;
  Object.defineProperty(r, "v", {
    value: true
  });
}));
//# sourceMappingURL=overlayscrollbars.js.map
