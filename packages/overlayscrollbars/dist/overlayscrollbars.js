(function(r, a) {
  "object" === typeof exports && "undefined" !== typeof module ? a(exports) : "function" === typeof define && define.amd ? define([ "exports" ], a) : (r = "undefined" !== typeof globalThis ? globalThis : r || self, 
  a(r.OverlayScrollbars = {}));
})(this, (function(r) {
  "use strict";
  function each(r, a) {
    if (h(r)) {
      for (var n = 0; n < r.length; n++) {
        if (false === a(r[n], n, r)) {
          break;
        }
      }
    } else if (r) {
      each(Object.keys(r), (function(n) {
        return a(r[n], n, r);
      }));
    }
    return r;
  }
  function style(r, a) {
    var n = l(a);
    var t = d(a) || n;
    if (t) {
      var e = n ? "" : {};
      if (r) {
        var i = window.getComputedStyle(r, null);
        e = n ? zr(r, i, a) : a.reduce((function(a, n) {
          a[n] = zr(r, i, n);
          return a;
        }), e);
      }
      return e;
    }
    each(E(a), (function(n) {
      return Ar(r, n, a[n]);
    }));
  }
  function getDefaultExportFromCjs(r) {
    return r && r.v && Object.prototype.hasOwnProperty.call(r, "default") ? r["default"] : r;
  }
  var a = function createCache(r, a) {
    var n = r.o, t = r.u, e = r.g;
    var i = n;
    var v;
    var o = function cacheUpdateContextual(r, a) {
      var n = i;
      var o = r;
      var u = a || (t ? !t(n, o) : n !== o);
      if (u || e) {
        i = o;
        v = n;
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
  var n = Node.ELEMENT_NODE;
  var t = Object.prototype, e = t.toString, i = t.hasOwnProperty;
  var v = function isUndefined(r) {
    return void 0 === r;
  };
  var o = function isNull(r) {
    return null === r;
  };
  var u = function type(r) {
    return v(r) || o(r) ? "" + r : e.call(r).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
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
    var n = f(a) && a > -1 && a % 1 == 0;
    return d(r) || !s(r) && n ? a > 0 && g(r) ? a - 1 in r : true : false;
  };
  var p = function isPlainObject(r) {
    if (!r || !g(r) || "object" !== u(r)) {
      return false;
    }
    var a;
    var n = "constructor";
    var t = r[n];
    var e = t && t.prototype;
    var o = i.call(r, n);
    var f = e && i.call(e, "isPrototypeOf");
    if (t && !o && !f) {
      return false;
    }
    for (a in r) {}
    return v(a) || i.call(r, a);
  };
  var w = function isHTMLElement(r) {
    var a = window.HTMLElement;
    return r ? a ? r instanceof a : r.nodeType === n : false;
  };
  var b = function isElement(r) {
    var a = window.Element;
    return r ? a ? r instanceof a : r.nodeType === n : false;
  };
  var m = function indexOf(r, a, n) {
    return r.indexOf(a, n);
  };
  var y = function push(r, a, n) {
    !n && !l(a) && h(a) ? Array.prototype.push.apply(r, a) : r.push(a);
    return r;
  };
  var S = function from(r) {
    var a = Array.from;
    var n = [];
    if (a && r) {
      return a(r);
    }
    if (r instanceof Set) {
      r.forEach((function(r) {
        y(n, r);
      }));
    } else {
      each(r, (function(r) {
        y(n, r);
      }));
    }
    return n;
  };
  var C = function isEmptyArray(r) {
    return !!r && 0 === r.length;
  };
  var O = function runEachAndClear(r, a, n) {
    var t = function runFn(r) {
      return r && r.apply(void 0, a || []);
    };
    each(r, t);
    !n && (r.length = 0);
  };
  var x = function hasOwnProperty(r, a) {
    return Object.prototype.hasOwnProperty.call(r, a);
  };
  var E = function keys(r) {
    return r ? Object.keys(r) : [];
  };
  var z = function assignDeep(r, a, n, t, e, i, v) {
    var u = [ a, n, t, e, i, v ];
    if (("object" !== typeof r || o(r)) && !s(r)) {
      r = {};
    }
    each(u, (function(a) {
      each(E(a), (function(n) {
        var t = a[n];
        if (r === t) {
          return true;
        }
        var e = d(t);
        if (t && (p(t) || e)) {
          var i = r[n];
          var v = i;
          if (e && !d(i)) {
            v = [];
          } else if (!e && !p(i)) {
            v = {};
          }
          r[n] = assignDeep(v, t);
        } else {
          r[n] = t;
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
  var P = function getSetProp(r, a, n, t) {
    if (v(t)) {
      return n ? n[r] : a;
    }
    n && (n[r] = t);
  };
  var T = function attr(r, a, n) {
    if (v(n)) {
      return r ? r.getAttribute(a) : null;
    }
    r && r.setAttribute(a, n);
  };
  var L = function attrClass(r, a, n, t) {
    var e = T(r, a) || "";
    var i = new Set(e.split(" "));
    i[t ? "add" : "delete"](n);
    T(r, a, S(i).join(" ").trim());
  };
  var I = function hasAttrClass(r, a, n) {
    var t = T(r, a) || "";
    var e = new Set(t.split(" "));
    return e.has(n);
  };
  var D = function removeAttr(r, a) {
    r && r.removeAttribute(a);
  };
  var M = function scrollLeft(r, a) {
    return P("scrollLeft", 0, r, a);
  };
  var R = function scrollTop(r, a) {
    return P("scrollTop", 0, r, a);
  };
  var V = Element.prototype;
  var j = function find(r, a) {
    var n = [];
    var t = a ? b(a) ? a : null : document;
    return t ? y(n, t.querySelectorAll(r)) : n;
  };
  var H = function findFirst(r, a) {
    var n = a ? b(a) ? a : null : document;
    return n ? n.querySelector(r) : null;
  };
  var B = function is(r, a) {
    if (b(r)) {
      var n = V.matches || V.msMatchesSelector;
      return n.call(r, a);
    }
    return false;
  };
  var k = function contents(r) {
    return r ? S(r.childNodes) : [];
  };
  var F = function parent(r) {
    return r ? r.parentElement : null;
  };
  var q = function closest(r, a) {
    if (b(r)) {
      var n = V.closest;
      if (n) {
        return n.call(r, a);
      }
      do {
        if (B(r, a)) {
          return r;
        }
        r = F(r);
      } while (r);
    }
    return null;
  };
  var U = function liesBetween(r, a, n) {
    var t = r && q(r, a);
    var e = r && H(n, t);
    return t && e ? t === r || e === r || q(q(r, n), a) !== t : false;
  };
  var Y = function before(r, a, n) {
    if (n) {
      var t = a;
      var e;
      if (r) {
        if (h(n)) {
          e = document.createDocumentFragment();
          each(n, (function(r) {
            if (r === t) {
              t = r.previousSibling;
            }
            e.appendChild(r);
          }));
        } else {
          e = n;
        }
        if (a) {
          if (!t) {
            t = r.firstChild;
          } else if (t !== a) {
            t = t.nextSibling;
          }
        }
        r.insertBefore(e, t || null);
      }
    }
  };
  var N = function appendChildren(r, a) {
    Y(r, null, a);
  };
  var W = function prependChildren(r, a) {
    Y(r, r && r.firstChild, a);
  };
  var G = function insertBefore(r, a) {
    Y(F(r), r, a);
  };
  var X = function insertAfter(r, a) {
    Y(F(r), r && r.nextSibling, a);
  };
  var $ = function removeElements(r) {
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
  var J = function createDiv(r) {
    var a = document.createElement("div");
    if (r) {
      T(a, "class", r);
    }
    return a;
  };
  var K = function createDOM(r) {
    var a = J();
    a.innerHTML = r.trim();
    return each(k(a), (function(r) {
      return $(r);
    }));
  };
  var Z = function firstLetterToUpper(r) {
    return r.charAt(0).toUpperCase() + r.slice(1);
  };
  var Q = function getDummyStyle() {
    return J().style;
  };
  var rr = [ "-webkit-", "-moz-", "-o-", "-ms-" ];
  var ar = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ];
  var nr = {};
  var tr = {};
  var er = function cssProperty(r) {
    var a = tr[r];
    if (x(tr, r)) {
      return a;
    }
    var n = Z(r);
    var t = Q();
    each(rr, (function(e) {
      var i = e.replace(/-/g, "");
      var v = [ r, e + r, i + n, Z(i) + n ];
      return !(a = v.find((function(r) {
        return void 0 !== t[r];
      })));
    }));
    return tr[r] = a || "";
  };
  var ir = function jsAPI(r) {
    var a = nr[r] || window[r];
    if (x(nr, r)) {
      return a;
    }
    each(ar, (function(n) {
      a = a || window[n + Z(r)];
      return !a;
    }));
    nr[r] = a;
    return a;
  };
  var vr = ir("MutationObserver");
  var or = ir("IntersectionObserver");
  var ur = ir("ResizeObserver");
  var fr = ir("cancelAnimationFrame");
  var lr = ir("requestAnimationFrame");
  var cr = /[^\x20\t\r\n\f]+/g;
  var sr = function classListAction(r, a, n) {
    var t;
    var e = 0;
    var i = false;
    if (r && a && l(a)) {
      var v = a.match(cr) || [];
      i = v.length > 0;
      while (t = v[e++]) {
        i = !!n(r.classList, t) && i;
      }
    }
    return i;
  };
  var dr = function hasClass(r, a) {
    return sr(r, a, (function(r, a) {
      return r.contains(a);
    }));
  };
  var gr = function removeClass(r, a) {
    sr(r, a, (function(r, a) {
      return r.remove(a);
    }));
  };
  var hr = function addClass(r, a) {
    sr(r, a, (function(r, a) {
      return r.add(a);
    }));
    return gr.bind(0, r, a);
  };
  var pr = function equal(r, a, n, t) {
    if (r && a) {
      var e = true;
      each(n, (function(n) {
        var i = t ? t(r[n]) : r[n];
        var v = t ? t(a[n]) : a[n];
        if (i !== v) {
          e = false;
        }
      }));
      return e;
    }
    return false;
  };
  var _r = function equalWH(r, a) {
    return pr(r, a, [ "w", "h" ]);
  };
  var wr = function equalXY(r, a) {
    return pr(r, a, [ "x", "y" ]);
  };
  var br = function equalTRBL(r, a) {
    return pr(r, a, [ "t", "r", "b", "l" ]);
  };
  var mr = function equalBCRWH(r, a, n) {
    return pr(r, a, [ "width", "height" ], n && function(r) {
      return Math.round(r);
    });
  };
  var yr = function clearTimeouts(r) {
    r && window.clearTimeout(r);
    r && fr(r);
  };
  var Sr = function noop() {};
  var Cr = function debounce(r, a) {
    var n;
    var t;
    var e;
    var i;
    var v = a || {}, o = v.p, u = v._, l = v.m;
    var c = window.setTimeout;
    var d = function invokeFunctionToDebounce(a) {
      yr(n);
      yr(t);
      t = n = e = void 0;
      r.apply(this, a);
    };
    var g = function mergeParms(r) {
      return l && e ? l(e, r) : r;
    };
    var h = function flush() {
      if (n) {
        d(g(i) || i);
      }
    };
    var p = function debouncedFn() {
      var r = S(arguments);
      var a = s(o) ? o() : o;
      var v = f(a) && a >= 0;
      if (v) {
        var l = s(u) ? u() : u;
        var p = f(l) && l >= 0;
        var w = a > 0 ? c : lr;
        var b = g(r);
        var m = b || r;
        var y = d.bind(0, m);
        yr(n);
        n = w(y, a);
        if (p && !t) {
          t = c(h, l);
        }
        e = i = m;
      } else {
        d(r);
      }
    };
    p.S = h;
    return p;
  };
  var Or = {
    opacity: 1,
    zindex: 1
  };
  var xr = function parseToZeroOrNumber(r, a) {
    var n = a ? parseFloat(r) : parseInt(r, 10);
    return n === n ? n : 0;
  };
  var Er = function adaptCSSVal(r, a) {
    return !Or[r.toLowerCase()] && f(a) ? a + "px" : a;
  };
  var zr = function getCSSVal(r, a, n) {
    return null != a ? a[n] || a.getPropertyValue(n) : r.style[n];
  };
  var Ar = function setCSSVal(r, a, n) {
    try {
      if (r) {
        var t = r.style;
        if (!v(t[a])) {
          t[a] = Er(a, n);
        } else {
          t.setProperty(a, n);
        }
      }
    } catch (e) {}
  };
  var Pr = function topRightBottomLeft(r, a, n) {
    var t = a ? a + "-" : "";
    var e = n ? "-" + n : "";
    var i = t + "top" + e;
    var v = t + "right" + e;
    var o = t + "bottom" + e;
    var u = t + "left" + e;
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
  var Ir = function offsetSize(r) {
    return r ? {
      w: r.offsetWidth,
      h: r.offsetHeight
    } : Tr;
  };
  var Dr = function clientSize(r) {
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
    var n = parseFloat(style(r, "height")) || 0;
    return {
      w: n - Math.round(n),
      h: a - Math.round(a)
    };
  };
  var Vr = function getBoundingClientRect(r) {
    return r.getBoundingClientRect();
  };
  var jr;
  var Hr = function supportPassiveEvents() {
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
  var kr = function off(r, a, n, t) {
    each(Br(a), (function(a) {
      r.removeEventListener(a, n, t);
    }));
  };
  var Fr = function on(r, a, n, t) {
    var e = Hr();
    var i = e && t && t.C || false;
    var v = t && t.O || false;
    var o = t && t.A || false;
    var u = [];
    var f = e ? {
      passive: i,
      capture: v
    } : v;
    each(Br(a), (function(a) {
      var t = o ? function(e) {
        r.removeEventListener(a, t, v);
        n && n(e);
      } : n;
      y(u, kr.bind(null, r, a, t, v));
      r.addEventListener(a, t, f);
    }));
    return O.bind(0, u);
  };
  var qr = function stopPropagation(r) {
    return r.stopPropagation();
  };
  var Ur = function preventDefault(r) {
    return r.preventDefault();
  };
  var Yr = function stopAndPrevent(r) {
    return qr(r) || Ur(r);
  };
  var Nr = {
    x: 0,
    y: 0
  };
  var Wr = function absoluteCoordinates(r) {
    var a = r ? Vr(r) : 0;
    return a ? {
      x: a.left + window.pageYOffset,
      y: a.top + window.pageXOffset
    } : Nr;
  };
  var Gr = function manageListener(r, a) {
    each(d(a) ? a : [ a ], r);
  };
  var Xr = function createEventListenerHub(r) {
    var a = new Map;
    var n = function removeEvent(r, n) {
      if (r) {
        var t = a.get(r);
        Gr((function(r) {
          if (t) {
            t[r ? "delete" : "clear"](r);
          }
        }), n);
      } else {
        a.forEach((function(r) {
          r.clear();
        }));
        a.clear();
      }
    };
    var t = function addEvent(r, t) {
      var e = a.get(r) || new Set;
      a.set(r, e);
      Gr((function(r) {
        r && e.add(r);
      }), t);
      return n.bind(0, r, t);
    };
    var e = function triggerEvent(r, n) {
      var t = a.get(r);
      each(S(t), (function(r) {
        if (n && !C(n)) {
          r.apply(0, n);
        } else {
          r();
        }
      }));
    };
    var i = E(r);
    each(i, (function(a) {
      t(a, r[a]);
    }));
    return [ t, n, e ];
  };
  var $r = function getPropByPath(r, a) {
    return r ? a.split(".").reduce((function(r, a) {
      return r && x(r, a) ? r[a] : void 0;
    }), r) : void 0;
  };
  var Jr = function createOptionCheck(r, a, n) {
    return function(t) {
      return [ $r(r, t), n || void 0 !== $r(a, t) ];
    };
  };
  var Kr = function createState(r) {
    var a = r;
    return [ function() {
      return a;
    }, function(r) {
      a = z({}, a, r);
    } ];
  };
  var Zr = "os-environment";
  var Qr = Zr + "-flexbox-glue";
  var ra = Qr + "-max";
  var aa = "data-overlayscrollbars";
  var na = aa + "-overflow-x";
  var ta = aa + "-overflow-y";
  var ea = "overflowVisible";
  var ia = "viewportStyled";
  var va = "os-padding";
  var oa = "os-viewport";
  var ua = oa + "-arrange";
  var fa = "os-content";
  var la = oa + "-scrollbar-styled";
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
  var Sa = "os-scrollbar-track";
  var Ca = "os-scrollbar-handle";
  var Oa = function opsStringify(r) {
    return JSON.stringify(r, (function(r, a) {
      if (s(a)) {
        throw new Error;
      }
      return a;
    }));
  };
  var xa = {
    paddingAbsolute: false,
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
    nativeScrollbarsOverlaid: {
      show: false,
      initialize: false
    },
    scrollbars: {
      visibility: "auto",
      autoHide: "never",
      autoHideDelay: 800,
      dragScroll: true,
      clickScroll: false,
      touch: true
    }
  };
  var Ea = function getOptionsDiff(r, a) {
    var n = {};
    var t = E(a).concat(E(r));
    each(t, (function(t) {
      var e = r[t];
      var i = a[t];
      if (g(e) && g(i)) {
        z(n[t] = {}, getOptionsDiff(e, i));
      } else if (x(a, t) && i !== e) {
        var v = true;
        if (d(e) || d(i)) {
          try {
            if (Oa(e) === Oa(i)) {
              v = false;
            }
          } catch (o) {}
        }
        if (v) {
          n[t] = i;
        }
      }
    }));
    return n;
  };
  var za;
  var Aa = Math.abs, Pa = Math.round;
  var Ta = function diffBiggerThanOne(r, a) {
    var n = Aa(r);
    var t = Aa(a);
    return !(n === t || n + 1 === t || n - 1 === t);
  };
  var La = function getNativeScrollbarSize(r, a, n) {
    N(r, a);
    var t = Dr(a);
    var e = Ir(a);
    var i = Rr(n);
    return {
      x: e.h - t.h + i.h,
      y: e.w - t.w + i.w
    };
  };
  var Ia = function getNativeScrollbarsHiding(r) {
    var a = false;
    var n = hr(r, la);
    try {
      a = "none" === style(r, er("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (t) {}
    n();
    return a;
  };
  var Da = function getRtlScrollBehavior(r, a) {
    var n = "hidden";
    style(r, {
      overflowX: n,
      overflowY: n,
      direction: "rtl"
    });
    M(r, 0);
    var t = Wr(r);
    var e = Wr(a);
    M(r, -999);
    var i = Wr(a);
    return {
      i: t.x === e.x,
      n: e.x !== i.x
    };
  };
  var Ma = function getFlexboxGlue(r, a) {
    var n = hr(r, Qr);
    var t = Vr(r);
    var e = Vr(a);
    var i = mr(e, t, true);
    var v = hr(r, ra);
    var o = Vr(r);
    var u = Vr(a);
    var f = mr(u, o, true);
    n();
    v();
    return i && f;
  };
  var Ra = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var a = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / a;
  };
  var Va = function createEnvironment() {
    var r = document, n = r.body;
    var t = K('<div class="' + Zr + '"><div></div></div>');
    var e = t[0];
    var i = e.firstChild;
    var v = Xr(), o = v[0], u = v[2];
    var f = a({
      o: La(n, e, i),
      u: wr
    }), l = f[0], c = f[1];
    var s = c(), d = s[0];
    var g = Ia(e);
    var h = {
      x: 0 === d.x,
      y: 0 === d.y
    };
    var p = {
      P: !g,
      T: false
    };
    var w = z({}, xa);
    var b = {
      L: d,
      I: h,
      D: g,
      M: "-1" === style(e, "zIndex"),
      R: Da(e, i),
      V: Ma(e, i),
      j: function _addListener(r) {
        return o("_", r);
      },
      H: z.bind(0, {}, p),
      B: function _setInitializationStrategy(r) {
        z(p, r);
      },
      k: z.bind(0, {}, w),
      F: function _setDefaultOptions(r) {
        z(w, r);
      },
      q: z({}, p),
      U: z({}, w)
    };
    D(e, "style");
    $(e);
    if (!g && (!h.x || !h.y)) {
      var m = Lr();
      var y = Ra();
      window.addEventListener("resize", (function() {
        var r = Lr();
        var a = {
          w: r.w - m.w,
          h: r.h - m.h
        };
        if (0 === a.w && 0 === a.h) {
          return;
        }
        var t = {
          w: Aa(a.w),
          h: Aa(a.h)
        };
        var v = {
          w: Aa(Pa(r.w / (m.w / 100))),
          h: Aa(Pa(r.h / (m.h / 100)))
        };
        var o = Ra();
        var f = t.w > 2 && t.h > 2;
        var c = !Ta(v.w, v.h);
        var s = o !== y && y > 0;
        var d = f && c && s;
        if (d) {
          var g = l(La(n, e, i)), h = g[0], p = g[1];
          z(za.L, h);
          $(e);
          if (p) {
            u("_");
          }
        }
        m = r;
        y = o;
      }));
    }
    return b;
  };
  var ja = function getEnvironment() {
    if (!za) {
      za = Va();
    }
    return za;
  };
  var Ha = {};
  var Ba = function getPlugins() {
    return z({}, Ha);
  };
  var ka = function addPlugin(r) {
    return each(d(r) ? r : [ r ], (function(r) {
      each(E(r), (function(a) {
        Ha[a] = r[a];
      }));
    }));
  };
  var Fa = {
    exports: {}
  };
  (function(r) {
    function _extends() {
      r.exports = _extends = Object.assign ? Object.assign.bind() : function(r) {
        for (var a = 1; a < arguments.length; a++) {
          var n = arguments[a];
          for (var t in n) {
            if (Object.prototype.hasOwnProperty.call(n, t)) {
              r[t] = n[t];
            }
          }
        }
        return r;
      }, r.exports.v = true, r.exports["default"] = r.exports;
      return _extends.apply(this, arguments);
    }
    r.exports = _extends, r.exports.v = true, r.exports["default"] = r.exports;
  })(Fa);
  var qa = getDefaultExportFromCjs(Fa.exports);
  var Ua = {
    boolean: "__TPL_boolean_TYPE__",
    number: "__TPL_number_TYPE__",
    string: "__TPL_string_TYPE__",
    array: "__TPL_array_TYPE__",
    object: "__TPL_object_TYPE__",
    function: "__TPL_function_TYPE__",
    null: "__TPL_null_TYPE__"
  };
  var Ya = function validateRecursive(r, a, n, t) {
    var e = {};
    var i = qa({}, a);
    var o = E(r).filter((function(r) {
      return x(a, r);
    }));
    each(o, (function(o) {
      var f = a[o];
      var c = r[o];
      var s = p(c);
      var g = t ? t + "." : "";
      if (s && p(f)) {
        var h = validateRecursive(c, f, n, g + o), w = h[0], b = h[1];
        e[o] = w;
        i[o] = b;
        each([ i, e ], (function(r) {
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
          each(Ua, (function(n, t) {
            if (n === r) {
              a = t;
            }
          }));
          var n = v(a);
          if (n && l(f)) {
            var t = r.split(" ");
            m = !!t.find((function(r) {
              return r === f;
            }));
            y(S, t);
          } else {
            m = Ua[O] === r;
          }
          y(C, n ? Ua.string : a);
          return !m;
        }));
        if (m) {
          e[o] = f;
        } else if (n) {
          console.warn('The option "' + g + o + "\" wasn't set, because it doesn't accept the type [ " + O.toUpperCase() + ' ] with the value of "' + f + '".\r\n' + "Accepted types are: [ " + C.join(", ").toUpperCase() + " ].\r\n" + (S.length > 0 ? "\r\nValid strings are: [ " + S.join(", ") + " ]." : ""));
        }
        delete i[o];
      }
    }));
    return [ e, i ];
  };
  var Na = function validateOptions(r, a, n) {
    return Ya(r, a, n);
  };
  var Wa;
  var Ga = Ua.number;
  var Xa = Ua.boolean;
  var $a = [ Ua.array, Ua.null ];
  var Ja = "hidden scroll visible visible-hidden";
  var Ka = "visible hidden auto";
  var Za = "never scroll leavemove";
  var Qa = {
    paddingAbsolute: Xa,
    updating: {
      elementEvents: $a,
      attributes: $a,
      debounce: [ Ua.number, Ua.array, Ua.null ],
      ignoreMutation: [ Ua.function, Ua.null ]
    },
    overflow: {
      x: Ja,
      y: Ja
    },
    scrollbars: {
      visibility: Ka,
      autoHide: Za,
      autoHideDelay: Ga,
      dragScroll: Xa,
      clickScroll: Xa,
      touch: Xa
    },
    nativeScrollbarsOverlaid: {
      show: Xa,
      initialize: Xa
    }
  };
  var rn = "__osOptionsValidationPlugin";
  var an = (Wa = {}, Wa[rn] = {
    Y: function _(r, a) {
      var n = Na(Qa, r, a), t = n[0], e = n[1];
      return qa({}, e, t);
    }
  }, Wa);
  var nn;
  var tn = 3333333;
  var en = "scroll";
  var vn = "__osSizeObserverPlugin";
  var un = (nn = {}, nn[vn] = {
    Y: function _(r, a, n) {
      var t = K('<div class="' + pa + '" dir="ltr"><div class="' + pa + '"><div class="' + _a + '"></div></div><div class="' + pa + '"><div class="' + _a + '" style="width: 200%; height: 200%"></div></div></div>');
      N(r, t);
      hr(r, ha);
      var e = t[0];
      var i = e.lastChild;
      var v = e.firstChild;
      var o = null == v ? void 0 : v.firstChild;
      var u = Ir(e);
      var f = u;
      var l = false;
      var c;
      var s = function reset() {
        M(v, tn);
        R(v, tn);
        M(i, tn);
        R(i, tn);
      };
      var d = function onResized(r) {
        c = 0;
        if (l) {
          u = f;
          a(true === r);
        }
      };
      var g = function onScroll(r) {
        f = Ir(e);
        l = !r || !_r(f, u);
        if (r) {
          Yr(r);
          if (l && !c) {
            fr(c);
            c = lr(d);
          }
        } else {
          d(false === r);
        }
        s();
      };
      var h = y([], [ Fr(v, en, g), Fr(i, en, g) ]);
      style(o, {
        width: tn,
        height: tn
      });
      s();
      return [ n ? g.bind(0, false) : s, h ];
    }
  }, nn);
  var fn;
  var ln = 0;
  var cn = "__osScrollbarsHidingPlugin";
  var sn = (fn = {}, fn[cn] = {
    N: function _createUniqueViewportArrangeElement() {
      var r = ja(), a = r.D, n = r.I, t = r.M;
      var e = !t && !a && (n.x || n.y);
      var i = e ? document.createElement("style") : false;
      if (i) {
        T(i, "id", ua + "-" + ln);
        ln++;
      }
      return i;
    },
    W: function _overflowUpdateSegment(r, a, n, t, e, i) {
      var v = ja(), o = v.V;
      var u = function arrangeViewport(e, i, v, o) {
        if (r) {
          var u = t(), f = u.G;
          var l = e.X, c = e.$;
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
            style(a, {
              "--os-vaw": S.w,
              "--os-vah": S.h
            });
          }
        }
        return r;
      };
      var f = function undoViewportArrange(n, v, u) {
        if (r) {
          var f = u || e(n);
          var l = t(), c = l.G;
          var s = f.$;
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
          var w = style(a, E(h));
          gr(a, ua);
          if (!o) {
            h.height = "";
          }
          style(a, h);
          return [ function() {
            i(f, v, r, w);
            style(a, w);
            hr(a, ua);
          }, f ];
        }
        return [ Sr ];
      };
      return [ u, f ];
    }
  }, fn);
  var dn = function resolveInitialization(r, a) {
    return s(r) ? r.apply(0, a) : r;
  };
  var gn = function staticInitializationElement(r, a, n, t) {
    return dn(t || dn(n, r), r) || a.apply(0, r);
  };
  var hn = function dynamicInitializationElement(r, a, n, t) {
    var e = dn(t, r);
    if (o(e) || v(e)) {
      e = dn(n, r);
    }
    return true === e || o(e) || v(e) ? a.apply(0, r) : e;
  };
  var pn = J.bind(0, "");
  var _n = function unwrap(r) {
    N(F(r), k(r));
    $(r);
  };
  var wn = function addDataAttrHost(r, a) {
    T(r, aa, a);
    return D.bind(0, r, aa);
  };
  var bn = function createStructureSetupElements(r) {
    var a = ja(), n = a.H, t = a.D;
    var e = Ba()[cn];
    var i = e && e.N;
    var v = n(), o = v.J, u = v.K, f = v.P, l = v.T;
    var c = w(r);
    var s = r;
    var d = c ? r : s.target;
    var g = B(d, "textarea");
    var h = !g && B(d, "body");
    var p = d.ownerDocument;
    var b = p.body;
    var S = p.defaultView;
    var C = !!ur && !g && t;
    var x = gn.bind(0, [ d ]);
    var z = hn.bind(0, [ d ]);
    var A = [ x(pn, u, s.viewport), x(pn, u), x(pn) ].filter((function(r) {
      return !C ? r !== d : true;
    }))[0];
    var P = A === d;
    var T = {
      Z: d,
      J: g ? x(pn, o, s.host) : d,
      K: A,
      P: !P && z(pn, f, s.padding),
      T: !P && z(pn, l, s.content),
      rr: !P && !t && i && i(),
      ar: S,
      nr: p,
      tr: F(b),
      er: b,
      ir: g,
      vr: h,
      ur: c,
      lr: P,
      cr: function _viewportHasClass(r, a) {
        return P ? I(A, aa, a) : dr(A, r);
      },
      sr: function _viewportAddRemoveClass(r, a, n) {
        return P ? L(A, aa, a, n) : (n ? hr : gr)(A, r);
      }
    };
    var M = E(T).reduce((function(r, a) {
      var n = T[a];
      return y(r, n && !F(n) ? n : false);
    }), []);
    var R = function elementIsGenerated(r) {
      return r ? m(M, r) > -1 : null;
    };
    var V = T.Z, j = T.J, H = T.P, q = T.K, U = T.T, Y = T.rr;
    var W = [];
    var J = g && R(j);
    var K = g ? V : k([ U, q, H, j, V ].find((function(r) {
      return false === R(r);
    })));
    var Z = U || q;
    var Q = function appendElements() {
      var r = wn(j, P ? "viewport" : "host");
      var a = hr(H, va);
      var n = hr(q, !P && oa);
      var e = hr(U, fa);
      if (J) {
        X(V, j);
        y(W, (function() {
          X(j, V);
          $(j);
        }));
      }
      N(Z, K);
      N(j, H);
      N(H || j, !P && q);
      N(q, U);
      y(W, (function() {
        r();
        D(q, na);
        D(q, ta);
        if (R(U)) {
          _n(U);
        }
        if (R(q)) {
          _n(q);
        }
        if (R(H)) {
          _n(H);
        }
        a();
        n();
        e();
      }));
      if (t && !P) {
        y(W, gr.bind(0, q, la));
      }
      if (Y) {
        G(q, Y);
        y(W, $.bind(0, Y));
      }
    };
    return [ T, Q, O.bind(0, W) ];
  };
  var mn = function createTrinsicUpdate(r, a) {
    var n = r.T;
    var t = a[0];
    return function(r) {
      var a = ja(), e = a.V;
      var i = t(), v = i.dr;
      var o = r.gr;
      var u = (n || !e) && o;
      if (u) {
        style(n, {
          height: v ? "" : "100%"
        });
      }
      return {
        hr: u,
        pr: u
      };
    };
  };
  var yn = function createPaddingUpdate(r, n) {
    var t = n[0], e = n[1];
    var i = r.J, v = r.P, o = r.K, u = r.lr;
    var f = a({
      u: br,
      o: Pr()
    }, Pr.bind(0, i, "padding", "")), l = f[0], c = f[1];
    return function(r, a, n) {
      var i = c(n), f = i[0], s = i[1];
      var d = ja(), g = d.D, h = d.V;
      var p = t(), w = p._r;
      var b = r.hr, m = r.pr, y = r.wr;
      var S = a("paddingAbsolute"), C = S[0], O = S[1];
      var x = !h && m;
      if (b || s || x) {
        var E = l(n);
        f = E[0];
        s = E[1];
      }
      var A = !u && (O || y || s);
      if (A) {
        var P = !C || !v && !g;
        var T = f.r + f.l;
        var L = f.t + f.b;
        var I = {
          marginRight: P && !w ? -T : 0,
          marginBottom: P ? -L : 0,
          marginLeft: P && w ? -T : 0,
          top: P ? -f.t : 0,
          right: P ? w ? -f.r : "auto" : 0,
          left: P ? w ? "auto" : -f.l : 0,
          width: P ? "calc(100% + " + T + "px)" : ""
        };
        var D = {
          paddingTop: P ? f.t : 0,
          paddingRight: P ? f.r : 0,
          paddingBottom: P ? f.b : 0,
          paddingLeft: P ? f.l : 0
        };
        style(v || o, I);
        style(o, D);
        e({
          P: f,
          br: !P,
          G: v ? D : z({}, I, D)
        });
      }
      return {
        mr: A
      };
    };
  };
  var Sn = Math.max;
  var Cn = "visible";
  var On = "hidden";
  var xn = 42;
  var En = {
    u: _r,
    o: {
      w: 0,
      h: 0
    }
  };
  var zn = {
    u: wr,
    o: {
      x: On,
      y: On
    }
  };
  var An = function getOverflowAmount(r, a, n) {
    var t = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
    var e = {
      w: Sn(0, r.w - a.w - Sn(0, n.w)),
      h: Sn(0, r.h - a.h - Sn(0, n.h))
    };
    return {
      w: e.w > t ? e.w : 0,
      h: e.h > t ? e.h : 0
    };
  };
  var Pn = function conditionalClass(r, a, n) {
    return n ? hr(r, a) : gr(r, a);
  };
  var Tn = function overflowIsVisible(r) {
    return 0 === r.indexOf(Cn);
  };
  var Ln = function createOverflowUpdate(r, n) {
    var t = n[0], e = n[1];
    var i = r.J, v = r.P, o = r.K, u = r.rr, f = r.lr, l = r.sr;
    var c = ja(), s = c.L, d = c.V, g = c.D, h = c.I;
    var p = Ba()[cn];
    var w = !f && !g && (h.x || h.y);
    var b = a(En, Rr.bind(0, o)), m = b[0], y = b[1];
    var S = a(En, Mr.bind(0, o)), C = S[0], O = S[1];
    var x = a(En), E = x[0], z = x[1];
    var A = a(zn), P = A[0];
    var I = function fixFlexboxGlue(r, a) {
      style(o, {
        height: ""
      });
      if (a) {
        var n = t(), e = n.br, v = n.P;
        var u = r.yr, f = r.X;
        var l = Rr(i);
        var c = Dr(i);
        var s = "content-box" === style(o, "boxSizing");
        var d = e || s ? v.b + v.t : 0;
        var g = !(h.x && s);
        style(o, {
          height: c.h + l.h + (u.x && g ? f.x : 0) - d
        });
      }
    };
    var D = function getViewportOverflowState(r, a) {
      var n = !g && !r ? xn : 0;
      var t = function getStatePerAxis(r, t, e) {
        var i = style(o, r);
        var v = a ? a[r] : i;
        var u = "scroll" === v;
        var f = t ? n : e;
        var l = u && !g ? f : 0;
        var c = t && !!n;
        return [ i, u, l, c ];
      };
      var e = t("overflowX", h.x, s.x), i = e[0], v = e[1], u = e[2], f = e[3];
      var l = t("overflowY", h.y, s.y), c = l[0], d = l[1], p = l[2], w = l[3];
      return {
        Sr: {
          x: i,
          y: c
        },
        yr: {
          x: v,
          y: d
        },
        X: {
          x: u,
          y: p
        },
        $: {
          x: f,
          y: w
        }
      };
    };
    var M = function setViewportOverflowState(r, a, n, t) {
      var e = function setAxisOverflowStyle(r, a) {
        var n = Tn(r);
        var t = a && n && r.replace(Cn + "-", "") || "";
        return [ a && !n ? r : "", Tn(t) ? "hidden" : t ];
      };
      var i = e(n.x, a.x), v = i[0], o = i[1];
      var u = e(n.y, a.y), f = u[0], l = u[1];
      t.overflowX = o && f ? o : v;
      t.overflowY = l && v ? l : f;
      return D(r, t);
    };
    var R = function hideNativeScrollbars(r, a, n, e) {
      var i = r.X, v = r.$;
      var o = v.x, u = v.y;
      var f = i.x, l = i.y;
      var c = t(), s = c.G;
      var d = a ? "marginLeft" : "marginRight";
      var g = a ? "paddingLeft" : "paddingRight";
      var h = s[d];
      var p = s.marginBottom;
      var w = s[g];
      var b = s.paddingBottom;
      e.width = "calc(100% + " + (l + -1 * h) + "px)";
      e[d] = -l + h;
      e.marginBottom = -f + p;
      if (n) {
        e[g] = w + (u ? l : 0);
        e.paddingBottom = b + (o ? f : 0);
      }
    };
    var V = p ? p.W(w, o, u, t, D, R) : [ function() {
      return w;
    }, function() {
      return [ Sr ];
    } ], j = V[0], H = V[1];
    return function(r, a, n) {
      var u = r.hr, c = r.Cr, s = r.pr, p = r.mr, w = r.gr, b = r.wr;
      var S = t(), x = S.dr, A = S._r;
      var V = a("nativeScrollbarsOverlaid.show"), B = V[0], k = V[1];
      var F = a("overflow"), q = F[0], U = F[1];
      var Y = B && h.x && h.y;
      var N = !f && !d && (u || s || c || k || w);
      var W = Tn(q.x);
      var G = Tn(q.y);
      var X = W || G;
      var $ = y(n);
      var J = O(n);
      var K = z(n);
      var Z;
      if (k && g) {
        l(la, ia, !Y);
      }
      if (N) {
        Z = D(Y);
        I(Z, x);
      }
      if (u || p || s || b || k) {
        if (X) {
          l(ca, ea, false);
        }
        var Q = H(Y, A, Z), rr = Q[0], ar = Q[1];
        var nr = $ = m(n), tr = nr[0], er = nr[1];
        var ir = J = C(n), vr = ir[0], or = ir[1];
        var ur = Dr(o);
        var fr = vr;
        var lr = ur;
        rr();
        if ((or || er || k) && ar && !Y && j(ar, vr, tr, A)) {
          lr = Dr(o);
          fr = Mr(o);
        }
        K = E(An({
          w: Sn(vr.w, fr.w),
          h: Sn(vr.h, fr.h)
        }, {
          w: lr.w + Sn(0, ur.w - vr.w),
          h: lr.h + Sn(0, ur.h - vr.h)
        }, tr), n);
      }
      var cr = K, sr = cr[0], dr = cr[1];
      var gr = J, hr = gr[0], pr = gr[1];
      var _r = $, wr = _r[0], br = _r[1];
      var mr = {
        x: sr.w > 0,
        y: sr.h > 0
      };
      var yr = W && G && (mr.x || mr.y) || W && mr.x && !mr.y || G && mr.y && !mr.x;
      if (p || b || br || pr || dr || U || k || N) {
        var Sr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Cr = M(Y, mr, q, Sr);
        var Or = j(Cr, hr, wr, A);
        if (!f) {
          R(Cr, A, Or, Sr);
        }
        if (N) {
          I(Cr, x);
        }
        if (f) {
          T(i, na, Sr.overflowX);
          T(i, ta, Sr.overflowY);
        } else {
          style(o, Sr);
        }
      }
      L(i, aa, ea, yr);
      Pn(v, ca, yr);
      !f && Pn(o, ca, X);
      var xr = P(D(Y).Sr), Er = xr[0], zr = xr[1];
      e({
        Sr: Er,
        Or: {
          x: sr.w,
          y: sr.h
        },
        Er: mr
      });
      return {
        zr: zr,
        Ar: dr
      };
    };
  };
  var In = function prepareUpdateHints(r, a, n) {
    var t = {};
    var e = a || {};
    var i = E(r).concat(E(e));
    each(i, (function(a) {
      var i = r[a];
      var v = e[a];
      t[a] = !!(n || i || v);
    }));
    return t;
  };
  var Dn = function createStructureSetupUpdate(r, a) {
    var n = r.K;
    var t = ja(), e = t.D, i = t.I, v = t.V;
    var o = !e && (i.x || i.y);
    var u = [ mn(r, a), yn(r, a), Ln(r, a) ];
    return function(r, a, t) {
      var e = In(z({
        hr: false,
        mr: false,
        wr: false,
        gr: false,
        Ar: false,
        zr: false,
        Cr: false,
        pr: false
      }, a), {}, t);
      var i = o || !v;
      var l = i && M(n);
      var c = i && R(n);
      var s = e;
      each(u, (function(a) {
        s = In(s, a(s, r, !!t) || {}, t);
      }));
      if (f(l)) {
        M(n, l);
      }
      if (f(c)) {
        R(n, c);
      }
      return s;
    };
  };
  var Mn = "animationstart";
  var Rn = "scroll";
  var Vn = 3333333;
  var jn = function getElmDirectionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var Hn = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var Bn = function createSizeObserver(r, n, t) {
    var e = t || {}, i = e.Pr, v = void 0 === i ? false : i, o = e.Tr, u = void 0 === o ? false : o;
    var f = Ba()[vn];
    var l = ja(), s = l.R;
    var h = K('<div class="' + sa + '"><div class="' + ga + '"></div></div>');
    var p = h[0];
    var w = p.firstChild;
    var b = jn.bind(0, p);
    var m = a({
      o: void 0,
      g: true,
      u: function _equal(r, a) {
        return !(!r || !Hn(r) && Hn(a));
      }
    }), S = m[0];
    var C = function onSizeChangedCallbackProxy(r) {
      var a = d(r) && r.length > 0 && g(r[0]);
      var t = !a && c(r[0]);
      var e = false;
      var i = false;
      var o = true;
      if (a) {
        var u = S(r.pop().contentRect), f = u[0], l = u[2];
        var h = Hn(f);
        var w = Hn(l);
        e = !l || !h;
        i = !w && h;
        o = !e;
      } else if (t) {
        o = r[1];
      } else {
        i = true === r;
      }
      if (v && o) {
        var b = t ? r[0] : jn(p);
        M(p, b ? s.n ? -Vn : s.i ? 0 : Vn : Vn);
        R(p, Vn);
      }
      if (!e) {
        n({
          hr: !t,
          Lr: t ? r : void 0,
          Tr: !!i
        });
      }
    };
    var x = [];
    var E = u ? C : false;
    var z;
    if (ur) {
      var A = new ur(C);
      A.observe(w);
      y(x, (function() {
        A.disconnect();
      }));
    } else if (f) {
      var P = f.Y(w, C, u), T = P[0], L = P[1];
      E = T;
      y(x, L);
    }
    if (v) {
      z = a({
        o: !b()
      }, b);
      var I = z, D = I[0];
      y(x, Fr(p, Rn, (function(r) {
        var a = D();
        var n = a[0], t = a[1];
        if (t) {
          gr(w, "ltr rtl");
          if (n) {
            hr(w, "rtl");
          } else {
            hr(w, "ltr");
          }
          C(a);
        }
        Yr(r);
      })));
    }
    if (E) {
      hr(p, da);
      y(x, Fr(p, Mn, E, {
        A: !!ur
      }));
    }
    W(r, p);
    return function() {
      O(x);
      $(p);
    };
  };
  var kn = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var Fn = function createTrinsicObserver(r, n) {
    var t = J(wa);
    var e = [];
    var i = a({
      o: false
    }), v = i[0];
    var o = function triggerOnTrinsicChangedCallback(r) {
      if (r) {
        var a = v(kn(r));
        var t = a[1];
        if (t) {
          n(a);
        }
      }
    };
    if (or) {
      var u = new or((function(r) {
        if (r && r.length > 0) {
          o(r.pop());
        }
      }), {
        root: r
      });
      u.observe(t);
      y(e, (function() {
        u.disconnect();
      }));
    } else {
      var f = function onSizeChanged() {
        var r = Ir(t);
        o(r);
      };
      y(e, Bn(t, f));
      f();
    }
    W(r, t);
    return function() {
      O(e);
      $(t);
    };
  };
  var qn = function createEventContentChange(r, a, n) {
    var t;
    var e = false;
    var i = function destroy() {
      e = true;
    };
    var v = function updateElements(i) {
      if (n) {
        var v = n.reduce((function(a, n) {
          if (n) {
            var t = n[0];
            var e = n[1];
            var v = e && t && (i ? i(t) : j(t, r));
            if (v && v.length && e && l(e)) {
              y(a, [ v, e.trim() ], true);
            }
          }
          return a;
        }), []);
        each(v, (function(r) {
          return each(r[0], (function(n) {
            var i = r[1];
            var v = t.get(n);
            if (v) {
              var o = v[0];
              var u = v[1];
              if (o === i) {
                u();
              }
            }
            var f = Fr(n, i, (function(r) {
              if (e) {
                f();
                t.delete(n);
              } else {
                a(r);
              }
            }));
            t.set(n, [ i, f ]);
          }));
        }));
      }
    };
    if (n) {
      t = new WeakMap;
      v();
    }
    return [ i, v ];
  };
  var Un = function createDOMObserver(r, a, n, t) {
    var e = false;
    var i = t || {}, v = i.Ir, o = i.Dr, u = i.Mr, f = i.Rr, c = i.Vr, s = i.jr;
    var d = qn(r, Cr((function() {
      if (e) {
        n(true);
      }
    }), {
      p: 33,
      _: 99
    }), u), g = d[0], h = d[1];
    var p = v || [];
    var w = o || [];
    var b = p.concat(w);
    var S = function observerCallback(e) {
      var i = c || Sr;
      var v = s || Sr;
      var o = [];
      var u = [];
      var d = false;
      var g = false;
      var p = false;
      each(e, (function(n) {
        var e = n.attributeName, c = n.target, s = n.type, h = n.oldValue, b = n.addedNodes;
        var S = "attributes" === s;
        var C = "childList" === s;
        var O = r === c;
        var x = S && l(e) ? T(c, e) : 0;
        var E = 0 !== x && h !== x;
        var z = m(w, e) > -1 && E;
        if (a && !O) {
          var A = !S;
          var P = S && z;
          var L = P && f && B(c, f);
          var I = L ? !i(c, e, h, x) : A || P;
          var D = I && !v(n, !!L, r, t);
          y(u, b);
          g = g || D;
          p = p || C;
        }
        if (!a && O && E && !i(c, e, h, x)) {
          y(o, e);
          d = d || z;
        }
      }));
      if (p && !C(u)) {
        h((function(r) {
          return u.reduce((function(a, n) {
            y(a, j(r, n));
            return B(n, r) ? y(a, n) : a;
          }), []);
        }));
      }
      if (a) {
        g && n(false);
      } else if (!C(o) || d) {
        n(o, d);
      }
    };
    var O = new vr(S);
    O.observe(r, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: b,
      subtree: a,
      childList: a,
      characterData: a
    });
    e = true;
    return [ function() {
      if (e) {
        g();
        O.disconnect();
        e = false;
      }
    }, function() {
      if (e) {
        S(O.takeRecords());
      }
    } ];
  };
  var Yn = "[" + aa + "]";
  var Nn = "." + oa;
  var Wn = [ "tabindex" ];
  var Gn = [ "wrap", "cols", "rows" ];
  var Xn = [ "id", "class", "style", "open" ];
  var $n = function createStructureSetupObservers(r, n, t) {
    var e;
    var i;
    var v;
    var o = n[1];
    var u = r.J, c = r.K, g = r.T, h = r.ir, p = r.lr, w = r.cr, b = r.sr;
    var y = ja(), S = y.D, C = y.V;
    var O = a({
      u: _r,
      o: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = w(ca, ea);
      r && b(ca, ea);
      var a = Mr(g);
      var n = Mr(c);
      var t = Rr(c);
      r && b(ca, ea, true);
      return {
        w: n.w + a.w + t.w,
        h: n.h + a.h + t.h
      };
    })), x = O[0];
    var z = h ? Gn : Xn.concat(Gn);
    var A = Cr(t, {
      p: function _timeout() {
        return e;
      },
      _: function _maxDelay() {
        return i;
      },
      m: function _mergeParams(r, a) {
        var n = r[0];
        var t = a[0];
        return [ E(n).concat(E(t)).reduce((function(r, a) {
          r[a] = n[a] || t[a];
          return r;
        }), {}) ];
      }
    });
    var P = function updateViewportAttrsFromHost(r) {
      each(r || Wn, (function(r) {
        if (m(Wn, r) > -1) {
          var a = T(u, r);
          if (l(a)) {
            T(c, r, a);
          } else {
            D(c, r);
          }
        }
      }));
    };
    var L = function onTrinsicChanged(r) {
      var a = r[0], n = r[1];
      o({
        dr: a
      });
      t({
        gr: n
      });
    };
    var I = function onSizeChanged(r) {
      var a = r.hr, n = r.Lr, e = r.Tr;
      var i = !a || e ? t : A;
      var v = false;
      if (n) {
        var u = n[0], f = n[1];
        v = f;
        o({
          _r: u
        });
      }
      i({
        hr: a,
        wr: v
      });
    };
    var M = function onContentMutation(r) {
      var a = x(), n = a[1];
      var e = r ? t : A;
      if (n) {
        e({
          pr: true
        });
      }
    };
    var R = function onHostMutation(r, a) {
      if (a) {
        A({
          Cr: true
        });
      } else if (!p) {
        P(r);
      }
    };
    var V = (g || !C) && Fn(u, L);
    var j = !p && Bn(u, I, {
      Tr: true,
      Pr: !S
    });
    var H = Un(u, false, R, {
      Dr: Xn,
      Ir: Xn.concat(Wn)
    }), B = H[0];
    var k = p && new ur(I.bind(0, {
      hr: true
    }));
    k && k.observe(u);
    P();
    return [ function(r) {
      var a = r("updating.ignoreMutation"), n = a[0];
      var t = r("updating.attributes"), o = t[0], u = t[1];
      var l = r("updating.elementEvents"), h = l[0], p = l[1];
      var w = r("updating.debounce"), b = w[0], m = w[1];
      var y = p || u;
      var S = function ignoreMutationFromOptions(r) {
        return s(n) && n(r);
      };
      if (y) {
        if (v) {
          v[1]();
          v[0]();
        }
        v = Un(g || c, true, M, {
          Dr: z.concat(o || []),
          Ir: z.concat(o || []),
          Mr: h,
          Rr: Yn,
          jr: function _ignoreContentChange(r, a) {
            var n = r.target, t = r.attributeName;
            var e = !a && t ? U(n, Yn, Nn) : false;
            return e || !!S(r);
          }
        });
      }
      if (m) {
        A.S();
        if (d(b)) {
          var C = b[0];
          var O = b[1];
          e = f(C) ? C : false;
          i = f(O) ? O : false;
        } else if (f(b)) {
          e = b;
          i = false;
        } else {
          e = false;
          i = false;
        }
      }
    }, function() {
      v && v[0]();
      V && V();
      j && j();
      k && k.disconnect();
      B();
    } ];
  };
  var Jn = {
    P: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    br: false,
    G: {
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    },
    Or: {
      x: 0,
      y: 0
    },
    Sr: {
      x: "hidden",
      y: "hidden"
    },
    Er: {
      x: false,
      y: false
    },
    dr: false,
    _r: false
  };
  var Kn = function createStructureSetup(r, a) {
    var n = Jr(a, {});
    var t = Kr(Jn);
    var e = Xr(), i = e[0], v = e[1], o = e[2];
    var u = t[0];
    var f = bn(r), l = f[0], c = f[1], s = f[2];
    var d = Dn(l, t);
    var g = $n(l, t, (function(r) {
      o("u", [ d(n, r), {}, false ]);
    })), h = g[0], p = g[1];
    var w = u.bind(0);
    w.Hr = function(r) {
      i("u", r);
    };
    w.Br = c;
    w.kr = l;
    return [ function(r, n) {
      var t = Jr(a, r, n);
      h(t);
      o("u", [ d(t, {}, n), r, !!n ]);
    }, w, function() {
      v();
      p();
      s();
    } ];
  };
  var Zn = function generateScrollbarDOM(r) {
    var a = J(ba + " " + r);
    var n = J(Sa);
    var t = J(Ca);
    N(a, n);
    N(n, t);
    return {
      Fr: a,
      qr: n,
      Ur: t
    };
  };
  var Qn = function createScrollbarsSetupElements(r, a) {
    var n = ja(), t = n.H;
    var e = t(), i = e.Yr;
    var v = a.Z, o = a.J, u = a.K, f = a.ur;
    var l = !f && r.scrollbarsSlot;
    var c = hn([ v, o, u ], (function() {
      return o;
    }), i, l);
    var s = Zn(ma);
    var d = Zn(ya);
    var g = s.Fr;
    var h = d.Fr;
    var p = function appendElements() {
      N(c, g);
      N(c, h);
    };
    return [ {
      Nr: s,
      Wr: d
    }, p, $.bind(0, [ g, h ]) ];
  };
  var rt = function createScrollbarsSetup(r, a, n) {
    var t = Kr({});
    var e = t[0];
    var i = Qn(r, n), v = i[0], o = i[1], u = i[2];
    var f = e.bind(0);
    f.kr = v;
    f.Br = o;
    return [ function(r, n) {
      var t = Jr(a, r, n);
      console.log(t);
    }, f, function() {
      u();
    } ];
  };
  var at = new Set;
  var nt = new WeakMap;
  var tt = function addInstance(r, a) {
    nt.set(r, a);
    at.add(r);
  };
  var et = function removeInstance(r) {
    nt.delete(r);
    at.delete(r);
  };
  var it = function getInstance(r) {
    return nt.get(r);
  };
  var vt = function OverlayScrollbars(r, a, n) {
    var t = false;
    var e = ja(), i = e.k, v = e.I, o = e.j;
    var u = Ba();
    var f = w(r) ? r : r.target;
    var l = it(f);
    if (l) {
      return l;
    }
    var c = u[rn];
    var d = function validateOptions(r) {
      var a = r || {};
      var n = c && c.Y;
      return n ? n(a, true) : a;
    };
    var g = z({}, i(), d(a));
    var h = Xr(n), p = h[0], b = h[1], m = h[2];
    var y = Kn(r, g), S = y[0], C = y[1], O = y[2];
    var x = rt(r, g, C.kr), P = x[0], T = x[1], L = x[2];
    var I = function update(r, a) {
      S(r, a);
      P(r, a);
    };
    var D = o(I.bind(0, {}, true));
    var M = function destroy(r) {
      et(f);
      D();
      L();
      O();
      t = true;
      m("destroyed", [ R, !!r ]);
      b();
    };
    var R = {
      options: function options(r) {
        if (r) {
          var a = Ea(g, d(r));
          if (!A(a)) {
            z(g, a);
            I(a);
          }
        }
        return z({}, g);
      },
      on: p,
      off: function off(r, a) {
        r && a && b(r, a);
      },
      state: function state() {
        var r = C(), a = r.Or, n = r.Sr, e = r.Er, i = r.P, v = r.br;
        return z({}, {
          overflowAmount: a,
          overflowStyle: n,
          hasOverflow: e,
          padding: i,
          paddingAbsolute: v,
          destroyed: t
        });
      },
      elements: function elements() {
        var r = C.kr, a = r.Z, n = r.J, t = r.P, e = r.K, i = r.T;
        return z({}, {
          target: a,
          host: n,
          padding: t || e,
          viewport: e,
          content: i || e
        });
      },
      update: function update(r) {
        I({}, r);
        return R;
      },
      destroy: M.bind(0)
    };
    each(E(u), (function(r) {
      var a = u[r];
      if (s(a)) {
        a(OverlayScrollbars, R);
      }
    }));
    if (v.x && v.y && !g.nativeScrollbarsOverlaid.initialize) {
      M(true);
      return R;
    }
    C.Br();
    T.Br();
    tt(f, R);
    m("initialized", [ R ]);
    C.Hr((function(r, a, n) {
      var t = r.hr, e = r.wr, i = r.gr, v = r.Ar, o = r.zr, u = r.pr, f = r.Cr;
      m("updated", [ R, {
        updateHints: {
          sizeChanged: t,
          directionChanged: e,
          heightIntrinsicChanged: i,
          overflowAmountChanged: v,
          overflowStyleChanged: o,
          contentMutation: u,
          hostMutation: f
        },
        changedOptions: a,
        force: n
      } ]);
    }));
    return R.update(true);
  };
  vt.plugin = ka;
  vt.env = function() {
    var r = ja(), a = r.L, n = r.I, t = r.D, e = r.R, i = r.V, v = r.M, o = r.q, u = r.U, f = r.H, l = r.B, c = r.k, s = r.F;
    return z({}, {
      scrollbarsSize: a,
      scrollbarsOverlaid: n,
      scrollbarsHiding: t,
      rtlScrollBehavior: e,
      flexboxGlue: i,
      cssCustomProperties: v,
      defaultInitializationStrategy: o,
      defaultDefaultOptions: u,
      getInitializationStrategy: f,
      setInitializationStrategy: l,
      getDefaultOptions: c,
      setDefaultOptions: s
    });
  };
  r.OverlayScrollbars = vt;
  r.optionsValidationPlugin = an;
  r.scrollbarsHidingPlugin = sn;
  r.sizeObserverPlugin = un;
  Object.defineProperty(r, "v", {
    value: true
  });
}));
//# sourceMappingURL=overlayscrollbars.js.map
