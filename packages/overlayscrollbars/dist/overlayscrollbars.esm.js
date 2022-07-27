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

const f = jsAPI("cancelAnimationFrame");

const d = jsAPI("requestAnimationFrame");

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
      const u = n > 0 ? _ : d;
      const g = n > 0 ? h : f;
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
    const {style: s} = t;
    if (!isUndefined(s[n])) {
      s[n] = adaptCSSVal(n, o);
    } else {
      s.setProperty(n, o);
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
  const i = s && s.$ || false;
  const l = s && s.C || false;
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

const x = "data-overlayscrollbars";

const $ = `${x}-overflow-x`;

const C = `${x}-overflow-y`;

const O = "overflowVisible";

const A = "scrollbarHidden";

const z = "updating";

const T = "os-padding";

const I = "os-viewport";

const E = `${I}-arrange`;

const L = "os-content";

const H = `${I}-scrollbar-hidden`;

const P = `os-overflow-visible`;

const D = "os-size-observer";

const M = `${D}-appear`;

const R = `${D}-listener`;

const k = `${R}-scroll`;

const B = `${R}-item`;

const V = `${B}-final`;

const j = "os-trinsic-observer";

const Y = "os-scrollbar";

const q = `${Y}-horizontal`;

const F = `${Y}-vertical`;

const G = `${Y}-track`;

const N = `${Y}-handle`;

const U = `${Y}-visible`;

const W = `${Y}-cornerless`;

const X = `${Y}-transitionless`;

const J = `${Y}-interaction`;

const K = `${Y}-unusable`;

const Z = `${Y}-auto-hidden`;

const Q = `${G}-interactive`;

const tt = `${N}-interactive`;

const opsStringify = t => JSON.stringify(t, ((t, n) => {
  if (isFunction(n)) {
    throw new Error;
  }
  return n;
}));

const nt = {
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

const ot = {};

const getPlugins = () => assignDeep({}, ot);

const addPlugin = t => {
  each(isArray(t) ? t : [ t ], (t => {
    each(keys(t), (n => {
      ot[n] = t[n];
    }));
  }));
};

const st = {
  boolean: "__TPL_boolean_TYPE__",
  number: "__TPL_number_TYPE__",
  string: "__TPL_string_TYPE__",
  array: "__TPL_array_TYPE__",
  object: "__TPL_object_TYPE__",
  function: "__TPL_function_TYPE__",
  null: "__TPL_null_TYPE__"
};

const et = st.number;

const ct = st.boolean;

const rt = [ st.array, st.null ];

const it = "hidden scroll visible visible-hidden";

const lt = "visible hidden auto";

const at = "never scroll leavemove";

({
  paddingAbsolute: ct,
  showNativeOverlaidScrollbars: ct,
  updating: {
    elementEvents: rt,
    attributes: rt,
    debounce: [ st.number, st.array, st.null ],
    ignoreMutation: [ st.function, st.null ]
  },
  overflow: {
    x: it,
    y: it
  },
  scrollbars: {
    theme: [ st.string, st.null ],
    visibility: lt,
    autoHide: at,
    autoHideDelay: et,
    dragScroll: ct,
    clickScroll: ct,
    pointers: [ st.array, st.null ]
  }
});

const ut = "__osOptionsValidationPlugin";

const ft = 3333333;

const dt = "scroll";

const _t = "__osSizeObserverPlugin";

const ht = {
  [_t]: {
    O: (t, n, o) => {
      const s = createDOM(`<div class="${B}" dir="ltr"><div class="${B}"><div class="${V}"></div></div><div class="${B}"><div class="${V}" style="width: 200%; height: 200%"></div></div></div>`);
      appendChildren(t, s);
      addClass(t, k);
      const e = s[0];
      const c = e.lastChild;
      const r = e.firstChild;
      const i = null == r ? void 0 : r.firstChild;
      let l = offsetSize(e);
      let a = l;
      let u = false;
      let _;
      const reset = () => {
        scrollLeft(r, ft);
        scrollTop(r, ft);
        scrollLeft(c, ft);
        scrollTop(c, ft);
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
            f(_);
            _ = d(onResized);
          }
        } else {
          onResized(false === t);
        }
        reset();
      };
      const h = push([], [ on(r, dt, onScroll), on(c, dt, onScroll) ]);
      style(i, {
        width: ft,
        height: ft
      });
      d(reset);
      return [ o ? onScroll.bind(0, false) : reset, h ];
    }
  }
};

let gt = 0;

const {round: vt, abs: wt} = Math;

const getWindowDPR = () => {
  const t = window.screen.deviceXDPI || 0;
  const n = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || t / n;
};

const diffBiggerThanOne = (t, n) => {
  const o = wt(t);
  const s = wt(n);
  return !(o === s || o + 1 === s || o - 1 === s);
};

const pt = "__osScrollbarsHidingPlugin";

