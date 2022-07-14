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

const _ = /[^\x20\t\r\n\f]+/g;

const classListAction = (t, n, o) => {
  let s;
  let e = 0;
  let c = false;
  if (t && n && isString(n)) {
    const r = n.match(_) || [];
    c = r.length > 0;
    while (s = r[e++]) {
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

const clearTimeouts = t => {
  t && clearTimeout(t);
  t && d(t);
};

const noop = () => {};

const debounce = (t, n) => {
  let o;
  let s;
  let e;
  let c;
  const {v: r, p: i, m: l} = n || {};
  const a = setTimeout;
  const u = function invokeFunctionToDebounce(n) {
    clearTimeouts(o);
    clearTimeouts(s);
    s = o = e = void 0;
    t.apply(this, n);
  };
  const mergeParms = t => l && e ? l(e, t) : t;
  const flush = () => {
    if (o) {
      u(mergeParms(c) || c);
    }
  };
  const d = function debouncedFn() {
    const t = from(arguments);
    const n = isFunction(r) ? r() : r;
    const l = isNumber(n) && n >= 0;
    if (l) {
      const r = isFunction(i) ? i() : i;
      const l = isNumber(r) && r >= 0;
      const d = n > 0 ? a : f;
      const _ = mergeParms(t);
      const g = _ || t;
      const h = u.bind(0, g);
      clearTimeouts(o);
      o = d(h, n);
      if (l && !s) {
        s = a(flush, r);
      }
      e = c = g;
    } else {
      u(t);
    }
  };
  d.S = flush;
  return d;
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
  var e;
  const c = supportPassiveEvents();
  const r = null != (e = c && s && s.C) ? e : c;
  const i = s && s.$ || false;
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

const T = `${z}-arrange`;

const A = "os-content";

const I = `${z}-scrollbar-styled`;

const E = `os-overflow-visible`;

const P = "os-size-observer";

const L = `${P}-appear`;

const H = `${P}-listener`;

const M = `${H}-scroll`;

const R = `${H}-item`;

const D = `${R}-final`;

const j = "os-trinsic-observer";

const V = "os-scrollbar";

const k = `${V}-horizontal`;

const B = `${V}-vertical`;

const F = "os-scrollbar-track";

const Y = "os-scrollbar-handle";

const q = `${V}-visible`;

const G = `${V}-cornerless`;

const N = `${V}-interaction`;

const U = `${V}-auto-hidden`;

const opsStringify = t => JSON.stringify(t, ((t, n) => {
  if (isFunction(n)) {
    throw new Error;
  }
  return n;
}));

const W = {
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
        } catch (r) {}
      }
      if (t) {
        o[s] = c;
      }
    }
  }));
  return o;
};

let X;

const {abs: J, round: K} = Math;

const diffBiggerThanOne = (t, n) => {
  const o = J(t);
  const s = J(n);
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
  const o = addClass(t, I);
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
  const r = addClass(t, y);
  const i = getBoundingClientRect(t);
  const l = getBoundingClientRect(n);
  const a = equalBCRWH(l, i, true);
  o();
  r();
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
  const [r, i] = createCache({
    u: getNativeScrollbarSize(t, o, s),
    _: equalXY
  });
  const [l] = i();
  const a = getNativeScrollbarsHiding(o);
  const u = {
    x: 0 === l.x,
    y: 0 === l.y
  };
  const d = {
    T: !a,
    A: false
  };
  const f = assignDeep({}, W);
  const _ = {
    I: l,
    P: u,
    L: a,
    H: "-1" === style(o, "zIndex"),
    M: getRtlScrollBehavior(o, s),
    R: getFlexboxGlue(o, s),
    D: t => e("_", t),
    j: assignDeep.bind(0, {}, d),
    V(t) {
      assignDeep(d, t);
    },
    k: assignDeep.bind(0, {}, f),
    B(t) {
      assignDeep(f, t);
    },
    F: assignDeep({}, d),
    Y: assignDeep({}, f)
  };
  removeAttr(o, "style");
  removeElements(o);
  if (!a && (!u.x || !u.y)) {
    let n = windowSize();
    let e = getWindowDPR();
    window.addEventListener("resize", (() => {
      const i = windowSize();
      const l = {
        w: i.w - n.w,
        h: i.h - n.h
      };
      if (0 === l.w && 0 === l.h) {
        return;
      }
      const a = {
        w: J(l.w),
        h: J(l.h)
      };
      const u = {
        w: J(K(i.w / (n.w / 100))),
        h: J(K(i.h / (n.h / 100)))
      };
      const d = getWindowDPR();
      const f = a.w > 2 && a.h > 2;
      const _ = !diffBiggerThanOne(u.w, u.h);
      const g = d !== e && e > 0;
      const h = f && _ && g;
      if (h) {
        const [n, e] = r(getNativeScrollbarSize(t, o, s));
        assignDeep(X.I, n);
        removeElements(o);
        if (e) {
          c("_");
        }
      }
      n = i;
      e = d;
    }));
  }
  return _;
};

