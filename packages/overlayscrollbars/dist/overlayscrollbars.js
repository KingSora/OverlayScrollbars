(function(r, a) {
  "object" === typeof exports && "undefined" !== typeof module ? module.exports = a() : "function" === typeof define && define.amd ? define(a) : (r = "undefined" !== typeof globalThis ? globalThis : r || self, 
  r.OverlayScrollbars = a());
})(this, (function() {
  "use strict";
  function createCache(r, a) {
    var e = r.v, n = r.o, t = r.u;
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
  }
  function isUndefined(r) {
    return void 0 === r;
  }
  function isNull(r) {
    return null === r;
  }
  function isNumber(r) {
    return "number" === typeof r;
  }
  function isString(r) {
    return "string" === typeof r;
  }
  function isBoolean(r) {
    return "boolean" === typeof r;
  }
  function isFunction(r) {
    return "function" === typeof r;
  }
  function isArray(r) {
    return Array.isArray(r);
  }
  function isObject(r) {
    return "object" === typeof r && !isArray(r) && !isNull(r);
  }
  function isArrayLike(r) {
    var a = !!r && r.length;
    var e = isNumber(a) && a > -1 && a % 1 == 0;
    return isArray(r) || !isFunction(r) && e ? a > 0 && isObject(r) ? a - 1 in r : true : false;
  }
  function isPlainObject(r) {
    if (!r || !isObject(r) || "object" !== t(r)) {
      return false;
    }
    var a;
    var e = "constructor";
    var i = r[e];
    var v = i && i.prototype;
    var o = n.call(r, e);
    var u = v && n.call(v, "isPrototypeOf");
    if (i && !o && !u) {
      return false;
    }
    for (a in r) {}
    return isUndefined(a) || n.call(r, a);
  }
  function isHTMLElement(a) {
    var e = window.HTMLElement;
    return a ? e ? a instanceof e : a.nodeType === r : false;
  }
  function isElement(a) {
    var e = window.Element;
    return a ? e ? a instanceof e : a.nodeType === r : false;
  }
  function each(r, a) {
    if (isArrayLike(r)) {
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
  function assignDeep(r, a, e, n, t, i, v) {
    var o = [ a, e, n, t, i, v ];
    if (("object" !== typeof r || isNull(r)) && !isFunction(r)) {
      r = {};
    }
    each(o, (function(a) {
      each(c(a), (function(e) {
        var n = a[e];
        if (r === n) {
          return true;
        }
        var t = isArray(n);
        if (n && (isPlainObject(n) || t)) {
          var i = r[e];
          var v = i;
          if (t && !isArray(i)) {
            v = [];
          } else if (!t && !isPlainObject(i)) {
            v = {};
          }
          r[e] = assignDeep(v, n);
        } else {
          r[e] = n;
        }
      }));
    }));
    return r;
  }
  function isEmptyObject(r) {
    for (var a in r) {
      return false;
    }
    return true;
  }
  function getSetProp(r, a, e, n) {
    if (isUndefined(n)) {
      return e ? e[r] : a;
    }
    e && (e[r] = n);
  }
  function attr(r, a, e) {
    if (isUndefined(e)) {
      return r ? r.getAttribute(a) : null;
    }
    r && r.setAttribute(a, e);
  }
  function scrollLeft(r, a) {
    return getSetProp("scrollLeft", 0, r, a);
  }
  function scrollTop(r, a) {
    return getSetProp("scrollTop", 0, r, a);
  }
  function style(r, a) {
    var e = isString(a);
    var n = isArray(a) || e;
    if (n) {
      var t = e ? "" : {};
      if (r) {
        var i = window.getComputedStyle(r, null);
        t = e ? vr(r, i, a) : a.reduce((function(a, e) {
          a[e] = vr(r, i, e);
          return a;
        }), t);
      }
      return t;
    }
    each(c(a), (function(e) {
      return or(r, e, a[e]);
    }));
  }
  var r = Node.ELEMENT_NODE;
  var a = Object.prototype, e = a.toString, n = a.hasOwnProperty;
  var t = function type(r) {
    return isUndefined(r) || isNull(r) ? "" + r : e.call(r).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
  };
  var i = function indexOf(r, a, e) {
    return r.indexOf(a, e);
  };
  var v = function push(r, a, e) {
    !e && !isString(a) && isArrayLike(a) ? Array.prototype.push.apply(r, a) : r.push(a);
    return r;
  };
  var o = function from(r) {
    if (Array.from && r) {
      return Array.from(r);
    }
    var a = [];
    if (r instanceof Set) {
      r.forEach((function(r) {
        v(a, r);
      }));
    } else {
      each(r, (function(r) {
        v(a, r);
      }));
    }
    return a;
  };
  var u = function isEmptyArray(r) {
    return !!r && 0 === r.length;
  };
  var f = function runEachAndClear(r, a, e) {
    var n = function runFn(r) {
      return r && r.apply(void 0, a || []);
    };
    if (r instanceof Set) {
      r.forEach(n);
      !e && r.clear();
    } else {
      each(r, n);
      !e && r.splice && r.splice(0, r.length);
    }
  };
  var s = function hasOwnProperty(r, a) {
    return Object.prototype.hasOwnProperty.call(r, a);
  };
  var c = function keys(r) {
    return r ? Object.keys(r) : [];
  };
  var l = function attrClass(r, a, e, n) {
    var t = attr(r, a) || "";
    var i = new Set(t.split(" "));
    i[n ? "add" : "delete"](e);
    attr(r, a, o(i).join(" ").trim());
  };
  var d = function hasAttrClass(r, a, e) {
    var n = attr(r, a) || "";
    var t = new Set(n.split(" "));
    return t.has(e);
  };
  var g = function removeAttr(r, a) {
    r && r.removeAttribute(a);
  };
  var p = Element.prototype;
  var h = function find(r, a) {
    var e = [];
    var n = a ? isElement(a) ? a : null : document;
    return n ? v(e, n.querySelectorAll(r)) : e;
  };
  var w = function findFirst(r, a) {
    var e = a ? isElement(a) ? a : null : document;
    return e ? e.querySelector(r) : null;
  };
  var m = function is(r, a) {
    if (isElement(r)) {
      var e = p.matches || p.msMatchesSelector;
      return e.call(r, a);
    }
    return false;
  };
  var y = function contents(r) {
    return r ? o(r.childNodes) : [];
  };
  var b = function parent(r) {
    return r ? r.parentElement : null;
  };
  var _ = function closest(r, a) {
    if (isElement(r)) {
      var e = p.closest;
      if (e) {
        return e.call(r, a);
      }
      do {
        if (m(r, a)) {
          return r;
        }
        r = b(r);
      } while (r);
    }
    return null;
  };
  var S = function liesBetween(r, a, e) {
    var n = r && _(r, a);
    var t = r && w(e, n);
    return n && t ? n === r || t === r || _(_(r, e), a) !== n : false;
  };
  var C = function before(r, a, e) {
    if (e) {
      var n = a;
      var t;
      if (r) {
        if (isArrayLike(e)) {
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
  var O = function appendChildren(r, a) {
    C(r, null, a);
  };
  var A = function prependChildren(r, a) {
    C(r, r && r.firstChild, a);
  };
  var x = function insertBefore(r, a) {
    C(b(r), r, a);
  };
  var D = function insertAfter(r, a) {
    C(b(r), r && r.nextSibling, a);
  };
  var E = function removeElements(r) {
    if (isArrayLike(r)) {
      each(o(r), (function(r) {
        return removeElements(r);
      }));
    } else if (r) {
      var a = b(r);
      if (a) {
        a.removeChild(r);
      }
    }
  };
  var z = function createDiv(r) {
    var a = document.createElement("div");
    if (r) {
      attr(a, "class", r);
    }
    return a;
  };
  var L = function createDOM(r) {
    var a = z();
    a.innerHTML = r.trim();
    return each(y(a), (function(r) {
      return E(r);
    }));
  };
  var I = function firstLetterToUpper(r) {
    return r.charAt(0).toUpperCase() + r.slice(1);
  };
  var M = function getDummyStyle() {
    return z().style;
  };
  var P = [ "-webkit-", "-moz-", "-o-", "-ms-" ];
  var T = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ];
  var N = {};
  var R = {};
  var F = function cssProperty(r) {
    var a = R[r];
    if (s(R, r)) {
      return a;
    }
    var e = I(r);
    var n = M();
    each(P, (function(t) {
      var i = t.replace(/-/g, "");
      var v = [ r, t + r, i + e, I(i) + e ];
      return !(a = v.find((function(r) {
        return void 0 !== n[r];
      })));
    }));
    return R[r] = a || "";
  };
  var j = function jsAPI(r) {
    var a = N[r] || window[r];
    if (s(N, r)) {
      return a;
    }
    each(T, (function(e) {
      a = a || window[e + I(r)];
      return !a;
    }));
    N[r] = a;
    return a;
  };
  var V = j("MutationObserver");
  var B = j("IntersectionObserver");
  var k = j("ResizeObserver");
  var H = j("cancelAnimationFrame");
  var U = j("requestAnimationFrame");
  var q = /[^\x20\t\r\n\f]+/g;
  var W = function classListAction(r, a, e) {
    var n;
    var t = 0;
    var i = false;
    if (r && a && isString(a)) {
      var v = a.match(q) || [];
      i = v.length > 0;
      while (n = v[t++]) {
        i = !!e(r.classList, n) && i;
      }
    }
    return i;
  };
  var G = function hasClass(r, a) {
    return W(r, a, (function(r, a) {
      return r.contains(a);
    }));
  };
  var X = function removeClass(r, a) {
    W(r, a, (function(r, a) {
      return r.remove(a);
    }));
  };
  var Y = function addClass(r, a) {
    W(r, a, (function(r, a) {
      return r.add(a);
    }));
    return X.bind(0, r, a);
  };
  var $ = function equal(r, a, e, n) {
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
  var J = function equalWH(r, a) {
    return $(r, a, [ "w", "h" ]);
  };
  var K = function equalXY(r, a) {
    return $(r, a, [ "x", "y" ]);
  };
  var Z = function equalTRBL(r, a) {
    return $(r, a, [ "t", "r", "b", "l" ]);
  };
  var Q = function equalBCRWH(r, a, e) {
    return $(r, a, [ "width", "height" ], e && function(r) {
      return Math.round(r);
    });
  };
  var rr = function clearTimeouts(r) {
    r && window.clearTimeout(r);
    r && H(r);
  };
  var ar = function noop() {};
  var er = function debounce(r, a) {
    var e;
    var n;
    var t;
    var i;
    var v = a || {}, u = v.g, f = v.p, s = v.m;
    var c = window.setTimeout;
    var l = function invokeFunctionToDebounce(a) {
      rr(e);
      rr(n);
      n = e = t = void 0;
      r.apply(this, a);
    };
    var d = function mergeParms(r) {
      return s && t ? s(t, r) : r;
    };
    var g = function flush() {
      if (e) {
        l(d(i) || i);
      }
    };
    var p = function debouncedFn() {
      var r = o(arguments);
      var a = isFunction(u) ? u() : u;
      var v = isNumber(a) && a >= 0;
      if (v) {
        var s = isFunction(f) ? f() : f;
        var p = isNumber(s) && s >= 0;
        var h = a > 0 ? c : U;
        var w = d(r);
        var m = w || r;
        var y = l.bind(0, m);
        rr(e);
        e = h(y, a);
        if (p && !n) {
          n = c(g, s);
        }
        t = i = m;
      } else {
        l(r);
      }
    };
    p._ = g;
    return p;
  };
  var nr = {
    opacity: 1,
    zindex: 1
  };
  var tr = function parseToZeroOrNumber(r, a) {
    var e = a ? parseFloat(r) : parseInt(r, 10);
    return Number.isNaN(e) ? 0 : e;
  };
  var ir = function adaptCSSVal(r, a) {
    return !nr[r.toLowerCase()] && isNumber(a) ? a + "px" : a;
  };
  var vr = function getCSSVal(r, a, e) {
    return null != a ? a[e] || a.getPropertyValue(e) : r.style[e];
  };
  var or = function setCSSVal(r, a, e) {
    try {
      if (r) {
        var n = r.style;
        if (!isUndefined(n[a])) {
          n[a] = ir(a, e);
        } else {
          n.setProperty(a, e);
        }
      }
    } catch (t) {}
  };
  var ur = function topRightBottomLeft(r, a, e) {
    var n = a ? a + "-" : "";
    var t = e ? "-" + e : "";
    var i = n + "top" + t;
    var v = n + "right" + t;
    var o = n + "bottom" + t;
    var u = n + "left" + t;
    var f = style(r, [ i, v, o, u ]);
    return {
      t: tr(f[i]),
      r: tr(f[v]),
      b: tr(f[o]),
      l: tr(f[u])
    };
  };
  var fr = {
    w: 0,
    h: 0
  };
  var sr = function windowSize() {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    };
  };
  var cr = function offsetSize(r) {
    return r ? {
      w: r.offsetWidth,
      h: r.offsetHeight
    } : fr;
  };
  var lr = function clientSize(r) {
    return r ? {
      w: r.clientWidth,
      h: r.clientHeight
    } : fr;
  };
  var dr = function scrollSize(r) {
    return r ? {
      w: r.scrollWidth,
      h: r.scrollHeight
    } : fr;
  };
  var gr = function fractionalSize(r) {
    var a = parseFloat(style(r, "height")) || 0;
    var e = parseFloat(style(r, "height")) || 0;
    return {
      w: e - Math.round(e),
      h: a - Math.round(a)
    };
  };
  var pr = function getBoundingClientRect(r) {
    return r.getBoundingClientRect();
  };
  var hr;
  var wr = function supportPassiveEvents() {
    if (isUndefined(hr)) {
      hr = false;
      try {
        window.addEventListener("test", null, Object.defineProperty({}, "passive", {
          get: function get() {
            hr = true;
          }
        }));
      } catch (r) {}
    }
    return hr;
  };
  var mr = function splitEventNames(r) {
    return r.split(" ");
  };
  var yr = function off(r, a, e, n) {
    each(mr(a), (function(a) {
      r.removeEventListener(a, e, n);
    }));
  };
  var br = function on(r, a, e, n) {
    var t = wr();
    var i = t && n && n.S || false;
    var o = n && n.C || false;
    var u = n && n.O || false;
    var s = [];
    var c = t ? {
      passive: i,
      capture: o
    } : o;
    each(mr(a), (function(a) {
      var n = u ? function(t) {
        r.removeEventListener(a, n, o);
        e && e(t);
      } : e;
      v(s, yr.bind(null, r, a, n, o));
      r.addEventListener(a, n, c);
    }));
    return f.bind(0, s);
  };
  var _r = function stopPropagation(r) {
    return r.stopPropagation();
  };
  var Sr = function preventDefault(r) {
    return r.preventDefault();
  };
  var Cr = function stopAndPrevent(r) {
    return _r(r) || Sr(r);
  };
  var Or = {
    x: 0,
    y: 0
  };
  var Ar = function absoluteCoordinates(r) {
    var a = r ? pr(r) : 0;
    return a ? {
      x: a.left + window.pageYOffset,
      y: a.top + window.pageXOffset
    } : Or;
  };
  var xr = function manageListener(r, a) {
    each(isArray(a) ? a : [ a ], r);
  };
  var Dr = function createEventListenerHub(r) {
    function removeEvent(r, e) {
      if (r) {
        var n = a.get(r);
        xr((function(r) {
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
    }
    function addEvent(r, e) {
      var n = a.get(r) || new Set;
      a.set(r, n);
      xr((function(r) {
        r && n.add(r);
      }), e);
      return removeEvent.bind(0, r, e);
    }
    function triggerEvent(r, e) {
      var n = a.get(r);
      each(o(n), (function(r) {
        if (e && !u(e)) {
          r.apply(0, e);
        } else {
          r();
        }
      }));
    }
    var a = new Map;
    var e = c(r);
    each(e, (function(a) {
      addEvent(a, r[a]);
    }));
    return [ addEvent, removeEvent, triggerEvent ];
  };
  var Er = function getPropByPath(r, a) {
    return r ? a.split(".").reduce((function(r, a) {
      return r && s(r, a) ? r[a] : void 0;
    }), r) : void 0;
  };
  var zr = function createOptionCheck(r, a, e) {
    return function(n) {
      return [ Er(r, n), e || void 0 !== Er(a, n) ];
    };
  };
  var Lr = function createState(r) {
    var a = r;
    return [ function() {
      return a;
    }, function(r) {
      a = assignDeep({}, a, r);
    } ];
  };
  var Ir = "os-environment";
  var Mr = Ir + "-flexbox-glue";
  var Pr = Mr + "-max";
  var Tr = "data-overlayscrollbars";
  var Nr = Tr + "-overflow-x";
  var Rr = Tr + "-overflow-y";
  var Fr = "overflowVisible";
  var jr = "viewportStyled";
  var Vr = "os-padding";
  var Br = "os-viewport";
  var kr = Br + "-arrange";
  var Hr = "os-content";
  var Ur = Br + "-scrollbar-styled";
  var qr = "os-overflow-visible";
  var Wr = "os-size-observer";
  var Gr = Wr + "-appear";
  var Xr = Wr + "-listener";
  var Yr = "os-trinsic-observer";
  var $r = "os-scrollbar";
  var Jr = $r + "-horizontal";
  var Kr = $r + "-vertical";
  var Zr = "os-scrollbar-track";
  var Qr = "os-scrollbar-handle";
  var ra = function opsStringify(r) {
    return JSON.stringify(r, (function(r, a) {
      if (isFunction(a)) {
        throw new Error;
      }
      return a;
    }));
  };
  var aa = {
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
  var ea = function getOptionsDiff(r, a) {
    var e = {};
    var n = c(a).concat(c(r));
    each(n, (function(n) {
      var t = r[n];
      var i = a[n];
      if (isObject(t) && isObject(i)) {
        assignDeep(e[n] = {}, getOptionsDiff(t, i));
      } else if (s(a, n) && i !== t) {
        var v = true;
        if (isArray(t) || isArray(i)) {
          try {
            if (ra(t) === ra(i)) {
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
  var na;
  var ta = Math.abs, ia = Math.round;
  var va = function diffBiggerThanOne(r, a) {
    var e = ta(r);
    var n = ta(a);
    return !(e === n || e + 1 === n || e - 1 === n);
  };
  var oa = function getNativeScrollbarSize(r, a, e) {
    O(r, a);
    var n = lr(a);
    var t = cr(a);
    var i = gr(e);
    return {
      x: t.h - n.h + i.h,
      y: t.w - n.w + i.w
    };
  };
  var ua = function getNativeScrollbarStyling(r) {
    var a = false;
    var e = Y(r, Ur);
    try {
      a = "none" === style(r, F("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (n) {}
    e();
    return a;
  };
  var fa = function getRtlScrollBehavior(r, a) {
    var e = "hidden";
    style(r, {
      overflowX: e,
      overflowY: e,
      direction: "rtl"
    });
    scrollLeft(r, 0);
    var n = Ar(r);
    var t = Ar(a);
    scrollLeft(r, -999);
    var i = Ar(a);
    return {
      i: n.x === t.x,
      n: t.x !== i.x
    };
  };
  var sa = function getFlexboxGlue(r, a) {
    var e = Y(r, Mr);
    var n = pr(r);
    var t = pr(a);
    var i = Q(t, n, true);
    var v = Y(r, Pr);
    var o = pr(r);
    var u = pr(a);
    var f = Q(u, o, true);
    e();
    v();
    return i && f;
  };
  var ca = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var a = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / a;
  };
  var la = function createEnvironment() {
    var r = document, a = r.body;
    var e = L('<div class="' + Ir + '"><div></div></div>');
    var n = e[0];
    var t = n.firstChild;
    var i = Dr(), v = i[0], o = i[2];
    var u = createCache({
      v: oa(a, n, t),
      o: K
    }), f = u[0], s = u[1];
    var c = s(), l = c[0];
    var d = ua(n);
    var p = {
      x: 0 === l.x,
      y: 0 === l.y
    };
    var h = {
      A: !d,
      D: false
    };
    var w = assignDeep({}, aa);
    var m = {
      L: l,
      I: p,
      M: d,
      P: "-1" === style(n, "zIndex"),
      T: fa(n, t),
      N: sa(n, t),
      R: function _addListener(r) {
        return v("_", r);
      },
      F: assignDeep.bind(0, {}, h),
      j: function _setInitializationStrategy(r) {
        assignDeep(h, r);
      },
      V: assignDeep.bind(0, {}, w),
      B: function _setDefaultOptions(r) {
        assignDeep(w, r);
      },
      k: assignDeep({}, h),
      H: assignDeep({}, w)
    };
    g(n, "style");
    E(n);
    if (!d && (!p.x || !p.y)) {
      var y = sr();
      var b = ca();
      window.addEventListener("resize", (function() {
        var r = sr();
        var e = {
          w: r.w - y.w,
          h: r.h - y.h
        };
        if (0 === e.w && 0 === e.h) {
          return;
        }
        var i = {
          w: ta(e.w),
          h: ta(e.h)
        };
        var v = {
          w: ta(ia(r.w / (y.w / 100))),
          h: ta(ia(r.h / (y.h / 100)))
        };
        var u = ca();
        var s = i.w > 2 && i.h > 2;
        var c = !va(v.w, v.h);
        var l = u !== b && b > 0;
        var d = s && c && l;
        if (d) {
          var g = f(oa(a, n, t)), p = g[0], h = g[1];
          assignDeep(na.L, p);
          E(n);
          if (h) {
            o("_");
          }
        }
        y = r;
        b = u;
      }));
    }
    return m;
  };
  var da = function getEnvironment() {
    if (!na) {
      na = la();
    }
    return na;
  };
  var ga = function resolveInitialization(r, a) {
    return isFunction(r) ? r.apply(0, a) : r;
  };
  var pa = function staticInitializationElement(r, a, e, n) {
    return ga(n || ga(e, r), r) || a.apply(0, r);
  };
  var ha = function dynamicInitializationElement(r, a, e, n) {
    var t = ga(n, r);
    if (isNull(t) || isUndefined(t)) {
      t = ga(e, r);
    }
    return true === t || isNull(t) || isUndefined(t) ? a.apply(0, r) : t;
  };
  var wa = 0;
  var ma = z.bind(0, "");
  var ya = function unwrap(r) {
    O(b(r), y(r));
    E(r);
  };
  var ba = function createUniqueViewportArrangeElement() {
    var r = da(), a = r.M, e = r.I, n = r.P;
    var t = !n && !a && (e.x || e.y);
    var i = t ? document.createElement("style") : false;
    if (i) {
      attr(i, "id", kr + "-" + wa);
      wa++;
    }
    return i;
  };
  var _a = function addDataAttrHost(r, a) {
    attr(r, Tr, a);
    return g.bind(0, r, Tr);
  };
  var Sa = function createStructureSetupElements(r) {
    var a = da(), e = a.F, n = a.M;
    var t = e(), o = t.U, u = t.q, s = t.A, p = t.D;
    var h = isHTMLElement(r);
    var w = r;
    var _ = h ? r : w.target;
    var S = m(_, "textarea");
    var C = !S && m(_, "body");
    var A = _.ownerDocument;
    var z = A.body;
    var L = A.defaultView;
    var I = !!k && !S && n;
    var M = pa.bind(0, [ _ ]);
    var P = ha.bind(0, [ _ ]);
    var T = [ M(ma, u, w.viewport), M(ma, u), M(ma) ].filter((function(r) {
      return !I ? r !== _ : true;
    }))[0];
    var N = T === _;
    var R = {
      W: _,
      U: S ? M(ma, o, w.host) : _,
      q: T,
      A: !N && P(ma, s, w.padding),
      D: !N && P(ma, p, w.content),
      G: !N && ba(),
      X: L,
      Y: A,
      $: b(z),
      J: z,
      K: S,
      Z: C,
      rr: h,
      ar: N,
      er: function _viewportHasClass(r, a) {
        return N ? d(T, Tr, a) : G(T, r);
      },
      nr: function _viewportAddRemoveClass(r, a, e) {
        return N ? l(T, Tr, a, e) : (e ? Y : X)(T, r);
      }
    };
    var F = c(R).reduce((function(r, a) {
      var e = R[a];
      return v(r, e && !b(e) ? e : false);
    }), []);
    var j = function elementIsGenerated(r) {
      return r ? i(F, r) > -1 : null;
    };
    var V = R.W, B = R.U, H = R.A, U = R.q, q = R.D, W = R.G;
    var $ = [];
    var J = S && j(B);
    var K = S ? V : y([ q, U, H, B, V ].find((function(r) {
      return false === j(r);
    })));
    var Z = q || U;
    var Q = function appendElements() {
      var r = _a(B, N ? "viewport" : "host");
      var a = Y(H, Vr);
      var e = Y(U, !N && Br);
      var t = Y(q, Hr);
      if (J) {
        D(V, B);
        v($, (function() {
          D(B, V);
          E(B);
        }));
      }
      O(Z, K);
      O(B, H);
      O(H || B, !N && U);
      O(U, q);
      v($, (function() {
        r();
        g(U, Nr);
        g(U, Rr);
        if (j(q)) {
          ya(q);
        }
        if (j(U)) {
          ya(U);
        }
        if (j(H)) {
          ya(H);
        }
        a();
        e();
        t();
      }));
      if (n && !N) {
        v($, X.bind(0, U, Ur));
      }
      if (W) {
        x(U, W);
        v($, E.bind(0, W));
      }
    };
    return [ R, Q, f.bind(0, $) ];
  };
  var Ca = function createTrinsicUpdate(r, a) {
    var e = r.D;
    var n = a[0];
    return function(r) {
      var a = da(), t = a.N;
      var i = n(), v = i.tr;
      var o = r.ir;
      var u = (e || !t) && o;
      if (u) {
        style(e, {
          height: v ? "" : "100%"
        });
      }
      return {
        vr: u,
        ur: u
      };
    };
  };
  var Oa = function createPaddingUpdate(r, a) {
    var e = a[0], n = a[1];
    var t = r.U, i = r.A, v = r.q, o = r.ar;
    var u = createCache({
      o: Z,
      v: ur()
    }, ur.bind(0, t, "padding", "")), f = u[0], s = u[1];
    return function(r, a, t) {
      var u = s(t), c = u[0], l = u[1];
      var d = da(), g = d.M, p = d.N;
      var h = e(), w = h.sr;
      var m = r.vr, y = r.ur, b = r.cr;
      var _ = a("paddingAbsolute"), S = _[0], C = _[1];
      var O = !p && y;
      if (m || l || O) {
        var A = f(t);
        c = A[0];
        l = A[1];
      }
      var x = !o && (C || b || l);
      if (x) {
        var D = !S || !i && !g;
        var E = c.r + c.l;
        var z = c.t + c.b;
        var L = {
          marginRight: D && !w ? -E : 0,
          marginBottom: D ? -z : 0,
          marginLeft: D && w ? -E : 0,
          top: D ? -c.t : 0,
          right: D ? w ? -c.r : "auto" : 0,
          left: D ? w ? "auto" : -c.l : 0,
          width: D ? "calc(100% + " + E + "px)" : ""
        };
        var I = {
          paddingTop: D ? c.t : 0,
          paddingRight: D ? c.r : 0,
          paddingBottom: D ? c.b : 0,
          paddingLeft: D ? c.l : 0
        };
        style(i || v, L);
        style(v, I);
        n({
          A: c,
          lr: !D,
          dr: i ? I : assignDeep({}, L, I)
        });
      }
      return {
        gr: x
      };
    };
  };
  var Aa = Math.max;
  var xa = "visible";
  var Da = "hidden";
  var Ea = 42;
  var za = {
    o: J,
    v: {
      w: 0,
      h: 0
    }
  };
  var La = {
    o: K,
    v: {
      x: Da,
      y: Da
    }
  };
  var Ia = function getOverflowAmount(r, a, e) {
    var n = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
    var t = {
      w: Aa(0, r.w - a.w - Aa(0, e.w)),
      h: Aa(0, r.h - a.h - Aa(0, e.h))
    };
    return {
      w: t.w > n ? t.w : 0,
      h: t.h > n ? t.h : 0
    };
  };
  var Ma = function conditionalClass(r, a, e) {
    return e ? Y(r, a) : X(r, a);
  };
  var Pa = function overflowIsVisible(r) {
    return 0 === r.indexOf(xa);
  };
  var Ta = function createOverflowUpdate(r, a) {
    var e = a[0], n = a[1];
    var t = r.U, i = r.A, v = r.q, o = r.G, u = r.ar, f = r.nr;
    var s = da(), d = s.L, g = s.N, p = s.M, h = s.I;
    var w = !u && !p && (h.x || h.y);
    var m = createCache(za, gr.bind(0, v)), y = m[0], b = m[1];
    var _ = createCache(za, dr.bind(0, v)), S = _[0], C = _[1];
    var O = createCache(za), A = O[0], x = O[1];
    var D = createCache(La), E = D[0];
    var z = function fixFlexboxGlue(r, a) {
      style(v, {
        height: ""
      });
      if (a) {
        var n = e(), i = n.lr, o = n.A;
        var u = r.pr, f = r.hr;
        var s = gr(t);
        var c = lr(t);
        var l = "content-box" === style(v, "boxSizing");
        var d = i || l ? o.b + o.t : 0;
        var g = !(h.x && l);
        style(v, {
          height: c.h + s.h + (u.x && g ? f.x : 0) - d
        });
      }
    };
    var L = function getViewportOverflowState(r, a) {
      var e = !p && !r ? Ea : 0;
      var n = function getStatePerAxis(r, n, t) {
        var i = style(v, r);
        var o = a ? a[r] : i;
        var u = "scroll" === o;
        var f = n ? e : t;
        var s = u && !p ? f : 0;
        var c = n && !!e;
        return [ i, u, s, c ];
      };
      var t = n("overflowX", h.x, d.x), i = t[0], o = t[1], u = t[2], f = t[3];
      var s = n("overflowY", h.y, d.y), c = s[0], l = s[1], g = s[2], w = s[3];
      return {
        wr: {
          x: i,
          y: c
        },
        pr: {
          x: o,
          y: l
        },
        hr: {
          x: u,
          y: g
        },
        mr: {
          x: f,
          y: w
        }
      };
    };
    var I = function setViewportOverflowState(r, a, e, n) {
      var t = function setAxisOverflowStyle(r, a) {
        var e = Pa(r);
        var n = a && e && r.replace(xa + "-", "") || "";
        return [ a && !e ? r : "", Pa(n) ? "hidden" : n ];
      };
      var i = t(e.x, a.x), v = i[0], o = i[1];
      var u = t(e.y, a.y), f = u[0], s = u[1];
      n.overflowX = o && f ? o : v;
      n.overflowY = s && v ? s : f;
      return L(r, n);
    };
    var M = function arrangeViewport(r, a, n, t) {
      if (w) {
        var i = e(), u = i.dr;
        var f = r.hr, s = r.mr;
        var c = s.x, l = s.y;
        var d = f.x, g = f.y;
        var p = t ? "paddingRight" : "paddingLeft";
        var h = u[p];
        var m = u.paddingTop;
        var y = a.w + n.w;
        var b = a.h + n.h;
        var _ = {
          w: g && l ? g + y - h + "px" : "",
          h: d && c ? d + b - m + "px" : ""
        };
        if (o) {
          var S = o.sheet;
          if (S) {
            var C = S.cssRules;
            if (C) {
              if (!C.length) {
                S.insertRule("#" + attr(o, "id") + " + ." + kr + "::before {}", 0);
              }
              var O = C[0].style;
              O.width = _.w;
              O.height = _.h;
            }
          }
        } else {
          style(v, {
            "--os-vaw": _.w,
            "--os-vah": _.h
          });
        }
      }
      return w;
    };
    var P = function hideNativeScrollbars(r, a, n, t) {
      var i = r.hr, v = r.mr;
      var o = v.x, u = v.y;
      var f = i.x, s = i.y;
      var c = e(), l = c.dr;
      var d = a ? "marginLeft" : "marginRight";
      var g = a ? "paddingLeft" : "paddingRight";
      var p = l[d];
      var h = l.marginBottom;
      var w = l[g];
      var m = l.paddingBottom;
      t.width = "calc(100% + " + (s + -1 * p) + "px)";
      t[d] = -s + p;
      t.marginBottom = -f + h;
      if (n) {
        t[g] = w + (u ? s : 0);
        t.paddingBottom = m + (o ? f : 0);
      }
    };
    var T = function undoViewportArrange(r, a, n) {
      if (w) {
        var t = n || L(r);
        var i = e(), o = i.dr;
        var u = t.mr;
        var f = u.x, s = u.y;
        var l = {};
        var d = function assignProps(r) {
          return each(r.split(" "), (function(r) {
            l[r] = o[r];
          }));
        };
        if (f) {
          d("marginBottom paddingTop paddingBottom");
        }
        if (s) {
          d("marginLeft marginRight paddingLeft paddingRight");
        }
        var p = style(v, c(l));
        X(v, kr);
        if (!g) {
          l.height = "";
        }
        style(v, l);
        return [ function() {
          P(t, a, w, p);
          style(v, p);
          Y(v, kr);
        }, t ];
      }
      return [ ar ];
    };
    return function(r, a, o) {
      var s = r.vr, c = r.yr, d = r.ur, w = r.gr, m = r.ir, _ = r.cr;
      var O = e(), D = O.tr, N = O.sr;
      var R = a("nativeScrollbarsOverlaid.show"), F = R[0], j = R[1];
      var V = a("overflow"), B = V[0], k = V[1];
      var H = F && h.x && h.y;
      var U = !u && !g && (s || d || c || j || m);
      var q = Pa(B.x);
      var W = Pa(B.y);
      var G = q || W;
      var X = b(o);
      var Y = C(o);
      var $ = x(o);
      var J;
      if (j && p) {
        f(Ur, jr, !H);
      }
      if (U) {
        J = L(H);
        z(J, D);
      }
      if (s || w || d || _ || j) {
        if (G) {
          f(qr, Fr, false);
        }
        var K = T(H, N, J), Z = K[0], Q = K[1];
        var rr = X = y(o), ar = rr[0], er = rr[1];
        var nr = Y = S(o), tr = nr[0], ir = nr[1];
        var vr = lr(v);
        var or = tr;
        var ur = vr;
        Z();
        if ((ir || er || j) && Q && !H && M(Q, tr, ar, N)) {
          ur = lr(v);
          or = dr(v);
        }
        $ = A(Ia({
          w: Aa(tr.w, or.w),
          h: Aa(tr.h, or.h)
        }, {
          w: ur.w + Aa(0, vr.w - tr.w),
          h: ur.h + Aa(0, vr.h - tr.h)
        }, ar), o);
      }
      var fr = $, sr = fr[0], cr = fr[1];
      var gr = Y, pr = gr[0], hr = gr[1];
      var wr = X, mr = wr[0], yr = wr[1];
      var br = {
        x: sr.w > 0,
        y: sr.h > 0
      };
      var _r = q && W && (br.x || br.y) || q && br.x && !br.y || W && br.y && !br.x;
      if (w || _ || yr || hr || cr || k || j || U) {
        var Sr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Cr = I(H, br, B, Sr);
        var Or = M(Cr, pr, mr, N);
        if (!u) {
          P(Cr, N, Or, Sr);
        }
        if (U) {
          z(Cr, D);
        }
        if (u) {
          attr(t, Nr, Sr.overflowX);
          attr(t, Rr, Sr.overflowY);
        } else {
          style(v, Sr);
        }
      }
      l(t, Tr, Fr, _r);
      Ma(i, qr, _r);
      !u && Ma(v, qr, G);
      var Ar = E(L(H).wr), xr = Ar[0], Dr = Ar[1];
      n({
        wr: xr,
        br: {
          x: sr.w,
          y: sr.h
        },
        _r: br
      });
      return {
        Sr: Dr,
        Cr: cr
      };
    };
  };
  var Na = function prepareUpdateHints(r, a, e) {
    var n = {};
    var t = a || {};
    var i = c(r).concat(c(t));
    each(i, (function(a) {
      var i = r[a];
      var v = t[a];
      n[a] = !!(e || i || v);
    }));
    return n;
  };
  var Ra = function createStructureSetupUpdate(r, a) {
    var e = r.q;
    var n = da(), t = n.M, i = n.I, v = n.N;
    var o = !t && (i.x || i.y);
    var u = [ Ca(r, a), Oa(r, a), Ta(r, a) ];
    return function(r, a, n) {
      var t = Na(assignDeep({
        vr: false,
        gr: false,
        cr: false,
        ir: false,
        Cr: false,
        Sr: false,
        yr: false,
        ur: false
      }, a), {}, n);
      var i = o || !v;
      var f = i && scrollLeft(e);
      var s = i && scrollTop(e);
      var c = t;
      each(u, (function(a) {
        c = Na(c, a(c, r, !!n) || {}, n);
      }));
      if (isNumber(f)) {
        scrollLeft(e, f);
      }
      if (isNumber(s)) {
        scrollTop(e, s);
      }
      return c;
    };
  };
  var Fa = "animationstart";
  var ja = "scroll";
  var Va = 3333333;
  var Ba = function getElmDirectionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var ka = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var Ha = function createSizeObserver(r, a, e) {
    var n = e || {}, t = n.Or, i = void 0 === t ? false : t, o = n.Ar, u = void 0 === o ? false : o;
    var s = da(), c = s.T;
    var l = L('<div class="' + Wr + '"><div class="' + Xr + '"></div></div>');
    var d = l[0];
    var g = d.firstChild;
    var p = Ba.bind(0, d);
    var h = createCache({
      v: void 0,
      u: true,
      o: function _equal(r, a) {
        return !(!r || !ka(r) && ka(a));
      }
    }), w = h[0];
    var m = function onSizeChangedCallbackProxy(r) {
      var e = isArray(r) && r.length > 0 && isObject(r[0]);
      var n = !e && isBoolean(r[0]);
      var t = false;
      var v = false;
      var o = true;
      if (e) {
        var u = w(r.pop().contentRect), f = u[0], s = u[2];
        var l = ka(f);
        var g = ka(s);
        t = !s || !l;
        v = !g && l;
        o = !t;
      } else if (n) {
        o = r[1];
      } else {
        v = true === r;
      }
      if (i && o) {
        var p = n ? r[0] : Ba(d);
        scrollLeft(d, p ? c.n ? -Va : c.i ? 0 : Va : Va);
        scrollTop(d, Va);
      }
      if (!t) {
        a({
          vr: !n,
          Dr: n ? r : void 0,
          Ar: !!v
        });
      }
    };
    var y = [];
    var b = u ? m : false;
    var _;
    if (k) {
      var S = new k(m);
      S.observe(g);
      v(y, (function() {
        S.disconnect();
      }));
    }
    if (i) {
      _ = createCache({
        v: !p()
      }, p);
      var C = _, O = C[0];
      v(y, br(d, ja, (function(r) {
        var a = O();
        var e = a[0], n = a[1];
        if (n) {
          X(g, "ltr rtl");
          if (e) {
            Y(g, "rtl");
          } else {
            Y(g, "ltr");
          }
          m(a);
        }
        Cr(r);
      })));
    }
    if (b) {
      Y(d, Gr);
      v(y, br(d, Fa, b, {
        O: !!k
      }));
    }
    A(r, d);
    return function() {
      f(y);
      E(d);
    };
  };
  var Ua = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var qa = function createTrinsicObserver(r, a) {
    var e = z(Yr);
    var n = [];
    var t = createCache({
      v: false
    }), i = t[0];
    var o = function triggerOnTrinsicChangedCallback(r) {
      if (r) {
        var e = i(Ua(r));
        var n = e[1];
        if (n) {
          a(e);
        }
      }
    };
    if (B) {
      var u = new B((function(r) {
        if (r && r.length > 0) {
          o(r.pop());
        }
      }), {
        root: r
      });
      u.observe(e);
      v(n, (function() {
        u.disconnect();
      }));
    } else {
      var s = function onSizeChanged() {
        var r = cr(e);
        o(r);
      };
      v(n, Ha(e, s));
      s();
    }
    A(r, e);
    return function() {
      f(n);
      E(e);
    };
  };
  var Wa = function createEventContentChange(r, a, e) {
    var n;
    var t = false;
    var i = function destroy() {
      t = true;
    };
    var o = function updateElements(i) {
      if (e) {
        var o = e.reduce((function(a, e) {
          if (e) {
            var n = e[0];
            var t = e[1];
            var o = t && n && (i ? i(n) : h(n, r));
            if (o && o.length && t && isString(t)) {
              v(a, [ o, t.trim() ], true);
            }
          }
          return a;
        }), []);
        each(o, (function(r) {
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
            var f = br(e, i, (function(r) {
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
      o();
    }
    return [ i, o ];
  };
  var Ga = function createDOMObserver(r, a, e, n) {
    var t = false;
    var o = n || {}, f = o.Er, s = o.zr, c = o.Lr, l = o.Ir, d = o.Mr, g = o.Pr;
    var p = Wa(r, er((function() {
      if (t) {
        e(true);
      }
    }), {
      g: 33,
      p: 99
    }), c), w = p[0], y = p[1];
    var b = f || [];
    var _ = s || [];
    var S = b.concat(_);
    var C = function observerCallback(t) {
      var o = d || ar;
      var f = g || ar;
      var s = [];
      var c = [];
      var p = false;
      var w = false;
      var b = false;
      each(t, (function(e) {
        var t = e.attributeName, u = e.target, d = e.type, g = e.oldValue, h = e.addedNodes;
        var y = "attributes" === d;
        var S = "childList" === d;
        var C = r === u;
        var O = y && isString(t) ? attr(u, t) : 0;
        var A = 0 !== O && g !== O;
        var x = i(_, t) > -1 && A;
        if (a && !C) {
          var D = !y;
          var E = y && x;
          var z = E && l && m(u, l);
          var L = z ? !o(u, t, g, O) : D || E;
          var I = L && !f(e, !!z, r, n);
          v(c, h);
          w = w || I;
          b = b || S;
        }
        if (!a && C && A && !o(u, t, g, O)) {
          v(s, t);
          p = p || x;
        }
      }));
      if (b && !u(c)) {
        y((function(r) {
          return c.reduce((function(a, e) {
            v(a, h(r, e));
            return m(e, r) ? v(a, e) : a;
          }), []);
        }));
      }
      if (a) {
        w && e(false);
      } else if (!u(s) || p) {
        e(s, p);
      }
    };
    var O = new V(C);
    O.observe(r, {
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
        w();
        O.disconnect();
        t = false;
      }
    }, function() {
      if (t) {
        C(O.takeRecords());
      }
    } ];
  };
  var Xa = "[" + Tr + "]";
  var Ya = "." + Br;
  var $a = [ "tabindex" ];
  var Ja = [ "wrap", "cols", "rows" ];
  var Ka = [ "id", "class", "style", "open" ];
  var Za = function createStructureSetupObservers(r, a, e) {
    var n;
    var t;
    var v;
    var o = a[1];
    var u = r.U, f = r.q, s = r.D, l = r.K, d = r.ar, p = r.er, h = r.nr;
    var w = da(), m = w.M, y = w.N;
    var b = createCache({
      o: J,
      v: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = p(qr, Fr);
      r && h(qr, Fr);
      var a = dr(s);
      var e = dr(f);
      var n = gr(f);
      r && h(qr, Fr, true);
      return {
        w: e.w + a.w + n.w,
        h: e.h + a.h + n.h
      };
    })), _ = b[0];
    var C = l ? Ja : Ka.concat(Ja);
    var O = er(e, {
      g: function _timeout() {
        return n;
      },
      p: function _maxDelay() {
        return t;
      },
      m: function _mergeParams(r, a) {
        var e = r[0];
        var n = a[0];
        return [ c(e).concat(c(n)).reduce((function(r, a) {
          r[a] = e[a] || n[a];
          return r;
        }), {}) ];
      }
    });
    var A = function updateViewportAttrsFromHost(r) {
      each(r || $a, (function(r) {
        if (i($a, r) > -1) {
          var a = attr(u, r);
          if (isString(a)) {
            attr(f, r, a);
          } else {
            g(f, r);
          }
        }
      }));
    };
    var x = function onTrinsicChanged(r) {
      var a = r[0], n = r[1];
      o({
        tr: a
      });
      e({
        ir: n
      });
    };
    var D = function onSizeChanged(r) {
      var a = r.vr, n = r.Dr, t = r.Ar;
      var i = !a || t ? e : O;
      var v = false;
      if (n) {
        var u = n[0], f = n[1];
        v = f;
        o({
          sr: u
        });
      }
      i({
        vr: a,
        cr: v
      });
    };
    var E = function onContentMutation(r) {
      var a = _(), n = a[1];
      var t = r ? e : O;
      if (n) {
        t({
          ur: true
        });
      }
    };
    var z = function onHostMutation(r, a) {
      if (a) {
        O({
          yr: true
        });
      } else if (!d) {
        A(r);
      }
    };
    var L = (s || !y) && qa(u, x);
    var I = !d && Ha(u, D, {
      Ar: true,
      Or: !m
    });
    var M = Ga(u, false, z, {
      zr: Ka,
      Er: Ka.concat($a)
    }), P = M[0];
    var T = d && new k(D.bind(0, {
      vr: true
    }));
    T && T.observe(u);
    A();
    return [ function(r) {
      var a = r("updating.ignoreMutation"), e = a[0];
      var i = r("updating.attributes"), o = i[0], u = i[1];
      var c = r("updating.elementEvents"), l = c[0], d = c[1];
      var g = r("updating.debounce"), p = g[0], h = g[1];
      var w = d || u;
      var m = function ignoreMutationFromOptions(r) {
        return isFunction(e) && e(r);
      };
      if (w) {
        if (v) {
          v[1]();
          v[0]();
        }
        v = Ga(s || f, true, E, {
          zr: C.concat(o || []),
          Er: C.concat(o || []),
          Lr: l,
          Ir: Xa,
          Pr: function _ignoreContentChange(r, a) {
            var e = r.target, n = r.attributeName;
            var t = !a && n ? S(e, Xa, Ya) : false;
            return t || !!m(r);
          }
        });
      }
      if (h) {
        O._();
        if (isArray(p)) {
          var y = p[0];
          var b = p[1];
          n = isNumber(y) ? y : false;
          t = isNumber(b) ? b : false;
        } else if (isNumber(p)) {
          n = p;
          t = false;
        } else {
          n = false;
          t = false;
        }
      }
    }, function() {
      v && v[0]();
      L && L();
      I && I();
      T && T.disconnect();
      P();
    } ];
  };
  var Qa = {
    A: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    lr: false,
    dr: {
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    },
    br: {
      x: 0,
      y: 0
    },
    wr: {
      x: "hidden",
      y: "hidden"
    },
    _r: {
      x: false,
      y: false
    },
    tr: false,
    sr: false
  };
  var re = function createStructureSetup(r, a) {
    var e = zr(a, {});
    var n = Lr(Qa);
    var t = Dr(), i = t[0], v = t[1], o = t[2];
    var u = n[0];
    var f = Sa(r), s = f[0], c = f[1], l = f[2];
    var d = Ra(s, n);
    var g = Za(s, n, (function(r) {
      o("u", [ d(e, r), {}, false ]);
    })), p = g[0], h = g[1];
    var w = u.bind(0);
    w.Tr = function(r) {
      i("u", r);
    };
    w.Nr = c;
    w.Rr = s;
    return [ function(r, e) {
      var n = zr(a, r, e);
      p(n);
      o("u", [ d(n, {}, e), r, !!e ]);
    }, w, function() {
      v();
      h();
      l();
    } ];
  };
  var ae = function generateScrollbarDOM(r) {
    var a = z($r + " " + r);
    var e = z(Zr);
    var n = z(Qr);
    O(a, e);
    O(e, n);
    return {
      Fr: a,
      jr: e,
      Vr: n
    };
  };
  var ee = function createScrollbarsSetupElements(r, a) {
    var e = da(), n = e.F;
    var t = n(), i = t.Br;
    var v = a.W, o = a.U, u = a.q, f = a.rr;
    var s = !f && r.scrollbarsSlot;
    var c = ha([ v, o, u ], (function() {
      return o;
    }), i, s);
    var l = ae(Jr);
    var d = ae(Kr);
    var g = l.Fr;
    var p = d.Fr;
    var h = function appendElements() {
      O(c, g);
      O(c, p);
    };
    return [ {
      kr: l,
      Hr: d
    }, h, E.bind(0, [ g, p ]) ];
  };
  var ne = function createScrollbarsSetup(r, a, e) {
    var n = Lr({});
    var t = n[0];
    var i = ee(r, e), v = i[0], o = i[1], u = i[2];
    var f = t.bind(0);
    f.Rr = v;
    f.Nr = o;
    return [ function(r, e) {
      var n = zr(a, r, e);
      console.log(n);
    }, f, function() {
      u();
    } ];
  };
  var te = {};
  var ie = function getPlugins() {
    return assignDeep({}, te);
  };
  var ve = function addPlugin(r) {
    return each(isArray(r) ? r : [ r ], (function(r) {
      te[r[0]] = r[1];
    }));
  };
  var oe = "__osOptionsValidationPlugin";
  var ue = new Set;
  var fe = new WeakMap;
  var se = function addInstance(r, a) {
    fe.set(r, a);
    ue.add(r);
  };
  var ce = function removeInstance(r) {
    fe.delete(r);
    ue.delete(r);
  };
  var le = function getInstance(r) {
    return fe.get(r);
  };
  var de = function OverlayScrollbars(r, a, e) {
    var n = false;
    var t = da(), i = t.V, v = t.I, o = t.R;
    var u = ie();
    var f = isHTMLElement(r) ? r : r.target;
    var s = le(f);
    if (s) {
      return s;
    }
    var l = u[oe];
    var d = function validateOptions(r) {
      var a = r || {};
      var e = l && l.Ur;
      return e ? e(a, true) : a;
    };
    var g = assignDeep({}, i(), d(a));
    var p = Dr(e), h = p[0], w = p[1], m = p[2];
    var y = re(r, g), b = y[0], _ = y[1], S = y[2];
    var C = ne(r, g, _.Rr), O = C[0], A = C[1], x = C[2];
    var D = function update(r, a) {
      b(r, a);
      O(r, a);
    };
    var E = o(D.bind(0, {}, true));
    var z = function destroy(r) {
      ce(f);
      E();
      x();
      S();
      n = true;
      m("destroyed", [ L, !!r ]);
      w();
    };
    var L = {
      options: function options(r) {
        if (r) {
          var a = ea(g, d(r));
          if (!isEmptyObject(a)) {
            assignDeep(g, a);
            D(a);
          }
        }
        return assignDeep({}, g);
      },
      on: h,
      off: function off(r, a) {
        r && a && w(r, a);
      },
      state: function state() {
        var r = _(), a = r.br, e = r.wr, t = r._r, i = r.A, v = r.lr;
        return assignDeep({}, {
          overflowAmount: a,
          overflowStyle: e,
          hasOverflow: t,
          padding: i,
          paddingAbsolute: v,
          destroyed: n
        });
      },
      elements: function elements() {
        var r = _.Rr, a = r.W, e = r.U, n = r.A, t = r.q, i = r.D;
        return assignDeep({}, {
          target: a,
          host: e,
          padding: n || t,
          viewport: t,
          content: i || t
        });
      },
      update: function update(r) {
        D({}, r);
        return L;
      },
      destroy: z.bind(0)
    };
    each(c(u), (function(r) {
      var a = u[r];
      if (isFunction(a)) {
        a(OverlayScrollbars, L);
      }
    }));
    if (v.x && v.y && !g.nativeScrollbarsOverlaid.initialize) {
      z(true);
      return L;
    }
    _.Nr();
    A.Nr();
    se(f, L);
    m("initialized", [ L ]);
    _.Tr((function(r, a, e) {
      var n = r.vr, t = r.cr, i = r.ir, v = r.Cr, o = r.Sr, u = r.ur, f = r.yr;
      m("updated", [ L, {
        updateHints: {
          sizeChanged: n,
          directionChanged: t,
          heightIntrinsicChanged: i,
          overflowAmountChanged: v,
          overflowStyleChanged: o,
          contentMutation: u,
          hostMutation: f
        },
        changedOptions: a,
        force: e
      } ]);
    }));
    return L.update(true);
  };
  de.plugin = ve;
  de.env = function() {
    var r = da(), a = r.L, e = r.I, n = r.M, t = r.T, i = r.N, v = r.P, o = r.k, u = r.H, f = r.F, s = r.j, c = r.V, l = r.B;
    return assignDeep({}, {
      scrollbarSize: a,
      scrollbarIsOverlaid: e,
      scrollbarStyling: n,
      rtlScrollBehavior: t,
      flexboxGlue: i,
      cssCustomProperties: v,
      defaultInitializationStrategy: o,
      defaultDefaultOptions: u,
      getInitializationStrategy: f,
      setInitializationStrategy: s,
      getDefaultOptions: c,
      setDefaultOptions: l
    });
  };
  return de;
}));
//# sourceMappingURL=overlayscrollbars.js.map
