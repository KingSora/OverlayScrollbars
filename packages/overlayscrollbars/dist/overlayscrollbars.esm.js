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
  each(keys(n), (o => setCSSVal(t, o, n[o])));
}

const createCache = (t, n) => {
  const {o: o, u: s, _: e} = t;
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
  o && !isNull(s) && false !== s && (o[t] = s);
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
  return s && e ? s === t || e === t || closest(closest(t, o), n) !== s : false;
};

const before = (t, n, o) => {
  if (o) {
    let s = n;
    let e;
    if (t) {
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
  }
};

const appendChildren = (t, n) => {
  before(t, null, n);
};

const prependChildren = (t, n) => {
  before(t, t && t.firstChild, n);
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
  const {g: r, v: i, p: l} = n || {};
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
  u.m = flush;
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
    if (t) {
      const {style: s} = t;
      if (!isUndefined(s[n])) {
        s[n] = adaptCSSVal(n, o);
      } else {
        s.setProperty(n, o);
      }
    }
  } catch (s) {}
};

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

const w = {
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
} : w;

const clientSize = t => t ? {
  w: t.clientWidth,
  h: t.clientHeight
} : w;

const scrollSize = t => t ? {
  w: t.scrollWidth,
  h: t.scrollHeight
} : w;

const fractionalSize = t => {
  const n = parseFloat(style(t, "height")) || 0;
  const o = parseFloat(style(t, "height")) || 0;
  return {
    w: o - Math.round(o),
    h: n - Math.round(n)
  };
};

const getBoundingClientRect = t => t.getBoundingClientRect();

let p;

