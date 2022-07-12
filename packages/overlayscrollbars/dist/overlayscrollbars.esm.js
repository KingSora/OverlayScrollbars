function createCache(t, n) {
  const {o: e, u: s, _: o} = t;
  let c = e;
  let i;
  const cacheUpdateContextual = (t, n) => {
    const e = c;
    const r = t;
    const a = n || (s ? !s(e, r) : e !== r);
    if (a || o) {
      c = r;
      i = e;
    }
    return [ c, a, i ];
  };
  const cacheUpdateIsolated = t => cacheUpdateContextual(n(c, i), t);
  const getCurrentCache = t => [ c, !!t, i ];
  return [ n ? cacheUpdateIsolated : cacheUpdateContextual, getCurrentCache ];
}

function isUndefined(t) {
  return void 0 === t;
}

function isNull(t) {
  return null === t;
}

function isNumber(t) {
  return "number" === typeof t;
}

function isString(t) {
  return "string" === typeof t;
}

function isBoolean(t) {
  return "boolean" === typeof t;
}

function isFunction(t) {
  return "function" === typeof t;
}

function isArray(t) {
  return Array.isArray(t);
}

function isObject(t) {
  return "object" === typeof t && !isArray(t) && !isNull(t);
}

function isArrayLike(t) {
  const n = !!t && t.length;
  const e = isNumber(n) && n > -1 && n % 1 == 0;
  return isArray(t) || !isFunction(t) && e ? n > 0 && isObject(t) ? n - 1 in t : true : false;
}

function isPlainObject(t) {
  if (!t || !isObject(t) || "object" !== type(t)) {
    return false;
  }
  let n;
  const s = "constructor";
  const o = t[s];
  const c = o && o.prototype;
  const i = e.call(t, s);
  const r = c && e.call(c, "isPrototypeOf");
  if (o && !i && !r) {
    return false;
  }
  for (n in t) {}
  return isUndefined(n) || e.call(t, n);
}

function isHTMLElement(n) {
  const e = window.HTMLElement;
  return n ? e ? n instanceof e : n.nodeType === t : false;
}

function isElement(n) {
  const e = window.Element;
  return n ? e ? n instanceof e : n.nodeType === t : false;
}

function each(t, n) {
  if (isArrayLike(t)) {
    for (let e = 0; e < t.length; e++) {
      if (false === n(t[e], e, t)) {
        break;
      }
    }
  } else if (t) {
    each(Object.keys(t), (e => n(t[e], e, t)));
  }
  return t;
}

function assignDeep(t, n, e, s, o, c, i) {
  const r = [ n, e, s, o, c, i ];
  if (("object" !== typeof t || isNull(t)) && !isFunction(t)) {
    t = {};
  }
  each(r, (n => {
    each(keys(n), (e => {
      const s = n[e];
      if (t === s) {
        return true;
      }
      const o = isArray(s);
      if (s && (isPlainObject(s) || o)) {
        const n = t[e];
        let c = n;
        if (o && !isArray(n)) {
          c = [];
        } else if (!o && !isPlainObject(n)) {
          c = {};
        }
        t[e] = assignDeep(c, s);
      } else {
        t[e] = s;
      }
    }));
  }));
  return t;
}

function isEmptyObject(t) {
  for (const n in t) {
    return false;
  }
  return true;
}

function getSetProp(t, n, e, s) {
  if (isUndefined(s)) {
    return e ? e[t] : n;
  }
  e && (e[t] = s);
}

function attr(t, n, e) {
  if (isUndefined(e)) {
    return t ? t.getAttribute(n) : null;
  }
  t && t.setAttribute(n, e);
}

function scrollLeft(t, n) {
  return getSetProp("scrollLeft", 0, t, n);
}

function scrollTop(t, n) {
  return getSetProp("scrollTop", 0, t, n);
}

function style(t, n) {
  const e = isString(n);
  const s = isArray(n) || e;
  if (s) {
    let s = e ? "" : {};
    if (t) {
      const o = window.getComputedStyle(t, null);
      s = e ? getCSSVal(t, o, n) : n.reduce(((n, e) => {
        n[e] = getCSSVal(t, o, e);
        return n;
      }), s);
    }
    return s;
  }
  each(keys(n), (e => setCSSVal(t, e, n[e])));
}

function getDefaultExportFromCjs(t) {
  return t && t.g && Object.prototype.hasOwnProperty.call(t, "default") ? t["default"] : t;
}

const t = Node.ELEMENT_NODE;

const {toString: n, hasOwnProperty: e} = Object.prototype;

const type = t => isUndefined(t) || isNull(t) ? `${t}` : n.call(t).replace(/^\[object (.+)\]$/, "$1").toLowerCase();

const indexOf = (t, n, e) => t.indexOf(n, e);

const push = (t, n, e) => {
  !e && !isString(n) && isArrayLike(n) ? Array.prototype.push.apply(t, n) : t.push(n);
  return t;
};

const from = t => {
  if (Array.from && t) {
    return Array.from(t);
  }
  const n = [];
  if (t instanceof Set) {
    t.forEach((t => {
      push(n, t);
    }));
  } else {
    each(t, (t => {
      push(n, t);
    }));
  }
  return n;
};

const isEmptyArray = t => !!t && 0 === t.length;

const runEachAndClear = (t, n, e) => {
  const runFn = t => t && t.apply(void 0, n || []);
  if (t instanceof Set) {
    t.forEach(runFn);
    !e && t.clear();
  } else {
    each(t, runFn);
    !e && t.splice && t.splice(0, t.length);
  }
};

const hasOwnProperty = (t, n) => Object.prototype.hasOwnProperty.call(t, n);

const keys = t => t ? Object.keys(t) : [];

const attrClass = (t, n, e, s) => {
  const o = attr(t, n) || "";
  const c = new Set(o.split(" "));
  c[s ? "add" : "delete"](e);
  attr(t, n, from(c).join(" ").trim());
};

const hasAttrClass = (t, n, e) => {
  const s = attr(t, n) || "";
  const o = new Set(s.split(" "));
  return o.has(e);
};

const removeAttr = (t, n) => {
  t && t.removeAttribute(n);
};

const s = Element.prototype;

const find = (t, n) => {
  const e = [];
  const s = n ? isElement(n) ? n : null : document;
  return s ? push(e, s.querySelectorAll(t)) : e;
};

const findFirst = (t, n) => {
  const e = n ? isElement(n) ? n : null : document;
  return e ? e.querySelector(t) : null;
};

const is = (t, n) => {
  if (isElement(t)) {
    const e = s.matches || s.msMatchesSelector;
    return e.call(t, n);
  }
  return false;
};

const contents = t => t ? from(t.childNodes) : [];

const parent = t => t ? t.parentElement : null;

