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
    const i = t;
    const l = n || (s ? !s(o, i) : o !== i);
    if (l || e) {
      c = i;
      r = o;
    }
    return [ c, l, r ];
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
  const i = c && o.call(c, "isPrototypeOf");
  if (e && !r && !i) {
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
  const i = [ n, o, s, e, c, r ];
  if (("object" !== typeof t || isNull(t)) && !isFunction(t)) {
    t = {};
  }
  each(i, (n => {
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

const i = {};

const cssProperty = t => {
  let n = i[t];
  if (hasOwnProperty(i, t)) {
    return n;
  }
  const o = firstLetterToUpper(t);
  const s = getDummyStyle();
  each(e, (e => {
    const c = e.replace(/-/g, "");
    const r = [ t, e + t, c + o, firstLetterToUpper(c) + o ];
    return !(n = r.find((t => void 0 !== s[t])));
  }));
  return i[t] = n || "";
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

const l = jsAPI("MutationObserver");

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

const debounce = (t, n) => {
  let o;
  let s;
  let e;
  let c = noop;
  const {v: r, p: i, m: l} = n || {};
  const a = function invokeFunctionToDebounce(n) {
    c();
    h(o);
    o = s = void 0;
    c = noop;
    t.apply(this, n);
  };
  const mergeParms = t => l && s ? l(s, t) : t;
  const flush = () => {
    if (c !== noop) {
      a(mergeParms(e) || e);
    }
  };
  const u = function debouncedFn() {
    const t = from(arguments);
    const n = isFunction(r) ? r() : r;
    const l = isNumber(n) && n >= 0;
    if (l) {
      const r = isFunction(i) ? i() : i;
      const l = isNumber(r) && r >= 0;
      const u = n > 0 ? _ : f;
      const g = n > 0 ? h : d;
      const v = mergeParms(t);
      const w = v || t;
      const p = a.bind(0, w);
      c();
      const b = u(p, n);
      c = () => g(b);
      if (l && !o) {
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
  const i = `${s}bottom${e}`;
  const l = `${s}left${e}`;
  const a = style(t, [ c, r, i, l ]);
  return {
    t: parseToZeroOrNumber(a[c]),
    r: parseToZeroOrNumber(a[r]),
    b: parseToZeroOrNumber(a[i]),
    l: parseToZeroOrNumber(a[l])
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
  const i = s && s.C || false;
  const l = s && s.O || false;
  const a = [];
  const u = c ? {
    passive: r,
    capture: i
  } : i;
  each(splitEventNames(n), (n => {
    const s = l ? e => {
      t.removeEventListener(n, s, i);
      o && o(e);
    } : o;
    push(a, off.bind(null, t, n, s, i));
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

const T = "overflowVisible";

const A = "scrollbarHidden";

const z = "updating";

const I = "os-padding";

const L = "os-viewport";

const H = `${L}-arrange`;

const P = "os-content";

const D = `${L}-scrollbar-hidden`;

const M = `os-overflow-visible`;

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

const U = `${F}-vertical`;

const W = `${F}-track`;

const X = `${F}-handle`;

const J = `${F}-visible`;

const K = `${F}-cornerless`;

const Z = `${F}-transitionless`;

const Q = `${F}-interaction`;

const tt = `${F}-unusable`;

const nt = `${F}-auto-hidden`;

const ot = `${W}-interactive`;

const st = `${X}-interactive`;

const et = {};

const getPlugins = () => et;

const addPlugin = t => {
  each(isArray(t) ? t : [ t ], (t => {
    const n = keys(t)[0];
    et[n] = t[n];
  }));
};

const ct = {
  boolean: "__TPL_boolean_TYPE__",
  number: "__TPL_number_TYPE__",
  string: "__TPL_string_TYPE__",
  array: "__TPL_array_TYPE__",
  object: "__TPL_object_TYPE__",
  function: "__TPL_function_TYPE__",
  null: "__TPL_null_TYPE__"
};

const rt = ct.number;

const it = ct.boolean;

const lt = [ ct.array, ct.null ];

const at = "hidden scroll visible visible-hidden";

const ut = "visible hidden auto";

const dt = "never scroll leavemove";

({
  paddingAbsolute: it,
  showNativeOverlaidScrollbars: it,
  updating: {
    elementEvents: lt,
    attributes: lt,
    debounce: [ ct.number, ct.array, ct.null ],
    ignoreMutation: [ ct.function, ct.null ]
  },
  overflow: {
    x: at,
    y: at
  },
  scrollbars: {
    theme: [ ct.string, ct.null ],
    visibility: ut,
    autoHide: dt,
    autoHideDelay: rt,
    dragScroll: it,
    clickScroll: it,
    pointers: [ ct.array, ct.null ]
  }
});

const ft = "__osOptionsValidationPlugin";

const _t = 3333333;

const ht = "scroll";

const gt = "__osSizeObserverPlugin";

const vt = {
  [gt]: {
    T: (t, n, o) => {
      const s = createDOM(`<div class="${j}" dir="ltr"><div class="${j}"><div class="${Y}"></div></div><div class="${j}"><div class="${Y}" style="width: 200%; height: 200%"></div></div></div>`);
      appendChildren(t, s);
      addClass(t, V);
      const e = s[0];
      const c = e.lastChild;
      const r = e.firstChild;
      const i = null == r ? void 0 : r.firstChild;
      let l = offsetSize(e);
      let a = l;
      let u = false;
      let _;
      const reset = () => {
        scrollLeft(r, _t);
        scrollTop(r, _t);
        scrollLeft(c, _t);
        scrollTop(c, _t);
      };
      const onResized = t => {
        _ = 0;
        if (u) {
          l = a;
          n(true === t);
        }
      };
      const onScroll = t => {
        a = offsetSize(e);
        u = !t || !equalWH(a, l);
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
      const h = push([], [ on(r, ht, onScroll), on(c, ht, onScroll) ]);
      style(i, {
        width: _t,
        height: _t
      });
      f(reset);
      return [ o ? onScroll.bind(0, false) : reset, h ];
    }
  }
};

let wt = 0;

const {round: pt, abs: bt} = Math;

const getWindowDPR = () => {
  const t = window.screen.deviceXDPI || 0;
  const n = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || t / n;
};

const diffBiggerThanOne = (t, n) => {
  const o = bt(t);
  const s = bt(n);
  return !(o === s || o + 1 === s || o - 1 === s);
};

const yt = "__osScrollbarsHidingPlugin";

const mt = {
  [yt]: {
    A: t => {
      const {I: n, L: o, H: s} = t;
      const e = !s && !n && (o.x || o.y);
      const c = e ? document.createElement("style") : false;
      if (c) {
        attr(c, "id", `${H}-${wt}`);
        wt++;
      }
      return c;
    },
    P: (t, n, o, s, e, c, r) => {
      const arrangeViewport = (n, c, r, i) => {
        if (t) {
          const {D: t} = e();
          const {M: l, R: a} = n;
          const {x: u, y: d} = a;
          const {x: f, y: _} = l;
          const h = i ? "paddingRight" : "paddingLeft";
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
      const undoViewportArrange = (s, i, l) => {
        if (t) {
          const a = l || c(s);
          const {D: u} = e();
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
            r(a, i, t, g);
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
        const i = {
          w: bt(r.w),
          h: bt(r.h)
        };
        const l = {
          w: bt(pt(c.w / (t.w / 100))),
          h: bt(pt(c.h / (t.h / 100)))
        };
        const a = getWindowDPR();
        const u = i.w > 2 && i.h > 2;
        const d = !diffBiggerThanOne(l.w, l.h);
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

let St;

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
  const o = addClass(t, D);
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
  const i = getBoundingClientRect(t);
  const l = getBoundingClientRect(n);
  const a = equalBCRWH(l, i, true);
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
  const [r, i] = createCache({
    u: getNativeScrollbarSize(t, o, s),
    _: equalXY
  }, getNativeScrollbarSize.bind(0, t, o, s, true));
  const [l] = i();
  const a = getNativeScrollbarsHiding(o);
  const u = {
    x: 0 === l.x,
    y: 0 === l.y
  };
  const d = {
    host: null,
    padding: !a,
    viewport: t => a && t === t.ownerDocument.body && t,
    content: false,
    scrollbarsSlot: true,
    cancel: {
      nativeScrollbarsOverlaid: true,
      body: null
    }
  };
  const f = assignDeep({}, m);
  const _ = {
    B: l,
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
    U: assignDeep({}, d),
    W: assignDeep({}, f)
  };
  removeAttr(o, "style");
  removeElements(o);
  if (!a && (!u.x || !u.y)) {
    let t;
    window.addEventListener("resize", (() => {
      const n = getPlugins()[yt];
      t = t || n && n.k();
      t && t(_, r, c.bind(0, "_"));
    }));
  }
  return _;
};

const getEnvironment = () => {
  if (!St) {
    St = createEnvironment();
  }
  return St;
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
  const {X: e, J: c} = n;
  const {q: r, L: i} = getEnvironment();
  const {nativeScrollbarsOverlaid: l, body: a} = r().cancel;
  const u = null != o ? o : l;
  const d = isUndefined(s) ? a : s;
  const f = (i.x || i.y) && u;
  const _ = e && (isNull(d) ? !c : d);
  return !!f || !!_;
};

const xt = new WeakMap;

const addInstance = (t, n) => {
  xt.set(t, n);
};

const removeInstance = t => {
  xt.delete(t);
};

const getInstance = t => xt.get(t);

const getPropByPath = (t, n) => t ? n.split(".").reduce(((t, n) => t && hasOwnProperty(t, n) ? t[n] : void 0), t) : void 0;

const createOptionCheck = (t, n, o) => s => [ getPropByPath(t, s), o || void 0 !== getPropByPath(n, s) ];

const createState = t => {
  let n = t;
  return [ () => n, t => {
    n = assignDeep({}, n, t);
  } ];
};

const $t = "tabindex";

const Ct = createDiv.bind(0, "");

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
  const e = getPlugins()[yt];
  const c = e && e.A;
  const {host: r, viewport: i, padding: l, content: a} = o();
  const u = isHTMLElement(t);
  const d = u ? {} : t;
  const {host: f, padding: _, viewport: h, content: g} = d;
  const v = u ? t : d.target;
  const w = is(v, "textarea");
  const p = v.ownerDocument;
  const b = v === p.body;
  const y = p.defaultView;
  const m = staticInitializationElement.bind(0, [ v ]);
  const S = dynamicInitializationElement.bind(0, [ v ]);
  const x = m(Ct, i, h);
  const $ = x === v;
  const T = $ && b;
  const A = !$ && y.top === y && p.activeElement === v;
  const z = {
    K: v,
    Z: w ? m(Ct, r, f) : v,
    tt: x,
    nt: !$ && S(Ct, l, _),
    ot: !$ && S(Ct, a, g),
    st: !$ && !s && c && c(n),
    et: T ? p.documentElement : x,
    ct: T ? p : x,
    rt: y,
    it: p,
    lt: w,
    X: b,
    ut: u,
    J: $,
    dt: (t, n) => $ ? hasAttrClass(x, C, n) : hasClass(x, t),
    ft: (t, n, o) => $ ? attrClass(x, C, n, o) : (o ? addClass : removeClass)(x, t)
  };
  const H = keys(z).reduce(((t, n) => {
    const o = z[n];
    return push(t, o && !parent(o) ? o : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(H, t) > -1 : null;
  const {K: M, Z: R, nt: k, tt: B, ot: V, st: j} = z;
  const Y = [];
  const q = w && elementIsGenerated(R);
  let F = w ? M : contents([ V, B, k, R, M ].find((t => false === elementIsGenerated(t))));
  const G = V || B;
  const appendElements = () => {
    const t = addDataAttrHost(R, $ ? "viewport" : "host");
    const n = addClass(k, I);
    const o = addClass(B, !$ && L);
    const e = addClass(V, P);
    const c = T ? addClass(parent(v), D) : noop;
    if (q) {
      insertAfter(M, R);
      push(Y, (() => {
        insertAfter(R, M);
        removeElements(R);
      }));
    }
    appendChildren(G, F);
    appendChildren(R, k);
    appendChildren(k || R, !$ && B);
    appendChildren(B, V);
    push(Y, (() => {
      c();
      t();
      removeAttr(B, O);
      removeAttr(B, E);
      if (elementIsGenerated(V)) {
        unwrap(V);
      }
      if (elementIsGenerated(B)) {
        unwrap(B);
      }
      if (elementIsGenerated(k)) {
        unwrap(k);
      }
      n();
      o();
      e();
    }));
    if (s && !$) {
      push(Y, removeClass.bind(0, B, D));
    }
    if (j) {
      insertBefore(B, j);
      push(Y, removeElements.bind(0, j));
    }
    if (A) {
      const t = attr(B, $t);
      attr(B, $t, "-1");
      B.focus();
      const n = on(p, "pointerdown keydown", (() => {
        t ? attr(B, $t, t) : removeAttr(B, $t);
        n();
      }));
    }
    F = 0;
  };
  return [ z, appendElements, runEachAndClear.bind(0, Y) ];
};

const createTrinsicUpdateSegment = (t, n) => {
  const {ot: o} = t;
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
  const {Z: e, nt: c, tt: r, J: i} = t;
  const [l, a] = createCache({
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
      [u, d] = l(e);
    }
    const m = !i && (b || w || d);
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
      const i = {
        paddingTop: t ? u.t : 0,
        paddingRight: t ? u.r : 0,
        paddingBottom: t ? u.b : 0,
        paddingLeft: t ? u.l : 0
      };
      style(c || r, e);
      style(r, i);
      s({
        nt: u,
        yt: !t,
        D: c ? i : assignDeep({}, e, i)
      });
    }
    return {
      St: m
    };
  };
};

const {max: Ot} = Math;

const Et = Ot.bind(0, 0);

const Tt = "visible";

const At = "hidden";

const zt = 42;

const It = {
  _: equalWH,
  u: {
    w: 0,
    h: 0
  }
};

const Lt = {
  _: equalXY,
  u: {
    x: At,
    y: At
  }
};

const getOverflowAmount = (t, n) => {
  const o = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const s = {
    w: Et(t.w - n.w),
    h: Et(t.h - n.h)
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
  const {Z: e, nt: c, tt: r, st: i, J: l, ft: a, X: u, rt: d} = t;
  const {B: f, j: _, I: h, L: g} = getEnvironment();
  const v = getPlugins()[yt];
  const w = !l && !h && (g.x || g.y);
  const p = u && l;
  const [b, y] = createCache(It, fractionalSize.bind(0, r));
  const [m, S] = createCache(It, scrollSize.bind(0, r));
  const [x, $] = createCache(It);
  const [z, I] = createCache(It);
  const [L] = createCache(Lt);
  const fixFlexboxGlue = (t, n) => {
    style(r, {
      height: ""
    });
    if (n) {
      const {yt: n, nt: s} = o();
      const {xt: c, M: i} = t;
      const l = fractionalSize(e);
      const a = clientSize(e);
      const u = "content-box" === style(r, "boxSizing");
      const d = n || u ? s.b + s.t : 0;
      const f = !(g.x && u);
      style(r, {
        height: a.h + l.h + (c.x && f ? i.x : 0) - d
      });
    }
  };
  const getViewportOverflowState = (t, n) => {
    const o = !h && !t ? zt : 0;
    const getStatePerAxis = (t, s, e) => {
      const c = style(r, t);
      const i = n ? n[t] : c;
      const l = "scroll" === i;
      const a = s ? o : e;
      const u = l && !h ? a : 0;
      const d = s && !!o;
      return [ c, l, u, d ];
    };
    const [s, e, c, i] = getStatePerAxis("overflowX", g.x, f.x);
    const [l, a, u, d] = getStatePerAxis("overflowY", g.y, f.y);
    return {
      $t: {
        x: s,
        y: l
      },
      xt: {
        x: e,
        y: a
      },
      M: {
        x: c,
        y: u
      },
      R: {
        x: i,
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
    const [r, i] = setAxisOverflowStyle(o.y, n.y);
    s.overflowX = c && r ? c : e;
    s.overflowY = i && e ? i : r;
    return getViewportOverflowState(t, s);
  };
  const hideNativeScrollbars = (t, n, s, e) => {
    const {M: c, R: r} = t;
    const {x: i, y: l} = r;
    const {x: a, y: u} = c;
    const {D: d} = o();
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
      e[_] = v + (l ? u : 0);
      e.paddingBottom = w + (i ? a : 0);
    }
  };
  const [H, P] = v ? v.P(w, _, r, i, o, getViewportOverflowState, hideNativeScrollbars) : [ () => w, () => [ noop ] ];
  return (t, n, i) => {
    const {gt: u, Ct: f, vt: v, St: w, ht: R, bt: k} = t;
    const {_t: B, wt: V} = o();
    const [j, Y] = n("showNativeOverlaidScrollbars");
    const [q, F] = n("overflow");
    const G = j && g.x && g.y;
    const N = !l && !_ && (u || v || f || Y || R);
    const U = overflowIsVisible(q.x);
    const W = overflowIsVisible(q.y);
    const X = U || W;
    let J = y(i);
    let K = S(i);
    let Z = $(i);
    let Q = I(i);
    let tt;
    if (Y && h) {
      a(D, A, !G);
    }
    if (N) {
      tt = getViewportOverflowState(G);
      fixFlexboxGlue(tt, B);
    }
    if (u || w || v || k || Y) {
      if (X) {
        a(M, T, false);
      }
      const [t, n] = P(G, V, tt);
      const [o, s] = J = b(i);
      const [e, c] = K = m(i);
      const l = clientSize(r);
      let u = e;
      let f = l;
      t();
      if ((c || s || Y) && n && !G && H(n, e, o, V)) {
        f = clientSize(r);
        u = scrollSize(r);
      }
      const _ = {
        w: Et(Ot(e.w, u.w) + o.w),
        h: Et(Ot(e.h, u.h) + o.h)
      };
      const h = {
        w: Et(p ? d.innerWidth : f.w + Et(l.w - e.w) + o.w),
        h: Et(p ? d.innerHeight : f.h + Et(l.h - e.h) + o.h)
      };
      Q = z(h);
      Z = x(getOverflowAmount(_, h), i);
    }
    const [nt, ot] = Q;
    const [st, et] = Z;
    const [ct, rt] = K;
    const [it, lt] = J;
    const at = {
      x: st.w > 0,
      y: st.h > 0
    };
    const ut = U && W && (at.x || at.y) || U && at.x && !at.y || W && at.y && !at.x;
    if (w || k || lt || rt || ot || et || F || Y || N) {
      const t = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: "",
        overflowY: "",
        overflowX: ""
      };
      const n = setViewportOverflowState(G, at, q, t);
      const o = H(n, ct, it, V);
      if (!l) {
        hideNativeScrollbars(n, V, o, t);
      }
      if (N) {
        fixFlexboxGlue(n, B);
      }
      if (l) {
        attr(e, O, t.overflowX);
        attr(e, E, t.overflowY);
      } else {
        style(r, t);
      }
    }
    attrClass(e, C, T, ut);
    conditionalClass(c, M, ut);
    !l && conditionalClass(r, M, X);
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
      Tt: at
    });
    return {
      At: ft,
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
  const {K: o, tt: s, ft: e, J: c} = t;
  const {I: r, L: i, j: l} = getEnvironment();
  const a = !r && (i.x || i.y);
  const u = [ createTrinsicUpdateSegment(t, n), createPaddingUpdateSegment(t, n), createOverflowUpdateSegment(t, n) ];
  return (t, n, r) => {
    const i = prepareUpdateHints(assignDeep({
      gt: false,
      St: false,
      bt: false,
      ht: false,
      zt: false,
      It: false,
      At: false,
      Ct: false,
      vt: false
    }, n), {}, r);
    const d = a || !l;
    const f = d && scrollLeft(s);
    const _ = d && scrollTop(s);
    e("", z, true);
    let h = i;
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

const Ht = 3333333;

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, o) => {
  const {Lt: s = false, Ht: e = false} = o || {};
  const c = getPlugins()[gt];
  const {V: r} = getEnvironment();
  const i = createDOM(`<div class="${R}"><div class="${B}"></div></div>`);
  const l = i[0];
  const a = l.firstChild;
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
    let i = false;
    let a = true;
    if (o) {
      const [n, , o] = f(t.pop().contentRect);
      const s = domRectHasDimensions(n);
      const e = domRectHasDimensions(o);
      c = !o || !s;
      i = !e && s;
      a = !c;
    } else if (e) {
      [, a] = t;
    } else {
      i = true === t;
    }
    if (s && a) {
      const n = e ? t[0] : directionIsRTL(l);
      scrollLeft(l, n ? r.n ? -Ht : r.i ? 0 : Ht : Ht);
      scrollTop(l, Ht);
    }
    if (!c) {
      n({
        gt: !e,
        Pt: e ? t : void 0,
        Ht: !!i
      });
    }
  };
  const _ = [];
  let h = e ? onSizeChangedCallbackProxy : false;
  return [ () => {
    runEachAndClear(_);
    removeElements(l);
  }, () => {
    if (u) {
      const t = new u(onSizeChangedCallbackProxy);
      t.observe(a);
      push(_, (() => {
        t.disconnect();
      }));
    } else if (c) {
      const [t, n] = c.T(a, onSizeChangedCallbackProxy, e);
      h = t;
      push(_, n);
    }
    if (s) {
      const [t] = createCache({
        u: !d()
      }, d);
      push(_, on(l, "scroll", (n => {
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
      addClass(l, k);
      push(_, on(l, "animationstart", h, {
        O: !!u
      }));
    }
    appendChildren(t, l);
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
        const i = on(o, c, (t => {
          if (e) {
            i();
            s.delete(o);
          } else {
            n(t);
          }
        }));
        s.set(o, [ c, i ]);
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
  const {Dt: c, Mt: r, Rt: i, kt: a, Bt: u, Vt: d} = s || {};
  const f = debounce((() => {
    if (e) {
      o(true);
    }
  }), {
    v: 33,
    p: 99
  });
  const [_, h] = createEventContentChange(t, f, i);
  const g = c || [];
  const v = r || [];
  const w = g.concat(v);
  const observerCallback = (e, c) => {
    const r = u || noop;
    const i = d || noop;
    const l = [];
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
        const l = p && x;
        const u = l && a && is(c, a);
        const _ = u ? !r(c, e, d, m) : n || l;
        const v = _ && !i(o, !!u, t, s);
        push(f, h);
        g = g || v;
        w = w || b;
      }
      if (!n && y && S && !r(c, e, d, m)) {
        push(l, e);
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
    if (!isEmptyArray(l) || _) {
      !c && o(l, _);
      return [ l, _ ];
    }
  };
  const p = new l((t => observerCallback(t)));
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

const Mt = [ "tabindex" ];

const Rt = [ "wrap", "cols", "rows" ];

const kt = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, o) => {
  let s;
  let e;
  let c;
  const [, r] = n;
  const {Z: i, tt: l, ot: a, lt: d, J: f, dt: _, ft: h} = t;
  const {j: g} = getEnvironment();
  const [v] = createCache({
    _: equalWH,
    u: {
      w: 0,
      h: 0
    }
  }, (() => {
    const t = _(M, T);
    const n = _(H, "");
    const o = n && scrollLeft(l);
    const s = n && scrollTop(l);
    h(M, T);
    h(H, "");
    h("", z, true);
    const e = scrollSize(a);
    const c = scrollSize(l);
    const r = fractionalSize(l);
    h(M, T, t);
    h(H, "", n);
    h("", z);
    scrollLeft(l, o);
    scrollTop(l, s);
    return {
      w: c.w + e.w + r.w,
      h: c.h + e.h + r.h
    };
  }));
  const w = d ? Rt : kt.concat(Rt);
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
    each(t || Mt, (t => {
      if (indexOf(Mt, t) > -1) {
        const n = attr(i, t);
        if (isString(n)) {
          attr(l, t, n);
        } else {
          removeAttr(l, t);
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
  const onSizeChanged = ({gt: t, Pt: n, Ht: s}) => {
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
  const [b, y, m] = a || !g ? createTrinsicObserver(i, onTrinsicChanged) : [ noop, noop, noop ];
  const [S, x] = !f ? createSizeObserver(i, onSizeChanged, {
    Ht: true,
    Lt: true
  }) : [ noop, noop ];
  const [$, C] = createDOMObserver(i, false, onHostMutation, {
    Mt: kt,
    Dt: kt.concat(Mt)
  });
  const O = f && u && new u(onSizeChanged.bind(0, {
    gt: true
  }));
  O && O.observe(i);
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
    const [n] = t("updating.ignoreMutation");
    const [o, r] = t("updating.attributes");
    const [i, u] = t("updating.elementEvents");
    const [d, _] = t("updating.debounce");
    const h = u || r;
    const ignoreMutationFromOptions = t => isFunction(n) && n(t);
    if (h) {
      if (c) {
        c[1]();
        c[0]();
      }
      c = createDOMObserver(a || l, true, onContentMutation, {
        Mt: w.concat(o || []),
        Dt: w.concat(o || []),
        Rt: i,
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
        s = isNumber(t) ? t : false;
        e = isNumber(n) ? n : false;
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

const Bt = {
  x: 0,
  y: 0
};

const Vt = {
  nt: {
    t: 0,
    r: 0,
    b: 0,
    l: 0
  },
  yt: false,
  D: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  Ot: Bt,
  Et: Bt,
  $t: {
    x: "hidden",
    y: "hidden"
  },
  Tt: {
    x: false,
    y: false
  },
  _t: false,
  wt: false
};

const createStructureSetup = (t, n) => {
  const o = createOptionCheck(n, {});
  const s = createState(Vt);
  const [e, c, r] = createEventListenerHub();
  const [i] = s;
  const [l, a, u] = createStructureSetupElements(t);
  const d = createStructureSetupUpdate(l, s);
  const triggerUpdateEvent = (t, n, o) => {
    const s = keys(t).some((n => t[n]));
    if (s || !isEmptyObject(n) || o) {
      r("u", [ t, n, o ]);
    }
  };
  const [f, _, h, g] = createStructureSetupObservers(l, s, (t => {
    triggerUpdateEvent(d(o, t), {}, false);
  }));
  const v = i.bind(0);
  v.jt = t => {
    e("u", t);
  };
  v.Yt = () => {
    const {K: t, tt: n} = l;
    const o = scrollLeft(t);
    const s = scrollTop(t);
    _();
    a();
    scrollLeft(n, o);
    scrollTop(n, s);
  };
  v.qt = l;
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

const {round: jt} = Math;

const getClientOffset = t => ({
  x: t.clientX,
  y: t.clientY
});

const getScale = t => {
  const {width: n, height: o} = getBoundingClientRect(t);
  const {w: s, h: e} = offsetSize(t);
  return {
    x: jt(n) / s || 1,
    y: jt(o) / e || 1
  };
};

const continuePointerDown = (t, n, o) => {
  const s = n.scrollbars;
  const {button: e, isPrimary: c, pointerType: r} = t;
  const {pointers: i} = s;
  return 0 === e && c && s[o] && (i || []).includes(r);
};

const createRootClickStopPropagationEvents = (t, n) => on(t, "mousedown", on.bind(0, n, "click", stopPropagation, {
  O: true,
  C: true
}), {
  C: true
});

const createDragScrollingEvents = (t, n, o, s, e, c) => {
  const {V: r} = getEnvironment();
  const {Ft: i, Gt: l, Nt: a} = o;
  const u = `scroll${c ? "Left" : "Top"}`;
  const d = `${c ? "x" : "y"}`;
  const f = `${c ? "w" : "h"}`;
  const createOnPointerMoveHandler = (t, n, o) => _ => {
    const {Et: h} = e();
    const g = (getClientOffset(_)[d] - n) * o;
    const v = offsetSize(l)[f] - offsetSize(i)[f];
    const w = g / v;
    const p = w * h[d];
    const b = directionIsRTL(a);
    const y = b && c ? r.n || r.i ? 1 : -1 : 1;
    s[u] = t + p * y;
  };
  return on(i, "pointerdown", (o => {
    if (continuePointerDown(o, t, "dragScroll")) {
      const t = on(n, "selectstart", (t => preventDefault(t)), {
        $: false
      });
      const e = on(i, "pointermove", createOnPointerMoveHandler(s[u] || 0, getClientOffset(o)[d], 1 / getScale(s)[d]));
      on(i, "pointerup", (n => {
        t();
        e();
        i.releasePointerCapture(n.pointerId);
      }), {
        O: true
      });
      i.setPointerCapture(o.pointerId);
    }
  }));
};

const createScrollbarsSetupEvents = (t, n) => (o, s, e, c, r) => {
  const {Nt: i} = o;
  return runEachAndClear.bind(0, [ on(i, "pointerenter", (() => {
    s(Q, true);
  })), on(i, "pointerleave pointercancel", (() => {
    s(Q);
  })), createRootClickStopPropagationEvents(i, e), createDragScrollingEvents(t, e, o, c, n, r) ]);
};

const {min: Yt, max: qt, abs: Ft, round: Gt} = Math;

const getScrollbarHandleLengthRatio = (t, n, o, s) => {
  if (s) {
    const t = o ? "x" : "y";
    const {Et: n, Ot: e} = s;
    const c = e[t];
    const r = n[t];
    return qt(0, Yt(1, c / (c + r)));
  }
  const e = o ? "w" : "h";
  const c = offsetSize(t)[e];
  const r = offsetSize(n)[e];
  return qt(0, Yt(1, c / r));
};

const getScrollbarHandleOffsetRatio = (t, n, o, s, e, c) => {
  const {V: r} = getEnvironment();
  const i = c ? "x" : "y";
  const l = c ? "Left" : "Top";
  const {Et: a} = s;
  const u = Gt(a[i]);
  const d = Ft(o[`scroll${l}`]);
  const f = c && e;
  const _ = r.i ? d : u - d;
  const h = f ? _ : d;
  const g = Yt(1, h / u);
  const v = getScrollbarHandleLengthRatio(t, n, c);
  return 1 / v * (1 - v) * g;
};

const createScrollbarsSetupElements = (t, n, o) => {
  const {q: s} = getEnvironment();
  const {scrollbarsSlot: e} = s();
  const {it: c, K: r, Z: i, tt: l, ut: a, et: u} = n;
  const {scrollbarsSlot: d} = a ? {} : t;
  const f = dynamicInitializationElement([ r, i, l ], (() => i), e, d);
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
      const i = getScrollbarHandleOffsetRatio(e, c, u, n, directionIsRTL(r), o);
      const l = i === i;
      return [ e, {
        transform: l ? `translate${s}(${(100 * i).toFixed(3)}%)` : ""
      } ];
    }));
  };
  const h = [];
  const g = [];
  const v = [];
  const scrollbarsAddRemoveClass = (t, n, o) => {
    const s = isBoolean(o);
    const e = s ? o : true;
    const c = s ? !o : true;
    e && scrollbarStructureAddRemoveClass(g, t, n);
    c && scrollbarStructureAddRemoveClass(v, t, n);
  };
  const refreshScrollbarsHandleLength = t => {
    scrollbarStructureRefreshHandleLength(g, t, true);
    scrollbarStructureRefreshHandleLength(v, t);
  };
  const refreshScrollbarsHandleOffset = t => {
    scrollbarStructureRefreshHandleOffset(g, t, true);
    scrollbarStructureRefreshHandleOffset(v, t);
  };
  const generateScrollbarDOM = t => {
    const n = t ? N : U;
    const s = t ? g : v;
    const e = isEmptyArray(s) ? Z : "";
    const r = createDiv(`${F} ${n} ${e}`);
    const i = createDiv(W);
    const l = createDiv(X);
    const a = {
      Nt: r,
      Gt: i,
      Ft: l
    };
    appendChildren(r, i);
    appendChildren(i, l);
    push(s, a);
    push(h, [ removeElements.bind(0, r), o(a, scrollbarsAddRemoveClass, c, u, t) ]);
    return a;
  };
  const w = generateScrollbarDOM.bind(0, true);
  const p = generateScrollbarDOM.bind(0, false);
  const appendElements = () => {
    appendChildren(f, g[0].Nt);
    appendChildren(f, v[0].Nt);
    _((() => {
      scrollbarsAddRemoveClass(Z);
    }), 300);
  };
  w();
  p();
  return [ {
    Ut: refreshScrollbarsHandleLength,
    Wt: refreshScrollbarsHandleOffset,
    Xt: scrollbarsAddRemoveClass,
    Jt: {
      Kt: g,
      Zt: w,
      Qt: scrollbarsHandleStyle.bind(0, g)
    },
    tn: {
      Kt: v,
      Zt: p,
      Qt: scrollbarsHandleStyle.bind(0, v)
    }
  }, appendElements, runEachAndClear.bind(0, h) ];
};

const createSelfCancelTimeout = t => {
  let n;
  const o = t ? _ : f;
  const s = t ? h : d;
  return [ e => {
    s(n);
    n = o(e, isFunction(t) ? t() : t);
  }, () => s(n) ];
};

const createScrollbarsSetup = (t, n, o) => {
  let s;
  let e;
  let c;
  let r;
  let i;
  let l = 0;
  const a = createState({});
  const [u] = a;
  const [d, f] = createSelfCancelTimeout();
  const [_, h] = createSelfCancelTimeout();
  const [g, v] = createSelfCancelTimeout(100);
  const [w, p] = createSelfCancelTimeout(100);
  const [b, y] = createSelfCancelTimeout((() => l));
  const [m, S, x] = createScrollbarsSetupElements(t, o.qt, createScrollbarsSetupEvents(n, o));
  const {Z: $, tt: C, et: O, ct: E, J: T, X: A} = o.qt;
  const {Jt: z, tn: I, Xt: L, Ut: H, Wt: P} = m;
  const {Qt: D} = z;
  const {Qt: M} = I;
  const styleScrollbarPosition = t => {
    const {Nt: n} = t;
    const o = T && !A && parent(n) === C && n;
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
      if (l > 0 && !n) {
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
      P(o());
      c && manageScrollbarsAutoHide(true);
      g((() => {
        c && !r && manageScrollbarsAutoHide(false);
      }));
    }));
    T && D(styleScrollbarPosition);
    T && M(styleScrollbarPosition);
  })) ];
  const k = u.bind(0);
  k.qt = m;
  k.Yt = S;
  return [ (t, r, a) => {
    const {zt: u, It: d, At: f, bt: _} = a;
    const h = createOptionCheck(n, t, r);
    const g = o();
    const {Et: v, $t: w, wt: p} = g;
    const [b, y] = h("scrollbars.theme");
    const [m, S] = h("scrollbars.visibility");
    const [x, $] = h("scrollbars.autoHide");
    const [C] = h("scrollbars.autoHideDelay");
    const [O, E] = h("scrollbars.dragScroll");
    const [T, z] = h("scrollbars.clickScroll");
    const I = u || d || _ || r;
    const D = f || S || r;
    const setScrollbarVisibility = (t, n) => {
      const o = "visible" === m || "auto" === m && "scroll" === t;
      L(J, o, n);
      return o;
    };
    l = C;
    if (y) {
      L(i);
      L(b, true);
      i = b;
    }
    if ($) {
      s = "move" === x;
      e = "leave" === x;
      c = "never" !== x;
      manageScrollbarsAutoHide(!c, true);
    }
    if (E) {
      L(st, O);
    }
    if (z) {
      L(ot, T);
    }
    if (D) {
      const t = setScrollbarVisibility(w.x, true);
      const n = setScrollbarVisibility(w.y, false);
      const o = t && n;
      L(K, !o);
    }
    if (I) {
      H(g);
      P(g);
      L(tt, !v.x, true);
      L(tt, !v.y, false);
      L(G, p && !A);
    }
  }, k, runEachAndClear.bind(0, R) ];
};

const OverlayScrollbars = (t, n, o) => {
  const {G: s, Y: e} = getEnvironment();
  const c = getPlugins();
  const r = isHTMLElement(t);
  const i = r ? t : t.target;
  const l = getInstance(i);
  if (n && !l) {
    let l = false;
    const a = c[ft];
    const validateOptions = t => {
      const n = t || {};
      const o = a && a.T;
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
      removeInstance(i);
      y();
      b();
      v();
      l = true;
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
        const {Ot: t, Et: n, $t: o, Tt: s, nt: e, yt: c, wt: r} = g();
        return assignDeep({}, {
          overflowEdge: t,
          overflowAmount: n,
          overflowStyle: o,
          hasOverflow: s,
          padding: e,
          paddingAbsolute: c,
          directionRTL: r,
          destroyed: l
        });
      },
      elements() {
        const {K: t, Z: n, nt: o, tt: s, ot: e, et: c, ct: r} = g.qt;
        const {Jt: i, tn: l} = p.qt;
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
          scrollbarHorizontal: translateScrollbarsSetupElement(i),
          scrollbarVertical: translateScrollbarsSetupElement(l)
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
    addInstance(i, m);
    _("initialized", [ m ]);
    g.jt(((t, n, o) => {
      const {gt: s, bt: e, ht: c, zt: r, It: i, At: l, vt: a, Ct: u} = t;
      _("updated", [ m, {
        updateHints: {
          sizeChanged: s,
          directionChanged: e,
          heightIntrinsicChanged: c,
          overflowEdgeChanged: r,
          overflowAmountChanged: i,
          overflowStyleChanged: l,
          contentMutation: a,
          hostMutation: u
        },
        changedOptions: n,
        force: o
      } ]);
    }));
    return m.update(true);
  }
  return l;
};

OverlayScrollbars.plugin = addPlugin;

OverlayScrollbars.valid = t => {
  const n = t && t.elements;
  const o = isFunction(n) && n();
  return isPlainObject(o) && !!getInstance(o.target);
};

OverlayScrollbars.env = () => {
  const {B: t, L: n, I: o, V: s, j: e, H: c, U: r, W: i, q: l, F: a, G: u, N: d} = getEnvironment();
  return assignDeep({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: n,
    scrollbarsHiding: o,
    rtlScrollBehavior: s,
    flexboxGlue: e,
    cssCustomProperties: c,
    staticDefaultInitialization: r,
    staticDefaultOptions: i,
    getDefaultInitialization: l,
    setDefaultInitialization: a,
    getDefaultOptions: u,
    setDefaultOptions: d
  });
};

exports.OverlayScrollbars = OverlayScrollbars;

exports.scrollbarsHidingPlugin = mt;

exports.sizeObserverPlugin = vt;
//# sourceMappingURL=overlayscrollbars.cjs.js.map