const bt = {
  [pt]: {
    A: t => {
      const {T: n, I: o, L: s} = t;
      const e = !s && !n && (o.x || o.y);
      const c = e ? document.createElement("style") : false;
      if (c) {
        attr(c, "id", `${E}-${gt}`);
        gt++;
      }
      return c;
    },
    H: (t, n, o, s, e, c, r) => {
      const arrangeViewport = (n, c, r, i) => {
        if (t) {
          const {P: t} = e();
          const {D: l, M: a} = n;
          const {x: u, y: f} = a;
          const {x: d, y: _} = l;
          const h = i ? "paddingRight" : "paddingLeft";
          const g = t[h];
          const v = t.paddingTop;
          const w = c.w + r.w;
          const p = c.h + r.h;
          const b = {
            w: _ && f ? `${_ + w - g}px` : "",
            h: d && u ? `${d + p - v}px` : ""
          };
          if (s) {
            const {sheet: t} = s;
            if (t) {
              const {cssRules: n} = t;
              if (n) {
                if (!n.length) {
                  t.insertRule(`#${attr(s, "id")} + .${E}::before {}`, 0);
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
          const {P: u} = e();
          const {M: f} = a;
          const {x: d, y: _} = f;
          const h = {};
          const assignProps = t => each(t.split(" "), (t => {
            h[t] = u[t];
          }));
          if (d) {
            assignProps("marginBottom paddingTop paddingBottom");
          }
          if (_) {
            assignProps("marginLeft marginRight paddingLeft paddingRight");
          }
          const g = style(o, keys(h));
          removeClass(o, E);
          if (!n) {
            h.height = "";
          }
          style(o, h);
          return [ () => {
            r(a, i, t, g);
            style(o, g);
            addClass(o, E);
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
          w: wt(r.w),
          h: wt(r.h)
        };
        const l = {
          w: wt(vt(c.w / (t.w / 100))),
          h: wt(vt(c.h / (t.h / 100)))
        };
        const a = getWindowDPR();
        const u = i.w > 2 && i.h > 2;
        const f = !diffBiggerThanOne(l.w, l.h);
        const d = a !== n && a > 0;
        const _ = u && f && d;
        if (_) {
          const [t, n] = s();
          assignDeep(o.k, t);
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

let yt;

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
  const o = addClass(t, H);
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
  const f = {
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
  const d = assignDeep({}, nt);
  const _ = {
    k: l,
    I: u,
    T: a,
    L: "-1" === style(o, "zIndex"),
    B: getRtlScrollBehavior(o, s),
    V: getFlexboxGlue(o, s),
    j: t => e("_", t),
    Y: assignDeep.bind(0, {}, f),
    q(t) {
      assignDeep(f, t);
    },
    F: assignDeep.bind(0, {}, d),
    G(t) {
      assignDeep(d, t);
    },
    N: assignDeep({}, f),
    U: assignDeep({}, d)
  };
  removeAttr(o, "style");
  removeElements(o);
  if (!a && (!u.x || !u.y)) {
    let t;
    window.addEventListener("resize", (() => {
      const n = getPlugins()[pt];
      t = t || n && n.R();
      t && t(_, r, c.bind(0, "_"));
    }));
  }
  return _;
};

const getEnvironment = () => {
  if (!yt) {
    yt = createEnvironment();
  }
  return yt;
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
  const {W: e, X: c} = n;
  const {Y: r, I: i} = getEnvironment();
  const {nativeScrollbarsOverlaid: l, body: a} = r().cancel;
  const u = null != o ? o : l;
  const f = isUndefined(s) ? a : s;
  const d = (i.x || i.y) && u;
  const _ = e && (isNull(f) ? !c : f);
  return !!d || !!_;
};

const mt = createDiv.bind(0, "");

const unwrap = t => {
  appendChildren(parent(t), contents(t));
  removeElements(t);
};

const addDataAttrHost = (t, n) => {
  attr(t, x, n);
  return removeAttr.bind(0, t, x);
};

const createStructureSetupElements = t => {
  const n = getEnvironment();
  const {Y: o, T: s} = n;
  const e = getPlugins()[pt];
  const c = e && e.A;
  const {host: r, viewport: i, padding: l, content: a} = o();
  const u = isHTMLElement(t);
  const f = u ? {} : t;
  const {host: d, padding: _, viewport: h, content: g} = f;
  const v = u ? t : f.target;
  const w = is(v, "textarea");
  const p = v.ownerDocument;
  const b = v === p.body;
  const y = p.defaultView;
  const m = staticInitializationElement.bind(0, [ v ]);
  const S = dynamicInitializationElement.bind(0, [ v ]);
  const O = m(mt, i, h);
  const A = O === v;
  const z = {
    J: v,
    K: w ? m(mt, r, d) : v,
    Z: O,
    tt: !A && S(mt, l, _),
    nt: !A && S(mt, a, g),
    ot: !A && !s && c && c(n),
    st: b ? p.documentElement : O,
    et: b ? p : O,
    ct: y,
    rt: p,
    it: w,
    W: b,
    lt: u,
    X: A,
    ut: (t, n) => A ? hasAttrClass(O, x, n) : hasClass(O, t),
    ft: (t, n, o) => A ? attrClass(O, x, n, o) : (o ? addClass : removeClass)(O, t)
  };
  const E = keys(z).reduce(((t, n) => {
    const o = z[n];
    return push(t, o && !parent(o) ? o : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(E, t) > -1 : null;
  const {J: P, K: D, tt: M, Z: R, nt: k, ot: B} = z;
  const V = [];
  const j = w && elementIsGenerated(D);
  const Y = w ? P : contents([ k, R, M, D, P ].find((t => false === elementIsGenerated(t))));
  const q = k || R;
  const appendElements = () => {
    const t = addDataAttrHost(D, A ? "viewport" : "host");
    const n = addClass(M, T);
    const o = addClass(R, !A && I);
    const e = addClass(k, L);
    const c = b ? addClass(parent(v), H) : noop;
    if (j) {
      insertAfter(P, D);
      push(V, (() => {
        insertAfter(D, P);
        removeElements(D);
      }));
    }
    appendChildren(q, Y);
    appendChildren(D, M);
    appendChildren(M || D, !A && R);
    appendChildren(R, k);
    push(V, (() => {
      c();
      t();
      removeAttr(R, $);
      removeAttr(R, C);
      if (elementIsGenerated(k)) {
        unwrap(k);
      }
      if (elementIsGenerated(R)) {
        unwrap(R);
      }
      if (elementIsGenerated(M)) {
        unwrap(M);
      }
      n();
      o();
      e();
    }));
    if (s && !A) {
      push(V, removeClass.bind(0, R, H));
    }
    if (B) {
      insertBefore(R, B);
      push(V, removeElements.bind(0, B));
    }
  };
  return [ z, appendElements, runEachAndClear.bind(0, V) ];
};

const createTrinsicUpdateSegment = (t, n) => {
  const {nt: o} = t;
  const [s] = n;
  return t => {
    const {V: n} = getEnvironment();
    const {dt: e} = s();
    const {_t: c} = t;
    const r = (o || !n) && c;
    if (r) {
      style(o, {
        height: e ? "" : "100%"
      });
    }
    return {
      ht: r,
      gt: r
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
    let [u, f] = a(e);
    const {T: d, V: _} = getEnvironment();
    const {vt: h} = o();
    const {ht: g, gt: v, wt: w} = t;
    const [p, b] = n("paddingAbsolute");
    const y = !_ && v;
    if (g || f || y) {
      [u, f] = l(e);
    }
    const m = !i && (b || w || f);
    if (m) {
      const t = !p || !c && !d;
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
        bt: !t,
        P: c ? i : assignDeep({}, e, i)
      });
    }
    return {
      yt: m
    };
  };
};

const {max: St} = Math;

const xt = St.bind(0, 0);

const $t = "visible";

const Ct = "hidden";

const Ot = 42;

const At = {
  u: equalWH,
  o: {
    w: 0,
    h: 0
  }
};

const zt = {
  u: equalXY,
  o: {
    x: Ct,
    y: Ct
  }
};

const getOverflowAmount = (t, n) => {
  const o = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const s = {
    w: xt(t.w - n.w),
    h: xt(t.h - n.h)
  };
  return {
    w: s.w > o ? s.w : 0,
    h: s.h > o ? s.h : 0
  };
};

const conditionalClass = (t, n, o) => o ? addClass(t, n) : removeClass(t, n);

const overflowIsVisible = t => 0 === t.indexOf($t);

const createOverflowUpdateSegment = (t, n) => {
  const [o, s] = n;
  const {K: e, tt: c, Z: r, ot: i, X: l, ft: a} = t;
  const {k: u, V: f, T: d, I: _} = getEnvironment();
  const h = getPlugins()[pt];
  const g = !l && !d && (_.x || _.y);
  const [v, w] = createCache(At, fractionalSize.bind(0, r));
  const [p, b] = createCache(At, scrollSize.bind(0, r));
  const [y, m] = createCache(At);
  const [S, z] = createCache(At);
  const [T] = createCache(zt);
  const fixFlexboxGlue = (t, n) => {
    style(r, {
      height: ""
    });
    if (n) {
      const {bt: n, tt: s} = o();
      const {St: c, D: i} = t;
      const l = fractionalSize(e);
      const a = clientSize(e);
      const u = "content-box" === style(r, "boxSizing");
      const f = n || u ? s.b + s.t : 0;
      const d = !(_.x && u);
      style(r, {
        height: a.h + l.h + (c.x && d ? i.x : 0) - f
      });
    }
  };
  const getViewportOverflowState = (t, n) => {
    const o = !d && !t ? Ot : 0;
    const getStatePerAxis = (t, s, e) => {
      const c = style(r, t);
      const i = n ? n[t] : c;
      const l = "scroll" === i;
      const a = s ? o : e;
      const u = l && !d ? a : 0;
      const f = s && !!o;
      return [ c, l, u, f ];
    };
    const [s, e, c, i] = getStatePerAxis("overflowX", _.x, u.x);
    const [l, a, f, h] = getStatePerAxis("overflowY", _.y, u.y);
    return {
      xt: {
        x: s,
        y: l
      },
      St: {
        x: e,
        y: a
      },
      D: {
        x: c,
        y: f
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
      const s = n && o && t.replace(`${$t}-`, "") || "";
      return [ n && !o ? t : "", overflowIsVisible(s) ? "hidden" : s ];
    };
    const [e, c] = setAxisOverflowStyle(o.x, n.x);
    const [r, i] = setAxisOverflowStyle(o.y, n.y);
    s.overflowX = c && r ? c : e;
    s.overflowY = i && e ? i : r;
    return getViewportOverflowState(t, s);
  };
  const hideNativeScrollbars = (t, n, s, e) => {
    const {D: c, M: r} = t;
    const {x: i, y: l} = r;
    const {x: a, y: u} = c;
    const {P: f} = o();
    const d = n ? "marginLeft" : "marginRight";
    const _ = n ? "paddingLeft" : "paddingRight";
    const h = f[d];
    const g = f.marginBottom;
    const v = f[_];
    const w = f.paddingBottom;
    e.width = `calc(100% + ${u + -1 * h}px)`;
    e[d] = -u + h;
    e.marginBottom = -a + g;
    if (s) {
      e[_] = v + (l ? u : 0);
      e.paddingBottom = w + (i ? a : 0);
    }
  };
  const [I, E] = h ? h.H(g, f, r, i, o, getViewportOverflowState, hideNativeScrollbars) : [ () => g, () => [ noop ] ];
  return (t, n, i) => {
    const {ht: u, $t: h, gt: g, yt: L, _t: D, wt: M} = t;
    const {dt: R, vt: k} = o();
    const [B, V] = n("showNativeOverlaidScrollbars");
    const [j, Y] = n("overflow");
    const q = B && _.x && _.y;
    const F = !l && !f && (u || g || h || V || D);
    const G = overflowIsVisible(j.x);
    const N = overflowIsVisible(j.y);
    const U = G || N;
    let W = w(i);
    let X = b(i);
    let J = m(i);
    let K = z(i);
    let Z;
    if (V && d) {
      a(H, A, !q);
    }
    if (F) {
      Z = getViewportOverflowState(q);
      fixFlexboxGlue(Z, R);
    }
    if (u || L || g || M || V) {
      if (U) {
        a(P, O, false);
      }
      const [t, n] = E(q, k, Z);
      const [o, s] = W = v(i);
      const [e, c] = X = p(i);
      const l = clientSize(r);
      let u = e;
      let f = l;
      t();
      if ((c || s || V) && n && !q && I(n, e, o, k)) {
        f = clientSize(r);
        u = scrollSize(r);
      }
      const d = {
        w: xt(St(e.w, u.w) + o.w),
        h: xt(St(e.h, u.h) + o.h)
      };
      const _ = {
        w: xt(f.w + xt(l.w - e.w) + o.w),
        h: xt(f.h + xt(l.h - e.h) + o.h)
      };
      K = S(_);
      J = y(getOverflowAmount(d, _), i);
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
    if (L || M || rt || et || tt || ot || Y || V || F) {
      const t = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: "",
        overflowY: "",
        overflowX: ""
      };
      const n = setViewportOverflowState(q, it, j, t);
      const o = I(n, st, ct, k);
      if (!l) {
        hideNativeScrollbars(n, k, o, t);
      }
      if (F) {
        fixFlexboxGlue(n, R);
      }
      if (l) {
        attr(e, $, t.overflowX);
        attr(e, C, t.overflowY);
      } else {
        style(r, t);
      }
    }
    attrClass(e, x, O, lt);
    conditionalClass(c, P, lt);
    !l && conditionalClass(r, P, U);
    const [at, ut] = T(getViewportOverflowState(q).xt);
    s({
      xt: at,
      Ct: {
        x: Q.w,
        y: Q.h
      },
      Ot: {
        x: nt.w,
        y: nt.h
      },
      At: it
    });
    return {
      zt: ut,
      Tt: tt,
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
  const {Z: o, ft: s} = t;
  const {T: e, I: c, V: r} = getEnvironment();
  const i = !e && (c.x || c.y);
  const l = [ createTrinsicUpdateSegment(t, n), createPaddingUpdateSegment(t, n), createOverflowUpdateSegment(t, n) ];
  return (t, n, e) => {
    const c = prepareUpdateHints(assignDeep({
      ht: false,
      yt: false,
      wt: false,
      _t: false,
      Tt: false,
      It: false,
      zt: false,
      $t: false,
      gt: false
    }, n), {}, e);
    const a = i || !r;
    const u = a && scrollLeft(o);
    const f = a && scrollTop(o);
    s("", z, true);
    let d = c;
    each(l, (n => {
      d = prepareUpdateHints(d, n(d, t, !!e) || {}, e);
    }));
    scrollLeft(o, u);
    scrollTop(o, f);
    s("", z);
    return d;
  };
};

const Tt = 3333333;

const getElmDirectionIsRTL = t => "rtl" === style(t, "direction");

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, o) => {
  const {Et: s = false, Lt: e = false} = o || {};
  const c = getPlugins()[_t];
  const {B: r} = getEnvironment();
  const i = createDOM(`<div class="${D}"><div class="${R}"></div></div>`);
  const l = i[0];
  const a = l.firstChild;
  const f = getElmDirectionIsRTL.bind(0, l);
  const [d] = createCache({
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
      const [n, , o] = d(t.pop().contentRect);
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
      scrollLeft(l, n ? r.n ? -Tt : r.i ? 0 : Tt : Tt);
      scrollTop(l, Tt);
    }
    if (!c) {
      n({
        ht: !e,
        Ht: e ? t : void 0,
        Lt: !!i
      });
    }
  };
  const _ = [];
  let h = e ? onSizeChangedCallbackProxy : false;
  let g;
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
      const [t, n] = c.O(a, onSizeChangedCallbackProxy, e);
      h = t;
      push(_, n);
    }
    if (s) {
      g = createCache({
        o: !f()
      }, f);
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
      addClass(l, M);
      push(_, on(l, "animationstart", h, {
        C: !!u
      }));
    }
    appendChildren(t, l);
  } ];
};

const isHeightIntrinsic = t => 0 === t.h || t.isIntersecting || t.intersectionRatio > 0;

const createTrinsicObserver = (t, n) => {
  let o;
  const s = createDiv(j);
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
  const {Pt: c, Dt: r, Mt: i, Rt: a, kt: u, Bt: f} = s || {};
  const d = debounce((() => {
    if (e) {
      o(true);
    }
  }), {
    g: 33,
    v: 99
  });
  const [_, h] = createEventContentChange(t, d, i);
  const g = c || [];
  const v = r || [];
  const w = g.concat(v);
  const observerCallback = (e, c) => {
    const r = u || noop;
    const i = f || noop;
    const l = [];
    const d = [];
    let _ = false;
    let g = false;
    let w = false;
    each(e, (o => {
      const {attributeName: e, target: c, type: u, oldValue: f, addedNodes: h} = o;
      const p = "attributes" === u;
      const b = "childList" === u;
      const y = t === c;
      const m = p && isString(e) ? attr(c, e) : 0;
      const S = 0 !== m && f !== m;
      const x = indexOf(v, e) > -1 && S;
      if (n && !y) {
        const n = !p;
        const l = p && x;
        const u = l && a && is(c, a);
        const _ = u ? !r(c, e, f, m) : n || l;
        const v = _ && !i(o, !!u, t, s);
        push(d, h);
        g = g || v;
        w = w || b;
      }
      if (!n && y && S && !r(c, e, f, m)) {
        push(l, e);
        _ = _ || x;
      }
    }));
    if (w && !isEmptyArray(d)) {
      h((t => d.reduce(((n, o) => {
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
      d.m();
      const t = p.takeRecords();
      return !isEmptyArray(t) && observerCallback(t, true);
    }
  } ];
};

const It = `[${x}]`;

const Et = `.${I}`;

const Lt = [ "tabindex" ];

const Ht = [ "wrap", "cols", "rows" ];

const Pt = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, o) => {
  let s;
  let e;
  let c;
  const [, r] = n;
  const {K: i, Z: l, nt: a, it: f, X: d, ut: _, ft: h} = t;
  const {V: g} = getEnvironment();
  const [v] = createCache({
    u: equalWH,
    o: {
      w: 0,
      h: 0
    }
  }, (() => {
    const t = _(P, O);
    const n = _(E, "");
    const o = n && scrollLeft(l);
    const s = n && scrollTop(l);
    h(P, O);
    h(E, "");
    h("", z, true);
    const e = scrollSize(a);
    const c = scrollSize(l);
    const r = fractionalSize(l);
    h(P, O, t);
    h(E, "", n);
    h("", z);
    scrollLeft(l, o);
    scrollTop(l, s);
    return {
      w: c.w + e.w + r.w,
      h: c.h + e.h + r.h
    };
  }));
  const w = f ? Ht : Pt.concat(Ht);
  const p = debounce(o, {
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
    each(t || Lt, (t => {
      if (indexOf(Lt, t) > -1) {
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
      _t: e
    };
    r({
      dt: s
    });
    !n && o(c);
    return c;
  };
  const onSizeChanged = ({ht: t, Ht: n, Lt: s}) => {
    const e = !t || s ? o : p;
    let c = false;
    if (n) {
      const [t, o] = n;
      c = o;
      r({
        vt: t
      });
    }
    e({
      ht: t,
      wt: c
    });
  };
  const onContentMutation = (t, n) => {
    const [, s] = v();
    const e = {
      gt: s
    };
    const c = t ? o : p;
    if (s) {
      !n && c(e);
    }
    return e;
  };
  const onHostMutation = (t, n, o) => {
    const s = {
      $t: n
    };
    if (n) {
      !o && p(s);
    } else if (!d) {
      updateViewportAttrsFromHost(t);
    }
    return s;
  };
  const [b, y, m] = a || !g ? createTrinsicObserver(i, onTrinsicChanged) : [ noop, noop, noop ];
  const [S, x] = !d ? createSizeObserver(i, onSizeChanged, {
    Lt: true,
    Et: true
  }) : [ noop, noop ];
  const [$, C] = createDOMObserver(i, false, onHostMutation, {
    Dt: Pt,
    Pt: Pt.concat(Lt)
  });
  const A = d && u && new u(onSizeChanged.bind(0, {
    ht: true
  }));
  A && A.observe(i);
  updateViewportAttrsFromHost();
  return [ () => {
    b();
    S();
    c && c[0]();
    A && A.disconnect();
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
    const [f, d] = t("updating.debounce");
    const _ = u || r;
    const ignoreMutationFromOptions = t => isFunction(n) && n(t);
    if (_) {
      if (c) {
        c[1]();
        c[0]();
      }
      c = createDOMObserver(a || l, true, onContentMutation, {
        Dt: w.concat(o || []),
        Pt: w.concat(o || []),
        Mt: i,
        Rt: It,
        Bt: (t, n) => {
          const {target: o, attributeName: s} = t;
          const e = !n && s ? liesBetween(o, It, Et) : false;
          return e || !!closest(o, `.${Y}`) || !!ignoreMutationFromOptions(t);
        }
      });
    }
    if (d) {
      p.m();
      if (isArray(f)) {
        const t = f[0];
        const n = f[1];
        s = isNumber(t) ? t : false;
        e = isNumber(n) ? n : false;
      } else if (isNumber(f)) {
        s = f;
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

const Mt = {
  tt: {
    t: 0,
    r: 0,
    b: 0,
    l: 0
  },
  bt: false,
  P: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  Ct: Dt,
  Ot: Dt,
  xt: {
    x: "hidden",
    y: "hidden"
  },
  At: {
    x: false,
    y: false
  },
  dt: false,
  vt: false
};

const createStructureSetup = (t, n) => {
  const o = createOptionCheck(n, {});
  const s = createState(Mt);
  const [e, c, r] = createEventListenerHub();
  const [i] = s;
  const [l, a, u] = createStructureSetupElements(t);
  const f = createStructureSetupUpdate(l, s);
  const triggerUpdateEvent = (t, n, o) => {
    const s = keys(t).some((n => t[n]));
    if (s || !isEmptyObject(n) || o) {
      r("u", [ t, n, o ]);
    }
  };
  const [d, _, h, g] = createStructureSetupObservers(l, s, (t => {
    triggerUpdateEvent(f(o, t), {}, false);
  }));
  const v = i.bind(0);
  v.Vt = t => {
    e("u", t);
  };
  v.jt = () => {
    _();
    a();
  };
  v.Yt = l;
  return [ (t, o) => {
    const s = createOptionCheck(n, t, o);
    g(s);
    triggerUpdateEvent(f(s, h(), o), t, !!o);
  }, v, () => {
    c();
    d();
    u();
  } ];
};

const {round: Rt, abs: kt} = Math;

const getPageOffset = t => ({
  x: t.pageX,
  y: t.pageY
});

const getScale = t => {
  const {width: n, height: o} = getBoundingClientRect(t);
  const {w: s, h: e} = offsetSize(t);
  return {
    x: Rt(n) / s || 1,
    y: Rt(o) / e || 1
  };
};

const continuePointerDown = (t, n, o) => {
  const s = n.scrollbars;
  const {button: e, isPrimary: c, pointerType: r} = t;
  const {pointers: i} = s;
  return 0 === e && c && s[o] && (i || []).includes(r);
};

const createRootClickStopPropagationEvents = (t, n) => on(t, "mousedown", on.bind(0, n, "click", stopPropagation, {
  C: true,
  $: true
}), {
  $: true
});

const createDragScrollingEvents = (t, n, o, s, e, c) => {
  const {B: r} = getEnvironment();
  const {qt: i, Ft: l, Gt: a} = o;
  const u = `scroll${c ? "Left" : "Top"}`;
  const f = `${c ? "x" : "y"}`;
  const d = `${c ? "w" : "h"}`;
  const createOnPointerMoveHandler = (t, n, o) => _ => {
    const {Ot: h} = e();
    const g = (getPageOffset(_)[f] - n) * o;
    const v = offsetSize(l)[d] - offsetSize(i)[d];
    const w = g / v;
    const p = w * h[f];
    const b = "rtl" === style(a, "direction");
    const y = b && c ? r.n || r.i ? 1 : -1 : 1;
    s[u] = kt(t) + p * y;
  };
  return on(i, "pointerdown", (o => {
    if (continuePointerDown(o, t, "dragScroll")) {
      const t = on(n, "selectstart", (t => preventDefault(t)), {
        S: false
      });
      const e = on(i, "pointermove", createOnPointerMoveHandler(s[u] || 0, getPageOffset(o)[f], 1 / getScale(s)[f]));
      on(i, "pointerup", (n => {
        t();
        e();
        i.releasePointerCapture(n.pointerId);
      }), {
        C: true
      });
      i.setPointerCapture(o.pointerId);
    }
  }));
};

const createScrollbarsSetupEvents = (t, n) => (o, s, e, c, r) => {
  const {Gt: i} = o;
  return runEachAndClear.bind(0, [ on(i, "pointerenter", (() => {
    s(J, true);
  })), on(i, "pointerleave pointercancel", (() => {
    s(J);
  })), createRootClickStopPropagationEvents(i, e), createDragScrollingEvents(t, e, o, c, n, r) ]);
};

const {min: Bt, max: Vt, abs: jt} = Math;

const getScrollbarHandleLengthRatio = (t, n, o, s) => {
  if (s) {
    const t = o ? "x" : "y";
    const {Ot: n, Ct: e} = s;
    const c = e[t];
    const r = n[t];
    return Vt(0, Bt(1, c / (c + r)));
  }
  const e = o ? "w" : "h";
  const c = offsetSize(t)[e];
  const r = offsetSize(n)[e];
  return Vt(0, Bt(1, c / r));
};

const getScrollbarHandleOffsetRatio = (t, n, o, s, e, c) => {
  const {B: r} = getEnvironment();
  const i = c ? "x" : "y";
  const l = c ? "Left" : "Top";
  const {Ot: a} = s;
  const u = Math.floor(a[i]);
  const f = jt(o[`scroll${l}`]);
  const d = c && e;
  const _ = r.i ? f : u - f;
  const h = d ? _ : f;
  const g = Bt(1, h / u);
  const v = getScrollbarHandleLengthRatio(t, n, c);
  return 1 / v * (1 - v) * g;
};

const createScrollbarsSetupElements = (t, n, o) => {
  const {Y: s} = getEnvironment();
  const {scrollbarsSlot: e} = s();
  const {rt: c, J: r, K: i, Z: l, lt: a, st: u} = n;
  const {scrollbarsSlot: f} = a ? {} : t;
  const d = dynamicInitializationElement([ r, i, l ], (() => i), e, f);
  const scrollbarStructureAddRemoveClass = (t, n, o) => {
    const s = o ? addClass : removeClass;
    each(t, (t => {
      s(t.Gt, n);
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
      const {qt: s, Ft: e} = t;
      return [ s, {
        [o ? "width" : "height"]: `${(100 * getScrollbarHandleLengthRatio(s, e, o, n)).toFixed(3)}%`
      } ];
    }));
  };
  const scrollbarStructureRefreshHandleOffset = (t, n, o) => {
    const s = o ? "X" : "Y";
    scrollbarsHandleStyle(t, (t => {
      const {qt: e, Ft: c, Gt: r} = t;
      const i = getScrollbarHandleOffsetRatio(e, c, u, n, "rtl" === style(r, "direction"), o);
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
    const n = t ? q : F;
    const s = t ? g : v;
    const e = isEmptyArray(s) ? X : "";
    const r = createDiv(`${Y} ${n} ${e}`);
    const i = createDiv(G);
    const l = createDiv(N);
    const a = {
      Gt: r,
      Ft: i,
      qt: l
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
    appendChildren(d, g[0].Gt);
    appendChildren(d, v[0].Gt);
    _((() => {
      scrollbarsAddRemoveClass(X);
    }), 300);
  };
  w();
  p();
  return [ {
    Nt: refreshScrollbarsHandleLength,
    Ut: refreshScrollbarsHandleOffset,
    Wt: scrollbarsAddRemoveClass,
    Xt: {
      Jt: g,
      Kt: w,
      Zt: scrollbarsHandleStyle.bind(0, g)
    },
    Qt: {
      Jt: v,
      Kt: p,
      Zt: scrollbarsHandleStyle.bind(0, v)
    }
  }, appendElements, runEachAndClear.bind(0, h) ];
};

const createSelfCancelTimeout = t => {
  let n;
  const o = t ? _ : d;
  const s = t ? h : f;
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
  const [f, d] = createSelfCancelTimeout();
  const [_, h] = createSelfCancelTimeout();
  const [g, v] = createSelfCancelTimeout(100);
  const [w, p] = createSelfCancelTimeout(100);
  const [b, y] = createSelfCancelTimeout((() => l));
  const [m, S, x] = createScrollbarsSetupElements(t, o.Yt, createScrollbarsSetupEvents(n, o));
  const {K: $, Z: C, st: O, et: A, X: z, W: T} = o.Yt;
  const {Xt: I, Qt: E, Wt: L, Nt: H, Ut: P} = m;
  const {Zt: D} = I;
  const {Zt: M} = E;
  const styleScrollbarPosition = t => {
    const {Gt: n} = t;
    const o = z && !T && parent(n) === C && n;
    return [ o, {
      transform: o ? `translate(${scrollLeft(O)}px, ${scrollTop(O)}px)` : ""
    } ];
  };
  const manageScrollbarsAutoHide = (t, n) => {
    y();
    if (t) {
      L(Z);
    } else {
      const hide = () => L(Z, true);
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
  const R = [ v, y, p, h, d, x, on($, "mouseover", onHostMouseEnter, {
    C: true
  }), on($, "mouseenter", onHostMouseEnter), on($, "mouseleave", (() => {
    r = false;
    e && manageScrollbarsAutoHide(false);
  })), on($, "mousemove", (() => {
    s && f((() => {
      v();
      manageScrollbarsAutoHide(true);
      w((() => {
        s && manageScrollbarsAutoHide(false);
      }));
    }));
  })), on(A, "scroll", (() => {
    _((() => {
      P(o());
      c && manageScrollbarsAutoHide(true);
      g((() => {
        c && !r && manageScrollbarsAutoHide(false);
      }));
    }));
    z && D(styleScrollbarPosition);
    z && M(styleScrollbarPosition);
  })) ];
  const k = u.bind(0);
  k.Yt = m;
  k.jt = S;
  return [ (t, r, a) => {
    const {Tt: u, It: f, zt: d, wt: _} = a;
    const h = createOptionCheck(n, t, r);
    const g = o();
    const {Ot: v, xt: w} = g;
    const [p, b] = h("scrollbars.theme");
    const [y, m] = h("scrollbars.visibility");
    const [S, x] = h("scrollbars.autoHide");
    const [$] = h("scrollbars.autoHideDelay");
    const [C, O] = h("scrollbars.dragScroll");
    const [A, z] = h("scrollbars.clickScroll");
    const T = u || f || _;
    const I = d || m;
    const setScrollbarVisibility = (t, n) => {
      const o = "visible" === y || "auto" === y && "scroll" === t;
      L(U, o, n);
      return o;
    };
    l = $;
    if (b) {
      L(i);
      L(p, true);
      i = p;
    }
    if (x) {
      s = "move" === S;
      e = "leave" === S;
      c = "never" !== S;
      manageScrollbarsAutoHide(!c, true);
    }
    if (O) {
      L(tt, C);
    }
    if (z) {
      L(Q, A);
    }
    if (I) {
      const t = setScrollbarVisibility(w.x, true);
      const n = setScrollbarVisibility(w.y, false);
      const o = t && n;
      L(W, !o);
    }
    if (T) {
      H(g);
      P(g);
      L(K, !v.x, true);
      L(K, !v.y, false);
    }
  }, k, runEachAndClear.bind(0, R) ];
};

const Yt = new Set;

const qt = new WeakMap;

const addInstance = (t, n) => {
  qt.set(t, n);
  Yt.add(t);
};

const removeInstance = t => {
  qt.delete(t);
  Yt.delete(t);
};

const getInstance = t => qt.get(t);

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
  const u = r[ut];
  const validateOptions = t => {
    const n = t || {};
    const o = u && u.O;
    return o ? o(n, true) : n;
  };
  const f = assignDeep({}, e(), validateOptions(n));
  const [d, _, h] = createEventListenerHub(o);
  const [g, v, w] = createStructureSetup(t, f);
  const [p, b, y] = createScrollbarsSetup(t, f, v);
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
        const n = getOptionsDiff(f, validateOptions(t));
        if (!isEmptyObject(n)) {
          assignDeep(f, n);
          update(n);
        }
      }
      return assignDeep({}, f);
    },
    on: d,
    off: (t, n) => {
      t && n && _(t, n);
    },
    state() {
      const {Ct: t, Ot: n, xt: o, At: e, tt: c, bt: r} = v();
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
      const {J: t, K: n, tt: o, Z: s, nt: e} = v.Yt;
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
  if (cancelInitialization(!i && t.cancel, v.Yt)) {
    destroy(true);
    return S;
  }
  v.jt();
  b.jt();
  addInstance(l, S);
  h("initialized", [ S ]);
  v.Vt(((t, n, o) => {
    const {ht: s, wt: e, _t: c, Tt: r, It: i, zt: l, gt: a, $t: u} = t;
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
  const {k: t, I: n, T: o, B: s, V: e, L: c, N: r, U: i, Y: l, q: a, F: u, G: f} = getEnvironment();
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
    setDefaultOptions: f
  });
};

export { OverlayScrollbars, bt as scrollbarsHidingPlugin, ht as sizeObserverPlugin };
//# sourceMappingURL=overlayscrollbars.esm.js.map
