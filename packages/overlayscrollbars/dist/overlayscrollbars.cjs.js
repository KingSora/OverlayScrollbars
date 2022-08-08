/*!
 * OverlayScrollbars
 * Version: 2.0.0-beta.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */

"use strict";

function each(t, n) {
  if (isArrayLike(t)) {
    for (let o = 0; o < t.length; o++) {
      if (false === n(t[o], o, t)) {
        break;
      }
    }
  } else if (t) {
    each(Object.keys(t), (o => n(t[o], o, t)));
  }
  return t;
}

function style(t, n) {
  const o = isString(n);
  const s = isArray(n) || o;
  if (s) {
    let s = o ? "" : {};
    if (t) {
      const e = window.getComputedStyle(t, null);
      s = o ? getCSSVal(t, e, n) : n.reduce(((n, o) => {
        n[o] = getCSSVal(t, e, o);
        return n;
      }), s);
    }
    return s;
  }
  t && each(keys(n), (o => setCSSVal(t, o, n[o])));
}

Object.defineProperties(exports, {
  o: {
    value: true
  },
  [Symbol.toStringTag]: {
    value: "Module"
  }
});

const createCache = (t, n) => {
  const {u: o, _: s, g: e} = t;
  let c = o;
  let r;
  const cacheUpdateContextual = (t, n) => {
    const o = c;
    const l = t;
    const i = n || (s ? !s(o, l) : o !== l);
    if (i || e) {
      c = l;
      r = o;
    }
    return [ c, i, r ];
  };
  const cacheUpdateIsolated = t => cacheUpdateContextual(n(c, r), t);
  const getCurrentCache = t => [ c, !!t, r ];
  return [ n ? cacheUpdateIsolated : cacheUpdateContextual, getCurrentCache ];
};

const t = Node.ELEMENT_NODE;

const {toString: n, hasOwnProperty: o} = Object.prototype;

const isUndefined = t => void 0 === t;

const isNull = t => null === t;

const type = t => isUndefined(t) || isNull(t) ? `${t}` : n.call(t).replace(/^\[object (.+)\]$/, "$1").toLowerCase();

const isNumber = t => "number" === typeof t;

const isString = t => "string" === typeof t;

const isBoolean = t => "boolean" === typeof t;

const isFunction = t => "function" === typeof t;

const isArray = t => Array.isArray(t);

const isObject = t => "object" === typeof t && !isArray(t) && !isNull(t);

const isArrayLike = t => {
  const n = !!t && t.length;
  const o = isNumber(n) && n > -1 && n % 1 == 0;
  return isArray(t) || !isFunction(t) && o ? n > 0 && isObject(t) ? n - 1 in t : true : false;
};

const isPlainObject = t => {
  if (!t || !isObject(t) || "object" !== type(t)) {
    return false;
  }
  let n;
  const s = "constructor";
  const e = t[s];
  const c = e && e.prototype;
  const r = o.call(t, s);
  const l = c && o.call(c, "isPrototypeOf");
  if (e && !r && !l) {
    return false;
  }
  for (n in t) {}
  return isUndefined(n) || o.call(t, n);
};

const isHTMLElement = n => {
  const o = HTMLElement;
  return n ? o ? n instanceof o : n.nodeType === t : false;
};

const isElement = n => {
  const o = Element;
  return n ? o ? n instanceof o : n.nodeType === t : false;
};

const indexOf = (t, n, o) => t.indexOf(n, o);

const push = (t, n, o) => {
  !o && !isString(n) && isArrayLike(n) ? Array.prototype.push.apply(t, n) : t.push(n);
  return t;
};

const from = t => {
  const n = Array.from;
  const o = [];
  if (n && t) {
    return n(t);
  }
  if (t instanceof Set) {
    t.forEach((t => {
      push(o, t);
    }));
  } else {
    each(t, (t => {
      push(o, t);
    }));
  }
  return o;
};

const isEmptyArray = t => !!t && 0 === t.length;

const runEachAndClear = (t, n, o) => {
  const runFn = t => t && t.apply(void 0, n || []);
  each(t, runFn);
  !o && (t.length = 0);
};

const hasOwnProperty = (t, n) => Object.prototype.hasOwnProperty.call(t, n);

const keys = t => t ? Object.keys(t) : [];

const assignDeep = (t, n, o, s, e, c, r) => {
  const l = [ n, o, s, e, c, r ];
  if (("object" !== typeof t || isNull(t)) && !isFunction(t)) {
    t = {};
  }
  each(l, (n => {
    each(keys(n), (o => {
      const s = n[o];
      if (t === s) {
        return true;
      }
      const e = isArray(s);
      if (s && (isPlainObject(s) || e)) {
        const n = t[o];
        let c = n;
        if (e && !isArray(n)) {
          c = [];
        } else if (!e && !isPlainObject(n)) {
          c = {};
        }
        t[o] = assignDeep(c, s);
      } else {
        t[o] = s;
      }
    }));
  }));
  return t;
};

const isEmptyObject = t => {
  for (const n in t) {
    return false;
  }
  return true;
};

const getSetProp = (t, n, o, s) => {
  if (isUndefined(s)) {
    return o ? o[t] : n;
  }
  o && (isString(s) || isNumber(s)) && (o[t] = s);
};

const attr = (t, n, o) => {
  if (isUndefined(o)) {
    return t ? t.getAttribute(n) : null;
  }
  t && t.setAttribute(n, o);
};

const attrClass = (t, n, o, s) => {
  if (o) {
    const e = attr(t, n) || "";
    const c = new Set(e.split(" "));
    c[s ? "add" : "delete"](o);
    attr(t, n, from(c).join(" ").trim());
  }
};

const hasAttrClass = (t, n, o) => {
  const s = attr(t, n) || "";
  const e = new Set(s.split(" "));
  return e.has(o);
};

const removeAttr = (t, n) => {
  t && t.removeAttribute(n);
};

const scrollLeft = (t, n) => getSetProp("scrollLeft", 0, t, n);

const scrollTop = (t, n) => getSetProp("scrollTop", 0, t, n);

const s = Element.prototype;

const find = (t, n) => {
  const o = [];
  const s = n ? isElement(n) ? n : null : document;
  return s ? push(o, s.querySelectorAll(t)) : o;
};

const findFirst = (t, n) => {
  const o = n ? isElement(n) ? n : null : document;
  return o ? o.querySelector(t) : null;
};

const is = (t, n) => {
  if (isElement(t)) {
    const o = s.matches || s.msMatchesSelector;
    return o.call(t, n);
  }
  return false;
};

const contents = t => t ? from(t.childNodes) : [];

const parent = t => t ? t.parentElement : null;

const closest = (t, n) => {
  if (isElement(t)) {
    const o = s.closest;
    if (o) {
      return o.call(t, n);
    }
    do {
      if (is(t, n)) {
        return t;
      }
      t = parent(t);
    } while (t);
  }
  return null;
};

const liesBetween = (t, n, o) => {
  const s = t && closest(t, n);
  const e = t && findFirst(o, s);
  const c = closest(e, n) === s;
  return s && e ? s === t || e === t || c && closest(closest(t, o), n) !== s : false;
};

const before = (t, n, o) => {
  if (o && t) {
    let s = n;
    let e;
    if (isArrayLike(o)) {
      e = document.createDocumentFragment();
      each(o, (t => {
        if (t === s) {
          s = t.previousSibling;
        }
        e.appendChild(t);
      }));
    } else {
      e = o;
    }
    if (n) {
      if (!s) {
        s = t.firstChild;
      } else if (s !== n) {
        s = s.nextSibling;
      }
    }
    t.insertBefore(e, s || null);
  }
};

const appendChildren = (t, n) => {
  before(t, null, n);
};

const insertBefore = (t, n) => {
  before(parent(t), t, n);
};

const insertAfter = (t, n) => {
  before(parent(t), t && t.nextSibling, n);
};

const removeElements = t => {
  if (isArrayLike(t)) {
    each(from(t), (t => removeElements(t)));
  } else if (t) {
    const n = parent(t);
    if (n) {
      n.removeChild(t);
    }
  }
};

const createDiv = t => {
  const n = document.createElement("div");
  if (t) {
    attr(n, "class", t);
  }
  return n;
};

const createDOM = t => {
  const n = createDiv();
  n.innerHTML = t.trim();
  return each(contents(n), (t => removeElements(t)));
};

const firstLetterToUpper = t => t.charAt(0).toUpperCase() + t.slice(1);

const getDummyStyle = () => createDiv().style;

const e = [ "-webkit-", "-moz-", "-o-", "-ms-" ];

const c = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ];

const r = {};

const l = {};

const cssProperty = t => {
  let n = l[t];
  if (hasOwnProperty(l, t)) {
    return n;
  }
  const o = firstLetterToUpper(t);
  const s = getDummyStyle();
  each(e, (e => {
    const c = e.replace(/-/g, "");
    const r = [ t, e + t, c + o, firstLetterToUpper(c) + o ];
    return !(n = r.find((t => void 0 !== s[t])));
  }));
  return l[t] = n || "";
};

const jsAPI = t => {
  let n = r[t] || window[t];
  if (hasOwnProperty(r, t)) {
    return n;
  }
  each(c, (o => {
    n = n || window[o + firstLetterToUpper(t)];
    return !n;
  }));
  r[t] = n;
  return n;
};