const closest = (t, n) => {
  if (isElement(t)) {
    const e = s.closest;
    if (e) {
      return e.call(t, n);
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

const liesBetween = (t, n, e) => {
  const s = t && closest(t, n);
  const o = t && findFirst(e, s);
  return s && o ? s === t || o === t || closest(closest(t, e), n) !== s : false;
};

const before = (t, n, e) => {
  if (e) {
    let s = n;
    let o;
    if (t) {
      if (isArrayLike(e)) {
        o = document.createDocumentFragment();
        each(e, (t => {
          if (t === s) {
            s = t.previousSibling;
          }
          o.appendChild(t);
        }));
      } else {
        o = e;
      }
      if (n) {
        if (!s) {
          s = t.firstChild;
        } else if (s !== n) {
          s = s.nextSibling;
        }
      }
      t.insertBefore(o, s || null);
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

const o = [ "-webkit-", "-moz-", "-o-", "-ms-" ];

const c = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ];

const i = {};

const r = {};

const cssProperty = t => {
  let n = r[t];
  if (hasOwnProperty(r, t)) {
    return n;
  }
  const e = firstLetterToUpper(t);
  const s = getDummyStyle();
  each(o, (o => {
    const c = o.replace(/-/g, "");
    const i = [ t, o + t, c + e, firstLetterToUpper(c) + e ];
    return !(n = i.find((t => void 0 !== s[t])));
  }));
  return r[t] = n || "";
};

const jsAPI = t => {
  let n = i[t] || window[t];
  if (hasOwnProperty(i, t)) {
    return n;
  }
  each(c, (e => {
    n = n || window[e + firstLetterToUpper(t)];
    return !n;
  }));
  i[t] = n;
  return n;
};

const a = jsAPI("MutationObserver");

const l = jsAPI("IntersectionObserver");

const u = jsAPI("ResizeObserver");

const f = jsAPI("cancelAnimationFrame");

const d = jsAPI("requestAnimationFrame");

const _ = /[^\x20\t\r\n\f]+/g;

const classListAction = (t, n, e) => {
  let s;
  let o = 0;
  let c = false;
  if (t && n && isString(n)) {
    const i = n.match(_) || [];
    c = i.length > 0;
    while (s = i[o++]) {
      c = !!e(t.classList, s) && c;
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

const equal = (t, n, e, s) => {
  if (t && n) {
    let o = true;
    each(e, (e => {
      const c = s ? s(t[e]) : t[e];
      const i = s ? s(n[e]) : n[e];
      if (c !== i) {
        o = false;
      }
    }));
    return o;
  }
  return false;
};

const equalWH = (t, n) => equal(t, n, [ "w", "h" ]);

const equalXY = (t, n) => equal(t, n, [ "x", "y" ]);

const equalTRBL = (t, n) => equal(t, n, [ "t", "r", "b", "l" ]);

const equalBCRWH = (t, n, e) => equal(t, n, [ "width", "height" ], e && (t => Math.round(t)));

const clearTimeouts = t => {
  t && window.clearTimeout(t);
  t && f(t);
};

const noop = () => {};

const debounce = (t, n) => {
  let e;
  let s;
  let o;
  let c;
  const {p: i, v: r, m: a} = n || {};
  const l = window.setTimeout;
  const u = function invokeFunctionToDebounce(n) {
    clearTimeouts(e);
    clearTimeouts(s);
    s = e = o = void 0;
    t.apply(this, n);
  };
  const mergeParms = t => a && o ? a(o, t) : t;
  const flush = () => {
    if (e) {
      u(mergeParms(c) || c);
    }
  };
  const f = function debouncedFn() {
    const t = from(arguments);
    const n = isFunction(i) ? i() : i;
    const a = isNumber(n) && n >= 0;
    if (a) {
      const i = isFunction(r) ? r() : r;
      const a = isNumber(i) && i >= 0;
      const f = n > 0 ? l : d;
      const _ = mergeParms(t);
      const g = _ || t;
      const h = u.bind(0, g);
      clearTimeouts(e);
      e = f(h, n);
      if (a && !s) {
        s = l(flush, i);
      }
      o = c = g;
    } else {
      u(t);
    }
  };
  f.S = flush;
  return f;
};

const g = {
  opacity: 1,
  zindex: 1
};

const parseToZeroOrNumber = (t, n) => {
  const e = n ? parseFloat(t) : parseInt(t, 10);
  return Number.isNaN(e) ? 0 : e;
};

const adaptCSSVal = (t, n) => !g[t.toLowerCase()] && isNumber(n) ? `${n}px` : n;

const getCSSVal = (t, n, e) => null != n ? n[e] || n.getPropertyValue(e) : t.style[e];

const setCSSVal = (t, n, e) => {
  try {
    if (t) {
      const {style: s} = t;
      if (!isUndefined(s[n])) {
        s[n] = adaptCSSVal(n, e);
      } else {
        s.setProperty(n, e);
      }
    }
  } catch (s) {}
};

const topRightBottomLeft = (t, n, e) => {
  const s = n ? `${n}-` : "";
  const o = e ? `-${e}` : "";
  const c = `${s}top${o}`;
  const i = `${s}right${o}`;
  const r = `${s}bottom${o}`;
  const a = `${s}left${o}`;
  const l = style(t, [ c, i, r, a ]);
  return {
    t: parseToZeroOrNumber(l[c]),
    r: parseToZeroOrNumber(l[i]),
    b: parseToZeroOrNumber(l[r]),
    l: parseToZeroOrNumber(l[a])
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
  const e = parseFloat(style(t, "height")) || 0;
  return {
    w: e - Math.round(e),
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
        get: function() {
          p = true;
        }
      }));
    } catch (t) {}
  }
  return p;
};

const splitEventNames = t => t.split(" ");

const off = (t, n, e, s) => {
  each(splitEventNames(n), (n => {
    t.removeEventListener(n, e, s);
  }));
};

const on = (t, n, e, s) => {
  const o = supportPassiveEvents();
  const c = o && s && s.C || false;
  const i = s && s.O || false;
  const r = s && s.$ || false;
  const a = [];
  const l = o ? {
    passive: c,
    capture: i
  } : i;
  each(splitEventNames(n), (n => {
    const s = r ? o => {
      t.removeEventListener(n, s, i);
      e && e(o);
    } : e;
    push(a, off.bind(null, t, n, s, i));
    t.addEventListener(n, s, l);
  }));
  return runEachAndClear.bind(0, a);
};

const stopPropagation = t => t.stopPropagation();

const preventDefault = t => t.preventDefault();

const stopAndPrevent = t => stopPropagation(t) || preventDefault(t);

const v = {
  x: 0,
  y: 0
};

const absoluteCoordinates = t => {
  const n = t ? getBoundingClientRect(t) : 0;
  return n ? {
    x: n.left + window.pageYOffset,
    y: n.top + window.pageXOffset
  } : v;
};

const manageListener = (t, n) => {
  each(isArray(n) ? n : [ n ], t);
};

const createEventListenerHub = t => {
  function removeEvent(t, e) {
    if (t) {
      const s = n.get(t);
      manageListener((t => {
        if (s) {
          s[t ? "delete" : "clear"](t);
        }
      }), e);
    } else {
      n.forEach((t => {
        t.clear();
      }));
      n.clear();
    }
  }
  function addEvent(t, e) {
    const s = n.get(t) || new Set;
    n.set(t, s);
    manageListener((t => {
      t && s.add(t);
    }), e);
    return removeEvent.bind(0, t, e);
  }
  function triggerEvent(t, e) {
    const s = n.get(t);
    each(from(s), (t => {
      if (e && !isEmptyArray(e)) {
        t.apply(0, e);
      } else {
        t();
      }
    }));
  }
  const n = new Map;
  const e = keys(t);
  each(e, (n => {
    addEvent(n, t[n]);
  }));
  return [ addEvent, removeEvent, triggerEvent ];
};

const getPropByPath = (t, n) => t ? n.split(".").reduce(((t, n) => t && hasOwnProperty(t, n) ? t[n] : void 0), t) : void 0;

const createOptionCheck = (t, n, e) => s => [ getPropByPath(t, s), e || void 0 !== getPropByPath(n, s) ];

const createState = t => {
  let n = t;
  return [ () => n, t => {
    n = assignDeep({}, n, t);
  } ];
};

const b = "os-environment";

const w = `${b}-flexbox-glue`;

const y = `${w}-max`;

const m = "data-overlayscrollbars";

const S = `${m}-overflow-x`;

const x = `${m}-overflow-y`;

const C = "overflowVisible";

const O = "viewportStyled";

const $ = "os-padding";

const A = "os-viewport";

const L = `${A}-arrange`;

const T = "os-content";

const z = `${A}-scrollbar-styled`;

const D = `os-overflow-visible`;

const E = "os-size-observer";

const P = `${E}-appear`;

const I = `${E}-listener`;

const j = `${I}-scroll`;

const M = `${I}-item`;

const H = `${M}-final`;

const N = "os-trinsic-observer";

const R = "os-scrollbar";

const F = `${R}-horizontal`;

const V = `${R}-vertical`;

const k = "os-scrollbar-track";

const B = "os-scrollbar-handle";

const opsStringify = t => JSON.stringify(t, ((t, n) => {
  if (isFunction(n)) {
    throw new Error;
  }
  return n;
}));

const U = {
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
  const e = {};
  const s = keys(n).concat(keys(t));
  each(s, (s => {
    const o = t[s];
    const c = n[s];
    if (isObject(o) && isObject(c)) {
      assignDeep(e[s] = {}, getOptionsDiff(o, c));
    } else if (hasOwnProperty(n, s) && c !== o) {
      let t = true;
      if (isArray(o) || isArray(c)) {
        try {
          if (opsStringify(o) === opsStringify(c)) {
            t = false;
          }
        } catch (i) {}
      }
      if (t) {
        e[s] = c;
      }
    }
  }));
  return e;
};

let Y;

const {abs: q, round: G} = Math;

const diffBiggerThanOne = (t, n) => {
  const e = q(t);
  const s = q(n);
  return !(e === s || e + 1 === s || e - 1 === s);
};

const getNativeScrollbarSize = (t, n, e) => {
  appendChildren(t, n);
  const s = clientSize(n);
  const o = offsetSize(n);
  const c = fractionalSize(e);
  return {
    x: o.h - s.h + c.h,
    y: o.w - s.w + c.w
  };
};

const getNativeScrollbarsHiding = t => {
  let n = false;
  const e = addClass(t, z);
  try {
    n = "none" === style(t, cssProperty("scrollbar-width")) || "none" === window.getComputedStyle(t, "::-webkit-scrollbar").getPropertyValue("display");
  } catch (s) {}
  e();
  return n;
};

const getRtlScrollBehavior = (t, n) => {
  const e = "hidden";
  style(t, {
    overflowX: e,
    overflowY: e,
    direction: "rtl"
  });
  scrollLeft(t, 0);
  const s = absoluteCoordinates(t);
  const o = absoluteCoordinates(n);
  scrollLeft(t, -999);
  const c = absoluteCoordinates(n);
  return {
    i: s.x === o.x,
    n: o.x !== c.x
  };
};

const getFlexboxGlue = (t, n) => {
  const e = addClass(t, w);
  const s = getBoundingClientRect(t);
  const o = getBoundingClientRect(n);
  const c = equalBCRWH(o, s, true);
  const i = addClass(t, y);
  const r = getBoundingClientRect(t);
  const a = getBoundingClientRect(n);
  const l = equalBCRWH(a, r, true);
  e();
  i();
  return c && l;
};

const getWindowDPR = () => {
  const t = window.screen.deviceXDPI || 0;
  const n = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || t / n;
};

const createEnvironment = () => {
  const {body: t} = document;
  const n = createDOM(`<div class="${b}"><div></div></div>`);
  const e = n[0];
  const s = e.firstChild;
  const [o, , c] = createEventListenerHub();
  const [i, r] = createCache({
    o: getNativeScrollbarSize(t, e, s),
    u: equalXY
  });
  const [a] = r();
  const l = getNativeScrollbarsHiding(e);
  const u = {
    x: 0 === a.x,
    y: 0 === a.y
  };
  const f = {
    A: !l,
    L: false
  };
  const d = assignDeep({}, U);
  const _ = {
    T: a,
    D: u,
    P: l,
    I: "-1" === style(e, "zIndex"),
    j: getRtlScrollBehavior(e, s),
    M: getFlexboxGlue(e, s),
    H: t => o("_", t),
    N: assignDeep.bind(0, {}, f),
    R(t) {
      assignDeep(f, t);
    },
    F: assignDeep.bind(0, {}, d),
    V(t) {
      assignDeep(d, t);
    },
    k: assignDeep({}, f),
    B: assignDeep({}, d)
  };
  removeAttr(e, "style");
  removeElements(e);
  if (!l && (!u.x || !u.y)) {
    let n = windowSize();
    let o = getWindowDPR();
    window.addEventListener("resize", (() => {
      const r = windowSize();
      const a = {
        w: r.w - n.w,
        h: r.h - n.h
      };
      if (0 === a.w && 0 === a.h) {
        return;
      }
      const l = {
        w: q(a.w),
        h: q(a.h)
      };
      const u = {
        w: q(G(r.w / (n.w / 100))),
        h: q(G(r.h / (n.h / 100)))
      };
      const f = getWindowDPR();
      const d = l.w > 2 && l.h > 2;
      const _ = !diffBiggerThanOne(u.w, u.h);
      const g = f !== o && o > 0;
      const h = d && _ && g;
      if (h) {
        const [n, o] = i(getNativeScrollbarSize(t, e, s));
        assignDeep(Y.T, n);
        removeElements(e);
        if (o) {
          c("_");
        }
      }
      n = r;
      o = f;
    }));
  }
  return _;
};

const getEnvironment = () => {
  if (!Y) {
    Y = createEnvironment();
  }
  return Y;
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
        var e = arguments[n];
        for (var s in e) {
          if (Object.prototype.hasOwnProperty.call(e, s)) {
            t[s] = e[s];
          }
        }
      }
      return t;
    }, t.exports.g = true, t.exports["default"] = t.exports;
    return _extends.apply(this, arguments);
  }
  t.exports = _extends, t.exports.g = true, t.exports["default"] = t.exports;
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

const validateRecursive = (t, n, e, s) => {
  const o = {};
  const c = J({}, n);
  const i = keys(t).filter((t => hasOwnProperty(n, t)));
  each(i, (i => {
    const r = n[i];
    const a = t[i];
    const l = isPlainObject(a);
    const u = s ? `${s}.` : "";
    if (l && isPlainObject(r)) {
      const [t, n] = validateRecursive(a, r, e, u + i);
      o[i] = t;
      c[i] = n;
      each([ c, o ], (t => {
        if (isEmptyObject(t[i])) {
          delete t[i];
        }
      }));
    } else if (!l) {
      let t = false;
      const n = [];
      const s = [];
      const l = type(r);
      const f = !isArray(a) ? [ a ] : a;
      each(f, (e => {
        let o;
        each(K, ((t, n) => {
          if (t === e) {
            o = n;
          }
        }));
        const c = isUndefined(o);
        if (c && isString(r)) {
          const s = e.split(" ");
          t = !!s.find((t => t === r));
          push(n, s);
        } else {
          t = K[l] === e;
        }
        push(s, c ? K.string : o);
        return !t;
      }));
      if (t) {
        o[i] = r;
      } else if (e) {
        console.warn(`${`The option "${u}${i}" wasn't set, because it doesn't accept the type [ ${l.toUpperCase()} ] with the value of "${r}".\r\n` + `Accepted types are: [ ${s.join(", ").toUpperCase()} ].\r\n`}${n.length > 0 ? `\r\nValid strings are: [ ${n.join(", ")} ].` : ""}`);
      }
      delete c[i];
    }
  }));
  return [ o, c ];
};

const validateOptions = (t, n, e) => validateRecursive(t, n, e);

const Q = K.number;

const Z = K.boolean;

const tt = [ K.array, K.null ];

const nt = "hidden scroll visible visible-hidden";

const et = "visible hidden auto";

const st = "never scroll leavemove";

const ot = {
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
    visibility: et,
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
    U: (t, n) => {
      const [e, s] = validateOptions(ot, t, n);
      return J({}, s, e);
    }
  }
};

const rt = 3333333;

const at = "scroll";

const lt = "__osSizeObserverPlugin";

const ut = {
  [lt]: {
    U: (t, n, e) => {
      const s = createDOM(`<div class="${M}" dir="ltr"><div class="${M}"><div class="${H}"></div></div><div class="${M}"><div class="${H}" style="width: 200%; height: 200%"></div></div></div>`);
      appendChildren(t, s);
      addClass(t, j);
      const o = s[0];
      const c = o.lastChild;
      const i = o.firstChild;
      const r = null == i ? void 0 : i.firstChild;
      let a = offsetSize(o);
      let l = a;
      let u = false;
      let _;
      const reset = () => {
        scrollLeft(i, rt);
        scrollTop(i, rt);
        scrollLeft(c, rt);
        scrollTop(c, rt);
      };
      const onResized = t => {
        _ = 0;
        if (u) {
          a = l;
          n(true === t);
        }
      };
      const onScroll = t => {
        l = offsetSize(o);
        u = !t || !equalWH(l, a);
        if (t) {
          stopAndPrevent(t);
          if (u && !_) {
            f(_);
            _ = d(onResized);
          }
        } else {
          onResized(false === t);
        }
        reset();
      };
      const g = push([], [ on(i, at, onScroll), on(c, at, onScroll) ]);
      style(r, {
        width: rt,
        height: rt
      });
      reset();
      return [ e ? onScroll.bind(0, false) : reset, g ];
    }
  }
};

let ft = 0;

const dt = "__osScrollbarsHidingPlugin";

const _t = {
  [dt]: {
    Y: () => {
      const {P: t, D: n, I: e} = getEnvironment();
      const s = !e && !t && (n.x || n.y);
      const o = s ? document.createElement("style") : false;
      if (o) {
        attr(o, "id", `${L}-${ft}`);
        ft++;
      }
      return o;
    },
    q: (t, n, e, s, o, c) => {
      const {M: i} = getEnvironment();
      const arrangeViewport = (o, c, i, r) => {
        if (t) {
          const {G: t} = s();
          const {W: a, X: l} = o;
          const {x: u, y: f} = l;
          const {x: d, y: _} = a;
          const g = r ? "paddingRight" : "paddingLeft";
          const h = t[g];
          const p = t.paddingTop;
          const v = c.w + i.w;
          const b = c.h + i.h;
          const w = {
            w: _ && f ? `${_ + v - h}px` : "",
            h: d && u ? `${d + b - p}px` : ""
          };
          if (e) {
            const {sheet: t} = e;
            if (t) {
              const {cssRules: n} = t;
              if (n) {
                if (!n.length) {
                  t.insertRule(`#${attr(e, "id")} + .${L}::before {}`, 0);
                }
                const s = n[0].style;
                s.width = w.w;
                s.height = w.h;
              }
            }
          } else {
            style(n, {
              "--os-vaw": w.w,
              "--os-vah": w.h
            });
          }
        }
        return t;
      };
      const undoViewportArrange = (e, r, a) => {
        if (t) {
          const l = a || o(e);
          const {G: u} = s();
          const {X: f} = l;
          const {x: d, y: _} = f;
          const g = {};
          const assignProps = t => each(t.split(" "), (t => {
            g[t] = u[t];
          }));
          if (d) {
            assignProps("marginBottom paddingTop paddingBottom");
          }
          if (_) {
            assignProps("marginLeft marginRight paddingLeft paddingRight");
          }
          const h = style(n, keys(g));
          removeClass(n, L);
          if (!i) {
            g.height = "";
          }
          style(n, g);
          return [ () => {
            c(l, r, t, h);
            style(n, h);
            addClass(n, L);
          }, l ];
        }
        return [ noop ];
      };
      return [ arrangeViewport, undoViewportArrange ];
    }
  }
};

const resolveInitialization = (t, n) => isFunction(t) ? t.apply(0, n) : t;

const staticInitializationElement = (t, n, e, s) => resolveInitialization(s || resolveInitialization(e, t), t) || n.apply(0, t);

const dynamicInitializationElement = (t, n, e, s) => {
  let o = resolveInitialization(s, t);
  if (isNull(o) || isUndefined(o)) {
    o = resolveInitialization(e, t);
  }
  return true === o || isNull(o) || isUndefined(o) ? n.apply(0, t) : o;
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
  const {N: n, P: e} = getEnvironment();
  const s = getPlugins()[dt];
  const o = s && s.Y;
  const {J: c, K: i, A: r, L: a} = n();
  const l = isHTMLElement(t);
  const f = t;
  const d = l ? t : f.target;
  const _ = is(d, "textarea");
  const g = !_ && is(d, "body");
  const h = d.ownerDocument;
  const p = h.body;
  const v = h.defaultView;
  const b = !!u && !_ && e;
  const w = staticInitializationElement.bind(0, [ d ]);
  const y = dynamicInitializationElement.bind(0, [ d ]);
  const C = [ w(gt, i, f.viewport), w(gt, i), w(gt) ].filter((t => !b ? t !== d : true))[0];
  const O = C === d;
  const L = {
    Z: d,
    J: _ ? w(gt, c, f.host) : d,
    K: C,
    A: !O && y(gt, r, f.padding),
    L: !O && y(gt, a, f.content),
    tt: !O && !e && o && o(),
    nt: v,
    et: h,
    st: parent(p),
    ot: p,
    ct: _,
    it: g,
    rt: l,
    lt: O,
    ut: (t, n) => O ? hasAttrClass(C, m, n) : hasClass(C, t),
    ft: (t, n, e) => O ? attrClass(C, m, n, e) : (e ? addClass : removeClass)(C, t)
  };
  const D = keys(L).reduce(((t, n) => {
    const e = L[n];
    return push(t, e && !parent(e) ? e : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(D, t) > -1 : null;
  const {Z: E, J: P, A: I, K: j, L: M, tt: H} = L;
  const N = [];
  const R = _ && elementIsGenerated(P);
  const F = _ ? E : contents([ M, j, I, P, E ].find((t => false === elementIsGenerated(t))));
  const V = M || j;
  const appendElements = () => {
    const t = addDataAttrHost(P, O ? "viewport" : "host");
    const n = addClass(I, $);
    const s = addClass(j, !O && A);
    const o = addClass(M, T);
    if (R) {
      insertAfter(E, P);
      push(N, (() => {
        insertAfter(P, E);
        removeElements(P);
      }));
    }
    appendChildren(V, F);
    appendChildren(P, I);
    appendChildren(I || P, !O && j);
    appendChildren(j, M);
    push(N, (() => {
      t();
      removeAttr(j, S);
      removeAttr(j, x);
      if (elementIsGenerated(M)) {
        unwrap(M);
      }
      if (elementIsGenerated(j)) {
        unwrap(j);
      }
      if (elementIsGenerated(I)) {
        unwrap(I);
      }
      n();
      s();
      o();
    }));
    if (e && !O) {
      push(N, removeClass.bind(0, j, z));
    }
    if (H) {
      insertBefore(j, H);
      push(N, removeElements.bind(0, H));
    }
  };
  return [ L, appendElements, runEachAndClear.bind(0, N) ];
};

const createTrinsicUpdate = (t, n) => {
  const {L: e} = t;
  const [s] = n;
  return t => {
    const {M: n} = getEnvironment();
    const {dt: o} = s();
    const {_t: c} = t;
    const i = (e || !n) && c;
    if (i) {
      style(e, {
        height: o ? "" : "100%"
      });
    }
    return {
      gt: i,
      ht: i
    };
  };
};

const createPaddingUpdate = (t, n) => {
  const [e, s] = n;
  const {J: o, A: c, K: i, lt: r} = t;
  const [a, l] = createCache({
    u: equalTRBL,
    o: topRightBottomLeft()
  }, topRightBottomLeft.bind(0, o, "padding", ""));
  return (t, n, o) => {
    let [u, f] = l(o);
    const {P: d, M: _} = getEnvironment();
    const {vt: g} = e();
    const {gt: h, ht: p, bt: v} = t;
    const [b, w] = n("paddingAbsolute");
    const y = !_ && p;
    if (h || f || y) {
      [u, f] = a(o);
    }
    const m = !r && (w || v || f);
    if (m) {
      const t = !b || !c && !d;
      const n = u.r + u.l;
      const e = u.t + u.b;
      const o = {
        marginRight: t && !g ? -n : 0,
        marginBottom: t ? -e : 0,
        marginLeft: t && g ? -n : 0,
        top: t ? -u.t : 0,
        right: t ? g ? -u.r : "auto" : 0,
        left: t ? g ? "auto" : -u.l : 0,
        width: t ? `calc(100% + ${n}px)` : ""
      };
      const r = {
        paddingTop: t ? u.t : 0,
        paddingRight: t ? u.r : 0,
        paddingBottom: t ? u.b : 0,
        paddingLeft: t ? u.l : 0
      };
      style(c || i, o);
      style(i, r);
      s({
        A: u,
        wt: !t,
        G: c ? r : assignDeep({}, o, r)
      });
    }
    return {
      yt: m
    };
  };
};

const {max: ht} = Math;

const pt = "visible";

const vt = "hidden";

const bt = 42;

const wt = {
  u: equalWH,
  o: {
    w: 0,
    h: 0
  }
};

const yt = {
  u: equalXY,
  o: {
    x: vt,
    y: vt
  }
};

const getOverflowAmount = (t, n, e) => {
  const s = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const o = {
    w: ht(0, t.w - n.w - ht(0, e.w)),
    h: ht(0, t.h - n.h - ht(0, e.h))
  };
  return {
    w: o.w > s ? o.w : 0,
    h: o.h > s ? o.h : 0
  };
};

const conditionalClass = (t, n, e) => e ? addClass(t, n) : removeClass(t, n);

const overflowIsVisible = t => 0 === t.indexOf(pt);

const createOverflowUpdate = (t, n) => {
  const [e, s] = n;
  const {J: o, A: c, K: i, tt: r, lt: a, ft: l} = t;
  const {T: u, M: f, P: d, D: _} = getEnvironment();
  const g = getPlugins()[dt];
  const h = !a && !d && (_.x || _.y);
  const [p, v] = createCache(wt, fractionalSize.bind(0, i));
  const [b, w] = createCache(wt, scrollSize.bind(0, i));
  const [y, $] = createCache(wt);
  const [A] = createCache(yt);
  const fixFlexboxGlue = (t, n) => {
    style(i, {
      height: ""
    });
    if (n) {
      const {wt: n, A: s} = e();
      const {St: c, W: r} = t;
      const a = fractionalSize(o);
      const l = clientSize(o);
      const u = "content-box" === style(i, "boxSizing");
      const f = n || u ? s.b + s.t : 0;
      const d = !(_.x && u);
      style(i, {
        height: l.h + a.h + (c.x && d ? r.x : 0) - f
      });
    }
  };
  const getViewportOverflowState = (t, n) => {
    const e = !d && !t ? bt : 0;
    const getStatePerAxis = (t, s, o) => {
      const c = style(i, t);
      const r = n ? n[t] : c;
      const a = "scroll" === r;
      const l = s ? e : o;
      const u = a && !d ? l : 0;
      const f = s && !!e;
      return [ c, a, u, f ];
    };
    const [s, o, c, r] = getStatePerAxis("overflowX", _.x, u.x);
    const [a, l, f, g] = getStatePerAxis("overflowY", _.y, u.y);
    return {
      xt: {
        x: s,
        y: a
      },
      St: {
        x: o,
        y: l
      },
      W: {
        x: c,
        y: f
      },
      X: {
        x: r,
        y: g
      }
    };
  };
  const setViewportOverflowState = (t, n, e, s) => {
    const setAxisOverflowStyle = (t, n) => {
      const e = overflowIsVisible(t);
      const s = n && e && t.replace(`${pt}-`, "") || "";
      return [ n && !e ? t : "", overflowIsVisible(s) ? "hidden" : s ];
    };
    const [o, c] = setAxisOverflowStyle(e.x, n.x);
    const [i, r] = setAxisOverflowStyle(e.y, n.y);
    s.overflowX = c && i ? c : o;
    s.overflowY = r && o ? r : i;
    return getViewportOverflowState(t, s);
  };
  const hideNativeScrollbars = (t, n, s, o) => {
    const {W: c, X: i} = t;
    const {x: r, y: a} = i;
    const {x: l, y: u} = c;
    const {G: f} = e();
    const d = n ? "marginLeft" : "marginRight";
    const _ = n ? "paddingLeft" : "paddingRight";
    const g = f[d];
    const h = f.marginBottom;
    const p = f[_];
    const v = f.paddingBottom;
    o.width = `calc(100% + ${u + -1 * g}px)`;
    o[d] = -u + g;
    o.marginBottom = -l + h;
    if (s) {
      o[_] = p + (a ? u : 0);
      o.paddingBottom = v + (r ? l : 0);
    }
  };
  const [L, T] = g ? g.q(h, i, r, e, getViewportOverflowState, hideNativeScrollbars) : [ () => h, () => [ noop ] ];
  return (t, n, r) => {
    const {gt: u, Ct: g, ht: h, yt: E, _t: P, bt: I} = t;
    const {dt: j, vt: M} = e();
    const [H, N] = n("nativeScrollbarsOverlaid.show");
    const [R, F] = n("overflow");
    const V = H && _.x && _.y;
    const k = !a && !f && (u || h || g || N || P);
    const B = overflowIsVisible(R.x);
    const U = overflowIsVisible(R.y);
    const Y = B || U;
    let q = v(r);
    let G = w(r);
    let W = $(r);
    let X;
    if (N && d) {
      l(z, O, !V);
    }
    if (k) {
      X = getViewportOverflowState(V);
      fixFlexboxGlue(X, j);
    }
    if (u || E || h || I || N) {
      if (Y) {
        l(D, C, false);
      }
      const [t, n] = T(V, M, X);
      const [e, s] = q = p(r);
      const [o, c] = G = b(r);
      const a = clientSize(i);
      let u = o;
      let f = a;
      t();
      if ((c || s || N) && n && !V && L(n, o, e, M)) {
        f = clientSize(i);
        u = scrollSize(i);
      }
      W = y(getOverflowAmount({
        w: ht(o.w, u.w),
        h: ht(o.h, u.h)
      }, {
        w: f.w + ht(0, a.w - o.w),
        h: f.h + ht(0, a.h - o.h)
      }, e), r);
    }
    const [J, K] = W;
    const [Q, Z] = G;
    const [tt, nt] = q;
    const et = {
      x: J.w > 0,
      y: J.h > 0
    };
    const st = B && U && (et.x || et.y) || B && et.x && !et.y || U && et.y && !et.x;
    if (E || I || nt || Z || K || F || N || k) {
      const t = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: "",
        overflowY: "",
        overflowX: ""
      };
      const n = setViewportOverflowState(V, et, R, t);
      const e = L(n, Q, tt, M);
      if (!a) {
        hideNativeScrollbars(n, M, e, t);
      }
      if (k) {
        fixFlexboxGlue(n, j);
      }
      if (a) {
        attr(o, S, t.overflowX);
        attr(o, x, t.overflowY);
      } else {
        style(i, t);
      }
    }
    attrClass(o, m, C, st);
    conditionalClass(c, D, st);
    !a && conditionalClass(i, D, Y);
    const [ot, ct] = A(getViewportOverflowState(V).xt);
    s({
      xt: ot,
      Ot: {
        x: J.w,
        y: J.h
      },
      $t: et
    });
    return {
      At: ct,
      Lt: K
    };
  };
};

const prepareUpdateHints = (t, n, e) => {
  const s = {};
  const o = n || {};
  const c = keys(t).concat(keys(o));
  each(c, (n => {
    const c = t[n];
    const i = o[n];
    s[n] = !!(e || c || i);
  }));
  return s;
};

const createStructureSetupUpdate = (t, n) => {
  const {K: e} = t;
  const {P: s, D: o, M: c} = getEnvironment();
  const i = !s && (o.x || o.y);
  const r = [ createTrinsicUpdate(t, n), createPaddingUpdate(t, n), createOverflowUpdate(t, n) ];
  return (t, n, s) => {
    const o = prepareUpdateHints(assignDeep({
      gt: false,
      yt: false,
      bt: false,
      _t: false,
      Lt: false,
      At: false,
      Ct: false,
      ht: false
    }, n), {}, s);
    const a = i || !c;
    const l = a && scrollLeft(e);
    const u = a && scrollTop(e);
    let f = o;
    each(r, (n => {
      f = prepareUpdateHints(f, n(f, t, !!s) || {}, s);
    }));
    if (isNumber(l)) {
      scrollLeft(e, l);
    }
    if (isNumber(u)) {
      scrollTop(e, u);
    }
    return f;
  };
};

const mt = "animationstart";

const St = "scroll";

const xt = 3333333;

const getElmDirectionIsRTL = t => "rtl" === style(t, "direction");

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, e) => {
  const {Tt: s = false, zt: o = false} = e || {};
  const c = getPlugins()[lt];
  const {j: i} = getEnvironment();
  const r = createDOM(`<div class="${E}"><div class="${I}"></div></div>`);
  const a = r[0];
  const l = a.firstChild;
  const f = getElmDirectionIsRTL.bind(0, a);
  const [d] = createCache({
    o: void 0,
    _: true,
    u: (t, n) => !(!t || !domRectHasDimensions(t) && domRectHasDimensions(n))
  });
  const onSizeChangedCallbackProxy = t => {
    const e = isArray(t) && t.length > 0 && isObject(t[0]);
    const o = !e && isBoolean(t[0]);
    let c = false;
    let r = false;
    let l = true;
    if (e) {
      const [n, , e] = d(t.pop().contentRect);
      const s = domRectHasDimensions(n);
      const o = domRectHasDimensions(e);
      c = !e || !s;
      r = !o && s;
      l = !c;
    } else if (o) {
      [, l] = t;
    } else {
      r = true === t;
    }
    if (s && l) {
      const n = o ? t[0] : getElmDirectionIsRTL(a);
      scrollLeft(a, n ? i.n ? -xt : i.i ? 0 : xt : xt);
      scrollTop(a, xt);
    }
    if (!c) {
      n({
        gt: !o,
        Dt: o ? t : void 0,
        zt: !!r
      });
    }
  };
  const _ = [];
  let g = o ? onSizeChangedCallbackProxy : false;
  let h;
  if (u) {
    const t = new u(onSizeChangedCallbackProxy);
    t.observe(l);
    push(_, (() => {
      t.disconnect();
    }));
  } else if (c) {
    const [t, n] = c.U(l, onSizeChangedCallbackProxy, o);
    g = t;
    push(_, n);
  }
  if (s) {
    h = createCache({
      o: !f()
    }, f);
    const [t] = h;
    push(_, on(a, St, (n => {
      const e = t();
      const [s, o] = e;
      if (o) {
        removeClass(l, "ltr rtl");
        if (s) {
          addClass(l, "rtl");
        } else {
          addClass(l, "ltr");
        }
        onSizeChangedCallbackProxy(e);
      }
      stopAndPrevent(n);
    })));
  }
  if (g) {
    addClass(a, P);
    push(_, on(a, mt, g, {
      $: !!u
    }));
  }
  prependChildren(t, a);
  return () => {
    runEachAndClear(_);
    removeElements(a);
  };
};

const isHeightIntrinsic = t => 0 === t.h || t.isIntersecting || t.intersectionRatio > 0;

const createTrinsicObserver = (t, n) => {
  const e = createDiv(N);
  const s = [];
  const [o] = createCache({
    o: false
  });
  const triggerOnTrinsicChangedCallback = t => {
    if (t) {
      const e = o(isHeightIntrinsic(t));
      const [, s] = e;
      if (s) {
        n(e);
      }
    }
  };
  if (l) {
    const n = new l((t => {
      if (t && t.length > 0) {
        triggerOnTrinsicChangedCallback(t.pop());
      }
    }), {
      root: t
    });
    n.observe(e);
    push(s, (() => {
      n.disconnect();
    }));
  } else {
    const onSizeChanged = () => {
      const t = offsetSize(e);
      triggerOnTrinsicChangedCallback(t);
    };
    push(s, createSizeObserver(e, onSizeChanged));
    onSizeChanged();
  }
  prependChildren(t, e);
  return () => {
    runEachAndClear(s);
    removeElements(e);
  };
};

const createEventContentChange = (t, n, e) => {
  let s;
  let o = false;
  const destroy = () => {
    o = true;
  };
  const updateElements = c => {
    if (e) {
      const i = e.reduce(((n, e) => {
        if (e) {
          const s = e[0];
          const o = e[1];
          const i = o && s && (c ? c(s) : find(s, t));
          if (i && i.length && o && isString(o)) {
            push(n, [ i, o.trim() ], true);
          }
        }
        return n;
      }), []);
      each(i, (t => each(t[0], (e => {
        const c = t[1];
        const i = s.get(e);
        if (i) {
          const t = i[0];
          const n = i[1];
          if (t === c) {
            n();
          }
        }
        const r = on(e, c, (t => {
          if (o) {
            r();
            s.delete(e);
          } else {
            n(t);
          }
        }));
        s.set(e, [ c, r ]);
      }))));
    }
  };
  if (e) {
    s = new WeakMap;
    updateElements();
  }
  return [ destroy, updateElements ];
};

const createDOMObserver = (t, n, e, s) => {
  let o = false;
  const {Et: c, Pt: i, It: r, jt: l, Mt: u, Ht: f} = s || {};
  const [d, _] = createEventContentChange(t, debounce((() => {
    if (o) {
      e(true);
    }
  }), {
    p: 33,
    v: 99
  }), r);
  const g = c || [];
  const h = i || [];
  const p = g.concat(h);
  const observerCallback = o => {
    const c = u || noop;
    const i = f || noop;
    const r = [];
    const a = [];
    let d = false;
    let g = false;
    let p = false;
    each(o, (e => {
      const {attributeName: o, target: u, type: f, oldValue: _, addedNodes: v} = e;
      const b = "attributes" === f;
      const w = "childList" === f;
      const y = t === u;
      const m = b && isString(o) ? attr(u, o) : 0;
      const S = 0 !== m && _ !== m;
      const x = indexOf(h, o) > -1 && S;
      if (n && !y) {
        const n = !b;
        const r = b && x;
        const f = r && l && is(u, l);
        const d = f ? !c(u, o, _, m) : n || r;
        const h = d && !i(e, !!f, t, s);
        push(a, v);
        g = g || h;
        p = p || w;
      }
      if (!n && y && S && !c(u, o, _, m)) {
        push(r, o);
        d = d || x;
      }
    }));
    if (p && !isEmptyArray(a)) {
      _((t => a.reduce(((n, e) => {
        push(n, find(t, e));
        return is(e, t) ? push(n, e) : n;
      }), [])));
    }
    if (n) {
      g && e(false);
    } else if (!isEmptyArray(r) || d) {
      e(r, d);
    }
  };
  const v = new a(observerCallback);
  v.observe(t, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: p,
    subtree: n,
    childList: n,
    characterData: n
  });
  o = true;
  return [ () => {
    if (o) {
      d();
      v.disconnect();
      o = false;
    }
  }, () => {
    if (o) {
      observerCallback(v.takeRecords());
    }
  } ];
};

const Ct = `[${m}]`;

const Ot = `.${A}`;

const $t = [ "tabindex" ];

const At = [ "wrap", "cols", "rows" ];

const Lt = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, e) => {
  let s;
  let o;
  let c;
  const [, i] = n;
  const {J: r, K: a, L: l, ct: f, lt: d, ut: _, ft: g} = t;
  const {P: h, M: p} = getEnvironment();
  const [v] = createCache({
    u: equalWH,
    o: {
      w: 0,
      h: 0
    }
  }, (() => {
    const t = _(D, C);
    t && g(D, C);
    const n = scrollSize(l);
    const e = scrollSize(a);
    const s = fractionalSize(a);
    t && g(D, C, true);
    return {
      w: e.w + n.w + s.w,
      h: e.h + n.h + s.h
    };
  }));
  const b = f ? At : Lt.concat(At);
  const w = debounce(e, {
    p: () => s,
    v: () => o,
    m(t, n) {
      const [e] = t;
      const [s] = n;
      return [ keys(e).concat(keys(s)).reduce(((t, n) => {
        t[n] = e[n] || s[n];
        return t;
      }), {}) ];
    }
  });
  const updateViewportAttrsFromHost = t => {
    each(t || $t, (t => {
      if (indexOf($t, t) > -1) {
        const n = attr(r, t);
        if (isString(n)) {
          attr(a, t, n);
        } else {
          removeAttr(a, t);
        }
      }
    }));
  };
  const onTrinsicChanged = t => {
    const [n, s] = t;
    i({
      dt: n
    });
    e({
      _t: s
    });
  };
  const onSizeChanged = ({gt: t, Dt: n, zt: s}) => {
    const o = !t || s ? e : w;
    let c = false;
    if (n) {
      const [t, e] = n;
      c = e;
      i({
        vt: t
      });
    }
    o({
      gt: t,
      bt: c
    });
  };
  const onContentMutation = t => {
    const [, n] = v();
    const s = t ? e : w;
    if (n) {
      s({
        ht: true
      });
    }
  };
  const onHostMutation = (t, n) => {
    if (n) {
      w({
        Ct: true
      });
    } else if (!d) {
      updateViewportAttrsFromHost(t);
    }
  };
  const y = (l || !p) && createTrinsicObserver(r, onTrinsicChanged);
  const m = !d && createSizeObserver(r, onSizeChanged, {
    zt: true,
    Tt: !h
  });
  const [S] = createDOMObserver(r, false, onHostMutation, {
    Pt: Lt,
    Et: Lt.concat($t)
  });
  const x = d && new u(onSizeChanged.bind(0, {
    gt: true
  }));
  x && x.observe(r);
  updateViewportAttrsFromHost();
  return [ t => {
    const [n] = t("updating.ignoreMutation");
    const [e, i] = t("updating.attributes");
    const [r, u] = t("updating.elementEvents");
    const [f, d] = t("updating.debounce");
    const _ = u || i;
    const ignoreMutationFromOptions = t => isFunction(n) && n(t);
    if (_) {
      if (c) {
        c[1]();
        c[0]();
      }
      c = createDOMObserver(l || a, true, onContentMutation, {
        Pt: b.concat(e || []),
        Et: b.concat(e || []),
        It: r,
        jt: Ct,
        Ht: (t, n) => {
          const {target: e, attributeName: s} = t;
          const o = !n && s ? liesBetween(e, Ct, Ot) : false;
          return o || !!ignoreMutationFromOptions(t);
        }
      });
    }
    if (d) {
      w.S();
      if (isArray(f)) {
        const t = f[0];
        const n = f[1];
        s = isNumber(t) ? t : false;
        o = isNumber(n) ? n : false;
      } else if (isNumber(f)) {
        s = f;
        o = false;
      } else {
        s = false;
        o = false;
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

const Tt = {
  A: {
    t: 0,
    r: 0,
    b: 0,
    l: 0
  },
  wt: false,
  G: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  Ot: {
    x: 0,
    y: 0
  },
  xt: {
    x: "hidden",
    y: "hidden"
  },
  $t: {
    x: false,
    y: false
  },
  dt: false,
  vt: false
};

const createStructureSetup = (t, n) => {
  const e = createOptionCheck(n, {});
  const s = createState(Tt);
  const [o, c, i] = createEventListenerHub();
  const [r] = s;
  const [a, l, u] = createStructureSetupElements(t);
  const f = createStructureSetupUpdate(a, s);
  const [d, _] = createStructureSetupObservers(a, s, (t => {
    i("u", [ f(e, t), {}, false ]);
  }));
  const g = r.bind(0);
  g.Nt = t => {
    o("u", t);
  };
  g.Rt = l;
  g.Ft = a;
  return [ (t, e) => {
    const s = createOptionCheck(n, t, e);
    d(s);
    i("u", [ f(s, {}, e), t, !!e ]);
  }, g, () => {
    c();
    _();
    u();
  } ];
};

const generateScrollbarDOM = t => {
  const n = createDiv(`${R} ${t}`);
  const e = createDiv(k);
  const s = createDiv(B);
  appendChildren(n, e);
  appendChildren(e, s);
  return {
    Vt: n,
    kt: e,
    Bt: s
  };
};

const createScrollbarsSetupElements = (t, n) => {
  const {N: e} = getEnvironment();
  const {Ut: s} = e();
  const {Z: o, J: c, K: i, rt: r} = n;
  const a = !r && t.scrollbarsSlot;
  const l = dynamicInitializationElement([ o, c, i ], (() => c), s, a);
  const u = generateScrollbarDOM(F);
  const f = generateScrollbarDOM(V);
  const {Vt: d} = u;
  const {Vt: _} = f;
  const appendElements = () => {
    appendChildren(l, d);
    appendChildren(l, _);
  };
  return [ {
    Yt: u,
    qt: f
  }, appendElements, removeElements.bind(0, [ d, _ ]) ];
};

const createScrollbarsSetup = (t, n, e) => {
  const s = createState({});
  const [o] = s;
  const [c, i, r] = createScrollbarsSetupElements(t, e);
  const a = o.bind(0);
  a.Ft = c;
  a.Rt = i;
  return [ (t, e) => {
    const s = createOptionCheck(n, t, e);
    console.log(s);
  }, a, () => {
    r();
  } ];
};

const zt = new Set;

const Dt = new WeakMap;

const addInstance = (t, n) => {
  Dt.set(t, n);
  zt.add(t);
};

const removeInstance = t => {
  Dt.delete(t);
  zt.delete(t);
};

const getInstance = t => Dt.get(t);

const OverlayScrollbars = (t, n, e) => {
  let s = false;
  const {F: o, D: c, H: i} = getEnvironment();
  const r = getPlugins();
  const a = isHTMLElement(t) ? t : t.target;
  const l = getInstance(a);
  if (l) {
    return l;
  }
  const u = r[ct];
  const validateOptions = t => {
    const n = t || {};
    const e = u && u.U;
    return e ? e(n, true) : n;
  };
  const f = assignDeep({}, o(), validateOptions(n));
  const [d, _, g] = createEventListenerHub(e);
  const [h, p, v] = createStructureSetup(t, f);
  const [b, w, y] = createScrollbarsSetup(t, f, p.Ft);
  const update = (t, n) => {
    h(t, n);
    b(t, n);
  };
  const m = i(update.bind(0, {}, true));
  const destroy = t => {
    removeInstance(a);
    m();
    y();
    v();
    s = true;
    g("destroyed", [ S, !!t ]);
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
      const {Ot: t, xt: n, $t: e, A: o, wt: c} = p();
      return assignDeep({}, {
        overflowAmount: t,
        overflowStyle: n,
        hasOverflow: e,
        padding: o,
        paddingAbsolute: c,
        destroyed: s
      });
    },
    elements() {
      const {Z: t, J: n, A: e, K: s, L: o} = p.Ft;
      return assignDeep({}, {
        target: t,
        host: n,
        padding: e || s,
        viewport: s,
        content: o || s
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
  if (c.x && c.y && !f.nativeScrollbarsOverlaid.initialize) {
    destroy(true);
    return S;
  }
  p.Rt();
  w.Rt();
  addInstance(a, S);
  g("initialized", [ S ]);
  p.Nt(((t, n, e) => {
    const {gt: s, bt: o, _t: c, Lt: i, At: r, ht: a, Ct: l} = t;
    g("updated", [ S, {
      updateHints: {
        sizeChanged: s,
        directionChanged: o,
        heightIntrinsicChanged: c,
        overflowAmountChanged: i,
        overflowStyleChanged: r,
        contentMutation: a,
        hostMutation: l
      },
      changedOptions: n,
      force: e
    } ]);
  }));
  return S.update(true);
};

OverlayScrollbars.plugin = addPlugin;

OverlayScrollbars.env = () => {
  const {T: t, D: n, P: e, j: s, M: o, I: c, k: i, B: r, N: a, R: l, F: u, V: f} = getEnvironment();
  return assignDeep({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: n,
    scrollbarsHiding: e,
    rtlScrollBehavior: s,
    flexboxGlue: o,
    cssCustomProperties: c,
    defaultInitializationStrategy: i,
    defaultDefaultOptions: r,
    getInitializationStrategy: a,
    setInitializationStrategy: l,
    getDefaultOptions: u,
    setDefaultOptions: f
  });
};

export { OverlayScrollbars, it as optionsValidationPlugin, _t as scrollbarsHidingPlugin, ut as sizeObserverPlugin };
//# sourceMappingURL=overlayscrollbars.esm.js.map
