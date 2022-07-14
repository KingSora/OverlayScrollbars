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
        t = e ? zr(r, i, a) : a.reduce((function(a, e) {
          a[e] = zr(r, i, e);
          return a;
        }), t);
      }
      return t;
    }
    each(E(a), (function(e) {
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
  var z = function assignDeep(r, a, e, n, t, i, v) {
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
  var T = function getSetProp(r, a, e, n) {
    if (v(n)) {
      return e ? e[r] : a;
    }
    e && (e[r] = n);
  };
  var P = function attr(r, a, e) {
    if (v(e)) {
      return r ? r.getAttribute(a) : null;
    }
    r && r.setAttribute(a, e);
  };
  var L = function attrClass(r, a, e, n) {
    var t = P(r, a) || "";
    var i = new Set(t.split(" "));
    i[n ? "add" : "delete"](e);
    P(r, a, S(i).join(" ").trim());
  };
  var I = function hasAttrClass(r, a, e) {
    var n = P(r, a) || "";
    var t = new Set(n.split(" "));
    return t.has(e);
  };
  var D = function removeAttr(r, a) {
    r && r.removeAttribute(a);
  };
  var M = function scrollLeft(r, a) {
    return T("scrollLeft", 0, r, a);
  };
  var R = function scrollTop(r, a) {
    return T("scrollTop", 0, r, a);
  };
  var H = Element.prototype;
  var V = function find(r, a) {
    var e = [];
    var n = a ? b(a) ? a : null : document;
    return n ? y(e, n.querySelectorAll(r)) : e;
  };
  var j = function findFirst(r, a) {
    var e = a ? b(a) ? a : null : document;
    return e ? e.querySelector(r) : null;
  };
  var B = function is(r, a) {
    if (b(r)) {
      var e = H.matches || H.msMatchesSelector;
      return e.call(r, a);
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
      var e = H.closest;
      if (e) {
        return e.call(r, a);
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
  var U = function liesBetween(r, a, e) {
    var n = r && q(r, a);
    var t = r && j(e, n);
    return n && t ? n === r || t === r || q(q(r, e), a) !== n : false;
  };
  var Y = function before(r, a, e) {
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
      P(a, "class", r);
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
  var er = {};
  var nr = {};
  var tr = function cssProperty(r) {
    var a = nr[r];
    if (x(nr, r)) {
      return a;
    }
    var e = Z(r);
    var n = Q();
    each(rr, (function(t) {
      var i = t.replace(/-/g, "");
      var v = [ r, t + r, i + e, Z(i) + e ];
      return !(a = v.find((function(r) {
        return void 0 !== n[r];
      })));
    }));
    return nr[r] = a || "";
  };
  var ir = function jsAPI(r) {
    var a = er[r] || window[r];
    if (x(er, r)) {
      return a;
    }
    each(ar, (function(e) {
      a = a || window[e + Z(r)];
      return !a;
    }));
    er[r] = a;
    return a;
  };
  var vr = ir("MutationObserver");
  var or = ir("IntersectionObserver");
  var ur = ir("ResizeObserver");
  var fr = ir("cancelAnimationFrame");
  var lr = ir("requestAnimationFrame");
  var cr = /[^\x20\t\r\n\f]+/g;
  var sr = function classListAction(r, a, e) {
    var n;
    var t = 0;
    var i = false;
    if (r && a && l(a)) {
      var v = a.match(cr) || [];
      i = v.length > 0;
      while (n = v[t++]) {
        i = !!e(r.classList, n) && i;
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
  var pr = function equal(r, a, e, n) {
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
  var _r = function equalWH(r, a) {
    return pr(r, a, [ "w", "h" ]);
  };
  var wr = function equalXY(r, a) {
    return pr(r, a, [ "x", "y" ]);
  };
  var br = function equalTRBL(r, a) {
    return pr(r, a, [ "t", "r", "b", "l" ]);
  };
  var mr = function equalBCRWH(r, a, e) {
    return pr(r, a, [ "width", "height" ], e && function(r) {
      return Math.round(r);
    });
  };
  var yr = function clearTimeouts(r) {
    r && clearTimeout(r);
    r && fr(r);
  };
  var Sr = function noop() {};
  var Cr = function debounce(r, a) {
    var e;
    var n;
    var t;
    var i;
    var v = a || {}, o = v.p, u = v._, l = v.m;
    var c = setTimeout;
    var d = function invokeFunctionToDebounce(a) {
      yr(e);
      yr(n);
      n = e = t = void 0;
      r.apply(this, a);
    };
    var g = function mergeParms(r) {
      return l && t ? l(t, r) : r;
    };
    var h = function flush() {
      if (e) {
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
        yr(e);
        e = w(y, a);
        if (p && !n) {
          n = c(h, l);
        }
        t = i = m;
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
    var e = a ? parseFloat(r) : parseInt(r, 10);
    return e === e ? e : 0;
  };
  var Er = function adaptCSSVal(r, a) {
    return !Or[r.toLowerCase()] && f(a) ? a + "px" : a;
  };
  var zr = function getCSSVal(r, a, e) {
    return null != a ? a[e] || a.getPropertyValue(e) : r.style[e];
  };
  var Ar = function setCSSVal(r, a, e) {
    try {
      if (r) {
        var n = r.style;
        if (!v(n[a])) {
          n[a] = Er(a, e);
        } else {
          n.setProperty(a, e);
        }
      }
    } catch (t) {}
  };
  var Tr = function topRightBottomLeft(r, a, e) {
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
  var Pr = {
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
    } : Pr;
  };
  var Dr = function clientSize(r) {
    return r ? {
      w: r.clientWidth,
      h: r.clientHeight
    } : Pr;
  };
  var Mr = function scrollSize(r) {
    return r ? {
      w: r.scrollWidth,
      h: r.scrollHeight
    } : Pr;
  };
  var Rr = function fractionalSize(r) {
    var a = parseFloat(style(r, "height")) || 0;
    var e = parseFloat(style(r, "height")) || 0;
    return {
      w: e - Math.round(e),
      h: a - Math.round(a)
    };
  };
  var Hr = function getBoundingClientRect(r) {
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
  var Br = function splitEventNames(r) {
    return r.split(" ");
  };
  var kr = function off(r, a, e, n) {
    each(Br(a), (function(a) {
      r.removeEventListener(a, e, n);
    }));
  };
  var Fr = function on(r, a, e, n) {
    var t;
    var i = jr();
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
      y(f, kr.bind(null, r, a, n, o));
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
  var Yr = function stopAndPrevent(r) {
    return qr(r) || Ur(r);
  };
  var Nr = {
    x: 0,
    y: 0
  };
  var Wr = function absoluteCoordinates(r) {
    var a = r ? Hr(r) : 0;
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
  var $r = function getPropByPath(r, a) {
    return r ? a.split(".").reduce((function(r, a) {
      return r && x(r, a) ? r[a] : void 0;
    }), r) : void 0;
  };
  var Jr = function createOptionCheck(r, a, e) {
    return function(n) {
      return [ $r(r, n), e || void 0 !== $r(a, n) ];
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
  var ea = aa + "-overflow-x";
  var na = aa + "-overflow-y";
  var ta = "overflowVisible";
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
  var Oa = ba + "-visible";
  var xa = ba + "-cornerless";
  var Ea = ba + "-interaction";
  var za = ba + "-auto-hidden";
  var Aa = function opsStringify(r) {
    return JSON.stringify(r, (function(r, a) {
      if (s(a)) {
        throw new Error;
      }
      return a;
    }));
  };
  var Ta = {
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
  var Pa = function getOptionsDiff(r, a) {
    var e = {};
    var n = E(a).concat(E(r));
    each(n, (function(n) {
      var t = r[n];
      var i = a[n];
      if (g(t) && g(i)) {
        z(e[n] = {}, getOptionsDiff(t, i));
      } else if (x(a, n) && i !== t) {
        var v = true;
        if (d(t) || d(i)) {
          try {
            if (Aa(t) === Aa(i)) {
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
  var La;
  var Ia = Math.abs, Da = Math.round;
  var Ma = function diffBiggerThanOne(r, a) {
    var e = Ia(r);
    var n = Ia(a);
    return !(e === n || e + 1 === n || e - 1 === n);
  };
  var Ra = function getNativeScrollbarSize(r, a, e) {
    N(r, a);
    var n = Dr(a);
    var t = Ir(a);
    var i = Rr(e);
    return {
      x: t.h - n.h + i.h,
      y: t.w - n.w + i.w
    };
  };
  var Ha = function getNativeScrollbarsHiding(r) {
    var a = false;
    var e = hr(r, la);
    try {
      a = "none" === style(r, tr("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (n) {}
    e();
    return a;
  };
  var Va = function getRtlScrollBehavior(r, a) {
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
  var ja = function getFlexboxGlue(r, a) {
    var e = hr(r, Qr);
    var n = Hr(r);
    var t = Hr(a);
    var i = mr(t, n, true);
    var v = hr(r, ra);
    var o = Hr(r);
    var u = Hr(a);
    var f = mr(u, o, true);
    e();
    v();
    return i && f;
  };
  var Ba = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var a = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / a;
  };
  var ka = function createEnvironment() {
    var r = document, e = r.body;
    var n = K('<div class="' + Zr + '"><div></div></div>');
    var t = n[0];
    var i = t.firstChild;
    var v = Xr(), o = v[0], u = v[2];
    var f = a({
      o: Ra(e, t, i),
      u: wr
    }), l = f[0], c = f[1];
    var s = c(), d = s[0];
    var g = Ha(t);
    var h = {
      x: 0 === d.x,
      y: 0 === d.y
    };
    var p = {
      T: !g,
      P: false
    };
    var w = z({}, Ta);
    var b = {
      L: d,
      I: h,
      D: g,
      M: "-1" === style(t, "zIndex"),
      R: Va(t, i),
      H: ja(t, i),
      V: function _addListener(r) {
        return o("_", r);
      },
      j: z.bind(0, {}, p),
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
    D(t, "style");
    $(t);
    if (!g && (!h.x || !h.y)) {
      var m = Lr();
      var y = Ba();
      window.addEventListener("resize", (function() {
        var r = Lr();
        var a = {
          w: r.w - m.w,
          h: r.h - m.h
        };
        if (0 === a.w && 0 === a.h) {
          return;
        }
        var n = {
          w: Ia(a.w),
          h: Ia(a.h)
        };
        var v = {
          w: Ia(Da(r.w / (m.w / 100))),
          h: Ia(Da(r.h / (m.h / 100)))
        };
        var o = Ba();
        var f = n.w > 2 && n.h > 2;
        var c = !Ma(v.w, v.h);
        var s = o !== y && y > 0;
        var d = f && c && s;
        if (d) {
          var g = l(Ra(e, t, i)), h = g[0], p = g[1];
          z(La.L, h);
          $(t);
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
  var Fa = function getEnvironment() {
    if (!La) {
      La = ka();
    }
    return La;
  };
  var qa = {};
  var Ua = function getPlugins() {
    return z({}, qa);
  };
  var Ya = function addPlugin(r) {
    return each(d(r) ? r : [ r ], (function(r) {
      each(E(r), (function(a) {
        qa[a] = r[a];
      }));
    }));
  };
  var Na = {
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
  })(Na);
  var Wa = getDefaultExportFromCjs(Na.exports);
  var Ga = {
    boolean: "__TPL_boolean_TYPE__",
    number: "__TPL_number_TYPE__",
    string: "__TPL_string_TYPE__",
    array: "__TPL_array_TYPE__",
    object: "__TPL_object_TYPE__",
    function: "__TPL_function_TYPE__",
    null: "__TPL_null_TYPE__"
  };
  var Xa = function validateRecursive(r, a, e, n) {
    var t = {};
    var i = Wa({}, a);
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
          each(Ga, (function(e, n) {
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
            m = Ga[O] === r;
          }
          y(C, e ? Ga.string : a);
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
  var $a = function validateOptions(r, a, e) {
    return Xa(r, a, e);
  };
  var Ja;
  var Ka = Ga.number;
  var Za = Ga.boolean;
  var Qa = [ Ga.array, Ga.null ];
  var re = "hidden scroll visible visible-hidden";
  var ae = "visible hidden auto";
  var ee = "never scroll leavemove";
  var ne = {
    paddingAbsolute: Za,
    updating: {
      elementEvents: Qa,
      attributes: Qa,
      debounce: [ Ga.number, Ga.array, Ga.null ],
      ignoreMutation: [ Ga.function, Ga.null ]
    },
    overflow: {
      x: re,
      y: re
    },
    scrollbars: {
      visibility: ae,
      autoHide: ee,
      autoHideDelay: Ka,
      dragScroll: Za,
      clickScroll: Za,
      touch: Za
    },
    nativeScrollbarsOverlaid: {
      show: Za,
      initialize: Za
    }
  };
  var te = "__osOptionsValidationPlugin";
  var ie = (Ja = {}, Ja[te] = {
    Y: function _(r, a) {
      var e = $a(ne, r, a), n = e[0], t = e[1];
      return Wa({}, t, n);
    }
  }, Ja);
  var ve;
  var oe = 3333333;
  var ue = "scroll";
  var fe = "__osSizeObserverPlugin";
  var le = (ve = {}, ve[fe] = {
    Y: function _(r, a, e) {
      var n = K('<div class="' + pa + '" dir="ltr"><div class="' + pa + '"><div class="' + _a + '"></div></div><div class="' + pa + '"><div class="' + _a + '" style="width: 200%; height: 200%"></div></div></div>');
      N(r, n);
      hr(r, ha);
      var t = n[0];
      var i = t.lastChild;
      var v = t.firstChild;
      var o = null == v ? void 0 : v.firstChild;
      var u = Ir(t);
      var f = u;
      var l = false;
      var c;
      var s = function reset() {
        M(v, oe);
        R(v, oe);
        M(i, oe);
        R(i, oe);
      };
      var d = function onResized(r) {
        c = 0;
        if (l) {
          u = f;
          a(true === r);
        }
      };
      var g = function onScroll(r) {
        f = Ir(t);
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
      var h = y([], [ Fr(v, ue, g), Fr(i, ue, g) ]);
      style(o, {
        width: oe,
        height: oe
      });
      s();
      return [ e ? g.bind(0, false) : s, h ];
    }
  }, ve);
  var ce;
  var se = 0;
  var de = "__osScrollbarsHidingPlugin";
  var ge = (ce = {}, ce[de] = {
    N: function _createUniqueViewportArrangeElement() {
      var r = Fa(), a = r.D, e = r.I, n = r.M;
      var t = !n && !a && (e.x || e.y);
      var i = t ? document.createElement("style") : false;
      if (i) {
        P(i, "id", ua + "-" + se);
        se++;
      }
      return i;
    },
    W: function _overflowUpdateSegment(r, a, e, n, t, i) {
      var v = Fa(), o = v.H;
      var u = function arrangeViewport(t, i, v, o) {
        if (r) {
          var u = n(), f = u.G;
          var l = t.X, c = t.$;
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
          if (e) {
            var C = e.sheet;
            if (C) {
              var O = C.cssRules;
              if (O) {
                if (!O.length) {
                  C.insertRule("#" + P(e, "id") + " + ." + ua + "::before {}", 0);
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
      var f = function undoViewportArrange(e, v, u) {
        if (r) {
          var f = u || t(e);
          var l = n(), c = l.G;
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
  }, ce);
  var he = function resolveInitialization(r, a) {
    return s(r) ? r.apply(0, a) : r;
  };
  var pe = function staticInitializationElement(r, a, e, n) {
    return he(n || he(e, r), r) || a.apply(0, r);
  };
  var _e = function dynamicInitializationElement(r, a, e, n) {
    var t = he(n, r);
    if (o(t) || v(t)) {
      t = he(e, r);
    }
    return true === t || o(t) || v(t) ? a.apply(0, r) : t;
  };
  var we = J.bind(0, "");
  var be = function unwrap(r) {
    N(F(r), k(r));
    $(r);
  };
  var me = function addDataAttrHost(r, a) {
    P(r, aa, a);
    return D.bind(0, r, aa);
  };
  var ye = function createStructureSetupElements(r) {
    var a = Fa(), e = a.j, n = a.D;
    var t = Ua()[de];
    var i = t && t.N;
    var v = e(), o = v.J, u = v.K, f = v.T, l = v.P;
    var c = w(r);
    var s = r;
    var d = c ? r : s.target;
    var g = B(d, "textarea");
    var h = !g && B(d, "body");
    var p = d.ownerDocument;
    var b = p.body;
    var S = p.defaultView;
    var C = !!ur && !g && n;
    var x = pe.bind(0, [ d ]);
    var z = _e.bind(0, [ d ]);
    var A = [ x(we, u, s.viewport), x(we, u), x(we) ].filter((function(r) {
      return !C ? r !== d : true;
    }))[0];
    var T = A === d;
    var P = {
      Z: d,
      J: g ? x(we, o, s.host) : d,
      K: A,
      T: !T && z(we, f, s.padding),
      P: !T && z(we, l, s.content),
      rr: !T && !n && i && i(),
      ar: S,
      er: p,
      nr: F(b),
      tr: b,
      ir: g,
      vr: h,
      ur: c,
      lr: T,
      cr: function _viewportHasClass(r, a) {
        return T ? I(A, aa, a) : dr(A, r);
      },
      sr: function _viewportAddRemoveClass(r, a, e) {
        return T ? L(A, aa, a, e) : (e ? hr : gr)(A, r);
      }
    };
    var M = E(P).reduce((function(r, a) {
      var e = P[a];
      return y(r, e && !F(e) ? e : false);
    }), []);
    var R = function elementIsGenerated(r) {
      return r ? m(M, r) > -1 : null;
    };
    var H = P.Z, V = P.J, j = P.T, q = P.K, U = P.P, Y = P.rr;
    var W = [];
    var J = g && R(V);
    var K = g ? H : k([ U, q, j, V, H ].find((function(r) {
      return false === R(r);
    })));
    var Z = U || q;
    var Q = function appendElements() {
      var r = me(V, T ? "viewport" : "host");
      var a = hr(j, va);
      var e = hr(q, !T && oa);
      var t = hr(U, fa);
      if (J) {
        X(H, V);
        y(W, (function() {
          X(V, H);
          $(V);
        }));
      }
      N(Z, K);
      N(V, j);
      N(j || V, !T && q);
      N(q, U);
      y(W, (function() {
        r();
        D(q, ea);
        D(q, na);
        if (R(U)) {
          be(U);
        }
        if (R(q)) {
          be(q);
        }
        if (R(j)) {
          be(j);
        }
        a();
        e();
        t();
      }));
      if (n && !T) {
        y(W, gr.bind(0, q, la));
      }
      if (Y) {
        G(q, Y);
        y(W, $.bind(0, Y));
      }
    };
    return [ P, Q, O.bind(0, W) ];
  };
  var Se = function createTrinsicUpdateSegment(r, a) {
    var e = r.P;
    var n = a[0];
    return function(r) {
      var a = Fa(), t = a.H;
      var i = n(), v = i.dr;
      var o = r.gr;
      var u = (e || !t) && o;
      if (u) {
        style(e, {
          height: v ? "" : "100%"
        });
      }
      return {
        hr: u,
        pr: u
      };
    };
  };
  var Ce = function createPaddingUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.J, v = r.T, o = r.K, u = r.lr;
    var f = a({
      u: br,
      o: Tr()
    }, Tr.bind(0, i, "padding", "")), l = f[0], c = f[1];
    return function(r, a, e) {
      var i = c(e), f = i[0], s = i[1];
      var d = Fa(), g = d.D, h = d.H;
      var p = n(), w = p._r;
      var b = r.hr, m = r.pr, y = r.wr;
      var S = a("paddingAbsolute"), C = S[0], O = S[1];
      var x = !h && m;
      if (b || s || x) {
        var E = l(e);
        f = E[0];
        s = E[1];
      }
      var A = !u && (O || y || s);
      if (A) {
        var T = !C || !v && !g;
        var P = f.r + f.l;
        var L = f.t + f.b;
        var I = {
          marginRight: T && !w ? -P : 0,
          marginBottom: T ? -L : 0,
          marginLeft: T && w ? -P : 0,
          top: T ? -f.t : 0,
          right: T ? w ? -f.r : "auto" : 0,
          left: T ? w ? "auto" : -f.l : 0,
          width: T ? "calc(100% + " + P + "px)" : ""
        };
        var D = {
          paddingTop: T ? f.t : 0,
          paddingRight: T ? f.r : 0,
          paddingBottom: T ? f.b : 0,
          paddingLeft: T ? f.l : 0
        };
        style(v || o, I);
        style(o, D);
        t({
          T: f,
          br: !T,
          G: v ? D : z({}, I, D)
        });
      }
      return {
        mr: A
      };
    };
  };
  var Oe = Math.max;
  var xe = Oe.bind(0, 0);
  var Ee = "visible";
  var ze = "hidden";
  var Ae = 42;
  var Te = {
    u: _r,
    o: {
      w: 0,
      h: 0
    }
  };
  var Pe = {
    u: wr,
    o: {
      x: ze,
      y: ze
    }
  };
  var Le = function getOverflowAmount(r, a) {
    var e = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
    var n = {
      w: xe(r.w - a.w),
      h: xe(r.h - a.h)
    };
    return {
      w: n.w > e ? n.w : 0,
      h: n.h > e ? n.h : 0
    };
  };
  var Ie = function conditionalClass(r, a, e) {
    return e ? hr(r, a) : gr(r, a);
  };
  var De = function overflowIsVisible(r) {
    return 0 === r.indexOf(Ee);
  };
  var Me = function createOverflowUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.J, v = r.T, o = r.K, u = r.rr, f = r.lr, l = r.sr;
    var c = Fa(), s = c.L, d = c.H, g = c.D, h = c.I;
    var p = Ua()[de];
    var w = !f && !g && (h.x || h.y);
    var b = a(Te, Rr.bind(0, o)), m = b[0], y = b[1];
    var S = a(Te, Mr.bind(0, o)), C = S[0], O = S[1];
    var x = a(Te), E = x[0], z = x[1];
    var A = a(Te), T = A[0], I = A[1];
    var D = a(Pe), M = D[0];
    var R = function fixFlexboxGlue(r, a) {
      style(o, {
        height: ""
      });
      if (a) {
        var e = n(), t = e.br, v = e.T;
        var u = r.yr, f = r.X;
        var l = Rr(i);
        var c = Dr(i);
        var s = "content-box" === style(o, "boxSizing");
        var d = t || s ? v.b + v.t : 0;
        var g = !(h.x && s);
        style(o, {
          height: c.h + l.h + (u.x && g ? f.x : 0) - d
        });
      }
    };
    var H = function getViewportOverflowState(r, a) {
      var e = !g && !r ? Ae : 0;
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
    var V = function setViewportOverflowState(r, a, e, n) {
      var t = function setAxisOverflowStyle(r, a) {
        var e = De(r);
        var n = a && e && r.replace(Ee + "-", "") || "";
        return [ a && !e ? r : "", De(n) ? "hidden" : n ];
      };
      var i = t(e.x, a.x), v = i[0], o = i[1];
      var u = t(e.y, a.y), f = u[0], l = u[1];
      n.overflowX = o && f ? o : v;
      n.overflowY = l && v ? l : f;
      return H(r, n);
    };
    var j = function hideNativeScrollbars(r, a, e, t) {
      var i = r.X, v = r.$;
      var o = v.x, u = v.y;
      var f = i.x, l = i.y;
      var c = n(), s = c.G;
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
    var B = p ? p.W(w, o, u, n, H, j) : [ function() {
      return w;
    }, function() {
      return [ Sr ];
    } ], k = B[0], F = B[1];
    return function(r, a, e) {
      var u = r.hr, c = r.Cr, s = r.pr, p = r.mr, w = r.gr, b = r.wr;
      var S = n(), x = S.dr, A = S._r;
      var D = a("nativeScrollbarsOverlaid.show"), B = D[0], q = D[1];
      var U = a("overflow"), Y = U[0], N = U[1];
      var W = B && h.x && h.y;
      var G = !f && !d && (u || s || c || q || w);
      var X = De(Y.x);
      var $ = De(Y.y);
      var J = X || $;
      var K = y(e);
      var Z = O(e);
      var Q = z(e);
      var rr = I(e);
      var ar;
      if (q && g) {
        l(la, ia, !W);
      }
      if (G) {
        ar = H(W);
        R(ar, x);
      }
      if (u || p || s || b || q) {
        if (J) {
          l(ca, ta, false);
        }
        var er = F(W, A, ar), nr = er[0], tr = er[1];
        var ir = K = m(e), vr = ir[0], or = ir[1];
        var ur = Z = C(e), fr = ur[0], lr = ur[1];
        var cr = Dr(o);
        var sr = fr;
        var dr = cr;
        nr();
        if ((lr || or || q) && tr && !W && k(tr, fr, vr, A)) {
          dr = Dr(o);
          sr = Mr(o);
        }
        var gr = {
          w: xe(Oe(fr.w, sr.w) + vr.w),
          h: xe(Oe(fr.h, sr.h) + vr.h)
        };
        var hr = {
          w: xe(dr.w + xe(cr.w - fr.w) + vr.w),
          h: xe(dr.h + xe(cr.h - fr.h) + vr.h)
        };
        rr = T(hr);
        Q = E(Le(gr, hr), e);
      }
      var pr = rr, _r = pr[0], wr = pr[1];
      var br = Q, mr = br[0], yr = br[1];
      var Sr = Z, Cr = Sr[0], Or = Sr[1];
      var xr = K, Er = xr[0], zr = xr[1];
      var Ar = {
        x: mr.w > 0,
        y: mr.h > 0
      };
      var Tr = X && $ && (Ar.x || Ar.y) || X && Ar.x && !Ar.y || $ && Ar.y && !Ar.x;
      if (p || b || zr || Or || wr || yr || N || q || G) {
        var Pr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Lr = V(W, Ar, Y, Pr);
        var Ir = k(Lr, Cr, Er, A);
        if (!f) {
          j(Lr, A, Ir, Pr);
        }
        if (G) {
          R(Lr, x);
        }
        if (f) {
          P(i, ea, Pr.overflowX);
          P(i, na, Pr.overflowY);
        } else {
          style(o, Pr);
        }
      }
      L(i, aa, ta, Tr);
      Ie(v, ca, Tr);
      !f && Ie(o, ca, J);
      var Rr = M(H(W).Sr), Hr = Rr[0], Vr = Rr[1];
      t({
        Sr: Hr,
        Or: {
          x: _r.w,
          y: _r.h
        },
        Er: {
          x: mr.w,
          y: mr.h
        },
        zr: Ar
      });
      return {
        Ar: Vr,
        Tr: wr,
        Pr: yr
      };
    };
  };
  var Re = function prepareUpdateHints(r, a, e) {
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
  var He = function createStructureSetupUpdate(r, a) {
    var e = r.K;
    var n = Fa(), t = n.D, i = n.I, v = n.H;
    var o = !t && (i.x || i.y);
    var u = [ Se(r, a), Ce(r, a), Me(r, a) ];
    return function(r, a, n) {
      var t = Re(z({
        hr: false,
        mr: false,
        wr: false,
        gr: false,
        Tr: false,
        Pr: false,
        Ar: false,
        Cr: false,
        pr: false
      }, a), {}, n);
      var i = o || !v;
      var l = i && M(e);
      var c = i && R(e);
      var s = t;
      each(u, (function(a) {
        s = Re(s, a(s, r, !!n) || {}, n);
      }));
      if (f(l)) {
        M(e, l);
      }
      if (f(c)) {
        R(e, c);
      }
      return s;
    };
  };
  var Ve = "animationstart";
  var je = "scroll";
  var Be = 3333333;
  var ke = function getElmDirectionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var Fe = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var qe = function createSizeObserver(r, e, n) {
    var t = n || {}, i = t.Lr, v = void 0 === i ? false : i, o = t.Ir, u = void 0 === o ? false : o;
    var f = Ua()[fe];
    var l = Fa(), s = l.R;
    var h = K('<div class="' + sa + '"><div class="' + ga + '"></div></div>');
    var p = h[0];
    var w = p.firstChild;
    var b = ke.bind(0, p);
    var m = a({
      o: void 0,
      g: true,
      u: function _equal(r, a) {
        return !(!r || !Fe(r) && Fe(a));
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
        var h = Fe(f);
        var w = Fe(l);
        t = !l || !h;
        i = !w && h;
        o = !t;
      } else if (n) {
        o = r[1];
      } else {
        i = true === r;
      }
      if (v && o) {
        var b = n ? r[0] : ke(p);
        M(p, b ? s.n ? -Be : s.i ? 0 : Be : Be);
        R(p, Be);
      }
      if (!t) {
        e({
          hr: !n,
          Dr: n ? r : void 0,
          Ir: !!i
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
      var T = f.Y(w, C, u), P = T[0], L = T[1];
      E = P;
      y(x, L);
    }
    if (v) {
      z = a({
        o: !b()
      }, b);
      var I = z, D = I[0];
      y(x, Fr(p, je, (function(r) {
        var a = D();
        var e = a[0], n = a[1];
        if (n) {
          gr(w, "ltr rtl");
          if (e) {
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
      y(x, Fr(p, Ve, E, {
        A: !!ur
      }));
    }
    W(r, p);
    return function() {
      O(x);
      $(p);
    };
  };
  var Ue = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var Ye = function createTrinsicObserver(r, e) {
    var n = J(wa);
    var t = [];
    var i = a({
      o: false
    }), v = i[0];
    var o = function triggerOnTrinsicChangedCallback(r) {
      if (r) {
        var a = v(Ue(r));
        var n = a[1];
        if (n) {
          e(a);
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
      u.observe(n);
      y(t, (function() {
        u.disconnect();
      }));
    } else {
      var f = function onSizeChanged() {
        var r = Ir(n);
        o(r);
      };
      y(t, qe(n, f));
      f();
    }
    W(r, n);
    return function() {
      O(t);
      $(n);
    };
  };
  var Ne = function createEventContentChange(r, a, e) {
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
  var We = function createDOMObserver(r, a, e, n) {
    var t = false;
    var i = n || {}, v = i.Mr, o = i.Rr, u = i.Hr, f = i.Vr, c = i.jr, s = i.Br;
    var d = Ne(r, Cr((function() {
      if (t) {
        e(true);
      }
    }), {
      p: 33,
      _: 99
    }), u), g = d[0], h = d[1];
    var p = v || [];
    var w = o || [];
    var b = p.concat(w);
    var S = function observerCallback(t) {
      var i = c || Sr;
      var v = s || Sr;
      var o = [];
      var u = [];
      var d = false;
      var g = false;
      var p = false;
      each(t, (function(e) {
        var t = e.attributeName, c = e.target, s = e.type, h = e.oldValue, b = e.addedNodes;
        var S = "attributes" === s;
        var C = "childList" === s;
        var O = r === c;
        var x = S && l(t) ? P(c, t) : 0;
        var E = 0 !== x && h !== x;
        var z = m(w, t) > -1 && E;
        if (a && !O) {
          var A = !S;
          var T = S && z;
          var L = T && f && B(c, f);
          var I = L ? !i(c, t, h, x) : A || T;
          var D = I && !v(e, !!L, r, n);
          y(u, b);
          g = g || D;
          p = p || C;
        }
        if (!a && O && E && !i(c, t, h, x)) {
          y(o, t);
          d = d || z;
        }
      }));
      if (p && !C(u)) {
        h((function(r) {
          return u.reduce((function(a, e) {
            y(a, V(r, e));
            return B(e, r) ? y(a, e) : a;
          }), []);
        }));
      }
      if (a) {
        g && e(false);
      } else if (!C(o) || d) {
        e(o, d);
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
    t = true;
    return [ function() {
      if (t) {
        g();
        O.disconnect();
        t = false;
      }
    }, function() {
      if (t) {
        S(O.takeRecords());
      }
    } ];
  };
  var Ge = "[" + aa + "]";
  var Xe = "." + oa;
  var $e = [ "tabindex" ];
  var Je = [ "wrap", "cols", "rows" ];
  var Ke = [ "id", "class", "style", "open" ];
  var Ze = function createStructureSetupObservers(r, e, n) {
    var t;
    var i;
    var v;
    var o = e[1];
    var u = r.J, c = r.K, g = r.P, h = r.ir, p = r.lr, w = r.cr, b = r.sr;
    var y = Fa(), S = y.D, C = y.H;
    var O = a({
      u: _r,
      o: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = w(ca, ta);
      r && b(ca, ta);
      var a = Mr(g);
      var e = Mr(c);
      var n = Rr(c);
      r && b(ca, ta, true);
      return {
        w: e.w + a.w + n.w,
        h: e.h + a.h + n.h
      };
    })), x = O[0];
    var z = h ? Je : Ke.concat(Je);
    var A = Cr(n, {
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
    var T = function updateViewportAttrsFromHost(r) {
      each(r || $e, (function(r) {
        if (m($e, r) > -1) {
          var a = P(u, r);
          if (l(a)) {
            P(c, r, a);
          } else {
            D(c, r);
          }
        }
      }));
    };
    var L = function onTrinsicChanged(r) {
      var a = r[0], e = r[1];
      o({
        dr: a
      });
      n({
        gr: e
      });
    };
    var I = function onSizeChanged(r) {
      var a = r.hr, e = r.Dr, t = r.Ir;
      var i = !a || t ? n : A;
      var v = false;
      if (e) {
        var u = e[0], f = e[1];
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
      var a = x(), e = a[1];
      var t = r ? n : A;
      if (e) {
        t({
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
        T(r);
      }
    };
    var H = (g || !C) && Ye(u, L);
    var V = !p && qe(u, I, {
      Ir: true,
      Lr: !S
    });
    var j = We(u, false, R, {
      Rr: Ke,
      Mr: Ke.concat($e)
    }), B = j[0];
    var k = p && new ur(I.bind(0, {
      hr: true
    }));
    k && k.observe(u);
    T();
    return [ function(r) {
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
        v = We(g || c, true, M, {
          Rr: z.concat(o || []),
          Mr: z.concat(o || []),
          Hr: h,
          Vr: Ge,
          Br: function _ignoreContentChange(r, a) {
            var e = r.target, n = r.attributeName;
            var t = !a && n ? U(e, Ge, Xe) : false;
            return t || !!S(r);
          }
        });
      }
      if (m) {
        A.S();
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
    }, function() {
      v && v[0]();
      H && H();
      V && V();
      k && k.disconnect();
      B();
    } ];
  };
  var Qe = {
    x: 0,
    y: 0
  };
  var rn = {
    T: {
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
    Or: Qe,
    Er: Qe,
    Sr: {
      x: "hidden",
      y: "hidden"
    },
    zr: {
      x: false,
      y: false
    },
    dr: false,
    _r: false
  };
  var an = function createStructureSetup(r, a) {
    var e = Jr(a, {});
    var n = Kr(rn);
    var t = Xr(), i = t[0], v = t[1], o = t[2];
    var u = n[0];
    var f = ye(r), l = f[0], c = f[1], s = f[2];
    var d = He(l, n);
    var g = Ze(l, n, (function(r) {
      o("u", [ d(e, r), {}, false ]);
    })), h = g[0], p = g[1];
    var w = u.bind(0);
    w.kr = function(r) {
      i("u", r);
    };
    w.Fr = c;
    w.qr = l;
    return [ function(r, e) {
      var n = Jr(a, r, e);
      h(n);
      o("u", [ d(n, {}, e), r, !!e ]);
    }, w, function() {
      v();
      p();
      s();
    } ];
  };
  var en = "touchstart mouseenter";
  var nn = "touchend touchcancel mouseleave";
  var tn = function createScrollbarsSetupElements(r, a) {
    var e = Fa(), n = e.j;
    var t = n(), i = t.Ur;
    var v = a.Z, o = a.J, u = a.K, f = a.ur;
    var l = !f && r.scrollbarsSlot;
    var c = _e([ v, o, u ], (function() {
      return o;
    }), i, l);
    var s = function scrollbarsAddRemoveClass(r, a, e) {
      var n = e ? hr : gr;
      each(r, (function(r) {
        n(r.Yr, a);
      }));
    };
    var d = [];
    var g = [];
    var h = [];
    var p = s.bind(0, g);
    var w = s.bind(0, h);
    var b = function generateScrollbarDOM(r) {
      var a = r ? ma : ya;
      var e = r ? g : h;
      var n = J(ba + " " + a + " os-theme-dark");
      var t = J(Sa);
      var i = J(Ca);
      var v = {
        Yr: n,
        Nr: t,
        Wr: i
      };
      N(n, t);
      N(t, i);
      y(d, $.bind(0, n));
      y(e, v);
      y(d, Fr(n, en, (function() {
        p(Ea, true);
        w(Ea, true);
      })));
      y(d, Fr(n, nn, (function() {
        p(Ea);
        w(Ea);
      })));
      return v;
    };
    var m = b.bind(0, true);
    var S = b.bind(0, false);
    var C = function appendElements() {
      N(c, g[0].Yr);
      N(c, h[0].Yr);
    };
    m();
    S();
    return [ {
      Gr: {
        Xr: g,
        $r: m,
        Jr: p
      },
      Kr: {
        Xr: h,
        $r: S,
        Jr: w
      }
    }, C, O.bind(0, d) ];
  };
  var vn = function createSelfCancelTimeout(r) {
    var a;
    var e = r ? window.setTimeout : lr;
    var n = r ? window.clearTimeout : fr;
    return [ function(t) {
      n(a);
      a = e(t, s(r) ? r() : r);
    }, function() {
      return n(a);
    } ];
  };
  var un = function createScrollbarsSetup(r, a, e) {
    var n = 0;
    var t;
    var i;
    var v;
    var o;
    var u = Kr({});
    var f = u[0];
    var l = vn(), c = l[0], s = l[1];
    var d = vn(), g = d[0], h = d[1];
    var p = vn(100), w = p[0], b = p[1];
    var m = vn(100), y = m[0], S = m[1];
    var C = vn((function() {
      return n;
    })), x = C[0], E = C[1];
    var z = tn(r, e.qr), A = z[0], T = z[1], P = z[2];
    var L = A.Gr, I = A.Kr;
    var D = L.Jr;
    var M = I.Jr;
    var R = function manageScrollbarsAutoHide(r, a) {
      E();
      if (r) {
        D(za);
        M(za);
      } else {
        var e = function hide() {
          D(za, true);
          M(za, true);
        };
        if (n > 0 && !a) {
          x(e);
        } else {
          e();
        }
      }
    };
    var H = [ b, E, S, h, s, P, Fr(e.qr.J, "mouseenter", (function() {
      o = true;
      i && R(true);
    })), Fr(e.qr.J, "mouseleave", (function() {
      o = false;
      i && R(false);
    })), Fr(e.qr.J, "mousemove", (function() {
      t && c((function() {
        b();
        R(true);
        y((function() {
          t && R(false);
        }));
      }));
    })), Fr(e.qr.K, "scroll", (function() {
      v && g((function() {
        R(true);
        w((function() {
          v && !o && R(false);
        }));
      }));
    })) ];
    var V = f.bind(0);
    V.qr = A;
    V.Fr = T;
    return [ function(r, o, u) {
      var f = u.Ar;
      var l = Jr(a, r, o);
      var c = l("scrollbars.visibility"), s = c[0], d = c[1];
      var g = l("scrollbars.autoHide"), h = g[0], p = g[1];
      var w = l("scrollbars.autoHideDelay"), b = w[0];
      l("scrollbars.dragScrolling");
      l("scrollbars.touchSupport");
      var m = f || d;
      var y = function setScrollbarVisibility(r, a) {
        var e = "visible" === s || "auto" === s && "scroll" === r;
        a(Oa, e);
        return e;
      };
      n = b;
      if (m) {
        var S = e(), C = S.Sr;
        var O = y(C.x, D);
        var x = y(C.y, M);
        var E = O && x;
        D(xa, !E);
        M(xa, !E);
      }
      if (p) {
        t = "move" === h;
        i = "leave" === h;
        v = "never" !== h;
        R(!v, true);
      }
    }, V, O.bind(0, H) ];
  };
  var fn = new Set;
  var ln = new WeakMap;
  var cn = function addInstance(r, a) {
    ln.set(r, a);
    fn.add(r);
  };
  var sn = function removeInstance(r) {
    ln.delete(r);
    fn.delete(r);
  };
  var dn = function getInstance(r) {
    return ln.get(r);
  };
  var gn = function OverlayScrollbars(r, a, e) {
    var n = false;
    var t = Fa(), i = t.k, v = t.I, o = t.V;
    var u = Ua();
    var f = w(r) ? r : r.target;
    var l = dn(f);
    if (l) {
      return l;
    }
    var c = u[te];
    var d = function validateOptions(r) {
      var a = r || {};
      var e = c && c.Y;
      return e ? e(a, true) : a;
    };
    var g = z({}, i(), d(a));
    var h = Xr(e), p = h[0], b = h[1], m = h[2];
    var y = an(r, g), S = y[0], C = y[1], O = y[2];
    var x = un(r, g, C), T = x[0], P = x[1], L = x[2];
    var I = function update(r, a) {
      S(r, !!a);
    };
    var D = o(I.bind(0, {}, true));
    var M = function destroy(r) {
      sn(f);
      D();
      L();
      O();
      n = true;
      m("destroyed", [ R, !!r ]);
      b();
    };
    var R = {
      options: function options(r) {
        if (r) {
          var a = Pa(g, d(r));
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
        var r = C(), a = r.Or, e = r.Er, t = r.Sr, i = r.zr, v = r.T, o = r.br;
        return z({}, {
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
        var r = C.qr, a = r.Z, e = r.J, n = r.T, t = r.K, i = r.P;
        return z({}, {
          target: a,
          host: e,
          padding: n || t,
          viewport: t,
          content: i || t
        });
      },
      update: function update(r) {
        I({}, r);
        return R;
      },
      destroy: M.bind(0)
    };
    C.kr((function(r, a, e) {
      T(a, e, r);
    }));
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
    C.Fr();
    P.Fr();
    cn(f, R);
    m("initialized", [ R ]);
    C.kr((function(r, a, e) {
      var n = r.hr, t = r.wr, i = r.gr, v = r.Tr, o = r.Pr, u = r.Ar, f = r.pr, l = r.Cr;
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
  gn.plugin = Ya;
  gn.env = function() {
    var r = Fa(), a = r.L, e = r.I, n = r.D, t = r.R, i = r.H, v = r.M, o = r.q, u = r.U, f = r.j, l = r.B, c = r.k, s = r.F;
    return z({}, {
      scrollbarsSize: a,
      scrollbarsOverlaid: e,
      scrollbarsHiding: n,
      rtlScrollBehavior: t,
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
  r.OverlayScrollbars = gn;
  r.optionsValidationPlugin = ie;
  r.scrollbarsHidingPlugin = ge;
  r.sizeObserverPlugin = le;
  Object.defineProperty(r, "v", {
    value: true
  });
}));
//# sourceMappingURL=overlayscrollbars.js.map