const i = jsAPI("MutationObserver");

const a = jsAPI("IntersectionObserver");

const u = jsAPI("ResizeObserver");

const d = jsAPI("cancelAnimationFrame");

const f = jsAPI("requestAnimationFrame");

const _ = window.setTimeout;

const h = window.clearTimeout;

const g = /[^\x20\t\r\n\f]+/g;

const classListAction = (t, n, o) => {
  const s = t && t.classList;
  let e;
  let c = 0;
  let r = false;
  if (s && n && isString(n)) {
    const t = n.match(g) || [];
    r = t.length > 0;
    while (e = t[c++]) {
      r = !!o(s, e) && r;
    }
  }
  return r;
};

const hasClass = (t, n) => classListAction(t, n, ((t, n) => t.contains(n)));

const removeClass = (t, n) => {
  classListAction(t, n, ((t, n) => t.remove(n)));
};

const addClass = (t, n) => {
  classListAction(t, n, ((t, n) => t.add(n)));
  return removeClass.bind(0, t, n);
};

const equal = (t, n, o, s) => {
  if (t && n) {
    let e = true;
    each(o, (o => {
      const c = s ? s(t[o]) : t[o];
      const r = s ? s(n[o]) : n[o];
      if (c !== r) {
        e = false;
      }
    }));
    return e;
  }
  return false;
};

const equalWH = (t, n) => equal(t, n, [ "w", "h" ]);

const equalXY = (t, n) => equal(t, n, [ "x", "y" ]);

const equalTRBL = (t, n) => equal(t, n, [ "t", "r", "b", "l" ]);

const equalBCRWH = (t, n, o) => equal(t, n, [ "width", "height" ], o && (t => Math.round(t)));

const noop = () => {};

const selfCancelTimeout = t => {
  let n;
  const o = t ? _ : f;
  const s = t ? h : d;
  return [ e => {
    s(n);
    n = o(e, isFunction(t) ? t() : t);
  }, () => s(n) ];
};

const debounce = (t, n) => {
  let o;
  let s;
  let e;
  let c = noop;
  const {v: r, p: l, m: i} = n || {};
  const a = function invokeFunctionToDebounce(n) {
    c();
    h(o);
    o = s = void 0;
    c = noop;
    t.apply(this, n);
  };
  const mergeParms = t => i && s ? i(s, t) : t;
  const flush = () => {
    if (c !== noop) {
      a(mergeParms(e) || e);
    }
  };
  const u = function debouncedFn() {
    const t = from(arguments);
    const n = isFunction(r) ? r() : r;
    const i = isNumber(n) && n >= 0;
    if (i) {
      const r = isFunction(l) ? l() : l;
      const i = isNumber(r) && r >= 0;
      const u = n > 0 ? _ : f;
      const g = n > 0 ? h : d;
      const v = mergeParms(t);
      const w = v || t;
      const p = a.bind(0, w);
      c();
      const b = u(p, n);
      c = () => g(b);
      if (i && !o) {
        o = _(flush, r);
      }
      s = e = w;
    } else {
      a(t);
    }
  };
  u.S = flush;
  return u;
};

const v = {
  opacity: 1,
  zindex: 1
};

const parseToZeroOrNumber = (t, n) => {
  const o = n ? parseFloat(t) : parseInt(t, 10);
  return o === o ? o : 0;
};

const adaptCSSVal = (t, n) => !v[t.toLowerCase()] && isNumber(n) ? `${n}px` : n;

const getCSSVal = (t, n, o) => null != n ? n[o] || n.getPropertyValue(o) : t.style[o];

const setCSSVal = (t, n, o) => {
  try {
    const {style: s} = t;
    if (!isUndefined(s[n])) {
      s[n] = adaptCSSVal(n, o);
    } else {
      s.setProperty(n, o);
    }
  } catch (s) {}
};

const directionIsRTL = t => "rtl" === style(t, "direction");

const topRightBottomLeft = (t, n, o) => {
  const s = n ? `${n}-` : "";
  const e = o ? `-${o}` : "";
  const c = `${s}top${e}`;
  const r = `${s}right${e}`;
  const l = `${s}bottom${e}`;
  const i = `${s}left${e}`;
  const a = style(t, [ c, r, l, i ]);
  return {
    t: parseToZeroOrNumber(a[c]),
    r: parseToZeroOrNumber(a[r]),
    b: parseToZeroOrNumber(a[l]),
    l: parseToZeroOrNumber(a[i])
  };
};

const {round: w} = Math;

const p = {
  w: 0,
  h: 0
};

const windowSize = () => ({
  w: window.innerWidth,
  h: window.innerHeight
});

const offsetSize = t => t ? {
  w: t.offsetWidth,
  h: t.offsetHeight
} : p;

const clientSize = t => t ? {
  w: t.clientWidth,
  h: t.clientHeight
} : p;

const scrollSize = t => t ? {
  w: t.scrollWidth,
  h: t.scrollHeight
} : p;

const fractionalSize = t => {
  const n = parseFloat(style(t, "height")) || 0;
  const o = parseFloat(style(t, "width")) || 0;
  return {
    w: o - w(o),
    h: n - w(n)
  };
};

const getBoundingClientRect = t => t.getBoundingClientRect();

let b;

const supportPassiveEvents = () => {
  if (isUndefined(b)) {
    b = false;
    try {
      window.addEventListener("test", null, Object.defineProperty({}, "passive", {
        get() {
          b = true;
        }
      }));
    } catch (t) {}
  }
  return b;
};

const splitEventNames = t => t.split(" ");

const off = (t, n, o, s) => {
  each(splitEventNames(n), (n => {
    t.removeEventListener(n, o, s);
  }));
};

const on = (t, n, o, s) => {
  var e;
  const c = supportPassiveEvents();
  const r = null != (e = c && s && s.$) ? e : c;
  const l = s && s.C || false;
  const i = s && s.O || false;
  const a = [];
  const u = c ? {
    passive: r,
    capture: l
  } : l;
  each(splitEventNames(n), (n => {
    const s = i ? e => {
      t.removeEventListener(n, s, l);
      o && o(e);
    } : o;
    push(a, off.bind(null, t, n, s, l));
    t.addEventListener(n, s, u);
  }));
  return runEachAndClear.bind(0, a);
};

const stopPropagation = t => t.stopPropagation();

const preventDefault = t => t.preventDefault();

const y = {
  x: 0,
  y: 0
};

const absoluteCoordinates = t => {
  const n = t ? getBoundingClientRect(t) : 0;
  return n ? {
    x: n.left + window.pageYOffset,
    y: n.top + window.pageXOffset
  } : y;
};

const manageListener = (t, n) => {
  each(isArray(n) ? n : [ n ], t);
};

const createEventListenerHub = t => {
  const n = new Map;
  const removeEvent = (t, o) => {
    if (t) {
      const s = n.get(t);
      manageListener((t => {
        if (s) {
          s[t ? "delete" : "clear"](t);
        }
      }), o);
    } else {
      n.forEach((t => {
        t.clear();
      }));
      n.clear();
    }
  };
  const addEvent = (t, o) => {
    const s = n.get(t) || new Set;
    n.set(t, s);
    manageListener((t => {
      t && s.add(t);
    }), o);
    return removeEvent.bind(0, t, o);
  };
  const triggerEvent = (t, o) => {
    const s = n.get(t);
    each(from(s), (t => {
      if (o && !isEmptyArray(o)) {
        t.apply(0, o);
      } else {
        t();
      }
    }));
  };
  const o = keys(t);
  each(o, (n => {
    addEvent(n, t[n]);
  }));
  return [ addEvent, removeEvent, triggerEvent ];
};

const opsStringify = t => JSON.stringify(t, ((t, n) => {
  if (isFunction(n)) {
    throw new Error;
  }
  return n;
}));

