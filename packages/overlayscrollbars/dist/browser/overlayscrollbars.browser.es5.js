/*!
 * OverlayScrollbars
 * Version: 2.0.0-beta.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */

var OverlayScrollbars = function(r) {
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
    var e = d(a) || n;
    if (e) {
      var t = n ? "" : {};
      if (r) {
        var i = window.getComputedStyle(r, null);
        t = n ? Ar(r, i, a) : a.reduce((function(a, n) {
          a[n] = Ar(r, i, n);
          return a;
        }), t);
      }
      return t;
    }
    r && each(E(a), (function(n) {
      return Pr(r, n, a[n]);
    }));
  }
  function getDefaultExportFromCjs(r) {
    return r && r.v && Object.prototype.hasOwnProperty.call(r, "default") ? r["default"] : r;
  }
  var a = function createCache(r, a) {
    var n = r.o, e = r.u, t = r.g;
    var i = n;
    var v;
    var o = function cacheUpdateContextual(r, a) {
      var n = i;
      var o = r;
      var u = a || (e ? !e(n, o) : n !== o);
      if (u || t) {
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
  var e = Object.prototype, t = e.toString, i = e.hasOwnProperty;
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
    var n = f(a) && a > -1 && a % 1 == 0;
    return d(r) || !s(r) && n ? a > 0 && g(r) ? a - 1 in r : true : false;
  };
  var p = function isPlainObject(r) {
    if (!r || !g(r) || "object" !== u(r)) {
      return false;
    }
    var a;
    var n = "constructor";
    var e = r[n];
    var t = e && e.prototype;
    var o = i.call(r, n);
    var f = t && i.call(t, "isPrototypeOf");
    if (e && !o && !f) {
      return false;
    }
    for (a in r) {}
    return v(a) || i.call(r, a);
  };
  var b = function isHTMLElement(r) {
    var a = HTMLElement;
    return r ? a ? r instanceof a : r.nodeType === n : false;
  };
  var w = function isElement(r) {
    var a = Element;
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
    var e = function runFn(r) {
      return r && r.apply(void 0, a || []);
    };
    each(r, e);
    !n && (r.length = 0);
  };
  var x = function hasOwnProperty(r, a) {
    return Object.prototype.hasOwnProperty.call(r, a);
  };
  var E = function keys(r) {
    return r ? Object.keys(r) : [];
  };
  var A = function assignDeep(r, a, n, e, t, i, v) {
    var u = [ a, n, e, t, i, v ];
    if (("object" !== typeof r || o(r)) && !s(r)) {
      r = {};
    }
    each(u, (function(a) {
      each(E(a), (function(n) {
        var e = a[n];
        if (r === e) {
          return true;
        }
        var t = d(e);
        if (e && (p(e) || t)) {
          var i = r[n];
          var v = i;
          if (t && !d(i)) {
            v = [];
          } else if (!t && !p(i)) {
            v = {};
          }
          r[n] = assignDeep(v, e);
        } else {
          r[n] = e;
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
  var z = function getSetProp(r, a, n, e) {
    if (v(e)) {
      return n ? n[r] : a;
    }
    n && (l(e) || f(e)) && (n[r] = e);
  };
  var L = function attr(r, a, n) {
    if (v(n)) {
      return r ? r.getAttribute(a) : null;
    }
    r && r.setAttribute(a, n);
  };
  var T = function attrClass(r, a, n, e) {
    if (n) {
      var t = L(r, a) || "";
      var i = new Set(t.split(" "));
      i[e ? "add" : "delete"](n);
      L(r, a, S(i).join(" ").trim());
    }
  };
  var H = function hasAttrClass(r, a, n) {
    var e = L(r, a) || "";
    var t = new Set(e.split(" "));
    return t.has(n);
  };
  var D = function removeAttr(r, a) {
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
    var n = [];
    var e = a ? w(a) ? a : null : document;
    return e ? y(n, e.querySelectorAll(r)) : n;
  };
  var k = function findFirst(r, a) {
    var n = a ? w(a) ? a : null : document;
    return n ? n.querySelector(r) : null;
  };
  var j = function is(r, a) {
    if (w(r)) {
      var n = I.matches || I.msMatchesSelector;
      return n.call(r, a);
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
    if (w(r)) {
      var n = I.closest;
      if (n) {
        return n.call(r, a);
      }
      do {
        if (j(r, a)) {
          return r;
        }
        r = F(r);
      } while (r);
    }
    return null;
  };
  var U = function liesBetween(r, a, n) {
    var e = r && q(r, a);
    var t = r && k(n, e);
    var i = q(t, a) === e;
    return e && t ? e === r || t === r || i && q(q(r, n), a) !== e : false;
  };
  var N = function before(r, a, n) {
    if (n && r) {
      var e = a;
      var t;
      if (h(n)) {
        t = document.createDocumentFragment();
        each(n, (function(r) {
          if (r === e) {
            e = r.previousSibling;
          }
          t.appendChild(r);
        }));
      } else {
        t = n;
      }
      if (a) {
        if (!e) {
          e = r.firstChild;
        } else if (e !== a) {
          e = e.nextSibling;
        }
      }
      r.insertBefore(t, e || null);
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
      L(a, "class", r);
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
  var nr = {};
  var er = function cssProperty(r) {
    var a = nr[r];
    if (x(nr, r)) {
      return a;
    }
    var n = J(r);
    var e = K();
    each(Q, (function(t) {
      var i = t.replace(/-/g, "");
      var v = [ r, t + r, i + n, J(i) + n ];
      return !(a = v.find((function(r) {
        return void 0 !== e[r];
      })));
    }));
    return nr[r] = a || "";
  };
  var tr = function jsAPI(r) {
    var a = ar[r] || window[r];
    if (x(ar, r)) {
      return a;
    }
    each(rr, (function(n) {
      a = a || window[n + J(r)];
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
  var dr = function classListAction(r, a, n) {
    var e = r && r.classList;
    var t;
    var i = 0;
    var v = false;
    if (e && a && l(a)) {
      var o = a.match(sr) || [];
      v = o.length > 0;
      while (t = o[i++]) {
        v = !!n(e, t) && v;
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
  var _r = function equal(r, a, n, e) {
    if (r && a) {
      var t = true;
      each(n, (function(n) {
        var i = e ? e(r[n]) : r[n];
        var v = e ? e(a[n]) : a[n];
        if (i !== v) {
          t = false;
        }
      }));
      return t;
    }
    return false;
  };
  var br = function equalWH(r, a) {
    return _r(r, a, [ "w", "h" ]);
  };
  var wr = function equalXY(r, a) {
    return _r(r, a, [ "x", "y" ]);
  };
  var mr = function equalTRBL(r, a) {
    return _r(r, a, [ "t", "r", "b", "l" ]);
  };
  var yr = function equalBCRWH(r, a, n) {
    return _r(r, a, [ "width", "height" ], n && function(r) {
      return Math.round(r);
    });
  };
  var Sr = function noop() {};
  var Cr = function debounce(r, a) {
    var n;
    var e;
    var t;
    var i = Sr;
    var v = a || {}, o = v.p, u = v._, l = v.m;
    var c = function invokeFunctionToDebounce(a) {
      i();
      cr(n);
      n = e = void 0;
      i = Sr;
      r.apply(this, a);
    };
    var d = function mergeParms(r) {
      return l && e ? l(e, r) : r;
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
        var b = a > 0 ? cr : ur;
        var w = d(r);
        var m = w || r;
        var y = c.bind(0, m);
        i();
        var C = p(y, a);
        i = function clear() {
          return b(C);
        };
        if (h && !n) {
          n = lr(g, l);
        }
        e = t = m;
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
    var n = a ? parseFloat(r) : parseInt(r, 10);
    return n === n ? n : 0;
  };
  var Er = function adaptCSSVal(r, a) {
    return !Or[r.toLowerCase()] && f(a) ? a + "px" : a;
  };
  var Ar = function getCSSVal(r, a, n) {
    return null != a ? a[n] || a.getPropertyValue(n) : r.style[n];
  };
  var Pr = function setCSSVal(r, a, n) {
    try {
      var e = r.style;
      if (!v(e[a])) {
        e[a] = Er(a, n);
      } else {
        e.setProperty(a, n);
      }
    } catch (t) {}
  };
  var zr = function directionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var Lr = function topRightBottomLeft(r, a, n) {
    var e = a ? a + "-" : "";
    var t = n ? "-" + n : "";
    var i = e + "top" + t;
    var v = e + "right" + t;
    var o = e + "bottom" + t;
    var u = e + "left" + t;
    var f = style(r, [ i, v, o, u ]);
    return {
      t: xr(f[i]),
      r: xr(f[v]),
      b: xr(f[o]),
      l: xr(f[u])
    };
  };
  var Tr = Math.round;
  var Hr = {
    w: 0,
    h: 0
  };
  var Dr = function windowSize() {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    };
  };
  var Mr = function offsetSize(r) {
    return r ? {
      w: r.offsetWidth,
      h: r.offsetHeight
    } : Hr;
  };
  var Rr = function clientSize(r) {
    return r ? {
      w: r.clientWidth,
      h: r.clientHeight
    } : Hr;
  };
  var Ir = function scrollSize(r) {
    return r ? {
      w: r.scrollWidth,
      h: r.scrollHeight
    } : Hr;
  };
  var Vr = function fractionalSize(r) {
    var a = parseFloat(style(r, "height")) || 0;
    var n = parseFloat(style(r, "width")) || 0;
    return {
      w: n - Tr(n),
      h: a - Tr(a)
    };
  };
  var kr = function getBoundingClientRect(r) {
    return r.getBoundingClientRect();
  };
  var jr;
  var Br = function supportPassiveEvents() {
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
  var Fr = function splitEventNames(r) {
    return r.split(" ");
  };
  var qr = function off(r, a, n, e) {
    each(Fr(a), (function(a) {
      r.removeEventListener(a, n, e);
    }));
  };
  var Ur = function on(r, a, n, e) {
    var t;
    var i = Br();
    var v = null != (t = i && e && e.C) ? t : i;
    var o = e && e.O || false;
    var u = e && e.A || false;
    var f = [];
    var l = i ? {
      passive: v,
      capture: o
    } : o;
    each(Fr(a), (function(a) {
      var e = u ? function(t) {
        r.removeEventListener(a, e, o);
        n && n(t);
      } : n;
      y(f, qr.bind(null, r, a, e, o));
      r.addEventListener(a, e, l);
    }));
    return O.bind(0, f);
  };
  var Nr = function stopPropagation(r) {
    return r.stopPropagation();
  };
  var Yr = function preventDefault(r) {
    return r.preventDefault();
  };
  var Wr = {
    x: 0,
    y: 0
  };
  var Gr = function absoluteCoordinates(r) {
    var a = r ? kr(r) : 0;
    return a ? {
      x: a.left + window.pageYOffset,
      y: a.top + window.pageXOffset
    } : Wr;
  };
  var Xr = function manageListener(r, a) {
    each(d(a) ? a : [ a ], r);
  };
  var Zr = function createEventListenerHub(r) {
    var a = new Map;
    var n = function removeEvent(r, n) {
      if (r) {
        var e = a.get(r);
        Xr((function(r) {
          if (e) {
            e[r ? "delete" : "clear"](r);
          }
        }), n);
      } else {
        a.forEach((function(r) {
          r.clear();
        }));
        a.clear();
      }
    };
    var e = function addEvent(r, e) {
      var t = a.get(r) || new Set;
      a.set(r, t);
      Xr((function(r) {
        r && t.add(r);
      }), e);
      return n.bind(0, r, e);
    };
    var t = function triggerEvent(r, n) {
      var e = a.get(r);
      each(S(e), (function(r) {
        if (n && !C(n)) {
          r.apply(0, n);
        } else {
          r();
        }
      }));
    };
    var i = E(r);
    each(i, (function(a) {
      e(a, r[a]);
    }));
    return [ e, n, t ];
  };
  var $r = function opsStringify(r) {
    return JSON.stringify(r, (function(r, a) {
      if (s(a)) {
        throw new Error;
      }
      return a;
    }));
  };
  var Jr = {
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
      autoHideDelay: 1300,
      dragScroll: true,
      clickScroll: false,
      pointers: [ "mouse", "touch", "pen" ]
    }
  };
  var Kr = function getOptionsDiff(r, a) {
    var n = {};
    var e = E(a).concat(E(r));
    each(e, (function(e) {
      var t = r[e];
      var i = a[e];
      if (g(t) && g(i)) {
        A(n[e] = {}, getOptionsDiff(t, i));
      } else if (x(a, e) && i !== t) {
        var v = true;
        if (d(t) || d(i)) {
          try {
            if ($r(t) === $r(i)) {
              v = false;
            }
          } catch (o) {}
        }
        if (v) {
          n[e] = i;
        }
      }
    }));
    return n;
  };
  var Qr = "os-environment";
  var ra = Qr + "-flexbox-glue";
  var aa = ra + "-max";
  var na = "data-overlayscrollbars";
  var ea = na + "-overflow-x";
  var ta = na + "-overflow-y";
  var ia = "overflowVisible";
  var va = "scrollbarHidden";
  var oa = "updating";
  var ua = "os-padding";
  var fa = "os-viewport";
  var la = fa + "-arrange";
  var ca = "os-content";
  var sa = fa + "-scrollbar-hidden";
  var da = "os-overflow-visible";
  var ga = "os-size-observer";
  var ha = ga + "-appear";
  var pa = ga + "-listener";
  var _a = pa + "-scroll";
  var ba = pa + "-item";
  var wa = ba + "-final";
  var ma = "os-trinsic-observer";
  var ya = "os-scrollbar";
  var Sa = ya + "-rtl";
  var Ca = ya + "-horizontal";
  var Oa = ya + "-vertical";
  var xa = ya + "-track";
  var Ea = ya + "-handle";
  var Aa = ya + "-visible";
  var Pa = ya + "-cornerless";
  var za = ya + "-transitionless";
  var La = ya + "-interaction";
  var Ta = ya + "-unusable";
  var Ha = ya + "-auto-hidden";
  var Da = xa + "-interactive";
  var Ma = Ea + "-interactive";
  var Ra = {};
  var Ia = function getPlugins() {
    return Ra;
  };
  var Va = function addPlugin(r) {
    each(d(r) ? r : [ r ], (function(r) {
      var a = E(r)[0];
      Ra[a] = r[a];
    }));
  };
  var ka = {
    exports: {}
  };
  (function(r) {
    function _extends() {
      r.exports = _extends = Object.assign ? Object.assign.bind() : function(r) {
        for (var a = 1; a < arguments.length; a++) {
          var n = arguments[a];
          for (var e in n) {
            if (Object.prototype.hasOwnProperty.call(n, e)) {
              r[e] = n[e];
            }
          }
        }
        return r;
      }, r.exports.v = true, r.exports["default"] = r.exports;
      return _extends.apply(this, arguments);
    }
    r.exports = _extends, r.exports.v = true, r.exports["default"] = r.exports;
  })(ka);
  var ja = getDefaultExportFromCjs(ka.exports);
  var Ba = {
    boolean: "__TPL_boolean_TYPE__",
    number: "__TPL_number_TYPE__",
    string: "__TPL_string_TYPE__",
    array: "__TPL_array_TYPE__",
    object: "__TPL_object_TYPE__",
    function: "__TPL_function_TYPE__",
    null: "__TPL_null_TYPE__"
  };
  var Fa = function validateRecursive(r, a, n, e) {
    var t = {};
    var i = ja({}, a);
    var o = E(r).filter((function(r) {
      return x(a, r);
    }));
    each(o, (function(o) {
      var f = a[o];
      var c = r[o];
      var s = p(c);
      var g = e ? e + "." : "";
      if (s && p(f)) {
        var h = validateRecursive(c, f, n, g + o), b = h[0], w = h[1];
        t[o] = b;
        i[o] = w;
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
          each(Ba, (function(n, e) {
            if (n === r) {
              a = e;
            }
          }));
          var n = v(a);
          if (n && l(f)) {
            var e = r.split(" ");
            m = !!e.find((function(r) {
              return r === f;
            }));
            y(S, e);
          } else {
            m = Ba[O] === r;
          }
          y(C, n ? Ba.string : a);
          return !m;
        }));
        if (m) {
          t[o] = f;
        } else if (n) {
          console.warn('The option "' + g + o + "\" wasn't set, because it doesn't accept the type [ " + O.toUpperCase() + ' ] with the value of "' + f + '".\r\n' + "Accepted types are: [ " + C.join(", ").toUpperCase() + " ].\r\n" + (S.length > 0 ? "\r\nValid strings are: [ " + S.join(", ") + " ]." : ""));
        }
        delete i[o];
      }
    }));
    return [ t, i ];
  };
  var qa = function validateOptions(r, a, n) {
    return Fa(r, a, n);
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
    P: function _(r, a) {
      var n = qa($a, r, a), e = n[0], t = n[1];
      return ja({}, t, e);
    }
  }, Ua;
  var Ka;
  var Qa = 3333333;
  var rn = "scroll";
  var an = "__osSizeObserverPlugin";
  var nn = (Ka = {}, Ka[an] = {
    P: function _(r, a, n) {
      var e = $('<div class="' + ba + '" dir="ltr"><div class="' + ba + '"><div class="' + wa + '"></div></div><div class="' + ba + '"><div class="' + wa + '" style="width: 200%; height: 200%"></div></div></div>');
      Y(r, e);
      pr(r, _a);
      var t = e[0];
      var i = t.lastChild;
      var v = t.firstChild;
      var o = null == v ? void 0 : v.firstChild;
      var u = Mr(t);
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
        f = Mr(t);
        l = !r || !br(f, u);
        if (r) {
          Nr(r);
          if (l && !c) {
            ur(c);
            c = fr(d);
          }
        } else {
          d(false === r);
        }
        s();
      };
      var h = y([], [ Ur(v, rn, g), Ur(i, rn, g) ]);
      style(o, {
        width: Qa,
        height: Qa
      });
      fr(s);
      return [ n ? g.bind(0, false) : s, h ];
    }
  }, Ka);
  var en;
  var tn = 0;
  var vn = Math.round, un = Math.abs;
  var fn = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var a = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / a;
  };
  var ln = function diffBiggerThanOne(r, a) {
    var n = un(r);
    var e = un(a);
    return !(n === e || n + 1 === e || n - 1 === e);
  };
  var cn = "__osScrollbarsHidingPlugin";
  var sn = (en = {}, en[cn] = {
    L: function _createUniqueViewportArrangeElement(r) {
      var a = r.T, n = r.H, e = r.D;
      var t = !e && !a && (n.x || n.y);
      var i = t ? document.createElement("style") : false;
      if (i) {
        L(i, "id", la + "-" + tn);
        tn++;
      }
      return i;
    },
    M: function _overflowUpdateSegment(r, a, n, e, t, i, v) {
      var o = function arrangeViewport(a, i, v, o) {
        if (r) {
          var u = t(), f = u.R;
          var l = a.I, c = a.V;
          var s = c.x, d = c.y;
          var g = l.x, h = l.y;
          var p = o ? "paddingRight" : "paddingLeft";
          var b = f[p];
          var w = f.paddingTop;
          var m = i.w + v.w;
          var y = i.h + v.h;
          var S = {
            w: h && d ? h + m - b + "px" : "",
            h: g && s ? g + y - w + "px" : ""
          };
          if (e) {
            var C = e.sheet;
            if (C) {
              var O = C.cssRules;
              if (O) {
                if (!O.length) {
                  C.insertRule("#" + L(e, "id") + " + ." + la + "::before {}", 0);
                }
                var x = O[0].style;
                x.width = S.w;
                x.height = S.h;
              }
            }
          } else {
            style(n, {
              "--os-vaw": S.w,
              "--os-vah": S.h
            });
          }
        }
        return r;
      };
      var u = function undoViewportArrange(e, o, u) {
        if (r) {
          var f = u || i(e);
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
          var b = style(n, E(h));
          hr(n, la);
          if (!a) {
            h.height = "";
          }
          style(n, h);
          return [ function() {
            v(f, o, r, b);
            style(n, b);
            pr(n, la);
          }, f ];
        }
        return [ Sr ];
      };
      return [ o, u ];
    },
    k: function _envWindowZoom() {
      var r = {
        w: 0,
        h: 0
      };
      var a = 0;
      return function(n, e, t) {
        var i = Dr();
        var v = {
          w: i.w - r.w,
          h: i.h - r.h
        };
        if (0 === v.w && 0 === v.h) {
          return;
        }
        var o = {
          w: un(v.w),
          h: un(v.h)
        };
        var u = {
          w: un(vn(i.w / (r.w / 100))),
          h: un(vn(i.h / (r.h / 100)))
        };
        var f = fn();
        var l = o.w > 2 && o.h > 2;
        var c = !ln(u.w, u.h);
        var s = f !== a && f > 0;
        var d = l && c && s;
        if (d) {
          var g = e(), h = g[0], p = g[1];
          A(n.j, h);
          if (p) {
            t();
          }
        }
        r = i;
        a = f;
      };
    }
  }, en);
  var dn;
  var gn = function getNativeScrollbarSize(r, a, n, e) {
    Y(r, a);
    var t = Rr(a);
    var i = Mr(a);
    var v = Vr(n);
    e && X(a);
    return {
      x: i.h - t.h + v.h,
      y: i.w - t.w + v.w
    };
  };
  var hn = function getNativeScrollbarsHiding(r) {
    var a = false;
    var n = pr(r, sa);
    try {
      a = "none" === style(r, er("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (e) {}
    n();
    return a;
  };
  var pn = function getRtlScrollBehavior(r, a) {
    var n = "hidden";
    style(r, {
      overflowX: n,
      overflowY: n,
      direction: "rtl"
    });
    M(r, 0);
    var e = Gr(r);
    var t = Gr(a);
    M(r, -999);
    var i = Gr(a);
    return {
      i: e.x === t.x,
      n: t.x !== i.x
    };
  };
  var _n = function getFlexboxGlue(r, a) {
    var n = pr(r, ra);
    var e = kr(r);
    var t = kr(a);
    var i = yr(t, e, true);
    var v = pr(r, aa);
    var o = kr(r);
    var u = kr(a);
    var f = yr(u, o, true);
    n();
    v();
    return i && f;
  };
  var bn = function createEnvironment() {
    var r = document, n = r.body;
    var e = $('<div class="' + Qr + '"><div></div></div>');
    var t = e[0];
    var i = t.firstChild;
    var v = Zr(), o = v[0], u = v[2];
    var f = a({
      o: gn(n, t, i),
      u: wr
    }, gn.bind(0, n, t, i, true)), l = f[0], c = f[1];
    var s = c(), d = s[0];
    var g = hn(t);
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
        nativeScrollbarsOverlaid: false,
        body: null
      }
    };
    var b = A({}, Jr);
    var w = {
      j: d,
      H: h,
      T: g,
      D: "-1" === style(t, "zIndex"),
      B: pn(t, i),
      F: _n(t, i),
      q: function _addListener(r) {
        return o("_", r);
      },
      U: A.bind(0, {}, p),
      N: function _setDefaultInitialization(r) {
        A(p, r);
      },
      Y: A.bind(0, {}, b),
      W: function _setDefaultOptions(r) {
        A(b, r);
      },
      G: A({}, p),
      X: A({}, b)
    };
    D(t, "style");
    X(t);
    if (!g && (!h.x || !h.y)) {
      var m;
      window.addEventListener("resize", (function() {
        var r = Ia()[cn];
        m = m || r && r.k();
        m && m(w, l, u.bind(0, "_"));
      }));
    }
    return w;
  };
  var wn = function getEnvironment() {
    if (!dn) {
      dn = bn();
    }
    return dn;
  };
  var mn = function resolveInitialization(r, a) {
    return s(r) ? r.apply(0, a) : r;
  };
  var yn = function staticInitializationElement(r, a, n, e) {
    var t = v(e) ? n : e;
    var i = mn(t, r);
    return i || a();
  };
  var Sn = function dynamicInitializationElement(r, a, n, e) {
    var t = v(e) ? n : e;
    var i = mn(t, r);
    return !!i && (b(i) ? i : a());
  };
  var Cn = function cancelInitialization(r, a) {
    var n = r || {}, e = n.nativeScrollbarsOverlaid, t = n.body;
    var i = a.Z;
    var u = wn(), f = u.U, l = u.H, c = u.T;
    var s = f().cancel, d = s.nativeScrollbarsOverlaid, g = s.body;
    var h = null != e ? e : d;
    var p = v(t) ? g : t;
    var b = (l.x || l.y) && h;
    var w = i && (o(p) ? !c : p);
    return !!b || !!w;
  };
  var On = new WeakMap;
  var xn = function addInstance(r, a) {
    On.set(r, a);
  };
  var En = function removeInstance(r) {
    On.delete(r);
  };
  var An = function getInstance(r) {
    return On.get(r);
  };
  var Pn = function getPropByPath(r, a) {
    return r ? a.split(".").reduce((function(r, a) {
      return r && x(r, a) ? r[a] : void 0;
    }), r) : void 0;
  };
  var zn = function createOptionCheck(r, a, n) {
    return function(e) {
      return [ Pn(r, e), n || void 0 !== Pn(a, e) ];
    };
  };
  var Ln = function createState(r) {
    var a = r;
    return [ function() {
      return a;
    }, function(r) {
      a = A({}, a, r);
    } ];
  };
  var Tn = "tabindex";
  var Hn = Z.bind(0, "");
  var Dn = function unwrap(r) {
    Y(F(r), B(r));
    X(r);
  };
  var Mn = function addDataAttrHost(r, a) {
    L(r, na, a);
    return D.bind(0, r, na);
  };
  var Rn = function createStructureSetupElements(r) {
    var a = wn();
    var n = a.U, e = a.T;
    var t = Ia()[cn];
    var i = t && t.L;
    var v = n(), o = v.host, u = v.viewport, f = v.padding, l = v.content;
    var c = b(r);
    var s = c ? {} : r;
    var d = s.host, g = s.padding, h = s.viewport, p = s.content;
    var w = c ? r : s.target;
    var S = j(w, "textarea");
    var C = w.ownerDocument;
    var x = w === C.body;
    var A = C.defaultView;
    var P = yn.bind(0, [ w ]);
    var z = Sn.bind(0, [ w ]);
    var M = P(Hn, u, h);
    var R = M === w;
    var I = R && x;
    var V = !R && A.top === A && C.activeElement === w;
    var k = {
      $: w,
      J: S ? P(Hn, o, d) : w,
      K: M,
      rr: !R && z(Hn, f, g),
      ar: !R && z(Hn, l, p),
      nr: !R && !e && i && i(a),
      er: I ? C.documentElement : M,
      tr: I ? C : M,
      ir: A,
      vr: C,
      ur: S,
      Z: x,
      lr: c,
      cr: R,
      sr: function _viewportHasClass(r, a) {
        return R ? H(M, na, a) : gr(M, r);
      },
      dr: function _viewportAddRemoveClass(r, a, n) {
        return R ? T(M, na, a, n) : (n ? pr : hr)(M, r);
      }
    };
    var q = E(k).reduce((function(r, a) {
      var n = k[a];
      return y(r, n && !F(n) ? n : false);
    }), []);
    var U = function elementIsGenerated(r) {
      return r ? m(q, r) > -1 : null;
    };
    var N = k.$, Z = k.J, $ = k.rr, J = k.K, K = k.ar, Q = k.nr;
    var rr = [];
    var ar = S && U(Z);
    var nr = S ? N : B([ K, J, $, Z, N ].find((function(r) {
      return false === U(r);
    })));
    var er = K || J;
    var tr = function appendElements() {
      var r = Mn(Z, R ? "viewport" : "host");
      var a = pr($, ua);
      var n = pr(J, !R && fa);
      var t = pr(K, ca);
      var i = x ? pr(F(w), sa) : Sr;
      if (ar) {
        G(N, Z);
        y(rr, (function() {
          G(Z, N);
          X(Z);
        }));
      }
      Y(er, nr);
      Y(Z, $);
      Y($ || Z, !R && J);
      Y(J, K);
      y(rr, (function() {
        i();
        r();
        D(J, ea);
        D(J, ta);
        if (U(K)) {
          Dn(K);
        }
        if (U(J)) {
          Dn(J);
        }
        if (U($)) {
          Dn($);
        }
        a();
        n();
        t();
      }));
      if (e && !R) {
        y(rr, hr.bind(0, J, sa));
      }
      if (Q) {
        W(J, Q);
        y(rr, X.bind(0, Q));
      }
      if (V) {
        var v = L(J, Tn);
        L(J, Tn, "-1");
        J.focus();
        var o = Ur(C, "pointerdown keydown", (function() {
          v ? L(J, Tn, v) : D(J, Tn);
          o();
        }));
      }
      nr = 0;
    };
    return [ k, tr, O.bind(0, rr) ];
  };
  var In = function createTrinsicUpdateSegment(r, a) {
    var n = r.ar;
    var e = a[0];
    return function(r) {
      var a = wn(), t = a.F;
      var i = e(), v = i.gr;
      var o = r.hr;
      var u = (n || !t) && o;
      if (u) {
        style(n, {
          height: v ? "" : "100%"
        });
      }
      return {
        pr: u,
        _r: u
      };
    };
  };
  var Vn = function createPaddingUpdateSegment(r, n) {
    var e = n[0], t = n[1];
    var i = r.J, v = r.rr, o = r.K, u = r.cr;
    var f = a({
      u: mr,
      o: Lr()
    }, Lr.bind(0, i, "padding", "")), l = f[0], c = f[1];
    return function(r, a, n) {
      var i = c(n), f = i[0], s = i[1];
      var d = wn(), g = d.T, h = d.F;
      var p = e(), b = p.br;
      var w = r.pr, m = r._r, y = r.wr;
      var S = a("paddingAbsolute"), C = S[0], O = S[1];
      var x = !h && m;
      if (w || s || x) {
        var E = l(n);
        f = E[0];
        s = E[1];
      }
      var P = !u && (O || y || s);
      if (P) {
        var z = !C || !v && !g;
        var L = f.r + f.l;
        var T = f.t + f.b;
        var H = {
          marginRight: z && !b ? -L : 0,
          marginBottom: z ? -T : 0,
          marginLeft: z && b ? -L : 0,
          top: z ? -f.t : 0,
          right: z ? b ? -f.r : "auto" : 0,
          left: z ? b ? "auto" : -f.l : 0,
          width: z ? "calc(100% + " + L + "px)" : ""
        };
        var D = {
          paddingTop: z ? f.t : 0,
          paddingRight: z ? f.r : 0,
          paddingBottom: z ? f.b : 0,
          paddingLeft: z ? f.l : 0
        };
        style(v || o, H);
        style(o, D);
        t({
          rr: f,
          mr: !z,
          R: v ? D : A({}, H, D)
        });
      }
      return {
        yr: P
      };
    };
  };
  var kn = Math.max;
  var jn = kn.bind(0, 0);
  var Bn = "visible";
  var Fn = "hidden";
  var qn = 42;
  var Un = {
    u: br,
    o: {
      w: 0,
      h: 0
    }
  };
  var Nn = {
    u: wr,
    o: {
      x: Fn,
      y: Fn
    }
  };
  var Yn = function getOverflowAmount(r, a) {
    var n = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
    var e = {
      w: jn(r.w - a.w),
      h: jn(r.h - a.h)
    };
    return {
      w: e.w > n ? e.w : 0,
      h: e.h > n ? e.h : 0
    };
  };
  var Wn = function conditionalClass(r, a, n) {
    return n ? pr(r, a) : hr(r, a);
  };
  var Gn = function overflowIsVisible(r) {
    return 0 === r.indexOf(Bn);
  };
  var Xn = function createOverflowUpdateSegment(r, n) {
    var e = n[0], t = n[1];
    var i = r.J, v = r.rr, o = r.K, u = r.nr, f = r.cr, l = r.dr, c = r.Z, s = r.ir;
    var d = wn(), g = d.j, h = d.F, p = d.T, b = d.H;
    var w = Ia()[cn];
    var m = !f && !p && (b.x || b.y);
    var y = c && f;
    var S = a(Un, Vr.bind(0, o)), C = S[0], O = S[1];
    var x = a(Un, Ir.bind(0, o)), E = x[0], A = x[1];
    var P = a(Un), z = P[0], H = P[1];
    var D = a(Un), M = D[0], R = D[1];
    var I = a(Nn), V = I[0];
    var k = function fixFlexboxGlue(r, a) {
      style(o, {
        height: ""
      });
      if (a) {
        var n = e(), t = n.mr, v = n.rr;
        var u = r.Sr, f = r.I;
        var l = Vr(i);
        var c = Rr(i);
        var s = "content-box" === style(o, "boxSizing");
        var d = t || s ? v.b + v.t : 0;
        var g = !(b.x && s);
        style(o, {
          height: c.h + l.h + (u.x && g ? f.x : 0) - d
        });
      }
    };
    var j = function getViewportOverflowState(r, a) {
      var n = !p && !r ? qn : 0;
      var e = function getStatePerAxis(r, e, t) {
        var i = style(o, r);
        var v = a ? a[r] : i;
        var u = "scroll" === v;
        var f = e ? n : t;
        var l = u && !p ? f : 0;
        var c = e && !!n;
        return [ i, u, l, c ];
      };
      var t = e("overflowX", b.x, g.x), i = t[0], v = t[1], u = t[2], f = t[3];
      var l = e("overflowY", b.y, g.y), c = l[0], s = l[1], d = l[2], h = l[3];
      return {
        Cr: {
          x: i,
          y: c
        },
        Sr: {
          x: v,
          y: s
        },
        I: {
          x: u,
          y: d
        },
        V: {
          x: f,
          y: h
        }
      };
    };
    var B = function setViewportOverflowState(r, a, n, e) {
      var t = function setAxisOverflowStyle(r, a) {
        var n = Gn(r);
        var e = a && n && r.replace(Bn + "-", "") || "";
        return [ a && !n ? r : "", Gn(e) ? "hidden" : e ];
      };
      var i = t(n.x, a.x), v = i[0], o = i[1];
      var u = t(n.y, a.y), f = u[0], l = u[1];
      e.overflowX = o && f ? o : v;
      e.overflowY = l && v ? l : f;
      return j(r, e);
    };
    var F = function hideNativeScrollbars(r, a, n, t) {
      var i = r.I, v = r.V;
      var o = v.x, u = v.y;
      var f = i.x, l = i.y;
      var c = e(), s = c.R;
      var d = a ? "marginLeft" : "marginRight";
      var g = a ? "paddingLeft" : "paddingRight";
      var h = s[d];
      var p = s.marginBottom;
      var b = s[g];
      var w = s.paddingBottom;
      t.width = "calc(100% + " + (l + -1 * h) + "px)";
      t[d] = -l + h;
      t.marginBottom = -f + p;
      if (n) {
        t[g] = b + (u ? l : 0);
        t.paddingBottom = w + (o ? f : 0);
      }
    };
    var q = w ? w.M(m, h, o, u, e, j, F) : [ function() {
      return m;
    }, function() {
      return [ Sr ];
    } ], U = q[0], N = q[1];
    return function(r, a, n) {
      var u = r.pr, c = r.Or, d = r._r, g = r.yr, w = r.hr, m = r.wr;
      var S = e(), x = S.gr, P = S.br;
      var D = a("showNativeOverlaidScrollbars"), I = D[0], q = D[1];
      var Y = a("overflow"), W = Y[0], G = Y[1];
      var X = I && b.x && b.y;
      var Z = !f && !h && (u || d || c || q || w);
      var $ = Gn(W.x);
      var J = Gn(W.y);
      var K = $ || J;
      var Q = O(n);
      var rr = A(n);
      var ar = H(n);
      var nr = R(n);
      var er;
      if (q && p) {
        l(sa, va, !X);
      }
      if (Z) {
        er = j(X);
        k(er, x);
      }
      if (u || g || d || m || q) {
        if (K) {
          l(da, ia, false);
        }
        var tr = N(X, P, er), ir = tr[0], vr = tr[1];
        var or = Q = C(n), ur = or[0], fr = or[1];
        var lr = rr = E(n), cr = lr[0], sr = lr[1];
        var dr = Rr(o);
        var gr = cr;
        var hr = dr;
        ir();
        if ((sr || fr || q) && vr && !X && U(vr, cr, ur, P)) {
          hr = Rr(o);
          gr = Ir(o);
        }
        var pr = {
          w: jn(kn(cr.w, gr.w) + ur.w),
          h: jn(kn(cr.h, gr.h) + ur.h)
        };
        var _r = {
          w: jn(y ? s.innerWidth : hr.w + jn(dr.w - cr.w) + ur.w),
          h: jn(y ? s.innerHeight : hr.h + jn(dr.h - cr.h) + ur.h)
        };
        nr = M(_r);
        ar = z(Yn(pr, _r), n);
      }
      var br = nr, wr = br[0], mr = br[1];
      var yr = ar, Sr = yr[0], Cr = yr[1];
      var Or = rr, xr = Or[0], Er = Or[1];
      var Ar = Q, Pr = Ar[0], zr = Ar[1];
      var Lr = {
        x: Sr.w > 0,
        y: Sr.h > 0
      };
      var Tr = $ && J && (Lr.x || Lr.y) || $ && Lr.x && !Lr.y || J && Lr.y && !Lr.x;
      if (g || m || zr || Er || mr || Cr || G || q || Z) {
        var Hr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Dr = B(X, Lr, W, Hr);
        var Mr = U(Dr, xr, Pr, P);
        if (!f) {
          F(Dr, P, Mr, Hr);
        }
        if (Z) {
          k(Dr, x);
        }
        if (f) {
          L(i, ea, Hr.overflowX);
          L(i, ta, Hr.overflowY);
        } else {
          style(o, Hr);
        }
      }
      T(i, na, ia, Tr);
      Wn(v, da, Tr);
      !f && Wn(o, da, K);
      var Vr = V(j(X).Cr), kr = Vr[0], jr = Vr[1];
      t({
        Cr: kr,
        Er: {
          x: wr.w,
          y: wr.h
        },
        Ar: {
          x: Sr.w,
          y: Sr.h
        },
        Pr: Lr
      });
      return {
        zr: jr,
        Lr: mr,
        Tr: Cr
      };
    };
  };
  var Zn = function prepareUpdateHints(r, a, n) {
    var e = {};
    var t = a || {};
    var i = E(r).concat(E(t));
    each(i, (function(a) {
      var i = r[a];
      var v = t[a];
      e[a] = !!(n || i || v);
    }));
    return e;
  };
  var $n = function createStructureSetupUpdate(r, a) {
    var n = r.$, e = r.K, t = r.dr, i = r.cr;
    var v = wn(), o = v.T, u = v.H, f = v.F;
    var l = !o && (u.x || u.y);
    var c = [ In(r, a), Vn(r, a), Xn(r, a) ];
    return function(r, a, v) {
      var o = Zn(A({
        pr: false,
        yr: false,
        wr: false,
        hr: false,
        Lr: false,
        Tr: false,
        zr: false,
        Or: false,
        _r: false
      }, a), {}, v);
      var u = l || !f;
      var s = u && M(e);
      var d = u && R(e);
      t("", oa, true);
      var g = o;
      each(c, (function(a) {
        g = Zn(g, a(g, r, !!v) || {}, v);
      }));
      M(e, s);
      R(e, d);
      t("", oa);
      if (!i) {
        M(n, 0);
        R(n, 0);
      }
      return g;
    };
  };
  var Jn = 3333333;
  var Kn = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var Qn = function createSizeObserver(r, n, e) {
    var t = e || {}, i = t.Hr, v = void 0 === i ? false : i, o = t.Dr, u = void 0 === o ? false : o;
    var f = Ia()[an];
    var l = wn(), s = l.B;
    var h = $('<div class="' + ga + '"><div class="' + pa + '"></div></div>');
    var p = h[0];
    var b = p.firstChild;
    var w = zr.bind(0, r);
    var m = a({
      o: void 0,
      g: true,
      u: function _equal(r, a) {
        return !(!r || !Kn(r) && Kn(a));
      }
    }), S = m[0];
    var C = function onSizeChangedCallbackProxy(r) {
      var a = d(r) && r.length > 0 && g(r[0]);
      var e = !a && c(r[0]);
      var t = false;
      var i = false;
      var o = true;
      if (a) {
        var u = S(r.pop().contentRect), f = u[0], l = u[2];
        var h = Kn(f);
        var b = Kn(l);
        t = !l || !h;
        i = !b && h;
        o = !t;
      } else if (e) {
        o = r[1];
      } else {
        i = true === r;
      }
      if (v && o) {
        var w = e ? r[0] : zr(p);
        M(p, w ? s.n ? -Jn : s.i ? 0 : Jn : Jn);
        R(p, Jn);
      }
      if (!t) {
        n({
          pr: !e,
          Mr: e ? r : void 0,
          Dr: !!i
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
        var n = new or(C);
        n.observe(b);
        y(x, (function() {
          n.disconnect();
        }));
      } else if (f) {
        var e = f.P(b, C, u), t = e[0], i = e[1];
        E = t;
        y(x, i);
      }
      if (v) {
        var o = a({
          o: !w()
        }, w), l = o[0];
        y(x, Ur(p, "scroll", (function(r) {
          var a = l();
          var n = a[0], e = a[1];
          if (e) {
            hr(b, "ltr rtl");
            if (n) {
              pr(b, "rtl");
            } else {
              pr(b, "ltr");
            }
            C(a);
          }
          Nr(r);
        })));
      }
      if (E) {
        pr(p, ha);
        y(x, Ur(p, "animationstart", E, {
          A: !!or
        }));
      }
      Y(r, p);
    } ];
  };
  var re = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var ae = function createTrinsicObserver(r, n) {
    var e;
    var t = Z(ma);
    var i = [];
    var v = a({
      o: false
    }), o = v[0];
    var u = function triggerOnTrinsicChangedCallback(r, a) {
      if (r) {
        var e = o(re(r));
        var t = e[1];
        if (t) {
          !a && n(e);
          return [ e ];
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
        e = new vr((function(r) {
          return f(r);
        }), {
          root: r
        });
        e.observe(t);
        y(i, (function() {
          e.disconnect();
        }));
      } else {
        var a = function onSizeChanged() {
          var r = Mr(t);
          u(r);
        };
        var n = Qn(t, a), v = n[0], o = n[1];
        y(i, v);
        o();
        a();
      }
      Y(r, t);
    }, function() {
      if (e) {
        return f(e.takeRecords(), true);
      }
    } ];
  };
  var ne = function createEventContentChange(r, a, n) {
    var e;
    var t = false;
    var i = function destroy() {
      t = true;
    };
    var v = function updateElements(i) {
      if (n) {
        var v = n.reduce((function(a, n) {
          if (n) {
            var e = n[0];
            var t = n[1];
            var v = t && e && (i ? i(e) : V(e, r));
            if (v && v.length && t && l(t)) {
              y(a, [ v, t.trim() ], true);
            }
          }
          return a;
        }), []);
        each(v, (function(r) {
          return each(r[0], (function(n) {
            var i = r[1];
            var v = e.get(n);
            if (v) {
              var o = v[0];
              var u = v[1];
              if (o === i) {
                u();
              }
            }
            var f = Ur(n, i, (function(r) {
              if (t) {
                f();
                e.delete(n);
              } else {
                a(r);
              }
            }));
            e.set(n, [ i, f ]);
          }));
        }));
      }
    };
    if (n) {
      e = new WeakMap;
      v();
    }
    return [ i, v ];
  };
  var ee = function createDOMObserver(r, a, n, e) {
    var t = false;
    var i = e || {}, v = i.Rr, o = i.Ir, u = i.Vr, f = i.kr, c = i.jr, s = i.Br;
    var d = Cr((function() {
      if (t) {
        n(true);
      }
    }), {
      p: 33,
      _: 99
    });
    var g = ne(r, d, u), h = g[0], p = g[1];
    var b = v || [];
    var w = o || [];
    var S = b.concat(w);
    var O = function observerCallback(t, i) {
      var v = c || Sr;
      var o = s || Sr;
      var u = [];
      var d = [];
      var g = false;
      var h = false;
      var b = false;
      each(t, (function(n) {
        var t = n.attributeName, i = n.target, c = n.type, s = n.oldValue, p = n.addedNodes;
        var S = "attributes" === c;
        var C = "childList" === c;
        var O = r === i;
        var x = S && l(t) ? L(i, t) : 0;
        var E = 0 !== x && s !== x;
        var A = m(w, t) > -1 && E;
        if (a && !O) {
          var P = !S;
          var z = S && A;
          var T = z && f && j(i, f);
          var H = T ? !v(i, t, s, x) : P || z;
          var D = H && !o(n, !!T, r, e);
          y(d, p);
          h = h || D;
          b = b || C;
        }
        if (!a && O && E && !v(i, t, s, x)) {
          y(u, t);
          g = g || A;
        }
      }));
      if (b && !C(d)) {
        p((function(r) {
          return d.reduce((function(a, n) {
            y(a, V(r, n));
            return j(n, r) ? y(a, n) : a;
          }), []);
        }));
      }
      if (a) {
        !i && h && n(false);
        return [ false ];
      }
      if (!C(u) || g) {
        !i && n(u, g);
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
  var te = "[" + na + "]";
  var ie = "." + fa;
  var ve = [ "tabindex" ];
  var oe = [ "wrap", "cols", "rows" ];
  var ue = [ "id", "class", "style", "open" ];
  var fe = function createStructureSetupObservers(r, n, e) {
    var t;
    var i;
    var v;
    var o = n[1];
    var u = r.J, c = r.K, g = r.ar, h = r.ur, p = r.cr, b = r.sr, w = r.dr;
    var S = wn(), C = S.F;
    var O = a({
      u: br,
      o: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = b(da, ia);
      var a = b(la, "");
      var n = a && M(c);
      var e = a && R(c);
      w(da, ia);
      w(la, "");
      w("", oa, true);
      var t = Ir(g);
      var i = Ir(c);
      var v = Vr(c);
      w(da, ia, r);
      w(la, "", a);
      w("", oa);
      M(c, n);
      R(c, e);
      return {
        w: i.w + t.w + v.w,
        h: i.h + t.h + v.h
      };
    })), x = O[0];
    var P = h ? oe : ue.concat(oe);
    var z = Cr(e, {
      p: function _timeout() {
        return t;
      },
      _: function _maxDelay() {
        return i;
      },
      m: function _mergeParams(r, a) {
        var n = r[0];
        var e = a[0];
        return [ E(n).concat(E(e)).reduce((function(r, a) {
          r[a] = n[a] || e[a];
          return r;
        }), {}) ];
      }
    });
    var T = function updateViewportAttrsFromHost(r) {
      each(r || ve, (function(r) {
        if (m(ve, r) > -1) {
          var a = L(u, r);
          if (l(a)) {
            L(c, r, a);
          } else {
            D(c, r);
          }
        }
      }));
    };
    var H = function onTrinsicChanged(r, a) {
      var n = r[0], t = r[1];
      var i = {
        hr: t
      };
      o({
        gr: n
      });
      !a && e(i);
      return i;
    };
    var I = function onSizeChanged(r) {
      var a = r.pr, n = r.Mr, t = r.Dr;
      var i = !a || t ? e : z;
      var v = false;
      if (n) {
        var u = n[0], f = n[1];
        v = f;
        o({
          br: u
        });
      }
      i({
        pr: a,
        wr: v
      });
    };
    var V = function onContentMutation(r, a) {
      var n = x(), t = n[1];
      var i = {
        _r: t
      };
      var v = r ? e : z;
      if (t) {
        !a && v(i);
      }
      return i;
    };
    var k = function onHostMutation(r, a, n) {
      var e = {
        Or: a
      };
      if (a) {
        !n && z(e);
      } else if (!p) {
        T(r);
      }
      return e;
    };
    var j = g || !C ? ae(u, H) : [ Sr, Sr, Sr ], B = j[0], F = j[1], N = j[2];
    var Y = !p ? Qn(u, I, {
      Dr: true,
      Hr: true
    }) : [ Sr, Sr ], W = Y[0], G = Y[1];
    var X = ee(u, false, k, {
      Ir: ue,
      Rr: ue.concat(ve)
    }), Z = X[0], $ = X[1];
    var J = p && or && new or(I.bind(0, {
      pr: true
    }));
    J && J.observe(u);
    T();
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
      var n = N();
      var e = v && v[1]();
      if (a) {
        A(r, k.apply(0, y(a, true)));
      }
      if (n) {
        A(r, H.apply(0, y(n, true)));
      }
      if (e) {
        A(r, V.apply(0, y(e, true)));
      }
      return r;
    }, function(r) {
      var a = r("updating.ignoreMutation"), n = a[0];
      var e = r("updating.attributes"), o = e[0], u = e[1];
      var l = r("updating.elementEvents"), h = l[0], b = l[1];
      var w = r("updating.debounce"), m = w[0], y = w[1];
      var S = b || u;
      var C = function ignoreMutationFromOptions(r) {
        return s(n) && n(r);
      };
      if (S) {
        if (v) {
          v[1]();
          v[0]();
        }
        v = ee(g || c, true, V, {
          Ir: P.concat(o || []),
          Rr: P.concat(o || []),
          Vr: h,
          kr: te,
          Br: function _ignoreContentChange(r, a) {
            var n = r.target, e = r.attributeName;
            var t = !a && e && !p ? U(n, te, ie) : false;
            return t || !!q(n, "." + ya) || !!C(r);
          }
        });
      }
      if (y) {
        z.S();
        if (d(m)) {
          var O = m[0];
          var x = m[1];
          t = f(O) ? O : false;
          i = f(x) ? x : false;
        } else if (f(m)) {
          t = m;
          i = false;
        } else {
          t = false;
          i = false;
        }
      }
    } ];
  };
  var le = {
    x: 0,
    y: 0
  };
  var ce = {
    rr: {
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
    Er: le,
    Ar: le,
    Cr: {
      x: "hidden",
      y: "hidden"
    },
    Pr: {
      x: false,
      y: false
    },
    gr: false,
    br: false
  };
  var se = function createStructureSetup(r, a) {
    var n = zn(a, {});
    var e = Ln(ce);
    var t = Zr(), i = t[0], v = t[1], o = t[2];
    var u = e[0];
    var f = Rn(r), l = f[0], c = f[1], s = f[2];
    var d = $n(l, e);
    var g = function triggerUpdateEvent(r, a, n) {
      var e = E(r).some((function(a) {
        return r[a];
      }));
      if (e || !P(a) || n) {
        o("u", [ r, a, n ]);
      }
    };
    var h = fe(l, e, (function(r) {
      g(d(n, r), {}, false);
    })), p = h[0], b = h[1], w = h[2], m = h[3];
    var y = u.bind(0);
    y.Fr = function(r) {
      i("u", r);
    };
    y.qr = function() {
      var r = l.$, a = l.K;
      var n = M(r);
      var e = R(r);
      b();
      c();
      M(a, n);
      R(a, e);
    };
    y.Ur = l;
    return [ function(r, n) {
      var e = zn(a, r, n);
      m(e);
      g(d(e, w(), n), r, !!n);
    }, y, function() {
      v();
      p();
      s();
    } ];
  };
  var de = Math.round;
  var ge = function getClientOffset(r) {
    return {
      x: r.clientX,
      y: r.clientY
    };
  };
  var he = function getScale(r) {
    var a = kr(r), n = a.width, e = a.height;
    var t = Mr(r), i = t.w, v = t.h;
    return {
      x: de(n) / i || 1,
      y: de(e) / v || 1
    };
  };
  var pe = function continuePointerDown(r, a, n) {
    var e = a.scrollbars;
    var t = r.button, i = r.isPrimary, v = r.pointerType;
    var o = e.pointers;
    return 0 === t && i && e[n] && (o || []).includes(v);
  };
  var _e = function createRootClickStopPropagationEvents(r, a) {
    return Ur(r, "mousedown", Ur.bind(0, a, "click", Nr, {
      A: true,
      O: true
    }), {
      O: true
    });
  };
  var be = function createDragScrollingEvents(r, a, n, e, t, i) {
    var v = wn(), o = v.B;
    var u = n.Nr, f = n.Yr, l = n.Wr;
    var c = "scroll" + (i ? "Left" : "Top");
    var s = i ? "x" : "y";
    var d = i ? "w" : "h";
    var g = function createOnPointerMoveHandler(r, a, n) {
      return function(v) {
        var g = t(), h = g.Ar;
        var p = (ge(v)[s] - a) * n;
        var b = Mr(f)[d] - Mr(u)[d];
        var w = p / b;
        var m = w * h[s];
        var y = zr(l);
        var S = y && i ? o.n || o.i ? 1 : -1 : 1;
        e[c] = r + m * S;
      };
    };
    return Ur(u, "pointerdown", (function(n) {
      if (pe(n, r, "dragScroll")) {
        var t = Ur(a, "selectstart", (function(r) {
          return Yr(r);
        }), {
          C: false
        });
        var i = Ur(u, "pointermove", g(e[c] || 0, ge(n)[s], 1 / he(e)[s]));
        Ur(u, "pointerup", (function(r) {
          t();
          i();
          u.releasePointerCapture(r.pointerId);
        }), {
          A: true
        });
        u.setPointerCapture(n.pointerId);
      }
    }));
  };
  var we = function createScrollbarsSetupEvents(r, a) {
    return function(n, e, t, i, v) {
      var o = n.Wr;
      return O.bind(0, [ Ur(o, "pointerenter", (function() {
        e(La, true);
      })), Ur(o, "pointerleave pointercancel", (function() {
        e(La);
      })), _e(o, t), be(r, t, n, i, a, v) ]);
    };
  };
  var me = Math.min, ye = Math.max, Se = Math.abs, Ce = Math.round;
  var Oe = function getScrollbarHandleLengthRatio(r, a, n, e) {
    if (e) {
      var t = n ? "x" : "y";
      var i = e.Ar, v = e.Er;
      var o = v[t];
      var u = i[t];
      return ye(0, me(1, o / (o + u)));
    }
    var f = n ? "w" : "h";
    var l = Mr(r)[f];
    var c = Mr(a)[f];
    return ye(0, me(1, l / c));
  };
  var xe = function getScrollbarHandleOffsetRatio(r, a, n, e, t, i) {
    var v = wn(), o = v.B;
    var u = i ? "x" : "y";
    var f = i ? "Left" : "Top";
    var l = e.Ar;
    var c = Ce(l[u]);
    var s = Se(n["scroll" + f]);
    var d = i && t;
    var g = o.i ? s : c - s;
    var h = d ? g : s;
    var p = me(1, h / c);
    var b = Oe(r, a, i);
    return 1 / b * (1 - b) * p;
  };
  var Ee = function createScrollbarsSetupElements(r, a, n) {
    var e = wn(), t = e.U;
    var i = t(), v = i.scrollbarsSlot;
    var o = a.vr, u = a.$, f = a.J, l = a.K, s = a.lr, d = a.er;
    var g = s ? {} : r, h = g.scrollbarsSlot;
    var p = Sn([ u, f, l ], (function() {
      return f;
    }), v, h);
    var b = function scrollbarStructureAddRemoveClass(r, a, n) {
      var e = n ? pr : hr;
      each(r, (function(r) {
        e(r.Wr, a);
      }));
    };
    var w = function scrollbarsHandleStyle(r, a) {
      each(r, (function(r) {
        var n = a(r), e = n[0], t = n[1];
        style(e, t);
      }));
    };
    var m = function scrollbarStructureRefreshHandleLength(r, a, n) {
      w(r, (function(r) {
        var e;
        var t = r.Nr, i = r.Yr;
        return [ t, (e = {}, e[n ? "width" : "height"] = (100 * Oe(t, i, n, a)).toFixed(3) + "%", 
        e) ];
      }));
    };
    var S = function scrollbarStructureRefreshHandleOffset(r, a, n) {
      var e = n ? "X" : "Y";
      w(r, (function(r) {
        var t = r.Nr, i = r.Yr, v = r.Wr;
        var o = xe(t, i, d, a, zr(v), n);
        var u = o === o;
        return [ t, {
          transform: u ? "translate" + e + "(" + (100 * o).toFixed(3) + "%)" : ""
        } ];
      }));
    };
    var x = [];
    var E = [];
    var A = [];
    var P = function scrollbarsAddRemoveClass(r, a, n) {
      var e = c(n);
      var t = e ? n : true;
      var i = e ? !n : true;
      t && b(E, r, a);
      i && b(A, r, a);
    };
    var z = function refreshScrollbarsHandleLength(r) {
      m(E, r, true);
      m(A, r);
    };
    var L = function refreshScrollbarsHandleOffset(r) {
      S(E, r, true);
      S(A, r);
    };
    var T = function generateScrollbarDOM(r) {
      var a = r ? Ca : Oa;
      var e = r ? E : A;
      var t = C(e) ? za : "";
      var i = Z(ya + " " + a + " " + t);
      var v = Z(xa);
      var u = Z(Ea);
      var f = {
        Wr: i,
        Yr: v,
        Nr: u
      };
      Y(i, v);
      Y(v, u);
      y(e, f);
      y(x, [ X.bind(0, i), n(f, P, o, d, r) ]);
      return f;
    };
    var H = T.bind(0, true);
    var D = T.bind(0, false);
    var M = function appendElements() {
      Y(p, E[0].Wr);
      Y(p, A[0].Wr);
      lr((function() {
        P(za);
      }), 300);
    };
    H();
    D();
    return [ {
      Gr: z,
      Xr: L,
      Zr: P,
      $r: {
        Jr: E,
        Kr: H,
        Qr: w.bind(0, E)
      },
      ra: {
        Jr: A,
        Kr: D,
        Qr: w.bind(0, A)
      }
    }, M, O.bind(0, x) ];
  };
  var Ae = function createSelfCancelTimeout(r) {
    var a;
    var n = r ? lr : fr;
    var e = r ? cr : ur;
    return [ function(t) {
      e(a);
      a = n(t, s(r) ? r() : r);
    }, function() {
      return e(a);
    } ];
  };
  var Pe = function createScrollbarsSetup(r, a, n) {
    var e;
    var t;
    var i;
    var v;
    var o;
    var u = 0;
    var f = Ln({});
    var l = f[0];
    var c = Ae(), s = c[0], d = c[1];
    var g = Ae(), h = g[0], p = g[1];
    var b = Ae(100), w = b[0], m = b[1];
    var y = Ae(100), S = y[0], C = y[1];
    var x = Ae((function() {
      return u;
    })), E = x[0], A = x[1];
    var P = Ee(r, n.Ur, we(a, n)), z = P[0], L = P[1], T = P[2];
    var H = n.Ur, D = H.J, I = H.K, V = H.er, k = H.tr, j = H.cr, B = H.Z;
    var q = z.$r, U = z.ra, N = z.Zr, Y = z.Gr, W = z.Xr;
    var G = q.Qr;
    var X = U.Qr;
    var Z = function styleScrollbarPosition(r) {
      var a = r.Wr;
      var n = j && !B && F(a) === I && a;
      return [ n, {
        transform: n ? "translate(" + M(V) + "px, " + R(V) + "px)" : ""
      } ];
    };
    var $ = function manageScrollbarsAutoHide(r, a) {
      A();
      if (r) {
        N(Ha);
      } else {
        var n = function hide() {
          return N(Ha, true);
        };
        if (u > 0 && !a) {
          E(n);
        } else {
          n();
        }
      }
    };
    var J = function onHostMouseEnter() {
      v = t;
      v && $(true);
    };
    var K = [ m, A, C, p, d, T, Ur(D, "pointerover", J, {
      A: true
    }), Ur(D, "pointerenter", J), Ur(D, "pointerleave", (function() {
      v = false;
      t && $(false);
    })), Ur(D, "pointermove", (function() {
      e && s((function() {
        m();
        $(true);
        S((function() {
          e && $(false);
        }));
      }));
    })), Ur(k, "scroll", (function() {
      h((function() {
        W(n());
        i && $(true);
        w((function() {
          i && !v && $(false);
        }));
      }));
      j && G(Z);
      j && X(Z);
    })) ];
    var Q = l.bind(0);
    Q.Ur = z;
    Q.qr = L;
    return [ function(r, v, f) {
      var l = f.Lr, c = f.Tr, s = f.zr, d = f.wr;
      var g = zn(a, r, v);
      var h = n();
      var p = h.Ar, b = h.Cr, w = h.br;
      var m = g("scrollbars.theme"), y = m[0], S = m[1];
      var C = g("scrollbars.visibility"), O = C[0], x = C[1];
      var E = g("scrollbars.autoHide"), A = E[0], P = E[1];
      var z = g("scrollbars.autoHideDelay"), L = z[0];
      var T = g("scrollbars.dragScroll"), H = T[0], D = T[1];
      var M = g("scrollbars.clickScroll"), R = M[0], I = M[1];
      var V = l || c || d || v;
      var k = s || x || v;
      var j = function setScrollbarVisibility(r, a) {
        var n = "visible" === O || "auto" === O && "scroll" === r;
        N(Aa, n, a);
        return n;
      };
      u = L;
      if (S) {
        N(o);
        N(y, true);
        o = y;
      }
      if (P) {
        e = "move" === A;
        t = "leave" === A;
        i = "never" !== A;
        $(!i, true);
      }
      if (D) {
        N(Ma, H);
      }
      if (I) {
        N(Da, R);
      }
      if (k) {
        var F = j(b.x, true);
        var q = j(b.y, false);
        var U = F && q;
        N(Pa, !U);
      }
      if (V) {
        Y(h);
        W(h);
        N(Ta, !p.x, true);
        N(Ta, !p.y, false);
        N(Sa, w && !B);
      }
    }, Q, O.bind(0, K) ];
  };
  var ze = function OverlayScrollbars(r, a, n) {
    var e = wn(), t = e.Y, i = e.q;
    var v = Ia();
    var o = b(r);
    var u = o ? r : r.target;
    var f = An(u);
    if (a && !f) {
      var l = false;
      var c = v[Ja];
      var d = function validateOptions(r) {
        var a = r || {};
        var n = c && c.P;
        return n ? n(a, true) : a;
      };
      var g = A({}, t(), d(a));
      var h = Zr(n), p = h[0], w = h[1], m = h[2];
      var y = se(r, g), S = y[0], C = y[1], O = y[2];
      var x = Pe(r, g, C), z = x[0], L = x[1], T = x[2];
      var H = function update(r, a) {
        S(r, !!a);
      };
      var D = i(H.bind(0, {}, true));
      var M = function destroy(r) {
        En(u);
        D();
        T();
        O();
        l = true;
        m("destroyed", [ R, !!r ]);
        w();
      };
      var R = {
        options: function options(r) {
          if (r) {
            var a = Kr(g, d(r));
            if (!P(a)) {
              A(g, a);
              H(a);
            }
          }
          return A({}, g);
        },
        on: p,
        off: function off(r, a) {
          r && a && w(r, a);
        },
        state: function state() {
          var r = C(), a = r.Er, n = r.Ar, e = r.Cr, t = r.Pr, i = r.rr, v = r.mr, o = r.br;
          return A({}, {
            overflowEdge: a,
            overflowAmount: n,
            overflowStyle: e,
            hasOverflow: t,
            padding: i,
            paddingAbsolute: v,
            directionRTL: o,
            destroyed: l
          });
        },
        elements: function elements() {
          var r = C.Ur, a = r.$, n = r.J, e = r.rr, t = r.K, i = r.ar, v = r.er, o = r.tr;
          var u = L.Ur, f = u.$r, l = u.ra;
          var c = function translateScrollbarStructure(r) {
            var a = r.Nr, n = r.Yr, e = r.Wr;
            return {
              scrollbar: e,
              track: n,
              handle: a
            };
          };
          var s = function translateScrollbarsSetupElement(r) {
            var a = r.Jr, n = r.Kr;
            var e = c(a[0]);
            return A({}, e, {
              clone: function clone() {
                var r = c(n());
                z({}, true, {});
                return r;
              }
            });
          };
          return A({}, {
            target: a,
            host: n,
            padding: e || t,
            viewport: t,
            content: i || t,
            scrollOffsetElement: v,
            scrollEventElement: o,
            scrollbarHorizontal: s(f),
            scrollbarVertical: s(l)
          });
        },
        update: function update(r) {
          H({}, r);
          return R;
        },
        destroy: M.bind(0)
      };
      C.Fr((function(r, a, n) {
        z(a, n, r);
      }));
      each(E(v), (function(r) {
        var a = v[r];
        if (s(a)) {
          a(OverlayScrollbars, R);
        }
      }));
      if (Cn(!o && r.cancel, C.Ur)) {
        M(true);
        return R;
      }
      C.qr();
      L.qr();
      xn(u, R);
      m("initialized", [ R ]);
      C.Fr((function(r, a, n) {
        var e = r.pr, t = r.wr, i = r.hr, v = r.Lr, o = r.Tr, u = r.zr, f = r._r, l = r.Or;
        m("updated", [ R, {
          updateHints: {
            sizeChanged: e,
            directionChanged: t,
            heightIntrinsicChanged: i,
            overflowEdgeChanged: v,
            overflowAmountChanged: o,
            overflowStyleChanged: u,
            contentMutation: f,
            hostMutation: l
          },
          changedOptions: a,
          force: n
        } ]);
      }));
      return R.update(true);
    }
    return f;
  };
  ze.plugin = Va;
  ze.valid = function(r) {
    var a = r && r.elements;
    var n = s(a) && a();
    return p(n) && !!An(n.target);
  };
  ze.env = function() {
    var r = wn(), a = r.j, n = r.H, e = r.T, t = r.B, i = r.F, v = r.D, o = r.G, u = r.X, f = r.U, l = r.N, c = r.Y, s = r.W;
    return A({}, {
      scrollbarsSize: a,
      scrollbarsOverlaid: n,
      scrollbarsHiding: e,
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
  r.OverlayScrollbars = ze;
  r.scrollbarsHidingPlugin = sn;
  r.sizeObserverPlugin = nn;
  Object.defineProperty(r, "v", {
    value: true
  });
  return r;
}({});
//# sourceMappingURL=overlayscrollbars.browser.es5.js.map
