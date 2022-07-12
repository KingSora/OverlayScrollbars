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

function getDefaultExportFromCjs(t) {
  return t && t.o && Object.prototype.hasOwnProperty.call(t, "default") ? t["default"] : t;
}

const createCache = (t, n) => {
  const {u: o, _: s, g: e} = t;
  let c = o;
  let i;
  const cacheUpdateContextual = (t, n) => {
    const o = c;
    const r = t;
    const l = n || (s ? !s(o, r) : o !== r);
    if (l || e) {
      c = r;
      i = o;
    }
    return [ c, l, i ];
  };
  const cacheUpdateIsolated = t => cacheUpdateContextual(n(c, i), t);
  const getCurrentCache = t => [ c, !!t, i ];
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
  const i = o.call(t, s);
  const r = c && o.call(c, "isPrototypeOf");
  if (e && !i && !r) {
    return false;
  }
  for (n in t) {}
  return isUndefined(n) || o.call(t, n);
};

const isHTMLElement = n => {
  const o = window.HTMLElement;
  return n ? o ? n instanceof o : n.nodeType === t : false;
};

const isElement = n => {
  const o = window.Element;
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

const assignDeep = (t, n, o, s, e, c, i) => {
  const r = [ n, o, s, e, c, i ];
  if (("object" !== typeof t || isNull(t)) && !isFunction(t)) {
    t = {};
  }
  each(r, (n => {
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
  o && (o[t] = s);
};

const attr = (t, n, o) => {
  if (isUndefined(o)) {
    return t ? t.getAttribute(n) : null;
  }
  t && t.setAttribute(n, o);
};

const attrClass = (t, n, o, s) => {
  const e = attr(t, n) || "";
  const c = new Set(e.split(" "));
  c[s ? "add" : "delete"](o);
  attr(t, n, from(c).join(" ").trim());
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

const i = {};

const r = {};

const cssProperty = t => {
  let n = r[t];
  if (hasOwnProperty(r, t)) {
    return n;
  }
  const o = firstLetterToUpper(t);
  const s = getDummyStyle();
  each(e, (e => {
    const c = e.replace(/-/g, "");
    const i = [ t, e + t, c + o, firstLetterToUpper(c) + o ];
    return !(n = i.find((t => void 0 !== s[t])));
  }));
  return r[t] = n || "";
};

const jsAPI = t => {
  let n = i[t] || window[t];
  if (hasOwnProperty(i, t)) {
    return n;
  }
  each(c, (o => {
    n = n || window[o + firstLetterToUpper(t)];
    return !n;
  }));
  i[t] = n;
  return n;
};

const l = jsAPI("MutationObserver");

const a = jsAPI("IntersectionObserver");

const f = jsAPI("ResizeObserver");

const u = jsAPI("cancelAnimationFrame");

const d = jsAPI("requestAnimationFrame");

const _ = /[^\x20\t\r\n\f]+/g;

const classListAction = (t, n, o) => {
  let s;
  let e = 0;
  let c = false;
  if (t && n && isString(n)) {
    const i = n.match(_) || [];
    c = i.length > 0;
    while (s = i[e++]) {
      c = !!o(t.classList, s) && c;
    }
  }
  return c;
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
      const i = s ? s(n[o]) : n[o];
      if (c !== i) {
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

const clearTimeouts = t => {
  t && window.clearTimeout(t);
  t && u(t);
};

const noop = () => {};

const debounce = (t, n) => {
  let o;
  let s;
  let e;
  let c;
  const {v: i, p: r, m: l} = n || {};
  const a = window.setTimeout;
  const f = function invokeFunctionToDebounce(n) {
    clearTimeouts(o);
    clearTimeouts(s);
    s = o = e = void 0;
    t.apply(this, n);
  };
  const mergeParms = t => l && e ? l(e, t) : t;
  const flush = () => {
    if (o) {
      f(mergeParms(c) || c);
    }
  };
  const u = function debouncedFn() {
    const t = from(arguments);
    const n = isFunction(i) ? i() : i;
    const l = isNumber(n) && n >= 0;
    if (l) {
      const i = isFunction(r) ? r() : r;
      const l = isNumber(i) && i >= 0;
      const u = n > 0 ? a : d;
      const _ = mergeParms(t);
      const g = _ || t;
      const h = f.bind(0, g);
      clearTimeouts(o);
      o = u(h, n);
      if (l && !s) {
        s = a(flush, i);
      }
      e = c = g;
    } else {
      f(t);
    }
  };
  u.S = flush;
  return u;
};

const g = {
  opacity: 1,
  zindex: 1
};

const parseToZeroOrNumber = (t, n) => {
  const o = n ? parseFloat(t) : parseInt(t, 10);
  return o === o ? o : 0;
};

const adaptCSSVal = (t, n) => !g[t.toLowerCase()] && isNumber(n) ? `${n}px` : n;

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
  const i = `${s}right${e}`;
  const r = `${s}bottom${e}`;
  const l = `${s}left${e}`;
  const a = style(t, [ c, i, r, l ]);
  return {
    t: parseToZeroOrNumber(a[c]),
    r: parseToZeroOrNumber(a[i]),
    b: parseToZeroOrNumber(a[r]),
    l: parseToZeroOrNumber(a[l])
  };
};

const h = {
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
} : h;

const clientSize = t => t ? {
  w: t.clientWidth,
  h: t.clientHeight
} : h;

const scrollSize = t => t ? {
  w: t.scrollWidth,
  h: t.scrollHeight
} : h;

const fractionalSize = t => {
  const n = parseFloat(style(t, "height")) || 0;
  const o = parseFloat(style(t, "height")) || 0;
  return {
    w: o - Math.round(o),
    h: n - Math.round(n)
  };
};

const getBoundingClientRect = t => t.getBoundingClientRect();

let v;

const supportPassiveEvents = () => {
  if (isUndefined(v)) {
    v = false;
    try {
      window.addEventListener("test", null, Object.defineProperty({}, "passive", {
        get() {
          v = true;
        }
      }));
    } catch (t) {}
  }
  return v;
};

const splitEventNames = t => t.split(" ");

const off = (t, n, o, s) => {
  each(splitEventNames(n), (n => {
    t.removeEventListener(n, o, s);
  }));
};

const on = (t, n, o, s) => {
  const e = supportPassiveEvents();
  const c = e && s && s.C || false;
  const i = s && s.$ || false;
  const r = s && s.O || false;
  const l = [];
  const a = e ? {
    passive: c,
    capture: i
  } : i;
  each(splitEventNames(n), (n => {
    const s = r ? e => {
      t.removeEventListener(n, s, i);
      o && o(e);
    } : o;
    push(l, off.bind(null, t, n, s, i));
    t.addEventListener(n, s, a);
  }));
  return runEachAndClear.bind(0, l);
};

const stopPropagation = t => t.stopPropagation();

const preventDefault = t => t.preventDefault();

const stopAndPrevent = t => stopPropagation(t) || preventDefault(t);

const w = {
  x: 0,
  y: 0
};

const absoluteCoordinates = t => {
  const n = t ? getBoundingClientRect(t) : 0;
  return n ? {
    x: n.left + window.pageYOffset,
    y: n.top + window.pageXOffset
  } : w;
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

const p = "os-environment";

const b = `${p}-flexbox-glue`;

const y = `${b}-max`;

const m = "data-overlayscrollbars";

const S = `${m}-overflow-x`;

const x = `${m}-overflow-y`;

const C = "overflowVisible";

const $ = "viewportStyled";

const O = "os-padding";

const z = "os-viewport";

const A = `${z}-arrange`;

const I = "os-content";

const T = `${z}-scrollbar-styled`;

const P = `os-overflow-visible`;

const L = "os-size-observer";

const M = `${L}-appear`;

const H = `${L}-listener`;

const E = `${H}-scroll`;

const R = `${H}-item`;

const D = `${R}-final`;

const j = "os-trinsic-observer";

const V = "os-scrollbar";

const B = `${V}-horizontal`;

const k = `${V}-vertical`;

const F = "os-scrollbar-track";

const Y = "os-scrollbar-handle";

const opsStringify = t => JSON.stringify(t, ((t, n) => {
  if (isFunction(n)) {
    throw new Error;
  }
  return n;
}));

const q = {
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
        } catch (i) {}
      }
      if (t) {
        o[s] = c;
      }
    }
  }));
  return o;
};

let G;

const {abs: N, round: U} = Math;

const diffBiggerThanOne = (t, n) => {
  const o = N(t);
  const s = N(n);
  return !(o === s || o + 1 === s || o - 1 === s);
};

const getNativeScrollbarSize = (t, n, o) => {
  appendChildren(t, n);
  const s = clientSize(n);
  const e = offsetSize(n);
  const c = fractionalSize(o);
  return {
    x: e.h - s.h + c.h,
    y: e.w - s.w + c.w
  };
};

const getNativeScrollbarsHiding = t => {
  let n = false;
  const o = addClass(t, T);
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
  const o = addClass(t, b);
  const s = getBoundingClientRect(t);
  const e = getBoundingClientRect(n);
  const c = equalBCRWH(e, s, true);
  const i = addClass(t, y);
  const r = getBoundingClientRect(t);
  const l = getBoundingClientRect(n);
  const a = equalBCRWH(l, r, true);
  o();
  i();
  return c && a;
};

const getWindowDPR = () => {
  const t = window.screen.deviceXDPI || 0;
  const n = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || t / n;
};

const createEnvironment = () => {
  const {body: t} = document;
  const n = createDOM(`<div class="${p}"><div></div></div>`);
  const o = n[0];
  const s = o.firstChild;
  const [e, , c] = createEventListenerHub();
  const [i, r] = createCache({
    u: getNativeScrollbarSize(t, o, s),
    _: equalXY
  });
  const [l] = r();
  const a = getNativeScrollbarsHiding(o);
  const f = {
    x: 0 === l.x,
    y: 0 === l.y
  };
  const u = {
    A: !a,
    I: false
  };
  const d = assignDeep({}, q);
  const _ = {
    T: l,
    P: f,
    L: a,
    M: "-1" === style(o, "zIndex"),
    H: getRtlScrollBehavior(o, s),
    R: getFlexboxGlue(o, s),
    D: t => e("_", t),
    j: assignDeep.bind(0, {}, u),
    V(t) {
      assignDeep(u, t);
    },
    B: assignDeep.bind(0, {}, d),
    k(t) {
      assignDeep(d, t);
    },
    F: assignDeep({}, u),
    Y: assignDeep({}, d)
  };
  removeAttr(o, "style");
  removeElements(o);
  if (!a && (!f.x || !f.y)) {
    let n = windowSize();
    let e = getWindowDPR();
    window.addEventListener("resize", (() => {
      const r = windowSize();
      const l = {
        w: r.w - n.w,
        h: r.h - n.h
      };
      if (0 === l.w && 0 === l.h) {
        return;
      }
      const a = {
        w: N(l.w),
        h: N(l.h)
      };
      const f = {
        w: N(U(r.w / (n.w / 100))),
        h: N(U(r.h / (n.h / 100)))
      };
      const u = getWindowDPR();
      const d = a.w > 2 && a.h > 2;
      const _ = !diffBiggerThanOne(f.w, f.h);
      const g = u !== e && e > 0;
      const h = d && _ && g;
      if (h) {
        const [n, e] = i(getNativeScrollbarSize(t, o, s));
        assignDeep(G.T, n);
        removeElements(o);
        if (e) {
          c("_");
        }
      }
      n = r;
      e = u;
    }));
  }
  return _;
};

const getEnvironment = () => {
  if (!G) {
    G = createEnvironment();
  }
  return G;
};

const W = {};

const getPlugins = () => assignDeep({}, W);

const addPlugin = t => each(isArray(t) ? t : [ t ], (t => {
  each(keys(t), (n => {
    W[n] = t[n];
  }));
}));

var X = {
  exports: {}
};

(function(t) {
  function _extends() {
    t.exports = _extends = Object.assign ? Object.assign.bind() : function(t) {
      for (var n = 1; n < arguments.length; n++) {
        var o = arguments[n];
        for (var s in o) {
          if (Object.prototype.hasOwnProperty.call(o, s)) {
            t[s] = o[s];
          }
        }
      }
      return t;
    }, t.exports.o = true, t.exports["default"] = t.exports;
    return _extends.apply(this, arguments);
  }
  t.exports = _extends, t.exports.o = true, t.exports["default"] = t.exports;
})(X);

const J = getDefaultExportFromCjs(X.exports);

const K = {
  boolean: "__TPL_boolean_TYPE__",
  number: "__TPL_number_TYPE__",
  string: "__TPL_string_TYPE__",
  array: "__TPL_array_TYPE__",
  object: "__TPL_object_TYPE__",
  function: "__TPL_function_TYPE__",
  null: "__TPL_null_TYPE__"
};

const validateRecursive = (t, n, o, s) => {
  const e = {};
  const c = J({}, n);
  const i = keys(t).filter((t => hasOwnProperty(n, t)));
  each(i, (i => {
    const r = n[i];
    const l = t[i];
    const a = isPlainObject(l);
    const f = s ? `${s}.` : "";
    if (a && isPlainObject(r)) {
      const [t, n] = validateRecursive(l, r, o, f + i);
      e[i] = t;
      c[i] = n;
      each([ c, e ], (t => {
        if (isEmptyObject(t[i])) {
          delete t[i];
        }
      }));
    } else if (!a) {
      let t = false;
      const n = [];
      const s = [];
      const a = type(r);
      const u = !isArray(l) ? [ l ] : l;
      each(u, (o => {
        let e;
        each(K, ((t, n) => {
          if (t === o) {
            e = n;
          }
        }));
        const c = isUndefined(e);
        if (c && isString(r)) {
          const s = o.split(" ");
          t = !!s.find((t => t === r));
          push(n, s);
        } else {
          t = K[a] === o;
        }
        push(s, c ? K.string : e);
        return !t;
      }));
      if (t) {
        e[i] = r;
      } else if (o) {
        console.warn(`${`The option "${f}${i}" wasn't set, because it doesn't accept the type [ ${a.toUpperCase()} ] with the value of "${r}".\r\n` + `Accepted types are: [ ${s.join(", ").toUpperCase()} ].\r\n`}${n.length > 0 ? `\r\nValid strings are: [ ${n.join(", ")} ].` : ""}`);
      }
      delete c[i];
    }
  }));
  return [ e, c ];
};

const validateOptions = (t, n, o) => validateRecursive(t, n, o);

const Q = K.number;

const Z = K.boolean;

const tt = [ K.array, K.null ];

const nt = "hidden scroll visible visible-hidden";

const ot = "visible hidden auto";

const st = "never scroll leavemove";

const et = {
  paddingAbsolute: Z,
  updating: {
    elementEvents: tt,
    attributes: tt,
    debounce: [ K.number, K.array, K.null ],
    ignoreMutation: [ K.function, K.null ]
  },
  overflow: {
    x: nt,
    y: nt
  },
  scrollbars: {
    visibility: ot,
    autoHide: st,
    autoHideDelay: Q,
    dragScroll: Z,
    clickScroll: Z,
    touch: Z
  },
  nativeScrollbarsOverlaid: {
    show: Z,
    initialize: Z
  }
};

const ct = "__osOptionsValidationPlugin";

const it = {
  [ct]: {
    q: (t, n) => {
      const [o, s] = validateOptions(et, t, n);
      return J({}, s, o);
    }
  }
};

const rt = 3333333;

const lt = "scroll";

const at = "__osSizeObserverPlugin";

const ft = {
  [at]: {
    q: (t, n, o) => {
      const s = createDOM(`<div class="${R}" dir="ltr"><div class="${R}"><div class="${D}"></div></div><div class="${R}"><div class="${D}" style="width: 200%; height: 200%"></div></div></div>`);
      appendChildren(t, s);
      addClass(t, E);
      const e = s[0];
      const c = e.lastChild;
      const i = e.firstChild;
      const r = null == i ? void 0 : i.firstChild;
      let l = offsetSize(e);
      let a = l;
      let f = false;
      let _;
      const reset = () => {
        scrollLeft(i, rt);
        scrollTop(i, rt);
        scrollLeft(c, rt);
        scrollTop(c, rt);
      };
      const onResized = t => {
        _ = 0;
        if (f) {
          l = a;
          n(true === t);
        }
      };
      const onScroll = t => {
        a = offsetSize(e);
        f = !t || !equalWH(a, l);
        if (t) {
          stopAndPrevent(t);
          if (f && !_) {
            u(_);
            _ = d(onResized);
          }
        } else {
          onResized(false === t);
        }
        reset();
      };
      const g = push([], [ on(i, lt, onScroll), on(c, lt, onScroll) ]);
      style(r, {
        width: rt,
        height: rt
      });
      reset();
      return [ o ? onScroll.bind(0, false) : reset, g ];
    }
  }
};

let ut = 0;

const dt = "__osScrollbarsHidingPlugin";

const _t = {
  [dt]: {
    G: () => {
      const {L: t, P: n, M: o} = getEnvironment();
      const s = !o && !t && (n.x || n.y);
      const e = s ? document.createElement("style") : false;
      if (e) {
        attr(e, "id", `${A}-${ut}`);
        ut++;
      }
      return e;
    },
    N: (t, n, o, s, e, c) => {
      const {R: i} = getEnvironment();
      const arrangeViewport = (e, c, i, r) => {
        if (t) {
          const {U: t} = s();
          const {W: l, X: a} = e;
          const {x: f, y: u} = a;
          const {x: d, y: _} = l;
          const g = r ? "paddingRight" : "paddingLeft";
          const h = t[g];
          const v = t.paddingTop;
          const w = c.w + i.w;
          const p = c.h + i.h;
          const b = {
            w: _ && u ? `${_ + w - h}px` : "",
            h: d && f ? `${d + p - v}px` : ""
          };
          if (o) {
            const {sheet: t} = o;
            if (t) {
              const {cssRules: n} = t;
              if (n) {
                if (!n.length) {
                  t.insertRule(`#${attr(o, "id")} + .${A}::before {}`, 0);
                }
                const s = n[0].style;
                s.width = b.w;
                s.height = b.h;
              }
            }
          } else {
            style(n, {
              "--os-vaw": b.w,
              "--os-vah": b.h
            });
          }
        }
        return t;
      };
      const undoViewportArrange = (o, r, l) => {
        if (t) {
          const a = l || e(o);
          const {U: f} = s();
          const {X: u} = a;
          const {x: d, y: _} = u;
          const g = {};
          const assignProps = t => each(t.split(" "), (t => {
            g[t] = f[t];
          }));
          if (d) {
            assignProps("marginBottom paddingTop paddingBottom");
          }
          if (_) {
            assignProps("marginLeft marginRight paddingLeft paddingRight");
          }
          const h = style(n, keys(g));
          removeClass(n, A);
          if (!i) {
            g.height = "";
          }
          style(n, g);
          return [ () => {
            c(a, r, t, h);
            style(n, h);
            addClass(n, A);
          }, a ];
        }
        return [ noop ];
      };
      return [ arrangeViewport, undoViewportArrange ];
    }
  }
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

const gt = createDiv.bind(0, "");

const unwrap = t => {
  appendChildren(parent(t), contents(t));
  removeElements(t);
};

const addDataAttrHost = (t, n) => {
  attr(t, m, n);
  return removeAttr.bind(0, t, m);
};

const createStructureSetupElements = t => {
  const {j: n, L: o} = getEnvironment();
  const s = getPlugins()[dt];
  const e = s && s.G;
  const {J: c, K: i, A: r, I: l} = n();
  const a = isHTMLElement(t);
  const u = t;
  const d = a ? t : u.target;
  const _ = is(d, "textarea");
  const g = !_ && is(d, "body");
  const h = d.ownerDocument;
  const v = h.body;
  const w = h.defaultView;
  const p = !!f && !_ && o;
  const b = staticInitializationElement.bind(0, [ d ]);
  const y = dynamicInitializationElement.bind(0, [ d ]);
  const C = [ b(gt, i, u.viewport), b(gt, i), b(gt) ].filter((t => !p ? t !== d : true))[0];
  const $ = C === d;
  const A = {
    Z: d,
    J: _ ? b(gt, c, u.host) : d,
    K: C,
    A: !$ && y(gt, r, u.padding),
    I: !$ && y(gt, l, u.content),
    tt: !$ && !o && e && e(),
    nt: w,
    ot: h,
    st: parent(v),
    et: v,
    ct: _,
    it: g,
    rt: a,
    lt: $,
    ft: (t, n) => $ ? hasAttrClass(C, m, n) : hasClass(C, t),
    ut: (t, n, o) => $ ? attrClass(C, m, n, o) : (o ? addClass : removeClass)(C, t)
  };
  const P = keys(A).reduce(((t, n) => {
    const o = A[n];
    return push(t, o && !parent(o) ? o : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(P, t) > -1 : null;
  const {Z: L, J: M, A: H, K: E, I: R, tt: D} = A;
  const j = [];
  const V = _ && elementIsGenerated(M);
  const B = _ ? L : contents([ R, E, H, M, L ].find((t => false === elementIsGenerated(t))));
  const k = R || E;
  const appendElements = () => {
    const t = addDataAttrHost(M, $ ? "viewport" : "host");
    const n = addClass(H, O);
    const s = addClass(E, !$ && z);
    const e = addClass(R, I);
    if (V) {
      insertAfter(L, M);
      push(j, (() => {
        insertAfter(M, L);
        removeElements(M);
      }));
    }
    appendChildren(k, B);
    appendChildren(M, H);
    appendChildren(H || M, !$ && E);
    appendChildren(E, R);
    push(j, (() => {
      t();
      removeAttr(E, S);
      removeAttr(E, x);
      if (elementIsGenerated(R)) {
        unwrap(R);
      }
      if (elementIsGenerated(E)) {
        unwrap(E);
      }
      if (elementIsGenerated(H)) {
        unwrap(H);
      }
      n();
      s();
      e();
    }));
    if (o && !$) {
      push(j, removeClass.bind(0, E, T));
    }
    if (D) {
      insertBefore(E, D);
      push(j, removeElements.bind(0, D));
    }
  };
  return [ A, appendElements, runEachAndClear.bind(0, j) ];
};

const createTrinsicUpdate = (t, n) => {
  const {I: o} = t;
  const [s] = n;
  return t => {
    const {R: n} = getEnvironment();
    const {dt: e} = s();
    const {_t: c} = t;
    const i = (o || !n) && c;
    if (i) {
      style(o, {
        height: e ? "" : "100%"
      });
    }
    return {
      gt: i,
      ht: i
    };
  };
};

const createPaddingUpdate = (t, n) => {
  const [o, s] = n;
  const {J: e, A: c, K: i, lt: r} = t;
  const [l, a] = createCache({
    _: equalTRBL,
    u: topRightBottomLeft()
  }, topRightBottomLeft.bind(0, e, "padding", ""));
  return (t, n, e) => {
    let [f, u] = a(e);
    const {L: d, R: _} = getEnvironment();
    const {vt: g} = o();
    const {gt: h, ht: v, wt: w} = t;
    const [p, b] = n("paddingAbsolute");
    const y = !_ && v;
    if (h || u || y) {
      [f, u] = l(e);
    }
    const m = !r && (b || w || u);
    if (m) {
      const t = !p || !c && !d;
      const n = f.r + f.l;
      const o = f.t + f.b;
      const e = {
        marginRight: t && !g ? -n : 0,
        marginBottom: t ? -o : 0,
        marginLeft: t && g ? -n : 0,
        top: t ? -f.t : 0,
        right: t ? g ? -f.r : "auto" : 0,
        left: t ? g ? "auto" : -f.l : 0,
        width: t ? `calc(100% + ${n}px)` : ""
      };
      const r = {
        paddingTop: t ? f.t : 0,
        paddingRight: t ? f.r : 0,
        paddingBottom: t ? f.b : 0,
        paddingLeft: t ? f.l : 0
      };
      style(c || i, e);
      style(i, r);
      s({
        A: f,
        bt: !t,
        U: c ? r : assignDeep({}, e, r)
      });
    }
    return {
      yt: m
    };
  };
};

const {max: ht} = Math;

const vt = "visible";

const wt = "hidden";

const pt = 42;

const bt = {
  _: equalWH,
  u: {
    w: 0,
    h: 0
  }
};

const yt = {
  _: equalXY,
  u: {
    x: wt,
    y: wt
  }
};

const getOverflowAmount = (t, n, o) => {
  const s = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const e = {
    w: ht(0, t.w - n.w - ht(0, o.w)),
    h: ht(0, t.h - n.h - ht(0, o.h))
  };
  return {
    w: e.w > s ? e.w : 0,
    h: e.h > s ? e.h : 0
  };
};

const conditionalClass = (t, n, o) => o ? addClass(t, n) : removeClass(t, n);

const overflowIsVisible = t => 0 === t.indexOf(vt);

const createOverflowUpdate = (t, n) => {
  const [o, s] = n;
  const {J: e, A: c, K: i, tt: r, lt: l, ut: a} = t;
  const {T: f, R: u, L: d, P: _} = getEnvironment();
  const g = getPlugins()[dt];
  const h = !l && !d && (_.x || _.y);
  const [v, w] = createCache(bt, fractionalSize.bind(0, i));
  const [p, b] = createCache(bt, scrollSize.bind(0, i));
  const [y, O] = createCache(bt);
  const [z] = createCache(yt);
  const fixFlexboxGlue = (t, n) => {
    style(i, {
      height: ""
    });
    if (n) {
      const {bt: n, A: s} = o();
      const {St: c, W: r} = t;
      const l = fractionalSize(e);
      const a = clientSize(e);
      const f = "content-box" === style(i, "boxSizing");
      const u = n || f ? s.b + s.t : 0;
      const d = !(_.x && f);
      style(i, {
        height: a.h + l.h + (c.x && d ? r.x : 0) - u
      });
    }
  };
  const getViewportOverflowState = (t, n) => {
    const o = !d && !t ? pt : 0;
    const getStatePerAxis = (t, s, e) => {
      const c = style(i, t);
      const r = n ? n[t] : c;
      const l = "scroll" === r;
      const a = s ? o : e;
      const f = l && !d ? a : 0;
      const u = s && !!o;
      return [ c, l, f, u ];
    };
    const [s, e, c, r] = getStatePerAxis("overflowX", _.x, f.x);
    const [l, a, u, g] = getStatePerAxis("overflowY", _.y, f.y);
    return {
      xt: {
        x: s,
        y: l
      },
      St: {
        x: e,
        y: a
      },
      W: {
        x: c,
        y: u
      },
      X: {
        x: r,
        y: g
      }
    };
  };
  const setViewportOverflowState = (t, n, o, s) => {
    const setAxisOverflowStyle = (t, n) => {
      const o = overflowIsVisible(t);
      const s = n && o && t.replace(`${vt}-`, "") || "";
      return [ n && !o ? t : "", overflowIsVisible(s) ? "hidden" : s ];
    };
    const [e, c] = setAxisOverflowStyle(o.x, n.x);
    const [i, r] = setAxisOverflowStyle(o.y, n.y);
    s.overflowX = c && i ? c : e;
    s.overflowY = r && e ? r : i;
    return getViewportOverflowState(t, s);
  };
  const hideNativeScrollbars = (t, n, s, e) => {
    const {W: c, X: i} = t;
    const {x: r, y: l} = i;
    const {x: a, y: f} = c;
    const {U: u} = o();
    const d = n ? "marginLeft" : "marginRight";
    const _ = n ? "paddingLeft" : "paddingRight";
    const g = u[d];
    const h = u.marginBottom;
    const v = u[_];
    const w = u.paddingBottom;
    e.width = `calc(100% + ${f + -1 * g}px)`;
    e[d] = -f + g;
    e.marginBottom = -a + h;
    if (s) {
      e[_] = v + (l ? f : 0);
      e.paddingBottom = w + (r ? a : 0);
    }
  };
  const [A, I] = g ? g.N(h, i, r, o, getViewportOverflowState, hideNativeScrollbars) : [ () => h, () => [ noop ] ];
  return (t, n, r) => {
    const {gt: f, Ct: g, ht: h, yt: L, _t: M, wt: H} = t;
    const {dt: E, vt: R} = o();
    const [D, j] = n("nativeScrollbarsOverlaid.show");
    const [V, B] = n("overflow");
    const k = D && _.x && _.y;
    const F = !l && !u && (f || h || g || j || M);
    const Y = overflowIsVisible(V.x);
    const q = overflowIsVisible(V.y);
    const G = Y || q;
    let N = w(r);
    let U = b(r);
    let W = O(r);
    let X;
    if (j && d) {
      a(T, $, !k);
    }
    if (F) {
      X = getViewportOverflowState(k);
      fixFlexboxGlue(X, E);
    }
    if (f || L || h || H || j) {
      if (G) {
        a(P, C, false);
      }
      const [t, n] = I(k, R, X);
      const [o, s] = N = v(r);
      const [e, c] = U = p(r);
      const l = clientSize(i);
      let f = e;
      let u = l;
      t();
      if ((c || s || j) && n && !k && A(n, e, o, R)) {
        u = clientSize(i);
        f = scrollSize(i);
      }
      W = y(getOverflowAmount({
        w: ht(e.w, f.w),
        h: ht(e.h, f.h)
      }, {
        w: u.w + ht(0, l.w - e.w),
        h: u.h + ht(0, l.h - e.h)
      }, o), r);
    }
    const [J, K] = W;
    const [Q, Z] = U;
    const [tt, nt] = N;
    const ot = {
      x: J.w > 0,
      y: J.h > 0
    };
    const st = Y && q && (ot.x || ot.y) || Y && ot.x && !ot.y || q && ot.y && !ot.x;
    if (L || H || nt || Z || K || B || j || F) {
      const t = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: "",
        overflowY: "",
        overflowX: ""
      };
      const n = setViewportOverflowState(k, ot, V, t);
      const o = A(n, Q, tt, R);
      if (!l) {
        hideNativeScrollbars(n, R, o, t);
      }
      if (F) {
        fixFlexboxGlue(n, E);
      }
      if (l) {
        attr(e, S, t.overflowX);
        attr(e, x, t.overflowY);
      } else {
        style(i, t);
      }
    }
    attrClass(e, m, C, st);
    conditionalClass(c, P, st);
    !l && conditionalClass(i, P, G);
    const [et, ct] = z(getViewportOverflowState(k).xt);
    s({
      xt: et,
      $t: {
        x: J.w,
        y: J.h
      },
      Ot: ot
    });
    return {
      zt: ct,
      At: K
    };
  };
};

const prepareUpdateHints = (t, n, o) => {
  const s = {};
  const e = n || {};
  const c = keys(t).concat(keys(e));
  each(c, (n => {
    const c = t[n];
    const i = e[n];
    s[n] = !!(o || c || i);
  }));
  return s;
};

const createStructureSetupUpdate = (t, n) => {
  const {K: o} = t;
  const {L: s, P: e, R: c} = getEnvironment();
  const i = !s && (e.x || e.y);
  const r = [ createTrinsicUpdate(t, n), createPaddingUpdate(t, n), createOverflowUpdate(t, n) ];
  return (t, n, s) => {
    const e = prepareUpdateHints(assignDeep({
      gt: false,
      yt: false,
      wt: false,
      _t: false,
      At: false,
      zt: false,
      Ct: false,
      ht: false
    }, n), {}, s);
    const l = i || !c;
    const a = l && scrollLeft(o);
    const f = l && scrollTop(o);
    let u = e;
    each(r, (n => {
      u = prepareUpdateHints(u, n(u, t, !!s) || {}, s);
    }));
    if (isNumber(a)) {
      scrollLeft(o, a);
    }
    if (isNumber(f)) {
      scrollTop(o, f);
    }
    return u;
  };
};

const mt = "animationstart";

const St = "scroll";

const xt = 3333333;

const getElmDirectionIsRTL = t => "rtl" === style(t, "direction");

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, o) => {
  const {It: s = false, Tt: e = false} = o || {};
  const c = getPlugins()[at];
  const {H: i} = getEnvironment();
  const r = createDOM(`<div class="${L}"><div class="${H}"></div></div>`);
  const l = r[0];
  const a = l.firstChild;
  const u = getElmDirectionIsRTL.bind(0, l);
  const [d] = createCache({
    u: void 0,
    g: true,
    _: (t, n) => !(!t || !domRectHasDimensions(t) && domRectHasDimensions(n))
  });
  const onSizeChangedCallbackProxy = t => {
    const o = isArray(t) && t.length > 0 && isObject(t[0]);
    const e = !o && isBoolean(t[0]);
    let c = false;
    let r = false;
    let a = true;
    if (o) {
      const [n, , o] = d(t.pop().contentRect);
      const s = domRectHasDimensions(n);
      const e = domRectHasDimensions(o);
      c = !o || !s;
      r = !e && s;
      a = !c;
    } else if (e) {
      [, a] = t;
    } else {
      r = true === t;
    }
    if (s && a) {
      const n = e ? t[0] : getElmDirectionIsRTL(l);
      scrollLeft(l, n ? i.n ? -xt : i.i ? 0 : xt : xt);
      scrollTop(l, xt);
    }
    if (!c) {
      n({
        gt: !e,
        Pt: e ? t : void 0,
        Tt: !!r
      });
    }
  };
  const _ = [];
  let g = e ? onSizeChangedCallbackProxy : false;
  let h;
  if (f) {
    const t = new f(onSizeChangedCallbackProxy);
    t.observe(a);
    push(_, (() => {
      t.disconnect();
    }));
  } else if (c) {
    const [t, n] = c.q(a, onSizeChangedCallbackProxy, e);
    g = t;
    push(_, n);
  }
  if (s) {
    h = createCache({
      u: !u()
    }, u);
    const [t] = h;
    push(_, on(l, St, (n => {
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
      stopAndPrevent(n);
    })));
  }
  if (g) {
    addClass(l, M);
    push(_, on(l, mt, g, {
      O: !!f
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
  const o = createDiv(j);
  const s = [];
  const [e] = createCache({
    u: false
  });
  const triggerOnTrinsicChangedCallback = t => {
    if (t) {
      const o = e(isHeightIntrinsic(t));
      const [, s] = o;
      if (s) {
        n(o);
      }
    }
  };
  if (a) {
    const n = new a((t => {
      if (t && t.length > 0) {
        triggerOnTrinsicChangedCallback(t.pop());
      }
    }), {
      root: t
    });
    n.observe(o);
    push(s, (() => {
      n.disconnect();
    }));
  } else {
    const onSizeChanged = () => {
      const t = offsetSize(o);
      triggerOnTrinsicChangedCallback(t);
    };
    push(s, createSizeObserver(o, onSizeChanged));
    onSizeChanged();
  }
  prependChildren(t, o);
  return () => {
    runEachAndClear(s);
    removeElements(o);
  };
};

const createEventContentChange = (t, n, o) => {
  let s;
  let e = false;
  const destroy = () => {
    e = true;
  };
  const updateElements = c => {
    if (o) {
      const i = o.reduce(((n, o) => {
        if (o) {
          const s = o[0];
          const e = o[1];
          const i = e && s && (c ? c(s) : find(s, t));
          if (i && i.length && e && isString(e)) {
            push(n, [ i, e.trim() ], true);
          }
        }
        return n;
      }), []);
      each(i, (t => each(t[0], (o => {
        const c = t[1];
        const i = s.get(o);
        if (i) {
          const t = i[0];
          const n = i[1];
          if (t === c) {
            n();
          }
        }
        const r = on(o, c, (t => {
          if (e) {
            r();
            s.delete(o);
          } else {
            n(t);
          }
        }));
        s.set(o, [ c, r ]);
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
  const {Lt: c, Mt: i, Ht: r, Et: a, Rt: f, Dt: u} = s || {};
  const [d, _] = createEventContentChange(t, debounce((() => {
    if (e) {
      o(true);
    }
  }), {
    v: 33,
    p: 99
  }), r);
  const g = c || [];
  const h = i || [];
  const v = g.concat(h);
  const observerCallback = e => {
    const c = f || noop;
    const i = u || noop;
    const r = [];
    const l = [];
    let d = false;
    let g = false;
    let v = false;
    each(e, (o => {
      const {attributeName: e, target: f, type: u, oldValue: _, addedNodes: w} = o;
      const p = "attributes" === u;
      const b = "childList" === u;
      const y = t === f;
      const m = p && isString(e) ? attr(f, e) : 0;
      const S = 0 !== m && _ !== m;
      const x = indexOf(h, e) > -1 && S;
      if (n && !y) {
        const n = !p;
        const r = p && x;
        const u = r && a && is(f, a);
        const d = u ? !c(f, e, _, m) : n || r;
        const h = d && !i(o, !!u, t, s);
        push(l, w);
        g = g || h;
        v = v || b;
      }
      if (!n && y && S && !c(f, e, _, m)) {
        push(r, e);
        d = d || x;
      }
    }));
    if (v && !isEmptyArray(l)) {
      _((t => l.reduce(((n, o) => {
        push(n, find(t, o));
        return is(o, t) ? push(n, o) : n;
      }), [])));
    }
    if (n) {
      g && o(false);
    } else if (!isEmptyArray(r) || d) {
      o(r, d);
    }
  };
  const w = new l(observerCallback);
  w.observe(t, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: v,
    subtree: n,
    childList: n,
    characterData: n
  });
  e = true;
  return [ () => {
    if (e) {
      d();
      w.disconnect();
      e = false;
    }
  }, () => {
    if (e) {
      observerCallback(w.takeRecords());
    }
  } ];
};

const Ct = `[${m}]`;

const $t = `.${z}`;

const Ot = [ "tabindex" ];

const zt = [ "wrap", "cols", "rows" ];

const At = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, o) => {
  let s;
  let e;
  let c;
  const [, i] = n;
  const {J: r, K: l, I: a, ct: u, lt: d, ft: _, ut: g} = t;
  const {L: h, R: v} = getEnvironment();
  const [w] = createCache({
    _: equalWH,
    u: {
      w: 0,
      h: 0
    }
  }, (() => {
    const t = _(P, C);
    t && g(P, C);
    const n = scrollSize(a);
    const o = scrollSize(l);
    const s = fractionalSize(l);
    t && g(P, C, true);
    return {
      w: o.w + n.w + s.w,
      h: o.h + n.h + s.h
    };
  }));
  const p = u ? zt : At.concat(zt);
  const b = debounce(o, {
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
    each(t || Ot, (t => {
      if (indexOf(Ot, t) > -1) {
        const n = attr(r, t);
        if (isString(n)) {
          attr(l, t, n);
        } else {
          removeAttr(l, t);
        }
      }
    }));
  };
  const onTrinsicChanged = t => {
    const [n, s] = t;
    i({
      dt: n
    });
    o({
      _t: s
    });
  };
  const onSizeChanged = ({gt: t, Pt: n, Tt: s}) => {
    const e = !t || s ? o : b;
    let c = false;
    if (n) {
      const [t, o] = n;
      c = o;
      i({
        vt: t
      });
    }
    e({
      gt: t,
      wt: c
    });
  };
  const onContentMutation = t => {
    const [, n] = w();
    const s = t ? o : b;
    if (n) {
      s({
        ht: true
      });
    }
  };
  const onHostMutation = (t, n) => {
    if (n) {
      b({
        Ct: true
      });
    } else if (!d) {
      updateViewportAttrsFromHost(t);
    }
  };
  const y = (a || !v) && createTrinsicObserver(r, onTrinsicChanged);
  const m = !d && createSizeObserver(r, onSizeChanged, {
    Tt: true,
    It: !h
  });
  const [S] = createDOMObserver(r, false, onHostMutation, {
    Mt: At,
    Lt: At.concat(Ot)
  });
  const x = d && new f(onSizeChanged.bind(0, {
    gt: true
  }));
  x && x.observe(r);
  updateViewportAttrsFromHost();
  return [ t => {
    const [n] = t("updating.ignoreMutation");
    const [o, i] = t("updating.attributes");
    const [r, f] = t("updating.elementEvents");
    const [u, d] = t("updating.debounce");
    const _ = f || i;
    const ignoreMutationFromOptions = t => isFunction(n) && n(t);
    if (_) {
      if (c) {
        c[1]();
        c[0]();
      }
      c = createDOMObserver(a || l, true, onContentMutation, {
        Mt: p.concat(o || []),
        Lt: p.concat(o || []),
        Ht: r,
        Et: Ct,
        Dt: (t, n) => {
          const {target: o, attributeName: s} = t;
          const e = !n && s ? liesBetween(o, Ct, $t) : false;
          return e || !!ignoreMutationFromOptions(t);
        }
      });
    }
    if (d) {
      b.S();
      if (isArray(u)) {
        const t = u[0];
        const n = u[1];
        s = isNumber(t) ? t : false;
        e = isNumber(n) ? n : false;
      } else if (isNumber(u)) {
        s = u;
        e = false;
      } else {
        s = false;
        e = false;
      }
    }
  }, () => {
    c && c[0]();
    y && y();
    m && m();
    x && x.disconnect();
    S();
  } ];
};

const It = {
  A: {
    t: 0,
    r: 0,
    b: 0,
    l: 0
  },
  bt: false,
  U: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  $t: {
    x: 0,
    y: 0
  },
  xt: {
    x: "hidden",
    y: "hidden"
  },
  Ot: {
    x: false,
    y: false
  },
  dt: false,
  vt: false
};

const createStructureSetup = (t, n) => {
  const o = createOptionCheck(n, {});
  const s = createState(It);
  const [e, c, i] = createEventListenerHub();
  const [r] = s;
  const [l, a, f] = createStructureSetupElements(t);
  const u = createStructureSetupUpdate(l, s);
  const [d, _] = createStructureSetupObservers(l, s, (t => {
    i("u", [ u(o, t), {}, false ]);
  }));
  const g = r.bind(0);
  g.jt = t => {
    e("u", t);
  };
  g.Vt = a;
  g.Bt = l;
  return [ (t, o) => {
    const s = createOptionCheck(n, t, o);
    d(s);
    i("u", [ u(s, {}, o), t, !!o ]);
  }, g, () => {
    c();
    _();
    f();
  } ];
};

const generateScrollbarDOM = t => {
  const n = createDiv(`${V} ${t}`);
  const o = createDiv(F);
  const s = createDiv(Y);
  appendChildren(n, o);
  appendChildren(o, s);
  return {
    kt: n,
    Ft: o,
    Yt: s
  };
};

const createScrollbarsSetupElements = (t, n) => {
  const {j: o} = getEnvironment();
  const {qt: s} = o();
  const {Z: e, J: c, K: i, rt: r} = n;
  const l = !r && t.scrollbarsSlot;
  const a = dynamicInitializationElement([ e, c, i ], (() => c), s, l);
  const f = generateScrollbarDOM(B);
  const u = generateScrollbarDOM(k);
  const {kt: d} = f;
  const {kt: _} = u;
  const appendElements = () => {
    appendChildren(a, d);
    appendChildren(a, _);
  };
  return [ {
    Gt: f,
    Nt: u
  }, appendElements, removeElements.bind(0, [ d, _ ]) ];
};

const createScrollbarsSetup = (t, n, o) => {
  const s = createState({});
  const [e] = s;
  const [c, i, r] = createScrollbarsSetupElements(t, o);
  const l = e.bind(0);
  l.Bt = c;
  l.Vt = i;
  return [ (t, o) => {
    const s = createOptionCheck(n, t, o);
    console.log(s);
  }, l, () => {
    r();
  } ];
};

const Tt = new Set;

const Pt = new WeakMap;

const addInstance = (t, n) => {
  Pt.set(t, n);
  Tt.add(t);
};

const removeInstance = t => {
  Pt.delete(t);
  Tt.delete(t);
};

const getInstance = t => Pt.get(t);

const OverlayScrollbars = (t, n, o) => {
  let s = false;
  const {B: e, P: c, D: i} = getEnvironment();
  const r = getPlugins();
  const l = isHTMLElement(t) ? t : t.target;
  const a = getInstance(l);
  if (a) {
    return a;
  }
  const f = r[ct];
  const validateOptions = t => {
    const n = t || {};
    const o = f && f.q;
    return o ? o(n, true) : n;
  };
  const u = assignDeep({}, e(), validateOptions(n));
  const [d, _, g] = createEventListenerHub(o);
  const [h, v, w] = createStructureSetup(t, u);
  const [p, b, y] = createScrollbarsSetup(t, u, v.Bt);
  const update = (t, n) => {
    h(t, n);
    p(t, n);
  };
  const m = i(update.bind(0, {}, true));
  const destroy = t => {
    removeInstance(l);
    m();
    y();
    w();
    s = true;
    g("destroyed", [ S, !!t ]);
    _();
  };
  const S = {
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
      t && n && _(t, n);
    },
    state() {
      const {$t: t, xt: n, Ot: o, A: e, bt: c} = v();
      return assignDeep({}, {
        overflowAmount: t,
        overflowStyle: n,
        hasOverflow: o,
        padding: e,
        paddingAbsolute: c,
        destroyed: s
      });
    },
    elements() {
      const {Z: t, J: n, A: o, K: s, I: e} = v.Bt;
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
  each(keys(r), (t => {
    const n = r[t];
    if (isFunction(n)) {
      n(OverlayScrollbars, S);
    }
  }));
  if (c.x && c.y && !u.nativeScrollbarsOverlaid.initialize) {
    destroy(true);
    return S;
  }
  v.Vt();
  b.Vt();
  addInstance(l, S);
  g("initialized", [ S ]);
  v.jt(((t, n, o) => {
    const {gt: s, wt: e, _t: c, At: i, zt: r, ht: l, Ct: a} = t;
    g("updated", [ S, {
      updateHints: {
        sizeChanged: s,
        directionChanged: e,
        heightIntrinsicChanged: c,
        overflowAmountChanged: i,
        overflowStyleChanged: r,
        contentMutation: l,
        hostMutation: a
      },
      changedOptions: n,
      force: o
    } ]);
  }));
  return S.update(true);
};

OverlayScrollbars.plugin = addPlugin;

OverlayScrollbars.env = () => {
  const {T: t, P: n, L: o, H: s, R: e, M: c, F: i, Y: r, j: l, V: a, B: f, k: u} = getEnvironment();
  return assignDeep({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: n,
    scrollbarsHiding: o,
    rtlScrollBehavior: s,
    flexboxGlue: e,
    cssCustomProperties: c,
    defaultInitializationStrategy: i,
    defaultDefaultOptions: r,
    getInitializationStrategy: l,
    setInitializationStrategy: a,
    getDefaultOptions: f,
    setDefaultOptions: u
  });
};

export { OverlayScrollbars, it as optionsValidationPlugin, _t as scrollbarsHidingPlugin, ft as sizeObserverPlugin };
//# sourceMappingURL=overlayscrollbars.esm.js.map