const m = {
  paddingAbsolute: false,
  showNativeOverlaidScrollbars: false,
  update: {
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

const getOptionsDiff = (t, n) => {
  const o = {};
  const s = keys(n).concat(keys(t));
  each(s, (s => {
    const e = t[s];
    const c = n[s];
    if (isObject(e) && isObject(c)) {
      assignDeep(o[s] = {}, getOptionsDiff(e, c));
    } else if (hasOwnProperty(n, s) && c !== e) {
      let t = true;
      if (isArray(e) || isArray(c)) {
        try {
          if (opsStringify(e) === opsStringify(c)) {
            t = false;
          }
        } catch (r) {}
      }
      if (t) {
        o[s] = c;
      }
    }
  }));
  return o;
};

const S = "os-environment";

const x = `${S}-flexbox-glue`;

const $ = `${x}-max`;

const C = "data-overlayscrollbars";

const O = `${C}-overflow-x`;

const E = `${C}-overflow-y`;

const A = "overflowVisible";

const T = "scrollbarHidden";

const z = "updating";

const I = "os-padding";

const L = "os-viewport";

const H = `${L}-arrange`;

const M = "os-content";

const P = `${L}-scrollbar-hidden`;

const D = `os-overflow-visible`;

const R = "os-size-observer";

const k = `${R}-appear`;

const B = `${R}-listener`;

const V = `${B}-scroll`;

const j = `${B}-item`;

const Y = `${j}-final`;

const q = "os-trinsic-observer";

const F = "os-scrollbar";

const G = `${F}-rtl`;

const N = `${F}-horizontal`;

const X = `${F}-vertical`;

const U = `${F}-track`;

const W = `${F}-handle`;

const J = `${F}-visible`;

const K = `${F}-cornerless`;

const Z = `${F}-transitionless`;

const Q = `${F}-interaction`;

const tt = `${F}-unusable`;

const nt = `${F}-auto-hidden`;

const ot = `${F}-wheel`;

const st = `${U}-interactive`;

const et = `${W}-interactive`;

const ct = {};

const getPlugins = () => ct;

const addPlugin = t => {
  each(isArray(t) ? t : [ t ], (t => {
    const n = keys(t)[0];
    ct[n] = t[n];
  }));
};

const rt = {
  boolean: "__TPL_boolean_TYPE__",
  number: "__TPL_number_TYPE__",
  string: "__TPL_string_TYPE__",
  array: "__TPL_array_TYPE__",
  object: "__TPL_object_TYPE__",
  function: "__TPL_function_TYPE__",
  null: "__TPL_null_TYPE__"
};

const lt = rt.number;

const it = rt.boolean;

const at = [ rt.array, rt.null ];

const ut = "hidden scroll visible visible-hidden";

const dt = "visible hidden auto";

const ft = "never scroll leavemove";

({
  paddingAbsolute: it,
  showNativeOverlaidScrollbars: it,
  update: {
    elementEvents: at,
    attributes: at,
    debounce: [ rt.number, rt.array, rt.null ],
    ignoreMutation: [ rt.function, rt.null ]
  },
  overflow: {
    x: ut,
    y: ut
  },
  scrollbars: {
    theme: [ rt.string, rt.null ],
    visibility: dt,
    autoHide: ft,
    autoHideDelay: lt,
    dragScroll: it,
    clickScroll: it,
    pointers: [ rt.array, rt.null ]
  }
});

const _t = "__osOptionsValidationPlugin";

const ht = 3333333;

const gt = "scroll";

const vt = "__osSizeObserverPlugin";

const wt = {
  [vt]: {
    A: (t, n, o) => {
      const s = createDOM(`<div class="${j}" dir="ltr"><div class="${j}"><div class="${Y}"></div></div><div class="${j}"><div class="${Y}" style="width: 200%; height: 200%"></div></div></div>`);
      appendChildren(t, s);
      addClass(t, V);
      const e = s[0];
      const c = e.lastChild;
      const r = e.firstChild;
      const l = null == r ? void 0 : r.firstChild;
      let i = offsetSize(e);
      let a = i;
      let u = false;
      let _;
      const reset = () => {
        scrollLeft(r, ht);
        scrollTop(r, ht);
        scrollLeft(c, ht);
        scrollTop(c, ht);
      };
      const onResized = t => {
        _ = 0;
        if (u) {
          i = a;
          n(true === t);
        }
      };
      const onScroll = t => {
        a = offsetSize(e);
        u = !t || !equalWH(a, i);
        if (t) {
          stopPropagation(t);
          if (u && !_) {
            d(_);
            _ = f(onResized);
          }
        } else {
          onResized(false === t);
        }
        reset();
      };
      const h = push([], [ on(r, gt, onScroll), on(c, gt, onScroll) ]);
      style(l, {
        width: ht,
        height: ht
      });
      f(reset);
      return [ o ? onScroll.bind(0, false) : reset, h ];
    }
  }
};

let pt = 0;

const {round: bt, abs: yt} = Math;

const getWindowDPR = () => {
  const t = window.screen.deviceXDPI || 0;
  const n = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || t / n;
};

const diffBiggerThanOne = (t, n) => {
  const o = yt(t);
  const s = yt(n);
  return !(o === s || o + 1 === s || o - 1 === s);
};

const mt = "__osScrollbarsHidingPlugin";

const St = {
  [mt]: {
    T: t => {
      const {I: n, L: o, H: s} = t;
      const e = !s && !n && (o.x || o.y);
      const c = e ? document.createElement("style") : false;
      if (c) {
        attr(c, "id", `${H}-${pt}`);
        pt++;
      }
      return c;
    },
    M: (t, n, o, s, e, c, r) => {
      const arrangeViewport = (n, c, r, l) => {
        if (t) {
          const {P: t} = e();
          const {D: i, R: a} = n;
          const {x: u, y: d} = a;
          const {x: f, y: _} = i;
          const h = l ? "paddingRight" : "paddingLeft";
          const g = t[h];
          const v = t.paddingTop;
          const w = c.w + r.w;
          const p = c.h + r.h;
          const b = {
            w: _ && d ? `${_ + w - g}px` : "",
            h: f && u ? `${f + p - v}px` : ""
          };
          if (s) {
            const {sheet: t} = s;
            if (t) {
              const {cssRules: n} = t;
              if (n) {
                if (!n.length) {
                  t.insertRule(`#${attr(s, "id")} + .${H}::before {}`, 0);
                }
                const o = n[0].style;
                o.width = b.w;
                o.height = b.h;
              }
            }
          } else {
            style(o, {
              "--os-vaw": b.w,
              "--os-vah": b.h
            });
          }
        }
        return t;
      };
      const undoViewportArrange = (s, l, i) => {
        if (t) {
          const a = i || c(s);
          const {P: u} = e();
          const {R: d} = a;
          const {x: f, y: _} = d;
          const h = {};
          const assignProps = t => each(t.split(" "), (t => {
            h[t] = u[t];
          }));
          if (f) {
            assignProps("marginBottom paddingTop paddingBottom");
          }
          if (_) {
            assignProps("marginLeft marginRight paddingLeft paddingRight");
          }
          const g = style(o, keys(h));
          removeClass(o, H);
          if (!n) {
            h.height = "";
          }
          style(o, h);
          return [ () => {
            r(a, l, t, g);
            style(o, g);
            addClass(o, H);
          }, a ];
        }
        return [ noop ];
      };
      return [ arrangeViewport, undoViewportArrange ];
    },
    k: () => {
      let t = {
        w: 0,
        h: 0
      };
      let n = 0;
      return (o, s, e) => {
        const c = windowSize();
        const r = {
          w: c.w - t.w,
          h: c.h - t.h
        };
        if (0 === r.w && 0 === r.h) {
          return;
        }
        const l = {
          w: yt(r.w),
          h: yt(r.h)
        };
        const i = {
          w: yt(bt(c.w / (t.w / 100))),
          h: yt(bt(c.h / (t.h / 100)))
        };
        const a = getWindowDPR();
        const u = l.w > 2 && l.h > 2;
        const d = !diffBiggerThanOne(i.w, i.h);
        const f = a !== n && a > 0;
        const _ = u && d && f;
        if (_) {
          const [t, n] = s();
          assignDeep(o.B, t);
          if (n) {
            e();
          }
        }
        t = c;
        n = a;
      };
    }
  }
};

let xt;

const getNativeScrollbarSize = (t, n, o, s) => {
  appendChildren(t, n);
  const e = clientSize(n);
  const c = offsetSize(n);
  const r = fractionalSize(o);
  s && removeElements(n);
  return {
    x: c.h - e.h + r.h,
    y: c.w - e.w + r.w
  };
};

const getNativeScrollbarsHiding = t => {
  let n = false;
  const o = addClass(t, P);
  try {
    n = "none" === style(t, cssProperty("scrollbar-width")) || "none" === window.getComputedStyle(t, "::-webkit-scrollbar").getPropertyValue("display");
  } catch (s) {}
  o();
  return n;
};

const getRtlScrollBehavior = (t, n) => {
  const o = "hidden";
  style(t, {
    overflowX: o,
    overflowY: o,
    direction: "rtl"
  });
  scrollLeft(t, 0);
  const s = absoluteCoordinates(t);
  const e = absoluteCoordinates(n);
  scrollLeft(t, -999);
  const c = absoluteCoordinates(n);
  return {
    i: s.x === e.x,
    n: e.x !== c.x
  };
};

const getFlexboxGlue = (t, n) => {
  const o = addClass(t, x);
  const s = getBoundingClientRect(t);
  const e = getBoundingClientRect(n);
  const c = equalBCRWH(e, s, true);
  const r = addClass(t, $);
  const l = getBoundingClientRect(t);
  const i = getBoundingClientRect(n);
  const a = equalBCRWH(i, l, true);
  o();
  r();
  return c && a;
};

const createEnvironment = () => {
  const {body: t} = document;
  const n = createDOM(`<div class="${S}"><div></div></div>`);
  const o = n[0];
  const s = o.firstChild;
  const [e, , c] = createEventListenerHub();
  const [r, l] = createCache({
    u: getNativeScrollbarSize(t, o, s),
    _: equalXY
  }, getNativeScrollbarSize.bind(0, t, o, s, true));
  const [i] = l();
  const a = getNativeScrollbarsHiding(o);
  const u = {
    x: 0 === i.x,
    y: 0 === i.y
  };
  const d = {
    elements: {
      host: null,
      padding: !a,
      viewport: t => a && t === t.ownerDocument.body && t,
      content: false
    },
    scrollbars: {
      slot: true
    },
    cancel: {
      nativeScrollbarsOverlaid: false,
      body: null
    }
  };
  const f = assignDeep({}, m);
  const _ = {
    B: i,
    L: u,
    I: a,
    H: "-1" === style(o, "zIndex"),
    V: getRtlScrollBehavior(o, s),
    j: getFlexboxGlue(o, s),
    Y: t => e("_", t),
    q: assignDeep.bind(0, {}, d),
    F(t) {
      assignDeep(d, t);
    },
    G: assignDeep.bind(0, {}, f),
    N(t) {
      assignDeep(f, t);
    },
    X: assignDeep({}, d),
    U: assignDeep({}, f)
  };
  removeAttr(o, "style");
  removeElements(o);
  if (!a && (!u.x || !u.y)) {
    let t;
    window.addEventListener("resize", (() => {
      const n = getPlugins()[mt];
      t = t || n && n.k();
      t && t(_, r, c.bind(0, "_"));
    }));
  }
  return _;
};

const getEnvironment = () => {
  if (!xt) {
    xt = createEnvironment();
  }
  return xt;
};

const resolveInitialization = (t, n) => isFunction(t) ? t.apply(0, n) : t;

const staticInitializationElement = (t, n, o, s) => {
  const e = isUndefined(s) ? o : s;
  const c = resolveInitialization(e, t);
  return c || n();
};

const dynamicInitializationElement = (t, n, o, s) => {
  const e = isUndefined(s) ? o : s;
  const c = resolveInitialization(e, t);
  return !!c && (isHTMLElement(c) ? c : n());
};

const cancelInitialization = (t, n) => {
  const {nativeScrollbarsOverlaid: o, body: s} = t || {};
  const {W: e} = n;
  const {q: c, L: r, I: l} = getEnvironment();
  const {nativeScrollbarsOverlaid: i, body: a} = c().cancel;
  const u = null != o ? o : i;
  const d = isUndefined(s) ? a : s;
  const f = (r.x || r.y) && u;
  const _ = e && (isNull(d) ? !l : d);
  return !!f || !!_;
};

const $t = new WeakMap;

const addInstance = (t, n) => {
  $t.set(t, n);
};

const removeInstance = t => {
  $t.delete(t);
};

const getInstance = t => $t.get(t);

const getPropByPath = (t, n) => t ? n.split(".").reduce(((t, n) => t && hasOwnProperty(t, n) ? t[n] : void 0), t) : void 0;

const createOptionCheck = (t, n, o) => s => [ getPropByPath(t, s), o || void 0 !== getPropByPath(n, s) ];

const createState = t => {
  let n = t;
  return [ () => n, t => {
    n = assignDeep({}, n, t);
  } ];
};

const Ct = "tabindex";

const Ot = createDiv.bind(0, "");

const unwrap = t => {
  appendChildren(parent(t), contents(t));
  removeElements(t);
};

const addDataAttrHost = (t, n) => {
  attr(t, C, n);
  return removeAttr.bind(0, t, C);
};

const createStructureSetupElements = t => {
  const n = getEnvironment();
  const {q: o, I: s} = n;
  const e = getPlugins()[mt];
  const c = e && e.T;
  const {elements: r} = o();
  const {host: l, viewport: i, padding: a, content: u} = r;
  const d = isHTMLElement(t);
  const f = d ? {} : t;
  const {elements: _} = f;
  const {host: h, padding: g, viewport: v, content: w} = _ || {};
  const p = d ? t : f.target;
  const b = is(p, "textarea");
  const y = p.ownerDocument;
  const m = p === y.body;
  const S = y.defaultView;
  const x = staticInitializationElement.bind(0, [ p ]);
  const $ = dynamicInitializationElement.bind(0, [ p ]);
  const A = x(Ot, i, v);
  const T = A === p;
  const z = T && m;
  const H = !T && S.top === S && y.activeElement === p;
  const D = {
    J: p,
    K: b ? x(Ot, l, h) : p,
    Z: A,
    tt: !T && $(Ot, a, g),
    nt: !T && $(Ot, u, w),
    ot: !T && !s && c && c(n),
    st: z ? y.documentElement : A,
    et: z ? y : A,
    ct: S,
    rt: y,
    lt: b,
    W: m,
    it: d,
    ut: T,
    dt: (t, n) => T ? hasAttrClass(A, C, n) : hasClass(A, t),
    ft: (t, n, o) => T ? attrClass(A, C, n, o) : (o ? addClass : removeClass)(A, t)
  };
  const R = keys(D).reduce(((t, n) => {
    const o = D[n];
    return push(t, o && !parent(o) ? o : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(R, t) > -1 : null;
  const {J: k, K: B, tt: V, Z: j, nt: Y, ot: q} = D;
  const F = [];
  const G = b && elementIsGenerated(B);
  let N = b ? k : contents([ Y, j, V, B, k ].find((t => false === elementIsGenerated(t))));
  const X = Y || j;
  const appendElements = () => {
    const t = addDataAttrHost(B, T ? "viewport" : "host");
    const n = addClass(V, I);
    const o = addClass(j, !T && L);
    const e = addClass(Y, M);
    const c = m ? addClass(parent(p), P) : noop;
    if (G) {
      insertAfter(k, B);
      push(F, (() => {
        insertAfter(B, k);
        removeElements(B);
      }));
    }
    appendChildren(X, N);
    appendChildren(B, V);
    appendChildren(V || B, !T && j);
    appendChildren(j, Y);
    push(F, (() => {
      c();
      t();
      removeAttr(j, O);
      removeAttr(j, E);
      if (elementIsGenerated(Y)) {
        unwrap(Y);
      }
      if (elementIsGenerated(j)) {
        unwrap(j);
      }
      if (elementIsGenerated(V)) {
        unwrap(V);
      }
      n();
      o();
      e();
    }));
    if (s && !T) {
      push(F, removeClass.bind(0, j, P));
    }
    if (q) {
      insertBefore(j, q);
      push(F, removeElements.bind(0, q));
    }
    if (H) {
      const t = attr(j, Ct);
      attr(j, Ct, "-1");
      j.focus();
      const n = on(y, "pointerdown keydown", (() => {
        t ? attr(j, Ct, t) : removeAttr(j, Ct);
        n();
      }));
    }
    N = 0;
  };
  return [ D, appendElements, runEachAndClear.bind(0, F) ];
};

const createTrinsicUpdateSegment = (t, n) => {
  const {nt: o} = t;
  const [s] = n;
  return t => {
    const {j: n} = getEnvironment();
    const {_t: e} = s();
    const {ht: c} = t;
    const r = (o || !n) && c;
    if (r) {
      style(o, {
        height: e ? "" : "100%"
      });
    }
    return {
      gt: r,
      vt: r
    };
  };
};

const createPaddingUpdateSegment = (t, n) => {
  const [o, s] = n;
  const {K: e, tt: c, Z: r, ut: l} = t;
  const [i, a] = createCache({
    _: equalTRBL,
    u: topRightBottomLeft()
  }, topRightBottomLeft.bind(0, e, "padding", ""));
  return (t, n, e) => {
    let [u, d] = a(e);
    const {I: f, j: _} = getEnvironment();
    const {wt: h} = o();
    const {gt: g, vt: v, bt: w} = t;
    const [p, b] = n("paddingAbsolute");
    const y = !_ && v;
    if (g || d || y) {
      [u, d] = i(e);
    }
    const m = !l && (b || w || d);
    if (m) {
      const t = !p || !c && !f;
      const n = u.r + u.l;
      const o = u.t + u.b;
      const e = {
        marginRight: t && !h ? -n : 0,
        marginBottom: t ? -o : 0,
        marginLeft: t && h ? -n : 0,
        top: t ? -u.t : 0,
        right: t ? h ? -u.r : "auto" : 0,
        left: t ? h ? "auto" : -u.l : 0,
        width: t ? `calc(100% + ${n}px)` : ""
      };
      const l = {
        paddingTop: t ? u.t : 0,
        paddingRight: t ? u.r : 0,
        paddingBottom: t ? u.b : 0,
        paddingLeft: t ? u.l : 0
      };
      style(c || r, e);
      style(r, l);
      s({
        tt: u,
        yt: !t,
        P: c ? l : assignDeep({}, e, l)
      });
    }
    return {
      St: m
    };
  };
};

const {max: Et} = Math;

const At = Et.bind(0, 0);

const Tt = "visible";

const zt = "hidden";

const It = 42;

const Lt = {
  _: equalWH,
  u: {
    w: 0,
    h: 0
  }
};

const Ht = {
  _: equalXY,
  u: {
    x: zt,
    y: zt
  }
};

const getOverflowAmount = (t, n) => {
  const o = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const s = {
    w: At(t.w - n.w),
    h: At(t.h - n.h)
  };
  return {
    w: s.w > o ? s.w : 0,
    h: s.h > o ? s.h : 0
  };
};

const conditionalClass = (t, n, o) => o ? addClass(t, n) : removeClass(t, n);

const overflowIsVisible = t => 0 === t.indexOf(Tt);

const createOverflowUpdateSegment = (t, n) => {
  const [o, s] = n;
  const {K: e, tt: c, Z: r, ot: l, ut: i, ft: a, W: u, ct: d} = t;
  const {B: f, j: _, I: h, L: g} = getEnvironment();
  const v = getPlugins()[mt];
  const w = !i && !h && (g.x || g.y);
  const p = u && i;
  const [b, y] = createCache(Lt, fractionalSize.bind(0, r));
  const [m, S] = createCache(Lt, scrollSize.bind(0, r));
  const [x, $] = createCache(Lt);
  const [z, I] = createCache(Lt);
  const [L] = createCache(Ht);
  const fixFlexboxGlue = (t, n) => {
    style(r, {
      height: ""
    });
    if (n) {
      const {yt: n, tt: s} = o();
      const {xt: c, D: l} = t;
      const i = fractionalSize(e);
      const a = clientSize(e);
      const u = "content-box" === style(r, "boxSizing");
      const d = n || u ? s.b + s.t : 0;
      const f = !(g.x && u);
      style(r, {
        height: a.h + i.h + (c.x && f ? l.x : 0) - d
      });
    }
  };
  const getViewportOverflowState = (t, n) => {
    const o = !h && !t ? It : 0;
    const getStatePerAxis = (t, s, e) => {
      const c = style(r, t);
      const l = n ? n[t] : c;
      const i = "scroll" === l;
      const a = s ? o : e;
      const u = i && !h ? a : 0;
      const d = s && !!o;
      return [ c, i, u, d ];
    };
    const [s, e, c, l] = getStatePerAxis("overflowX", g.x, f.x);
    const [i, a, u, d] = getStatePerAxis("overflowY", g.y, f.y);
    return {
      $t: {
        x: s,
        y: i
      },
      xt: {
        x: e,
        y: a
      },
      D: {
        x: c,
        y: u
      },
      R: {
        x: l,
        y: d
      }
    };
  };
  const setViewportOverflowState = (t, n, o, s) => {
    const setAxisOverflowStyle = (t, n) => {
      const o = overflowIsVisible(t);
      const s = n && o && t.replace(`${Tt}-`, "") || "";
      return [ n && !o ? t : "", overflowIsVisible(s) ? "hidden" : s ];
    };
    const [e, c] = setAxisOverflowStyle(o.x, n.x);
    const [r, l] = setAxisOverflowStyle(o.y, n.y);
    s.overflowX = c && r ? c : e;
    s.overflowY = l && e ? l : r;
    return getViewportOverflowState(t, s);
  };
  const hideNativeScrollbars = (t, n, s, e) => {
    const {D: c, R: r} = t;
    const {x: l, y: i} = r;
    const {x: a, y: u} = c;
    const {P: d} = o();
    const f = n ? "marginLeft" : "marginRight";
    const _ = n ? "paddingLeft" : "paddingRight";
    const h = d[f];
    const g = d.marginBottom;
    const v = d[_];
    const w = d.paddingBottom;
    e.width = `calc(100% + ${u + -1 * h}px)`;
    e[f] = -u + h;
    e.marginBottom = -a + g;
    if (s) {
      e[_] = v + (i ? u : 0);
      e.paddingBottom = w + (l ? a : 0);
    }
  };
  const [H, M] = v ? v.M(w, _, r, l, o, getViewportOverflowState, hideNativeScrollbars) : [ () => w, () => [ noop ] ];
  return (t, n, l) => {
    const {gt: u, Ct: f, vt: v, St: w, ht: R, bt: k} = t;
    const {_t: B, wt: V} = o();
    const [j, Y] = n("showNativeOverlaidScrollbars");
    const [q, F] = n("overflow");
    const G = j && g.x && g.y;
    const N = !i && !_ && (u || v || f || Y || R);
    const X = overflowIsVisible(q.x);
    const U = overflowIsVisible(q.y);
    const W = X || U;
    let J = y(l);
    let K = S(l);
    let Z = $(l);
    let Q = I(l);
    let tt;
    if (Y && h) {
      a(P, T, !G);
    }
    if (N) {
      tt = getViewportOverflowState(G);
      fixFlexboxGlue(tt, B);
    }
    if (u || w || v || k || Y) {
      if (W) {
        a(D, A, false);
      }
      const [t, n] = M(G, V, tt);
      const [o, s] = J = b(l);
      const [e, c] = K = m(l);
      const i = clientSize(r);
      let u = e;
      let f = i;
      t();
      if ((c || s || Y) && n && !G && H(n, e, o, V)) {
        f = clientSize(r);
        u = scrollSize(r);
      }
      const _ = {
        w: At(Et(e.w, u.w) + o.w),
        h: At(Et(e.h, u.h) + o.h)
      };
      const h = {
        w: At(p ? d.innerWidth : f.w + At(i.w - e.w) + o.w),
        h: At(p ? d.innerHeight : f.h + At(i.h - e.h) + o.h)
      };
      Q = z(h);
      Z = x(getOverflowAmount(_, h), l);
    }
    const [nt, ot] = Q;
    const [st, et] = Z;
    const [ct, rt] = K;
    const [lt, it] = J;
    const at = {
      x: st.w > 0,
      y: st.h > 0
    };
    const ut = X && U && (at.x || at.y) || X && at.x && !at.y || U && at.y && !at.x;
    if (w || k || it || rt || ot || et || F || Y || N) {
      const t = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: "",
        overflowY: "",
        overflowX: ""
      };
      const n = setViewportOverflowState(G, at, q, t);
      const o = H(n, ct, lt, V);
      if (!i) {
        hideNativeScrollbars(n, V, o, t);
      }
      if (N) {
        fixFlexboxGlue(n, B);
      }
      if (i) {
        attr(e, O, t.overflowX);
        attr(e, E, t.overflowY);
      } else {
        style(r, t);
      }
    }
    attrClass(e, C, A, ut);
    conditionalClass(c, D, ut);
    !i && conditionalClass(r, D, W);
    const [dt, ft] = L(getViewportOverflowState(G).$t);
    s({
      $t: dt,
      Ot: {
        x: nt.w,
        y: nt.h
      },
      Et: {
        x: st.w,
        y: st.h
      },
      At: at
    });
    return {
      Tt: ft,
      zt: ot,
      It: et
    };
  };
};

const prepareUpdateHints = (t, n, o) => {
  const s = {};
  const e = n || {};
  const c = keys(t).concat(keys(e));
  each(c, (n => {
    const c = t[n];
    const r = e[n];
    s[n] = !!(o || c || r);
  }));
  return s;
};

const createStructureSetupUpdate = (t, n) => {
  const {J: o, Z: s, ft: e, ut: c} = t;
  const {I: r, L: l, j: i} = getEnvironment();
  const a = !r && (l.x || l.y);
  const u = [ createTrinsicUpdateSegment(t, n), createPaddingUpdateSegment(t, n), createOverflowUpdateSegment(t, n) ];
  return (t, n, r) => {
    const l = prepareUpdateHints(assignDeep({
      gt: false,
      St: false,
      bt: false,
      ht: false,
      zt: false,
      It: false,
      Tt: false,
      Ct: false,
      vt: false
    }, n), {}, r);
    const d = a || !i;
    const f = d && scrollLeft(s);
    const _ = d && scrollTop(s);
    e("", z, true);
    let h = l;
    each(u, (n => {
      h = prepareUpdateHints(h, n(h, t, !!r) || {}, r);
    }));
    scrollLeft(s, f);
    scrollTop(s, _);
    e("", z);
    if (!c) {
      scrollLeft(o, 0);
      scrollTop(o, 0);
    }
    return h;
  };
};

const Mt = 3333333;

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, o) => {
  const {Lt: s = false, Ht: e = false} = o || {};
  const c = getPlugins()[vt];
  const {V: r} = getEnvironment();
  const l = createDOM(`<div class="${R}"><div class="${B}"></div></div>`);
  const i = l[0];
  const a = i.firstChild;
  const d = directionIsRTL.bind(0, t);
  const [f] = createCache({
    u: void 0,
    g: true,
    _: (t, n) => !(!t || !domRectHasDimensions(t) && domRectHasDimensions(n))
  });
  const onSizeChangedCallbackProxy = t => {
    const o = isArray(t) && t.length > 0 && isObject(t[0]);
    const e = !o && isBoolean(t[0]);
    let c = false;
    let l = false;
    let a = true;
    if (o) {
      const [n, , o] = f(t.pop().contentRect);
      const s = domRectHasDimensions(n);
      const e = domRectHasDimensions(o);
      c = !o || !s;
      l = !e && s;
      a = !c;
    } else if (e) {
      [, a] = t;
    } else {
      l = true === t;
    }
    if (s && a) {
      const n = e ? t[0] : directionIsRTL(i);
      scrollLeft(i, n ? r.n ? -Mt : r.i ? 0 : Mt : Mt);
      scrollTop(i, Mt);
    }
    if (!c) {
      n({
        gt: !e,
        Mt: e ? t : void 0,
        Ht: !!l
      });
    }
  };
  const _ = [];
  let h = e ? onSizeChangedCallbackProxy : false;
  return [ () => {
    runEachAndClear(_);
    removeElements(i);
  }, () => {
    if (u) {
      const t = new u(onSizeChangedCallbackProxy);
      t.observe(a);
      push(_, (() => {
        t.disconnect();
      }));
    } else if (c) {
      const [t, n] = c.A(a, onSizeChangedCallbackProxy, e);
      h = t;
      push(_, n);
    }
    if (s) {
      const [t] = createCache({
        u: !d()
      }, d);
      push(_, on(i, "scroll", (n => {
        const o = t();
        const [s, e] = o;
        if (e) {
          removeClass(a, "ltr rtl");
          if (s) {
            addClass(a, "rtl");
          } else {
            addClass(a, "ltr");
          }
          onSizeChangedCallbackProxy(o);
        }
        stopPropagation(n);
      })));
    }
    if (h) {
      addClass(i, k);
      push(_, on(i, "animationstart", h, {
        O: !!u
      }));
    }
    appendChildren(t, i);
  } ];
};

const isHeightIntrinsic = t => 0 === t.h || t.isIntersecting || t.intersectionRatio > 0;

const createTrinsicObserver = (t, n) => {
  let o;
  const s = createDiv(q);
  const e = [];
  const [c] = createCache({
    u: false
  });
  const triggerOnTrinsicChangedCallback = (t, o) => {
    if (t) {
      const s = c(isHeightIntrinsic(t));
      const [, e] = s;
      if (e) {
        !o && n(s);
        return [ s ];
      }
    }
  };
  const intersectionObserverCallback = (t, n) => {
    if (t && t.length > 0) {
      return triggerOnTrinsicChangedCallback(t.pop(), n);
    }
  };
  return [ () => {
    runEachAndClear(e);
    removeElements(s);
  }, () => {
    if (a) {
      o = new a((t => intersectionObserverCallback(t)), {
        root: t
      });
      o.observe(s);
      push(e, (() => {
        o.disconnect();
      }));
    } else {
      const onSizeChanged = () => {
        const t = offsetSize(s);
        triggerOnTrinsicChangedCallback(t);
      };
      const [t, n] = createSizeObserver(s, onSizeChanged);
      push(e, t);
      n();
      onSizeChanged();
    }
    appendChildren(t, s);
  }, () => {
    if (o) {
      return intersectionObserverCallback(o.takeRecords(), true);
    }
  } ];
};

const createEventContentChange = (t, n, o) => {
  let s;
  let e = false;
  const destroy = () => {
    e = true;
  };
  const updateElements = c => {
    if (o) {
      const r = o.reduce(((n, o) => {
        if (o) {
          const s = o[0];
          const e = o[1];
          const r = e && s && (c ? c(s) : find(s, t));
          if (r && r.length && e && isString(e)) {
            push(n, [ r, e.trim() ], true);
          }
        }
        return n;
      }), []);
      each(r, (t => each(t[0], (o => {
        const c = t[1];
        const r = s.get(o);
        if (r) {
          const t = r[0];
          const n = r[1];
          if (t === c) {
            n();
          }
        }
        const l = on(o, c, (t => {
          if (e) {
            l();
            s.delete(o);
          } else {
            n(t);
          }
        }));
        s.set(o, [ c, l ]);
      }))));
    }
  };
  if (o) {
    s = new WeakMap;
    updateElements();
  }
  return [ destroy, updateElements ];
};

const createDOMObserver = (t, n, o, s) => {
  let e = false;
  const {Pt: c, Dt: r, Rt: l, kt: a, Bt: u, Vt: d} = s || {};
  const f = debounce((() => {
    if (e) {
      o(true);
    }
  }), {
    v: 33,
    p: 99
  });
  const [_, h] = createEventContentChange(t, f, l);
  const g = c || [];
  const v = r || [];
  const w = g.concat(v);
  const observerCallback = (e, c) => {
    const r = u || noop;
    const l = d || noop;
    const i = [];
    const f = [];
    let _ = false;
    let g = false;
    let w = false;
    each(e, (o => {
      const {attributeName: e, target: c, type: u, oldValue: d, addedNodes: h} = o;
      const p = "attributes" === u;
      const b = "childList" === u;
      const y = t === c;
      const m = p && isString(e) ? attr(c, e) : 0;
      const S = 0 !== m && d !== m;
      const x = indexOf(v, e) > -1 && S;
      if (n && !y) {
        const n = !p;
        const i = p && x;
        const u = i && a && is(c, a);
        const _ = u ? !r(c, e, d, m) : n || i;
        const v = _ && !l(o, !!u, t, s);
        push(f, h);
        g = g || v;
        w = w || b;
      }
      if (!n && y && S && !r(c, e, d, m)) {
        push(i, e);
        _ = _ || x;
      }
    }));
    if (w && !isEmptyArray(f)) {
      h((t => f.reduce(((n, o) => {
        push(n, find(t, o));
        return is(o, t) ? push(n, o) : n;
      }), [])));
    }
    if (n) {
      !c && g && o(false);
      return [ false ];
    }
    if (!isEmptyArray(i) || _) {
      !c && o(i, _);
      return [ i, _ ];
    }
  };
  const p = new i((t => observerCallback(t)));
  p.observe(t, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: w,
    subtree: n,
    childList: n,
    characterData: n
  });
  e = true;
  return [ () => {
    if (e) {
      _();
      p.disconnect();
      e = false;
    }
  }, () => {
    if (e) {
      f.S();
      const t = p.takeRecords();
      return !isEmptyArray(t) && observerCallback(t, true);
    }
  } ];
};

const Pt = `[${C}]`;

const Dt = `.${L}`;

const Rt = [ "tabindex" ];

const kt = [ "wrap", "cols", "rows" ];

const Bt = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, o) => {
  let s;
  let e;
  let c;
  const [, r] = n;
  const {K: l, Z: i, nt: a, lt: d, ut: f, dt: _, ft: h} = t;
  const {j: g} = getEnvironment();
  const [v] = createCache({
    _: equalWH,
    u: {
      w: 0,
      h: 0
    }
  }, (() => {
    const t = _(D, A);
    const n = _(H, "");
    const o = n && scrollLeft(i);
    const s = n && scrollTop(i);
    h(D, A);
    h(H, "");
    h("", z, true);
    const e = scrollSize(a);
    const c = scrollSize(i);
    const r = fractionalSize(i);
    h(D, A, t);
    h(H, "", n);
    h("", z);
    scrollLeft(i, o);
    scrollTop(i, s);
    return {
      w: c.w + e.w + r.w,
      h: c.h + e.h + r.h
    };
  }));
  const w = d ? kt : Bt.concat(kt);
  const p = debounce(o, {
    v: () => s,
    p: () => e,
    m(t, n) {
      const [o] = t;
      const [s] = n;
      return [ keys(o).concat(keys(s)).reduce(((t, n) => {
        t[n] = o[n] || s[n];
        return t;
      }), {}) ];
    }
  });
  const updateViewportAttrsFromHost = t => {
    each(t || Rt, (t => {
      if (indexOf(Rt, t) > -1) {
        const n = attr(l, t);
        if (isString(n)) {
          attr(i, t, n);
        } else {
          removeAttr(i, t);
        }
      }
    }));
  };
  const onTrinsicChanged = (t, n) => {
    const [s, e] = t;
    const c = {
      ht: e
    };
    r({
      _t: s
    });
    !n && o(c);
    return c;
  };
  const onSizeChanged = ({gt: t, Mt: n, Ht: s}) => {
    const e = !t || s ? o : p;
    let c = false;
    if (n) {
      const [t, o] = n;
      c = o;
      r({
        wt: t
      });
    }
    e({
      gt: t,
      bt: c
    });
  };
  const onContentMutation = (t, n) => {
    const [, s] = v();
    const e = {
      vt: s
    };
    const c = t ? o : p;
    if (s) {
      !n && c(e);
    }
    return e;
  };
  const onHostMutation = (t, n, o) => {
    const s = {
      Ct: n
    };
    if (n) {
      !o && p(s);
    } else if (!f) {
      updateViewportAttrsFromHost(t);
    }
    return s;
  };
  const [b, y, m] = a || !g ? createTrinsicObserver(l, onTrinsicChanged) : [ noop, noop, noop ];
  const [S, x] = !f ? createSizeObserver(l, onSizeChanged, {
    Ht: true,
    Lt: true
  }) : [ noop, noop ];
  const [$, C] = createDOMObserver(l, false, onHostMutation, {
    Dt: Bt,
    Pt: Bt.concat(Rt)
  });
  const O = f && u && new u(onSizeChanged.bind(0, {
    gt: true
  }));
  O && O.observe(l);
  updateViewportAttrsFromHost();
  return [ () => {
    b();
    S();
    c && c[0]();
    O && O.disconnect();
    $();
  }, () => {
    x();
    y();
  }, () => {
    const t = {};
    const n = C();
    const o = m();
    const s = c && c[1]();
    if (n) {
      assignDeep(t, onHostMutation.apply(0, push(n, true)));
    }
    if (o) {
      assignDeep(t, onTrinsicChanged.apply(0, push(o, true)));
    }
    if (s) {
      assignDeep(t, onContentMutation.apply(0, push(s, true)));
    }
    return t;
  }, t => {
    const [n] = t("update.ignoreMutation");
    const [o, r] = t("update.attributes");
    const [l, u] = t("update.elementEvents");
    const [d, _] = t("update.debounce");
    const h = u || r;
    const ignoreMutationFromOptions = t => isFunction(n) && n(t);
    if (h) {
      if (c) {
        c[1]();
        c[0]();
      }
      c = createDOMObserver(a || i, true, onContentMutation, {
        Dt: w.concat(o || []),
        Pt: w.concat(o || []),
        Rt: l,
        kt: Pt,
        Vt: (t, n) => {
          const {target: o, attributeName: s} = t;
          const e = !n && s && !f ? liesBetween(o, Pt, Dt) : false;
          return e || !!closest(o, `.${F}`) || !!ignoreMutationFromOptions(t);
        }
      });
    }
    if (_) {
      p.S();
      if (isArray(d)) {
        const t = d[0];
        const n = d[1];
        s = isNumber(t) && t;
        e = isNumber(n) && n;
      } else if (isNumber(d)) {
        s = d;
        e = false;
      } else {
        s = false;
        e = false;
      }
    }
  } ];
};

const Vt = {
  x: 0,
  y: 0
};

const jt = {
  tt: {
    t: 0,
    r: 0,
    b: 0,
    l: 0
  },
  yt: false,
  P: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  Ot: Vt,
  Et: Vt,
  $t: {
    x: "hidden",
    y: "hidden"
  },
  At: {
    x: false,
    y: false
  },
  _t: false,
  wt: false
};

const createStructureSetup = (t, n) => {
  const o = createOptionCheck(n, {});
  const s = createState(jt);
  const [e, c, r] = createEventListenerHub();
  const [l] = s;
  const [i, a, u] = createStructureSetupElements(t);
  const d = createStructureSetupUpdate(i, s);
  const triggerUpdateEvent = (t, n, o) => {
    const s = keys(t).some((n => t[n]));
    if (s || !isEmptyObject(n) || o) {
      r("u", [ t, n, o ]);
    }
  };
  const [f, _, h, g] = createStructureSetupObservers(i, s, (t => {
    triggerUpdateEvent(d(o, t), {}, false);
  }));
  const v = l.bind(0);
  v.jt = t => {
    e("u", t);
  };
  v.Yt = () => {
    const {J: t, Z: n} = i;
    const o = scrollLeft(t);
    const s = scrollTop(t);
    _();
    a();
    scrollLeft(n, o);
    scrollTop(n, s);
  };
  v.qt = i;
  return [ (t, o) => {
    const s = createOptionCheck(n, t, o);
    g(s);
    triggerUpdateEvent(d(s, h(), o), t, !!o);
  }, v, () => {
    c();
    f();
    u();
  } ];
};

const {round: Yt} = Math;

const getClientOffset = t => ({
  x: t.clientX,
  y: t.clientY
});

const getScale = t => {
  const {width: n, height: o} = getBoundingClientRect(t);
  const {w: s, h: e} = offsetSize(t);
  return {
    x: Yt(n) / s || 1,
    y: Yt(o) / e || 1
  };
};

const continuePointerDown = (t, n, o) => {
  const s = n.scrollbars;
  const {button: e, isPrimary: c, pointerType: r} = t;
  const {pointers: l} = s;
  return 0 === e && c && s[o] && (l || []).includes(r);
};

const createRootClickStopPropagationEvents = (t, n) => on(t, "mousedown", on.bind(0, n, "click", stopPropagation, {
  O: true,
  C: true
}), {
  C: true
});

const createDragScrollingEvents = (t, n, o, s, e, c) => {
  const {V: r} = getEnvironment();
  const {Ft: l, Gt: i, Nt: a} = o;
  const u = `scroll${c ? "Left" : "Top"}`;
  const d = `${c ? "x" : "y"}`;
  const f = `${c ? "w" : "h"}`;
  const createOnPointerMoveHandler = (t, n, o) => _ => {
    const {Et: h} = e();
    const g = (getClientOffset(_)[d] - n) * o;
    const v = offsetSize(i)[f] - offsetSize(l)[f];
    const w = g / v;
    const p = w * h[d];
    const b = directionIsRTL(a);
    const y = b && c ? r.n || r.i ? 1 : -1 : 1;
    s[u] = t + p * y;
  };
  return on(l, "pointerdown", (o => {
    if (continuePointerDown(o, t, "dragScroll")) {
      const t = on(n, "selectstart", (t => preventDefault(t)), {
        $: false
      });
      const e = on(l, "pointermove", createOnPointerMoveHandler(s[u] || 0, getClientOffset(o)[d], 1 / getScale(s)[d]));
      on(l, "pointerup", (n => {
        t();
        e();
        l.releasePointerCapture(n.pointerId);
      }), {
        O: true
      });
      l.setPointerCapture(o.pointerId);
    }
  }));
};

const createScrollbarsSetupEvents = (t, n) => (o, s, e, c, r, l) => {
  const {Nt: i} = o;
  const [a, u] = selfCancelTimeout(500);
  const d = !!r.scrollBy;
  let f = true;
  return runEachAndClear.bind(0, [ on(i, "pointerenter", (() => {
    s(Q, true);
  })), on(i, "pointerleave pointercancel", (() => {
    s(Q);
  })), on(i, "wheel", (t => {
    const {deltaX: n, deltaY: o, deltaMode: e} = t;
    if (d && f && 0 === e && parent(i) === c) {
      r.scrollBy({
        left: n,
        top: o,
        behavior: "smooth"
      });
    }
    f = false;
    s(ot, true);
    a((() => {
      f = true;
      s(ot);
    }));
    preventDefault(t);
  }), {
    $: false,
    C: true
  }), createRootClickStopPropagationEvents(i, e), createDragScrollingEvents(t, e, o, r, n, l), u ]);
};

const {min: qt, max: Ft, abs: Gt, round: Nt} = Math;

const getScrollbarHandleLengthRatio = (t, n, o, s) => {
  if (s) {
    const t = o ? "x" : "y";
    const {Et: n, Ot: e} = s;
    const c = e[t];
    const r = n[t];
    return Ft(0, qt(1, c / (c + r)));
  }
  const e = o ? "w" : "h";
  const c = offsetSize(t)[e];
  const r = offsetSize(n)[e];
  return Ft(0, qt(1, c / r));
};

const getScrollbarHandleOffsetRatio = (t, n, o, s, e, c) => {
  const {V: r} = getEnvironment();
  const l = c ? "x" : "y";
  const i = c ? "Left" : "Top";
  const {Et: a} = s;
  const u = Nt(a[l]);
  const d = Gt(o[`scroll${i}`]);
  const f = c && e;
  const _ = r.i ? d : u - d;
  const h = f ? _ : d;
  const g = qt(1, h / u);
  const v = getScrollbarHandleLengthRatio(t, n, c);
  return 1 / v * (1 - v) * g;
};

const createScrollbarsSetupElements = (t, n, o) => {
  const {q: s} = getEnvironment();
  const {scrollbars: e} = s();
  const {slot: c} = e;
  const {rt: r, J: l, K: i, Z: a, it: u, st: d} = n;
  const {scrollbars: f} = u ? {} : t;
  const {slot: h} = f || {};
  const g = dynamicInitializationElement([ l, i, a ], (() => i), c, h);
  const scrollbarStructureAddRemoveClass = (t, n, o) => {
    const s = o ? addClass : removeClass;
    each(t, (t => {
      s(t.Nt, n);
    }));
  };
  const scrollbarsHandleStyle = (t, n) => {
    each(t, (t => {
      const [o, s] = n(t);
      style(o, s);
    }));
  };
  const scrollbarStructureRefreshHandleLength = (t, n, o) => {
    scrollbarsHandleStyle(t, (t => {
      const {Ft: s, Gt: e} = t;
      return [ s, {
        [o ? "width" : "height"]: `${(100 * getScrollbarHandleLengthRatio(s, e, o, n)).toFixed(3)}%`
      } ];
    }));
  };
  const scrollbarStructureRefreshHandleOffset = (t, n, o) => {
    const s = o ? "X" : "Y";
    scrollbarsHandleStyle(t, (t => {
      const {Ft: e, Gt: c, Nt: r} = t;
      const l = getScrollbarHandleOffsetRatio(e, c, d, n, directionIsRTL(r), o);
      const i = l === l;
      return [ e, {
        transform: i ? `translate${s}(${(100 * l).toFixed(3)}%)` : ""
      } ];
    }));
  };
  const v = [];
  const w = [];
  const p = [];
  const scrollbarsAddRemoveClass = (t, n, o) => {
    const s = isBoolean(o);
    const e = s ? o : true;
    const c = s ? !o : true;
    e && scrollbarStructureAddRemoveClass(w, t, n);
    c && scrollbarStructureAddRemoveClass(p, t, n);
  };
  const refreshScrollbarsHandleLength = t => {
    scrollbarStructureRefreshHandleLength(w, t, true);
    scrollbarStructureRefreshHandleLength(p, t);
  };
  const refreshScrollbarsHandleOffset = t => {
    scrollbarStructureRefreshHandleOffset(w, t, true);
    scrollbarStructureRefreshHandleOffset(p, t);
  };
  const generateScrollbarDOM = t => {
    const n = t ? N : X;
    const s = t ? w : p;
    const e = isEmptyArray(s) ? Z : "";
    const c = createDiv(`${F} ${n} ${e}`);
    const l = createDiv(U);
    const a = createDiv(W);
    const u = {
      Nt: c,
      Gt: l,
      Ft: a
    };
    appendChildren(c, l);
    appendChildren(l, a);
    push(s, u);
    push(v, [ removeElements.bind(0, c), o(u, scrollbarsAddRemoveClass, r, i, d, t) ]);
    return u;
  };
  const b = generateScrollbarDOM.bind(0, true);
  const y = generateScrollbarDOM.bind(0, false);
  const appendElements = () => {
    appendChildren(g, w[0].Nt);
    appendChildren(g, p[0].Nt);
    _((() => {
      scrollbarsAddRemoveClass(Z);
    }), 300);
  };
  b();
  y();
  return [ {
    Xt: refreshScrollbarsHandleLength,
    Ut: refreshScrollbarsHandleOffset,
    Wt: scrollbarsAddRemoveClass,
    Jt: {
      Kt: w,
      Zt: b,
      Qt: scrollbarsHandleStyle.bind(0, w)
    },
    tn: {
      Kt: p,
      Zt: y,
      Qt: scrollbarsHandleStyle.bind(0, p)
    }
  }, appendElements, runEachAndClear.bind(0, v) ];
};

const createScrollbarsSetup = (t, n, o) => {
  let s;
  let e;
  let c;
  let r;
  let l;
  let i = 0;
  const a = createState({});
  const [u] = a;
  const [d, f] = selfCancelTimeout();
  const [_, h] = selfCancelTimeout();
  const [g, v] = selfCancelTimeout(100);
  const [w, p] = selfCancelTimeout(100);
  const [b, y] = selfCancelTimeout((() => i));
  const [m, S, x] = createScrollbarsSetupElements(t, o.qt, createScrollbarsSetupEvents(n, o));
  const {K: $, Z: C, st: O, et: E, ut: A, W: T} = o.qt;
  const {Jt: z, tn: I, Wt: L, Xt: H, Ut: M} = m;
  const {Qt: P} = z;
  const {Qt: D} = I;
  const styleScrollbarPosition = t => {
    const {Nt: n} = t;
    const o = A && !T && parent(n) === C && n;
    return [ o, {
      transform: o ? `translate(${scrollLeft(O)}px, ${scrollTop(O)}px)` : ""
    } ];
  };
  const manageScrollbarsAutoHide = (t, n) => {
    y();
    if (t) {
      L(nt);
    } else {
      const hide = () => L(nt, true);
      if (i > 0 && !n) {
        b(hide);
      } else {
        hide();
      }
    }
  };
  const onHostMouseEnter = () => {
    r = e;
    r && manageScrollbarsAutoHide(true);
  };
  const R = [ v, y, p, h, f, x, on($, "pointerover", onHostMouseEnter, {
    O: true
  }), on($, "pointerenter", onHostMouseEnter), on($, "pointerleave", (() => {
    r = false;
    e && manageScrollbarsAutoHide(false);
  })), on($, "pointermove", (() => {
    s && d((() => {
      v();
      manageScrollbarsAutoHide(true);
      w((() => {
        s && manageScrollbarsAutoHide(false);
      }));
    }));
  })), on(E, "scroll", (() => {
    _((() => {
      M(o());
      c && manageScrollbarsAutoHide(true);
      g((() => {
        c && !r && manageScrollbarsAutoHide(false);
      }));
    }));
    A && P(styleScrollbarPosition);
    A && D(styleScrollbarPosition);
  })) ];
  const k = u.bind(0);
  k.qt = m;
  k.Yt = S;
  return [ (t, r, a) => {
    const {zt: u, It: d, Tt: f, bt: _} = a;
    const h = createOptionCheck(n, t, r);
    const g = o();
    const {Et: v, $t: w, wt: p} = g;
    const [b, y] = h("scrollbars.theme");
    const [m, S] = h("scrollbars.visibility");
    const [x, $] = h("scrollbars.autoHide");
    const [C] = h("scrollbars.autoHideDelay");
    const [O, E] = h("scrollbars.dragScroll");
    const [A, z] = h("scrollbars.clickScroll");
    const I = u || d || _ || r;
    const P = f || S || r;
    const setScrollbarVisibility = (t, n) => {
      const o = "visible" === m || "auto" === m && "scroll" === t;
      L(J, o, n);
      return o;
    };
    i = C;
    if (y) {
      L(l);
      L(b, true);
      l = b;
    }
    if ($) {
      s = "move" === x;
      e = "leave" === x;
      c = "never" !== x;
      manageScrollbarsAutoHide(!c, true);
    }
    if (E) {
      L(et, O);
    }
    if (z) {
      L(st, A);
    }
    if (P) {
      const t = setScrollbarVisibility(w.x, true);
      const n = setScrollbarVisibility(w.y, false);
      const o = t && n;
      L(K, !o);
    }
    if (I) {
      H(g);
      M(g);
      L(tt, !v.x, true);
      L(tt, !v.y, false);
      L(G, p && !T);
    }
  }, k, runEachAndClear.bind(0, R) ];
};

const OverlayScrollbars = (t, n, o) => {
  const {G: s, Y: e} = getEnvironment();
  const c = getPlugins();
  const r = isHTMLElement(t);
  const l = r ? t : t.target;
  const i = getInstance(l);
  if (n && !i) {
    let i = false;
    const a = c[_t];
    const validateOptions = t => {
      const n = t || {};
      const o = a && a.A;
      return o ? o(n, true) : n;
    };
    const u = assignDeep({}, s(), validateOptions(n));
    const [d, f, _] = createEventListenerHub(o);
    const [h, g, v] = createStructureSetup(t, u);
    const [w, p, b] = createScrollbarsSetup(t, u, g);
    const update = (t, n) => {
      h(t, !!n);
    };
    const y = e(update.bind(0, {}, true));
    const destroy = t => {
      removeInstance(l);
      y();
      b();
      v();
      i = true;
      _("destroyed", [ m, !!t ]);
      f();
    };
    const m = {
      options(t) {
        if (t) {
          const n = getOptionsDiff(u, validateOptions(t));
          if (!isEmptyObject(n)) {
            assignDeep(u, n);
            update(n);
          }
        }
        return assignDeep({}, u);
      },
      on: d,
      off: (t, n) => {
        t && n && f(t, n);
      },
      state() {
        const {Ot: t, Et: n, $t: o, At: s, tt: e, yt: c, wt: r} = g();
        return assignDeep({}, {
          overflowEdge: t,
          overflowAmount: n,
          overflowStyle: o,
          hasOverflow: s,
          padding: e,
          paddingAbsolute: c,
          directionRTL: r,
          destroyed: i
        });
      },
      elements() {
        const {J: t, K: n, tt: o, Z: s, nt: e, st: c, et: r} = g.qt;
        const {Jt: l, tn: i} = p.qt;
        const translateScrollbarStructure = t => {
          const {Ft: n, Gt: o, Nt: s} = t;
          return {
            scrollbar: s,
            track: o,
            handle: n
          };
        };
        const translateScrollbarsSetupElement = t => {
          const {Kt: n, Zt: o} = t;
          const s = translateScrollbarStructure(n[0]);
          return assignDeep({}, s, {
            clone: () => {
              const t = translateScrollbarStructure(o());
              w({}, true, {});
              return t;
            }
          });
        };
        return assignDeep({}, {
          target: t,
          host: n,
          padding: o || s,
          viewport: s,
          content: e || s,
          scrollOffsetElement: c,
          scrollEventElement: r,
          scrollbarHorizontal: translateScrollbarsSetupElement(l),
          scrollbarVertical: translateScrollbarsSetupElement(i)
        });
      },
      update(t) {
        update({}, t);
        return m;
      },
      destroy: destroy.bind(0)
    };
    g.jt(((t, n, o) => {
      w(n, o, t);
    }));
    each(keys(c), (t => {
      const n = c[t];
      if (isFunction(n)) {
        n(OverlayScrollbars, m);
      }
    }));
    if (cancelInitialization(!r && t.cancel, g.qt)) {
      destroy(true);
      return m;
    }
    g.Yt();
    p.Yt();
    addInstance(l, m);
    _("initialized", [ m ]);
    g.jt(((t, n, o) => {
      const {gt: s, bt: e, ht: c, zt: r, It: l, Tt: i, vt: a, Ct: u} = t;
      _("updated", [ m, {
        updateHints: {
          sizeChanged: s,
          directionChanged: e,
          heightIntrinsicChanged: c,
          overflowEdgeChanged: r,
          overflowAmountChanged: l,
          overflowStyleChanged: i,
          contentMutation: a,
          hostMutation: u
        },
        changedOptions: n,
        force: o
      } ]);
    }));
    return m.update(true);
  }
  return i;
};

OverlayScrollbars.plugin = addPlugin;

OverlayScrollbars.valid = t => {
  const n = t && t.elements;
  const o = isFunction(n) && n();
  return isPlainObject(o) && !!getInstance(o.target);
};

OverlayScrollbars.env = () => {
  const {B: t, L: n, I: o, V: s, j: e, H: c, X: r, U: l, q: i, F: a, G: u, N: d} = getEnvironment();
  return assignDeep({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: n,
    scrollbarsHiding: o,
    rtlScrollBehavior: s,
    flexboxGlue: e,
    cssCustomProperties: c,
    staticDefaultInitialization: r,
    staticDefaultOptions: l,
    getDefaultInitialization: i,
    setDefaultInitialization: a,
    getDefaultOptions: u,
    setDefaultOptions: d
  });
};

exports.OverlayScrollbars = OverlayScrollbars;

exports.scrollbarsHidingPlugin = St;

exports.sizeObserverPlugin = wt;
//# sourceMappingURL=overlayscrollbars.cjs.js.map
