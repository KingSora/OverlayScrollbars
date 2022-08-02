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
  var b = function isHTMLElement(r) {
    var a = HTMLElement;
    return r ? a ? r instanceof a : r.nodeType === e : false;
  };
  var w = function isElement(r) {
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
  var H = function hasAttrClass(r, a, e) {
    var n = T(r, a) || "";
    var t = new Set(n.split(" "));
    return t.has(e);
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
    var e = [];
    var n = a ? w(a) ? a : null : document;
    return n ? y(e, n.querySelectorAll(r)) : e;
  };
  var j = function findFirst(r, a) {
    var e = a ? w(a) ? a : null : document;
    return e ? e.querySelector(r) : null;
  };
  var k = function is(r, a) {
    if (w(r)) {
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
    if (w(r)) {
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
    var i = q(t, a) === n;
    return n && t ? n === r || t === r || i && q(q(r, e), a) !== n : false;
  };
  var N = function before(r, a, e) {
    if (e && r) {
      var n = a;
      var t;
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
  var br = function equalWH(r, a) {
    return _r(r, a, [ "w", "h" ]);
  };
  var wr = function equalXY(r, a) {
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
        var b = a > 0 ? cr : ur;
        var w = d(r);
        var m = w || r;
        var y = c.bind(0, m);
        i();
        var C = p(y, a);
        i = function clear() {
          return b(C);
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
  var zr = function directionIsRTL(r) {
    return "rtl" === style(r, "direction");
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
  var Lr = Math.round;
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
    var e = parseFloat(style(r, "width")) || 0;
    return {
      w: e - Lr(e),
      h: a - Lr(a)
    };
  };
  var jr = function getBoundingClientRect(r) {
    return r.getBoundingClientRect();
  };
  var kr;
  var Br = function supportPassiveEvents() {
    if (v(kr)) {
      kr = false;
      try {
        window.addEventListener("test", null, Object.defineProperty({}, "passive", {
          get: function get() {
            kr = true;
          }
        }));
      } catch (r) {}
    }
    return kr;
  };
  var Fr = function splitEventNames(r) {
    return r.split(" ");
  };
  var qr = function off(r, a, e, n) {
    each(Fr(a), (function(a) {
      r.removeEventListener(a, e, n);
    }));
  };
  var Ur = function on(r, a, e, n) {
    var t;
    var i = Br();
    var v = null != (t = i && n && n.C) ? t : i;
    var o = n && n.O || false;
    var u = n && n.A || false;
    var f = [];
    var l = i ? {
      passive: v,
      capture: o
    } : o;
    each(Fr(a), (function(a) {
      var n = u ? function(t) {
        r.removeEventListener(a, n, o);
        e && e(t);
      } : e;
      y(f, qr.bind(null, r, a, n, o));
      r.addEventListener(a, n, l);
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
    var a = r ? jr(r) : 0;
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
    var e = function removeEvent(r, e) {
      if (r) {
        var n = a.get(r);
        Xr((function(r) {
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
      Xr((function(r) {
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
            if ($r(t) === $r(i)) {
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
  var Qr = "os-environment";
  var ra = Qr + "-flexbox-glue";
  var aa = ra + "-max";
  var ea = "data-overlayscrollbars";
  var na = ea + "-overflow-x";
  var ta = ea + "-overflow-y";
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
  var Ta = ya + "-interaction";
  var La = ya + "-unusable";
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
        var h = validateRecursive(c, f, e, g + o), b = h[0], w = h[1];
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
    P: function _(r, a) {
      var e = qa($a, r, a), n = e[0], t = e[1];
      return ka({}, t, n);
    }
  }, Ua;
  var Ka;
  var Qa = 3333333;
  var re = "scroll";
  var ae = "__osSizeObserverPlugin";
  var ee = (Ka = {}, Ka[ae] = {
    P: function _(r, a, e) {
      var n = $('<div class="' + ba + '" dir="ltr"><div class="' + ba + '"><div class="' + wa + '"></div></div><div class="' + ba + '"><div class="' + wa + '" style="width: 200%; height: 200%"></div></div></div>');
      Y(r, n);
      pr(r, _a);
      var t = n[0];
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
      var h = y([], [ Ur(v, re, g), Ur(i, re, g) ]);
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
      var a = r.L, e = r.H, n = r.D;
      var t = !n && !a && (e.x || e.y);
      var i = t ? document.createElement("style") : false;
      if (i) {
        T(i, "id", la + "-" + te);
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
          var b = f[p];
          var w = f.paddingTop;
          var m = i.w + v.w;
          var y = i.h + v.h;
          var S = {
            w: h && d ? h + m - b + "px" : "",
            h: g && s ? g + y - w + "px" : ""
          };
          if (n) {
            var C = n.sheet;
            if (C) {
              var O = C.cssRules;
              if (O) {
                if (!O.length) {
                  C.insertRule("#" + T(n, "id") + " + ." + la + "::before {}", 0);
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
          var b = style(e, E(h));
          hr(e, la);
          if (!a) {
            h.height = "";
          }
          style(e, h);
          return [ function() {
            v(f, o, r, b);
            style(e, b);
            pr(e, la);
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
          A(e.k, h);
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
    var t = Rr(a);
    var i = Mr(a);
    var v = Vr(e);
    n && X(a);
    return {
      x: i.h - t.h + v.h,
      y: i.w - t.w + v.w
    };
  };
  var de = function getNativeScrollbarsHiding(r) {
    var a = false;
    var e = pr(r, sa);
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
    var n = Gr(r);
    var t = Gr(a);
    M(r, -999);
    var i = Gr(a);
    return {
      i: n.x === t.x,
      n: t.x !== i.x
    };
  };
  var he = function getFlexboxGlue(r, a) {
    var e = pr(r, ra);
    var n = jr(r);
    var t = jr(a);
    var i = yr(t, n, true);
    var v = pr(r, aa);
    var o = jr(r);
    var u = jr(a);
    var f = yr(u, o, true);
    e();
    v();
    return i && f;
  };
  var pe = function createEnvironment() {
    var r = document, e = r.body;
    var n = $('<div class="' + Qr + '"><div></div></div>');
    var t = n[0];
    var i = t.firstChild;
    var v = Zr(), o = v[0], u = v[2];
    var f = a({
      o: se(e, t, i),
      u: wr
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
    var b = A({}, Jr);
    var w = {
      k: d,
      H: h,
      L: g,
      D: "-1" === style(t, "zIndex"),
      B: ge(t, i),
      F: he(t, i),
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
        var r = Ia()[fe];
        m = m || r && r.j();
        m && m(w, l, u.bind(0, "_"));
      }));
    }
    return w;
  };
  var _e = function getEnvironment() {
    if (!ce) {
      ce = pe();
    }
    return ce;
  };
  var be = function resolveInitialization(r, a) {
    return s(r) ? r.apply(0, a) : r;
  };
  var we = function staticInitializationElement(r, a, e, n) {
    var t = v(n) ? e : n;
    var i = be(t, r);
    return i || a();
  };
  var me = function dynamicInitializationElement(r, a, e, n) {
    var t = v(n) ? e : n;
    var i = be(t, r);
    return !!i && (b(i) ? i : a());
  };
  var ye = function cancelInitialization(r, a) {
    var e = r || {}, n = e.nativeScrollbarsOverlaid, t = e.body;
    var i = a.Z, u = a.$;
    var f = _e(), l = f.U, c = f.H;
    var s = l().cancel, d = s.nativeScrollbarsOverlaid, g = s.body;
    var h = null != n ? n : d;
    var p = v(t) ? g : t;
    var b = (c.x || c.y) && h;
    var w = i && (o(p) ? !u : p);
    return !!b || !!w;
  };
  var Se = new WeakMap;
  var Ce = function addInstance(r, a) {
    Se.set(r, a);
  };
  var Oe = function removeInstance(r) {
    Se.delete(r);
  };
  var xe = function getInstance(r) {
    return Se.get(r);
  };
  var Ee = function getPropByPath(r, a) {
    return r ? a.split(".").reduce((function(r, a) {
      return r && x(r, a) ? r[a] : void 0;
    }), r) : void 0;
  };
  var Ae = function createOptionCheck(r, a, e) {
    return function(n) {
      return [ Ee(r, n), e || void 0 !== Ee(a, n) ];
    };
  };
  var Pe = function createState(r) {
    var a = r;
    return [ function() {
      return a;
    }, function(r) {
      a = A({}, a, r);
    } ];
  };
  var ze = Z.bind(0, "");
  var Te = function unwrap(r) {
    Y(F(r), B(r));
    X(r);
  };
  var Le = function addDataAttrHost(r, a) {
    T(r, ea, a);
    return D.bind(0, r, ea);
  };
  var He = function createStructureSetupElements(r) {
    var a = _e();
    var e = a.U, n = a.L;
    var t = Ia()[fe];
    var i = t && t.T;
    var v = e(), o = v.host, u = v.viewport, f = v.padding, l = v.content;
    var c = b(r);
    var s = c ? {} : r;
    var d = s.host, g = s.padding, h = s.viewport, p = s.content;
    var w = c ? r : s.target;
    var S = k(w, "textarea");
    var C = w.ownerDocument;
    var x = w === C.body;
    var A = C.defaultView;
    var P = we.bind(0, [ w ]);
    var z = me.bind(0, [ w ]);
    var T = P(ze, u, h);
    var M = T === w;
    var R = M && x;
    var I = {
      J: w,
      K: S ? P(ze, o, d) : w,
      rr: T,
      ar: !M && z(ze, f, g),
      er: !M && z(ze, l, p),
      nr: !M && !n && i && i(a),
      tr: R ? C.documentElement : T,
      ir: R ? C : T,
      vr: A,
      ur: C,
      lr: S,
      Z: x,
      cr: c,
      $: M,
      sr: function _viewportHasClass(r, a) {
        return M ? H(T, ea, a) : gr(T, r);
      },
      dr: function _viewportAddRemoveClass(r, a, e) {
        return M ? L(T, ea, a, e) : (e ? pr : hr)(T, r);
      }
    };
    var V = E(I).reduce((function(r, a) {
      var e = I[a];
      return y(r, e && !F(e) ? e : false);
    }), []);
    var j = function elementIsGenerated(r) {
      return r ? m(V, r) > -1 : null;
    };
    var q = I.J, U = I.K, N = I.ar, Z = I.rr, $ = I.er, J = I.nr;
    var K = [];
    var Q = S && j(U);
    var rr = S ? q : B([ $, Z, N, U, q ].find((function(r) {
      return false === j(r);
    })));
    var ar = $ || Z;
    var er = function appendElements() {
      var r = Le(U, M ? "viewport" : "host");
      var a = pr(N, ua);
      var e = pr(Z, !M && fa);
      var t = pr($, ca);
      var i = R ? pr(F(w), sa) : Sr;
      if (Q) {
        G(q, U);
        y(K, (function() {
          G(U, q);
          X(U);
        }));
      }
      Y(ar, rr);
      Y(U, N);
      Y(N || U, !M && Z);
      Y(Z, $);
      y(K, (function() {
        i();
        r();
        D(Z, na);
        D(Z, ta);
        if (j($)) {
          Te($);
        }
        if (j(Z)) {
          Te(Z);
        }
        if (j(N)) {
          Te(N);
        }
        a();
        e();
        t();
      }));
      if (n && !M) {
        y(K, hr.bind(0, Z, sa));
      }
      if (J) {
        W(Z, J);
        y(K, X.bind(0, J));
      }
      rr = 0;
    };
    return [ I, er, O.bind(0, K) ];
  };
  var De = function createTrinsicUpdateSegment(r, a) {
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
  var Me = function createPaddingUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.K, v = r.ar, o = r.rr, u = r.$;
    var f = a({
      u: mr,
      o: Tr()
    }, Tr.bind(0, i, "padding", "")), l = f[0], c = f[1];
    return function(r, a, e) {
      var i = c(e), f = i[0], s = i[1];
      var d = _e(), g = d.L, h = d.F;
      var p = n(), b = p.br;
      var w = r.pr, m = r._r, y = r.wr;
      var S = a("paddingAbsolute"), C = S[0], O = S[1];
      var x = !h && m;
      if (w || s || x) {
        var E = l(e);
        f = E[0];
        s = E[1];
      }
      var P = !u && (O || y || s);
      if (P) {
        var z = !C || !v && !g;
        var T = f.r + f.l;
        var L = f.t + f.b;
        var H = {
          marginRight: z && !b ? -T : 0,
          marginBottom: z ? -L : 0,
          marginLeft: z && b ? -T : 0,
          top: z ? -f.t : 0,
          right: z ? b ? -f.r : "auto" : 0,
          left: z ? b ? "auto" : -f.l : 0,
          width: z ? "calc(100% + " + T + "px)" : ""
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
          ar: f,
          mr: !z,
          R: v ? D : A({}, H, D)
        });
      }
      return {
        yr: P
      };
    };
  };
  var Re = Math.max;
  var Ie = Re.bind(0, 0);
  var Ve = "visible";
  var je = "hidden";
  var ke = 42;
  var Be = {
    u: br,
    o: {
      w: 0,
      h: 0
    }
  };
  var Fe = {
    u: wr,
    o: {
      x: je,
      y: je
    }
  };
  var qe = function getOverflowAmount(r, a) {
    var e = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
    var n = {
      w: Ie(r.w - a.w),
      h: Ie(r.h - a.h)
    };
    return {
      w: n.w > e ? n.w : 0,
      h: n.h > e ? n.h : 0
    };
  };
  var Ue = function conditionalClass(r, a, e) {
    return e ? pr(r, a) : hr(r, a);
  };
  var Ne = function overflowIsVisible(r) {
    return 0 === r.indexOf(Ve);
  };
  var Ye = function createOverflowUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.K, v = r.ar, o = r.rr, u = r.nr, f = r.$, l = r.dr, c = r.Z, s = r.vr;
    var d = _e(), g = d.k, h = d.F, p = d.L, b = d.H;
    var w = Ia()[fe];
    var m = !f && !p && (b.x || b.y);
    var y = c && f;
    var S = a(Be, Vr.bind(0, o)), C = S[0], O = S[1];
    var x = a(Be, Ir.bind(0, o)), E = x[0], A = x[1];
    var P = a(Be), z = P[0], H = P[1];
    var D = a(Be), M = D[0], R = D[1];
    var I = a(Fe), V = I[0];
    var j = function fixFlexboxGlue(r, a) {
      style(o, {
        height: ""
      });
      if (a) {
        var e = n(), t = e.mr, v = e.ar;
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
    var k = function getViewportOverflowState(r, a) {
      var e = !p && !r ? ke : 0;
      var n = function getStatePerAxis(r, n, t) {
        var i = style(o, r);
        var v = a ? a[r] : i;
        var u = "scroll" === v;
        var f = n ? e : t;
        var l = u && !p ? f : 0;
        var c = n && !!e;
        return [ i, u, l, c ];
      };
      var t = n("overflowX", b.x, g.x), i = t[0], v = t[1], u = t[2], f = t[3];
      var l = n("overflowY", b.y, g.y), c = l[0], s = l[1], d = l[2], h = l[3];
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
    var B = function setViewportOverflowState(r, a, e, n) {
      var t = function setAxisOverflowStyle(r, a) {
        var e = Ne(r);
        var n = a && e && r.replace(Ve + "-", "") || "";
        return [ a && !e ? r : "", Ne(n) ? "hidden" : n ];
      };
      var i = t(e.x, a.x), v = i[0], o = i[1];
      var u = t(e.y, a.y), f = u[0], l = u[1];
      n.overflowX = o && f ? o : v;
      n.overflowY = l && v ? l : f;
      return k(r, n);
    };
    var F = function hideNativeScrollbars(r, a, e, t) {
      var i = r.I, v = r.V;
      var o = v.x, u = v.y;
      var f = i.x, l = i.y;
      var c = n(), s = c.R;
      var d = a ? "marginLeft" : "marginRight";
      var g = a ? "paddingLeft" : "paddingRight";
      var h = s[d];
      var p = s.marginBottom;
      var b = s[g];
      var w = s.paddingBottom;
      t.width = "calc(100% + " + (l + -1 * h) + "px)";
      t[d] = -l + h;
      t.marginBottom = -f + p;
      if (e) {
        t[g] = b + (u ? l : 0);
        t.paddingBottom = w + (o ? f : 0);
      }
    };
    var q = w ? w.M(m, h, o, u, n, k, F) : [ function() {
      return m;
    }, function() {
      return [ Sr ];
    } ], U = q[0], N = q[1];
    return function(r, a, e) {
      var u = r.pr, c = r.Or, d = r._r, g = r.yr, w = r.hr, m = r.wr;
      var S = n(), x = S.gr, P = S.br;
      var D = a("showNativeOverlaidScrollbars"), I = D[0], q = D[1];
      var Y = a("overflow"), W = Y[0], G = Y[1];
      var X = I && b.x && b.y;
      var Z = !f && !h && (u || d || c || q || w);
      var $ = Ne(W.x);
      var J = Ne(W.y);
      var K = $ || J;
      var Q = O(e);
      var rr = A(e);
      var ar = H(e);
      var er = R(e);
      var nr;
      if (q && p) {
        l(sa, va, !X);
      }
      if (Z) {
        nr = k(X);
        j(nr, x);
      }
      if (u || g || d || m || q) {
        if (K) {
          l(da, ia, false);
        }
        var tr = N(X, P, nr), ir = tr[0], vr = tr[1];
        var or = Q = C(e), ur = or[0], fr = or[1];
        var lr = rr = E(e), cr = lr[0], sr = lr[1];
        var dr = Rr(o);
        var gr = cr;
        var hr = dr;
        ir();
        if ((sr || fr || q) && vr && !X && U(vr, cr, ur, P)) {
          hr = Rr(o);
          gr = Ir(o);
        }
        var pr = {
          w: Ie(Re(cr.w, gr.w) + ur.w),
          h: Ie(Re(cr.h, gr.h) + ur.h)
        };
        var _r = {
          w: Ie(y ? s.innerWidth : hr.w + Ie(dr.w - cr.w) + ur.w),
          h: Ie(y ? s.innerHeight : hr.h + Ie(dr.h - cr.h) + ur.h)
        };
        er = M(_r);
        ar = z(qe(pr, _r), e);
      }
      var br = er, wr = br[0], mr = br[1];
      var yr = ar, Sr = yr[0], Cr = yr[1];
      var Or = rr, xr = Or[0], Er = Or[1];
      var Ar = Q, Pr = Ar[0], zr = Ar[1];
      var Tr = {
        x: Sr.w > 0,
        y: Sr.h > 0
      };
      var Lr = $ && J && (Tr.x || Tr.y) || $ && Tr.x && !Tr.y || J && Tr.y && !Tr.x;
      if (g || m || zr || Er || mr || Cr || G || q || Z) {
        var Hr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Dr = B(X, Tr, W, Hr);
        var Mr = U(Dr, xr, Pr, P);
        if (!f) {
          F(Dr, P, Mr, Hr);
        }
        if (Z) {
          j(Dr, x);
        }
        if (f) {
          T(i, na, Hr.overflowX);
          T(i, ta, Hr.overflowY);
        } else {
          style(o, Hr);
        }
      }
      L(i, ea, ia, Lr);
      Ue(v, da, Lr);
      !f && Ue(o, da, K);
      var Vr = V(k(X).Cr), jr = Vr[0], kr = Vr[1];
      t({
        Cr: jr,
        Er: {
          x: wr.w,
          y: wr.h
        },
        Ar: {
          x: Sr.w,
          y: Sr.h
        },
        Pr: Tr
      });
      return {
        zr: kr,
        Tr: mr,
        Lr: Cr
      };
    };
  };
  var We = function prepareUpdateHints(r, a, e) {
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
  var Ge = function createStructureSetupUpdate(r, a) {
    var e = r.rr, n = r.dr;
    var t = _e(), i = t.L, v = t.H, o = t.F;
    var u = !i && (v.x || v.y);
    var f = [ De(r, a), Me(r, a), Ye(r, a) ];
    return function(r, a, t) {
      var i = We(A({
        pr: false,
        yr: false,
        wr: false,
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
      n("", oa, true);
      var s = i;
      each(f, (function(a) {
        s = We(s, a(s, r, !!t) || {}, t);
      }));
      M(e, l);
      R(e, c);
      n("", oa);
      return s;
    };
  };
  var Xe = 3333333;
  var Ze = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var $e = function createSizeObserver(r, e, n) {
    var t = n || {}, i = t.Hr, v = void 0 === i ? false : i, o = t.Dr, u = void 0 === o ? false : o;
    var f = Ia()[ae];
    var l = _e(), s = l.B;
    var h = $('<div class="' + ga + '"><div class="' + pa + '"></div></div>');
    var p = h[0];
    var b = p.firstChild;
    var w = zr.bind(0, r);
    var m = a({
      o: void 0,
      g: true,
      u: function _equal(r, a) {
        return !(!r || !Ze(r) && Ze(a));
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
        var h = Ze(f);
        var b = Ze(l);
        t = !l || !h;
        i = !b && h;
        o = !t;
      } else if (n) {
        o = r[1];
      } else {
        i = true === r;
      }
      if (v && o) {
        var w = n ? r[0] : zr(p);
        M(p, w ? s.n ? -Xe : s.i ? 0 : Xe : Xe);
        R(p, Xe);
      }
      if (!t) {
        e({
          pr: !n,
          Mr: n ? r : void 0,
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
        var e = new or(C);
        e.observe(b);
        y(x, (function() {
          e.disconnect();
        }));
      } else if (f) {
        var n = f.P(b, C, u), t = n[0], i = n[1];
        E = t;
        y(x, i);
      }
      if (v) {
        var o = a({
          o: !w()
        }, w), l = o[0];
        y(x, Ur(p, "scroll", (function(r) {
          var a = l();
          var e = a[0], n = a[1];
          if (n) {
            hr(b, "ltr rtl");
            if (e) {
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
  var Je = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var Ke = function createTrinsicObserver(r, e) {
    var n;
    var t = Z(ma);
    var i = [];
    var v = a({
      o: false
    }), o = v[0];
    var u = function triggerOnTrinsicChangedCallback(r, a) {
      if (r) {
        var n = o(Je(r));
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
          var r = Mr(t);
          u(r);
        };
        var e = $e(t, a), v = e[0], o = e[1];
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
  var Qe = function createEventContentChange(r, a, e) {
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
            var f = Ur(e, i, (function(r) {
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
  var rn = function createDOMObserver(r, a, e, n) {
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
    var g = Qe(r, d, u), h = g[0], p = g[1];
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
      each(t, (function(e) {
        var t = e.attributeName, i = e.target, c = e.type, s = e.oldValue, p = e.addedNodes;
        var S = "attributes" === c;
        var C = "childList" === c;
        var O = r === i;
        var x = S && l(t) ? T(i, t) : 0;
        var E = 0 !== x && s !== x;
        var A = m(w, t) > -1 && E;
        if (a && !O) {
          var P = !S;
          var z = S && A;
          var L = z && f && k(i, f);
          var H = L ? !v(i, t, s, x) : P || z;
          var D = H && !o(e, !!L, r, n);
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
  var an = "[" + ea + "]";
  var en = "." + fa;
  var nn = [ "tabindex" ];
  var tn = [ "wrap", "cols", "rows" ];
  var vn = [ "id", "class", "style", "open" ];
  var un = function createStructureSetupObservers(r, e, n) {
    var t;
    var i;
    var v;
    var o = e[1];
    var u = r.K, c = r.rr, g = r.er, h = r.lr, p = r.$, b = r.sr, w = r.dr;
    var S = _e(), C = S.F;
    var O = a({
      u: br,
      o: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = b(da, ia);
      var a = b(la, "");
      var e = a && M(c);
      var n = a && R(c);
      w(da, ia);
      w(la, "");
      w("", oa, true);
      var t = Ir(g);
      var i = Ir(c);
      var v = Vr(c);
      w(da, ia, r);
      w(la, "", a);
      w("", oa);
      M(c, e);
      R(c, n);
      return {
        w: i.w + t.w + v.w,
        h: i.h + t.h + v.h
      };
    })), x = O[0];
    var P = h ? tn : vn.concat(tn);
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
      each(r || nn, (function(r) {
        if (m(nn, r) > -1) {
          var a = T(u, r);
          if (l(a)) {
            T(c, r, a);
          } else {
            D(c, r);
          }
        }
      }));
    };
    var H = function onTrinsicChanged(r, a) {
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
      var a = r.pr, e = r.Mr, t = r.Dr;
      var i = !a || t ? n : z;
      var v = false;
      if (e) {
        var u = e[0], f = e[1];
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
    var k = g || !C ? Ke(u, H) : [ Sr, Sr, Sr ], B = k[0], F = k[1], N = k[2];
    var Y = !p ? $e(u, I, {
      Dr: true,
      Hr: true
    }) : [ Sr, Sr ], W = Y[0], G = Y[1];
    var X = rn(u, false, j, {
      Ir: vn,
      Rr: vn.concat(nn)
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
        A(r, H.apply(0, y(e, true)));
      }
      if (n) {
        A(r, V.apply(0, y(n, true)));
      }
      return r;
    }, function(r) {
      var a = r("updating.ignoreMutation"), e = a[0];
      var n = r("updating.attributes"), o = n[0], u = n[1];
      var l = r("updating.elementEvents"), h = l[0], b = l[1];
      var w = r("updating.debounce"), m = w[0], y = w[1];
      var S = b || u;
      var C = function ignoreMutationFromOptions(r) {
        return s(e) && e(r);
      };
      if (S) {
        if (v) {
          v[1]();
          v[0]();
        }
        v = rn(g || c, true, V, {
          Ir: P.concat(o || []),
          Rr: P.concat(o || []),
          Vr: h,
          jr: an,
          Br: function _ignoreContentChange(r, a) {
            var e = r.target, n = r.attributeName;
            var t = !a && n && !p ? U(e, an, en) : false;
            return t || !!q(e, "." + ya) || !!C(r);
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
  var fn = {
    x: 0,
    y: 0
  };
  var ln = {
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
    Er: fn,
    Ar: fn,
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
  var cn = function createStructureSetup(r, a) {
    var e = Ae(a, {});
    var n = Pe(ln);
    var t = Zr(), i = t[0], v = t[1], o = t[2];
    var u = n[0];
    var f = He(r), l = f[0], c = f[1], s = f[2];
    var d = Ge(l, n);
    var g = function triggerUpdateEvent(r, a, e) {
      var n = E(r).some((function(a) {
        return r[a];
      }));
      if (n || !P(a) || e) {
        o("u", [ r, a, e ]);
      }
    };
    var h = un(l, n, (function(r) {
      g(d(e, r), {}, false);
    })), p = h[0], b = h[1], w = h[2], m = h[3];
    var y = u.bind(0);
    y.Fr = function(r) {
      i("u", r);
    };
    y.qr = function() {
      b();
      c();
    };
    y.Ur = l;
    return [ function(r, e) {
      var n = Ae(a, r, e);
      m(n);
      g(d(n, w(), e), r, !!e);
    }, y, function() {
      v();
      p();
      s();
    } ];
  };
  var sn = Math.round;
  var dn = function getClientOffset(r) {
    return {
      x: r.clientX,
      y: r.clientY
    };
  };
  var gn = function getScale(r) {
    var a = jr(r), e = a.width, n = a.height;
    var t = Mr(r), i = t.w, v = t.h;
    return {
      x: sn(e) / i || 1,
      y: sn(n) / v || 1
    };
  };
  var hn = function continuePointerDown(r, a, e) {
    var n = a.scrollbars;
    var t = r.button, i = r.isPrimary, v = r.pointerType;
    var o = n.pointers;
    return 0 === t && i && n[e] && (o || []).includes(v);
  };
  var pn = function createRootClickStopPropagationEvents(r, a) {
    return Ur(r, "mousedown", Ur.bind(0, a, "click", Nr, {
      A: true,
      O: true
    }), {
      O: true
    });
  };
  var _n = function createDragScrollingEvents(r, a, e, n, t, i) {
    var v = _e(), o = v.B;
    var u = e.Nr, f = e.Yr, l = e.Wr;
    var c = "scroll" + (i ? "Left" : "Top");
    var s = i ? "x" : "y";
    var d = i ? "w" : "h";
    var g = function createOnPointerMoveHandler(r, a, e) {
      return function(v) {
        var g = t(), h = g.Ar;
        var p = (dn(v)[s] - a) * e;
        var b = Mr(f)[d] - Mr(u)[d];
        var w = p / b;
        var m = w * h[s];
        var y = zr(l);
        var S = y && i ? o.n || o.i ? 1 : -1 : 1;
        n[c] = r + m * S;
      };
    };
    return Ur(u, "pointerdown", (function(e) {
      if (hn(e, r, "dragScroll")) {
        var t = Ur(a, "selectstart", (function(r) {
          return Yr(r);
        }), {
          C: false
        });
        var i = Ur(u, "pointermove", g(n[c] || 0, dn(e)[s], 1 / gn(n)[s]));
        Ur(u, "pointerup", (function(r) {
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
  var bn = function createScrollbarsSetupEvents(r, a) {
    return function(e, n, t, i, v) {
      var o = e.Wr;
      return O.bind(0, [ Ur(o, "pointerenter", (function() {
        n(Ta, true);
      })), Ur(o, "pointerleave pointercancel", (function() {
        n(Ta);
      })), pn(o, t), _n(r, t, e, i, a, v) ]);
    };
  };
  var wn = Math.min, mn = Math.max, yn = Math.abs, Sn = Math.round;
  var Cn = function getScrollbarHandleLengthRatio(r, a, e, n) {
    if (n) {
      var t = e ? "x" : "y";
      var i = n.Ar, v = n.Er;
      var o = v[t];
      var u = i[t];
      return mn(0, wn(1, o / (o + u)));
    }
    var f = e ? "w" : "h";
    var l = Mr(r)[f];
    var c = Mr(a)[f];
    return mn(0, wn(1, l / c));
  };
  var On = function getScrollbarHandleOffsetRatio(r, a, e, n, t, i) {
    var v = _e(), o = v.B;
    var u = i ? "x" : "y";
    var f = i ? "Left" : "Top";
    var l = n.Ar;
    var c = Sn(l[u]);
    var s = yn(e["scroll" + f]);
    var d = i && t;
    var g = o.i ? s : c - s;
    var h = d ? g : s;
    var p = wn(1, h / c);
    var b = Cn(r, a, i);
    return 1 / b * (1 - b) * p;
  };
  var xn = function createScrollbarsSetupElements(r, a, e) {
    var n = _e(), t = n.U;
    var i = t(), v = i.scrollbarsSlot;
    var o = a.ur, u = a.J, f = a.K, l = a.rr, s = a.cr, d = a.tr;
    var g = s ? {} : r, h = g.scrollbarsSlot;
    var p = me([ u, f, l ], (function() {
      return f;
    }), v, h);
    var b = function scrollbarStructureAddRemoveClass(r, a, e) {
      var n = e ? pr : hr;
      each(r, (function(r) {
        n(r.Wr, a);
      }));
    };
    var w = function scrollbarsHandleStyle(r, a) {
      each(r, (function(r) {
        var e = a(r), n = e[0], t = e[1];
        style(n, t);
      }));
    };
    var m = function scrollbarStructureRefreshHandleLength(r, a, e) {
      w(r, (function(r) {
        var n;
        var t = r.Nr, i = r.Yr;
        return [ t, (n = {}, n[e ? "width" : "height"] = (100 * Cn(t, i, e, a)).toFixed(3) + "%", 
        n) ];
      }));
    };
    var S = function scrollbarStructureRefreshHandleOffset(r, a, e) {
      var n = e ? "X" : "Y";
      w(r, (function(r) {
        var t = r.Nr, i = r.Yr, v = r.Wr;
        var o = On(t, i, d, a, zr(v), e);
        var u = o === o;
        return [ t, {
          transform: u ? "translate" + n + "(" + (100 * o).toFixed(3) + "%)" : ""
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
      t && b(E, r, a);
      i && b(A, r, a);
    };
    var z = function refreshScrollbarsHandleLength(r) {
      m(E, r, true);
      m(A, r);
    };
    var T = function refreshScrollbarsHandleOffset(r) {
      S(E, r, true);
      S(A, r);
    };
    var L = function generateScrollbarDOM(r) {
      var a = r ? Ca : Oa;
      var n = r ? E : A;
      var t = C(n) ? za : "";
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
      y(n, f);
      y(x, [ X.bind(0, i), e(f, P, o, d, r) ]);
      return f;
    };
    var H = L.bind(0, true);
    var D = L.bind(0, false);
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
      Xr: T,
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
  var En = function createSelfCancelTimeout(r) {
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
  var An = function createScrollbarsSetup(r, a, e) {
    var n;
    var t;
    var i;
    var v;
    var o;
    var u = 0;
    var f = Pe({});
    var l = f[0];
    var c = En(), s = c[0], d = c[1];
    var g = En(), h = g[0], p = g[1];
    var b = En(100), w = b[0], m = b[1];
    var y = En(100), S = y[0], C = y[1];
    var x = En((function() {
      return u;
    })), E = x[0], A = x[1];
    var P = xn(r, e.Ur, bn(a, e)), z = P[0], T = P[1], L = P[2];
    var H = e.Ur, D = H.K, I = H.rr, V = H.tr, j = H.ir, k = H.$, B = H.Z;
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
      A();
      if (r) {
        N(Ha);
      } else {
        var e = function hide() {
          return N(Ha, true);
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
    var K = [ m, A, C, p, d, L, Ur(D, "pointerover", J, {
      A: true
    }), Ur(D, "pointerenter", J), Ur(D, "pointerleave", (function() {
      v = false;
      t && $(false);
    })), Ur(D, "pointermove", (function() {
      n && s((function() {
        m();
        $(true);
        S((function() {
          n && $(false);
        }));
      }));
    })), Ur(j, "scroll", (function() {
      h((function() {
        W(e());
        i && $(true);
        w((function() {
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
      var l = f.Tr, c = f.Lr, s = f.zr, d = f.wr;
      var g = Ae(a, r, v);
      var h = e();
      var p = h.Ar, b = h.Cr, w = h.br;
      var m = g("scrollbars.theme"), y = m[0], S = m[1];
      var C = g("scrollbars.visibility"), O = C[0], x = C[1];
      var E = g("scrollbars.autoHide"), A = E[0], P = E[1];
      var z = g("scrollbars.autoHideDelay"), T = z[0];
      var L = g("scrollbars.dragScroll"), H = L[0], D = L[1];
      var M = g("scrollbars.clickScroll"), R = M[0], I = M[1];
      var V = l || c || d || v;
      var j = s || x || v;
      var k = function setScrollbarVisibility(r, a) {
        var e = "visible" === O || "auto" === O && "scroll" === r;
        N(Aa, e, a);
        return e;
      };
      u = T;
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
      if (D) {
        N(Ma, H);
      }
      if (I) {
        N(Da, R);
      }
      if (j) {
        var F = k(b.x, true);
        var q = k(b.y, false);
        var U = F && q;
        N(Pa, !U);
      }
      if (V) {
        Y(h);
        W(h);
        N(La, !p.x, true);
        N(La, !p.y, false);
        N(Sa, w && !B);
      }
    }, Q, O.bind(0, K) ];
  };
  var Pn = function OverlayScrollbars(r, a, e) {
    var n = _e(), t = n.Y, i = n.q;
    var v = Ia();
    var o = b(r);
    var u = o ? r : r.target;
    var f = xe(u);
    if (a && !f) {
      var l = false;
      var c = v[Ja];
      var d = function validateOptions(r) {
        var a = r || {};
        var e = c && c.P;
        return e ? e(a, true) : a;
      };
      var g = A({}, t(), d(a));
      var h = Zr(e), p = h[0], w = h[1], m = h[2];
      var y = cn(r, g), S = y[0], C = y[1], O = y[2];
      var x = An(r, g, C), z = x[0], T = x[1], L = x[2];
      var H = function update(r, a) {
        S(r, !!a);
      };
      var D = i(H.bind(0, {}, true));
      var M = function destroy(r) {
        Oe(u);
        D();
        L();
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
          var r = C(), a = r.Er, e = r.Ar, n = r.Cr, t = r.Pr, i = r.ar, v = r.mr, o = r.br;
          return A({}, {
            overflowEdge: a,
            overflowAmount: e,
            overflowStyle: n,
            hasOverflow: t,
            padding: i,
            paddingAbsolute: v,
            directionRTL: o,
            destroyed: l
          });
        },
        elements: function elements() {
          var r = C.Ur, a = r.J, e = r.K, n = r.ar, t = r.rr, i = r.er, v = r.tr, o = r.ir;
          var u = T.Ur, f = u.$r, l = u.ra;
          var c = function translateScrollbarStructure(r) {
            var a = r.Nr, e = r.Yr, n = r.Wr;
            return {
              scrollbar: n,
              track: e,
              handle: a
            };
          };
          var s = function translateScrollbarsSetupElement(r) {
            var a = r.Jr, e = r.Kr;
            var n = c(a[0]);
            return A({}, n, {
              clone: function clone() {
                var r = c(e());
                z({}, true, {});
                return r;
              }
            });
          };
          return A({}, {
            target: a,
            host: e,
            padding: n || t,
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
      C.Fr((function(r, a, e) {
        z(a, e, r);
      }));
      each(E(v), (function(r) {
        var a = v[r];
        if (s(a)) {
          a(OverlayScrollbars, R);
        }
      }));
      if (ye(!o && r.cancel, C.Ur)) {
        M(true);
        return R;
      }
      C.qr();
      T.qr();
      Ce(u, R);
      m("initialized", [ R ]);
      C.Fr((function(r, a, e) {
        var n = r.pr, t = r.wr, i = r.hr, v = r.Tr, o = r.Lr, u = r.zr, f = r._r, l = r.Or;
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
    }
    return f;
  };
  Pn.plugin = Va;
  Pn.valid = function(r) {
    var a = r && r.elements;
    var e = s(a) && a();
    return p(e) && !!xe(e.target);
  };
  Pn.env = function() {
    var r = _e(), a = r.k, e = r.H, n = r.L, t = r.B, i = r.F, v = r.D, o = r.G, u = r.X, f = r.U, l = r.N, c = r.Y, s = r.W;
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
  r.scrollbarsHidingPlugin = le;
  r.sizeObserverPlugin = ee;
  Object.defineProperty(r, "v", {
    value: true
  });
}));
//# sourceMappingURL=overlayscrollbars.js.map
