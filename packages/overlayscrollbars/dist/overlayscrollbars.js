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
    each(E(a), (function(e) {
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
  var P = function getSetProp(r, a, e, n) {
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
  var D = function attrClass(r, a, e, n) {
    if (e) {
      var t = T(r, a) || "";
      var i = new Set(t.split(" "));
      i[n ? "add" : "delete"](e);
      T(r, a, S(i).join(" ").trim());
    }
  };
  var L = function hasAttrClass(r, a, e) {
    var n = T(r, a) || "";
    var t = new Set(n.split(" "));
    return t.has(e);
  };
  var I = function removeAttr(r, a) {
    r && r.removeAttribute(a);
  };
  var M = function scrollLeft(r, a) {
    return P("scrollLeft", 0, r, a);
  };
  var H = function scrollTop(r, a) {
    return P("scrollTop", 0, r, a);
  };
  var R = Element.prototype;
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
      var e = R.matches || R.msMatchesSelector;
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
      var e = R.closest;
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
  var W = function prependChildren(r, a) {
    N(r, r && r.firstChild, a);
  };
  var G = function insertBefore(r, a) {
    N(F(r), r, a);
  };
  var X = function insertAfter(r, a) {
    N(F(r), r && r.nextSibling, a);
  };
  var Z = function removeElements(r) {
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
  var $ = function createDiv(r) {
    var a = document.createElement("div");
    if (r) {
      T(a, "class", r);
    }
    return a;
  };
  var J = function createDOM(r) {
    var a = $();
    a.innerHTML = r.trim();
    return each(B(a), (function(r) {
      return Z(r);
    }));
  };
  var K = function firstLetterToUpper(r) {
    return r.charAt(0).toUpperCase() + r.slice(1);
  };
  var Q = function getDummyStyle() {
    return $().style;
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
    var e = K(r);
    var n = Q();
    each(rr, (function(t) {
      var i = t.replace(/-/g, "");
      var v = [ r, t + r, i + e, K(i) + e ];
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
      a = a || window[e + K(r)];
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
  var cr = window.setTimeout;
  var sr = window.clearTimeout;
  var dr = /[^\x20\t\r\n\f]+/g;
  var gr = function classListAction(r, a, e) {
    var n = r && r.classList;
    var t;
    var i = 0;
    var v = false;
    if (n && a && l(a)) {
      var o = a.match(dr) || [];
      v = o.length > 0;
      while (t = o[i++]) {
        v = !!e(n, t) && v;
      }
    }
    return v;
  };
  var hr = function hasClass(r, a) {
    return gr(r, a, (function(r, a) {
      return r.contains(a);
    }));
  };
  var pr = function removeClass(r, a) {
    gr(r, a, (function(r, a) {
      return r.remove(a);
    }));
  };
  var _r = function addClass(r, a) {
    gr(r, a, (function(r, a) {
      return r.add(a);
    }));
    return pr.bind(0, r, a);
  };
  var wr = function equal(r, a, e, n) {
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
    return wr(r, a, [ "w", "h" ]);
  };
  var mr = function equalXY(r, a) {
    return wr(r, a, [ "x", "y" ]);
  };
  var yr = function equalTRBL(r, a) {
    return wr(r, a, [ "t", "r", "b", "l" ]);
  };
  var Sr = function equalBCRWH(r, a, e) {
    return wr(r, a, [ "width", "height" ], e && function(r) {
      return Math.round(r);
    });
  };
  var Cr = function noop() {};
  var Or = function debounce(r, a) {
    var e;
    var n;
    var t;
    var i = Cr;
    var v = a || {}, o = v.p, u = v._, l = v.m;
    var c = function invokeFunctionToDebounce(a) {
      i();
      sr(e);
      e = n = void 0;
      i = Cr;
      r.apply(this, a);
    };
    var d = function mergeParms(r) {
      return l && n ? l(n, r) : r;
    };
    var g = function flush() {
      if (i !== Cr) {
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
        var p = a > 0 ? cr : lr;
        var w = a > 0 ? sr : fr;
        var b = d(r);
        var m = b || r;
        var y = c.bind(0, m);
        i();
        var C = p(y, a);
        i = function clear() {
          return w(C);
        };
        if (h && !e) {
          e = cr(g, l);
        }
        n = t = m;
      } else {
        c(r);
      }
    };
    h.S = g;
    return h;
  };
  var xr = {
    opacity: 1,
    zindex: 1
  };
  var Er = function parseToZeroOrNumber(r, a) {
    var e = a ? parseFloat(r) : parseInt(r, 10);
    return e === e ? e : 0;
  };
  var zr = function adaptCSSVal(r, a) {
    return !xr[r.toLowerCase()] && f(a) ? a + "px" : a;
  };
  var Ar = function getCSSVal(r, a, e) {
    return null != a ? a[e] || a.getPropertyValue(e) : r.style[e];
  };
  var Pr = function setCSSVal(r, a, e) {
    try {
      if (r) {
        var n = r.style;
        if (!v(n[a])) {
          n[a] = zr(a, e);
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
      t: Er(f[i]),
      r: Er(f[v]),
      b: Er(f[o]),
      l: Er(f[u])
    };
  };
  var Dr = {
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
    } : Dr;
  };
  var Mr = function clientSize(r) {
    return r ? {
      w: r.clientWidth,
      h: r.clientHeight
    } : Dr;
  };
  var Hr = function scrollSize(r) {
    return r ? {
      w: r.scrollWidth,
      h: r.scrollHeight
    } : Dr;
  };
  var Rr = function fractionalSize(r) {
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
  var Nr = {
    x: 0,
    y: 0
  };
  var Yr = function absoluteCoordinates(r) {
    var a = r ? Vr(r) : 0;
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
      a = z({}, a, r);
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
  var ia = "os-padding";
  var va = "os-viewport";
  var oa = va + "-arrange";
  var ua = "os-content";
  var fa = va + "-scrollbar-hidden";
  var la = "os-overflow-visible";
  var ca = "os-size-observer";
  var sa = ca + "-appear";
  var da = ca + "-listener";
  var ga = da + "-scroll";
  var ha = da + "-item";
  var pa = ha + "-final";
  var _a = "os-trinsic-observer";
  var wa = "os-scrollbar";
  var ba = wa + "-horizontal";
  var ma = wa + "-vertical";
  var ya = "os-scrollbar-track";
  var Sa = "os-scrollbar-handle";
  var Ca = wa + "-visible";
  var Oa = wa + "-cornerless";
  var xa = wa + "-transitionless";
  var Ea = wa + "-interaction";
  var za = wa + "-auto-hidden";
  var Aa = function opsStringify(r) {
    return JSON.stringify(r, (function(r, a) {
      if (s(a)) {
        throw new Error;
      }
      return a;
    }));
  };
  var Pa = {
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
      touch: true
    }
  };
  var Ta = function getOptionsDiff(r, a) {
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
  var Da = {};
  var La = function getPlugins() {
    return z({}, Da);
  };
  var Ia = function addPlugin(r) {
    each(d(r) ? r : [ r ], (function(r) {
      each(E(r), (function(a) {
        Da[a] = r[a];
      }));
    }));
  };
  var Ma = {
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
  })(Ma);
  var Ha = getDefaultExportFromCjs(Ma.exports);
  var Ra = {
    boolean: "__TPL_boolean_TYPE__",
    number: "__TPL_number_TYPE__",
    string: "__TPL_string_TYPE__",
    array: "__TPL_array_TYPE__",
    object: "__TPL_object_TYPE__",
    function: "__TPL_function_TYPE__",
    null: "__TPL_null_TYPE__"
  };
  var Va = function validateRecursive(r, a, e, n) {
    var t = {};
    var i = Ha({}, a);
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
          each(Ra, (function(e, n) {
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
            m = Ra[O] === r;
          }
          y(C, e ? Ra.string : a);
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
  var ja = function validateOptions(r, a, e) {
    return Va(r, a, e);
  };
  var ka;
  var Ba = Ra.number;
  var Fa = Ra.boolean;
  var qa = [ Ra.array, Ra.null ];
  var Ua = "hidden scroll visible visible-hidden";
  var Na = "visible hidden auto";
  var Ya = "never scroll leavemove";
  var Wa = {
    paddingAbsolute: Fa,
    showNativeOverlaidScrollbars: Fa,
    updating: {
      elementEvents: qa,
      attributes: qa,
      debounce: [ Ra.number, Ra.array, Ra.null ],
      ignoreMutation: [ Ra.function, Ra.null ]
    },
    overflow: {
      x: Ua,
      y: Ua
    },
    scrollbars: {
      theme: [ Ra.string, Ra.null ],
      visibility: Na,
      autoHide: Ya,
      autoHideDelay: Ba,
      dragScroll: Fa,
      clickScroll: Fa,
      touch: Fa
    }
  };
  var Ga = "__osOptionsValidationPlugin";
  ka = {}, ka[Ga] = {
    P: function _(r, a) {
      var e = ja(Wa, r, a), n = e[0], t = e[1];
      return Ha({}, t, n);
    }
  }, ka;
  var Xa;
  var Za = 3333333;
  var $a = "scroll";
  var Ja = "__osSizeObserverPlugin";
  var Ka = (Xa = {}, Xa[Ja] = {
    P: function _(r, a, e) {
      var n = J('<div class="' + ha + '" dir="ltr"><div class="' + ha + '"><div class="' + pa + '"></div></div><div class="' + ha + '"><div class="' + pa + '" style="width: 200%; height: 200%"></div></div></div>');
      Y(r, n);
      _r(r, ga);
      var t = n[0];
      var i = t.lastChild;
      var v = t.firstChild;
      var o = null == v ? void 0 : v.firstChild;
      var u = Ir(t);
      var f = u;
      var l = false;
      var c;
      var s = function reset() {
        M(v, Za);
        H(v, Za);
        M(i, Za);
        H(i, Za);
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
        l = !r || !br(f, u);
        if (r) {
          Ur(r);
          if (l && !c) {
            fr(c);
            c = lr(d);
          }
        } else {
          d(false === r);
        }
        s();
      };
      var h = y([], [ qr(v, $a, g), qr(i, $a, g) ]);
      style(o, {
        width: Za,
        height: Za
      });
      s();
      return [ e ? g.bind(0, false) : s, h ];
    }
  }, Xa);
  var Qa;
  var re = 0;
  var ae = Math.round, ee = Math.abs;
  var ne = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var a = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / a;
  };
  var te = function diffBiggerThanOne(r, a) {
    var e = ee(r);
    var n = ee(a);
    return !(e === n || e + 1 === n || e - 1 === n);
  };
  var ie = "__osScrollbarsHidingPlugin";
  var ve = (Qa = {}, Qa[ie] = {
    T: function _createUniqueViewportArrangeElement(r) {
      var a = r.D, e = r.L, n = r.I;
      var t = !n && !a && (e.x || e.y);
      var i = t ? document.createElement("style") : false;
      if (i) {
        T(i, "id", oa + "-" + re);
        re++;
      }
      return i;
    },
    M: function _overflowUpdateSegment(r, a, e, n, t, i, v) {
      var o = function arrangeViewport(a, i, v, o) {
        if (r) {
          var u = t(), f = u.H;
          var l = a.R, c = a.V;
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
                  C.insertRule("#" + T(n, "id") + " + ." + oa + "::before {}", 0);
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
          var l = t(), c = l.H;
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
          pr(e, oa);
          if (!a) {
            h.height = "";
          }
          style(e, h);
          return [ function() {
            v(f, o, r, w);
            style(e, w);
            _r(e, oa);
          }, f ];
        }
        return [ Cr ];
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
          w: ee(v.w),
          h: ee(v.h)
        };
        var u = {
          w: ee(ae(i.w / (r.w / 100))),
          h: ee(ae(i.h / (r.h / 100)))
        };
        var f = ne();
        var l = o.w > 2 && o.h > 2;
        var c = !te(u.w, u.h);
        var s = f !== a && f > 0;
        var d = l && c && s;
        if (d) {
          var g = n(), h = g[0], p = g[1];
          z(e.k, h);
          if (p) {
            t();
          }
        }
        r = i;
        a = f;
      };
    }
  }, Qa);
  var oe;
  var ue = function getNativeScrollbarSize(r, a, e, n) {
    Y(r, a);
    var t = Mr(a);
    var i = Ir(a);
    var v = Rr(e);
    n && Z(a);
    return {
      x: i.h - t.h + v.h,
      y: i.w - t.w + v.w
    };
  };
  var fe = function getNativeScrollbarsHiding(r) {
    var a = false;
    var e = _r(r, fa);
    try {
      a = "none" === style(r, tr("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (n) {}
    e();
    return a;
  };
  var le = function getRtlScrollBehavior(r, a) {
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
  var ce = function getFlexboxGlue(r, a) {
    var e = _r(r, Kr);
    var n = Vr(r);
    var t = Vr(a);
    var i = Sr(t, n, true);
    var v = _r(r, Qr);
    var o = Vr(r);
    var u = Vr(a);
    var f = Sr(u, o, true);
    e();
    v();
    return i && f;
  };
  var se = function createEnvironment() {
    var r = document, e = r.body;
    var n = J('<div class="' + Jr + '"><div></div></div>');
    var t = n[0];
    var i = t.firstChild;
    var v = Gr(), o = v[0], u = v[2];
    var f = a({
      o: ue(e, t, i),
      u: mr
    }, ue.bind(0, e, t, i, true)), l = f[0], c = f[1];
    var s = c(), d = s[0];
    var g = fe(t);
    var h = {
      x: 0 === d.x,
      y: 0 === d.y
    };
    var p = {
      padding: !g,
      content: false,
      cancel: {
        nativeScrollbarsOverlaid: true,
        body: null
      }
    };
    var w = z({}, Pa);
    var b = {
      k: d,
      L: h,
      D: g,
      I: "-1" === style(t, "zIndex"),
      B: le(t, i),
      F: ce(t, i),
      q: function _addListener(r) {
        return o("_", r);
      },
      U: z.bind(0, {}, p),
      N: function _setDefaultInitialization(r) {
        z(p, r);
      },
      Y: z.bind(0, {}, w),
      W: function _setDefaultOptions(r) {
        z(w, r);
      },
      G: z({}, p),
      X: z({}, w)
    };
    I(t, "style");
    Z(t);
    if (!g && (!h.x || !h.y)) {
      var m;
      window.addEventListener("resize", (function() {
        var r = La()[ie];
        m = m || r && r.j();
        m && m(b, l, u.bind(0, "_"));
      }));
    }
    return b;
  };
  var de = function getEnvironment() {
    if (!oe) {
      oe = se();
    }
    return oe;
  };
  var ge = function resolveInitialization(r, a) {
    return s(r) ? r.apply(0, a) : r;
  };
  var he = function staticInitializationElement(r, a, e, n) {
    return ge(n || ge(e, r), r) || a.apply(0, r);
  };
  var pe = function dynamicInitializationElement(r, a, e, n) {
    var t = ge(n, r);
    if (o(t) || v(t)) {
      t = ge(e, r);
    }
    return true === t || o(t) || v(t) ? a.apply(0, r) : t;
  };
  var _e = function cancelInitialization(r, a) {
    var e = r || {}, n = e.nativeScrollbarsOverlaid, t = e.body;
    var i = a.Z, v = a.$;
    var u = de(), f = u.U, l = u.L;
    var s = f().cancel, d = s.nativeScrollbarsOverlaid, g = s.body;
    var h = null != n ? n : d;
    var p = c(t) || o(t) ? t : g;
    var w = (l.x || l.y) && h;
    var b = i && (o(p) ? !v : p);
    return !!w || !!b;
  };
  var we = $.bind(0, "");
  var be = function unwrap(r) {
    Y(F(r), B(r));
    Z(r);
  };
  var me = function addDataAttrHost(r, a) {
    T(r, ra, a);
    return I.bind(0, r, ra);
  };
  var ye = function createStructureSetupElements(r) {
    var a = de();
    var e = a.U, n = a.D;
    var t = La()[ie];
    var i = t && t.T;
    var v = e(), o = v.host, u = v.viewport, f = v.padding, l = v.content;
    var c = w(r);
    var s = c ? {} : r;
    var d = s.host, g = s.padding, h = s.viewport, p = s.content;
    var b = c ? r : s.target;
    var S = k(b, "textarea");
    var C = b.ownerDocument;
    var z = b === C.body;
    var A = C.defaultView;
    var P = z ? n : !!ur && !S && n;
    var T = he.bind(0, [ b ]);
    var M = pe.bind(0, [ b ]);
    var H = [ T(we, u, z && !x(s, "viewport") ? b : h), T(we, u), T(we) ].filter((function(r) {
      return P ? true : r !== b;
    }))[0];
    var R = H === b;
    var V = {
      J: b,
      K: S ? T(we, o, d) : b,
      rr: H,
      ar: !R && M(we, f, g),
      er: !R && M(we, l, p),
      nr: !R && !n && i && i(a),
      tr: A,
      ir: C,
      vr: S,
      Z: z,
      ur: c,
      $: R,
      lr: function _viewportHasClass(r, a) {
        return R ? L(H, ra, a) : hr(H, r);
      },
      cr: function _viewportAddRemoveClass(r, a, e) {
        return R ? D(H, ra, a, e) : (e ? _r : pr)(H, r);
      }
    };
    var j = E(V).reduce((function(r, a) {
      var e = V[a];
      return y(r, e && !F(e) ? e : false);
    }), []);
    var q = function elementIsGenerated(r) {
      return r ? m(j, r) > -1 : null;
    };
    var U = V.J, N = V.K, W = V.ar, $ = V.rr, J = V.er, K = V.nr;
    var Q = [];
    var rr = S && q(N);
    var ar = S ? U : B([ J, $, W, N, U ].find((function(r) {
      return false === q(r);
    })));
    var er = J || $;
    var nr = function appendElements() {
      var r = me(N, R ? "viewport" : "host");
      var a = _r(W, ia);
      var e = _r($, !R && va);
      var t = _r(J, ua);
      var i = z ? _r(F(b), fa) : Cr;
      if (rr) {
        X(U, N);
        y(Q, (function() {
          X(N, U);
          Z(N);
        }));
      }
      Y(er, ar);
      Y(N, W);
      Y(W || N, !R && $);
      Y($, J);
      y(Q, (function() {
        i();
        r();
        I($, aa);
        I($, ea);
        if (q(J)) {
          be(J);
        }
        if (q($)) {
          be($);
        }
        if (q(W)) {
          be(W);
        }
        a();
        e();
        t();
      }));
      if (n && !R) {
        y(Q, pr.bind(0, $, fa));
      }
      if (K) {
        G($, K);
        y(Q, Z.bind(0, K));
      }
    };
    return [ V, nr, O.bind(0, Q) ];
  };
  var Se = function createTrinsicUpdateSegment(r, a) {
    var e = r.er;
    var n = a[0];
    return function(r) {
      var a = de(), t = a.F;
      var i = n(), v = i.sr;
      var o = r.dr;
      var u = (e || !t) && o;
      if (u) {
        style(e, {
          height: v ? "" : "100%"
        });
      }
      return {
        gr: u,
        hr: u
      };
    };
  };
  var Ce = function createPaddingUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.K, v = r.ar, o = r.rr, u = r.$;
    var f = a({
      u: yr,
      o: Tr()
    }, Tr.bind(0, i, "padding", "")), l = f[0], c = f[1];
    return function(r, a, e) {
      var i = c(e), f = i[0], s = i[1];
      var d = de(), g = d.D, h = d.F;
      var p = n(), w = p.pr;
      var b = r.gr, m = r.hr, y = r._r;
      var S = a("paddingAbsolute"), C = S[0], O = S[1];
      var x = !h && m;
      if (b || s || x) {
        var E = l(e);
        f = E[0];
        s = E[1];
      }
      var A = !u && (O || y || s);
      if (A) {
        var P = !C || !v && !g;
        var T = f.r + f.l;
        var D = f.t + f.b;
        var L = {
          marginRight: P && !w ? -T : 0,
          marginBottom: P ? -D : 0,
          marginLeft: P && w ? -T : 0,
          top: P ? -f.t : 0,
          right: P ? w ? -f.r : "auto" : 0,
          left: P ? w ? "auto" : -f.l : 0,
          width: P ? "calc(100% + " + T + "px)" : ""
        };
        var I = {
          paddingTop: P ? f.t : 0,
          paddingRight: P ? f.r : 0,
          paddingBottom: P ? f.b : 0,
          paddingLeft: P ? f.l : 0
        };
        style(v || o, L);
        style(o, I);
        t({
          ar: f,
          wr: !P,
          H: v ? I : z({}, L, I)
        });
      }
      return {
        br: A
      };
    };
  };
  var Oe = Math.max;
  var xe = Oe.bind(0, 0);
  var Ee = "visible";
  var ze = "hidden";
  var Ae = 42;
  var Pe = {
    u: br,
    o: {
      w: 0,
      h: 0
    }
  };
  var Te = {
    u: mr,
    o: {
      x: ze,
      y: ze
    }
  };
  var De = function getOverflowAmount(r, a) {
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
  var Le = function conditionalClass(r, a, e) {
    return e ? _r(r, a) : pr(r, a);
  };
  var Ie = function overflowIsVisible(r) {
    return 0 === r.indexOf(Ee);
  };
  var Me = function createOverflowUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.K, v = r.ar, o = r.rr, u = r.nr, f = r.$, l = r.cr;
    var c = de(), s = c.k, d = c.F, g = c.D, h = c.L;
    var p = La()[ie];
    var w = !f && !g && (h.x || h.y);
    var b = a(Pe, Rr.bind(0, o)), m = b[0], y = b[1];
    var S = a(Pe, Hr.bind(0, o)), C = S[0], O = S[1];
    var x = a(Pe), E = x[0], z = x[1];
    var A = a(Pe), P = A[0], L = A[1];
    var I = a(Te), M = I[0];
    var H = function fixFlexboxGlue(r, a) {
      style(o, {
        height: ""
      });
      if (a) {
        var e = n(), t = e.wr, v = e.ar;
        var u = r.mr, f = r.R;
        var l = Rr(i);
        var c = Mr(i);
        var s = "content-box" === style(o, "boxSizing");
        var d = t || s ? v.b + v.t : 0;
        var g = !(h.x && s);
        style(o, {
          height: c.h + l.h + (u.x && g ? f.x : 0) - d
        });
      }
    };
    var R = function getViewportOverflowState(r, a) {
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
        yr: {
          x: i,
          y: c
        },
        mr: {
          x: v,
          y: d
        },
        R: {
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
        var e = Ie(r);
        var n = a && e && r.replace(Ee + "-", "") || "";
        return [ a && !e ? r : "", Ie(n) ? "hidden" : n ];
      };
      var i = t(e.x, a.x), v = i[0], o = i[1];
      var u = t(e.y, a.y), f = u[0], l = u[1];
      n.overflowX = o && f ? o : v;
      n.overflowY = l && v ? l : f;
      return R(r, n);
    };
    var j = function hideNativeScrollbars(r, a, e, t) {
      var i = r.R, v = r.V;
      var o = v.x, u = v.y;
      var f = i.x, l = i.y;
      var c = n(), s = c.H;
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
    var k = p ? p.M(w, d, o, u, n, R, j) : [ function() {
      return w;
    }, function() {
      return [ Cr ];
    } ], B = k[0], F = k[1];
    return function(r, a, e) {
      var u = r.gr, c = r.Sr, s = r.hr, p = r.br, w = r.dr, b = r._r;
      var S = n(), x = S.sr, A = S.pr;
      var I = a("showNativeOverlaidScrollbars"), k = I[0], q = I[1];
      var U = a("overflow"), N = U[0], Y = U[1];
      var W = k && h.x && h.y;
      var G = !f && !d && (u || s || c || q || w);
      var X = Ie(N.x);
      var Z = Ie(N.y);
      var $ = X || Z;
      var J = y(e);
      var K = O(e);
      var Q = z(e);
      var rr = L(e);
      var ar;
      if (q && g) {
        l(fa, ta, !W);
      }
      if (G) {
        ar = R(W);
        H(ar, x);
      }
      if (u || p || s || b || q) {
        if ($) {
          l(la, na, false);
        }
        var er = F(W, A, ar), nr = er[0], tr = er[1];
        var ir = J = m(e), vr = ir[0], or = ir[1];
        var ur = K = C(e), fr = ur[0], lr = ur[1];
        var cr = Mr(o);
        var sr = fr;
        var dr = cr;
        nr();
        if ((lr || or || q) && tr && !W && B(tr, fr, vr, A)) {
          dr = Mr(o);
          sr = Hr(o);
        }
        var gr = {
          w: xe(Oe(fr.w, sr.w) + vr.w),
          h: xe(Oe(fr.h, sr.h) + vr.h)
        };
        var hr = {
          w: xe(dr.w + xe(cr.w - fr.w) + vr.w),
          h: xe(dr.h + xe(cr.h - fr.h) + vr.h)
        };
        rr = P(hr);
        Q = E(De(gr, hr), e);
      }
      var pr = rr, _r = pr[0], wr = pr[1];
      var br = Q, mr = br[0], yr = br[1];
      var Sr = K, Cr = Sr[0], Or = Sr[1];
      var xr = J, Er = xr[0], zr = xr[1];
      var Ar = {
        x: mr.w > 0,
        y: mr.h > 0
      };
      var Pr = X && Z && (Ar.x || Ar.y) || X && Ar.x && !Ar.y || Z && Ar.y && !Ar.x;
      if (p || b || zr || Or || wr || yr || Y || q || G) {
        var Tr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Dr = V(W, Ar, N, Tr);
        var Lr = B(Dr, Cr, Er, A);
        if (!f) {
          j(Dr, A, Lr, Tr);
        }
        if (G) {
          H(Dr, x);
        }
        if (f) {
          T(i, aa, Tr.overflowX);
          T(i, ea, Tr.overflowY);
        } else {
          style(o, Tr);
        }
      }
      D(i, ra, na, Pr);
      Le(v, la, Pr);
      !f && Le(o, la, $);
      var Ir = M(R(W).yr), Rr = Ir[0], Vr = Ir[1];
      t({
        yr: Rr,
        Cr: {
          x: _r.w,
          y: _r.h
        },
        Or: {
          x: mr.w,
          y: mr.h
        },
        Er: Ar
      });
      return {
        zr: Vr,
        Ar: wr,
        Pr: yr
      };
    };
  };
  var He = function prepareUpdateHints(r, a, e) {
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
  var Re = function createStructureSetupUpdate(r, a) {
    var e = r.rr;
    var n = de(), t = n.D, i = n.L, v = n.F;
    var o = !t && (i.x || i.y);
    var u = [ Se(r, a), Ce(r, a), Me(r, a) ];
    return function(r, a, n) {
      var t = He(z({
        gr: false,
        br: false,
        _r: false,
        dr: false,
        Ar: false,
        Pr: false,
        zr: false,
        Sr: false,
        hr: false
      }, a), {}, n);
      var i = o || !v;
      var f = i && M(e);
      var l = i && H(e);
      var c = t;
      each(u, (function(a) {
        c = He(c, a(c, r, !!n) || {}, n);
      }));
      M(e, f);
      H(e, l);
      return c;
    };
  };
  var Ve = 3333333;
  var je = function getElmDirectionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var ke = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var Be = function createSizeObserver(r, e, n) {
    var t = n || {}, i = t.Tr, v = void 0 === i ? false : i, o = t.Dr, u = void 0 === o ? false : o;
    var f = La()[Ja];
    var l = de(), s = l.B;
    var h = J('<div class="' + ca + '"><div class="' + da + '"></div></div>');
    var p = h[0];
    var w = p.firstChild;
    var b = je.bind(0, p);
    var m = a({
      o: void 0,
      g: true,
      u: function _equal(r, a) {
        return !(!r || !ke(r) && ke(a));
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
        var h = ke(f);
        var w = ke(l);
        t = !l || !h;
        i = !w && h;
        o = !t;
      } else if (n) {
        o = r[1];
      } else {
        i = true === r;
      }
      if (v && o) {
        var b = n ? r[0] : je(p);
        M(p, b ? s.n ? -Ve : s.i ? 0 : Ve : Ve);
        H(p, Ve);
      }
      if (!t) {
        e({
          gr: !n,
          Lr: n ? r : void 0,
          Dr: !!i
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
      var P = f.P(w, C, u), T = P[0], D = P[1];
      E = T;
      y(x, D);
    }
    if (v) {
      z = a({
        o: !b()
      }, b);
      var L = z, I = L[0];
      y(x, qr(p, "scroll", (function(r) {
        var a = I();
        var e = a[0], n = a[1];
        if (n) {
          pr(w, "ltr rtl");
          if (e) {
            _r(w, "rtl");
          } else {
            _r(w, "ltr");
          }
          C(a);
        }
        Ur(r);
      })));
    }
    if (E) {
      _r(p, sa);
      y(x, qr(p, "animationstart", E, {
        A: !!ur
      }));
    }
    W(r, p);
    return function() {
      O(x);
      Z(p);
    };
  };
  var Fe = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var qe = function createTrinsicObserver(r, e) {
    var n;
    var t = $(_a);
    var i = [];
    var v = a({
      o: false
    }), o = v[0];
    var u = function triggerOnTrinsicChangedCallback(r, a) {
      if (r) {
        var n = o(Fe(r));
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
    if (or) {
      n = new or((function(r) {
        return f(r);
      }), {
        root: r
      });
      n.observe(t);
      y(i, (function() {
        n.disconnect();
      }));
    } else {
      var l = function onSizeChanged() {
        var r = Ir(t);
        u(r);
      };
      y(i, Be(t, l));
      l();
    }
    W(r, t);
    return [ function() {
      O(i);
      Z(t);
    }, function() {
      if (n) {
        return f(n.takeRecords(), true);
      }
    } ];
  };
  var Ue = function createEventContentChange(r, a, e) {
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
  var Ne = function createDOMObserver(r, a, e, n) {
    var t = false;
    var i = n || {}, v = i.Ir, o = i.Mr, u = i.Hr, f = i.Rr, c = i.Vr, s = i.jr;
    var d = Or((function() {
      if (t) {
        e(true);
      }
    }), {
      p: 33,
      _: 99
    });
    var g = Ue(r, d, u), h = g[0], p = g[1];
    var w = v || [];
    var b = o || [];
    var S = w.concat(b);
    var O = function observerCallback(t, i) {
      var v = c || Cr;
      var o = s || Cr;
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
        var z = m(b, t) > -1 && E;
        if (a && !O) {
          var A = !S;
          var P = S && z;
          var D = P && f && k(i, f);
          var L = D ? !v(i, t, s, x) : A || P;
          var I = L && !o(e, !!D, r, n);
          y(d, p);
          h = h || I;
          w = w || C;
        }
        if (!a && O && E && !v(i, t, s, x)) {
          y(u, t);
          g = g || z;
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
    var x = new vr((function(r) {
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
  var Ye = "[" + ra + "]";
  var We = "." + va;
  var Ge = [ "tabindex" ];
  var Xe = [ "wrap", "cols", "rows" ];
  var Ze = [ "id", "class", "style", "open" ];
  var $e = function createStructureSetupObservers(r, e, n) {
    var t;
    var i;
    var v;
    var o = e[1];
    var u = r.K, c = r.rr, g = r.er, h = r.vr, p = r.$, w = r.lr, b = r.cr;
    var S = de(), C = S.D, O = S.F;
    var x = a({
      u: br,
      o: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = w(la, na);
      var a = w(oa, "");
      var e = a && M(c);
      var n = a && H(c);
      b(la, na);
      b(oa, "");
      var t = Hr(g);
      var i = Hr(c);
      var v = Rr(c);
      b(la, na, r);
      b(oa, "", a);
      M(c, e);
      H(c, n);
      return {
        w: i.w + t.w + v.w,
        h: i.h + t.h + v.h
      };
    })), A = x[0];
    var P = h ? Xe : Ze.concat(Xe);
    var D = Or(n, {
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
      each(r || Ge, (function(r) {
        if (m(Ge, r) > -1) {
          var a = T(u, r);
          if (l(a)) {
            T(c, r, a);
          } else {
            I(c, r);
          }
        }
      }));
    };
    var R = function onTrinsicChanged(r, a) {
      var e = r[0], t = r[1];
      var i = {
        dr: t
      };
      o({
        sr: e
      });
      !a && n(i);
      return i;
    };
    var V = function onSizeChanged(r) {
      var a = r.gr, e = r.Lr, t = r.Dr;
      var i = !a || t ? n : D;
      var v = false;
      if (e) {
        var u = e[0], f = e[1];
        v = f;
        o({
          pr: u
        });
      }
      i({
        gr: a,
        _r: v
      });
    };
    var j = function onContentMutation(r, a) {
      var e = A(), t = e[1];
      var i = {
        hr: t
      };
      var v = r ? n : D;
      if (t) {
        !a && v(i);
      }
      return i;
    };
    var k = function onHostMutation(r, a, e) {
      var n = {
        Sr: a
      };
      if (a) {
        !e && D(n);
      } else if (!p) {
        L(r);
      }
      return n;
    };
    var B = (g || !O) && qe(u, R);
    var F = !p && Be(u, V, {
      Dr: true,
      Tr: !C
    });
    var N = Ne(u, false, k, {
      Mr: Ze,
      Ir: Ze.concat(Ge)
    }), Y = N[0], W = N[1];
    var G = p && new ur(V.bind(0, {
      gr: true
    }));
    G && G.observe(u);
    L();
    return [ function() {
      v && v[0]();
      B && B[0]();
      F && F();
      G && G.disconnect();
      Y();
    }, function() {
      var r = {};
      var a = W();
      var e = v && v[1]();
      var n = B && B[1]();
      if (a) {
        z(r, k.apply(0, y(a, true)));
      }
      if (e) {
        z(r, j.apply(0, y(e, true)));
      }
      if (n) {
        z(r, R.apply(0, y(n, true)));
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
        v = Ne(g || c, true, j, {
          Mr: P.concat(o || []),
          Ir: P.concat(o || []),
          Hr: h,
          Rr: Ye,
          jr: function _ignoreContentChange(r, a) {
            var e = r.target, n = r.attributeName;
            var t = !a && n ? U(e, Ye, We) : false;
            return t || !!q(e, "." + wa) || !!S(r);
          }
        });
      }
      if (m) {
        D.S();
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
  var Je = {
    x: 0,
    y: 0
  };
  var Ke = {
    ar: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    wr: false,
    H: {
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    },
    Cr: Je,
    Or: Je,
    yr: {
      x: "hidden",
      y: "hidden"
    },
    Er: {
      x: false,
      y: false
    },
    sr: false,
    pr: false
  };
  var Qe = function createStructureSetup(r, a) {
    var e = Zr(a, {});
    var n = $r(Ke);
    var t = Gr(), i = t[0], v = t[1], o = t[2];
    var u = n[0];
    var f = ye(r), l = f[0], c = f[1], s = f[2];
    var d = Re(l, n);
    var g = function triggerUpdateEvent(r, a, e) {
      var n = E(r).some((function(a) {
        return r[a];
      }));
      if (n || !A(a) || e) {
        o("u", [ r, a, e ]);
      }
    };
    var h = $e(l, n, (function(r) {
      g(d(e, r), {}, false);
    })), p = h[0], w = h[1], b = h[2];
    var m = u.bind(0);
    m.kr = function(r) {
      i("u", r);
    };
    m.Br = c;
    m.Fr = l;
    return [ function(r, e) {
      var n = Zr(a, r, e);
      b(n);
      g(d(n, w(), e), r, !!e);
    }, m, function() {
      v();
      p();
      s();
    } ];
  };
  var rn = "touchstart mouseenter";
  var an = "touchend touchcancel mouseleave";
  var en = function stopRootClickPropagation(r, a) {
    return qr(r, "mousedown", qr.bind(0, a, "click", Ur, {
      A: true,
      O: true
    }), {
      O: true
    });
  };
  var nn = function createScrollbarsSetupElements(r, a) {
    var e = de(), n = e.U;
    var t = n(), i = t.scrollbarsSlot;
    var v = a.ir, o = a.J, u = a.K, f = a.rr, l = a.ur;
    var c = l ? null : r.scrollbarsSlot;
    var s = pe([ o, u, f ], (function() {
      return u;
    }), i, c);
    var d = function scrollbarsAddRemoveClass(r, a, e, n) {
      var t = e ? _r : pr;
      each(r, (function(r) {
        t((n || Cr)(r) || r.qr, a);
      }));
    };
    var g = function scrollbarsHandleStyle(r, a) {
      each(r, (function(r) {
        var e = a(r), n = e[0], t = e[1];
        style(n, t);
      }));
    };
    var h = [];
    var p = [];
    var w = [];
    var b = d.bind(0, p);
    var m = d.bind(0, w);
    var S = function generateScrollbarDOM(r) {
      var a = r ? ba : ma;
      var e = r ? p : w;
      var n = C(e) ? xa : "";
      var t = $(wa + " " + a + " " + n);
      var i = $(ya);
      var o = $(Sa);
      var u = {
        qr: t,
        Ur: i,
        Nr: o
      };
      Y(t, i);
      Y(i, o);
      y(e, u);
      y(h, [ Z.bind(0, t), qr(t, rn, (function() {
        b(Ea, true);
        m(Ea, true);
      })), qr(t, an, (function() {
        b(Ea);
        m(Ea);
      })), en(t, v) ]);
      return u;
    };
    var x = S.bind(0, true);
    var E = S.bind(0, false);
    var z = function appendElements() {
      Y(s, p[0].qr);
      Y(s, w[0].qr);
      cr((function() {
        b(xa);
        m(xa);
      }), 300);
    };
    x();
    E();
    return [ {
      Yr: {
        Wr: p,
        Gr: x,
        Xr: b,
        Zr: g.bind(0, p)
      },
      $r: {
        Wr: w,
        Gr: E,
        Xr: m,
        Zr: g.bind(0, w)
      }
    }, z, O.bind(0, h) ];
  };
  var tn = Math.min;
  var vn = function createSelfCancelTimeout(r) {
    var a;
    var e = r ? cr : lr;
    var n = r ? sr : fr;
    return [ function(t) {
      n(a);
      a = e(t, s(r) ? r() : r);
    }, function() {
      return n(a);
    } ];
  };
  var un = function refreshScrollbarHandleLength(r, a, e) {
    var n = a.Or, t = a.Cr;
    var i = e ? "x" : "y";
    var v = t[i];
    var o = n[i];
    var u = tn(1, v / (v + o));
    r((function(r) {
      var a;
      return [ r.Nr, (a = {}, a[e ? "width" : "height"] = (100 * u).toFixed(3) + "%", 
      a) ];
    }));
  };
  var fn = function createScrollbarsSetup(r, a, e) {
    var n;
    var t;
    var i;
    var v;
    var o;
    var u = 0;
    var f = $r({});
    var l = f[0];
    var c = vn(), s = c[0], d = c[1];
    var g = vn(), h = g[0], p = g[1];
    var w = vn(100), b = w[0], m = w[1];
    var y = vn(100), S = y[0], C = y[1];
    var x = vn((function() {
      return u;
    })), E = x[0], z = x[1];
    var A = nn(r, e.Fr), P = A[0], T = A[1], D = A[2];
    var L = e.Fr, I = L.K, M = L.rr;
    var H = P.Yr, R = P.$r;
    var V = H.Xr, j = H.Zr;
    var k = R.Xr, B = R.Zr;
    var F = function manageScrollbarsAutoHide(r, a) {
      z();
      if (r) {
        V(za);
        k(za);
      } else {
        var e = function hide() {
          V(za, true);
          k(za, true);
        };
        if (u > 0 && !a) {
          E(e);
        } else {
          e();
        }
      }
    };
    var q = function onHostMouseEnter() {
      v = t;
      v && F(true);
    };
    var U = [ m, z, C, p, d, D, qr(I, "mouseover", q, {
      A: true
    }), qr(I, "mouseenter", q), qr(I, "mouseleave", (function() {
      v = false;
      t && F(false);
    })), qr(I, "mousemove", (function() {
      n && s((function() {
        m();
        F(true);
        S((function() {
          n && F(false);
        }));
      }));
    })), qr(M, "scroll", (function() {
      i && h((function() {
        F(true);
        b((function() {
          i && !v && F(false);
        }));
      }));
    })) ];
    var N = l.bind(0);
    N.Fr = P;
    N.Br = T;
    return [ function(r, v, f) {
      var l = f.Ar, c = f.Pr, s = f.zr;
      var d = Zr(a, r, v);
      var g = e();
      var h = d("scrollbars.theme"), p = h[0], w = h[1];
      var b = d("scrollbars.visibility"), m = b[0], y = b[1];
      var S = d("scrollbars.autoHide"), C = S[0], O = S[1];
      var x = d("scrollbars.autoHideDelay"), E = x[0];
      d("scrollbars.dragScrolling");
      d("scrollbars.touchSupport");
      var z = l || c;
      var A = s || y;
      var P = function setScrollbarVisibility(r, a) {
        var e = "visible" === m || "auto" === m && "scroll" === r;
        a(Ca, e);
        return e;
      };
      u = E;
      if (A) {
        var T = g.yr;
        var D = P(T.x, V);
        var L = P(T.y, k);
        var I = D && L;
        V(Oa, !I);
        k(Oa, !I);
      }
      if (w) {
        V(o);
        k(o);
        V(p, true);
        k(p, true);
        o = p;
      }
      if (O) {
        n = "move" === C;
        t = "leave" === C;
        i = "never" !== C;
        F(!i, true);
      }
      if (z) {
        un(j, g, true);
        un(B, g);
      }
    }, N, O.bind(0, U) ];
  };
  var ln = new Set;
  var cn = new WeakMap;
  var sn = function addInstance(r, a) {
    cn.set(r, a);
    ln.add(r);
  };
  var dn = function removeInstance(r) {
    cn.delete(r);
    ln.delete(r);
  };
  var gn = function getInstance(r) {
    return cn.get(r);
  };
  var hn = function OverlayScrollbars(r, a, e) {
    var n = false;
    var t = de(), i = t.Y, v = t.q;
    var o = La();
    var u = w(r);
    var f = u ? r : r.target;
    var l = gn(f);
    if (l) {
      return l;
    }
    var c = o[Ga];
    var d = function validateOptions(r) {
      var a = r || {};
      var e = c && c.P;
      return e ? e(a, true) : a;
    };
    var g = z({}, i(), d(a));
    var h = Gr(e), p = h[0], b = h[1], m = h[2];
    var y = Qe(r, g), S = y[0], C = y[1], O = y[2];
    var x = fn(r, g, C), P = x[0], T = x[1], D = x[2];
    var L = function update(r, a) {
      S(r, !!a);
    };
    var I = v(L.bind(0, {}, true));
    var M = function destroy(r) {
      dn(f);
      I();
      D();
      O();
      n = true;
      m("destroyed", [ H, !!r ]);
      b();
    };
    var H = {
      options: function options(r) {
        if (r) {
          var a = Ta(g, d(r));
          if (!A(a)) {
            z(g, a);
            L(a);
          }
        }
        return z({}, g);
      },
      on: p,
      off: function off(r, a) {
        r && a && b(r, a);
      },
      state: function state() {
        var r = C(), a = r.Cr, e = r.Or, t = r.yr, i = r.Er, v = r.ar, o = r.wr;
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
        var r = C.Fr, a = r.J, e = r.K, n = r.ar, t = r.rr, i = r.er;
        return z({}, {
          target: a,
          host: e,
          padding: n || t,
          viewport: t,
          content: i || t
        });
      },
      update: function update(r) {
        L({}, r);
        return H;
      },
      destroy: M.bind(0)
    };
    C.kr((function(r, a, e) {
      P(a, e, r);
    }));
    each(E(o), (function(r) {
      var a = o[r];
      if (s(a)) {
        a(OverlayScrollbars, H);
      }
    }));
    if (_e(!u && r.cancel, C.Fr)) {
      M(true);
      return H;
    }
    C.Br();
    T.Br();
    sn(f, H);
    m("initialized", [ H ]);
    C.kr((function(r, a, e) {
      var n = r.gr, t = r._r, i = r.dr, v = r.Ar, o = r.Pr, u = r.zr, f = r.hr, l = r.Sr;
      m("updated", [ H, {
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
    return H.update(true);
  };
  hn.plugin = Ia;
  hn.env = function() {
    var r = de(), a = r.k, e = r.L, n = r.D, t = r.B, i = r.F, v = r.I, o = r.G, u = r.X, f = r.U, l = r.N, c = r.Y, s = r.W;
    return z({}, {
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
  r.OverlayScrollbars = hn;
  r.scrollbarsHidingPlugin = ve;
  r.sizeObserverPlugin = Ka;
  Object.defineProperty(r, "v", {
    value: true
  });
}));
//# sourceMappingURL=overlayscrollbars.js.map