const getEnvironment = () => {
  if (!X) {
    X = createEnvironment();
  }
  return X;
};

const Q = {};

const getPlugins = () => assignDeep({}, Q);

const addPlugin = t => each(isArray(t) ? t : [ t ], (t => {
  each(keys(t), (n => {
    Q[n] = t[n];
  }));
}));

var Z = {
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
})(Z);

const tt = getDefaultExportFromCjs(Z.exports);

const nt = {
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
  const c = tt({}, n);
  const r = keys(t).filter((t => hasOwnProperty(n, t)));
  each(r, (r => {
    const i = n[r];
    const l = t[r];
    const a = isPlainObject(l);
    const u = s ? `${s}.` : "";
    if (a && isPlainObject(i)) {
      const [t, n] = validateRecursive(l, i, o, u + r);
      e[r] = t;
      c[r] = n;
      each([ c, e ], (t => {
        if (isEmptyObject(t[r])) {
          delete t[r];
        }
      }));
    } else if (!a) {
      let t = false;
      const n = [];
      const s = [];
      const a = type(i);
      const d = !isArray(l) ? [ l ] : l;
      each(d, (o => {
        let e;
        each(nt, ((t, n) => {
          if (t === o) {
            e = n;
          }
        }));
        const c = isUndefined(e);
        if (c && isString(i)) {
          const s = o.split(" ");
          t = !!s.find((t => t === i));
          push(n, s);
        } else {
          t = nt[a] === o;
        }
        push(s, c ? nt.string : e);
        return !t;
      }));
      if (t) {
        e[r] = i;
      } else if (o) {
        console.warn(`${`The option "${u}${r}" wasn't set, because it doesn't accept the type [ ${a.toUpperCase()} ] with the value of "${i}".\r\n` + `Accepted types are: [ ${s.join(", ").toUpperCase()} ].\r\n`}${n.length > 0 ? `\r\nValid strings are: [ ${n.join(", ")} ].` : ""}`);
      }
      delete c[r];
    }
  }));
  return [ e, c ];
};

const validateOptions = (t, n, o) => validateRecursive(t, n, o);

const ot = nt.number;

const st = nt.boolean;

const et = [ nt.array, nt.null ];

const ct = "hidden scroll visible visible-hidden";

const rt = "visible hidden auto";

const it = "never scroll leavemove";

const lt = {
  paddingAbsolute: st,
  updating: {
    elementEvents: et,
    attributes: et,
    debounce: [ nt.number, nt.array, nt.null ],
    ignoreMutation: [ nt.function, nt.null ]
  },
  overflow: {
    x: ct,
    y: ct
  },
  scrollbars: {
    visibility: rt,
    autoHide: it,
    autoHideDelay: ot,
    dragScroll: st,
    clickScroll: st,
    touch: st
  },
  nativeScrollbarsOverlaid: {
    show: st,
    initialize: st
  }
};

const at = "__osOptionsValidationPlugin";

const ut = {
  [at]: {
    q: (t, n) => {
      const [o, s] = validateOptions(lt, t, n);
      return tt({}, s, o);
    }
  }
};

const dt = 3333333;

const ft = "scroll";

const _t = "__osSizeObserverPlugin";

const gt = {
  [_t]: {
    q: (t, n, o) => {
      const s = createDOM(`<div class="${R}" dir="ltr"><div class="${R}"><div class="${D}"></div></div><div class="${R}"><div class="${D}" style="width: 200%; height: 200%"></div></div></div>`);
      appendChildren(t, s);
      addClass(t, M);
      const e = s[0];
      const c = e.lastChild;
      const r = e.firstChild;
      const i = null == r ? void 0 : r.firstChild;
      let l = offsetSize(e);
      let a = l;
      let u = false;
      let _;
      const reset = () => {
        scrollLeft(r, dt);
        scrollTop(r, dt);
        scrollLeft(c, dt);
        scrollTop(c, dt);
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
          stopAndPrevent(t);
          if (u && !_) {
            d(_);
            _ = f(onResized);
          }
        } else {
          onResized(false === t);
        }
        reset();
      };
      const g = push([], [ on(r, ft, onScroll), on(c, ft, onScroll) ]);
      style(i, {
        width: dt,
        height: dt
      });
      reset();
      return [ o ? onScroll.bind(0, false) : reset, g ];
    }
  }
};

