(function(r, a) {
  "object" === typeof exports && "undefined" !== typeof module ? module.exports = a() : "function" === typeof define && define.amd ? define(a) : (r = "undefined" !== typeof globalThis ? globalThis : r || self, 
  r.OverlayScrollbars = a());
})(this, (function() {
  "use strict";
  function createCache(r, a) {
    var e = r.v, t = r.o, n = r.u;
    var i = e;
    var v;
    var o = function cacheUpdateContextual(r, a) {
      var e = i;
      var o = r;
      var u = a || (t ? !t(e, o) : e !== o);
      if (u || n) {
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
    if (!r || !isObject(r) || "object" !== n(r)) {
      return false;
    }
    var a;
    var e = "constructor";
    var i = r[e];
    var v = i && i.prototype;
    var o = t.call(r, e);
    var u = v && t.call(v, "isPrototypeOf");
    if (i && !o && !u) {
      return false;
    }
    for (a in r) {}
    return isUndefined(a) || t.call(r, a);
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
  function assignDeep(r, a, e, t, n, i, v) {
    var o = [ a, e, t, n, i, v ];
    if (("object" !== typeof r || isNull(r)) && !isFunction(r)) {
      r = {};
    }
    each(o, (function(a) {
      each(c(a), (function(e) {
        var t = a[e];
        if (r === t) {
          return true;
        }
        var n = isArray(t);
        if (t && (isPlainObject(t) || n)) {
          var i = r[e];
          var v = i;
          if (n && !isArray(i)) {
            v = [];
          } else if (!n && !isPlainObject(i)) {
            v = {};
          }
          r[e] = assignDeep(v, t);
        } else {
          r[e] = t;
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
  function getSetProp(r, a, e, t) {
    if (isUndefined(t)) {
      return e ? e[r] : a;
    }
    e && (e[r] = t);
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
    var t = isArray(a) || e;
    if (t) {
      var n = e ? "" : {};
      if (r) {
        var i = window.getComputedStyle(r, null);
        n = e ? vr(r, i, a) : a.reduce((function(a, e) {
          a[e] = vr(r, i, e);
          return a;
        }), n);
      }
      return n;
    }
    each(c(a), (function(e) {
      return or(r, e, a[e]);
    }));
  }
  var r = Node.ELEMENT_NODE;
  var a = Object.prototype, e = a.toString, t = a.hasOwnProperty;
  var n = function type(r) {
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
  var f = function runEach(r, a) {
    var e = function runFn(r) {
      return r && r.apply(void 0, a || []);
    };
    if (r instanceof Set) {
      r.forEach(e);
    } else {
      each(r, e);
    }
  };
  var s = function hasOwnProperty(r, a) {
    return Object.prototype.hasOwnProperty.call(r, a);
  };
  var c = function keys(r) {
    return r ? Object.keys(r) : [];
  };
  var l = function attrClass(r, a, e, t) {
    var n = attr(r, a) || "";
    var i = new Set(n.split(" "));
    i[t ? "add" : "delete"](e);
    attr(r, a, o(i).join(" ").trim());
  };
  var d = function hasAttrClass(r, a, e) {
    var t = attr(r, a) || "";
    var n = new Set(t.split(" "));
    return n.has(e);
  };
  var g = function removeAttr(r, a) {
    r && r.removeAttribute(a);
  };
  var p = Element.prototype;
  var h = function find(r, a) {
    var e = [];
    var t = a ? isElement(a) ? a : null : document;
    return t ? v(e, t.querySelectorAll(r)) : e;
  };
  var w = function findFirst(r, a) {
    var e = a ? isElement(a) ? a : null : document;
    return e ? e.querySelector(r) : null;
  };
  var y = function is(r, a) {
    if (isElement(r)) {
      var e = p.matches || p.msMatchesSelector;
      return e.call(r, a);
    }
    return false;
  };
  var m = function contents(r) {
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
        if (y(r, a)) {
          return r;
        }
        r = b(r);
      } while (r);
    }
    return null;
  };
  var S = function liesBetween(r, a, e) {
    var t = r && _(r, a);
    var n = r && w(e, t);
    return t && n ? t === r || n === r || _(_(r, e), a) !== t : false;
  };
  var C = function before(r, a, e) {
    if (e) {
      var t = a;
      var n;
      if (r) {
        if (isArrayLike(e)) {
          n = document.createDocumentFragment();
          each(e, (function(r) {
            if (r === t) {
              t = r.previousSibling;
            }
            n.appendChild(r);
          }));
        } else {
          n = e;
        }
        if (a) {
          if (!t) {
            t = r.firstChild;
          } else if (t !== a) {
            t = t.nextSibling;
          }
        }
        r.insertBefore(n, t || null);
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
    return each(m(a), (function(r) {
      return E(r);
    }));
  };
  var I = function firstLetterToUpper(r) {
    return r.charAt(0).toUpperCase() + r.slice(1);
  };
  var T = function getDummyStyle() {
    return z().style;
  };
  var M = [ "-webkit-", "-moz-", "-o-", "-ms-" ];
  var P = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ];
  var R = {};
  var N = {};
  var F = function cssProperty(r) {
    var a = N[r];
    if (s(N, r)) {
      return a;
    }
    var e = I(r);
    var t = T();
    each(M, (function(n) {
      var i = n.replace(/-/g, "");
      var v = [ r, n + r, i + e, I(i) + e ];
      return !(a = v.find((function(r) {
        return void 0 !== t[r];
      })));
    }));
    return N[r] = a || "";
  };
  var j = function jsAPI(r) {
    var a = R[r] || window[r];
    if (s(R, r)) {
      return a;
    }
    each(P, (function(e) {
      a = a || window[e + I(r)];
      return !a;
    }));
    R[r] = a;
    return a;
  };
  var V = j("MutationObserver");
  var B = j("IntersectionObserver");
  var k = j("ResizeObserver");
  var U = j("cancelAnimationFrame");
  var H = j("requestAnimationFrame");
  var q = /[^\x20\t\r\n\f]+/g;
  var W = function classListAction(r, a, e) {
    var t;
    var n = 0;
    var i = false;
    if (r && a && isString(a)) {
      var v = a.match(q) || [];
      i = v.length > 0;
      while (t = v[n++]) {
        i = !!e(r.classList, t) && i;
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
  var $ = function equal(r, a, e, t) {
    if (r && a) {
      var n = true;
      each(e, (function(e) {
        var i = t ? t(r[e]) : r[e];
        var v = t ? t(a[e]) : a[e];
        if (i !== v) {
          n = false;
        }
      }));
      return n;
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
    r && U(r);
  };
  var ar = function noop() {};
  var er = function debounce(r, a) {
    var e;
    var t;
    var n;
    var i;
    var v = a || {}, u = v.g, f = v.p, s = v.m;
    var c = window.setTimeout;
    var l = function invokeFunctionToDebounce(a) {
      rr(e);
      rr(t);
      t = e = n = void 0;
      r.apply(this, a);
    };
    var d = function mergeParms(r) {
      return s && n ? s(n, r) : r;
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
        var h = a > 0 ? c : H;
        var w = d(r);
        var y = w || r;
        var m = l.bind(0, y);
        rr(e);
        e = h(m, a);
        if (p && !t) {
          t = c(g, s);
        }
        n = i = y;
      } else {
        l(r);
      }
    };
    p._ = g;
    return p;
  };
  var tr = {
    opacity: 1,
    zindex: 1
  };
  var nr = function parseToZeroOrNumber(r, a) {
    var e = a ? parseFloat(r) : parseInt(r, 10);
    return Number.isNaN(e) ? 0 : e;
  };
  var ir = function adaptCSSVal(r, a) {
    return !tr[r.toLowerCase()] && isNumber(a) ? a + "px" : a;
  };
  var vr = function getCSSVal(r, a, e) {
    return null != a ? a[e] || a.getPropertyValue(e) : r.style[e];
  };
  var or = function setCSSVal(r, a, e) {
    try {
      if (r) {
        var t = r.style;
        if (!isUndefined(t[a])) {
          t[a] = ir(a, e);
        } else {
          t.setProperty(a, e);
        }
      }
    } catch (n) {}
  };
  var ur = function topRightBottomLeft(r, a, e) {
    var t = a ? a + "-" : "";
    var n = e ? "-" + e : "";
    var i = t + "top" + n;
    var v = t + "right" + n;
    var o = t + "bottom" + n;
    var u = t + "left" + n;
    var f = style(r, [ i, v, o, u ]);
    return {
      t: nr(f[i]),
      r: nr(f[v]),
      b: nr(f[o]),
      l: nr(f[u])
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
  var yr = function splitEventNames(r) {
    return r.split(" ");
  };
  var mr = function off(r, a, e, t) {
    each(yr(a), (function(a) {
      r.removeEventListener(a, e, t);
    }));
  };
  var br = function on(r, a, e, t) {
    var n = wr();
    var i = n && t && t.S || false;
    var o = t && t.C || false;
    var u = t && t.O || false;
    var s = [];
    var c = n ? {
      passive: i,
      capture: o
    } : o;
    each(yr(a), (function(a) {
      var t = u ? function(n) {
        r.removeEventListener(a, t, o);
        e && e(n);
      } : e;
      v(s, mr.bind(null, r, a, t, o));
      r.addEventListener(a, t, c);
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
        var t = a.get(r);
        xr((function(r) {
          if (t) {
            t[r ? "delete" : "clear"](r);
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
      var t = a.get(r) || new Set;
      a.set(r, t);
      xr((function(r) {
        r && t.add(r);
      }), e);
      return removeEvent.bind(0, r, e);
    }
    function triggerEvent(r) {
      for (var e = arguments.length, t = new Array(e > 1 ? e - 1 : 0), n = 1; n < e; n++) {
        t[n - 1] = arguments[n];
      }
      var i = a.get(r);
      each(o(i), (function(r) {
        if (t) {
          r(t);
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
    return function(t) {
      return [ Er(r, t), e || void 0 !== Er(a, t) ];
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
  var Tr = Ir + "-flexbox-glue";
  var Mr = Tr + "-max";
  var Pr = "data-overlayscrollbars";
  var Rr = Pr + "-overflow-x";
  var Nr = Pr + "-overflow-y";
  var Fr = "overflowVisible";
  var jr = "viewportStyled";
  var Vr = "os-padding";
  var Br = "os-viewport";
  var kr = Br + "-arrange";
  var Ur = "os-content";
  var Hr = Br + "-scrollbar-styled";
  var qr = "os-overflow-visible";
  var Wr = "os-size-observer";
  var Gr = Wr + "-appear";
  var Xr = Wr + "-listener";
  var Yr = Xr + "-scroll";
  var $r = Xr + "-item";
  var Jr = $r + "-final";
  var Kr = "os-trinsic-observer";
  var Zr = "os-scrollbar";
  var Qr = Zr + "-horizontal";
  var ra = Zr + "-vertical";
  var aa = "os-scrollbar-track";
  var ea = "os-scrollbar-handle";
  var ta = function opsStringify(r) {
    return JSON.stringify(r, (function(r, a) {
      if (isFunction(a)) {
        throw new Error;
      }
      return a;
    }));
  };
  var na = {
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
  var ia = function getOptionsDiff(r, a) {
    var e = {};
    var t = c(a).concat(c(r));
    each(t, (function(t) {
      var n = r[t];
      var i = a[t];
      if (isObject(n) && isObject(i)) {
        assignDeep(e[t] = {}, getOptionsDiff(n, i));
      } else if (s(a, t) && i !== n) {
        var v = true;
        if (isArray(n) || isArray(i)) {
          try {
            if (ta(n) === ta(i)) {
              v = false;
            }
          } catch (o) {}
        }
        if (v) {
          e[t] = i;
        }
      }
    }));
    return e;
  };
  var va;
  var oa = Math.abs, ua = Math.round;
  var fa = function diffBiggerThanOne(r, a) {
    var e = oa(r);
    var t = oa(a);
    return !(e === t || e + 1 === t || e - 1 === t);
  };
  var sa = function getNativeScrollbarSize(r, a, e) {
    O(r, a);
    var t = lr(a);
    var n = cr(a);
    var i = gr(e);
    return {
      x: n.h - t.h + i.h,
      y: n.w - t.w + i.w
    };
  };
  var ca = function getNativeScrollbarStyling(r) {
    var a = false;
    var e = Y(r, Hr);
    try {
      a = "none" === style(r, F("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (t) {}
    e();
    return a;
  };
  var la = function getRtlScrollBehavior(r, a) {
    var e = "hidden";
    style(r, {
      overflowX: e,
      overflowY: e,
      direction: "rtl"
    });
    scrollLeft(r, 0);
    var t = Ar(r);
    var n = Ar(a);
    scrollLeft(r, -999);
    var i = Ar(a);
    return {
      i: t.x === n.x,
      n: n.x !== i.x
    };
  };
  var da = function getFlexboxGlue(r, a) {
    var e = Y(r, Tr);
    var t = pr(r);
    var n = pr(a);
    var i = Q(n, t, true);
    var v = Y(r, Mr);
    var o = pr(r);
    var u = pr(a);
    var f = Q(u, o, true);
    e();
    v();
    return i && f;
  };
  var ga = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var a = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / a;
  };
  var pa = function createEnvironment() {
    var r = document, a = r.body;
    var e = L('<div class="' + Ir + '"><div></div></div>');
    var t = e[0];
    var n = t.firstChild;
    var i = Dr(), v = i[0], o = i[2];
    var u = createCache({
      v: sa(a, t, n),
      o: K
    }), f = u[0], s = u[1];
    var c = s(), l = c[0];
    var d = ca(t);
    var p = {
      x: 0 === l.x,
      y: 0 === l.y
    };
    var h = {
      A: !d,
      D: false
    };
    var w = assignDeep({}, na);
    var y = {
      L: l,
      I: p,
      T: d,
      M: "-1" === style(t, "zIndex"),
      P: la(t, n),
      R: da(t, n),
      N: function _addListener(r) {
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
      U: assignDeep({}, w)
    };
    g(t, "style");
    E(t);
    if (!d && (!p.x || !p.y)) {
      var m = sr();
      var b = ga();
      window.addEventListener("resize", (function() {
        var r = sr();
        var e = {
          w: r.w - m.w,
          h: r.h - m.h
        };
        if (0 === e.w && 0 === e.h) {
          return;
        }
        var i = {
          w: oa(e.w),
          h: oa(e.h)
        };
        var v = {
          w: oa(ua(r.w / (m.w / 100))),
          h: oa(ua(r.h / (m.h / 100)))
        };
        var u = ga();
        var s = i.w > 2 && i.h > 2;
        var c = !fa(v.w, v.h);
        var l = u !== b && b > 0;
        var d = s && c && l;
        if (d) {
          var g = f(sa(a, t, n)), p = g[0], h = g[1];
          assignDeep(va.L, p);
          E(t);
          if (h) {
            o("_");
          }
        }
        m = r;
        b = u;
      }));
    }
    return y;
  };
  var ha = function getEnvironment() {
    if (!va) {
      va = pa();
    }
    return va;
  };
  var wa = function resolveInitialization(r, a) {
    return isFunction(r) ? r.apply(0, a) : r;
  };
  var ya = function staticInitializationElement(r, a, e, t) {
    return wa(t || wa(e, r), r) || a.apply(0, r);
  };
  var ma = function dynamicInitializationElement(r, a, e, t) {
    var n = wa(t, r);
    if (isNull(n) || isUndefined(n)) {
      n = wa(e, r);
    }
    return true === n || isNull(n) || isUndefined(n) ? a.apply(0, r) : n;
  };
  var ba = 0;
  var _a = z.bind(0, "");
  var Sa = function unwrap(r) {
    O(b(r), m(r));
    E(r);
  };
  var Ca = function createUniqueViewportArrangeElement() {
    var r = ha(), a = r.T, e = r.I, t = r.M;
    var n = !t && !a && (e.x || e.y);
    var i = n ? document.createElement("style") : false;
    if (i) {
      attr(i, "id", kr + "-" + ba);
      ba++;
    }
    return i;
  };
  var Oa = function addDataAttrHost(r, a) {
    attr(r, Pr, a);
    return g.bind(0, r, Pr);
  };
  var Aa = function createStructureSetupElements(r) {
    var a = ha(), e = a.F, t = a.T;
    var n = e(), o = n.H, u = n.q, s = n.A, p = n.D;
    var h = isHTMLElement(r);
    var w = r;
    var _ = h ? r : w.target;
    var S = y(_, "textarea");
    var C = !S && y(_, "body");
    var A = _.ownerDocument;
    var z = A.body;
    var L = A.defaultView;
    var I = !!k && !S && t;
    var T = ya.bind(0, [ _ ]);
    var M = ma.bind(0, [ _ ]);
    var P = [ T(_a, u, w.viewport), T(_a, u), T(_a) ].filter((function(r) {
      return !I ? r !== _ : true;
    }))[0];
    var R = P === _;
    var N = {
      W: _,
      H: S ? T(_a, o, w.host) : _,
      q: P,
      A: !R && M(_a, s, w.padding),
      D: !R && M(_a, p, w.content),
      G: !R && Ca(),
      X: L,
      Y: A,
      $: b(z),
      J: z,
      K: S,
      Z: C,
      rr: h,
      ar: R,
      er: function _viewportHasClass(r, a) {
        return R ? d(P, Pr, a) : G(P, r);
      },
      tr: function _viewportAddRemoveClass(r, a, e) {
        return R ? l(P, Pr, a, e) : (e ? Y : X)(P, r);
      }
    };
    var F = c(N).reduce((function(r, a) {
      var e = N[a];
      return v(r, e && !b(e) ? e : false);
    }), []);
    var j = function elementIsGenerated(r) {
      return r ? i(F, r) > -1 : null;
    };
    var V = N.W, B = N.H, U = N.A, H = N.q, q = N.D, W = N.G;
    var $ = [];
    var J = S && j(B);
    var K = S ? V : m([ q, H, U, B, V ].find((function(r) {
      return false === j(r);
    })));
    var Z = q || H;
    var Q = Oa(B, R ? "viewport" : "host");
    var rr = Y(U, Vr);
    var ar = Y(H, !R && Br);
    var er = Y(q, Ur);
    if (J) {
      D(V, B);
      v($, (function() {
        D(B, V);
        E(B);
      }));
    }
    O(Z, K);
    O(B, U);
    O(U || B, !R && H);
    O(H, q);
    v($, (function() {
      Q();
      g(H, Rr);
      g(H, Nr);
      if (j(q)) {
        Sa(q);
      }
      if (j(H)) {
        Sa(H);
      }
      if (j(U)) {
        Sa(U);
      }
      rr();
      ar();
      er();
    }));
    if (t && !R) {
      v($, X.bind(0, H, Hr));
    }
    if (W) {
      x(H, W);
      v($, E.bind(0, W));
    }
    return [ N, f.bind(0, $) ];
  };
  var xa = function createTrinsicUpdate(r, a) {
    var e = r.D;
    var t = a[0];
    return function(r) {
      var a = ha(), n = a.R;
      var i = t(), v = i.nr;
      var o = r.ir;
      var u = (e || !n) && o;
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
  var Da = function createPaddingUpdate(r, a) {
    var e = a[0], t = a[1];
    var n = r.H, i = r.A, v = r.q, o = r.ar;
    var u = createCache({
      o: Z,
      v: ur()
    }, ur.bind(0, n, "padding", "")), f = u[0], s = u[1];
    return function(r, a, n) {
      var u = s(n), c = u[0], l = u[1];
      var d = ha(), g = d.T, p = d.R;
      var h = e(), w = h.sr;
      var y = r.vr, m = r.ur, b = r.cr;
      var _ = a("paddingAbsolute"), S = _[0], C = _[1];
      var O = !p && m;
      if (y || l || O) {
        var A = f(n);
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
        t({
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
  var Ea = Math.max;
  var za = "visible";
  var La = "hidden";
  var Ia = 42;
  var Ta = {
    o: J,
    v: {
      w: 0,
      h: 0
    }
  };
  var Ma = {
    o: K,
    v: {
      x: La,
      y: La
    }
  };
  var Pa = function getOverflowAmount(r, a, e) {
    var t = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
    var n = {
      w: Ea(0, r.w - a.w - Ea(0, e.w)),
      h: Ea(0, r.h - a.h - Ea(0, e.h))
    };
    return {
      w: n.w > t ? n.w : 0,
      h: n.h > t ? n.h : 0
    };
  };
  var Ra = function conditionalClass(r, a, e) {
    return e ? Y(r, a) : X(r, a);
  };
  var Na = function overflowIsVisible(r) {
    return 0 === r.indexOf(za);
  };
  var Fa = function createOverflowUpdate(r, a) {
    var e = a[0], t = a[1];
    var n = r.H, i = r.A, v = r.q, o = r.G, u = r.ar, f = r.tr;
    var s = ha(), d = s.L, g = s.R, p = s.T, h = s.I;
    var w = !u && !p && (h.x || h.y);
    var y = createCache(Ta, gr.bind(0, v)), m = y[0], b = y[1];
    var _ = createCache(Ta, dr.bind(0, v)), S = _[0], C = _[1];
    var O = createCache(Ta), A = O[0], x = O[1];
    var D = createCache(Ma), E = D[0];
    var z = function fixFlexboxGlue(r, a) {
      style(v, {
        height: ""
      });
      if (a) {
        var t = e(), i = t.lr, o = t.A;
        var u = r.pr, f = r.hr;
        var s = gr(n);
        var c = lr(n);
        var l = "content-box" === style(v, "boxSizing");
        var d = i || l ? o.b + o.t : 0;
        var g = !(h.x && l);
        style(v, {
          height: c.h + s.h + (u.x && g ? f.x : 0) - d
        });
      }
    };
    var L = function getViewportOverflowState(r, a) {
      var e = !p && !r ? Ia : 0;
      var t = function getStatePerAxis(r, t, n) {
        var i = style(v, r);
        var o = a ? a[r] : i;
        var u = "scroll" === o;
        var f = t ? e : n;
        var s = u && !p ? f : 0;
        var c = t && !!e;
        return [ i, u, s, c ];
      };
      var n = t("overflowX", h.x, d.x), i = n[0], o = n[1], u = n[2], f = n[3];
      var s = t("overflowY", h.y, d.y), c = s[0], l = s[1], g = s[2], w = s[3];
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
        yr: {
          x: f,
          y: w
        }
      };
    };
    var I = function setViewportOverflowState(r, a, e, t) {
      var n = function setAxisOverflowStyle(r, a) {
        var e = Na(r);
        var t = a && e && r.replace(za + "-", "") || "";
        return [ a && !e ? r : "", Na(t) ? "hidden" : t ];
      };
      var i = n(e.x, a.x), v = i[0], o = i[1];
      var u = n(e.y, a.y), f = u[0], s = u[1];
      t.overflowX = o && f ? o : v;
      t.overflowY = s && v ? s : f;
      return L(r, t);
    };
    var T = function arrangeViewport(r, a, t, n) {
      if (w) {
        var i = e(), u = i.dr;
        var f = r.hr, s = r.yr;
        var c = s.x, l = s.y;
        var d = f.x, g = f.y;
        var p = n ? "paddingRight" : "paddingLeft";
        var h = u[p];
        var y = u.paddingTop;
        var m = a.w + t.w;
        var b = a.h + t.h;
        var _ = {
          w: g && l ? g + m - h + "px" : "",
          h: d && c ? d + b - y + "px" : ""
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
    var M = function hideNativeScrollbars(r, a, t, n) {
      var i = r.hr, v = r.yr;
      var o = v.x, u = v.y;
      var f = i.x, s = i.y;
      var c = e(), l = c.dr;
      var d = a ? "marginLeft" : "marginRight";
      var g = a ? "paddingLeft" : "paddingRight";
      var p = l[d];
      var h = l.marginBottom;
      var w = l[g];
      var y = l.paddingBottom;
      n.width = "calc(100% + " + (s + -1 * p) + "px)";
      n[d] = -s + p;
      n.marginBottom = -f + h;
      if (t) {
        n[g] = w + (u ? s : 0);
        n.paddingBottom = y + (o ? f : 0);
      }
    };
    var P = function undoViewportArrange(r, a, t) {
      if (w) {
        var n = t || L(r);
        var i = e(), o = i.dr;
        var u = n.yr;
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
          M(n, a, w, p);
          style(v, p);
          Y(v, kr);
        }, n ];
      }
      return [ ar ];
    };
    return function(r, a, o) {
      var s = r.vr, c = r.mr, d = r.ur, w = r.gr, y = r.ir, _ = r.cr;
      var O = e(), D = O.nr, R = O.sr;
      var N = a("nativeScrollbarsOverlaid.show"), F = N[0], j = N[1];
      var V = a("overflow"), B = V[0], k = V[1];
      var U = F && h.x && h.y;
      var H = !u && !g && (s || d || c || j || y);
      var q = Na(B.x);
      var W = Na(B.y);
      var G = q || W;
      var X = b(o);
      var Y = C(o);
      var $ = x(o);
      var J;
      if (j && p) {
        f(Hr, jr, !U);
      }
      if (H) {
        J = L(U);
        z(J, D);
      }
      if (s || w || d || _ || j) {
        if (G) {
          f(qr, Fr, false);
        }
        var K = P(U, R, J), Z = K[0], Q = K[1];
        var rr = X = m(o), ar = rr[0], er = rr[1];
        var tr = Y = S(o), nr = tr[0], ir = tr[1];
        var vr = lr(v);
        var or = nr;
        var ur = vr;
        Z();
        if ((ir || er || j) && Q && !U && T(Q, nr, ar, R)) {
          ur = lr(v);
          or = dr(v);
        }
        $ = A(Pa({
          w: Ea(nr.w, or.w),
          h: Ea(nr.h, or.h)
        }, {
          w: ur.w + Ea(0, vr.w - nr.w),
          h: ur.h + Ea(0, vr.h - nr.h)
        }, ar), o);
      }
      var fr = $, sr = fr[0], cr = fr[1];
      var gr = Y, pr = gr[0], hr = gr[1];
      var wr = X, yr = wr[0], mr = wr[1];
      var br = {
        x: sr.w > 0,
        y: sr.h > 0
      };
      var _r = q && W && (br.x || br.y) || q && br.x && !br.y || W && br.y && !br.x;
      if (w || _ || mr || hr || cr || k || j || H) {
        var Sr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Cr = I(U, br, B, Sr);
        var Or = T(Cr, pr, yr, R);
        if (!u) {
          M(Cr, R, Or, Sr);
        }
        if (H) {
          z(Cr, D);
        }
        if (u) {
          attr(n, Rr, Sr.overflowX);
          attr(n, Nr, Sr.overflowY);
        } else {
          style(v, Sr);
        }
      }
      l(n, Pr, Fr, _r);
      Ra(i, qr, _r);
      !u && Ra(v, qr, G);
      var Ar = E(L(U).wr), xr = Ar[0], Dr = Ar[1];
      t({
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
  var ja = function prepareUpdateHints(r, a, e) {
    var t = {};
    var n = a || {};
    var i = c(r).concat(c(n));
    each(i, (function(a) {
      var i = r[a];
      var v = n[a];
      t[a] = !!(e || i || v);
    }));
    return t;
  };
  var Va = function createStructureSetupUpdate(r, a) {
    var e = r.q;
    var t = ha(), n = t.T, i = t.I, v = t.R;
    var o = !n && (i.x || i.y);
    var u = [ xa(r, a), Da(r, a), Fa(r, a) ];
    return function(r, a, t) {
      var n = ja(assignDeep({
        vr: false,
        gr: false,
        cr: false,
        ir: false,
        Cr: false,
        Sr: false,
        mr: false,
        ur: false
      }, a), {}, t);
      var i = o || !v;
      var f = i && scrollLeft(e);
      var s = i && scrollTop(e);
      var c = n;
      each(u, (function(a) {
        c = ja(c, a(c, r, !!t) || {}, t);
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
  var Ba = "animationstart";
  var ka = "scroll";
  var Ua = 3333333;
  var Ha = function getElmDirectionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var qa = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var Wa = function createSizeObserver(r, a, e) {
    var t = e || {}, n = t.Or, i = void 0 === n ? false : n, o = t.Ar, u = void 0 === o ? false : o;
    var s = ha(), c = s.P;
    var l = L('<div class="' + Wr + '"><div class="' + Xr + '"></div></div>');
    var d = l[0];
    var g = d.firstChild;
    var p = Ha.bind(0, d);
    var h = createCache({
      v: void 0,
      u: true,
      o: function _equal(r, a) {
        return !(!r || !qa(r) && qa(a));
      }
    }), w = h[0];
    var y = function onSizeChangedCallbackProxy(r) {
      var e = isArray(r) && r.length > 0 && isObject(r[0]);
      var t = !e && isBoolean(r[0]);
      var n = false;
      var v = false;
      var o = true;
      if (e) {
        var u = w(r.pop().contentRect), f = u[0], s = u[2];
        var l = qa(f);
        var g = qa(s);
        n = !s || !l;
        v = !g && l;
        o = !n;
      } else if (t) {
        o = r[1];
      } else {
        v = true === r;
      }
      if (i && o) {
        var p = t ? r[0] : Ha(d);
        scrollLeft(d, p ? c.n ? -Ua : c.i ? 0 : Ua : Ua);
        scrollTop(d, Ua);
      }
      if (!n) {
        a({
          vr: !t,
          Dr: t ? r : void 0,
          Ar: !!v
        });
      }
    };
    var m = [];
    var b = u ? y : false;
    var _;
    if (k) {
      var S = new k(y);
      S.observe(g);
      v(m, (function() {
        S.disconnect();
      }));
    } else {
      var C = L('<div class="' + $r + '" dir="ltr"><div class="' + $r + '"><div class="' + Jr + '"></div></div><div class="' + $r + '"><div class="' + Jr + '" style="width: 200%; height: 200%"></div></div></div>');
      O(g, C);
      Y(g, Yr);
      var x = C[0];
      var D = x.lastChild;
      var z = x.firstChild;
      var I = null == z ? void 0 : z.firstChild;
      var T = cr(x);
      var M = T;
      var P = false;
      var R;
      var N = function reset() {
        scrollLeft(z, Ua);
        scrollTop(z, Ua);
        scrollLeft(D, Ua);
        scrollTop(D, Ua);
      };
      var F = function onResized(r) {
        R = 0;
        if (P) {
          T = M;
          y(true === r);
        }
      };
      var j = function onScroll(r) {
        M = cr(x);
        P = !r || !J(M, T);
        if (r) {
          Cr(r);
          if (P && !R) {
            U(R);
            R = H(F);
          }
        } else {
          F(false === r);
        }
        N();
      };
      v(m, [ br(z, ka, j), br(D, ka, j) ]);
      style(I, {
        width: Ua,
        height: Ua
      });
      N();
      b = u ? j.bind(0, false) : N;
    }
    if (i) {
      _ = createCache({
        v: !p()
      }, p);
      var V = _, B = V[0];
      v(m, br(d, ka, (function(r) {
        var a = B();
        var e = a[0], t = a[1];
        if (t) {
          X(g, "ltr rtl");
          if (e) {
            Y(g, "rtl");
          } else {
            Y(g, "ltr");
          }
          y(a);
        }
        Cr(r);
      })));
    }
    if (b) {
      Y(d, Gr);
      v(m, br(d, Ba, b, {
        O: !!k
      }));
    }
    A(r, d);
    return function() {
      f(m);
      E(d);
    };
  };
  var Ga = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var Xa = function createTrinsicObserver(r, a) {
    var e = z(Kr);
    var t = [];
    var n = createCache({
      v: false
    }), i = n[0];
    var o = function triggerOnTrinsicChangedCallback(r) {
      if (r) {
        var e = i(Ga(r));
        var t = e[1];
        if (t) {
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
      v(t, (function() {
        u.disconnect();
      }));
    } else {
      var s = function onSizeChanged() {
        var r = cr(e);
        o(r);
      };
      v(t, Wa(e, s));
      s();
    }
    A(r, e);
    return function() {
      f(t);
      E(e);
    };
  };
  var Ya = function createEventContentChange(r, a, e) {
    var t;
    var n = false;
    var i = function destroy() {
      n = true;
    };
    var o = function updateElements(i) {
      if (e) {
        var o = e.reduce((function(a, e) {
          if (e) {
            var t = e[0];
            var n = e[1];
            var o = n && t && (i ? i(t) : h(t, r));
            if (o && o.length && n && isString(n)) {
              v(a, [ o, n.trim() ], true);
            }
          }
          return a;
        }), []);
        each(o, (function(r) {
          return each(r[0], (function(e) {
            var i = r[1];
            var v = t.get(e);
            if (v) {
              var o = v[0];
              var u = v[1];
              if (o === i) {
                u();
              }
            }
            var f = br(e, i, (function(r) {
              if (n) {
                f();
                t.delete(e);
              } else {
                a(r);
              }
            }));
            t.set(e, [ i, f ]);
          }));
        }));
      }
    };
    if (e) {
      t = new WeakMap;
      o();
    }
    return [ i, o ];
  };
  var $a = function createDOMObserver(r, a, e, t) {
    var n = false;
    var o = t || {}, f = o.Er, s = o.zr, c = o.Lr, l = o.Ir, d = o.Tr, g = o.Mr;
    var p = Ya(r, er((function() {
      if (n) {
        e(true);
      }
    }), {
      g: 33,
      p: 99
    }), c), w = p[0], m = p[1];
    var b = f || [];
    var _ = s || [];
    var S = b.concat(_);
    var C = function observerCallback(n) {
      var o = d || ar;
      var f = g || ar;
      var s = [];
      var c = [];
      var p = false;
      var w = false;
      var b = false;
      each(n, (function(e) {
        var n = e.attributeName, u = e.target, d = e.type, g = e.oldValue, h = e.addedNodes;
        var m = "attributes" === d;
        var S = "childList" === d;
        var C = r === u;
        var O = m && isString(n) ? attr(u, n) : 0;
        var A = 0 !== O && g !== O;
        var x = i(_, n) > -1 && A;
        if (a && !C) {
          var D = !m;
          var E = m && x;
          var z = E && l && y(u, l);
          var L = z ? !o(u, n, g, O) : D || E;
          var I = L && !f(e, !!z, r, t);
          v(c, h);
          w = w || I;
          b = b || S;
        }
        if (!a && C && A && !o(u, n, g, O)) {
          v(s, n);
          p = p || x;
        }
      }));
      if (b && !u(c)) {
        m((function(r) {
          return c.reduce((function(a, e) {
            v(a, h(r, e));
            return y(e, r) ? v(a, e) : a;
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
    n = true;
    return [ function() {
      if (n) {
        w();
        O.disconnect();
        n = false;
      }
    }, function() {
      if (n) {
        C(O.takeRecords());
      }
    } ];
  };
  var Ja = "[" + Pr + "]";
  var Ka = "." + Br;
  var Za = [ "tabindex" ];
  var Qa = [ "wrap", "cols", "rows" ];
  var re = [ "id", "class", "style", "open" ];
  var ae = function createStructureSetupObservers(r, a, e) {
    var t;
    var n;
    var v;
    var o = a[1];
    var u = r.H, f = r.q, s = r.D, l = r.K, d = r.ar, p = r.er, h = r.tr;
    var w = ha(), y = w.T, m = w.R;
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
      var t = gr(f);
      r && h(qr, Fr, true);
      return {
        w: e.w + a.w + t.w,
        h: e.h + a.h + t.h
      };
    })), _ = b[0];
    var C = l ? Qa : re.concat(Qa);
    var O = er(e, {
      g: function _timeout() {
        return t;
      },
      p: function _maxDelay() {
        return n;
      },
      m: function _mergeParams(r, a) {
        var e = r[0];
        var t = a[0];
        return [ c(e).concat(c(t)).reduce((function(r, a) {
          r[a] = e[a] || t[a];
          return r;
        }), {}) ];
      }
    });
    var A = function updateViewportAttrsFromHost(r) {
      each(r || Za, (function(r) {
        if (i(Za, r) > -1) {
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
      var a = r[0], t = r[1];
      o({
        nr: a
      });
      e({
        ir: t
      });
    };
    var D = function onSizeChanged(r) {
      var a = r.vr, t = r.Dr, n = r.Ar;
      var i = !a || n ? e : O;
      var v = false;
      if (t) {
        var u = t[0], f = t[1];
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
      var a = _(), t = a[1];
      var n = r ? e : O;
      if (t) {
        n({
          ur: true
        });
      }
    };
    var z = function onHostMutation(r, a) {
      if (a) {
        O({
          mr: true
        });
      } else if (!d) {
        A(r);
      }
    };
    var L = (s || !m) && Xa(u, x);
    var I = !d && Wa(u, D, {
      Ar: true,
      Or: !y
    });
    var T = $a(u, false, z, {
      zr: re,
      Er: re.concat(Za)
    }), M = T[0];
    var P = d && new k(D.bind(0, {
      vr: true
    }));
    P && P.observe(u);
    A();
    return [ function(r) {
      var a = r("updating.ignoreMutation"), e = a[0];
      var i = r("updating.attributes"), o = i[0], u = i[1];
      var c = r("updating.elementEvents"), l = c[0], d = c[1];
      var g = r("updating.debounce"), p = g[0], h = g[1];
      var w = d || u;
      var y = function ignoreMutationFromOptions(r) {
        return isFunction(e) && e(r);
      };
      if (w) {
        if (v) {
          v[1]();
          v[0]();
        }
        v = $a(s || f, true, E, {
          zr: C.concat(o || []),
          Er: C.concat(o || []),
          Lr: l,
          Ir: Ja,
          Mr: function _ignoreContentChange(r, a) {
            var e = r.target, t = r.attributeName;
            var n = !a && t ? S(e, Ja, Ka) : false;
            return n || !!y(r);
          }
        });
      }
      if (h) {
        O._();
        if (isArray(p)) {
          var m = p[0];
          var b = p[1];
          t = isNumber(m) ? m : false;
          n = isNumber(b) ? b : false;
        } else if (isNumber(p)) {
          t = p;
          n = false;
        } else {
          t = false;
          n = false;
        }
      }
    }, function() {
      v && v[0]();
      L && L();
      I && I();
      P && P.disconnect();
      M();
    } ];
  };
  var ee = {
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
    nr: false,
    sr: false
  };
  var te = function createStructureSetup(r, a) {
    var e = zr(a, {});
    var t = Lr(ee);
    var n = new Set;
    var i = t[0];
    var v = function runOnUpdatedListeners(r, a, e) {
      f(n, [ r, a || {}, !!e ]);
    };
    var o = Aa(r), u = o[0], s = o[1];
    var c = Va(u, t);
    var l = ae(u, t, (function(r) {
      v(c(e, r));
    })), d = l[0], g = l[1];
    var p = i.bind(0);
    p.Pr = function(r) {
      n.add(r);
    };
    p.Rr = u;
    return [ function(r, e) {
      var t = zr(a, r, e);
      d(t);
      v(c(t, {}, e));
    }, p, function() {
      n.clear();
      g();
      s();
    } ];
  };
  var ne = function generateScrollbarDOM(r) {
    var a = z(Zr + " " + r);
    var e = z(aa);
    var t = z(ea);
    O(a, e);
    O(e, t);
    return {
      Nr: a,
      Fr: e,
      jr: t
    };
  };
  var ie = function createScrollbarsSetupElements(r, a) {
    var e = ha(), t = e.F;
    var n = t(), i = n.Vr;
    var v = a.W, o = a.H, u = a.q, f = a.rr;
    var s = !f && r.scrollbarsSlot;
    var c = ma([ v, o, u ], (function() {
      return o;
    }), i, s);
    var l = ne(Qr);
    var d = ne(ra);
    var g = l.Nr;
    var p = d.Nr;
    O(c, g);
    O(c, p);
    return [ {
      Br: l,
      kr: d
    }, E.bind(0, [ g, p ]) ];
  };
  var ve = function createScrollbarsSetup(r, a, e) {
    var t = Lr({});
    var n = t[0];
    var i = ie(r, e), v = i[0], o = i[1];
    var u = n.bind(0);
    u.Rr = v;
    return [ function(r, e) {
      var t = zr(a, r, e);
      console.log(t);
    }, u, function() {
      o();
    } ];
  };
  var oe = {};
  var ue = function getPlugins() {
    return assignDeep({}, oe);
  };
  var fe = function addPlugin(r) {
    return each(isArray(r) ? r : [ r ], (function(r) {
      oe[r[0]] = r[1];
    }));
  };
  var se = "__osOptionsValidationPlugin";
  var ce = new Set;
  var le = new WeakMap;
  var de = function addInstance(r, a) {
    le.set(r, a);
    ce.add(r);
  };
  var ge = function removeInstance(r) {
    le.delete(r);
    ce.delete(r);
  };
  var pe = function getInstance(r) {
    return le.get(r);
  };
  var he = function OverlayScrollbars(r, a, e) {
    var t = ha(), n = t.V, i = t.I, v = t.N;
    var o = ue();
    var u = isHTMLElement(r) ? r : r.target;
    var f = pe(u);
    if (f) {
      return f;
    }
    var s = o[se];
    var l = function validateOptions(r) {
      var a = r || {};
      var e = s && s.Ur;
      return e ? e(a, true) : a;
    };
    var d = assignDeep({}, n(), l(a));
    var g = Dr(e), p = g[0], h = g[1], w = g[2];
    if (i.x && i.y && !d.nativeScrollbarsOverlaid.initialize) {
      w("initializationWithdrawn");
    }
    var y = te(r, d), m = y[0], b = y[1], _ = y[2];
    var S = ve(r, d, b.Rr), C = S[0], O = S[2];
    var A = function update(r, a) {
      m(r, a);
      C(r, a);
    };
    var x = v(A.bind(0, {}, true));
    b.Pr((function(r, a, e) {
      var t = r.vr, n = r.cr, i = r.ir, v = r.Cr, o = r.Sr, u = r.ur, f = r.mr;
      w("updated", {
        updateHints: {
          sizeChanged: t,
          directionChanged: n,
          heightIntrinsicChanged: i,
          overflowAmountChanged: v,
          overflowStyleChanged: o,
          contentMutation: u,
          hostMutation: f
        },
        changedOptions: a,
        force: e
      });
    }));
    var D = {
      options: function options(r) {
        if (r) {
          var a = ia(d, l(r));
          if (!isEmptyObject(a)) {
            assignDeep(d, a);
            A(a);
          }
        }
        return assignDeep({}, d);
      },
      on: p,
      off: h,
      state: function state() {
        var r = b(), a = r.br, e = r.wr, t = r._r, n = r.A, i = r.lr;
        return assignDeep({}, {
          overflowAmount: a,
          overflowStyle: e,
          hasOverflow: t,
          padding: n,
          paddingAbsolute: i
        });
      },
      elements: function elements() {
        var r = b.Rr, a = r.W, e = r.H, t = r.A, n = r.q, i = r.D;
        return assignDeep({}, {
          target: a,
          host: e,
          padding: t || n,
          viewport: n,
          content: i || n
        });
      },
      update: function update(r) {
        A({}, r);
      },
      destroy: function destroy() {
        ge(u);
        x();
        h();
        O();
        _();
        w("destroyed");
      }
    };
    each(c(o), (function(r) {
      var a = o[r];
      if (isFunction(a)) {
        a(OverlayScrollbars, D);
      }
    }));
    D.update(true);
    de(u, D);
    w("initialized");
    return D;
  };
  he.plugin = fe;
  he.env = function() {
    var r = ha(), a = r.L, e = r.I, t = r.T, n = r.P, i = r.R, v = r.M, o = r.k, u = r.U, f = r.F, s = r.j, c = r.V, l = r.B;
    return assignDeep({}, {
      scrollbarSize: a,
      scrollbarIsOverlaid: e,
      scrollbarStyling: t,
      rtlScrollBehavior: n,
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
  return he;
}));
//# sourceMappingURL=overlayscrollbars.js.map
