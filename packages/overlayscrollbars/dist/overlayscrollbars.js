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
  var m = function isElement(r) {
    var a = Element;
    return r ? a ? r instanceof a : r.nodeType === e : false;
  };
  var b = function indexOf(r, a, e) {
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
    e && (e[r] = n);
  };
  var T = function attr(r, a, e) {
    if (v(e)) {
      return r ? r.getAttribute(a) : null;
    }
    r && r.setAttribute(a, e);
  };
  var L = function attrClass(r, a, e, n) {
    var t = T(r, a) || "";
    var i = new Set(t.split(" "));
    i[n ? "add" : "delete"](e);
    T(r, a, S(i).join(" ").trim());
  };
  var I = function hasAttrClass(r, a, e) {
    var n = T(r, a) || "";
    var t = new Set(n.split(" "));
    return t.has(e);
  };
  var M = function removeAttr(r, a) {
    r && r.removeAttribute(a);
  };
  var R = function scrollLeft(r, a) {
    return P("scrollLeft", 0, r, a);
  };
  var D = function scrollTop(r, a) {
    return P("scrollTop", 0, r, a);
  };
  var H = Element.prototype;
  var V = function find(r, a) {
    var e = [];
    var n = a ? m(a) ? a : null : document;
    return n ? y(e, n.querySelectorAll(r)) : e;
  };
  var j = function findFirst(r, a) {
    var e = a ? m(a) ? a : null : document;
    return e ? e.querySelector(r) : null;
  };
  var k = function is(r, a) {
    if (m(r)) {
      var e = H.matches || H.msMatchesSelector;
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
    if (m(r)) {
      var e = H.closest;
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
  var _r = function removeClass(r, a) {
    gr(r, a, (function(r, a) {
      return r.remove(a);
    }));
  };
  var pr = function addClass(r, a) {
    gr(r, a, (function(r, a) {
      return r.add(a);
    }));
    return _r.bind(0, r, a);
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
  var mr = function equalWH(r, a) {
    return wr(r, a, [ "w", "h" ]);
  };
  var br = function equalXY(r, a) {
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
    var v = a || {}, o = v._, u = v.p, l = v.m;
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
        var m = d(r);
        var b = m || r;
        var y = c.bind(0, b);
        i();
        var C = p(y, a);
        i = function clear() {
          return w(C);
        };
        if (h && !e) {
          e = cr(g, l);
        }
        n = t = b;
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
  var Lr = {
    w: 0,
    h: 0
  };
  var Ir = function windowSize() {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    };
  };
  var Mr = function offsetSize(r) {
    return r ? {
      w: r.offsetWidth,
      h: r.offsetHeight
    } : Lr;
  };
  var Rr = function clientSize(r) {
    return r ? {
      w: r.clientWidth,
      h: r.clientHeight
    } : Lr;
  };
  var Dr = function scrollSize(r) {
    return r ? {
      w: r.scrollWidth,
      h: r.scrollHeight
    } : Lr;
  };
  var Hr = function fractionalSize(r) {
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
  var Yr = {
    x: 0,
    y: 0
  };
  var Nr = function absoluteCoordinates(r) {
    var a = r ? Vr(r) : 0;
    return a ? {
      x: a.left + window.pageYOffset,
      y: a.top + window.pageXOffset
    } : Yr;
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
  var ta = "viewportStyled";
  var ia = "os-padding";
  var va = "os-viewport";
  var oa = va + "-arrange";
  var ua = "os-content";
  var fa = va + "-scrollbar-styled";
  var la = "os-overflow-visible";
  var ca = "os-size-observer";
  var sa = ca + "-appear";
  var da = ca + "-listener";
  var ga = da + "-scroll";
  var ha = da + "-item";
  var _a = ha + "-final";
  var pa = "os-trinsic-observer";
  var wa = "os-scrollbar";
  var ma = wa + "-horizontal";
  var ba = wa + "-vertical";
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
  var La = {};
  var Ia = function getPlugins() {
    return z({}, La);
  };
  var Ma = function addPlugin(r) {
    each(d(r) ? r : [ r ], (function(r) {
      each(E(r), (function(a) {
        La[a] = r[a];
      }));
    }));
  };
  var Ra = {
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
  })(Ra);
  var Da = getDefaultExportFromCjs(Ra.exports);
  var Ha = {
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
    var i = Da({}, a);
    var o = E(r).filter((function(r) {
      return x(a, r);
    }));
    each(o, (function(o) {
      var f = a[o];
      var c = r[o];
      var s = p(c);
      var g = n ? n + "." : "";
      if (s && p(f)) {
        var h = validateRecursive(c, f, e, g + o), w = h[0], m = h[1];
        t[o] = w;
        i[o] = m;
        each([ i, t ], (function(r) {
          if (A(r[o])) {
            delete r[o];
          }
        }));
      } else if (!s) {
        var b = false;
        var S = [];
        var C = [];
        var O = u(f);
        var x = !d(c) ? [ c ] : c;
        each(x, (function(r) {
          var a;
          each(Ha, (function(e, n) {
            if (e === r) {
              a = n;
            }
          }));
          var e = v(a);
          if (e && l(f)) {
            var n = r.split(" ");
            b = !!n.find((function(r) {
              return r === f;
            }));
            y(S, n);
          } else {
            b = Ha[O] === r;
          }
          y(C, e ? Ha.string : a);
          return !b;
        }));
        if (b) {
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
  var Ba = Ha.number;
  var Fa = Ha.boolean;
  var qa = [ Ha.array, Ha.null ];
  var Ua = "hidden scroll visible visible-hidden";
  var Ya = "visible hidden auto";
  var Na = "never scroll leavemove";
  var Wa = {
    paddingAbsolute: Fa,
    updating: {
      elementEvents: qa,
      attributes: qa,
      debounce: [ Ha.number, Ha.array, Ha.null ],
      ignoreMutation: [ Ha.function, Ha.null ]
    },
    overflow: {
      x: Ua,
      y: Ua
    },
    scrollbars: {
      visibility: Ya,
      autoHide: Na,
      autoHideDelay: Ba,
      dragScroll: Fa,
      clickScroll: Fa,
      touch: Fa
    },
    nativeScrollbarsOverlaid: {
      show: Fa,
      initialize: Fa
    }
  };
  var Ga = "__osOptionsValidationPlugin";
  var Xa = (ka = {}, ka[Ga] = {
    P: function _(r, a) {
      var e = ja(Wa, r, a), n = e[0], t = e[1];
      return Da({}, t, n);
    }
  }, ka);
  var Za;
  var $a = 3333333;
  var Ja = "scroll";
  var Ka = "__osSizeObserverPlugin";
  var Qa = (Za = {}, Za[Ka] = {
    P: function _(r, a, e) {
      var n = J('<div class="' + ha + '" dir="ltr"><div class="' + ha + '"><div class="' + _a + '"></div></div><div class="' + ha + '"><div class="' + _a + '" style="width: 200%; height: 200%"></div></div></div>');
      N(r, n);
      pr(r, ga);
      var t = n[0];
      var i = t.lastChild;
      var v = t.firstChild;
      var o = null == v ? void 0 : v.firstChild;
      var u = Mr(t);
      var f = u;
      var l = false;
      var c;
      var s = function reset() {
        R(v, $a);
        D(v, $a);
        R(i, $a);
        D(i, $a);
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
        l = !r || !mr(f, u);
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
      var h = y([], [ qr(v, Ja, g), qr(i, Ja, g) ]);
      style(o, {
        width: $a,
        height: $a
      });
      s();
      return [ e ? g.bind(0, false) : s, h ];
    }
  }, Za);
  var re;
  var ae = 0;
  var ee = Math.round, ne = Math.abs;
  var te = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var a = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / a;
  };
  var ie = function diffBiggerThanOne(r, a) {
    var e = ne(r);
    var n = ne(a);
    return !(e === n || e + 1 === n || e - 1 === n);
  };
  var ve = "__osScrollbarsHidingPlugin";
  var oe = (re = {}, re[ve] = {
    T: function _createUniqueViewportArrangeElement(r) {
      var a = r.L, e = r.I, n = r.M;
      var t = !n && !a && (e.x || e.y);
      var i = t ? document.createElement("style") : false;
      if (i) {
        T(i, "id", oa + "-" + ae);
        ae++;
      }
      return i;
    },
    R: function _overflowUpdateSegment(r, a, e, n, t, i, v) {
      var o = function arrangeViewport(a, i, v, o) {
        if (r) {
          var u = t(), f = u.D;
          var l = a.H, c = a.V;
          var s = c.x, d = c.y;
          var g = l.x, h = l.y;
          var p = o ? "paddingRight" : "paddingLeft";
          var w = f[p];
          var m = f.paddingTop;
          var b = i.w + v.w;
          var y = i.h + v.h;
          var S = {
            w: h && d ? h + b - w + "px" : "",
            h: g && s ? g + y - m + "px" : ""
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
          var l = t(), c = l.D;
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
          _r(e, oa);
          if (!a) {
            h.height = "";
          }
          style(e, h);
          return [ function() {
            v(f, o, r, w);
            style(e, w);
            pr(e, oa);
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
        var i = Ir();
        var v = {
          w: i.w - r.w,
          h: i.h - r.h
        };
        if (0 === v.w && 0 === v.h) {
          return;
        }
        var o = {
          w: ne(v.w),
          h: ne(v.h)
        };
        var u = {
          w: ne(ee(i.w / (r.w / 100))),
          h: ne(ee(i.h / (r.h / 100)))
        };
        var f = te();
        var l = o.w > 2 && o.h > 2;
        var c = !ie(u.w, u.h);
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
  }, re);
  var ue;
  var fe = function getNativeScrollbarSize(r, a, e, n) {
    N(r, a);
    var t = Rr(a);
    var i = Mr(a);
    var v = Hr(e);
    n && Z(a);
    return {
      x: i.h - t.h + v.h,
      y: i.w - t.w + v.w
    };
  };
  var le = function getNativeScrollbarsHiding(r) {
    var a = false;
    var e = pr(r, fa);
    try {
      a = "none" === style(r, tr("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (n) {}
    e();
    return a;
  };
  var ce = function getRtlScrollBehavior(r, a) {
    var e = "hidden";
    style(r, {
      overflowX: e,
      overflowY: e,
      direction: "rtl"
    });
    R(r, 0);
    var n = Nr(r);
    var t = Nr(a);
    R(r, -999);
    var i = Nr(a);
    return {
      i: n.x === t.x,
      n: t.x !== i.x
    };
  };
  var se = function getFlexboxGlue(r, a) {
    var e = pr(r, Kr);
    var n = Vr(r);
    var t = Vr(a);
    var i = Sr(t, n, true);
    var v = pr(r, Qr);
    var o = Vr(r);
    var u = Vr(a);
    var f = Sr(u, o, true);
    e();
    v();
    return i && f;
  };
  var de = function createEnvironment() {
    var r = document, e = r.body;
    var n = J('<div class="' + Jr + '"><div></div></div>');
    var t = n[0];
    var i = t.firstChild;
    var v = Gr(), o = v[0], u = v[2];
    var f = a({
      o: fe(e, t, i),
      u: br
    }, fe.bind(0, e, t, i, true)), l = f[0], c = f[1];
    var s = c(), d = s[0];
    var g = le(t);
    var h = {
      x: 0 === d.x,
      y: 0 === d.y
    };
    var p = {
      B: !g,
      F: false
    };
    var w = z({}, Pa);
    var m = {
      k: d,
      I: h,
      L: g,
      M: "-1" === style(t, "zIndex"),
      q: ce(t, i),
      U: se(t, i),
      Y: function _addListener(r) {
        return o("_", r);
      },
      N: z.bind(0, {}, p),
      W: function _setInitializationStrategy(r) {
        z(p, r);
      },
      G: z.bind(0, {}, w),
      X: function _setDefaultOptions(r) {
        z(w, r);
      },
      Z: z({}, p),
      $: z({}, w)
    };
    M(t, "style");
    Z(t);
    if (!g && (!h.x || !h.y)) {
      var b;
      window.addEventListener("resize", (function() {
        var r = Ia()[ve];
        b = b || r && r.j();
        b && b(m, l, u.bind(0, "_"));
      }));
    }
    return m;
  };
  var ge = function getEnvironment() {
    if (!ue) {
      ue = de();
    }
    return ue;
  };
  var he = function resolveInitialization(r, a) {
    return s(r) ? r.apply(0, a) : r;
  };
  var _e = function staticInitializationElement(r, a, e, n) {
    return he(n || he(e, r), r) || a.apply(0, r);
  };
  var pe = function dynamicInitializationElement(r, a, e, n) {
    var t = he(n, r);
    if (o(t) || v(t)) {
      t = he(e, r);
    }
    return true === t || o(t) || v(t) ? a.apply(0, r) : t;
  };
  var we = $.bind(0, "");
  var me = function unwrap(r) {
    N(F(r), B(r));
    Z(r);
  };
  var be = function addDataAttrHost(r, a) {
    T(r, ra, a);
    return M.bind(0, r, ra);
  };
  var ye = function createStructureSetupElements(r) {
    var a = ge();
    var e = a.N, n = a.L;
    var t = Ia()[ve];
    var i = t && t.T;
    var v = e(), o = v.J, u = v.K, f = v.B, l = v.F;
    var c = w(r);
    var s = r;
    var d = c ? r : s.target;
    var g = k(d, "textarea");
    var h = !g && k(d, "body");
    var p = d.ownerDocument;
    var m = p.body;
    var S = p.defaultView;
    var C = !!ur && !g && n;
    var x = _e.bind(0, [ d ]);
    var z = pe.bind(0, [ d ]);
    var A = [ x(we, u, s.viewport), x(we, u), x(we) ].filter((function(r) {
      return !C ? r !== d : true;
    }))[0];
    var P = A === d;
    var T = {
      rr: d,
      J: g ? x(we, o, s.host) : d,
      K: A,
      B: !P && z(we, f, s.padding),
      F: !P && z(we, l, s.content),
      ar: !P && !n && i && i(a),
      er: S,
      nr: p,
      tr: F(m),
      ir: m,
      vr: g,
      ur: h,
      lr: c,
      cr: P,
      sr: function _viewportHasClass(r, a) {
        return P ? I(A, ra, a) : hr(A, r);
      },
      dr: function _viewportAddRemoveClass(r, a, e) {
        return P ? L(A, ra, a, e) : (e ? pr : _r)(A, r);
      }
    };
    var R = E(T).reduce((function(r, a) {
      var e = T[a];
      return y(r, e && !F(e) ? e : false);
    }), []);
    var D = function elementIsGenerated(r) {
      return r ? b(R, r) > -1 : null;
    };
    var H = T.rr, V = T.J, j = T.B, q = T.K, U = T.F, Y = T.ar;
    var W = [];
    var $ = g && D(V);
    var J = g ? H : B([ U, q, j, V, H ].find((function(r) {
      return false === D(r);
    })));
    var K = U || q;
    var Q = function appendElements() {
      var r = be(V, P ? "viewport" : "host");
      var a = pr(j, ia);
      var e = pr(q, !P && va);
      var t = pr(U, ua);
      if ($) {
        X(H, V);
        y(W, (function() {
          X(V, H);
          Z(V);
        }));
      }
      N(K, J);
      N(V, j);
      N(j || V, !P && q);
      N(q, U);
      y(W, (function() {
        r();
        M(q, aa);
        M(q, ea);
        if (D(U)) {
          me(U);
        }
        if (D(q)) {
          me(q);
        }
        if (D(j)) {
          me(j);
        }
        a();
        e();
        t();
      }));
      if (n && !P) {
        y(W, _r.bind(0, q, fa));
      }
      if (Y) {
        G(q, Y);
        y(W, Z.bind(0, Y));
      }
    };
    return [ T, Q, O.bind(0, W) ];
  };
  var Se = function createTrinsicUpdateSegment(r, a) {
    var e = r.F;
    var n = a[0];
    return function(r) {
      var a = ge(), t = a.U;
      var i = n(), v = i.gr;
      var o = r.hr;
      var u = (e || !t) && o;
      if (u) {
        style(e, {
          height: v ? "" : "100%"
        });
      }
      return {
        _r: u,
        pr: u
      };
    };
  };
  var Ce = function createPaddingUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.J, v = r.B, o = r.K, u = r.cr;
    var f = a({
      u: yr,
      o: Tr()
    }, Tr.bind(0, i, "padding", "")), l = f[0], c = f[1];
    return function(r, a, e) {
      var i = c(e), f = i[0], s = i[1];
      var d = ge(), g = d.L, h = d.U;
      var p = n(), w = p.wr;
      var m = r._r, b = r.pr, y = r.mr;
      var S = a("paddingAbsolute"), C = S[0], O = S[1];
      var x = !h && b;
      if (m || s || x) {
        var E = l(e);
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
        var M = {
          paddingTop: P ? f.t : 0,
          paddingRight: P ? f.r : 0,
          paddingBottom: P ? f.b : 0,
          paddingLeft: P ? f.l : 0
        };
        style(v || o, I);
        style(o, M);
        t({
          B: f,
          br: !P,
          D: v ? M : z({}, I, M)
        });
      }
      return {
        yr: A
      };
    };
  };
  var Oe = Math.max;
  var xe = Oe.bind(0, 0);
  var Ee = "visible";
  var ze = "hidden";
  var Ae = 42;
  var Pe = {
    u: mr,
    o: {
      w: 0,
      h: 0
    }
  };
  var Te = {
    u: br,
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
    return e ? pr(r, a) : _r(r, a);
  };
  var Me = function overflowIsVisible(r) {
    return 0 === r.indexOf(Ee);
  };
  var Re = function createOverflowUpdateSegment(r, e) {
    var n = e[0], t = e[1];
    var i = r.J, v = r.B, o = r.K, u = r.ar, f = r.cr, l = r.dr;
    var c = ge(), s = c.k, d = c.U, g = c.L, h = c.I;
    var p = Ia()[ve];
    var w = !f && !g && (h.x || h.y);
    var m = a(Pe, Hr.bind(0, o)), b = m[0], y = m[1];
    var S = a(Pe, Dr.bind(0, o)), C = S[0], O = S[1];
    var x = a(Pe), E = x[0], z = x[1];
    var A = a(Pe), P = A[0], I = A[1];
    var M = a(Te), R = M[0];
    var D = function fixFlexboxGlue(r, a) {
      style(o, {
        height: ""
      });
      if (a) {
        var e = n(), t = e.br, v = e.B;
        var u = r.Sr, f = r.H;
        var l = Hr(i);
        var c = Rr(i);
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
        Cr: {
          x: i,
          y: c
        },
        Sr: {
          x: v,
          y: d
        },
        H: {
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
        var e = Me(r);
        var n = a && e && r.replace(Ee + "-", "") || "";
        return [ a && !e ? r : "", Me(n) ? "hidden" : n ];
      };
      var i = t(e.x, a.x), v = i[0], o = i[1];
      var u = t(e.y, a.y), f = u[0], l = u[1];
      n.overflowX = o && f ? o : v;
      n.overflowY = l && v ? l : f;
      return H(r, n);
    };
    var j = function hideNativeScrollbars(r, a, e, t) {
      var i = r.H, v = r.V;
      var o = v.x, u = v.y;
      var f = i.x, l = i.y;
      var c = n(), s = c.D;
      var d = a ? "marginLeft" : "marginRight";
      var g = a ? "paddingLeft" : "paddingRight";
      var h = s[d];
      var p = s.marginBottom;
      var w = s[g];
      var m = s.paddingBottom;
      t.width = "calc(100% + " + (l + -1 * h) + "px)";
      t[d] = -l + h;
      t.marginBottom = -f + p;
      if (e) {
        t[g] = w + (u ? l : 0);
        t.paddingBottom = m + (o ? f : 0);
      }
    };
    var k = p ? p.R(w, d, o, u, n, H, j) : [ function() {
      return w;
    }, function() {
      return [ Cr ];
    } ], B = k[0], F = k[1];
    return function(r, a, e) {
      var u = r._r, c = r.Or, s = r.pr, p = r.yr, w = r.hr, m = r.mr;
      var S = n(), x = S.gr, A = S.wr;
      var M = a("nativeScrollbarsOverlaid.show"), k = M[0], q = M[1];
      var U = a("overflow"), Y = U[0], N = U[1];
      var W = k && h.x && h.y;
      var G = !f && !d && (u || s || c || q || w);
      var X = Me(Y.x);
      var Z = Me(Y.y);
      var $ = X || Z;
      var J = y(e);
      var K = O(e);
      var Q = z(e);
      var rr = I(e);
      var ar;
      if (q && g) {
        l(fa, ta, !W);
      }
      if (G) {
        ar = H(W);
        D(ar, x);
      }
      if (u || p || s || m || q) {
        if ($) {
          l(la, na, false);
        }
        var er = F(W, A, ar), nr = er[0], tr = er[1];
        var ir = J = b(e), vr = ir[0], or = ir[1];
        var ur = K = C(e), fr = ur[0], lr = ur[1];
        var cr = Rr(o);
        var sr = fr;
        var dr = cr;
        nr();
        if ((lr || or || q) && tr && !W && B(tr, fr, vr, A)) {
          dr = Rr(o);
          sr = Dr(o);
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
        Q = E(Le(gr, hr), e);
      }
      var _r = rr, pr = _r[0], wr = _r[1];
      var mr = Q, br = mr[0], yr = mr[1];
      var Sr = K, Cr = Sr[0], Or = Sr[1];
      var xr = J, Er = xr[0], zr = xr[1];
      var Ar = {
        x: br.w > 0,
        y: br.h > 0
      };
      var Pr = X && Z && (Ar.x || Ar.y) || X && Ar.x && !Ar.y || Z && Ar.y && !Ar.x;
      if (p || m || zr || Or || wr || yr || N || q || G) {
        var Tr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Lr = V(W, Ar, Y, Tr);
        var Ir = B(Lr, Cr, Er, A);
        if (!f) {
          j(Lr, A, Ir, Tr);
        }
        if (G) {
          D(Lr, x);
        }
        if (f) {
          T(i, aa, Tr.overflowX);
          T(i, ea, Tr.overflowY);
        } else {
          style(o, Tr);
        }
      }
      L(i, ra, na, Pr);
      Ie(v, la, Pr);
      !f && Ie(o, la, $);
      var Mr = R(H(W).Cr), Hr = Mr[0], Vr = Mr[1];
      t({
        Cr: Hr,
        Er: {
          x: pr.w,
          y: pr.h
        },
        zr: {
          x: br.w,
          y: br.h
        },
        Ar: Ar
      });
      return {
        Pr: Vr,
        Tr: wr,
        Lr: yr
      };
    };
  };
  var De = function prepareUpdateHints(r, a, e) {
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
    var n = ge(), t = n.L, i = n.I, v = n.U;
    var o = !t && (i.x || i.y);
    var u = [ Se(r, a), Ce(r, a), Re(r, a) ];
    return function(r, a, n) {
      var t = De(z({
        _r: false,
        yr: false,
        mr: false,
        hr: false,
        Tr: false,
        Lr: false,
        Pr: false,
        Or: false,
        pr: false
      }, a), {}, n);
      var i = o || !v;
      var l = i && R(e);
      var c = i && D(e);
      var s = t;
      each(u, (function(a) {
        s = De(s, a(s, r, !!n) || {}, n);
      }));
      if (f(l)) {
        R(e, l);
      }
      if (f(c)) {
        D(e, c);
      }
      return s;
    };
  };
  var Ve = "animationstart";
  var je = "scroll";
  var ke = 3333333;
  var Be = function getElmDirectionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var Fe = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var qe = function createSizeObserver(r, e, n) {
    var t = n || {}, i = t.Ir, v = void 0 === i ? false : i, o = t.Mr, u = void 0 === o ? false : o;
    var f = Ia()[Ka];
    var l = ge(), s = l.q;
    var h = J('<div class="' + ca + '"><div class="' + da + '"></div></div>');
    var p = h[0];
    var w = p.firstChild;
    var m = Be.bind(0, p);
    var b = a({
      o: void 0,
      g: true,
      u: function _equal(r, a) {
        return !(!r || !Fe(r) && Fe(a));
      }
    }), S = b[0];
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
        var m = n ? r[0] : Be(p);
        R(p, m ? s.n ? -ke : s.i ? 0 : ke : ke);
        D(p, ke);
      }
      if (!t) {
        e({
          _r: !n,
          Rr: n ? r : void 0,
          Mr: !!i
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
      var P = f.P(w, C, u), T = P[0], L = P[1];
      E = T;
      y(x, L);
    }
    if (v) {
      z = a({
        o: !m()
      }, m);
      var I = z, M = I[0];
      y(x, qr(p, je, (function(r) {
        var a = M();
        var e = a[0], n = a[1];
        if (n) {
          _r(w, "ltr rtl");
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
      pr(p, sa);
      y(x, qr(p, Ve, E, {
        A: !!ur
      }));
    }
    W(r, p);
    return function() {
      O(x);
      Z(p);
    };
  };
  var Ue = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var Ye = function createTrinsicObserver(r, e) {
    var n = $(pa);
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
        var r = Mr(n);
        o(r);
      };
      y(t, qe(n, f));
      f();
    }
    W(r, n);
    return function() {
      O(t);
      Z(n);
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
  var We = function createDOMObserver(r, a, e, n) {
    var t = false;
    var i = n || {}, v = i.Dr, o = i.Hr, u = i.Vr, f = i.jr, c = i.kr, s = i.Br;
    var d = Ne(r, Or((function() {
      if (t) {
        e(true);
      }
    }), {
      _: 33,
      p: 99
    }), u), g = d[0], h = d[1];
    var p = v || [];
    var w = o || [];
    var m = p.concat(w);
    var S = function observerCallback(t) {
      var i = c || Cr;
      var v = s || Cr;
      var o = [];
      var u = [];
      var d = false;
      var g = false;
      var p = false;
      each(t, (function(e) {
        var t = e.attributeName, c = e.target, s = e.type, h = e.oldValue, m = e.addedNodes;
        var S = "attributes" === s;
        var C = "childList" === s;
        var O = r === c;
        var x = S && l(t) ? T(c, t) : 0;
        var E = 0 !== x && h !== x;
        var z = b(w, t) > -1 && E;
        if (a && !O) {
          var A = !S;
          var P = S && z;
          var L = P && f && k(c, f);
          var I = L ? !i(c, t, h, x) : A || P;
          var M = I && !v(e, !!L, r, n);
          y(u, m);
          g = g || M;
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
            return k(e, r) ? y(a, e) : a;
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
      attributeFilter: m,
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
  var Ge = "[" + ra + "]";
  var Xe = "." + va;
  var Ze = [ "tabindex" ];
  var $e = [ "wrap", "cols", "rows" ];
  var Je = [ "id", "class", "style", "open" ];
  var Ke = function createStructureSetupObservers(r, e, n) {
    var t;
    var i;
    var v;
    var o = e[1];
    var u = r.J, c = r.K, g = r.F, h = r.vr, p = r.cr, w = r.sr, m = r.dr;
    var y = ge(), S = y.L, C = y.U;
    var O = a({
      u: mr,
      o: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = w(la, na);
      r && m(la, na);
      var a = Dr(g);
      var e = Dr(c);
      var n = Hr(c);
      r && m(la, na, true);
      return {
        w: e.w + a.w + n.w,
        h: e.h + a.h + n.h
      };
    })), x = O[0];
    var z = h ? $e : Je.concat($e);
    var A = Or(n, {
      _: function _timeout() {
        return t;
      },
      p: function _maxDelay() {
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
    var P = function updateViewportAttrsFromHost(r) {
      each(r || Ze, (function(r) {
        if (b(Ze, r) > -1) {
          var a = T(u, r);
          if (l(a)) {
            T(c, r, a);
          } else {
            M(c, r);
          }
        }
      }));
    };
    var L = function onTrinsicChanged(r) {
      var a = r[0], e = r[1];
      o({
        gr: a
      });
      n({
        hr: e
      });
    };
    var I = function onSizeChanged(r) {
      var a = r._r, e = r.Rr, t = r.Mr;
      var i = !a || t ? n : A;
      var v = false;
      if (e) {
        var u = e[0], f = e[1];
        v = f;
        o({
          wr: u
        });
      }
      i({
        _r: a,
        mr: v
      });
    };
    var R = function onContentMutation(r) {
      var a = x(), e = a[1];
      var t = r ? n : A;
      if (e) {
        t({
          pr: true
        });
      }
    };
    var D = function onHostMutation(r, a) {
      if (a) {
        A({
          Or: true
        });
      } else if (!p) {
        P(r);
      }
    };
    var H = (g || !C) && Ye(u, L);
    var V = !p && qe(u, I, {
      Mr: true,
      Ir: !S
    });
    var j = We(u, false, D, {
      Hr: Je,
      Dr: Je.concat(Ze)
    }), k = j[0];
    var B = p && new ur(I.bind(0, {
      _r: true
    }));
    B && B.observe(u);
    P();
    return [ function(r) {
      var a = r("updating.ignoreMutation"), e = a[0];
      var n = r("updating.attributes"), o = n[0], u = n[1];
      var l = r("updating.elementEvents"), h = l[0], p = l[1];
      var w = r("updating.debounce"), m = w[0], b = w[1];
      var y = p || u;
      var S = function ignoreMutationFromOptions(r) {
        return s(e) && e(r);
      };
      if (y) {
        if (v) {
          v[1]();
          v[0]();
        }
        v = We(g || c, true, R, {
          Hr: z.concat(o || []),
          Dr: z.concat(o || []),
          Vr: h,
          jr: Ge,
          Br: function _ignoreContentChange(r, a) {
            var e = r.target, n = r.attributeName;
            var t = !a && n ? U(e, Ge, Xe) : false;
            return t || !!q(e, "." + wa) || !!S(r);
          }
        });
      }
      if (b) {
        A.S();
        if (d(m)) {
          var C = m[0];
          var O = m[1];
          t = f(C) ? C : false;
          i = f(O) ? O : false;
        } else if (f(m)) {
          t = m;
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
      B && B.disconnect();
      k();
    } ];
  };
  var Qe = {
    x: 0,
    y: 0
  };
  var rn = {
    B: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    br: false,
    D: {
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    },
    Er: Qe,
    zr: Qe,
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
  var an = function createStructureSetup(r, a) {
    var e = Zr(a, {});
    var n = $r(rn);
    var t = Gr(), i = t[0], v = t[1], o = t[2];
    var u = n[0];
    var f = ye(r), l = f[0], c = f[1], s = f[2];
    var d = He(l, n);
    var g = Ke(l, n, (function(r) {
      o("u", [ d(e, r), {}, false ]);
    })), h = g[0], p = g[1];
    var w = u.bind(0);
    w.Fr = function(r) {
      i("u", r);
    };
    w.qr = c;
    w.Ur = l;
    return [ function(r, e) {
      var n = Zr(a, r, e);
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
  var tn = function stopRootClickPropagation(r, a) {
    return qr(r, "mousedown", qr.bind(0, a, "click", Ur, {
      A: true,
      O: true
    }), {
      O: true
    });
  };
  var vn = function createScrollbarsSetupElements(r, a) {
    var e = ge(), n = e.N;
    var t = n(), i = t.Yr;
    var v = a.nr, o = a.rr, u = a.J, f = a.K, l = a.lr;
    var c = !l && r.scrollbarsSlot;
    var s = pe([ o, u, f ], (function() {
      return u;
    }), i, c);
    var d = function scrollbarsAddRemoveClass(r, a, e) {
      var n = e ? pr : _r;
      each(r, (function(r) {
        n(r.Nr, a);
      }));
    };
    var g = [];
    var h = [];
    var p = [];
    var w = d.bind(0, h);
    var m = d.bind(0, p);
    var b = function generateScrollbarDOM(r) {
      var a = r ? ma : ba;
      var e = r ? h : p;
      var n = C(e) ? xa : "";
      var t = $(wa + " " + a + " " + n + " os-theme-dark");
      var i = $(ya);
      var o = $(Sa);
      var u = {
        Nr: t,
        Wr: i,
        Gr: o
      };
      N(t, i);
      N(i, o);
      y(e, u);
      y(g, [ Z.bind(0, t), qr(t, en, (function() {
        w(Ea, true);
        m(Ea, true);
      })), qr(t, nn, (function() {
        w(Ea);
        m(Ea);
      })), tn(t, v) ]);
      return u;
    };
    var S = b.bind(0, true);
    var x = b.bind(0, false);
    var E = function appendElements() {
      N(s, h[0].Nr);
      N(s, p[0].Nr);
      cr((function() {
        w(xa);
        m(xa);
      }), 300);
    };
    S();
    x();
    return [ {
      Xr: {
        Zr: h,
        $r: S,
        Jr: w
      },
      Kr: {
        Zr: p,
        $r: x,
        Jr: m
      }
    }, E, O.bind(0, g) ];
  };
  var un = function createSelfCancelTimeout(r) {
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
  var fn = function createScrollbarsSetup(r, a, e) {
    var n = 0;
    var t;
    var i;
    var v;
    var o;
    var u = $r({});
    var f = u[0];
    var l = un(), c = l[0], s = l[1];
    var d = un(), g = d[0], h = d[1];
    var p = un(100), w = p[0], m = p[1];
    var b = un(100), y = b[0], S = b[1];
    var C = un((function() {
      return n;
    })), x = C[0], E = C[1];
    var z = vn(r, e.Ur), A = z[0], P = z[1], T = z[2];
    var L = e.Ur, I = L.J, M = L.K;
    var R = A.Xr, D = A.Kr;
    var H = R.Jr;
    var V = D.Jr;
    var j = function manageScrollbarsAutoHide(r, a) {
      E();
      if (r) {
        H(za);
        V(za);
      } else {
        var e = function hide() {
          H(za, true);
          V(za, true);
        };
        if (n > 0 && !a) {
          x(e);
        } else {
          e();
        }
      }
    };
    var k = function onHostMouseEnter() {
      o = i;
      o && j(true);
    };
    var B = [ m, E, S, h, s, T, qr(I, "mouseover", k, {
      A: true
    }), qr(I, "mouseenter", k), qr(I, "mouseleave", (function() {
      o = false;
      i && j(false);
    })), qr(I, "mousemove", (function() {
      t && c((function() {
        m();
        j(true);
        y((function() {
          t && j(false);
        }));
      }));
    })), qr(M, "scroll", (function() {
      v && g((function() {
        j(true);
        w((function() {
          v && !o && j(false);
        }));
      }));
    })) ];
    var F = f.bind(0);
    F.Ur = A;
    F.qr = P;
    return [ function(r, o, u) {
      var f = u.Pr;
      var l = Zr(a, r, o);
      var c = l("scrollbars.visibility"), s = c[0], d = c[1];
      var g = l("scrollbars.autoHide"), h = g[0], p = g[1];
      var w = l("scrollbars.autoHideDelay"), m = w[0];
      l("scrollbars.dragScrolling");
      l("scrollbars.touchSupport");
      var b = f || d;
      var y = function setScrollbarVisibility(r, a) {
        var e = "visible" === s || "auto" === s && "scroll" === r;
        a(Ca, e);
        return e;
      };
      n = m;
      if (b) {
        var S = e(), C = S.Cr;
        var O = y(C.x, H);
        var x = y(C.y, V);
        var E = O && x;
        H(Oa, !E);
        V(Oa, !E);
      }
      if (p) {
        t = "move" === h;
        i = "leave" === h;
        v = "never" !== h;
        j(!v, true);
      }
    }, F, O.bind(0, B) ];
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
    var t = ge(), i = t.G, v = t.I, o = t.Y;
    var u = Ia();
    var f = w(r) ? r : r.target;
    var l = gn(f);
    if (l) {
      return l;
    }
    var c = u[Ga];
    var d = function validateOptions(r) {
      var a = r || {};
      var e = c && c.P;
      return e ? e(a, true) : a;
    };
    var g = z({}, i(), d(a));
    var h = Gr(e), p = h[0], m = h[1], b = h[2];
    var y = an(r, g), S = y[0], C = y[1], O = y[2];
    var x = fn(r, g, C), P = x[0], T = x[1], L = x[2];
    var I = function update(r, a) {
      S(r, !!a);
    };
    var M = o(I.bind(0, {}, true));
    var R = function destroy(r) {
      dn(f);
      M();
      L();
      O();
      n = true;
      b("destroyed", [ D, !!r ]);
      m();
    };
    var D = {
      options: function options(r) {
        if (r) {
          var a = Ta(g, d(r));
          if (!A(a)) {
            z(g, a);
            I(a);
          }
        }
        return z({}, g);
      },
      on: p,
      off: function off(r, a) {
        r && a && m(r, a);
      },
      state: function state() {
        var r = C(), a = r.Er, e = r.zr, t = r.Cr, i = r.Ar, v = r.B, o = r.br;
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
        var r = C.Ur, a = r.rr, e = r.J, n = r.B, t = r.K, i = r.F;
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
        return D;
      },
      destroy: R.bind(0)
    };
    C.Fr((function(r, a, e) {
      P(a, e, r);
    }));
    each(E(u), (function(r) {
      var a = u[r];
      if (s(a)) {
        a(OverlayScrollbars, D);
      }
    }));
    if (v.x && v.y && !g.nativeScrollbarsOverlaid.initialize) {
      R(true);
      return D;
    }
    C.qr();
    T.qr();
    sn(f, D);
    b("initialized", [ D ]);
    C.Fr((function(r, a, e) {
      var n = r._r, t = r.mr, i = r.hr, v = r.Tr, o = r.Lr, u = r.Pr, f = r.pr, l = r.Or;
      b("updated", [ D, {
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
    return D.update(true);
  };
  hn.plugin = Ma;
  hn.env = function() {
    var r = ge(), a = r.k, e = r.I, n = r.L, t = r.q, i = r.U, v = r.M, o = r.Z, u = r.$, f = r.N, l = r.W, c = r.G, s = r.X;
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
  r.OverlayScrollbars = hn;
  r.optionsValidationPlugin = Xa;
  r.scrollbarsHidingPlugin = oe;
  r.sizeObserverPlugin = Qa;
  Object.defineProperty(r, "v", {
    value: true
  });
}));
//# sourceMappingURL=overlayscrollbars.js.map