let ht = 0;

const vt = "__osScrollbarsHidingPlugin";

const wt = {
  [vt]: {
    G: () => {
      const {L: t, P: n, H: o} = getEnvironment();
      const s = !o && !t && (n.x || n.y);
      const e = s ? document.createElement("style") : false;
      if (e) {
        attr(e, "id", `${T}-${ht}`);
        ht++;
      }
      return e;
    },
    N: (t, n, o, s, e, c) => {
      const {R: r} = getEnvironment();
      const arrangeViewport = (e, c, r, i) => {
        if (t) {
          const {U: t} = s();
          const {W: l, X: a} = e;
          const {x: u, y: d} = a;
          const {x: f, y: _} = l;
          const g = i ? "paddingRight" : "paddingLeft";
          const h = t[g];
          const v = t.paddingTop;
          const w = c.w + r.w;
          const p = c.h + r.h;
          const b = {
            w: _ && d ? `${_ + w - h}px` : "",
            h: f && u ? `${f + p - v}px` : ""
          };
          if (o) {
            const {sheet: t} = o;
            if (t) {
              const {cssRules: n} = t;
              if (n) {
                if (!n.length) {
                  t.insertRule(`#${attr(o, "id")} + .${T}::before {}`, 0);
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
      const undoViewportArrange = (o, i, l) => {
        if (t) {
          const a = l || e(o);
          const {U: u} = s();
          const {X: d} = a;
          const {x: f, y: _} = d;
          const g = {};
          const assignProps = t => each(t.split(" "), (t => {
            g[t] = u[t];
          }));
          if (f) {
            assignProps("marginBottom paddingTop paddingBottom");
          }
          if (_) {
            assignProps("marginLeft marginRight paddingLeft paddingRight");
          }
          const h = style(n, keys(g));
          removeClass(n, T);
          if (!r) {
            g.height = "";
          }
          style(n, g);
          return [ () => {
            c(a, i, t, h);
            style(n, h);
            addClass(n, T);
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

const pt = createDiv.bind(0, "");

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
  const s = getPlugins()[vt];
  const e = s && s.G;
  const {J: c, K: r, T: i, A: l} = n();
  const a = isHTMLElement(t);
  const d = t;
  const f = a ? t : d.target;
  const _ = is(f, "textarea");
  const g = !_ && is(f, "body");
  const h = f.ownerDocument;
  const v = h.body;
  const w = h.defaultView;
  const p = !!u && !_ && o;
  const b = staticInitializationElement.bind(0, [ f ]);
  const y = dynamicInitializationElement.bind(0, [ f ]);
  const C = [ b(pt, r, d.viewport), b(pt, r), b(pt) ].filter((t => !p ? t !== f : true))[0];
  const $ = C === f;
  const T = {
    Z: f,
    J: _ ? b(pt, c, d.host) : f,
    K: C,
    T: !$ && y(pt, i, d.padding),
    A: !$ && y(pt, l, d.content),
    tt: !$ && !o && e && e(),
    nt: w,
    ot: h,
    st: parent(v),
    et: v,
    ct: _,
    rt: g,
    it: a,
    lt: $,
    ut: (t, n) => $ ? hasAttrClass(C, m, n) : hasClass(C, t),
    dt: (t, n, o) => $ ? attrClass(C, m, n, o) : (o ? addClass : removeClass)(C, t)
  };
  const E = keys(T).reduce(((t, n) => {
    const o = T[n];
    return push(t, o && !parent(o) ? o : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(E, t) > -1 : null;
  const {Z: P, J: L, T: H, K: M, A: R, tt: D} = T;
  const j = [];
  const V = _ && elementIsGenerated(L);
  const k = _ ? P : contents([ R, M, H, L, P ].find((t => false === elementIsGenerated(t))));
  const B = R || M;
  const appendElements = () => {
    const t = addDataAttrHost(L, $ ? "viewport" : "host");
    const n = addClass(H, O);
    const s = addClass(M, !$ && z);
    const e = addClass(R, A);
    if (V) {
      insertAfter(P, L);
      push(j, (() => {
        insertAfter(L, P);
        removeElements(L);
      }));
    }
    appendChildren(B, k);
    appendChildren(L, H);
    appendChildren(H || L, !$ && M);
    appendChildren(M, R);
    push(j, (() => {
      t();
      removeAttr(M, S);
      removeAttr(M, x);
      if (elementIsGenerated(R)) {
        unwrap(R);
      }
      if (elementIsGenerated(M)) {
        unwrap(M);
      }
      if (elementIsGenerated(H)) {
        unwrap(H);
      }
      n();
      s();
      e();
    }));
    if (o && !$) {
      push(j, removeClass.bind(0, M, I));
    }
    if (D) {
      insertBefore(M, D);
      push(j, removeElements.bind(0, D));
    }
  };
  return [ T, appendElements, runEachAndClear.bind(0, j) ];
};

const createTrinsicUpdateSegment = (t, n) => {
  const {A: o} = t;
  const [s] = n;
  return t => {
    const {R: n} = getEnvironment();
    const {ft: e} = s();
    const {_t: c} = t;
    const r = (o || !n) && c;
    if (r) {
      style(o, {
        height: e ? "" : "100%"
      });
    }
    return {
      gt: r,
      ht: r
    };
  };
};

const createPaddingUpdateSegment = (t, n) => {
  const [o, s] = n;
  const {J: e, T: c, K: r, lt: i} = t;
  const [l, a] = createCache({
    _: equalTRBL,
    u: topRightBottomLeft()
  }, topRightBottomLeft.bind(0, e, "padding", ""));
  return (t, n, e) => {
    let [u, d] = a(e);
    const {L: f, R: _} = getEnvironment();
    const {vt: g} = o();
    const {gt: h, ht: v, wt: w} = t;
    const [p, b] = n("paddingAbsolute");
    const y = !_ && v;
    if (h || d || y) {
      [u, d] = l(e);
    }
    const m = !i && (b || w || d);
    if (m) {
      const t = !p || !c && !f;
      const n = u.r + u.l;
      const o = u.t + u.b;
      const e = {
        marginRight: t && !g ? -n : 0,
        marginBottom: t ? -o : 0,
        marginLeft: t && g ? -n : 0,
        top: t ? -u.t : 0,
        right: t ? g ? -u.r : "auto" : 0,
        left: t ? g ? "auto" : -u.l : 0,
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
        T: u,
        bt: !t,
        U: c ? i : assignDeep({}, e, i)
      });
    }
    return {
      yt: m
    };
  };
};

const {max: bt} = Math;

const yt = bt.bind(0, 0);

const mt = "visible";

const St = "hidden";

const xt = 42;

const Ct = {
  _: equalWH,
  u: {
    w: 0,
    h: 0
  }
};

const $t = {
  _: equalXY,
  u: {
    x: St,
    y: St
  }
};

const getOverflowAmount = (t, n) => {
  const o = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const s = {
    w: yt(t.w - n.w),
    h: yt(t.h - n.h)
  };
  return {
    w: s.w > o ? s.w : 0,
    h: s.h > o ? s.h : 0
  };
};

const conditionalClass = (t, n, o) => o ? addClass(t, n) : removeClass(t, n);

const overflowIsVisible = t => 0 === t.indexOf(mt);

const createOverflowUpdateSegment = (t, n) => {
  const [o, s] = n;
  const {J: e, T: c, K: r, tt: i, lt: l, dt: a} = t;
  const {I: u, R: d, L: f, P: _} = getEnvironment();
  const g = getPlugins()[vt];
  const h = !l && !f && (_.x || _.y);
  const [v, w] = createCache(Ct, fractionalSize.bind(0, r));
  const [p, b] = createCache(Ct, scrollSize.bind(0, r));
  const [y, O] = createCache(Ct);
  const [z, T] = createCache(Ct);
  const [A] = createCache($t);
  const fixFlexboxGlue = (t, n) => {
    style(r, {
      height: ""
    });
    if (n) {
      const {bt: n, T: s} = o();
      const {St: c, W: i} = t;
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
    const o = !f && !t ? xt : 0;
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
    const [l, a, d, g] = getStatePerAxis("overflowY", _.y, u.y);
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
        y: d
      },
      X: {
        x: i,
        y: g
      }
    };
  };
  const setViewportOverflowState = (t, n, o, s) => {
    const setAxisOverflowStyle = (t, n) => {
      const o = overflowIsVisible(t);
      const s = n && o && t.replace(`${mt}-`, "") || "";
      return [ n && !o ? t : "", overflowIsVisible(s) ? "hidden" : s ];
    };
    const [e, c] = setAxisOverflowStyle(o.x, n.x);
    const [r, i] = setAxisOverflowStyle(o.y, n.y);
    s.overflowX = c && r ? c : e;
    s.overflowY = i && e ? i : r;
    return getViewportOverflowState(t, s);
  };
  const hideNativeScrollbars = (t, n, s, e) => {
    const {W: c, X: r} = t;
    const {x: i, y: l} = r;
    const {x: a, y: u} = c;
    const {U: d} = o();
    const f = n ? "marginLeft" : "marginRight";
    const _ = n ? "paddingLeft" : "paddingRight";
    const g = d[f];
    const h = d.marginBottom;
    const v = d[_];
    const w = d.paddingBottom;
    e.width = `calc(100% + ${u + -1 * g}px)`;
    e[f] = -u + g;
    e.marginBottom = -a + h;
    if (s) {
      e[_] = v + (l ? u : 0);
      e.paddingBottom = w + (i ? a : 0);
    }
  };
  const [P, L] = g ? g.N(h, r, i, o, getViewportOverflowState, hideNativeScrollbars) : [ () => h, () => [ noop ] ];
  return (t, n, i) => {
    const {gt: u, Ct: g, ht: h, yt: H, _t: M, wt: R} = t;
    const {ft: D, vt: j} = o();
    const [V, k] = n("nativeScrollbarsOverlaid.show");
    const [B, F] = n("overflow");
    const Y = V && _.x && _.y;
    const q = !l && !d && (u || h || g || k || M);
    const G = overflowIsVisible(B.x);
    const N = overflowIsVisible(B.y);
    const U = G || N;
    let W = w(i);
    let X = b(i);
    let J = O(i);
    let K = T(i);
    let Q;
    if (k && f) {
      a(I, $, !Y);
    }
    if (q) {
      Q = getViewportOverflowState(Y);
      fixFlexboxGlue(Q, D);
    }
    if (u || H || h || R || k) {
      if (U) {
        a(E, C, false);
      }
      const [t, n] = L(Y, j, Q);
      const [o, s] = W = v(i);
      const [e, c] = X = p(i);
      const l = clientSize(r);
      let u = e;
      let d = l;
      t();
      if ((c || s || k) && n && !Y && P(n, e, o, j)) {
        d = clientSize(r);
        u = scrollSize(r);
      }
      const f = {
        w: yt(bt(e.w, u.w) + o.w),
        h: yt(bt(e.h, u.h) + o.h)
      };
      const _ = {
        w: yt(d.w + yt(l.w - e.w) + o.w),
        h: yt(d.h + yt(l.h - e.h) + o.h)
      };
      K = z(_);
      J = y(getOverflowAmount(f, _), i);
    }
    const [Z, tt] = K;
    const [nt, ot] = J;
    const [st, et] = X;
    const [ct, rt] = W;
    const it = {
      x: nt.w > 0,
      y: nt.h > 0
    };
    const lt = G && N && (it.x || it.y) || G && it.x && !it.y || N && it.y && !it.x;
    if (H || R || rt || et || tt || ot || F || k || q) {
      const t = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: "",
        overflowY: "",
        overflowX: ""
      };
      const n = setViewportOverflowState(Y, it, B, t);
      const o = P(n, st, ct, j);
      if (!l) {
        hideNativeScrollbars(n, j, o, t);
      }
      if (q) {
        fixFlexboxGlue(n, D);
      }
      if (l) {
        attr(e, S, t.overflowX);
        attr(e, x, t.overflowY);
      } else {
        style(r, t);
      }
    }
    attrClass(e, m, C, lt);
    conditionalClass(c, E, lt);
    !l && conditionalClass(r, E, U);
    const [at, ut] = A(getViewportOverflowState(Y).xt);
    s({
      xt: at,
      $t: {
        x: Z.w,
        y: Z.h
      },
      Ot: {
        x: nt.w,
        y: nt.h
      },
      zt: it
    });
    return {
      Tt: ut,
      At: tt,
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
  const {K: o} = t;
  const {L: s, P: e, R: c} = getEnvironment();
  const r = !s && (e.x || e.y);
  const i = [ createTrinsicUpdateSegment(t, n), createPaddingUpdateSegment(t, n), createOverflowUpdateSegment(t, n) ];
  return (t, n, s) => {
    const e = prepareUpdateHints(assignDeep({
      gt: false,
      yt: false,
      wt: false,
      _t: false,
      At: false,
      It: false,
      Tt: false,
      Ct: false,
      ht: false
    }, n), {}, s);
    const l = r || !c;
    const a = l && scrollLeft(o);
    const u = l && scrollTop(o);
    let d = e;
    each(i, (n => {
      d = prepareUpdateHints(d, n(d, t, !!s) || {}, s);
    }));
    if (isNumber(a)) {
      scrollLeft(o, a);
    }
    if (isNumber(u)) {
      scrollTop(o, u);
    }
    return d;
  };
};

const Ot = "animationstart";

const zt = "scroll";

const Tt = 3333333;

const getElmDirectionIsRTL = t => "rtl" === style(t, "direction");

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, o) => {
  const {Et: s = false, Pt: e = false} = o || {};
  const c = getPlugins()[_t];
  const {M: r} = getEnvironment();
  const i = createDOM(`<div class="${P}"><div class="${H}"></div></div>`);
  const l = i[0];
  const a = l.firstChild;
  const d = getElmDirectionIsRTL.bind(0, l);
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
      const n = e ? t[0] : getElmDirectionIsRTL(l);
      scrollLeft(l, n ? r.n ? -Tt : r.i ? 0 : Tt : Tt);
      scrollTop(l, Tt);
    }
    if (!c) {
      n({
        gt: !e,
        Lt: e ? t : void 0,
        Pt: !!i
      });
    }
  };
  const _ = [];
  let g = e ? onSizeChangedCallbackProxy : false;
  let h;
  if (u) {
    const t = new u(onSizeChangedCallbackProxy);
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
      u: !d()
    }, d);
    const [t] = h;
    push(_, on(l, zt, (n => {
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
    addClass(l, L);
    push(_, on(l, Ot, g, {
      O: !!u
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
  const {Ht: c, Mt: r, Rt: i, Dt: a, jt: u, Vt: d} = s || {};
  const [f, _] = createEventContentChange(t, debounce((() => {
    if (e) {
      o(true);
    }
  }), {
    v: 33,
    p: 99
  }), i);
  const g = c || [];
  const h = r || [];
  const v = g.concat(h);
  const observerCallback = e => {
    const c = u || noop;
    const r = d || noop;
    const i = [];
    const l = [];
    let f = false;
    let g = false;
    let v = false;
    each(e, (o => {
      const {attributeName: e, target: u, type: d, oldValue: _, addedNodes: w} = o;
      const p = "attributes" === d;
      const b = "childList" === d;
      const y = t === u;
      const m = p && isString(e) ? attr(u, e) : 0;
      const S = 0 !== m && _ !== m;
      const x = indexOf(h, e) > -1 && S;
      if (n && !y) {
        const n = !p;
        const i = p && x;
        const d = i && a && is(u, a);
        const f = d ? !c(u, e, _, m) : n || i;
        const h = f && !r(o, !!d, t, s);
        push(l, w);
        g = g || h;
        v = v || b;
      }
      if (!n && y && S && !c(u, e, _, m)) {
        push(i, e);
        f = f || x;
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
    } else if (!isEmptyArray(i) || f) {
      o(i, f);
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
      f();
      w.disconnect();
      e = false;
    }
  }, () => {
    if (e) {
      observerCallback(w.takeRecords());
    }
  } ];
};

const At = `[${m}]`;

const It = `.${z}`;

const Et = [ "tabindex" ];

const Pt = [ "wrap", "cols", "rows" ];

const Lt = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, o) => {
  let s;
  let e;
  let c;
  const [, r] = n;
  const {J: i, K: l, A: a, ct: d, lt: f, ut: _, dt: g} = t;
  const {L: h, R: v} = getEnvironment();
  const [w] = createCache({
    _: equalWH,
    u: {
      w: 0,
      h: 0
    }
  }, (() => {
    const t = _(E, C);
    t && g(E, C);
    const n = scrollSize(a);
    const o = scrollSize(l);
    const s = fractionalSize(l);
    t && g(E, C, true);
    return {
      w: o.w + n.w + s.w,
      h: o.h + n.h + s.h
    };
  }));
  const p = d ? Pt : Lt.concat(Pt);
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
    each(t || Et, (t => {
      if (indexOf(Et, t) > -1) {
        const n = attr(i, t);
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
    r({
      ft: n
    });
    o({
      _t: s
    });
  };
  const onSizeChanged = ({gt: t, Lt: n, Pt: s}) => {
    const e = !t || s ? o : b;
    let c = false;
    if (n) {
      const [t, o] = n;
      c = o;
      r({
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
    } else if (!f) {
      updateViewportAttrsFromHost(t);
    }
  };
  const y = (a || !v) && createTrinsicObserver(i, onTrinsicChanged);
  const m = !f && createSizeObserver(i, onSizeChanged, {
    Pt: true,
    Et: !h
  });
  const [S] = createDOMObserver(i, false, onHostMutation, {
    Mt: Lt,
    Ht: Lt.concat(Et)
  });
  const x = f && new u(onSizeChanged.bind(0, {
    gt: true
  }));
  x && x.observe(i);
  updateViewportAttrsFromHost();
  return [ t => {
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
        Mt: p.concat(o || []),
        Ht: p.concat(o || []),
        Rt: i,
        Dt: At,
        Vt: (t, n) => {
          const {target: o, attributeName: s} = t;
          const e = !n && s ? liesBetween(o, At, It) : false;
          return e || !!ignoreMutationFromOptions(t);
        }
      });
    }
    if (f) {
      b.S();
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
  }, () => {
    c && c[0]();
    y && y();
    m && m();
    x && x.disconnect();
    S();
  } ];
};

const Ht = {
  x: 0,
  y: 0
};

const Mt = {
  T: {
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
  $t: Ht,
  Ot: Ht,
  xt: {
    x: "hidden",
    y: "hidden"
  },
  zt: {
    x: false,
    y: false
  },
  ft: false,
  vt: false
};

const createStructureSetup = (t, n) => {
  const o = createOptionCheck(n, {});
  const s = createState(Mt);
  const [e, c, r] = createEventListenerHub();
  const [i] = s;
  const [l, a, u] = createStructureSetupElements(t);
  const d = createStructureSetupUpdate(l, s);
  const [f, _] = createStructureSetupObservers(l, s, (t => {
    r("u", [ d(o, t), {}, false ]);
  }));
  const g = i.bind(0);
  g.kt = t => {
    e("u", t);
  };
  g.Bt = a;
  g.Ft = l;
  return [ (t, o) => {
    const s = createOptionCheck(n, t, o);
    f(s);
    r("u", [ d(s, {}, o), t, !!o ]);
  }, g, () => {
    c();
    _();
    u();
  } ];
};

const Rt = "touchstart mouseenter";

const Dt = "touchend touchcancel mouseleave";

const createScrollbarsSetupElements = (t, n) => {
  const {j: o} = getEnvironment();
  const {Yt: s} = o();
  const {Z: e, J: c, K: r, it: i} = n;
  const l = !i && t.scrollbarsSlot;
  const a = dynamicInitializationElement([ e, c, r ], (() => c), s, l);
  const scrollbarsAddRemoveClass = (t, n, o) => {
    const s = o ? addClass : removeClass;
    each(t, (t => {
      s(t.qt, n);
    }));
  };
  const u = [];
  const d = [];
  const f = [];
  const _ = scrollbarsAddRemoveClass.bind(0, d);
  const g = scrollbarsAddRemoveClass.bind(0, f);
  const generateScrollbarDOM = t => {
    const n = t ? k : B;
    const o = t ? d : f;
    const s = createDiv(`${V} ${n} os-theme-dark`);
    const e = createDiv(F);
    const c = createDiv(Y);
    const r = {
      qt: s,
      Gt: e,
      Nt: c
    };
    appendChildren(s, e);
    appendChildren(e, c);
    push(u, removeElements.bind(0, s));
    push(o, r);
    push(u, on(s, Rt, (() => {
      _(N, true);
      g(N, true);
    })));
    push(u, on(s, Dt, (() => {
      _(N);
      g(N);
    })));
    return r;
  };
  const h = generateScrollbarDOM.bind(0, true);
  const v = generateScrollbarDOM.bind(0, false);
  const appendElements = () => {
    appendChildren(a, d[0].qt);
    appendChildren(a, f[0].qt);
  };
  h();
  v();
  return [ {
    Ut: {
      Wt: d,
      Xt: h,
      Jt: _
    },
    Kt: {
      Wt: f,
      Xt: v,
      Jt: g
    }
  }, appendElements, runEachAndClear.bind(0, u) ];
};

const createSelfCancelTimeout = t => {
  let n;
  const o = t ? window.setTimeout : f;
  const s = t ? window.clearTimeout : d;
  return [ e => {
    s(n);
    n = o(e, isFunction(t) ? t() : t);
  }, () => s(n) ];
};

const createScrollbarsSetup = (t, n, o) => {
  let s = 0;
  let e;
  let c;
  let r;
  let i;
  const l = createState({});
  const [a] = l;
  const [u, d] = createSelfCancelTimeout();
  const [f, _] = createSelfCancelTimeout();
  const [g, h] = createSelfCancelTimeout(100);
  const [v, w] = createSelfCancelTimeout(100);
  const [p, b] = createSelfCancelTimeout((() => s));
  const [y, m, S] = createScrollbarsSetupElements(t, o.Ft);
  const {Ut: x, Kt: C} = y;
  const {Jt: $} = x;
  const {Jt: O} = C;
  const manageScrollbarsAutoHide = (t, n) => {
    b();
    if (t) {
      $(U);
      O(U);
    } else {
      const hide = () => {
        $(U, true);
        O(U, true);
      };
      if (s > 0 && !n) {
        p(hide);
      } else {
        hide();
      }
    }
  };
  const z = [ h, b, w, _, d, S, on(o.Ft.J, "mouseenter", (() => {
    i = true;
    c && manageScrollbarsAutoHide(true);
  })), on(o.Ft.J, "mouseleave", (() => {
    i = false;
    c && manageScrollbarsAutoHide(false);
  })), on(o.Ft.J, "mousemove", (() => {
    e && u((() => {
      h();
      manageScrollbarsAutoHide(true);
      v((() => {
        e && manageScrollbarsAutoHide(false);
      }));
    }));
  })), on(o.Ft.K, "scroll", (() => {
    r && f((() => {
      manageScrollbarsAutoHide(true);
      g((() => {
        r && !i && manageScrollbarsAutoHide(false);
      }));
    }));
  })) ];
  const T = a.bind(0);
  T.Ft = y;
  T.Bt = m;
  return [ (t, i, l) => {
    const {At: a, It: u, Tt: d} = l;
    const f = createOptionCheck(n, t, i);
    const [_, g] = f("scrollbars.visibility");
    const [h, v] = f("scrollbars.autoHide");
    const [w] = f("scrollbars.autoHideDelay");
    f("scrollbars.dragScrolling");
    f("scrollbars.touchSupport");
    const p = d || g;
    const setScrollbarVisibility = (t, n) => {
      const o = "visible" === _ || "auto" === _ && "scroll" === t;
      n(q, o);
      return o;
    };
    s = w;
    if (p) {
      const {xt: t} = o();
      const n = setScrollbarVisibility(t.x, $);
      const s = setScrollbarVisibility(t.y, O);
      const e = n && s;
      $(G, !e);
      O(G, !e);
    }
    if (v) {
      e = "move" === h;
      c = "leave" === h;
      r = "never" !== h;
      manageScrollbarsAutoHide(!r, true);
    }
  }, T, runEachAndClear.bind(0, z) ];
};

const jt = new Set;

const Vt = new WeakMap;

const addInstance = (t, n) => {
  Vt.set(t, n);
  jt.add(t);
};

const removeInstance = t => {
  Vt.delete(t);
  jt.delete(t);
};

const getInstance = t => Vt.get(t);

const OverlayScrollbars = (t, n, o) => {
  let s = false;
  const {k: e, P: c, D: r} = getEnvironment();
  const i = getPlugins();
  const l = isHTMLElement(t) ? t : t.target;
  const a = getInstance(l);
  if (a) {
    return a;
  }
  const u = i[at];
  const validateOptions = t => {
    const n = t || {};
    const o = u && u.q;
    return o ? o(n, true) : n;
  };
  const d = assignDeep({}, e(), validateOptions(n));
  const [f, _, g] = createEventListenerHub(o);
  const [h, v, w] = createStructureSetup(t, d);
  const [p, b, y] = createScrollbarsSetup(t, d, v);
  const update = (t, n) => {
    h(t, !!n);
  };
  const m = r(update.bind(0, {}, true));
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
      const {$t: t, Ot: n, xt: o, zt: e, T: c, bt: r} = v();
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
      const {Z: t, J: n, T: o, K: s, A: e} = v.Ft;
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
  v.kt(((t, n, o) => {
    p(n, o, t);
  }));
  each(keys(i), (t => {
    const n = i[t];
    if (isFunction(n)) {
      n(OverlayScrollbars, S);
    }
  }));
  if (c.x && c.y && !d.nativeScrollbarsOverlaid.initialize) {
    destroy(true);
    return S;
  }
  v.Bt();
  b.Bt();
  addInstance(l, S);
  g("initialized", [ S ]);
  v.kt(((t, n, o) => {
    const {gt: s, wt: e, _t: c, At: r, It: i, Tt: l, ht: a, Ct: u} = t;
    g("updated", [ S, {
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
  const {I: t, P: n, L: o, M: s, R: e, H: c, F: r, Y: i, j: l, V: a, k: u, B: d} = getEnvironment();
  return assignDeep({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: n,
    scrollbarsHiding: o,
    rtlScrollBehavior: s,
    flexboxGlue: e,
    cssCustomProperties: c,
    defaultInitializationStrategy: r,
    defaultDefaultOptions: i,
    getInitializationStrategy: l,
    setInitializationStrategy: a,
    getDefaultOptions: u,
    setDefaultOptions: d
  });
};

export { OverlayScrollbars, ut as optionsValidationPlugin, wt as scrollbarsHidingPlugin, gt as sizeObserverPlugin };
//# sourceMappingURL=overlayscrollbars.esm.js.map
