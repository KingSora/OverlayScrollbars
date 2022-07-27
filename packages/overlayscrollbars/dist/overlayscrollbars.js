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
        t = e ? Pr(r, i, a) : a.reduce((function(a, e) {
          a[e] = Pr(r, i, e);
          return a;
        }), t);
      }
      return t;
    }
    r && each(E(a), (function(e) {
      return Ar(r, e, a[e]);
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
  var P = function assignDeep(r, a, e, n, t, i, v) {
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
  var A = function isEmptyObject(r) {
    for (var a in r) {
      return false;
    }
    return true;
  };
  var z = function getSetProp(r, a, e, n) {
    if (v(n)) {
      return e ? e[r] : a;
    }
    e && !o(n) && false !== n && (e[r] = n);
  };
  var T = function attr(r, a, e) {
    if (v(e)) {
      return r ? r.getAttribute(a) : null;
    }
    r && r.setAttribute(a, e);
  };
  var L = function attrClass(r, a, e, n) {
    if (e) {
      var t = T(r, a) || "";
      var i = new Set(t.split(" "));
      i[n ? "add" : "delete"](e);
      T(r, a, S(i).join(" ").trim());
    }
  };
  var D = function hasAttrClass(r, a, e) {
    var n = T(r, a) || "";
    var t = new Set(n.split(" "));
    return t.has(e);
  };
  var H = function removeAttr(r, a) {
    r && r.removeAttribute(a);
  };
  var M = function scrollLeft(r, a) {
    return z("scrollLeft", 0, r, a);
  };
  var R = function scrollTop(r, a) {
    return z("scrollTop", 0, r, a);
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
      T(a, "class", r);
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
  var Pr = function getCSSVal(r, a, e) {
    return null != a ? a[e] || a.getPropertyValue(e) : r.style[e];
  };
  var Ar = function setCSSVal(r, a, e) {
    try {
      var n = r.style;
      if (!v(n[a])) {
        n[a] = Er(a, e);
      } else {
        n.setProperty(a, e);
      }
    } catch (t) {}
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
  var Tr = {
    w: 0,
    h: 0
  };
  var Lr = function windowSize() {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    };
  };
  var Dr = function offsetSize(r) {
    return r ? {
      w: r.offsetWidth,
      h: r.offsetHeight
    } : Tr;
  };
  var Hr = function clientSize(r) {
    return r ? {
      w: r.clientWidth,
      h: r.clientHeight
    } : Tr;
  };
  var Mr = function scrollSize(r) {
    return r ? {
      w: r.scrollWidth,
      h: r.scrollHeight
    } : Tr;
  };
  var Rr = function fractionalSize(r) {
    var a = parseFloat(style(r, "height")) || 0;
    var e = parseFloat(style(r, "height")) || 0;
    return {
      w: e - Math.round(e),
      h: a - Math.round(a)
    };
  };
  var Ir = function getBoundingClientRect(r) {
    return r.getBoundingClientRect();
  };
  var Vr;
  var jr = function supportPassiveEvents() {
    if (v(Vr)) {
      Vr = false;
      try {
        window.addEventListener("test", null, Object.defineProperty({}, "passive", {
          get: function get() {
            Vr = true;
          }
        }));
      } catch (r) {}
    }
    return Vr;
  };
  var kr = function splitEventNames(r) {
    return r.split(" ");
  };
  var Br = function off(r, a, e, n) {
    each(kr(a), (function(a) {
      r.removeEventListener(a, e, n);
    }));
  };
  var Fr = function on(r, a, e, n) {
    var t;
    var i = jr();
    var v = null != (t = i && n && n.C) ? t : i;
    var o = n && n.O || false;
    var u = n && n.P || false;
    var f = [];
    var l = i ? {
      passive: v,
      capture: o
    } : o;
    each(kr(a), (function(a) {
      var n = u ? function(t) {
        r.removeEventListener(a, n, o);
        e && e(t);
      } : e;
      y(f, Br.bind(null, r, a, n, o));
      r.addEventListener(a, n, l);
    }));
    return O.bind(0, f);
  };
  var qr = function stopPropagation(r) {
    return r.stopPropagation();
  };
  var Ur = function preventDefault(r) {
    return r.preventDefault();
  };
  var Nr = {
    x: 0,
    y: 0
  };
  var Yr = function absoluteCoordinates(r) {
    var a = r ? Ir(r) : 0;
    return a ? {
      x: a.left + window.pageYOffset,
      y: a.top + window.pageXOffset
    } : Nr;
  };
  var Wr = function manageListener(r, a) {
    each(d(a) ? a : [ a ], r);
  };
  var Gr = function createEventListenerHub(r) {
    var a = new Map;
    var e = function removeEvent(r, e) {
      if (r) {
        var n = a.get(r);
        Wr((function(r) {
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
      Wr((function(r) {
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
  var Xr = function getPropByPath(r, a) {
    return r ? a.split(".").reduce((function(r, a) {
      return r && x(r, a) ? r[a] : void 0;
    }), r) : void 0;
  };
  var Zr = function createOptionCheck(r, a, e) {
    return function(n) {
      return [ Xr(r, n), e || void 0 !== Xr(a, n) ];
    };
  };
  var $r = function createState(r) {
    var a = r;
    return [ function() {
      return a;
    }, function(r) {
      a = P({}, a, r);
    } ];
  };
  var Jr = "os-environment";
  var Kr = Jr + "-flexbox-glue";
  var Qr = Kr + "-max";
  var ra = "data-overlayscrollbars";
  var aa = ra + "-overflow-x";
  var ea = ra + "-overflow-y";
  var na = "overflowVisible";
  var ta = "scrollbarHidden";
  var ia = "updating";
  var va = "os-padding";
  var oa = "os-viewport";
  var ua = oa + "-arrange";
  var fa = "os-content";
  var la = oa + "-scrollbar-hidden";
  var ca = "os-overflow-visible";
  var sa = "os-size-observer";
  var da = sa + "-appear";
  var ga = sa + "-listener";
  var ha = ga + "-scroll";
  var pa = ga + "-item";
  var _a = pa + "-final";
  var wa = "os-trinsic-observer";
  var ba = "os-scrollbar";
  var ma = ba + "-horizontal";
  var ya = ba + "-vertical";
  var Sa = ba + "-track";
  var Ca = ba + "-handle";
  var Oa = ba + "-visible";
  var xa = ba + "-cornerless";
  var Ea = ba + "-transitionless";
  var Pa = ba + "-interaction";
  var Aa = ba + "-unusable";
  var za = ba + "-auto-hidden";
  var Ta = Sa + "-interactive";
  var La = Ca + "-interactive";
  var Da = function opsStringify(r) {
    return JSON.stringify(r, (function(r, a) {
      if (s(a)) {
        throw new Error;
      }
      return a;
    }));
  };
  var Ha = {
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
  var Ma = function getOptionsDiff(r, a) {
    var e = {};
    var n = E(a).concat(E(r));
    each(n, (function(n) {
      var t = r[n];
      var i = a[n];
      if (g(t) && g(i)) {
        P(e[n] = {}, getOptionsDiff(t, i));
      } else if (x(a, n) && i !== t) {
        var v = true;
        if (d(t) || d(i)) {
          try {
            if (Da(t) === Da(i)) {
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
  var Ra = {};
  var Ia = function getPlugins() {
    return P({}, Ra);
  };
  var Va = function addPlugin(r) {
    each(d(r) ? r : [ r ], (function(r) {
      each(E(r), (function(a) {
        Ra[a] = r[a];
      }));
    }));
  };
  var ja = {
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
  })(ja);
  var ka = getDefaultExportFromCjs(ja.exports);
  var Ba = {
    boolean: "__TPL_boolean_TYPE__",
    number: "__TPL_number_TYPE__",
    string: "__TPL_string_TYPE__",
    array: "__TPL_array_TYPE__",
    object: "__TPL_object_TYPE__",
    function: "__TPL_function_TYPE__",
    null: "__TPL_null_TYPE__"
  };
  var Fa = function validateRecursive(r, a, e, n) {
    var t = {};
    var i = ka({}, a);
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
          if (A(r[o])) {
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
          each(Ba, (function(e, n) {
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
            m = Ba[O] === r;
          }
          y(C, e ? Ba.string : a);
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
  var qa = function validateOptions(r, a, e) {
    return Fa(r, a, e);
  };
  var Ua;
  var Na = Ba.number;
  var Ya = Ba.boolean;
  var Wa = [ Ba.array, Ba.null ];
  var Ga = "hidden scroll visible visible-hidden";
  var Xa = "visible hidden auto";
  var Za = "never scroll leavemove";
  var $a = {
    paddingAbsolute: Ya,
    showNativeOverlaidScrollbars: Ya,
    updating: {
      elementEvents: Wa,
      attributes: Wa,
      debounce: [ Ba.number, Ba.array, Ba.null ],
      ignoreMutation: [ Ba.function, Ba.null ]
    },
    overflow: {
      x: Ga,
      y: Ga
    },
    scrollbars: {
      theme: [ Ba.string, Ba.null ],
      visibility: Xa,
      autoHide: Za,
      autoHideDelay: Na,
      dragScroll: Ya,
      clickScroll: Ya,
      pointers: [ Ba.array, Ba.null ]
    }
  };
  var Ja = "__osOptionsValidationPlugin";
  Ua = {}, Ua[Ja] = {
    A: function _(r, a) {
      var e = qa($a, r, a), n = e[0], t = e[1];
      return ka({}, t, n);
    }
  }, Ua;
  var Ka;
  var Qa = 3333333;
  var re = "scroll";
  var ae = "__osSizeObserverPlugin";
  var ee = (Ka = {}, Ka[ae] = {
    A: function _(r, a, e) {
      var n = $('<div class="' + pa + '" dir="ltr"><div class="' + pa + '"><div class="' + _a + '"></div></div><div class="' + pa + '"><div class="' + _a + '" style="width: 200%; height: 200%"></div></div></div>');
      Y(r, n);
      pr(r, ha);
      var t = n[0];
      var i = t.lastChild;
      var v = t.firstChild;
      var o = null == v ? void 0 : v.firstChild;
      var u = Dr(t);
      var f = u;
      var l = false;
      var c;
      var s = function reset() {
        M(v, Qa);
        R(v, Qa);
        M(i, Qa);
        R(i, Qa);
      };
      var d = function onResized(r) {
        c = 0;
        if (l) {
          u = f;
          a(true === r);
        }
      };
      var g = function onScroll(r) {
        f = Dr(t);
        l = !r || !wr(f, u);
        if (r) {
          qr(r);
          if (l && !c) {
            ur(c);
            c = fr(d);
          }
        } else {
          d(false === r);
        }
        s();
      };
      var h = y([], [ Fr(v, re, g), Fr(i, re, g) ]);
      style(o, {
        width: Qa,
        height: Qa
      });
      fr(s);
      return [ e ? g.bind(0, false) : s, h ];
    }
  }, Ka);
  var ne;
  var te = 0;
  var ie = Math.round, ve = Math.abs;
  var oe = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var a = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / a;
  };
  var ue = function diffBiggerThanOne(r, a) {
    var e = ve(r);
    var n = ve(a);
    return !(e === n || e + 1 === n || e - 1 === n);
  };
  var fe = "__osScrollbarsHidingPlugin";
  var le = (ne = {}, ne[fe] = {
    T: function _createUniqueViewportArrangeElement(r) {
      var a = r.L, e = r.D, n = r.H;
      var t = !n && !a && (e.x || e.y);
      var i = t ? document.createElement("style") : false;
      if (i) {
        T(i, "id", ua + "-" + te);
        te++;
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
                  C.insertRule("#" + T(n, "id") + " + ." + ua + "::before {}", 0);
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
          hr(e, ua);
          if (!a) {
            h.height = "";
          }
          style(e, h);
          return [ function() {
            v(f, o, r, w);
            style(e, w);
            pr(e, ua);
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
        var i = Lr();
        var v = {
          w: i.w - r.w,
          h: i.h - r.h
        };
        if (0 === v.w && 0 === v.h) {
          return;
        }
        var o = {
          w: ve(v.w),
          h: ve(v.h)
        };
        var u = {
          w: ve(ie(i.w / (r.w / 100))),
          h: ve(ie(i.h / (r.h / 100)))
        };
        var f = oe();
        var l = o.w > 2 && o.h > 2;
        var c = !ue(u.w, u.h);
        var s = f !== a && f > 0;
        var d = l && c && s;
        if (d) {
          var g = n(), h = g[0], p = g[1];
          P(e.k, h);
          if (p) {
            t();
          }
        }
        r = i;
        a = f;
      };
    }
  }, ne);
  var ce;
  var se = function getNativeScrollbarSize(r, a, e, n) {
    Y(r, a);
    var t = Hr(a);
    var i = Dr(a);
    var v = Rr(e);
    n && X(a);
    return {
      x: i.h - t.h + v.h,
      y: i.w - t.w + v.w
    };
  };
  var de = function getNativeScrollbarsHiding(r) {
    var a = false;
    var e = pr(r, la);
    try {
      a = "none" === style(r, nr("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (n) {}
    e();
    return a;
  };
  var ge = function getRtlScrollBehavior(r, a) {
    var e = "hidden";
    style(r, {
      overflowX: e,
      overflowY: e,
      direction: "rtl"
    });
    M(r, 0);
    var n = Yr(r);
    var t = Yr(a);
    M(r, -999);
    var i = Yr(a);
    return {
      i: n.x === t.x,
      n: t.x !== i.x
    };
  };
  var he = function getFlexboxGlue(r, a) {
    var e = pr(r, Kr);
    var n = Ir(r);
    var t = Ir(a);
    var i = yr(t, n, true);
    var v = pr(r, Qr);
    var o = Ir(r);
    var u = Ir(a);
    var f = yr(u, o, true);
    e();
    v();
    return i && f;
  };
  var pe = function createEnvironment() {
    var r = document, e = r.body;
    var n = $('<div class="' + Jr + '"><div></div></div>');
    var t = n[0];
    var i = t.firstChild;
    var v = Gr(), o = v[0], u = v[2];
    var f = a({
      o: se(e, t, i),
      u: br
    }, se.bind(0, e, t, i, true)), l = f[0], c = f[1];
    var s = c(), d = s[0];
    var g = de(t);
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
    var w = P({}, Ha);
    var b = {
      k: d,
      D: h,
      L: g,
      H: "-1" === style(t, "zIndex"),
      B: ge(t, i),
      F: he(t, i),
      q: function _addListener(r) {
        return o("_", r);
      },
      U: P.bind(0, {}, p),
      N: function _setDefaultInitialization(r) {
        P(p, r);
      },
      Y: P.bind(0, {}, w),
      W: function _setDefaultOptions(r) {
        P(w, r);
      },
      G: P({}, p),
      X: P({}, w)
    };
    H(t, "style");
    X(t);
    if (!g && (!h.x || !h.y)) {
      var m;
      window.addEventListener("resize", (function() {
        var r = Ia()[fe];
        m = m || r && r.j();
        m && m(b, l, u.bind(0, "_"));
      }));
    }
    return b;
  };
  var _e = function getEnvironment() {
    if (!ce) {
      ce = pe();
    }
    return ce;
  };
  var we = function resolveInitialization(r, a) {
    return s(r) ? r.apply(0, a) : r;
  };
  var be = function staticInitializationElement(r, a, e, n) {
    var t = v(n) ? e : n;
    var i = we(t, r);
    return i || a();
  };
  var me = function dynamicInitializationElement(r, a, e, n) {
    var t = v(n) ? e : n;
    var i = we(t, r);
    return !!i && (w(i) ? i : a());
  };
  var ye = function cancelInitialization(r, a) {
    var e = r || {}, n = e.nativeScrollbarsOverlaid, t = e.body;
    var i = a.Z, u = a.$;
    var f = _e(), l = f.U, c = f.D;
    var s = l().cancel, d = s.nativeScrollbarsOverlaid, g = s.body;
    var h = null != n ? n : d;
    var p = v(t) ? g : t;
    var w = (c.x || c.y) && h;
    var b = i && (o(p) ? !u : p);
    return !!w || !!b;
  };
  var Se = Z.bind(0, "");
  var Ce = function unwrap(r) {
    Y(F(r), B(r));
    X(r);
  };
  var Oe = function addDataAttrHost(r, a) {
    T(r, ra, a);
    return H.bind(0, r, ra);
  };
  var xe = function createStructureSetupElements(r) {
    var a = _e();
    var e = a.U, n = a.L;
    var t = Ia()[fe];
    var i = t && t.T;
    var v = e(), o = v.host, u = v.viewport, f = v.padding, l = v.content;
    var c = w(r);
    var s = c ? {} : r;
    var d = s.host, g = s.padding, h = s.viewport, p = s.content;
    var b = c ? r : s.target;
    var S = k(b, "textarea");
    var C = b.ownerDocument;
    var x = b === C.body;
    var P = C.defaultView;
    var A = be.bind(0, [ b ]);
    var z = me.bind(0, [ b ]);
    var T = A(Se, u, h);
    var M = T === b;
    var R = {
      J: b,
      K: S ? A(Se, o, d) : b,
      rr: T,
      ar: !M && z(Se, f, g),
      er: !M && z(Se, l, p),
      nr: !M && !n && i && i(a),
      tr: x ? C.documentElement : T,
      ir: x ? C : T,
      vr: P,
      ur: C,
      lr: S,
      Z: x,
      cr: c,
      $: M,
      sr: function _viewportHasClass(r, a) {
        return M ? D(T, ra, a) : gr(T, r);
      },
      dr: function _viewportAddRemoveClass(r, a, e) {
        return M ? L(T, ra, a, e) : (e ? pr : hr)(T, r);
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
      var r = Oe(q, M ? "viewport" : "host");
      var a = pr(U, va);
      var e = pr(N, !M && oa);
      var t = pr(Z, fa);
      var i = x ? pr(F(b), la) : Sr;
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
        H(N, aa);
        H(N, ea);
        if (V(Z)) {
          Ce(Z);
        }
        if (V(N)) {
          Ce(N);
        }
        if (V(U)) {
          Ce(U);
        }
        a();
        e();
        t();
      }));
      if (n && !M) {
        y(J, hr.bind(0, N, la));
      }
      if ($) {
        W(N, $);
        y(J, X.bind(0, $));
      }
    };
    return [ R, ar, O.bind(0, J) ];
  };
  var Ee = function createTrinsicUpdateSegment(r, a) {
    var e = r.er;
    var n = a[0];
    return function(r) {
      var a = _e(), t = a.F;
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
  var Pe = function createPaddingUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.K, v = r.ar, o = r.rr, u = r.$;
    var f = a({
      u: mr,
      o: zr()
    }, zr.bind(0, i, "padding", "")), l = f[0], c = f[1];
    return function(r, a, e) {
      var i = c(e), f = i[0], s = i[1];
      var d = _e(), g = d.L, h = d.F;
      var p = n(), w = p.wr;
      var b = r.pr, m = r._r, y = r.br;
      var S = a("paddingAbsolute"), C = S[0], O = S[1];
      var x = !h && m;
      if (b || s || x) {
        var E = l(e);
        f = E[0];
        s = E[1];
      }
      var A = !u && (O || y || s);
      if (A) {
        var z = !C || !v && !g;
        var T = f.r + f.l;
        var L = f.t + f.b;
        var D = {
          marginRight: z && !w ? -T : 0,
          marginBottom: z ? -L : 0,
          marginLeft: z && w ? -T : 0,
          top: z ? -f.t : 0,
          right: z ? w ? -f.r : "auto" : 0,
          left: z ? w ? "auto" : -f.l : 0,
          width: z ? "calc(100% + " + T + "px)" : ""
        };
        var H = {
          paddingTop: z ? f.t : 0,
          paddingRight: z ? f.r : 0,
          paddingBottom: z ? f.b : 0,
          paddingLeft: z ? f.l : 0
        };
        style(v || o, D);
        style(o, H);
        t({
          ar: f,
          mr: !z,
          R: v ? H : P({}, D, H)
        });
      }
      return {
        yr: A
      };
    };
  };
  var Ae = Math.max;
  var ze = Ae.bind(0, 0);
  var Te = "visible";
  var Le = "hidden";
  var De = 42;
  var He = {
    u: wr,
    o: {
      w: 0,
      h: 0
    }
  };
  var Me = {
    u: br,
    o: {
      x: Le,
      y: Le
    }
  };
  var Re = function getOverflowAmount(r, a) {
    var e = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
    var n = {
      w: ze(r.w - a.w),
      h: ze(r.h - a.h)
    };
    return {
      w: n.w > e ? n.w : 0,
      h: n.h > e ? n.h : 0
    };
  };
  var Ie = function conditionalClass(r, a, e) {
    return e ? pr(r, a) : hr(r, a);
  };
  var Ve = function overflowIsVisible(r) {
    return 0 === r.indexOf(Te);
  };
  var je = function createOverflowUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.K, v = r.ar, o = r.rr, u = r.nr, f = r.$, l = r.dr;
    var c = _e(), s = c.k, d = c.F, g = c.L, h = c.D;
    var p = Ia()[fe];
    var w = !f && !g && (h.x || h.y);
    var b = a(He, Rr.bind(0, o)), m = b[0], y = b[1];
    var S = a(He, Mr.bind(0, o)), C = S[0], O = S[1];
    var x = a(He), E = x[0], P = x[1];
    var A = a(He), z = A[0], D = A[1];
    var H = a(Me), M = H[0];
    var R = function fixFlexboxGlue(r, a) {
      style(o, {
        height: ""
      });
      if (a) {
        var e = n(), t = e.mr, v = e.ar;
        var u = r.Sr, f = r.I;
        var l = Rr(i);
        var c = Hr(i);
        var s = "content-box" === style(o, "boxSizing");
        var d = t || s ? v.b + v.t : 0;
        var g = !(h.x && s);
        style(o, {
          height: c.h + l.h + (u.x && g ? f.x : 0) - d
        });
      }
    };
    var I = function getViewportOverflowState(r, a) {
      var e = !g && !r ? De : 0;
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
        var e = Ve(r);
        var n = a && e && r.replace(Te + "-", "") || "";
        return [ a && !e ? r : "", Ve(n) ? "hidden" : n ];
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
      var S = n(), x = S.gr, A = S.wr;
      var H = a("showNativeOverlaidScrollbars"), k = H[0], q = H[1];
      var U = a("overflow"), N = U[0], Y = U[1];
      var W = k && h.x && h.y;
      var G = !f && !d && (u || s || c || q || w);
      var X = Ve(N.x);
      var Z = Ve(N.y);
      var $ = X || Z;
      var J = y(e);
      var K = O(e);
      var Q = P(e);
      var rr = D(e);
      var ar;
      if (q && g) {
        l(la, ta, !W);
      }
      if (G) {
        ar = I(W);
        R(ar, x);
      }
      if (u || p || s || b || q) {
        if ($) {
          l(ca, na, false);
        }
        var er = F(W, A, ar), nr = er[0], tr = er[1];
        var ir = J = m(e), vr = ir[0], or = ir[1];
        var ur = K = C(e), fr = ur[0], lr = ur[1];
        var cr = Hr(o);
        var sr = fr;
        var dr = cr;
        nr();
        if ((lr || or || q) && tr && !W && B(tr, fr, vr, A)) {
          dr = Hr(o);
          sr = Mr(o);
        }
        var gr = {
          w: ze(Ae(fr.w, sr.w) + vr.w),
          h: ze(Ae(fr.h, sr.h) + vr.h)
        };
        var hr = {
          w: ze(dr.w + ze(cr.w - fr.w) + vr.w),
          h: ze(dr.h + ze(cr.h - fr.h) + vr.h)
        };
        rr = z(hr);
        Q = E(Re(gr, hr), e);
      }
      var pr = rr, _r = pr[0], wr = pr[1];
      var br = Q, mr = br[0], yr = br[1];
      var Sr = K, Cr = Sr[0], Or = Sr[1];
      var xr = J, Er = xr[0], Pr = xr[1];
      var Ar = {
        x: mr.w > 0,
        y: mr.h > 0
      };
      var zr = X && Z && (Ar.x || Ar.y) || X && Ar.x && !Ar.y || Z && Ar.y && !Ar.x;
      if (p || b || Pr || Or || wr || yr || Y || q || G) {
        var Tr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Lr = V(W, Ar, N, Tr);
        var Dr = B(Lr, Cr, Er, A);
        if (!f) {
          j(Lr, A, Dr, Tr);
        }
        if (G) {
          R(Lr, x);
        }
        if (f) {
          T(i, aa, Tr.overflowX);
          T(i, ea, Tr.overflowY);
        } else {
          style(o, Tr);
        }
      }
      L(i, ra, na, zr);
      Ie(v, ca, zr);
      !f && Ie(o, ca, $);
      var Rr = M(I(W).Cr), Ir = Rr[0], Vr = Rr[1];
      t({
        Cr: Ir,
        Er: {
          x: _r.w,
          y: _r.h
        },
        Pr: {
          x: mr.w,
          y: mr.h
        },
        Ar: Ar
      });
      return {
        zr: Vr,
        Tr: wr,
        Lr: yr
      };
    };
  };
  var ke = function prepareUpdateHints(r, a, e) {
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
  var Be = function createStructureSetupUpdate(r, a) {
    var e = r.rr, n = r.dr;
    var t = _e(), i = t.L, v = t.D, o = t.F;
    var u = !i && (v.x || v.y);
    var f = [ Ee(r, a), Pe(r, a), je(r, a) ];
    return function(r, a, t) {
      var i = ke(P({
        pr: false,
        yr: false,
        br: false,
        hr: false,
        Tr: false,
        Lr: false,
        zr: false,
        Or: false,
        _r: false
      }, a), {}, t);
      var v = u || !o;
      var l = v && M(e);
      var c = v && R(e);
      n("", ia, true);
      var s = i;
      each(f, (function(a) {
        s = ke(s, a(s, r, !!t) || {}, t);
      }));
      M(e, l);
      R(e, c);
      n("", ia);
      return s;
    };
  };
  var Fe = 3333333;
  var qe = function getElmDirectionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var Ue = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var Ne = function createSizeObserver(r, e, n) {
    var t = n || {}, i = t.Dr, v = void 0 === i ? false : i, o = t.Hr, u = void 0 === o ? false : o;
    var f = Ia()[ae];
    var l = _e(), s = l.B;
    var h = $('<div class="' + sa + '"><div class="' + ga + '"></div></div>');
    var p = h[0];
    var w = p.firstChild;
    var b = qe.bind(0, p);
    var m = a({
      o: void 0,
      g: true,
      u: function _equal(r, a) {
        return !(!r || !Ue(r) && Ue(a));
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
        var h = Ue(f);
        var w = Ue(l);
        t = !l || !h;
        i = !w && h;
        o = !t;
      } else if (n) {
        o = r[1];
      } else {
        i = true === r;
      }
      if (v && o) {
        var b = n ? r[0] : qe(p);
        M(p, b ? s.n ? -Fe : s.i ? 0 : Fe : Fe);
        R(p, Fe);
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
    var P;
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
        var n = f.A(w, C, u), t = n[0], i = n[1];
        E = t;
        y(x, i);
      }
      if (v) {
        P = a({
          o: !b()
        }, b);
        var o = P, l = o[0];
        y(x, Fr(p, "scroll", (function(r) {
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
          qr(r);
        })));
      }
      if (E) {
        pr(p, da);
        y(x, Fr(p, "animationstart", E, {
          P: !!or
        }));
      }
      Y(r, p);
    } ];
  };
  var Ye = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var We = function createTrinsicObserver(r, e) {
    var n;
    var t = Z(wa);
    var i = [];
    var v = a({
      o: false
    }), o = v[0];
    var u = function triggerOnTrinsicChangedCallback(r, a) {
      if (r) {
        var n = o(Ye(r));
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
          var r = Dr(t);
          u(r);
        };
        var e = Ne(t, a), v = e[0], o = e[1];
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
  var Ge = function createEventContentChange(r, a, e) {
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
            var f = Fr(e, i, (function(r) {
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
  var Xe = function createDOMObserver(r, a, e, n) {
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
    var g = Ge(r, d, u), h = g[0], p = g[1];
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
        var x = S && l(t) ? T(i, t) : 0;
        var E = 0 !== x && s !== x;
        var P = m(b, t) > -1 && E;
        if (a && !O) {
          var A = !S;
          var z = S && P;
          var L = z && f && k(i, f);
          var D = L ? !v(i, t, s, x) : A || z;
          var H = D && !o(e, !!L, r, n);
          y(d, p);
          h = h || H;
          w = w || C;
        }
        if (!a && O && E && !v(i, t, s, x)) {
          y(u, t);
          g = g || P;
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
  var Ze = "[" + ra + "]";
  var $e = "." + oa;
  var Je = [ "tabindex" ];
  var Ke = [ "wrap", "cols", "rows" ];
  var Qe = [ "id", "class", "style", "open" ];
  var rn = function createStructureSetupObservers(r, e, n) {
    var t;
    var i;
    var v;
    var o = e[1];
    var u = r.K, c = r.rr, g = r.er, h = r.lr, p = r.$, w = r.sr, b = r.dr;
    var S = _e(), C = S.F;
    var O = a({
      u: wr,
      o: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = w(ca, na);
      var a = w(ua, "");
      var e = a && M(c);
      var n = a && R(c);
      b(ca, na);
      b(ua, "");
      b("", ia, true);
      var t = Mr(g);
      var i = Mr(c);
      var v = Rr(c);
      b(ca, na, r);
      b(ua, "", a);
      b("", ia);
      M(c, e);
      R(c, n);
      return {
        w: i.w + t.w + v.w,
        h: i.h + t.h + v.h
      };
    })), x = O[0];
    var A = h ? Ke : Qe.concat(Ke);
    var z = Cr(n, {
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
      each(r || Je, (function(r) {
        if (m(Je, r) > -1) {
          var a = T(u, r);
          if (l(a)) {
            T(c, r, a);
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
      var i = !a || t ? n : z;
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
      var v = r ? n : z;
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
        !e && z(n);
      } else if (!p) {
        L(r);
      }
      return n;
    };
    var k = g || !C ? We(u, D) : [ Sr, Sr, Sr ], B = k[0], F = k[1], N = k[2];
    var Y = !p ? Ne(u, I, {
      Hr: true,
      Dr: true
    }) : [ Sr, Sr ], W = Y[0], G = Y[1];
    var X = Xe(u, false, j, {
      Ir: Qe,
      Rr: Qe.concat(Je)
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
        P(r, j.apply(0, y(a, true)));
      }
      if (e) {
        P(r, D.apply(0, y(e, true)));
      }
      if (n) {
        P(r, V.apply(0, y(n, true)));
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
        v = Xe(g || c, true, V, {
          Ir: A.concat(o || []),
          Rr: A.concat(o || []),
          Vr: h,
          jr: Ze,
          Br: function _ignoreContentChange(r, a) {
            var e = r.target, n = r.attributeName;
            var t = !a && n ? U(e, Ze, $e) : false;
            return t || !!q(e, "." + ba) || !!S(r);
          }
        });
      }
      if (m) {
        z.S();
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
  var an = {
    x: 0,
    y: 0
  };
  var en = {
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
    Er: an,
    Pr: an,
    Cr: {
      x: "hidden",
      y: "hidden"
    },
    Ar: {
      x: false,
      y: false
    },
    gr: false,
    wr: false
  };
  var nn = function createStructureSetup(r, a) {
    var e = Zr(a, {});
    var n = $r(en);
    var t = Gr(), i = t[0], v = t[1], o = t[2];
    var u = n[0];
    var f = xe(r), l = f[0], c = f[1], s = f[2];
    var d = Be(l, n);
    var g = function triggerUpdateEvent(r, a, e) {
      var n = E(r).some((function(a) {
        return r[a];
      }));
      if (n || !A(a) || e) {
        o("u", [ r, a, e ]);
      }
    };
    var h = rn(l, n, (function(r) {
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
      var n = Zr(a, r, e);
      m(n);
      g(d(n, b(), e), r, !!e);
    }, y, function() {
      v();
      p();
      s();
    } ];
  };
  var tn = Math.round, vn = Math.abs;
  var un = function getPageOffset(r) {
    return {
      x: r.pageX,
      y: r.pageY
    };
  };
  var fn = function getScale(r) {
    var a = Ir(r), e = a.width, n = a.height;
    var t = Dr(r), i = t.w, v = t.h;
    return {
      x: tn(e) / i || 1,
      y: tn(n) / v || 1
    };
  };
  var ln = function continuePointerDown(r, a, e) {
    var n = a.scrollbars;
    var t = r.button, i = r.isPrimary, v = r.pointerType;
    var o = n.pointers;
    return 0 === t && i && n[e] && (o || []).includes(v);
  };
  var cn = function createRootClickStopPropagationEvents(r, a) {
    return Fr(r, "mousedown", Fr.bind(0, a, "click", qr, {
      P: true,
      O: true
    }), {
      O: true
    });
  };
  var sn = function createDragScrollingEvents(r, a, e, n, t, i) {
    var v = _e(), o = v.B;
    var u = e.Nr, f = e.Yr, l = e.Wr;
    var c = "scroll" + (i ? "Left" : "Top");
    var s = i ? "x" : "y";
    var d = i ? "w" : "h";
    var g = function createOnPointerMoveHandler(r, a, e) {
      return function(v) {
        var g = t(), h = g.Pr;
        var p = (un(v)[s] - a) * e;
        var w = Dr(f)[d] - Dr(u)[d];
        var b = p / w;
        var m = b * h[s];
        var y = "rtl" === style(l, "direction");
        var S = y && i ? o.n || o.i ? 1 : -1 : 1;
        n[c] = vn(r) + m * S;
      };
    };
    return Fr(u, "pointerdown", (function(e) {
      if (ln(e, r, "dragScroll")) {
        var t = Fr(a, "selectstart", (function(r) {
          return Ur(r);
        }), {
          C: false
        });
        var i = Fr(u, "pointermove", g(n[c] || 0, un(e)[s], 1 / fn(n)[s]));
        Fr(u, "pointerup", (function(r) {
          t();
          i();
          u.releasePointerCapture(r.pointerId);
        }), {
          P: true
        });
        u.setPointerCapture(e.pointerId);
      }
    }));
  };
  var dn = function createScrollbarsSetupEvents(r, a) {
    return function(e, n, t, i, v) {
      var o = e.Wr;
      return O.bind(0, [ Fr(o, "pointerenter", (function() {
        n(Pa, true);
      })), Fr(o, "pointerleave pointercancel", (function() {
        n(Pa);
      })), cn(o, t), sn(r, t, e, i, a, v) ]);
    };
  };
  var gn = Math.min, hn = Math.max, pn = Math.abs;
  var _n = function getScrollbarHandleLengthRatio(r, a, e, n) {
    if (n) {
      var t = e ? "x" : "y";
      var i = n.Pr, v = n.Er;
      var o = v[t];
      var u = i[t];
      return hn(0, gn(1, o / (o + u)));
    }
    var f = e ? "w" : "h";
    var l = Dr(r)[f];
    var c = Dr(a)[f];
    return hn(0, gn(1, l / c));
  };
  var wn = function getScrollbarHandleOffsetRatio(r, a, e, n, t, i) {
    var v = _e(), o = v.B;
    var u = i ? "x" : "y";
    var f = i ? "Left" : "Top";
    var l = n.Pr;
    var c = Math.floor(l[u]);
    var s = pn(e["scroll" + f]);
    var d = i && t;
    var g = o.i ? s : c - s;
    var h = d ? g : s;
    var p = gn(1, h / c);
    var w = _n(r, a, i);
    return 1 / w * (1 - w) * p;
  };
  var bn = function createScrollbarsSetupElements(r, a, e) {
    var n = _e(), t = n.U;
    var i = t(), v = i.scrollbarsSlot;
    var o = a.ur, u = a.J, f = a.K, l = a.rr, s = a.cr, d = a.tr;
    var g = s ? {} : r, h = g.scrollbarsSlot;
    var p = me([ u, f, l ], (function() {
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
        return [ t, (n = {}, n[e ? "width" : "height"] = (100 * _n(t, i, e, a)).toFixed(3) + "%", 
        n) ];
      }));
    };
    var S = function scrollbarStructureRefreshHandleOffset(r, a, e) {
      var n = e ? "X" : "Y";
      b(r, (function(r) {
        var t = r.Nr, i = r.Yr, v = r.Wr;
        var o = wn(t, i, d, a, "rtl" === style(v, "direction"), e);
        var u = o === o;
        return [ t, {
          transform: u ? "translate" + n + "(" + (100 * o).toFixed(3) + "%)" : ""
        } ];
      }));
    };
    var x = [];
    var E = [];
    var P = [];
    var A = function scrollbarsAddRemoveClass(r, a, e) {
      var n = c(e);
      var t = n ? e : true;
      var i = n ? !e : true;
      t && w(E, r, a);
      i && w(P, r, a);
    };
    var z = function refreshScrollbarsHandleLength(r) {
      m(E, r, true);
      m(P, r);
    };
    var T = function refreshScrollbarsHandleOffset(r) {
      S(E, r, true);
      S(P, r);
    };
    var L = function generateScrollbarDOM(r) {
      var a = r ? ma : ya;
      var n = r ? E : P;
      var t = C(n) ? Ea : "";
      var i = Z(ba + " " + a + " " + t);
      var v = Z(Sa);
      var u = Z(Ca);
      var f = {
        Wr: i,
        Yr: v,
        Nr: u
      };
      Y(i, v);
      Y(v, u);
      y(n, f);
      y(x, [ X.bind(0, i), e(f, A, o, d, r) ]);
      return f;
    };
    var D = L.bind(0, true);
    var H = L.bind(0, false);
    var M = function appendElements() {
      Y(p, E[0].Wr);
      Y(p, P[0].Wr);
      lr((function() {
        A(Ea);
      }), 300);
    };
    D();
    H();
    return [ {
      Gr: z,
      Xr: T,
      Zr: A,
      $r: {
        Jr: E,
        Kr: D,
        Qr: b.bind(0, E)
      },
      ra: {
        Jr: P,
        Kr: H,
        Qr: b.bind(0, P)
      }
    }, M, O.bind(0, x) ];
  };
  var mn = function createSelfCancelTimeout(r) {
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
  var yn = function createScrollbarsSetup(r, a, e) {
    var n;
    var t;
    var i;
    var v;
    var o;
    var u = 0;
    var f = $r({});
    var l = f[0];
    var c = mn(), s = c[0], d = c[1];
    var g = mn(), h = g[0], p = g[1];
    var w = mn(100), b = w[0], m = w[1];
    var y = mn(100), S = y[0], C = y[1];
    var x = mn((function() {
      return u;
    })), E = x[0], P = x[1];
    var A = bn(r, e.Ur, dn(a, e)), z = A[0], T = A[1], L = A[2];
    var D = e.Ur, H = D.K, I = D.rr, V = D.tr, j = D.ir, k = D.$, B = D.Z;
    var q = z.$r, U = z.ra, N = z.Zr, Y = z.Gr, W = z.Xr;
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
      P();
      if (r) {
        N(za);
      } else {
        var e = function hide() {
          return N(za, true);
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
    var K = [ m, P, C, p, d, L, Fr(H, "mouseover", J, {
      P: true
    }), Fr(H, "mouseenter", J), Fr(H, "mouseleave", (function() {
      v = false;
      t && $(false);
    })), Fr(H, "mousemove", (function() {
      n && s((function() {
        m();
        $(true);
        S((function() {
          n && $(false);
        }));
      }));
    })), Fr(j, "scroll", (function() {
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
    Q.Ur = z;
    Q.qr = T;
    return [ function(r, v, f) {
      var l = f.Tr, c = f.Lr, s = f.zr, d = f.br;
      var g = Zr(a, r, v);
      var h = e();
      var p = h.Pr, w = h.Cr;
      var b = g("scrollbars.theme"), m = b[0], y = b[1];
      var S = g("scrollbars.visibility"), C = S[0], O = S[1];
      var x = g("scrollbars.autoHide"), E = x[0], P = x[1];
      var A = g("scrollbars.autoHideDelay"), z = A[0];
      var T = g("scrollbars.dragScroll"), L = T[0], D = T[1];
      var H = g("scrollbars.clickScroll"), M = H[0], R = H[1];
      var I = l || c || d;
      var V = s || O;
      var j = function setScrollbarVisibility(r, a) {
        var e = "visible" === C || "auto" === C && "scroll" === r;
        N(Oa, e, a);
        return e;
      };
      u = z;
      if (y) {
        N(o);
        N(m, true);
        o = m;
      }
      if (P) {
        n = "move" === E;
        t = "leave" === E;
        i = "never" !== E;
        $(!i, true);
      }
      if (D) {
        N(La, L);
      }
      if (R) {
        N(Ta, M);
      }
      if (V) {
        var k = j(w.x, true);
        var B = j(w.y, false);
        var F = k && B;
        N(xa, !F);
      }
      if (I) {
        Y(h);
        W(h);
        N(Aa, !p.x, true);
        N(Aa, !p.y, false);
      }
    }, Q, O.bind(0, K) ];
  };
  var Sn = new Set;
  var Cn = new WeakMap;
  var On = function addInstance(r, a) {
    Cn.set(r, a);
    Sn.add(r);
  };
  var xn = function removeInstance(r) {
    Cn.delete(r);
    Sn.delete(r);
  };
  var En = function getInstance(r) {
    return Cn.get(r);
  };
  var Pn = function OverlayScrollbars(r, a, e) {
    var n = false;
    var t = _e(), i = t.Y, v = t.q;
    var o = Ia();
    var u = w(r);
    var f = u ? r : r.target;
    var l = En(f);
    if (l) {
      return l;
    }
    var c = o[Ja];
    var d = function validateOptions(r) {
      var a = r || {};
      var e = c && c.A;
      return e ? e(a, true) : a;
    };
    var g = P({}, i(), d(a));
    var h = Gr(e), p = h[0], b = h[1], m = h[2];
    var y = nn(r, g), S = y[0], C = y[1], O = y[2];
    var x = yn(r, g, C), z = x[0], T = x[1], L = x[2];
    var D = function update(r, a) {
      S(r, !!a);
    };
    var H = v(D.bind(0, {}, true));
    var M = function destroy(r) {
      xn(f);
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
          var a = Ma(g, d(r));
          if (!A(a)) {
            P(g, a);
            D(a);
          }
        }
        return P({}, g);
      },
      on: p,
      off: function off(r, a) {
        r && a && b(r, a);
      },
      state: function state() {
        var r = C(), a = r.Er, e = r.Pr, t = r.Cr, i = r.Ar, v = r.ar, o = r.mr;
        return P({}, {
          overflowEdge: a,
          overflowAmount: e,
          overflowStyle: t,
          hasOverflow: i,
          padding: v,
          paddingAbsolute: o,
          destroyed: n
        });
      },
      elements: function elements() {
        var r = C.Ur, a = r.J, e = r.K, n = r.ar, t = r.rr, i = r.er;
        return P({}, {
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
      z(a, e, r);
    }));
    each(E(o), (function(r) {
      var a = o[r];
      if (s(a)) {
        a(OverlayScrollbars, R);
      }
    }));
    if (ye(!u && r.cancel, C.Ur)) {
      M(true);
      return R;
    }
    C.qr();
    T.qr();
    On(f, R);
    m("initialized", [ R ]);
    C.Fr((function(r, a, e) {
      var n = r.pr, t = r.br, i = r.hr, v = r.Tr, o = r.Lr, u = r.zr, f = r._r, l = r.Or;
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
  Pn.plugin = Va;
  Pn.env = function() {
    var r = _e(), a = r.k, e = r.D, n = r.L, t = r.B, i = r.F, v = r.H, o = r.G, u = r.X, f = r.U, l = r.N, c = r.Y, s = r.W;
    return P({}, {
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
  r.scrollbarsHidingPlugin = le;
  r.sizeObserverPlugin = ee;
  Object.defineProperty(r, "v", {
    value: true
  });
}));
//# sourceMappingURL=overlayscrollbars.js.map
