(function(r, e) {
  "object" === typeof exports && "undefined" !== typeof module ? e(exports) : "function" === typeof define && define.amd ? define([ "exports" ], e) : (r = "undefined" !== typeof globalThis ? globalThis : r || self, 
  e(r.OverlayScrollbars = {}));
})(this, (function(r) {
  "use strict";
  function createCache(r, e) {
    var a = r.v, t = r.o, n = r.u;
    var i = a;
    var v;
    var o = function cacheUpdateContextual(r, e) {
      var a = i;
      var o = r;
      var u = e || (t ? !t(a, o) : a !== o);
      if (u || n) {
        i = o;
        v = a;
      }
      return [ i, u, v ];
    };
    var u = function cacheUpdateIsolated(r) {
      return o(e(i, v), r);
    };
    var f = function getCurrentCache(r) {
      return [ i, !!r, v ];
    };
    return [ e ? u : o, f ];
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
    var e = !!r && r.length;
    var a = isNumber(e) && e > -1 && e % 1 == 0;
    return isArray(r) || !isFunction(r) && a ? e > 0 && isObject(r) ? e - 1 in r : true : false;
  }
  function isPlainObject(r) {
    if (!r || !isObject(r) || "object" !== i(r)) {
      return false;
    }
    var e;
    var a = "constructor";
    var t = r[a];
    var v = t && t.prototype;
    var o = n.call(r, a);
    var u = v && n.call(v, "isPrototypeOf");
    if (t && !o && !u) {
      return false;
    }
    for (e in r) {}
    return isUndefined(e) || n.call(r, e);
  }
  function isHTMLElement(r) {
    var a = window.HTMLElement;
    return r ? a ? r instanceof a : r.nodeType === e : false;
  }
  function isElement(r) {
    var a = window.Element;
    return r ? a ? r instanceof a : r.nodeType === e : false;
  }
  function each(r, e) {
    if (isArrayLike(r)) {
      for (var a = 0; a < r.length; a++) {
        if (false === e(r[a], a, r)) {
          break;
        }
      }
    } else if (r) {
      each(Object.keys(r), (function(a) {
        return e(r[a], a, r);
      }));
    }
    return r;
  }
  function assignDeep(r, e, a, t, n, i, v) {
    var o = [ e, a, t, n, i, v ];
    if (("object" !== typeof r || isNull(r)) && !isFunction(r)) {
      r = {};
    }
    each(o, (function(e) {
      each(l(e), (function(a) {
        var t = e[a];
        if (r === t) {
          return true;
        }
        var n = isArray(t);
        if (t && (isPlainObject(t) || n)) {
          var i = r[a];
          var v = i;
          if (n && !isArray(i)) {
            v = [];
          } else if (!n && !isPlainObject(i)) {
            v = {};
          }
          r[a] = assignDeep(v, t);
        } else {
          r[a] = t;
        }
      }));
    }));
    return r;
  }
  function isEmptyObject(r) {
    for (var e in r) {
      return false;
    }
    return true;
  }
  function getSetProp(r, e, a, t) {
    if (isUndefined(t)) {
      return a ? a[r] : e;
    }
    a && (a[r] = t);
  }
  function attr(r, e, a) {
    if (isUndefined(a)) {
      return r ? r.getAttribute(e) : null;
    }
    r && r.setAttribute(e, a);
  }
  function scrollLeft(r, e) {
    return getSetProp("scrollLeft", 0, r, e);
  }
  function scrollTop(r, e) {
    return getSetProp("scrollTop", 0, r, e);
  }
  function style(r, e) {
    var a = isString(e);
    var t = isArray(e) || a;
    if (t) {
      var n = a ? "" : {};
      if (r) {
        var i = window.getComputedStyle(r, null);
        n = a ? ur(r, i, e) : e.reduce((function(e, a) {
          e[a] = ur(r, i, a);
          return e;
        }), n);
      }
      return n;
    }
    each(l(e), (function(a) {
      return fr(r, a, e[a]);
    }));
  }
  function getDefaultExportFromCjs(r) {
    return r && r.g && Object.prototype.hasOwnProperty.call(r, "default") ? r["default"] : r;
  }
  var e = Node.ELEMENT_NODE;
  var a = Object.prototype, t = a.toString, n = a.hasOwnProperty;
  var i = function type(r) {
    return isUndefined(r) || isNull(r) ? "" + r : t.call(r).replace(/^\[object (.+)\]$/, "$1").toLowerCase();
  };
  var v = function indexOf(r, e, a) {
    return r.indexOf(e, a);
  };
  var o = function push(r, e, a) {
    !a && !isString(e) && isArrayLike(e) ? Array.prototype.push.apply(r, e) : r.push(e);
    return r;
  };
  var u = function from(r) {
    if (Array.from && r) {
      return Array.from(r);
    }
    var e = [];
    if (r instanceof Set) {
      r.forEach((function(r) {
        o(e, r);
      }));
    } else {
      each(r, (function(r) {
        o(e, r);
      }));
    }
    return e;
  };
  var f = function isEmptyArray(r) {
    return !!r && 0 === r.length;
  };
  var s = function runEachAndClear(r, e, a) {
    var t = function runFn(r) {
      return r && r.apply(void 0, e || []);
    };
    if (r instanceof Set) {
      r.forEach(t);
      !a && r.clear();
    } else {
      each(r, t);
      !a && r.splice && r.splice(0, r.length);
    }
  };
  var c = function hasOwnProperty(r, e) {
    return Object.prototype.hasOwnProperty.call(r, e);
  };
  var l = function keys(r) {
    return r ? Object.keys(r) : [];
  };
  var d = function attrClass(r, e, a, t) {
    var n = attr(r, e) || "";
    var i = new Set(n.split(" "));
    i[t ? "add" : "delete"](a);
    attr(r, e, u(i).join(" ").trim());
  };
  var g = function hasAttrClass(r, e, a) {
    var t = attr(r, e) || "";
    var n = new Set(t.split(" "));
    return n.has(a);
  };
  var p = function removeAttr(r, e) {
    r && r.removeAttribute(e);
  };
  var h = Element.prototype;
  var b = function find(r, e) {
    var a = [];
    var t = e ? isElement(e) ? e : null : document;
    return t ? o(a, t.querySelectorAll(r)) : a;
  };
  var w = function findFirst(r, e) {
    var a = e ? isElement(e) ? e : null : document;
    return a ? a.querySelector(r) : null;
  };
  var m = function is(r, e) {
    if (isElement(r)) {
      var a = h.matches || h.msMatchesSelector;
      return a.call(r, e);
    }
    return false;
  };
  var y = function contents(r) {
    return r ? u(r.childNodes) : [];
  };
  var S = function parent(r) {
    return r ? r.parentElement : null;
  };
  var C = function closest(r, e) {
    if (isElement(r)) {
      var a = h.closest;
      if (a) {
        return a.call(r, e);
      }
      do {
        if (m(r, e)) {
          return r;
        }
        r = S(r);
      } while (r);
    }
    return null;
  };
  var O = function liesBetween(r, e, a) {
    var t = r && C(r, e);
    var n = r && w(a, t);
    return t && n ? t === r || n === r || C(C(r, a), e) !== t : false;
  };
  var x = function before(r, e, a) {
    if (a) {
      var t = e;
      var n;
      if (r) {
        if (isArrayLike(a)) {
          n = document.createDocumentFragment();
          each(a, (function(r) {
            if (r === t) {
              t = r.previousSibling;
            }
            n.appendChild(r);
          }));
        } else {
          n = a;
        }
        if (e) {
          if (!t) {
            t = r.firstChild;
          } else if (t !== e) {
            t = t.nextSibling;
          }
        }
        r.insertBefore(n, t || null);
      }
    }
  };
  var A = function appendChildren(r, e) {
    x(r, null, e);
  };
  var E = function prependChildren(r, e) {
    x(r, r && r.firstChild, e);
  };
  var D = function insertBefore(r, e) {
    x(S(r), r, e);
  };
  var L = function insertAfter(r, e) {
    x(S(r), r && r.nextSibling, e);
  };
  var P = function removeElements(r) {
    if (isArrayLike(r)) {
      each(u(r), (function(r) {
        return removeElements(r);
      }));
    } else if (r) {
      var e = S(r);
      if (e) {
        e.removeChild(r);
      }
    }
  };
  var T = function createDiv(r) {
    var e = document.createElement("div");
    if (r) {
      attr(e, "class", r);
    }
    return e;
  };
  var z = function createDOM(r) {
    var e = T();
    e.innerHTML = r.trim();
    return each(y(e), (function(r) {
      return P(r);
    }));
  };
  var j = function firstLetterToUpper(r) {
    return r.charAt(0).toUpperCase() + r.slice(1);
  };
  var I = function getDummyStyle() {
    return T().style;
  };
  var M = [ "-webkit-", "-moz-", "-o-", "-ms-" ];
  var R = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ];
  var F = {};
  var H = {};
  var N = function cssProperty(r) {
    var e = H[r];
    if (c(H, r)) {
      return e;
    }
    var a = j(r);
    var t = I();
    each(M, (function(n) {
      var i = n.replace(/-/g, "");
      var v = [ r, n + r, i + a, j(i) + a ];
      return !(e = v.find((function(r) {
        return void 0 !== t[r];
      })));
    }));
    return H[r] = e || "";
  };
  var V = function jsAPI(r) {
    var e = F[r] || window[r];
    if (c(F, r)) {
      return e;
    }
    each(R, (function(a) {
      e = e || window[a + j(r)];
      return !e;
    }));
    F[r] = e;
    return e;
  };
  var U = V("MutationObserver");
  var k = V("IntersectionObserver");
  var B = V("ResizeObserver");
  var q = V("cancelAnimationFrame");
  var Y = V("requestAnimationFrame");
  var W = /[^\x20\t\r\n\f]+/g;
  var G = function classListAction(r, e, a) {
    var t;
    var n = 0;
    var i = false;
    if (r && e && isString(e)) {
      var v = e.match(W) || [];
      i = v.length > 0;
      while (t = v[n++]) {
        i = !!a(r.classList, t) && i;
      }
    }
    return i;
  };
  var X = function hasClass(r, e) {
    return G(r, e, (function(r, e) {
      return r.contains(e);
    }));
  };
  var $ = function removeClass(r, e) {
    G(r, e, (function(r, e) {
      return r.remove(e);
    }));
  };
  var J = function addClass(r, e) {
    G(r, e, (function(r, e) {
      return r.add(e);
    }));
    return $.bind(0, r, e);
  };
  var K = function equal(r, e, a, t) {
    if (r && e) {
      var n = true;
      each(a, (function(a) {
        var i = t ? t(r[a]) : r[a];
        var v = t ? t(e[a]) : e[a];
        if (i !== v) {
          n = false;
        }
      }));
      return n;
    }
    return false;
  };
  var Z = function equalWH(r, e) {
    return K(r, e, [ "w", "h" ]);
  };
  var Q = function equalXY(r, e) {
    return K(r, e, [ "x", "y" ]);
  };
  var rr = function equalTRBL(r, e) {
    return K(r, e, [ "t", "r", "b", "l" ]);
  };
  var er = function equalBCRWH(r, e, a) {
    return K(r, e, [ "width", "height" ], a && function(r) {
      return Math.round(r);
    });
  };
  var ar = function clearTimeouts(r) {
    r && window.clearTimeout(r);
    r && q(r);
  };
  var tr = function noop() {};
  var nr = function debounce(r, e) {
    var a;
    var t;
    var n;
    var i;
    var v = e || {}, o = v.p, f = v._, s = v.m;
    var c = window.setTimeout;
    var l = function invokeFunctionToDebounce(e) {
      ar(a);
      ar(t);
      t = a = n = void 0;
      r.apply(this, e);
    };
    var d = function mergeParms(r) {
      return s && n ? s(n, r) : r;
    };
    var g = function flush() {
      if (a) {
        l(d(i) || i);
      }
    };
    var p = function debouncedFn() {
      var r = u(arguments);
      var e = isFunction(o) ? o() : o;
      var v = isNumber(e) && e >= 0;
      if (v) {
        var s = isFunction(f) ? f() : f;
        var p = isNumber(s) && s >= 0;
        var h = e > 0 ? c : Y;
        var b = d(r);
        var w = b || r;
        var m = l.bind(0, w);
        ar(a);
        a = h(m, e);
        if (p && !t) {
          t = c(g, s);
        }
        n = i = w;
      } else {
        l(r);
      }
    };
    p.S = g;
    return p;
  };
  var ir = {
    opacity: 1,
    zindex: 1
  };
  var vr = function parseToZeroOrNumber(r, e) {
    var a = e ? parseFloat(r) : parseInt(r, 10);
    return Number.isNaN(a) ? 0 : a;
  };
  var or = function adaptCSSVal(r, e) {
    return !ir[r.toLowerCase()] && isNumber(e) ? e + "px" : e;
  };
  var ur = function getCSSVal(r, e, a) {
    return null != e ? e[a] || e.getPropertyValue(a) : r.style[a];
  };
  var fr = function setCSSVal(r, e, a) {
    try {
      if (r) {
        var t = r.style;
        if (!isUndefined(t[e])) {
          t[e] = or(e, a);
        } else {
          t.setProperty(e, a);
        }
      }
    } catch (n) {}
  };
  var sr = function topRightBottomLeft(r, e, a) {
    var t = e ? e + "-" : "";
    var n = a ? "-" + a : "";
    var i = t + "top" + n;
    var v = t + "right" + n;
    var o = t + "bottom" + n;
    var u = t + "left" + n;
    var f = style(r, [ i, v, o, u ]);
    return {
      t: vr(f[i]),
      r: vr(f[v]),
      b: vr(f[o]),
      l: vr(f[u])
    };
  };
  var cr = {
    w: 0,
    h: 0
  };
  var lr = function windowSize() {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    };
  };
  var dr = function offsetSize(r) {
    return r ? {
      w: r.offsetWidth,
      h: r.offsetHeight
    } : cr;
  };
  var gr = function clientSize(r) {
    return r ? {
      w: r.clientWidth,
      h: r.clientHeight
    } : cr;
  };
  var pr = function scrollSize(r) {
    return r ? {
      w: r.scrollWidth,
      h: r.scrollHeight
    } : cr;
  };
  var hr = function fractionalSize(r) {
    var e = parseFloat(style(r, "height")) || 0;
    var a = parseFloat(style(r, "height")) || 0;
    return {
      w: a - Math.round(a),
      h: e - Math.round(e)
    };
  };
  var _r = function getBoundingClientRect(r) {
    return r.getBoundingClientRect();
  };
  var br;
  var wr = function supportPassiveEvents() {
    if (isUndefined(br)) {
      br = false;
      try {
        window.addEventListener("test", null, Object.defineProperty({}, "passive", {
          get: function get() {
            br = true;
          }
        }));
      } catch (r) {}
    }
    return br;
  };
  var mr = function splitEventNames(r) {
    return r.split(" ");
  };
  var yr = function off(r, e, a, t) {
    each(mr(e), (function(e) {
      r.removeEventListener(e, a, t);
    }));
  };
  var Sr = function on(r, e, a, t) {
    var n = wr();
    var i = n && t && t.C || false;
    var v = t && t.O || false;
    var u = t && t.A || false;
    var f = [];
    var c = n ? {
      passive: i,
      capture: v
    } : v;
    each(mr(e), (function(e) {
      var t = u ? function(n) {
        r.removeEventListener(e, t, v);
        a && a(n);
      } : a;
      o(f, yr.bind(null, r, e, t, v));
      r.addEventListener(e, t, c);
    }));
    return s.bind(0, f);
  };
  var Cr = function stopPropagation(r) {
    return r.stopPropagation();
  };
  var Or = function preventDefault(r) {
    return r.preventDefault();
  };
  var xr = function stopAndPrevent(r) {
    return Cr(r) || Or(r);
  };
  var Ar = {
    x: 0,
    y: 0
  };
  var Er = function absoluteCoordinates(r) {
    var e = r ? _r(r) : 0;
    return e ? {
      x: e.left + window.pageYOffset,
      y: e.top + window.pageXOffset
    } : Ar;
  };
  var Dr = function manageListener(r, e) {
    each(isArray(e) ? e : [ e ], r);
  };
  var Lr = function createEventListenerHub(r) {
    function removeEvent(r, a) {
      if (r) {
        var t = e.get(r);
        Dr((function(r) {
          if (t) {
            t[r ? "delete" : "clear"](r);
          }
        }), a);
      } else {
        e.forEach((function(r) {
          r.clear();
        }));
        e.clear();
      }
    }
    function addEvent(r, a) {
      var t = e.get(r) || new Set;
      e.set(r, t);
      Dr((function(r) {
        r && t.add(r);
      }), a);
      return removeEvent.bind(0, r, a);
    }
    function triggerEvent(r, a) {
      var t = e.get(r);
      each(u(t), (function(r) {
        if (a && !f(a)) {
          r.apply(0, a);
        } else {
          r();
        }
      }));
    }
    var e = new Map;
    var a = l(r);
    each(a, (function(e) {
      addEvent(e, r[e]);
    }));
    return [ addEvent, removeEvent, triggerEvent ];
  };
  var Pr = function getPropByPath(r, e) {
    return r ? e.split(".").reduce((function(r, e) {
      return r && c(r, e) ? r[e] : void 0;
    }), r) : void 0;
  };
  var Tr = function createOptionCheck(r, e, a) {
    return function(t) {
      return [ Pr(r, t), a || void 0 !== Pr(e, t) ];
    };
  };
  var zr = function createState(r) {
    var e = r;
    return [ function() {
      return e;
    }, function(r) {
      e = assignDeep({}, e, r);
    } ];
  };
  var jr = "os-environment";
  var Ir = jr + "-flexbox-glue";
  var Mr = Ir + "-max";
  var Rr = "data-overlayscrollbars";
  var Fr = Rr + "-overflow-x";
  var Hr = Rr + "-overflow-y";
  var Nr = "overflowVisible";
  var Vr = "viewportStyled";
  var Ur = "os-padding";
  var kr = "os-viewport";
  var Br = kr + "-arrange";
  var qr = "os-content";
  var Yr = kr + "-scrollbar-styled";
  var Wr = "os-overflow-visible";
  var Gr = "os-size-observer";
  var Xr = Gr + "-appear";
  var $r = Gr + "-listener";
  var Jr = $r + "-scroll";
  var Kr = $r + "-item";
  var Zr = Kr + "-final";
  var Qr = "os-trinsic-observer";
  var re = "os-scrollbar";
  var ee = re + "-horizontal";
  var ae = re + "-vertical";
  var te = "os-scrollbar-track";
  var ne = "os-scrollbar-handle";
  var ie = function opsStringify(r) {
    return JSON.stringify(r, (function(r, e) {
      if (isFunction(e)) {
        throw new Error;
      }
      return e;
    }));
  };
  var ve = {
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
  var oe = function getOptionsDiff(r, e) {
    var a = {};
    var t = l(e).concat(l(r));
    each(t, (function(t) {
      var n = r[t];
      var i = e[t];
      if (isObject(n) && isObject(i)) {
        assignDeep(a[t] = {}, getOptionsDiff(n, i));
      } else if (c(e, t) && i !== n) {
        var v = true;
        if (isArray(n) || isArray(i)) {
          try {
            if (ie(n) === ie(i)) {
              v = false;
            }
          } catch (o) {}
        }
        if (v) {
          a[t] = i;
        }
      }
    }));
    return a;
  };
  var ue;
  var fe = Math.abs, se = Math.round;
  var ce = function diffBiggerThanOne(r, e) {
    var a = fe(r);
    var t = fe(e);
    return !(a === t || a + 1 === t || a - 1 === t);
  };
  var le = function getNativeScrollbarSize(r, e, a) {
    A(r, e);
    var t = gr(e);
    var n = dr(e);
    var i = hr(a);
    return {
      x: n.h - t.h + i.h,
      y: n.w - t.w + i.w
    };
  };
  var de = function getNativeScrollbarsHiding(r) {
    var e = false;
    var a = J(r, Yr);
    try {
      e = "none" === style(r, N("scrollbar-width")) || "none" === window.getComputedStyle(r, "::-webkit-scrollbar").getPropertyValue("display");
    } catch (t) {}
    a();
    return e;
  };
  var ge = function getRtlScrollBehavior(r, e) {
    var a = "hidden";
    style(r, {
      overflowX: a,
      overflowY: a,
      direction: "rtl"
    });
    scrollLeft(r, 0);
    var t = Er(r);
    var n = Er(e);
    scrollLeft(r, -999);
    var i = Er(e);
    return {
      i: t.x === n.x,
      n: n.x !== i.x
    };
  };
  var pe = function getFlexboxGlue(r, e) {
    var a = J(r, Ir);
    var t = _r(r);
    var n = _r(e);
    var i = er(n, t, true);
    var v = J(r, Mr);
    var o = _r(r);
    var u = _r(e);
    var f = er(u, o, true);
    a();
    v();
    return i && f;
  };
  var he = function getWindowDPR() {
    var r = window.screen.deviceXDPI || 0;
    var e = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || r / e;
  };
  var _e = function createEnvironment() {
    var r = document, e = r.body;
    var a = z('<div class="' + jr + '"><div></div></div>');
    var t = a[0];
    var n = t.firstChild;
    var i = Lr(), v = i[0], o = i[2];
    var u = createCache({
      v: le(e, t, n),
      o: Q
    }), f = u[0], s = u[1];
    var c = s(), l = c[0];
    var d = de(t);
    var g = {
      x: 0 === l.x,
      y: 0 === l.y
    };
    var h = {
      D: !d,
      L: false
    };
    var b = assignDeep({}, ve);
    var w = {
      P: l,
      T: g,
      j: d,
      I: "-1" === style(t, "zIndex"),
      M: ge(t, n),
      R: pe(t, n),
      F: function _addListener(r) {
        return v("_", r);
      },
      H: assignDeep.bind(0, {}, h),
      N: function _setInitializationStrategy(r) {
        assignDeep(h, r);
      },
      V: assignDeep.bind(0, {}, b),
      U: function _setDefaultOptions(r) {
        assignDeep(b, r);
      },
      k: assignDeep({}, h),
      B: assignDeep({}, b)
    };
    p(t, "style");
    P(t);
    if (!d && (!g.x || !g.y)) {
      var m = lr();
      var y = he();
      window.addEventListener("resize", (function() {
        var r = lr();
        var a = {
          w: r.w - m.w,
          h: r.h - m.h
        };
        if (0 === a.w && 0 === a.h) {
          return;
        }
        var i = {
          w: fe(a.w),
          h: fe(a.h)
        };
        var v = {
          w: fe(se(r.w / (m.w / 100))),
          h: fe(se(r.h / (m.h / 100)))
        };
        var u = he();
        var s = i.w > 2 && i.h > 2;
        var c = !ce(v.w, v.h);
        var l = u !== y && y > 0;
        var d = s && c && l;
        if (d) {
          var g = f(le(e, t, n)), p = g[0], h = g[1];
          assignDeep(ue.P, p);
          P(t);
          if (h) {
            o("_");
          }
        }
        m = r;
        y = u;
      }));
    }
    return w;
  };
  var be = function getEnvironment() {
    if (!ue) {
      ue = _e();
    }
    return ue;
  };
  var we = {};
  var me = function getPlugins() {
    return assignDeep({}, we);
  };
  var ye = function addPlugin(r) {
    return each(isArray(r) ? r : [ r ], (function(r) {
      each(l(r), (function(e) {
        we[e] = r[e];
      }));
    }));
  };
  var Se = {
    exports: {}
  };
  (function(r) {
    function _extends() {
      r.exports = _extends = Object.assign ? Object.assign.bind() : function(r) {
        for (var e = 1; e < arguments.length; e++) {
          var a = arguments[e];
          for (var t in a) {
            if (Object.prototype.hasOwnProperty.call(a, t)) {
              r[t] = a[t];
            }
          }
        }
        return r;
      }, r.exports.g = true, r.exports["default"] = r.exports;
      return _extends.apply(this, arguments);
    }
    r.exports = _extends, r.exports.g = true, r.exports["default"] = r.exports;
  })(Se);
  var Ce = getDefaultExportFromCjs(Se.exports);
  var Oe = {
    boolean: "__TPL_boolean_TYPE__",
    number: "__TPL_number_TYPE__",
    string: "__TPL_string_TYPE__",
    array: "__TPL_array_TYPE__",
    object: "__TPL_object_TYPE__",
    function: "__TPL_function_TYPE__",
    null: "__TPL_null_TYPE__"
  };
  var xe = function validateRecursive(r, e, a, t) {
    var n = {};
    var v = Ce({}, e);
    var u = l(r).filter((function(r) {
      return c(e, r);
    }));
    each(u, (function(u) {
      var f = e[u];
      var s = r[u];
      var c = isPlainObject(s);
      var l = t ? t + "." : "";
      if (c && isPlainObject(f)) {
        var d = validateRecursive(s, f, a, l + u), g = d[0], p = d[1];
        n[u] = g;
        v[u] = p;
        each([ v, n ], (function(r) {
          if (isEmptyObject(r[u])) {
            delete r[u];
          }
        }));
      } else if (!c) {
        var h = false;
        var b = [];
        var w = [];
        var m = i(f);
        var y = !isArray(s) ? [ s ] : s;
        each(y, (function(r) {
          var e;
          each(Oe, (function(a, t) {
            if (a === r) {
              e = t;
            }
          }));
          var a = isUndefined(e);
          if (a && isString(f)) {
            var t = r.split(" ");
            h = !!t.find((function(r) {
              return r === f;
            }));
            o(b, t);
          } else {
            h = Oe[m] === r;
          }
          o(w, a ? Oe.string : e);
          return !h;
        }));
        if (h) {
          n[u] = f;
        } else if (a) {
          console.warn('The option "' + l + u + "\" wasn't set, because it doesn't accept the type [ " + m.toUpperCase() + ' ] with the value of "' + f + '".\r\n' + "Accepted types are: [ " + w.join(", ").toUpperCase() + " ].\r\n" + (b.length > 0 ? "\r\nValid strings are: [ " + b.join(", ") + " ]." : ""));
        }
        delete v[u];
      }
    }));
    return [ n, v ];
  };
  var Ae = function validateOptions(r, e, a) {
    return xe(r, e, a);
  };
  var Ee;
  var De = Oe.number;
  var Le = Oe.boolean;
  var Pe = [ Oe.array, Oe.null ];
  var Te = "hidden scroll visible visible-hidden";
  var ze = "visible hidden auto";
  var je = "never scroll leavemove";
  var Ie = {
    paddingAbsolute: Le,
    updating: {
      elementEvents: Pe,
      attributes: Pe,
      debounce: [ Oe.number, Oe.array, Oe.null ],
      ignoreMutation: [ Oe.function, Oe.null ]
    },
    overflow: {
      x: Te,
      y: Te
    },
    scrollbars: {
      visibility: ze,
      autoHide: je,
      autoHideDelay: De,
      dragScroll: Le,
      clickScroll: Le,
      touch: Le
    },
    nativeScrollbarsOverlaid: {
      show: Le,
      initialize: Le
    }
  };
  var Me = "__osOptionsValidationPlugin";
  var Re = (Ee = {}, Ee[Me] = {
    q: function _(r, e) {
      var a = Ae(Ie, r, e), t = a[0], n = a[1];
      return Ce({}, n, t);
    }
  }, Ee);
  var Fe;
  var He = 3333333;
  var Ne = "scroll";
  var Ve = "__osSizeObserverPlugin";
  var Ue = (Fe = {}, Fe[Ve] = {
    q: function _(r, e, a) {
      var t = z('<div class="' + Kr + '" dir="ltr"><div class="' + Kr + '"><div class="' + Zr + '"></div></div><div class="' + Kr + '"><div class="' + Zr + '" style="width: 200%; height: 200%"></div></div></div>');
      A(r, t);
      J(r, Jr);
      var n = t[0];
      var i = n.lastChild;
      var v = n.firstChild;
      var u = null == v ? void 0 : v.firstChild;
      var f = dr(n);
      var s = f;
      var c = false;
      var l;
      var d = function reset() {
        scrollLeft(v, He);
        scrollTop(v, He);
        scrollLeft(i, He);
        scrollTop(i, He);
      };
      var g = function onResized(r) {
        l = 0;
        if (c) {
          f = s;
          e(true === r);
        }
      };
      var p = function onScroll(r) {
        s = dr(n);
        c = !r || !Z(s, f);
        if (r) {
          xr(r);
          if (c && !l) {
            q(l);
            l = Y(g);
          }
        } else {
          g(false === r);
        }
        d();
      };
      var h = o([], [ Sr(v, Ne, p), Sr(i, Ne, p) ]);
      style(u, {
        width: He,
        height: He
      });
      d();
      return [ a ? p.bind(0, false) : d, h ];
    }
  }, Fe);
  var ke;
  var Be = 0;
  var qe = "__osScrollbarsHidingPlugin";
  var Ye = (ke = {}, ke[qe] = {
    Y: function _createUniqueViewportArrangeElement() {
      var r = be(), e = r.j, a = r.T, t = r.I;
      var n = !t && !e && (a.x || a.y);
      var i = n ? document.createElement("style") : false;
      if (i) {
        attr(i, "id", Br + "-" + Be);
        Be++;
      }
      return i;
    },
    W: function _overflowUpdateSegment(r, e, a, t, n, i) {
      var v = be(), o = v.R;
      var u = function arrangeViewport(n, i, v, o) {
        if (r) {
          var u = t(), f = u.G;
          var s = n.X, c = n.$;
          var l = c.x, d = c.y;
          var g = s.x, p = s.y;
          var h = o ? "paddingRight" : "paddingLeft";
          var b = f[h];
          var w = f.paddingTop;
          var m = i.w + v.w;
          var y = i.h + v.h;
          var S = {
            w: p && d ? p + m - b + "px" : "",
            h: g && l ? g + y - w + "px" : ""
          };
          if (a) {
            var C = a.sheet;
            if (C) {
              var O = C.cssRules;
              if (O) {
                if (!O.length) {
                  C.insertRule("#" + attr(a, "id") + " + ." + Br + "::before {}", 0);
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
      var f = function undoViewportArrange(a, v, u) {
        if (r) {
          var f = u || n(a);
          var s = t(), c = s.G;
          var d = f.$;
          var g = d.x, p = d.y;
          var h = {};
          var b = function assignProps(r) {
            return each(r.split(" "), (function(r) {
              h[r] = c[r];
            }));
          };
          if (g) {
            b("marginBottom paddingTop paddingBottom");
          }
          if (p) {
            b("marginLeft marginRight paddingLeft paddingRight");
          }
          var w = style(e, l(h));
          $(e, Br);
          if (!o) {
            h.height = "";
          }
          style(e, h);
          return [ function() {
            i(f, v, r, w);
            style(e, w);
            J(e, Br);
          }, f ];
        }
        return [ tr ];
      };
      return [ u, f ];
    }
  }, ke);
  var We = function resolveInitialization(r, e) {
    return isFunction(r) ? r.apply(0, e) : r;
  };
  var Ge = function staticInitializationElement(r, e, a, t) {
    return We(t || We(a, r), r) || e.apply(0, r);
  };
  var Xe = function dynamicInitializationElement(r, e, a, t) {
    var n = We(t, r);
    if (isNull(n) || isUndefined(n)) {
      n = We(a, r);
    }
    return true === n || isNull(n) || isUndefined(n) ? e.apply(0, r) : n;
  };
  var $e = T.bind(0, "");
  var Je = function unwrap(r) {
    A(S(r), y(r));
    P(r);
  };
  var Ke = function addDataAttrHost(r, e) {
    attr(r, Rr, e);
    return p.bind(0, r, Rr);
  };
  var Ze = function createStructureSetupElements(r) {
    var e = be(), a = e.H, t = e.j;
    var n = me()[qe];
    var i = n && n.Y;
    var u = a(), f = u.J, c = u.K, h = u.D, b = u.L;
    var w = isHTMLElement(r);
    var C = r;
    var O = w ? r : C.target;
    var x = m(O, "textarea");
    var E = !x && m(O, "body");
    var T = O.ownerDocument;
    var z = T.body;
    var j = T.defaultView;
    var I = !!B && !x && t;
    var M = Ge.bind(0, [ O ]);
    var R = Xe.bind(0, [ O ]);
    var F = [ M($e, c, C.viewport), M($e, c), M($e) ].filter((function(r) {
      return !I ? r !== O : true;
    }))[0];
    var H = F === O;
    var N = {
      Z: O,
      J: x ? M($e, f, C.host) : O,
      K: F,
      D: !H && R($e, h, C.padding),
      L: !H && R($e, b, C.content),
      rr: !H && !t && i && i(),
      er: j,
      ar: T,
      tr: S(z),
      nr: z,
      ir: x,
      vr: E,
      ur: w,
      sr: H,
      cr: function _viewportHasClass(r, e) {
        return H ? g(F, Rr, e) : X(F, r);
      },
      lr: function _viewportAddRemoveClass(r, e, a) {
        return H ? d(F, Rr, e, a) : (a ? J : $)(F, r);
      }
    };
    var V = l(N).reduce((function(r, e) {
      var a = N[e];
      return o(r, a && !S(a) ? a : false);
    }), []);
    var U = function elementIsGenerated(r) {
      return r ? v(V, r) > -1 : null;
    };
    var k = N.Z, q = N.J, Y = N.D, W = N.K, G = N.L, K = N.rr;
    var Z = [];
    var Q = x && U(q);
    var rr = x ? k : y([ G, W, Y, q, k ].find((function(r) {
      return false === U(r);
    })));
    var er = G || W;
    var ar = function appendElements() {
      var r = Ke(q, H ? "viewport" : "host");
      var e = J(Y, Ur);
      var a = J(W, !H && kr);
      var n = J(G, qr);
      if (Q) {
        L(k, q);
        o(Z, (function() {
          L(q, k);
          P(q);
        }));
      }
      A(er, rr);
      A(q, Y);
      A(Y || q, !H && W);
      A(W, G);
      o(Z, (function() {
        r();
        p(W, Fr);
        p(W, Hr);
        if (U(G)) {
          Je(G);
        }
        if (U(W)) {
          Je(W);
        }
        if (U(Y)) {
          Je(Y);
        }
        e();
        a();
        n();
      }));
      if (t && !H) {
        o(Z, $.bind(0, W, Yr));
      }
      if (K) {
        D(W, K);
        o(Z, P.bind(0, K));
      }
    };
    return [ N, ar, s.bind(0, Z) ];
  };
  var Qe = function createTrinsicUpdate(r, e) {
    var a = r.L;
    var t = e[0];
    return function(r) {
      var e = be(), n = e.R;
      var i = t(), v = i.dr;
      var o = r.gr;
      var u = (a || !n) && o;
      if (u) {
        style(a, {
          height: v ? "" : "100%"
        });
      }
      return {
        pr: u,
        hr: u
      };
    };
  };
  var ra = function createPaddingUpdate(r, e) {
    var a = e[0], t = e[1];
    var n = r.J, i = r.D, v = r.K, o = r.sr;
    var u = createCache({
      o: rr,
      v: sr()
    }, sr.bind(0, n, "padding", "")), f = u[0], s = u[1];
    return function(r, e, n) {
      var u = s(n), c = u[0], l = u[1];
      var d = be(), g = d.j, p = d.R;
      var h = a(), b = h._r;
      var w = r.pr, m = r.hr, y = r.br;
      var S = e("paddingAbsolute"), C = S[0], O = S[1];
      var x = !p && m;
      if (w || l || x) {
        var A = f(n);
        c = A[0];
        l = A[1];
      }
      var E = !o && (O || y || l);
      if (E) {
        var D = !C || !i && !g;
        var L = c.r + c.l;
        var P = c.t + c.b;
        var T = {
          marginRight: D && !b ? -L : 0,
          marginBottom: D ? -P : 0,
          marginLeft: D && b ? -L : 0,
          top: D ? -c.t : 0,
          right: D ? b ? -c.r : "auto" : 0,
          left: D ? b ? "auto" : -c.l : 0,
          width: D ? "calc(100% + " + L + "px)" : ""
        };
        var z = {
          paddingTop: D ? c.t : 0,
          paddingRight: D ? c.r : 0,
          paddingBottom: D ? c.b : 0,
          paddingLeft: D ? c.l : 0
        };
        style(i || v, T);
        style(v, z);
        t({
          D: c,
          wr: !D,
          G: i ? z : assignDeep({}, T, z)
        });
      }
      return {
        mr: E
      };
    };
  };
  var ea = Math.max;
  var aa = "visible";
  var ta = "hidden";
  var na = 42;
  var ia = {
    o: Z,
    v: {
      w: 0,
      h: 0
    }
  };
  var va = {
    o: Q,
    v: {
      x: ta,
      y: ta
    }
  };
  var oa = function getOverflowAmount(r, e, a) {
    var t = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
    var n = {
      w: ea(0, r.w - e.w - ea(0, a.w)),
      h: ea(0, r.h - e.h - ea(0, a.h))
    };
    return {
      w: n.w > t ? n.w : 0,
      h: n.h > t ? n.h : 0
    };
  };
  var ua = function conditionalClass(r, e, a) {
    return a ? J(r, e) : $(r, e);
  };
  var fa = function overflowIsVisible(r) {
    return 0 === r.indexOf(aa);
  };
  var sa = function createOverflowUpdate(r, e) {
    var a = e[0], t = e[1];
    var n = r.J, i = r.D, v = r.K, o = r.rr, u = r.sr, f = r.lr;
    var s = be(), c = s.P, l = s.R, g = s.j, p = s.T;
    var h = me()[qe];
    var b = !u && !g && (p.x || p.y);
    var w = createCache(ia, hr.bind(0, v)), m = w[0], y = w[1];
    var S = createCache(ia, pr.bind(0, v)), C = S[0], O = S[1];
    var x = createCache(ia), A = x[0], E = x[1];
    var D = createCache(va), L = D[0];
    var P = function fixFlexboxGlue(r, e) {
      style(v, {
        height: ""
      });
      if (e) {
        var t = a(), i = t.wr, o = t.D;
        var u = r.yr, f = r.X;
        var s = hr(n);
        var c = gr(n);
        var l = "content-box" === style(v, "boxSizing");
        var d = i || l ? o.b + o.t : 0;
        var g = !(p.x && l);
        style(v, {
          height: c.h + s.h + (u.x && g ? f.x : 0) - d
        });
      }
    };
    var T = function getViewportOverflowState(r, e) {
      var a = !g && !r ? na : 0;
      var t = function getStatePerAxis(r, t, n) {
        var i = style(v, r);
        var o = e ? e[r] : i;
        var u = "scroll" === o;
        var f = t ? a : n;
        var s = u && !g ? f : 0;
        var c = t && !!a;
        return [ i, u, s, c ];
      };
      var n = t("overflowX", p.x, c.x), i = n[0], o = n[1], u = n[2], f = n[3];
      var s = t("overflowY", p.y, c.y), l = s[0], d = s[1], h = s[2], b = s[3];
      return {
        Sr: {
          x: i,
          y: l
        },
        yr: {
          x: o,
          y: d
        },
        X: {
          x: u,
          y: h
        },
        $: {
          x: f,
          y: b
        }
      };
    };
    var z = function setViewportOverflowState(r, e, a, t) {
      var n = function setAxisOverflowStyle(r, e) {
        var a = fa(r);
        var t = e && a && r.replace(aa + "-", "") || "";
        return [ e && !a ? r : "", fa(t) ? "hidden" : t ];
      };
      var i = n(a.x, e.x), v = i[0], o = i[1];
      var u = n(a.y, e.y), f = u[0], s = u[1];
      t.overflowX = o && f ? o : v;
      t.overflowY = s && v ? s : f;
      return T(r, t);
    };
    var j = function hideNativeScrollbars(r, e, t, n) {
      var i = r.X, v = r.$;
      var o = v.x, u = v.y;
      var f = i.x, s = i.y;
      var c = a(), l = c.G;
      var d = e ? "marginLeft" : "marginRight";
      var g = e ? "paddingLeft" : "paddingRight";
      var p = l[d];
      var h = l.marginBottom;
      var b = l[g];
      var w = l.paddingBottom;
      n.width = "calc(100% + " + (s + -1 * p) + "px)";
      n[d] = -s + p;
      n.marginBottom = -f + h;
      if (t) {
        n[g] = b + (u ? s : 0);
        n.paddingBottom = w + (o ? f : 0);
      }
    };
    var I = h ? h.W(b, v, o, a, T, j) : [ function() {
      return b;
    }, function() {
      return [ tr ];
    } ], M = I[0], R = I[1];
    return function(r, e, o) {
      var s = r.pr, c = r.Cr, h = r.hr, b = r.mr, w = r.gr, S = r.br;
      var x = a(), D = x.dr, I = x._r;
      var F = e("nativeScrollbarsOverlaid.show"), H = F[0], N = F[1];
      var V = e("overflow"), U = V[0], k = V[1];
      var B = H && p.x && p.y;
      var q = !u && !l && (s || h || c || N || w);
      var Y = fa(U.x);
      var W = fa(U.y);
      var G = Y || W;
      var X = y(o);
      var $ = O(o);
      var J = E(o);
      var K;
      if (N && g) {
        f(Yr, Vr, !B);
      }
      if (q) {
        K = T(B);
        P(K, D);
      }
      if (s || b || h || S || N) {
        if (G) {
          f(Wr, Nr, false);
        }
        var Z = R(B, I, K), Q = Z[0], rr = Z[1];
        var er = X = m(o), ar = er[0], tr = er[1];
        var nr = $ = C(o), ir = nr[0], vr = nr[1];
        var or = gr(v);
        var ur = ir;
        var fr = or;
        Q();
        if ((vr || tr || N) && rr && !B && M(rr, ir, ar, I)) {
          fr = gr(v);
          ur = pr(v);
        }
        J = A(oa({
          w: ea(ir.w, ur.w),
          h: ea(ir.h, ur.h)
        }, {
          w: fr.w + ea(0, or.w - ir.w),
          h: fr.h + ea(0, or.h - ir.h)
        }, ar), o);
      }
      var sr = J, cr = sr[0], lr = sr[1];
      var dr = $, hr = dr[0], _r = dr[1];
      var br = X, wr = br[0], mr = br[1];
      var yr = {
        x: cr.w > 0,
        y: cr.h > 0
      };
      var Sr = Y && W && (yr.x || yr.y) || Y && yr.x && !yr.y || W && yr.y && !yr.x;
      if (b || S || mr || _r || lr || k || N || q) {
        var Cr = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: "",
          overflowY: "",
          overflowX: ""
        };
        var Or = z(B, yr, U, Cr);
        var xr = M(Or, hr, wr, I);
        if (!u) {
          j(Or, I, xr, Cr);
        }
        if (q) {
          P(Or, D);
        }
        if (u) {
          attr(n, Fr, Cr.overflowX);
          attr(n, Hr, Cr.overflowY);
        } else {
          style(v, Cr);
        }
      }
      d(n, Rr, Nr, Sr);
      ua(i, Wr, Sr);
      !u && ua(v, Wr, G);
      var Ar = L(T(B).Sr), Er = Ar[0], Dr = Ar[1];
      t({
        Sr: Er,
        Or: {
          x: cr.w,
          y: cr.h
        },
        Ar: yr
      });
      return {
        Er: Dr,
        Dr: lr
      };
    };
  };
  var ca = function prepareUpdateHints(r, e, a) {
    var t = {};
    var n = e || {};
    var i = l(r).concat(l(n));
    each(i, (function(e) {
      var i = r[e];
      var v = n[e];
      t[e] = !!(a || i || v);
    }));
    return t;
  };
  var la = function createStructureSetupUpdate(r, e) {
    var a = r.K;
    var t = be(), n = t.j, i = t.T, v = t.R;
    var o = !n && (i.x || i.y);
    var u = [ Qe(r, e), ra(r, e), sa(r, e) ];
    return function(r, e, t) {
      var n = ca(assignDeep({
        pr: false,
        mr: false,
        br: false,
        gr: false,
        Dr: false,
        Er: false,
        Cr: false,
        hr: false
      }, e), {}, t);
      var i = o || !v;
      var f = i && scrollLeft(a);
      var s = i && scrollTop(a);
      var c = n;
      each(u, (function(e) {
        c = ca(c, e(c, r, !!t) || {}, t);
      }));
      if (isNumber(f)) {
        scrollLeft(a, f);
      }
      if (isNumber(s)) {
        scrollTop(a, s);
      }
      return c;
    };
  };
  var da = "animationstart";
  var ga = "scroll";
  var pa = 3333333;
  var ha = function getElmDirectionIsRTL(r) {
    return "rtl" === style(r, "direction");
  };
  var _a = function domRectHasDimensions(r) {
    return r && (r.height || r.width);
  };
  var ba = function createSizeObserver(r, e, a) {
    var t = a || {}, n = t.Lr, i = void 0 === n ? false : n, v = t.Pr, u = void 0 === v ? false : v;
    var f = me()[Ve];
    var c = be(), l = c.M;
    var d = z('<div class="' + Gr + '"><div class="' + $r + '"></div></div>');
    var g = d[0];
    var p = g.firstChild;
    var h = ha.bind(0, g);
    var b = createCache({
      v: void 0,
      u: true,
      o: function _equal(r, e) {
        return !(!r || !_a(r) && _a(e));
      }
    }), w = b[0];
    var m = function onSizeChangedCallbackProxy(r) {
      var a = isArray(r) && r.length > 0 && isObject(r[0]);
      var t = !a && isBoolean(r[0]);
      var n = false;
      var v = false;
      var o = true;
      if (a) {
        var u = w(r.pop().contentRect), f = u[0], s = u[2];
        var c = _a(f);
        var d = _a(s);
        n = !s || !c;
        v = !d && c;
        o = !n;
      } else if (t) {
        o = r[1];
      } else {
        v = true === r;
      }
      if (i && o) {
        var p = t ? r[0] : ha(g);
        scrollLeft(g, p ? l.n ? -pa : l.i ? 0 : pa : pa);
        scrollTop(g, pa);
      }
      if (!n) {
        e({
          pr: !t,
          Tr: t ? r : void 0,
          Pr: !!v
        });
      }
    };
    var y = [];
    var S = u ? m : false;
    var C;
    if (B) {
      var O = new B(m);
      O.observe(p);
      o(y, (function() {
        O.disconnect();
      }));
    } else if (f) {
      var x = f.q(p, m, u), A = x[0], D = x[1];
      S = A;
      o(y, D);
    }
    if (i) {
      C = createCache({
        v: !h()
      }, h);
      var L = C, T = L[0];
      o(y, Sr(g, ga, (function(r) {
        var e = T();
        var a = e[0], t = e[1];
        if (t) {
          $(p, "ltr rtl");
          if (a) {
            J(p, "rtl");
          } else {
            J(p, "ltr");
          }
          m(e);
        }
        xr(r);
      })));
    }
    if (S) {
      J(g, Xr);
      o(y, Sr(g, da, S, {
        A: !!B
      }));
    }
    E(r, g);
    return function() {
      s(y);
      P(g);
    };
  };
  var wa = function isHeightIntrinsic(r) {
    return 0 === r.h || r.isIntersecting || r.intersectionRatio > 0;
  };
  var ma = function createTrinsicObserver(r, e) {
    var a = T(Qr);
    var t = [];
    var n = createCache({
      v: false
    }), i = n[0];
    var v = function triggerOnTrinsicChangedCallback(r) {
      if (r) {
        var a = i(wa(r));
        var t = a[1];
        if (t) {
          e(a);
        }
      }
    };
    if (k) {
      var u = new k((function(r) {
        if (r && r.length > 0) {
          v(r.pop());
        }
      }), {
        root: r
      });
      u.observe(a);
      o(t, (function() {
        u.disconnect();
      }));
    } else {
      var f = function onSizeChanged() {
        var r = dr(a);
        v(r);
      };
      o(t, ba(a, f));
      f();
    }
    E(r, a);
    return function() {
      s(t);
      P(a);
    };
  };
  var ya = function createEventContentChange(r, e, a) {
    var t;
    var n = false;
    var i = function destroy() {
      n = true;
    };
    var v = function updateElements(i) {
      if (a) {
        var v = a.reduce((function(e, a) {
          if (a) {
            var t = a[0];
            var n = a[1];
            var v = n && t && (i ? i(t) : b(t, r));
            if (v && v.length && n && isString(n)) {
              o(e, [ v, n.trim() ], true);
            }
          }
          return e;
        }), []);
        each(v, (function(r) {
          return each(r[0], (function(a) {
            var i = r[1];
            var v = t.get(a);
            if (v) {
              var o = v[0];
              var u = v[1];
              if (o === i) {
                u();
              }
            }
            var f = Sr(a, i, (function(r) {
              if (n) {
                f();
                t.delete(a);
              } else {
                e(r);
              }
            }));
            t.set(a, [ i, f ]);
          }));
        }));
      }
    };
    if (a) {
      t = new WeakMap;
      v();
    }
    return [ i, v ];
  };
  var Sa = function createDOMObserver(r, e, a, t) {
    var n = false;
    var i = t || {}, u = i.zr, s = i.jr, c = i.Ir, l = i.Mr, d = i.Rr, g = i.Fr;
    var p = ya(r, nr((function() {
      if (n) {
        a(true);
      }
    }), {
      p: 33,
      _: 99
    }), c), h = p[0], w = p[1];
    var y = u || [];
    var S = s || [];
    var C = y.concat(S);
    var O = function observerCallback(n) {
      var i = d || tr;
      var u = g || tr;
      var s = [];
      var c = [];
      var p = false;
      var h = false;
      var y = false;
      each(n, (function(a) {
        var n = a.attributeName, f = a.target, d = a.type, g = a.oldValue, b = a.addedNodes;
        var w = "attributes" === d;
        var C = "childList" === d;
        var O = r === f;
        var x = w && isString(n) ? attr(f, n) : 0;
        var A = 0 !== x && g !== x;
        var E = v(S, n) > -1 && A;
        if (e && !O) {
          var D = !w;
          var L = w && E;
          var P = L && l && m(f, l);
          var T = P ? !i(f, n, g, x) : D || L;
          var z = T && !u(a, !!P, r, t);
          o(c, b);
          h = h || z;
          y = y || C;
        }
        if (!e && O && A && !i(f, n, g, x)) {
          o(s, n);
          p = p || E;
        }
      }));
      if (y && !f(c)) {
        w((function(r) {
          return c.reduce((function(e, a) {
            o(e, b(r, a));
            return m(a, r) ? o(e, a) : e;
          }), []);
        }));
      }
      if (e) {
        h && a(false);
      } else if (!f(s) || p) {
        a(s, p);
      }
    };
    var x = new U(O);
    x.observe(r, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: C,
      subtree: e,
      childList: e,
      characterData: e
    });
    n = true;
    return [ function() {
      if (n) {
        h();
        x.disconnect();
        n = false;
      }
    }, function() {
      if (n) {
        O(x.takeRecords());
      }
    } ];
  };
  var Ca = "[" + Rr + "]";
  var Oa = "." + kr;
  var xa = [ "tabindex" ];
  var Aa = [ "wrap", "cols", "rows" ];
  var Ea = [ "id", "class", "style", "open" ];
  var Da = function createStructureSetupObservers(r, e, a) {
    var t;
    var n;
    var i;
    var o = e[1];
    var u = r.J, f = r.K, s = r.L, c = r.ir, d = r.sr, g = r.cr, h = r.lr;
    var b = be(), w = b.j, m = b.R;
    var y = createCache({
      o: Z,
      v: {
        w: 0,
        h: 0
      }
    }, (function() {
      var r = g(Wr, Nr);
      r && h(Wr, Nr);
      var e = pr(s);
      var a = pr(f);
      var t = hr(f);
      r && h(Wr, Nr, true);
      return {
        w: a.w + e.w + t.w,
        h: a.h + e.h + t.h
      };
    })), S = y[0];
    var C = c ? Aa : Ea.concat(Aa);
    var x = nr(a, {
      p: function _timeout() {
        return t;
      },
      _: function _maxDelay() {
        return n;
      },
      m: function _mergeParams(r, e) {
        var a = r[0];
        var t = e[0];
        return [ l(a).concat(l(t)).reduce((function(r, e) {
          r[e] = a[e] || t[e];
          return r;
        }), {}) ];
      }
    });
    var A = function updateViewportAttrsFromHost(r) {
      each(r || xa, (function(r) {
        if (v(xa, r) > -1) {
          var e = attr(u, r);
          if (isString(e)) {
            attr(f, r, e);
          } else {
            p(f, r);
          }
        }
      }));
    };
    var E = function onTrinsicChanged(r) {
      var e = r[0], t = r[1];
      o({
        dr: e
      });
      a({
        gr: t
      });
    };
    var D = function onSizeChanged(r) {
      var e = r.pr, t = r.Tr, n = r.Pr;
      var i = !e || n ? a : x;
      var v = false;
      if (t) {
        var u = t[0], f = t[1];
        v = f;
        o({
          _r: u
        });
      }
      i({
        pr: e,
        br: v
      });
    };
    var L = function onContentMutation(r) {
      var e = S(), t = e[1];
      var n = r ? a : x;
      if (t) {
        n({
          hr: true
        });
      }
    };
    var P = function onHostMutation(r, e) {
      if (e) {
        x({
          Cr: true
        });
      } else if (!d) {
        A(r);
      }
    };
    var T = (s || !m) && ma(u, E);
    var z = !d && ba(u, D, {
      Pr: true,
      Lr: !w
    });
    var j = Sa(u, false, P, {
      jr: Ea,
      zr: Ea.concat(xa)
    }), I = j[0];
    var M = d && new B(D.bind(0, {
      pr: true
    }));
    M && M.observe(u);
    A();
    return [ function(r) {
      var e = r("updating.ignoreMutation"), a = e[0];
      var v = r("updating.attributes"), o = v[0], u = v[1];
      var c = r("updating.elementEvents"), l = c[0], d = c[1];
      var g = r("updating.debounce"), p = g[0], h = g[1];
      var b = d || u;
      var w = function ignoreMutationFromOptions(r) {
        return isFunction(a) && a(r);
      };
      if (b) {
        if (i) {
          i[1]();
          i[0]();
        }
        i = Sa(s || f, true, L, {
          jr: C.concat(o || []),
          zr: C.concat(o || []),
          Ir: l,
          Mr: Ca,
          Fr: function _ignoreContentChange(r, e) {
            var a = r.target, t = r.attributeName;
            var n = !e && t ? O(a, Ca, Oa) : false;
            return n || !!w(r);
          }
        });
      }
      if (h) {
        x.S();
        if (isArray(p)) {
          var m = p[0];
          var y = p[1];
          t = isNumber(m) ? m : false;
          n = isNumber(y) ? y : false;
        } else if (isNumber(p)) {
          t = p;
          n = false;
        } else {
          t = false;
          n = false;
        }
      }
    }, function() {
      i && i[0]();
      T && T();
      z && z();
      M && M.disconnect();
      I();
    } ];
  };
  var La = {
    D: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    wr: false,
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
    Ar: {
      x: false,
      y: false
    },
    dr: false,
    _r: false
  };
  var Pa = function createStructureSetup(r, e) {
    var a = Tr(e, {});
    var t = zr(La);
    var n = Lr(), i = n[0], v = n[1], o = n[2];
    var u = t[0];
    var f = Ze(r), s = f[0], c = f[1], l = f[2];
    var d = la(s, t);
    var g = Da(s, t, (function(r) {
      o("u", [ d(a, r), {}, false ]);
    })), p = g[0], h = g[1];
    var b = u.bind(0);
    b.Hr = function(r) {
      i("u", r);
    };
    b.Nr = c;
    b.Vr = s;
    return [ function(r, a) {
      var t = Tr(e, r, a);
      p(t);
      o("u", [ d(t, {}, a), r, !!a ]);
    }, b, function() {
      v();
      h();
      l();
    } ];
  };
  var Ta = function generateScrollbarDOM(r) {
    var e = T(re + " " + r);
    var a = T(te);
    var t = T(ne);
    A(e, a);
    A(a, t);
    return {
      Ur: e,
      kr: a,
      Br: t
    };
  };
  var za = function createScrollbarsSetupElements(r, e) {
    var a = be(), t = a.H;
    var n = t(), i = n.qr;
    var v = e.Z, o = e.J, u = e.K, f = e.ur;
    var s = !f && r.scrollbarsSlot;
    var c = Xe([ v, o, u ], (function() {
      return o;
    }), i, s);
    var l = Ta(ee);
    var d = Ta(ae);
    var g = l.Ur;
    var p = d.Ur;
    var h = function appendElements() {
      A(c, g);
      A(c, p);
    };
    return [ {
      Yr: l,
      Wr: d
    }, h, P.bind(0, [ g, p ]) ];
  };
  var ja = function createScrollbarsSetup(r, e, a) {
    var t = zr({});
    var n = t[0];
    var i = za(r, a), v = i[0], o = i[1], u = i[2];
    var f = n.bind(0);
    f.Vr = v;
    f.Nr = o;
    return [ function(r, a) {
      var t = Tr(e, r, a);
      console.log(t);
    }, f, function() {
      u();
    } ];
  };
  var Ia = new Set;
  var Ma = new WeakMap;
  var Ra = function addInstance(r, e) {
    Ma.set(r, e);
    Ia.add(r);
  };
  var Fa = function removeInstance(r) {
    Ma.delete(r);
    Ia.delete(r);
  };
  var Ha = function getInstance(r) {
    return Ma.get(r);
  };
  var Na = function OverlayScrollbars(r, e, a) {
    var t = false;
    var n = be(), i = n.V, v = n.T, o = n.F;
    var u = me();
    var f = isHTMLElement(r) ? r : r.target;
    var s = Ha(f);
    if (s) {
      return s;
    }
    var c = u[Me];
    var d = function validateOptions(r) {
      var e = r || {};
      var a = c && c.q;
      return a ? a(e, true) : e;
    };
    var g = assignDeep({}, i(), d(e));
    var p = Lr(a), h = p[0], b = p[1], w = p[2];
    var m = Pa(r, g), y = m[0], S = m[1], C = m[2];
    var O = ja(r, g, S.Vr), x = O[0], A = O[1], E = O[2];
    var D = function update(r, e) {
      y(r, e);
      x(r, e);
    };
    var L = o(D.bind(0, {}, true));
    var P = function destroy(r) {
      Fa(f);
      L();
      E();
      C();
      t = true;
      w("destroyed", [ T, !!r ]);
      b();
    };
    var T = {
      options: function options(r) {
        if (r) {
          var e = oe(g, d(r));
          if (!isEmptyObject(e)) {
            assignDeep(g, e);
            D(e);
          }
        }
        return assignDeep({}, g);
      },
      on: h,
      off: function off(r, e) {
        r && e && b(r, e);
      },
      state: function state() {
        var r = S(), e = r.Or, a = r.Sr, n = r.Ar, i = r.D, v = r.wr;
        return assignDeep({}, {
          overflowAmount: e,
          overflowStyle: a,
          hasOverflow: n,
          padding: i,
          paddingAbsolute: v,
          destroyed: t
        });
      },
      elements: function elements() {
        var r = S.Vr, e = r.Z, a = r.J, t = r.D, n = r.K, i = r.L;
        return assignDeep({}, {
          target: e,
          host: a,
          padding: t || n,
          viewport: n,
          content: i || n
        });
      },
      update: function update(r) {
        D({}, r);
        return T;
      },
      destroy: P.bind(0)
    };
    each(l(u), (function(r) {
      var e = u[r];
      if (isFunction(e)) {
        e(OverlayScrollbars, T);
      }
    }));
    if (v.x && v.y && !g.nativeScrollbarsOverlaid.initialize) {
      P(true);
      return T;
    }
    S.Nr();
    A.Nr();
    Ra(f, T);
    w("initialized", [ T ]);
    S.Hr((function(r, e, a) {
      var t = r.pr, n = r.br, i = r.gr, v = r.Dr, o = r.Er, u = r.hr, f = r.Cr;
      w("updated", [ T, {
        updateHints: {
          sizeChanged: t,
          directionChanged: n,
          heightIntrinsicChanged: i,
          overflowAmountChanged: v,
          overflowStyleChanged: o,
          contentMutation: u,
          hostMutation: f
        },
        changedOptions: e,
        force: a
      } ]);
    }));
    return T.update(true);
  };
  Na.plugin = ye;
  Na.env = function() {
    var r = be(), e = r.P, a = r.T, t = r.j, n = r.M, i = r.R, v = r.I, o = r.k, u = r.B, f = r.H, s = r.N, c = r.V, l = r.U;
    return assignDeep({}, {
      scrollbarsSize: e,
      scrollbarsOverlaid: a,
      scrollbarsHiding: t,
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
  r.OverlayScrollbars = Na;
  r.optionsValidationPlugin = Re;
  r.scrollbarsHidingPlugin = Ye;
  r.sizeObserverPlugin = Ue;
  Object.defineProperty(r, "g", {
    value: true
  });
}));
//# sourceMappingURL=overlayscrollbars.js.map