const supportPassiveEvents = () => {
  if (isUndefined(p)) {
    p = false;
    try {
      window.addEventListener("test", null, Object.defineProperty({}, "passive", {
        get() {
          p = true;
        }
      }));
    } catch (t) {}
  }
  return p;
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
  const r = null != (e = c && s && s.S) ? e : c;
  const i = s && s.C || false;
  const l = s && s.$ || false;
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

const b = {
  x: 0,
  y: 0
};

const absoluteCoordinates = t => {
  const n = t ? getBoundingClientRect(t) : 0;
  return n ? {
    x: n.left + window.pageYOffset,
    y: n.top + window.pageXOffset
  } : b;
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

const getPropByPath = (t, n) => t ? n.split(".").reduce(((t, n) => t && hasOwnProperty(t, n) ? t[n] : void 0), t) : void 0;

const createOptionCheck = (t, n, o) => s => [ getPropByPath(t, s), o || void 0 !== getPropByPath(n, s) ];

const createState = t => {
  let n = t;
  return [ () => n, t => {
    n = assignDeep({}, n, t);
  } ];
};

const y = "os-environment";

const m = `${y}-flexbox-glue`;

const S = `${m}-max`;

const C = "data-overlayscrollbars";

const x = `${C}-overflow-x`;

const $ = `${C}-overflow-y`;

const O = "overflowVisible";

const z = "scrollbarHidden";

const I = "os-padding";

const A = "os-viewport";

const T = `${A}-arrange`;

const D = "os-content";

const E = `${A}-scrollbar-hidden`;

const P = `os-overflow-visible`;

const H = "os-size-observer";

const L = `${H}-appear`;

const M = `${H}-listener`;

const R = `${M}-scroll`;

const V = `${M}-item`;

const k = `${V}-final`;

const B = "os-trinsic-observer";

const j = "os-scrollbar";

const Y = `${j}-horizontal`;

const q = `${j}-vertical`;

const F = "os-scrollbar-track";

const G = "os-scrollbar-handle";

const N = `${j}-visible`;

const U = `${j}-cornerless`;

const W = `${j}-transitionless`;

const X = `${j}-interaction`;

const J = `${j}-auto-hidden`;

const opsStringify = t => JSON.stringify(t, ((t, n) => {
  if (isFunction(n)) {
    throw new Error;
  }
  return n;
}));

const K = {
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

const Z = {};

const getPlugins = () => assignDeep({}, Z);

const addPlugin = t => {
  each(isArray(t) ? t : [ t ], (t => {
    each(keys(t), (n => {
      Z[n] = t[n];
    }));
  }));
};

const Q = {
  boolean: "__TPL_boolean_TYPE__",
  number: "__TPL_number_TYPE__",
  string: "__TPL_string_TYPE__",
  array: "__TPL_array_TYPE__",
  object: "__TPL_object_TYPE__",
  function: "__TPL_function_TYPE__",
  null: "__TPL_null_TYPE__"
};

const tt = Q.number;

const nt = Q.boolean;

const ot = [ Q.array, Q.null ];

const st = "hidden scroll visible visible-hidden";

const et = "visible hidden auto";

const ct = "never scroll leavemove";

({
  paddingAbsolute: nt,
  showNativeOverlaidScrollbars: nt,
  updating: {
    elementEvents: ot,
    attributes: ot,
    debounce: [ Q.number, Q.array, Q.null ],
    ignoreMutation: [ Q.function, Q.null ]
  },
  overflow: {
    x: st,
    y: st
  },
  scrollbars: {
    theme: [ Q.string, Q.null ],
    visibility: et,
    autoHide: ct,
    autoHideDelay: tt,
    dragScroll: nt,
    clickScroll: nt,
    touch: nt
  }
});

const rt = "__osOptionsValidationPlugin";

const it = 3333333;

const lt = "scroll";

const at = "__osSizeObserverPlugin";

const ut = {
  [at]: {
    O: (t, n, o) => {
      const s = createDOM(`<div class="${V}" dir="ltr"><div class="${V}"><div class="${k}"></div></div><div class="${V}"><div class="${k}" style="width: 200%; height: 200%"></div></div></div>`);
      appendChildren(t, s);
      addClass(t, R);
      const e = s[0];
      const c = e.lastChild;
      const r = e.firstChild;
      const i = null == r ? void 0 : r.firstChild;
      let l = offsetSize(e);
      let a = l;
      let u = false;
      let _;
      const reset = () => {
        scrollLeft(r, it);
        scrollTop(r, it);
        scrollLeft(c, it);
        scrollTop(c, it);
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
      const h = push([], [ on(r, lt, onScroll), on(c, lt, onScroll) ]);
      style(i, {
        width: it,
        height: it
      });
      reset();
      return [ o ? onScroll.bind(0, false) : reset, h ];
    }
  }
};

let dt = 0;

const {round: ft, abs: _t} = Math;

const getWindowDPR = () => {
  const t = window.screen.deviceXDPI || 0;
  const n = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || t / n;
};

const diffBiggerThanOne = (t, n) => {
  const o = _t(t);
  const s = _t(n);
  return !(o === s || o + 1 === s || o - 1 === s);
};

const ht = "__osScrollbarsHidingPlugin";

const gt = {
  [ht]: {
    I: t => {
      const {A: n, T: o, D: s} = t;
      const e = !s && !n && (o.x || o.y);
      const c = e ? document.createElement("style") : false;
      if (c) {
        attr(c, "id", `${T}-${dt}`);
        dt++;
      }
      return c;
    },
    P: (t, n, o, s, e, c, r) => {
      const arrangeViewport = (n, c, r, i) => {
        if (t) {
          const {H: t} = e();
          const {L: l, M: a} = n;
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
                  t.insertRule(`#${attr(s, "id")} + .${T}::before {}`, 0);
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
          const {H: u} = e();
          const {M: d} = a;
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
          removeClass(o, T);
          if (!n) {
            h.height = "";
          }
          style(o, h);
          return [ () => {
            r(a, i, t, g);
            style(o, g);
            addClass(o, T);
          }, a ];
        }
        return [ noop ];
      };
      return [ arrangeViewport, undoViewportArrange ];
    },
    R: () => {
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
          w: _t(r.w),
          h: _t(r.h)
        };
        const l = {
          w: _t(ft(c.w / (t.w / 100))),
          h: _t(ft(c.h / (t.h / 100)))
        };
        const a = getWindowDPR();
        const u = i.w > 2 && i.h > 2;
        const d = !diffBiggerThanOne(l.w, l.h);
        const f = a !== n && a > 0;
        const _ = u && d && f;
        if (_) {
          const [t, n] = s();
          assignDeep(o.V, t);
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

let vt;

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
  const o = addClass(t, E);
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
  const o = addClass(t, m);
  const s = getBoundingClientRect(t);
  const e = getBoundingClientRect(n);
  const c = equalBCRWH(e, s, true);
  const r = addClass(t, S);
  const i = getBoundingClientRect(t);
  const l = getBoundingClientRect(n);
  const a = equalBCRWH(l, i, true);
  o();
  r();
  return c && a;
};

const createEnvironment = () => {
  const {body: t} = document;
  const n = createDOM(`<div class="${y}"><div></div></div>`);
  const o = n[0];
  const s = o.firstChild;
  const [e, , c] = createEventListenerHub();
  const [r, i] = createCache({
    o: getNativeScrollbarSize(t, o, s),
    u: equalXY
  }, getNativeScrollbarSize.bind(0, t, o, s, true));
  const [l] = i();
  const a = getNativeScrollbarsHiding(o);
  const u = {
    x: 0 === l.x,
    y: 0 === l.y
  };
  const d = {
    padding: !a,
    content: false,
    cancel: {
      nativeScrollbarsOverlaid: true,
      body: null
    }
  };
  const f = assignDeep({}, K);
  const _ = {
    V: l,
    T: u,
    A: a,
    D: "-1" === style(o, "zIndex"),
    k: getRtlScrollBehavior(o, s),
    B: getFlexboxGlue(o, s),
    j: t => e("_", t),
    Y: assignDeep.bind(0, {}, d),
    q(t) {
      assignDeep(d, t);
    },
    F: assignDeep.bind(0, {}, f),
    G(t) {
      assignDeep(f, t);
    },
    N: assignDeep({}, d),
    U: assignDeep({}, f)
  };
  removeAttr(o, "style");
  removeElements(o);
  if (!a && (!u.x || !u.y)) {
    let t;
    window.addEventListener("resize", (() => {
      const n = getPlugins()[ht];
      t = t || n && n.R();
      t && t(_, r, c.bind(0, "_"));
    }));
  }
  return _;
};

const getEnvironment = () => {
  if (!vt) {
    vt = createEnvironment();
  }
  return vt;
};

const resolveInitialization = (t, n) => isFunction(t) ? t.apply(0, n) : t;

const staticInitializationElement = (t, n, o, s) => resolveInitialization(s || resolveInitialization(o, t), t) || n.apply(0, t);

const dynamicInitializationElement = (t, n, o, s) => {
  let e = resolveInitialization(s, t);
  if (isNull(e) || isUndefined(e)) {
    e = resolveInitialization(o, t);
  }
  return true === e || isNull(e) || isUndefined(e) ? n.apply(0, t) : e;
};

const cancelInitialization = (t, n) => {
  const {nativeScrollbarsOverlaid: o, body: s} = t || {};
  const {W: e, X: c} = n;
  const {Y: r, T: i} = getEnvironment();
  const {nativeScrollbarsOverlaid: l, body: a} = r().cancel;
  const u = null != o ? o : l;
  const d = isBoolean(s) || isNull(s) ? s : a;
  const f = (i.x || i.y) && u;
  const _ = e && (isNull(d) ? !c : d);
  return !!f || !!_;
};

const wt = createDiv.bind(0, "");

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
  const {Y: o, A: s} = n;
  const e = getPlugins()[ht];
  const c = e && e.I;
  const {host: r, viewport: i, padding: l, content: a} = o();
  const d = isHTMLElement(t);
  const f = d ? {} : t;
  const {host: _, padding: h, viewport: g, content: v} = f;
  const w = d ? t : f.target;
  const p = is(w, "textarea");
  const b = w.ownerDocument;
  const y = w === b.body;
  const m = b.defaultView;
  const S = y ? s : !!u && !p && s;
  const O = staticInitializationElement.bind(0, [ w ]);
  const z = dynamicInitializationElement.bind(0, [ w ]);
  const T = [ O(wt, i, y && !hasOwnProperty(f, "viewport") ? w : g), O(wt, i), O(wt) ].filter((t => S ? true : t !== w))[0];
  const P = T === w;
  const H = {
    J: w,
    K: p ? O(wt, r, _) : w,
    Z: T,
    tt: !P && z(wt, l, h),
    nt: !P && z(wt, a, v),
    ot: !P && !s && c && c(n),
    st: m,
    et: b,
    ct: p,
    W: y,
    rt: d,
    X: P,
    it: (t, n) => P ? hasAttrClass(T, C, n) : hasClass(T, t),
    lt: (t, n, o) => P ? attrClass(T, C, n, o) : (o ? addClass : removeClass)(T, t)
  };
  const L = keys(H).reduce(((t, n) => {
    const o = H[n];
    return push(t, o && !parent(o) ? o : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(L, t) > -1 : null;
  const {J: M, K: R, tt: V, Z: k, nt: B, ot: j} = H;
  const Y = [];
  const q = p && elementIsGenerated(R);
  const F = p ? M : contents([ B, k, V, R, M ].find((t => false === elementIsGenerated(t))));
  const G = B || k;
  const appendElements = () => {
    const t = addDataAttrHost(R, P ? "viewport" : "host");
    const n = addClass(V, I);
    const o = addClass(k, !P && A);
    const e = addClass(B, D);
    const c = y ? addClass(parent(w), E) : noop;
    if (q) {
      insertAfter(M, R);
      push(Y, (() => {
        insertAfter(R, M);
        removeElements(R);
      }));
    }
    appendChildren(G, F);
    appendChildren(R, V);
    appendChildren(V || R, !P && k);
    appendChildren(k, B);
    push(Y, (() => {
      c();
      t();
      removeAttr(k, x);
      removeAttr(k, $);
      if (elementIsGenerated(B)) {
        unwrap(B);
      }
      if (elementIsGenerated(k)) {
        unwrap(k);
      }
      if (elementIsGenerated(V)) {
        unwrap(V);
      }
      n();
      o();
      e();
    }));
    if (s && !P) {
      push(Y, removeClass.bind(0, k, E));
    }
    if (j) {
      insertBefore(k, j);
      push(Y, removeElements.bind(0, j));
    }
  };
  return [ H, appendElements, runEachAndClear.bind(0, Y) ];
};

const createTrinsicUpdateSegment = (t, n) => {
  const {nt: o} = t;
  const [s] = n;
  return t => {
    const {B: n} = getEnvironment();
    const {ut: e} = s();
    const {dt: c} = t;
    const r = (o || !n) && c;
    if (r) {
      style(o, {
        height: e ? "" : "100%"
      });
    }
    return {
      ft: r,
      _t: r
    };
  };
};

const createPaddingUpdateSegment = (t, n) => {
  const [o, s] = n;
  const {K: e, tt: c, Z: r, X: i} = t;
  const [l, a] = createCache({
    u: equalTRBL,
    o: topRightBottomLeft()
  }, topRightBottomLeft.bind(0, e, "padding", ""));
  return (t, n, e) => {
    let [u, d] = a(e);
    const {A: f, B: _} = getEnvironment();
    const {ht: h} = o();
    const {ft: g, _t: v, gt: w} = t;
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
        tt: u,
        vt: !t,
        H: c ? i : assignDeep({}, e, i)
      });
    }
    return {
      wt: m
    };
  };
};

const {max: pt} = Math;

const bt = pt.bind(0, 0);

const yt = "visible";

const mt = "hidden";

const St = 42;

const Ct = {
  u: equalWH,
  o: {
    w: 0,
    h: 0
  }
};

const xt = {
  u: equalXY,
  o: {
    x: mt,
    y: mt
  }
};

const getOverflowAmount = (t, n) => {
  const o = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const s = {
    w: bt(t.w - n.w),
    h: bt(t.h - n.h)
  };
  return {
    w: s.w > o ? s.w : 0,
    h: s.h > o ? s.h : 0
  };
};

const conditionalClass = (t, n, o) => o ? addClass(t, n) : removeClass(t, n);

const overflowIsVisible = t => 0 === t.indexOf(yt);

const createOverflowUpdateSegment = (t, n) => {
  const [o, s] = n;
  const {K: e, tt: c, Z: r, ot: i, X: l, lt: a} = t;
  const {V: u, B: d, A: f, T: _} = getEnvironment();
  const h = getPlugins()[ht];
  const g = !l && !f && (_.x || _.y);
  const [v, w] = createCache(Ct, fractionalSize.bind(0, r));
  const [p, b] = createCache(Ct, scrollSize.bind(0, r));
  const [y, m] = createCache(Ct);
  const [S, I] = createCache(Ct);
  const [A] = createCache(xt);
  const fixFlexboxGlue = (t, n) => {
    style(r, {
      height: ""
    });
    if (n) {
      const {vt: n, tt: s} = o();
      const {bt: c, L: i} = t;
      const l = fractionalSize(e);
      const a = clientSize(e);
      const u = "content-box" === style(r, "boxSizing");
      const d = n || u ? s.b + s.t : 0;
      const f = !(_.x && u);
      style(r, {
        height: a.h + l.h + (c.x && f ? i.x : 0) - d
      });
    }
  };
  const getViewportOverflowState = (t, n) => {
    const o = !f && !t ? St : 0;
    const getStatePerAxis = (t, s, e) => {
      const c = style(r, t);
      const i = n ? n[t] : c;
      const l = "scroll" === i;
      const a = s ? o : e;
      const u = l && !f ? a : 0;
      const d = s && !!o;
      return [ c, l, u, d ];
    };
    const [s, e, c, i] = getStatePerAxis("overflowX", _.x, u.x);
    const [l, a, d, h] = getStatePerAxis("overflowY", _.y, u.y);
    return {
      yt: {
        x: s,
        y: l
      },
      bt: {
        x: e,
        y: a
      },
      L: {
        x: c,
        y: d
      },
      M: {
        x: i,
        y: h
      }
    };
  };
  const setViewportOverflowState = (t, n, o, s) => {
    const setAxisOverflowStyle = (t, n) => {
      const o = overflowIsVisible(t);
      const s = n && o && t.replace(`${yt}-`, "") || "";
      return [ n && !o ? t : "", overflowIsVisible(s) ? "hidden" : s ];
    };
    const [e, c] = setAxisOverflowStyle(o.x, n.x);
    const [r, i] = setAxisOverflowStyle(o.y, n.y);
    s.overflowX = c && r ? c : e;
    s.overflowY = i && e ? i : r;
    return getViewportOverflowState(t, s);
  };
  const hideNativeScrollbars = (t, n, s, e) => {
    const {L: c, M: r} = t;
    const {x: i, y: l} = r;
    const {x: a, y: u} = c;
    const {H: d} = o();
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
  const [T, D] = h ? h.P(g, d, r, i, o, getViewportOverflowState, hideNativeScrollbars) : [ () => g, () => [ noop ] ];
  return (t, n, i) => {
    const {ft: u, St: h, _t: g, wt: H, dt: L, gt: M} = t;
    const {ut: R, ht: V} = o();
    const [k, B] = n("showNativeOverlaidScrollbars");
    const [j, Y] = n("overflow");
    const q = k && _.x && _.y;
    const F = !l && !d && (u || g || h || B || L);
    const G = overflowIsVisible(j.x);
    const N = overflowIsVisible(j.y);
    const U = G || N;
    let W = w(i);
    let X = b(i);
    let J = m(i);
    let K = I(i);
    let Z;
    if (B && f) {
      a(E, z, !q);
    }
    if (F) {
      Z = getViewportOverflowState(q);
      fixFlexboxGlue(Z, R);
    }
    if (u || H || g || M || B) {
      if (U) {
        a(P, O, false);
      }
      const [t, n] = D(q, V, Z);
      const [o, s] = W = v(i);
      const [e, c] = X = p(i);
      const l = clientSize(r);
      let u = e;
      let d = l;
      t();
      if ((c || s || B) && n && !q && T(n, e, o, V)) {
        d = clientSize(r);
        u = scrollSize(r);
      }
      const f = {
        w: bt(pt(e.w, u.w) + o.w),
        h: bt(pt(e.h, u.h) + o.h)
      };
      const _ = {
        w: bt(d.w + bt(l.w - e.w) + o.w),
        h: bt(d.h + bt(l.h - e.h) + o.h)
      };
      K = S(_);
      J = y(getOverflowAmount(f, _), i);
    }
    const [Q, tt] = K;
    const [nt, ot] = J;
    const [st, et] = X;
    const [ct, rt] = W;
    const it = {
      x: nt.w > 0,
      y: nt.h > 0
    };
    const lt = G && N && (it.x || it.y) || G && it.x && !it.y || N && it.y && !it.x;
    if (H || M || rt || et || tt || ot || Y || B || F) {
      const t = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: "",
        overflowY: "",
        overflowX: ""
      };
      const n = setViewportOverflowState(q, it, j, t);
      const o = T(n, st, ct, V);
      if (!l) {
        hideNativeScrollbars(n, V, o, t);
      }
      if (F) {
        fixFlexboxGlue(n, R);
      }
      if (l) {
        attr(e, x, t.overflowX);
        attr(e, $, t.overflowY);
      } else {
        style(r, t);
      }
    }
    attrClass(e, C, O, lt);
    conditionalClass(c, P, lt);
    !l && conditionalClass(r, P, U);
    const [at, ut] = A(getViewportOverflowState(q).yt);
    s({
      yt: at,
      Ct: {
        x: Q.w,
        y: Q.h
      },
      xt: {
        x: nt.w,
        y: nt.h
      },
      $t: it
    });
    return {
      Ot: ut,
      zt: tt,
      It: ot
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
  const {Z: o} = t;
  const {A: s, T: e, B: c} = getEnvironment();
  const r = !s && (e.x || e.y);
  const i = [ createTrinsicUpdateSegment(t, n), createPaddingUpdateSegment(t, n), createOverflowUpdateSegment(t, n) ];
  return (t, n, s) => {
    const e = prepareUpdateHints(assignDeep({
      ft: false,
      wt: false,
      gt: false,
      dt: false,
      zt: false,
      It: false,
      Ot: false,
      St: false,
      _t: false
    }, n), {}, s);
    const l = r || !c;
    const a = l && scrollLeft(o);
    const u = l && scrollTop(o);
    let d = e;
    each(i, (n => {
      d = prepareUpdateHints(d, n(d, t, !!s) || {}, s);
    }));
    scrollLeft(o, a);
    scrollTop(o, u);
    return d;
  };
};

const $t = 3333333;

const getElmDirectionIsRTL = t => "rtl" === style(t, "direction");

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, o) => {
  const {At: s = false, Tt: e = false} = o || {};
  const c = getPlugins()[at];
  const {k: r} = getEnvironment();
  const i = createDOM(`<div class="${H}"><div class="${M}"></div></div>`);
  const l = i[0];
  const a = l.firstChild;
  const d = getElmDirectionIsRTL.bind(0, l);
  const [f] = createCache({
    o: void 0,
    _: true,
    u: (t, n) => !(!t || !domRectHasDimensions(t) && domRectHasDimensions(n))
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
      const n = e ? t[0] : getElmDirectionIsRTL(l);
      scrollLeft(l, n ? r.n ? -$t : r.i ? 0 : $t : $t);
      scrollTop(l, $t);
    }
    if (!c) {
      n({
        ft: !e,
        Dt: e ? t : void 0,
        Tt: !!i
      });
    }
  };
  const _ = [];
  let h = e ? onSizeChangedCallbackProxy : false;
  let g;
  if (u) {
    const t = new u(onSizeChangedCallbackProxy);
    t.observe(a);
    push(_, (() => {
      t.disconnect();
    }));
  } else if (c) {
    const [t, n] = c.O(a, onSizeChangedCallbackProxy, e);
    h = t;
    push(_, n);
  }
  if (s) {
    g = createCache({
      o: !d()
    }, d);
    const [t] = g;
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
    addClass(l, L);
    push(_, on(l, "animationstart", h, {
      $: !!u
    }));
  }
  prependChildren(t, l);
  return () => {
    runEachAndClear(_);
    removeElements(l);
  };
};

const isHeightIntrinsic = t => 0 === t.h || t.isIntersecting || t.intersectionRatio > 0;

const createTrinsicObserver = (t, n) => {
  let o;
  const s = createDiv(B);
  const e = [];
  const [c] = createCache({
    o: false
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
    push(e, createSizeObserver(s, onSizeChanged));
    onSizeChanged();
  }
  prependChildren(t, s);
  return [ () => {
    runEachAndClear(e);
    removeElements(s);
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
        const listener = t => {
          if (e) {
            off(o, c, listener);
            s.delete(o);
          } else {
            n(t);
          }
        };
        on(o, c, listener);
        s.set(o, [ c, () => off(o, c, listener) ]);
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
  const {Et: c, Pt: r, Ht: i, Lt: a, Mt: u, Rt: d} = s || {};
  const f = debounce((() => {
    if (e) {
      o(true);
    }
  }), {
    g: 33,
    v: 99
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
      const C = indexOf(v, e) > -1 && S;
      if (n && !y) {
        const n = !p;
        const l = p && C;
        const u = l && a && is(c, a);
        const _ = u ? !r(c, e, d, m) : n || l;
        const v = _ && !i(o, !!u, t, s);
        push(f, h);
        g = g || v;
        w = w || b;
      }
      if (!n && y && S && !r(c, e, d, m)) {
        push(l, e);
        _ = _ || C;
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
      f.m();
      const t = p.takeRecords();
      return !isEmptyArray(t) && observerCallback(t, true);
    }
  } ];
};

const Ot = `[${C}]`;

const zt = `.${A}`;

const It = [ "tabindex" ];

const At = [ "wrap", "cols", "rows" ];

const Tt = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, o) => {
  let s;
  let e;
  let c;
  const [, r] = n;
  const {K: i, Z: l, nt: a, ct: d, X: f, it: _, lt: h} = t;
  const {A: g, B: v} = getEnvironment();
  const [w] = createCache({
    u: equalWH,
    o: {
      w: 0,
      h: 0
    }
  }, (() => {
    const t = _(P, O);
    const n = _(T, "");
    const o = n && scrollLeft(l);
    const s = n && scrollTop(l);
    h(P, O);
    h(T, "");
    const e = scrollSize(a);
    const c = scrollSize(l);
    const r = fractionalSize(l);
    h(P, O, t);
    h(T, "", n);
    scrollLeft(l, o);
    scrollTop(l, s);
    return {
      w: c.w + e.w + r.w,
      h: c.h + e.h + r.h
    };
  }));
  const p = d ? At : Tt.concat(At);
  const b = debounce(o, {
    g: () => s,
    v: () => e,
    p(t, n) {
      const [o] = t;
      const [s] = n;
      return [ keys(o).concat(keys(s)).reduce(((t, n) => {
        t[n] = o[n] || s[n];
        return t;
      }), {}) ];
    }
  });
  const updateViewportAttrsFromHost = t => {
    each(t || It, (t => {
      if (indexOf(It, t) > -1) {
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
      dt: e
    };
    r({
      ut: s
    });
    !n && o(c);
    return c;
  };
  const onSizeChanged = ({ft: t, Dt: n, Tt: s}) => {
    const e = !t || s ? o : b;
    let c = false;
    if (n) {
      const [t, o] = n;
      c = o;
      r({
        ht: t
      });
    }
    e({
      ft: t,
      gt: c
    });
  };
  const onContentMutation = (t, n) => {
    const [, s] = w();
    const e = {
      _t: s
    };
    const c = t ? o : b;
    if (s) {
      !n && c(e);
    }
    return e;
  };
  const onHostMutation = (t, n, o) => {
    const s = {
      St: n
    };
    if (n) {
      !o && b(s);
    } else if (!f) {
      updateViewportAttrsFromHost(t);
    }
    return s;
  };
  const y = (a || !v) && createTrinsicObserver(i, onTrinsicChanged);
  const m = !f && createSizeObserver(i, onSizeChanged, {
    Tt: true,
    At: !g
  });
  const [S, C] = createDOMObserver(i, false, onHostMutation, {
    Pt: Tt,
    Et: Tt.concat(It)
  });
  const x = f && new u(onSizeChanged.bind(0, {
    ft: true
  }));
  x && x.observe(i);
  updateViewportAttrsFromHost();
  return [ () => {
    c && c[0]();
    y && y[0]();
    m && m();
    x && x.disconnect();
    S();
  }, () => {
    const t = {};
    const n = C();
    const o = c && c[1]();
    const s = y && y[1]();
    if (n) {
      assignDeep(t, onHostMutation.apply(0, push(n, true)));
    }
    if (o) {
      assignDeep(t, onContentMutation.apply(0, push(o, true)));
    }
    if (s) {
      assignDeep(t, onTrinsicChanged.apply(0, push(s, true)));
    }
    return t;
  }, t => {
    const [n] = t("updating.ignoreMutation");
    const [o, r] = t("updating.attributes");
    const [i, u] = t("updating.elementEvents");
    const [d, f] = t("updating.debounce");
    const _ = u || r;
    const ignoreMutationFromOptions = t => isFunction(n) && n(t);
    if (_) {
      if (c) {
        c[1]();
        c[0]();
      }
      c = createDOMObserver(a || l, true, onContentMutation, {
        Pt: p.concat(o || []),
        Et: p.concat(o || []),
        Ht: i,
        Lt: Ot,
        Rt: (t, n) => {
          const {target: o, attributeName: s} = t;
          const e = !n && s ? liesBetween(o, Ot, zt) : false;
          return e || !!closest(o, `.${j}`) || !!ignoreMutationFromOptions(t);
        }
      });
    }
    if (f) {
      b.m();
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

const Dt = {
  x: 0,
  y: 0
};

const Et = {
  tt: {
    t: 0,
    r: 0,
    b: 0,
    l: 0
  },
  vt: false,
  H: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  Ct: Dt,
  xt: Dt,
  yt: {
    x: "hidden",
    y: "hidden"
  },
  $t: {
    x: false,
    y: false
  },
  ut: false,
  ht: false
};

const createStructureSetup = (t, n) => {
  const o = createOptionCheck(n, {});
  const s = createState(Et);
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
  const [f, _, h] = createStructureSetupObservers(l, s, (t => {
    triggerUpdateEvent(d(o, t), {}, false);
  }));
  const g = i.bind(0);
  g.Vt = t => {
    e("u", t);
  };
  g.kt = a;
  g.Bt = l;
  return [ (t, o) => {
    const s = createOptionCheck(n, t, o);
    h(s);
    triggerUpdateEvent(d(s, _(), o), t, !!o);
  }, g, () => {
    c();
    f();
    u();
  } ];
};

const Pt = "touchstart mouseenter";

const Ht = "touchend touchcancel mouseleave";

const stopRootClickPropagation = (t, n) => on(t, "mousedown", on.bind(0, n, "click", stopPropagation, {
  $: true,
  C: true
}), {
  C: true
});

const createScrollbarsSetupElements = (t, n) => {
  const {Y: o} = getEnvironment();
  const {scrollbarsSlot: s} = o();
  const {et: e, J: c, K: r, Z: i, rt: l} = n;
  const a = l ? null : t.scrollbarsSlot;
  const u = dynamicInitializationElement([ c, r, i ], (() => r), s, a);
  const scrollbarsAddRemoveClass = (t, n, o, s) => {
    const e = o ? addClass : removeClass;
    each(t, (t => {
      e((s || noop)(t) || t.jt, n);
    }));
  };
  const scrollbarsHandleStyle = (t, n) => {
    each(t, (t => {
      const [o, s] = n(t);
      style(o, s);
    }));
  };
  const d = [];
  const f = [];
  const h = [];
  const g = scrollbarsAddRemoveClass.bind(0, f);
  const v = scrollbarsAddRemoveClass.bind(0, h);
  const generateScrollbarDOM = t => {
    const n = t ? Y : q;
    const o = t ? f : h;
    const s = isEmptyArray(o) ? W : "";
    const c = createDiv(`${j} ${n} ${s}`);
    const r = createDiv(F);
    const i = createDiv(G);
    const l = {
      jt: c,
      Yt: r,
      qt: i
    };
    appendChildren(c, r);
    appendChildren(r, i);
    push(o, l);
    push(d, [ removeElements.bind(0, c), on(c, Pt, (() => {
      g(X, true);
      v(X, true);
    })), on(c, Ht, (() => {
      g(X);
      v(X);
    })), stopRootClickPropagation(c, e) ]);
    return l;
  };
  const w = generateScrollbarDOM.bind(0, true);
  const p = generateScrollbarDOM.bind(0, false);
  const appendElements = () => {
    appendChildren(u, f[0].jt);
    appendChildren(u, h[0].jt);
    _((() => {
      g(W);
      v(W);
    }), 300);
  };
  w();
  p();
  return [ {
    Ft: {
      Gt: f,
      Nt: w,
      Ut: g,
      Wt: scrollbarsHandleStyle.bind(0, f)
    },
    Xt: {
      Gt: h,
      Nt: p,
      Ut: v,
      Wt: scrollbarsHandleStyle.bind(0, h)
    }
  }, appendElements, runEachAndClear.bind(0, d) ];
};

const {min: Lt} = Math;

const createSelfCancelTimeout = t => {
  let n;
  const o = t ? _ : f;
  const s = t ? h : d;
  return [ e => {
    s(n);
    n = o(e, isFunction(t) ? t() : t);
  }, () => s(n) ];
};

const refreshScrollbarHandleLength = (t, n, o) => {
  const {xt: s, Ct: e} = n;
  const c = o ? "x" : "y";
  const r = e[c];
  const i = s[c];
  const l = Lt(1, r / (r + i));
  t((t => [ t.qt, {
    [o ? "width" : "height"]: `${(100 * l).toFixed(3)}%`
  } ]));
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
  const [m, S, C] = createScrollbarsSetupElements(t, o.Bt);
  const {K: x, Z: $} = o.Bt;
  const {Ft: O, Xt: z} = m;
  const {Ut: I, Wt: A} = O;
  const {Ut: T, Wt: D} = z;
  const manageScrollbarsAutoHide = (t, n) => {
    y();
    if (t) {
      I(J);
      T(J);
    } else {
      const hide = () => {
        I(J, true);
        T(J, true);
      };
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
  const E = [ v, y, p, h, f, C, on(x, "mouseover", onHostMouseEnter, {
    $: true
  }), on(x, "mouseenter", onHostMouseEnter), on(x, "mouseleave", (() => {
    r = false;
    e && manageScrollbarsAutoHide(false);
  })), on(x, "mousemove", (() => {
    s && d((() => {
      v();
      manageScrollbarsAutoHide(true);
      w((() => {
        s && manageScrollbarsAutoHide(false);
      }));
    }));
  })), on($, "scroll", (() => {
    c && _((() => {
      manageScrollbarsAutoHide(true);
      g((() => {
        c && !r && manageScrollbarsAutoHide(false);
      }));
    }));
  })) ];
  const P = u.bind(0);
  P.Bt = m;
  P.kt = S;
  return [ (t, r, a) => {
    const {zt: u, It: d, Ot: f} = a;
    const _ = createOptionCheck(n, t, r);
    const h = o();
    const [g, v] = _("scrollbars.theme");
    const [w, p] = _("scrollbars.visibility");
    const [b, y] = _("scrollbars.autoHide");
    const [m] = _("scrollbars.autoHideDelay");
    _("scrollbars.dragScrolling");
    _("scrollbars.touchSupport");
    const S = u || d;
    const C = f || p;
    const setScrollbarVisibility = (t, n) => {
      const o = "visible" === w || "auto" === w && "scroll" === t;
      n(N, o);
      return o;
    };
    l = m;
    if (C) {
      const {yt: t} = h;
      const n = setScrollbarVisibility(t.x, I);
      const o = setScrollbarVisibility(t.y, T);
      const s = n && o;
      I(U, !s);
      T(U, !s);
    }
    if (v) {
      I(i);
      T(i);
      I(g, true);
      T(g, true);
      i = g;
    }
    if (y) {
      s = "move" === b;
      e = "leave" === b;
      c = "never" !== b;
      manageScrollbarsAutoHide(!c, true);
    }
    if (S) {
      refreshScrollbarHandleLength(A, h, true);
      refreshScrollbarHandleLength(D, h);
    }
  }, P, runEachAndClear.bind(0, E) ];
};

const Mt = new Set;

const Rt = new WeakMap;

const addInstance = (t, n) => {
  Rt.set(t, n);
  Mt.add(t);
};

const removeInstance = t => {
  Rt.delete(t);
  Mt.delete(t);
};

const getInstance = t => Rt.get(t);

const OverlayScrollbars = (t, n, o) => {
  let s = false;
  const {F: e, j: c} = getEnvironment();
  const r = getPlugins();
  const i = isHTMLElement(t);
  const l = i ? t : t.target;
  const a = getInstance(l);
  if (a) {
    return a;
  }
  const u = r[rt];
  const validateOptions = t => {
    const n = t || {};
    const o = u && u.O;
    return o ? o(n, true) : n;
  };
  const d = assignDeep({}, e(), validateOptions(n));
  const [f, _, h] = createEventListenerHub(o);
  const [g, v, w] = createStructureSetup(t, d);
  const [p, b, y] = createScrollbarsSetup(t, d, v);
  const update = (t, n) => {
    g(t, !!n);
  };
  const m = c(update.bind(0, {}, true));
  const destroy = t => {
    removeInstance(l);
    m();
    y();
    w();
    s = true;
    h("destroyed", [ S, !!t ]);
    _();
  };
  const S = {
    options(t) {
      if (t) {
        const n = getOptionsDiff(d, validateOptions(t));
        if (!isEmptyObject(n)) {
          assignDeep(d, n);
          update(n);
        }
      }
      return assignDeep({}, d);
    },
    on: f,
    off: (t, n) => {
      t && n && _(t, n);
    },
    state() {
      const {Ct: t, xt: n, yt: o, $t: e, tt: c, vt: r} = v();
      return assignDeep({}, {
        overflowEdge: t,
        overflowAmount: n,
        overflowStyle: o,
        hasOverflow: e,
        padding: c,
        paddingAbsolute: r,
        destroyed: s
      });
    },
    elements() {
      const {J: t, K: n, tt: o, Z: s, nt: e} = v.Bt;
      return assignDeep({}, {
        target: t,
        host: n,
        padding: o || s,
        viewport: s,
        content: e || s
      });
    },
    update(t) {
      update({}, t);
      return S;
    },
    destroy: destroy.bind(0)
  };
  v.Vt(((t, n, o) => {
    p(n, o, t);
  }));
  each(keys(r), (t => {
    const n = r[t];
    if (isFunction(n)) {
      n(OverlayScrollbars, S);
    }
  }));
  if (cancelInitialization(!i && t.cancel, v.Bt)) {
    destroy(true);
    return S;
  }
  v.kt();
  b.kt();
  addInstance(l, S);
  h("initialized", [ S ]);
  v.Vt(((t, n, o) => {
    const {ft: s, gt: e, dt: c, zt: r, It: i, Ot: l, _t: a, St: u} = t;
    h("updated", [ S, {
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
  return S.update(true);
};

OverlayScrollbars.plugin = addPlugin;

OverlayScrollbars.env = () => {
  const {V: t, T: n, A: o, k: s, B: e, D: c, N: r, U: i, Y: l, q: a, F: u, G: d} = getEnvironment();
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

export { OverlayScrollbars, gt as scrollbarsHidingPlugin, ut as sizeObserverPlugin };
//# sourceMappingURL=overlayscrollbars.esm.js.map
