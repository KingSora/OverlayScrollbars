function createCache(t, n) {
  const {o, u: e, _: s} = t;
  let c = o;
  let i;
  const cacheUpdateContextual = (t, n) => {
    const o = c;
    const r = t;
    const a = n || (e ? !e(o, r) : o !== r);
    if (a || s) {
      c = r;
      i = o;
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
  const o = isNumber(n) && n > -1 && n % 1 == 0;
  return isArray(t) || !isFunction(t) && o ? n > 0 && isObject(t) ? n - 1 in t : true : false;
}

function isPlainObject(t) {
  if (!t || !isObject(t) || "object" !== type(t)) {
    return false;
  }
  let n;
  const e = "constructor";
  const s = t[e];
  const c = s && s.prototype;
  const i = o.call(t, e);
  const r = c && o.call(c, "isPrototypeOf");
  if (s && !i && !r) {
    return false;
  }
  for (n in t) {}
  return isUndefined(n) || o.call(t, n);
}

function isHTMLElement(n) {
  const o = window.HTMLElement;
  return n ? o ? n instanceof o : n.nodeType === t : false;
}

function isElement(n) {
  const o = window.Element;
  return n ? o ? n instanceof o : n.nodeType === t : false;
}

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

function assignDeep(t, n, o, e, s, c, i) {
  const r = [ n, o, e, s, c, i ];
  if (("object" !== typeof t || isNull(t)) && !isFunction(t)) {
    t = {};
  }
  each(r, (n => {
    each(keys(n), (o => {
      const e = n[o];
      if (t === e) {
        return true;
      }
      const s = isArray(e);
      if (e && (isPlainObject(e) || s)) {
        const n = t[o];
        let c = n;
        if (s && !isArray(n)) {
          c = [];
        } else if (!s && !isPlainObject(n)) {
          c = {};
        }
        t[o] = assignDeep(c, e);
      } else {
        t[o] = e;
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

function getSetProp(t, n, o, e) {
  if (isUndefined(e)) {
    return o ? o[t] : n;
  }
  o && (o[t] = e);
}

function attr(t, n, o) {
  if (isUndefined(o)) {
    return t ? t.getAttribute(n) : null;
  }
  t && t.setAttribute(n, o);
}

function scrollLeft(t, n) {
  return getSetProp("scrollLeft", 0, t, n);
}

function scrollTop(t, n) {
  return getSetProp("scrollTop", 0, t, n);
}

function style(t, n) {
  const o = isString(n);
  const e = isArray(n) || o;
  if (e) {
    let e = o ? "" : {};
    if (t) {
      const s = window.getComputedStyle(t, null);
      e = o ? getCSSVal(t, s, n) : n.reduce(((n, o) => {
        n[o] = getCSSVal(t, s, o);
        return n;
      }), e);
    }
    return e;
  }
  each(keys(n), (o => setCSSVal(t, o, n[o])));
}

const t = Node.ELEMENT_NODE;

const {toString: n, hasOwnProperty: o} = Object.prototype;

const type = t => isUndefined(t) || isNull(t) ? `${t}` : n.call(t).replace(/^\[object (.+)\]$/, "$1").toLowerCase();

const indexOf = (t, n, o) => t.indexOf(n, o);

const push = (t, n, o) => {
  !o && !isString(n) && isArrayLike(n) ? Array.prototype.push.apply(t, n) : t.push(n);
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

const runEach = (t, n) => {
  const runFn = t => t && t.apply(void 0, n || []);
  if (t instanceof Set) {
    t.forEach(runFn);
  } else {
    each(t, runFn);
  }
};

const hasOwnProperty = (t, n) => Object.prototype.hasOwnProperty.call(t, n);

const keys = t => t ? Object.keys(t) : [];

const attrClass = (t, n, o, e) => {
  const s = attr(t, n) || "";
  const c = new Set(s.split(" "));
  c[e ? "add" : "delete"](o);
  attr(t, n, from(c).join(" ").trim());
};

const hasAttrClass = (t, n, o) => {
  const e = attr(t, n) || "";
  const s = new Set(e.split(" "));
  return s.has(o);
};

const removeAttr = (t, n) => {
  t && t.removeAttribute(n);
};

const e = Element.prototype;

const find = (t, n) => {
  const o = [];
  const e = n ? isElement(n) ? n : null : document;
  return e ? push(o, e.querySelectorAll(t)) : o;
};

const findFirst = (t, n) => {
  const o = n ? isElement(n) ? n : null : document;
  return o ? o.querySelector(t) : null;
};

const is = (t, n) => {
  if (isElement(t)) {
    const o = e.matches || e.msMatchesSelector;
    return o.call(t, n);
  }
  return false;
};

const contents = t => t ? from(t.childNodes) : [];

const parent = t => t ? t.parentElement : null;

const closest = (t, n) => {
  if (isElement(t)) {
    const o = e.closest;
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
  const e = t && closest(t, n);
  const s = t && findFirst(o, e);
  return e && s ? e === t || s === t || closest(closest(t, o), n) !== e : false;
};

const before = (t, n, o) => {
  if (o) {
    let e = n;
    let s;
    if (t) {
      if (isArrayLike(o)) {
        s = document.createDocumentFragment();
        each(o, (t => {
          if (t === e) {
            e = t.previousSibling;
          }
          s.appendChild(t);
        }));
      } else {
        s = o;
      }
      if (n) {
        if (!e) {
          e = t.firstChild;
        } else if (e !== n) {
          e = e.nextSibling;
        }
      }
      t.insertBefore(s, e || null);
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

const s = [ "-webkit-", "-moz-", "-o-", "-ms-" ];

const c = [ "WebKit", "Moz", "O", "MS", "webkit", "moz", "o", "ms" ];

const i = {};

const r = {};

const cssProperty = t => {
  let n = r[t];
  if (hasOwnProperty(r, t)) {
    return n;
  }
  const o = firstLetterToUpper(t);
  const e = getDummyStyle();
  each(s, (s => {
    const c = s.replace(/-/g, "");
    const i = [ t, s + t, c + o, firstLetterToUpper(c) + o ];
    return !(n = i.find((t => void 0 !== e[t])));
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

const a = jsAPI("MutationObserver");

const l = jsAPI("IntersectionObserver");

const u = jsAPI("ResizeObserver");

const f = jsAPI("cancelAnimationFrame");

const d = jsAPI("requestAnimationFrame");

const _ = /[^\x20\t\r\n\f]+/g;

const classListAction = (t, n, o) => {
  let e;
  let s = 0;
  let c = false;
  if (t && n && isString(n)) {
    const i = n.match(_) || [];
    c = i.length > 0;
    while (e = i[s++]) {
      c = !!o(t.classList, e) && c;
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

const equal = (t, n, o, e) => {
  if (t && n) {
    let s = true;
    each(o, (o => {
      const c = e ? e(t[o]) : t[o];
      const i = e ? e(n[o]) : n[o];
      if (c !== i) {
        s = false;
      }
    }));
    return s;
  }
  return false;
};

const equalWH = (t, n) => equal(t, n, [ "w", "h" ]);

const equalXY = (t, n) => equal(t, n, [ "x", "y" ]);

const equalTRBL = (t, n) => equal(t, n, [ "t", "r", "b", "l" ]);

const equalBCRWH = (t, n, o) => equal(t, n, [ "width", "height" ], o && (t => Math.round(t)));

const clearTimeouts = t => {
  t && window.clearTimeout(t);
  t && f(t);
};

const noop = () => {};

const debounce = (t, n) => {
  let o;
  let e;
  let s;
  let c;
  const {g: i, p: r, v: a} = n || {};
  const l = window.setTimeout;
  const u = function invokeFunctionToDebounce(n) {
    clearTimeouts(o);
    clearTimeouts(e);
    e = o = s = void 0;
    t.apply(this, n);
  };
  const mergeParms = t => a && s ? a(s, t) : t;
  const flush = () => {
    if (o) {
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
      clearTimeouts(o);
      o = f(h, n);
      if (a && !e) {
        e = l(flush, i);
      }
      s = c = g;
    } else {
      u(t);
    }
  };
  f.m = flush;
  return f;
};

const g = {
  opacity: 1,
  zindex: 1
};

const parseToZeroOrNumber = (t, n) => {
  const o = n ? parseFloat(t) : parseInt(t, 10);
  return Number.isNaN(o) ? 0 : o;
};

const adaptCSSVal = (t, n) => !g[t.toLowerCase()] && isNumber(n) ? `${n}px` : n;

const getCSSVal = (t, n, o) => null != n ? n[o] || n.getPropertyValue(o) : t.style[o];

const setCSSVal = (t, n, o) => {
  try {
    if (t) {
      const {style: e} = t;
      if (!isUndefined(e[n])) {
        e[n] = adaptCSSVal(n, o);
      } else {
        e.setProperty(n, o);
      }
    }
  } catch (e) {}
};

const topRightBottomLeft = (t, n, o) => {
  const e = n ? `${n}-` : "";
  const s = o ? `-${o}` : "";
  const c = `${e}top${s}`;
  const i = `${e}right${s}`;
  const r = `${e}bottom${s}`;
  const a = `${e}left${s}`;
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
        get: function() {
          p = true;
        }
      }));
    } catch (t) {}
  }
  return p;
};

const splitEventNames = t => t.split(" ");

const off = (t, n, o, e) => {
  each(splitEventNames(n), (n => {
    t.removeEventListener(n, o, e);
  }));
};

const on = (t, n, o, e) => {
  const s = supportPassiveEvents();
  const c = s && e && e.S || false;
  const i = e && e.C || false;
  const r = e && e.O || false;
  const a = [];
  const l = s ? {
    passive: c,
    capture: i
  } : i;
  each(splitEventNames(n), (n => {
    const e = r ? s => {
      t.removeEventListener(n, e, i);
      o && o(s);
    } : o;
    push(a, off.bind(null, t, n, e, i));
    t.addEventListener(n, e, l);
  }));
  return runEach.bind(0, a);
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
  function removeEvent(t, o) {
    if (t) {
      const e = n.get(t);
      manageListener((t => {
        if (e) {
          e[t ? "delete" : "clear"](t);
        }
      }), o);
    } else {
      n.forEach((t => {
        t.clear();
      }));
      n.clear();
    }
  }
  function addEvent(t, o) {
    const e = n.get(t) || new Set;
    n.set(t, e);
    manageListener((t => {
      t && e.add(t);
    }), o);
    return removeEvent.bind(0, t, o);
  }
  function triggerEvent(t, ...o) {
    const e = n.get(t);
    each(from(e), (t => {
      if (o) {
        t(o);
      } else {
        t();
      }
    }));
  }
  const n = new Map;
  const o = keys(t);
  each(o, (n => {
    addEvent(n, t[n]);
  }));
  return [ addEvent, removeEvent, triggerEvent ];
};

const getPropByPath = (t, n) => t ? n.split(".").reduce(((t, n) => t && hasOwnProperty(t, n) ? t[n] : void 0), t) : void 0;

const createOptionCheck = (t, n, o) => e => [ getPropByPath(t, e), o || void 0 !== getPropByPath(n, e) ];

const createState = t => {
  let n = t;
  return [ () => n, t => {
    n = assignDeep({}, n, t);
  } ];
};

const w = "os-environment";

const b = `${w}-flexbox-glue`;

const y = `${b}-max`;

const m = "data-overlayscrollbars";

const S = `${m}-overflow-x`;

const C = `${m}-overflow-y`;

const x = "overflowVisible";

const O = "viewportStyled";

const A = "os-padding";

const $ = "os-viewport";

const L = `${$}-arrange`;

const I = "os-content";

const T = `${$}-scrollbar-styled`;

const z = `os-overflow-visible`;

const D = "os-size-observer";

const E = `${D}-appear`;

const P = `${D}-listener`;

const M = `${P}-scroll`;

const j = `${P}-item`;

const N = `${j}-final`;

const R = "os-trinsic-observer";

const F = "os-scrollbar";

const H = `${F}-horizontal`;

const k = `${F}-vertical`;

const B = "os-scrollbar-track";

const V = "os-scrollbar-handle";

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
  const o = {};
  const e = keys(n).concat(keys(t));
  each(e, (e => {
    const s = t[e];
    const c = n[e];
    if (isObject(s) && isObject(c)) {
      assignDeep(o[e] = {}, getOptionsDiff(s, c));
    } else if (hasOwnProperty(n, e) && c !== s) {
      let t = true;
      if (isArray(s) || isArray(c)) {
        try {
          if (opsStringify(s) === opsStringify(c)) {
            t = false;
          }
        } catch (i) {}
      }
      if (t) {
        o[e] = c;
      }
    }
  }));
  return o;
};

let Y;

const {abs: q, round: G} = Math;

const diffBiggerThanOne = (t, n) => {
  const o = q(t);
  const e = q(n);
  return !(o === e || o + 1 === e || o - 1 === e);
};

const getNativeScrollbarSize = (t, n, o) => {
  appendChildren(t, n);
  const e = clientSize(n);
  const s = offsetSize(n);
  const c = fractionalSize(o);
  return {
    x: s.h - e.h + c.h,
    y: s.w - e.w + c.w
  };
};

const getNativeScrollbarStyling = t => {
  let n = false;
  const o = addClass(t, T);
  try {
    n = "none" === style(t, cssProperty("scrollbar-width")) || "none" === window.getComputedStyle(t, "::-webkit-scrollbar").getPropertyValue("display");
  } catch (e) {}
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
  const e = absoluteCoordinates(t);
  const s = absoluteCoordinates(n);
  scrollLeft(t, -999);
  const c = absoluteCoordinates(n);
  return {
    i: e.x === s.x,
    n: s.x !== c.x
  };
};

const getFlexboxGlue = (t, n) => {
  const o = addClass(t, b);
  const e = getBoundingClientRect(t);
  const s = getBoundingClientRect(n);
  const c = equalBCRWH(s, e, true);
  const i = addClass(t, y);
  const r = getBoundingClientRect(t);
  const a = getBoundingClientRect(n);
  const l = equalBCRWH(a, r, true);
  o();
  i();
  return c && l;
};

const getWindowDPR = () => {
  const t = window.screen.deviceXDPI || 0;
  const n = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || t / n;
};

const getDefaultInitializationStrategy = t => ({
  A: !t,
  $: false
});

const createEnvironment = () => {
  const {body: t} = document;
  const n = createDOM(`<div class="${w}"><div></div></div>`);
  const o = n[0];
  const e = o.firstChild;
  const [s, , c] = createEventListenerHub();
  const [i, r] = createCache({
    o: getNativeScrollbarSize(t, o, e),
    u: equalXY
  });
  const [a] = r();
  const l = getNativeScrollbarStyling(o);
  const u = {
    x: 0 === a.x,
    y: 0 === a.y
  };
  const f = getDefaultInitializationStrategy(l);
  const d = assignDeep({}, U);
  const _ = {
    L: a,
    I: u,
    T: l,
    D: "-1" === style(o, "zIndex"),
    P: getRtlScrollBehavior(o, e),
    M: getFlexboxGlue(o, e),
    j: t => s("_", t),
    N: assignDeep.bind(0, {}, f),
    R(t) {
      assignDeep(f, t);
    },
    F: assignDeep.bind(0, {}, d),
    H(t) {
      assignDeep(d, t);
    },
    k: assignDeep({}, f),
    B: assignDeep({}, d)
  };
  removeAttr(o, "style");
  removeElements(o);
  if (!l && (!u.x || !u.y)) {
    let n = windowSize();
    let s = getWindowDPR();
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
      const g = f !== s && s > 0;
      const h = d && _ && g;
      if (h) {
        const [n, s] = i(getNativeScrollbarSize(t, o, e));
        assignDeep(Y.L, n);
        removeElements(o);
        if (s) {
          c("_");
        }
      }
      n = r;
      s = f;
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

const staticInitializationElement = (t, n, o, e) => {
  const s = e || (isFunction(o) ? o.apply(0, t) : o);
  return (isFunction(s) ? s.apply(0, t) : s) || n.apply(0, t);
};

const dynamicInitializationElement = (t, n, o, e) => {
  const s = isBoolean(e) || !!e;
  const c = s ? e : isFunction(o) ? o.apply(0, t) : o;
  return true === c || isNull(c) || isUndefined(c) || isFunction(c) ? n.apply(0, t) : c;
};

let W = 0;

const X = createDiv.bind(0, "");

const unwrap = t => {
  appendChildren(parent(t), contents(t));
  removeElements(t);
};

const createUniqueViewportArrangeElement = () => {
  const {T: t, I: n, D: o} = getEnvironment();
  const e = !o && !t && (n.x || n.y);
  const s = e ? document.createElement("style") : false;
  if (s) {
    attr(s, "id", `${L}-${W}`);
    W++;
  }
  return s;
};

const addDataAttrHost = (t, n) => {
  attr(t, m, n || "");
  return removeAttr.bind(0, t, m);
};

const createStructureSetupElements = t => {
  const {N: n, T: o} = getEnvironment();
  const {V: e, U: s, A: c, $: i} = n();
  const r = isHTMLElement(t);
  const a = t;
  const l = r ? t : a.target;
  const f = is(l, "textarea");
  const d = !f && is(l, "body");
  const _ = l.ownerDocument;
  const g = _.body;
  const h = _.defaultView;
  const p = !!u && o;
  const v = staticInitializationElement.bind(0, [ l ]);
  const w = dynamicInitializationElement.bind(0, [ l ]);
  const b = v(X, s, a.viewport);
  const y = b === l;
  const x = p && y;
  const O = y && !x ? v(X) : b;
  const L = {
    Y: l,
    V: f ? v(X, e, a.host) : l,
    U: O,
    A: w(X, c, a.padding),
    $: w(X, i, a.content),
    q: !x && createUniqueViewportArrangeElement(),
    G: h,
    W: _,
    X: parent(g),
    J: g,
    K: f,
    Z: d,
    tt: r,
    nt: x,
    ot: (t, n) => x ? hasAttrClass(O, m, n) : hasClass(O, t),
    et: (t, n, o) => x ? attrClass(O, m, n, o) : (o ? addClass : removeClass)(O, t)
  };
  const z = keys(L).reduce(((t, n) => {
    const o = L[n];
    return push(t, o && !parent(o) ? o : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(z, t) > -1 : null;
  const {Y: D, V: E, A: P, U: M, $: j, q: N} = L;
  const R = [];
  const F = f && elementIsGenerated(E);
  const H = f ? D : contents([ j, M, P, E, D ].find((t => false === elementIsGenerated(t))));
  const k = j || M;
  const B = addDataAttrHost(E, x ? "viewport" : "host");
  const V = addClass(P, A);
  const U = addClass(M, !x && $);
  const Y = addClass(j, I);
  if (F) {
    insertAfter(D, E);
    push(R, (() => {
      insertAfter(E, D);
      removeElements(E);
    }));
  }
  appendChildren(k, H);
  appendChildren(E, P);
  appendChildren(P || E, !x && M);
  appendChildren(M, j);
  push(R, (() => {
    B();
    removeAttr(M, S);
    removeAttr(M, C);
    if (elementIsGenerated(j)) {
      unwrap(j);
    }
    if (elementIsGenerated(M)) {
      unwrap(M);
    }
    if (elementIsGenerated(P)) {
      unwrap(P);
    }
    V();
    U();
    Y();
  }));
  if (o && !x) {
    push(R, removeClass.bind(0, M, T));
  }
  if (N) {
    insertBefore(M, N);
    push(R, removeElements.bind(0, N));
  }
  return [ L, runEach.bind(0, R) ];
};

const createTrinsicUpdate = (t, n) => {
  const {$: o} = t;
  const [e] = n;
  return t => {
    const {M: n} = getEnvironment();
    const {st: s} = e();
    const {ct: c} = t;
    const i = (o || !n) && c;
    if (i) {
      style(o, {
        height: s ? "" : "100%"
      });
    }
    return {
      it: i,
      rt: i
    };
  };
};

const createPaddingUpdate = (t, n) => {
  const [o, e] = n;
  const {V: s, A: c, U: i, nt: r} = t;
  const [a, l] = createCache({
    u: equalTRBL,
    o: topRightBottomLeft()
  }, topRightBottomLeft.bind(0, s, "padding", ""));
  return (t, n, s) => {
    let [u, f] = l(s);
    const {T: d, M: _} = getEnvironment();
    const {lt: g} = o();
    const {it: h, rt: p, ut: v} = t;
    const [w, b] = n("paddingAbsolute");
    const y = !_ && p;
    if (h || f || y) {
      [u, f] = a(s);
    }
    const m = !r && (b || v || f);
    if (m) {
      const t = !w || !c && !d;
      const n = u.r + u.l;
      const o = u.t + u.b;
      const s = {
        marginRight: t && !g ? -n : 0,
        marginBottom: t ? -o : 0,
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
      style(c || i, s);
      style(i, r);
      e({
        A: u,
        ft: !t,
        dt: c ? r : assignDeep({}, s, r)
      });
    }
    return {
      _t: m
    };
  };
};

const {max: J} = Math;

const K = "visible";

const Q = "hidden";

const Z = 42;

const tt = {
  u: equalWH,
  o: {
    w: 0,
    h: 0
  }
};

const nt = {
  u: equalXY,
  o: {
    x: Q,
    y: Q
  }
};

const getOverflowAmount = (t, n, o) => {
  const e = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const s = {
    w: J(0, t.w - n.w - J(0, o.w)),
    h: J(0, t.h - n.h - J(0, o.h))
  };
  return {
    w: s.w > e ? s.w : 0,
    h: s.h > e ? s.h : 0
  };
};

const conditionalClass = (t, n, o) => o ? addClass(t, n) : removeClass(t, n);

const overflowIsVisible = t => 0 === t.indexOf(K);

const createOverflowUpdate = (t, n) => {
  const [o, e] = n;
  const {V: s, A: c, U: i, q: r, nt: a, et: l} = t;
  const {L: u, M: f, T: d, I: _} = getEnvironment();
  const g = !a && !d && (_.x || _.y);
  const [h, p] = createCache(tt, fractionalSize.bind(0, i));
  const [v, w] = createCache(tt, scrollSize.bind(0, i));
  const [b, y] = createCache(tt);
  const [A] = createCache(nt);
  const fixFlexboxGlue = (t, n) => {
    style(i, {
      height: ""
    });
    if (n) {
      const {ft: n, A: e} = o();
      const {gt: c, ht: r} = t;
      const a = fractionalSize(s);
      const l = clientSize(s);
      const u = "content-box" === style(i, "boxSizing");
      const f = n || u ? e.b + e.t : 0;
      const d = !(_.x && u);
      style(i, {
        height: l.h + a.h + (c.x && d ? r.x : 0) - f
      });
    }
  };
  const getViewportOverflowState = (t, n) => {
    const o = !d && !t ? Z : 0;
    const getStatePerAxis = (t, e, s) => {
      const c = style(i, t);
      const r = n ? n[t] : c;
      const a = "scroll" === r;
      const l = e ? o : s;
      const u = a && !d ? l : 0;
      const f = e && !!o;
      return [ c, a, u, f ];
    };
    const [e, s, c, r] = getStatePerAxis("overflowX", _.x, u.x);
    const [a, l, f, g] = getStatePerAxis("overflowY", _.y, u.y);
    return {
      vt: {
        x: e,
        y: a
      },
      gt: {
        x: s,
        y: l
      },
      ht: {
        x: c,
        y: f
      },
      wt: {
        x: r,
        y: g
      }
    };
  };
  const setViewportOverflowState = (t, n, o, e) => {
    const setAxisOverflowStyle = (t, n) => {
      const o = overflowIsVisible(t);
      const e = n && o && t.replace(`${K}-`, "") || "";
      return [ n && !o ? t : "", overflowIsVisible(e) ? "hidden" : e ];
    };
    const [s, c] = setAxisOverflowStyle(o.x, n.x);
    const [i, r] = setAxisOverflowStyle(o.y, n.y);
    e.overflowX = c && i ? c : s;
    e.overflowY = r && s ? r : i;
    return getViewportOverflowState(t, e);
  };
  const arrangeViewport = (t, n, e, s) => {
    if (g) {
      const {dt: c} = o();
      const {ht: a, wt: l} = t;
      const {x: u, y: f} = l;
      const {x: d, y: _} = a;
      const g = s ? "paddingRight" : "paddingLeft";
      const h = c[g];
      const p = c.paddingTop;
      const v = n.w + e.w;
      const w = n.h + e.h;
      const b = {
        w: _ && f ? `${_ + v - h}px` : "",
        h: d && u ? `${d + w - p}px` : ""
      };
      if (r) {
        const {sheet: t} = r;
        if (t) {
          const {cssRules: n} = t;
          if (n) {
            if (!n.length) {
              t.insertRule(`#${attr(r, "id")} + .${L}::before {}`, 0);
            }
            const o = n[0].style;
            o.width = b.w;
            o.height = b.h;
          }
        }
      } else {
        style(i, {
          "--os-vaw": b.w,
          "--os-vah": b.h
        });
      }
    }
    return g;
  };
  const hideNativeScrollbars = (t, n, e, s) => {
    const {ht: c, wt: i} = t;
    const {x: r, y: a} = i;
    const {x: l, y: u} = c;
    const {dt: f} = o();
    const d = n ? "marginLeft" : "marginRight";
    const _ = n ? "paddingLeft" : "paddingRight";
    const g = f[d];
    const h = f.marginBottom;
    const p = f[_];
    const v = f.paddingBottom;
    s.width = `calc(100% + ${u + -1 * g}px)`;
    s[d] = -u + g;
    s.marginBottom = -l + h;
    if (e) {
      s[_] = p + (a ? u : 0);
      s.paddingBottom = v + (r ? l : 0);
    }
  };
  const undoViewportArrange = (t, n, e) => {
    if (g) {
      const s = e || getViewportOverflowState(t);
      const {dt: c} = o();
      const {wt: r} = s;
      const {x: a, y: l} = r;
      const u = {};
      const assignProps = t => each(t.split(" "), (t => {
        u[t] = c[t];
      }));
      if (a) {
        assignProps("marginBottom paddingTop paddingBottom");
      }
      if (l) {
        assignProps("marginLeft marginRight paddingLeft paddingRight");
      }
      const d = style(i, keys(u));
      removeClass(i, L);
      if (!f) {
        u.height = "";
      }
      style(i, u);
      return [ () => {
        hideNativeScrollbars(s, n, g, d);
        style(i, d);
        addClass(i, L);
      }, s ];
    }
    return [ noop ];
  };
  return (t, n, r) => {
    const {it: u, bt: g, rt: $, _t: L, ct: I, ut: D} = t;
    const {st: E, lt: P} = o();
    const [M, j] = n("nativeScrollbarsOverlaid.show");
    const [N, R] = n("overflow");
    const F = M && _.x && _.y;
    const H = !a && !f && (u || $ || g || j || I);
    const k = overflowIsVisible(N.x);
    const B = overflowIsVisible(N.y);
    const V = k || B;
    let U = p(r);
    let Y = w(r);
    let q = y(r);
    let G;
    if (j && d) {
      l(T, O, !F);
    }
    if (H) {
      G = getViewportOverflowState(F);
      fixFlexboxGlue(G, E);
    }
    if (u || L || $ || D || j) {
      if (V) {
        l(z, x, false);
      }
      const [t, n] = undoViewportArrange(F, P, G);
      const [o, e] = U = h(r);
      const [s, c] = Y = v(r);
      const a = clientSize(i);
      let u = s;
      let f = a;
      t();
      if ((c || e || j) && n && !F && arrangeViewport(n, s, o, P)) {
        f = clientSize(i);
        u = scrollSize(i);
      }
      q = b(getOverflowAmount({
        w: J(s.w, u.w),
        h: J(s.h, u.h)
      }, {
        w: f.w + J(0, a.w - s.w),
        h: f.h + J(0, a.h - s.h)
      }, o), r);
    }
    const [W, X] = q;
    const [K, Q] = Y;
    const [Z, tt] = U;
    const nt = {
      x: W.w > 0,
      y: W.h > 0
    };
    const ot = k && B && (nt.x || nt.y) || k && nt.x && !nt.y || B && nt.y && !nt.x;
    if (L || D || tt || Q || X || R || j || H) {
      const t = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: "",
        overflowY: "",
        overflowX: ""
      };
      const n = setViewportOverflowState(F, nt, N, t);
      const o = arrangeViewport(n, K, Z, P);
      if (!a) {
        hideNativeScrollbars(n, P, o, t);
      }
      if (H) {
        fixFlexboxGlue(n, E);
      }
      if (a) {
        attr(s, S, t.overflowX);
        attr(s, C, t.overflowY);
      } else {
        style(i, t);
      }
    }
    attrClass(s, m, x, ot);
    conditionalClass(c, z, ot);
    !a && conditionalClass(i, z, V);
    const [et, st] = A(getViewportOverflowState(F).vt);
    e({
      vt: et,
      yt: {
        x: W.w,
        y: W.h
      },
      St: nt
    });
    return {
      Ct: st,
      xt: X
    };
  };
};

const prepareUpdateHints = (t, n, o) => {
  const e = {};
  const s = n || {};
  const c = keys(t).concat(keys(s));
  each(c, (n => {
    const c = t[n];
    const i = s[n];
    e[n] = !!(o || c || i);
  }));
  return e;
};

const createStructureSetupUpdate = (t, n) => {
  const {U: o} = t;
  const {T: e, I: s, M: c} = getEnvironment();
  const i = !e && (s.x || s.y);
  const r = [ createTrinsicUpdate(t, n), createPaddingUpdate(t, n), createOverflowUpdate(t, n) ];
  return (t, n, e) => {
    const s = prepareUpdateHints(assignDeep({
      it: false,
      _t: false,
      ut: false,
      ct: false,
      xt: false,
      Ct: false,
      bt: false,
      rt: false
    }, n), {}, e);
    const a = i || !c;
    const l = a && scrollLeft(o);
    const u = a && scrollTop(o);
    let f = s;
    each(r, (n => {
      f = prepareUpdateHints(f, n(f, t, !!e) || {}, e);
    }));
    if (isNumber(l)) {
      scrollLeft(o, l);
    }
    if (isNumber(u)) {
      scrollTop(o, u);
    }
    return f;
  };
};

const ot = "animationstart";

const et = "scroll";

const st = 3333333;

const getElmDirectionIsRTL = t => "rtl" === style(t, "direction");

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, o) => {
  const {Ot: e = false, At: s = false} = o || {};
  const {P: c} = getEnvironment();
  const i = createDOM(`<div class="${D}"><div class="${P}"></div></div>`);
  const r = i[0];
  const a = r.firstChild;
  const l = getElmDirectionIsRTL.bind(0, r);
  const [_] = createCache({
    o: void 0,
    _: true,
    u: (t, n) => !(!t || !domRectHasDimensions(t) && domRectHasDimensions(n))
  });
  const onSizeChangedCallbackProxy = t => {
    const o = isArray(t) && t.length > 0 && isObject(t[0]);
    const s = !o && isBoolean(t[0]);
    let i = false;
    let a = false;
    let l = true;
    if (o) {
      const [n, , o] = _(t.pop().contentRect);
      const e = domRectHasDimensions(n);
      const s = domRectHasDimensions(o);
      i = !o || !e;
      a = !s && e;
      l = !i;
    } else if (s) {
      [, l] = t;
    } else {
      a = true === t;
    }
    if (e && l) {
      const n = s ? t[0] : getElmDirectionIsRTL(r);
      scrollLeft(r, n ? c.n ? -st : c.i ? 0 : st : st);
      scrollTop(r, st);
    }
    if (!i) {
      n({
        it: !s,
        $t: s ? t : void 0,
        At: !!a
      });
    }
  };
  const g = [];
  let h = s ? onSizeChangedCallbackProxy : false;
  let p;
  if (u) {
    const t = new u(onSizeChangedCallbackProxy);
    t.observe(a);
    push(g, (() => {
      t.disconnect();
    }));
  } else {
    const t = createDOM(`<div class="${j}" dir="ltr"><div class="${j}"><div class="${N}"></div></div><div class="${j}"><div class="${N}" style="width: 200%; height: 200%"></div></div></div>`);
    appendChildren(a, t);
    addClass(a, M);
    const n = t[0];
    const o = n.lastChild;
    const e = n.firstChild;
    const c = null == e ? void 0 : e.firstChild;
    let i = offsetSize(n);
    let r = i;
    let l = false;
    let u;
    const reset = () => {
      scrollLeft(e, st);
      scrollTop(e, st);
      scrollLeft(o, st);
      scrollTop(o, st);
    };
    const onResized = t => {
      u = 0;
      if (l) {
        i = r;
        onSizeChangedCallbackProxy(true === t);
      }
    };
    const onScroll = t => {
      r = offsetSize(n);
      l = !t || !equalWH(r, i);
      if (t) {
        stopAndPrevent(t);
        if (l && !u) {
          f(u);
          u = d(onResized);
        }
      } else {
        onResized(false === t);
      }
      reset();
    };
    push(g, [ on(e, et, onScroll), on(o, et, onScroll) ]);
    style(c, {
      width: st,
      height: st
    });
    reset();
    h = s ? onScroll.bind(0, false) : reset;
  }
  if (e) {
    p = createCache({
      o: !l()
    }, l);
    const [t] = p;
    push(g, on(r, et, (n => {
      const o = t();
      const [e, s] = o;
      if (s) {
        removeClass(a, "ltr rtl");
        if (e) {
          addClass(a, "rtl");
        } else {
          addClass(a, "ltr");
        }
        onSizeChangedCallbackProxy(o);
      }
      stopAndPrevent(n);
    })));
  }
  if (h) {
    addClass(r, E);
    push(g, on(r, ot, h, {
      O: !!u
    }));
  }
  prependChildren(t, r);
  return () => {
    runEach(g);
    removeElements(r);
  };
};

const isHeightIntrinsic = t => 0 === t.h || t.isIntersecting || t.intersectionRatio > 0;

const createTrinsicObserver = (t, n) => {
  const o = createDiv(R);
  const e = [];
  const [s] = createCache({
    o: false
  });
  const triggerOnTrinsicChangedCallback = t => {
    if (t) {
      const o = s(isHeightIntrinsic(t));
      const [, e] = o;
      if (e) {
        n(o);
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
    n.observe(o);
    push(e, (() => {
      n.disconnect();
    }));
  } else {
    const onSizeChanged = () => {
      const t = offsetSize(o);
      triggerOnTrinsicChangedCallback(t);
    };
    push(e, createSizeObserver(o, onSizeChanged));
    onSizeChanged();
  }
  prependChildren(t, o);
  return () => {
    runEach(e);
    removeElements(o);
  };
};

const createEventContentChange = (t, n, o) => {
  let e;
  let s = false;
  const destroy = () => {
    s = true;
  };
  const updateElements = c => {
    if (o) {
      const i = o.reduce(((n, o) => {
        if (o) {
          const e = o[0];
          const s = o[1];
          const i = s && e && (c ? c(e) : find(e, t));
          if (i && i.length && s && isString(s)) {
            push(n, [ i, s.trim() ], true);
          }
        }
        return n;
      }), []);
      each(i, (t => each(t[0], (o => {
        const c = t[1];
        const i = e.get(o);
        if (i) {
          const t = i[0];
          const n = i[1];
          if (t === c) {
            n();
          }
        }
        const r = on(o, c, (t => {
          if (s) {
            r();
            e.delete(o);
          } else {
            n(t);
          }
        }));
        e.set(o, [ c, r ]);
      }))));
    }
  };
  if (o) {
    e = new WeakMap;
    updateElements();
  }
  return [ destroy, updateElements ];
};

const createDOMObserver = (t, n, o, e) => {
  let s = false;
  const {Lt: c, It: i, Tt: r, zt: l, Dt: u, Et: f} = e || {};
  const [d, _] = createEventContentChange(t, debounce((() => {
    if (s) {
      o(true);
    }
  }), {
    g: 33,
    p: 99
  }), r);
  const g = c || [];
  const h = i || [];
  const p = g.concat(h);
  const observerCallback = s => {
    const c = u || noop;
    const i = f || noop;
    const r = [];
    const a = [];
    let d = false;
    let g = false;
    let p = false;
    each(s, (o => {
      const {attributeName: s, target: u, type: f, oldValue: _, addedNodes: v} = o;
      const w = "attributes" === f;
      const b = "childList" === f;
      const y = t === u;
      const m = w && isString(s) ? attr(u, s) : 0;
      const S = 0 !== m && _ !== m;
      const C = indexOf(h, s) > -1 && S;
      if (n && !y) {
        const n = !w;
        const r = w && C;
        const f = r && l && is(u, l);
        const d = f ? !c(u, s, _, m) : n || r;
        const h = d && !i(o, !!f, t, e);
        push(a, v);
        g = g || h;
        p = p || b;
      }
      if (!n && y && S && !c(u, s, _, m)) {
        push(r, s);
        d = d || C;
      }
    }));
    if (p && !isEmptyArray(a)) {
      _((t => a.reduce(((n, o) => {
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
  const v = new a(observerCallback);
  v.observe(t, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: p,
    subtree: n,
    childList: n,
    characterData: n
  });
  s = true;
  return [ () => {
    if (s) {
      d();
      v.disconnect();
      s = false;
    }
  }, () => {
    if (s) {
      observerCallback(v.takeRecords());
    }
  } ];
};

const ct = `[${m}]`;

const it = `.${$}`;

const rt = [ "tabindex" ];

const at = [ "wrap", "cols", "rows" ];

const lt = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, o) => {
  let e;
  let s;
  let c;
  const [, i] = n;
  const {V: r, U: a, $: l, K: f, nt: d, ot: _, et: g} = t;
  const {T: h, M: p} = getEnvironment();
  const [v] = createCache({
    u: equalWH,
    o: {
      w: 0,
      h: 0
    }
  }, (() => {
    const t = _(z, x);
    t && g(z, x);
    const n = scrollSize(l);
    const o = scrollSize(a);
    const e = fractionalSize(a);
    t && g(z, x, true);
    return {
      w: o.w + n.w + e.w,
      h: o.h + n.h + e.h
    };
  }));
  const w = f ? at : lt.concat(at);
  const b = debounce(o, {
    g: () => e,
    p: () => s,
    v(t, n) {
      const [o] = t;
      const [e] = n;
      return [ keys(o).concat(keys(e)).reduce(((t, n) => {
        t[n] = o[n] || e[n];
        return t;
      }), {}) ];
    }
  });
  const updateViewportAttrsFromHost = t => {
    each(t || rt, (t => {
      if (indexOf(rt, t) > -1) {
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
    const [n, e] = t;
    i({
      st: n
    });
    o({
      ct: e
    });
  };
  const onSizeChanged = ({it: t, $t: n, At: e}) => {
    const s = !t || e ? o : b;
    let c = false;
    if (n) {
      const [t, o] = n;
      c = o;
      i({
        lt: t
      });
    }
    s({
      it: t,
      ut: c
    });
  };
  const onContentMutation = t => {
    const [, n] = v();
    const e = t ? o : b;
    if (n) {
      e({
        rt: true
      });
    }
  };
  const onHostMutation = (t, n) => {
    if (n) {
      b({
        bt: true
      });
    } else if (!d) {
      updateViewportAttrsFromHost(t);
    }
  };
  const y = (l || !p) && createTrinsicObserver(r, onTrinsicChanged);
  const m = !d && createSizeObserver(r, onSizeChanged, {
    At: true,
    Ot: !h
  });
  const [S] = createDOMObserver(r, false, onHostMutation, {
    It: lt,
    Lt: lt.concat(rt)
  });
  const C = d && new u(onSizeChanged.bind(0, {
    it: true
  }));
  C && C.observe(r);
  updateViewportAttrsFromHost();
  return [ t => {
    const [n] = t("updating.ignoreMutation");
    const [o, i] = t("updating.attributes");
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
        It: w.concat(o || []),
        Lt: w.concat(o || []),
        Tt: r,
        zt: ct,
        Et: (t, n) => {
          const {target: o, attributeName: e} = t;
          const s = !n && e ? liesBetween(o, ct, it) : false;
          return s || !!ignoreMutationFromOptions(t);
        }
      });
    }
    if (d) {
      b.m();
      if (isArray(f)) {
        const t = f[0];
        const n = f[1];
        e = isNumber(t) ? t : false;
        s = isNumber(n) ? n : false;
      } else if (isNumber(f)) {
        e = f;
        s = false;
      } else {
        e = false;
        s = false;
      }
    }
  }, () => {
    c && c[0]();
    y && y();
    m && m();
    C && C.disconnect();
    S();
  } ];
};

const ut = {
  A: {
    t: 0,
    r: 0,
    b: 0,
    l: 0
  },
  ft: false,
  dt: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  yt: {
    x: 0,
    y: 0
  },
  vt: {
    x: "hidden",
    y: "hidden"
  },
  St: {
    x: false,
    y: false
  },
  st: false,
  lt: false
};

const createStructureSetup = (t, n) => {
  const o = createOptionCheck(n, {});
  const e = createState(ut);
  const s = new Set;
  const [c] = e;
  const runOnUpdatedListeners = (t, n, o) => {
    runEach(s, [ t, n || {}, !!o ]);
  };
  const [i, r] = createStructureSetupElements(t);
  const a = createStructureSetupUpdate(i, e);
  const [l, u] = createStructureSetupObservers(i, e, (t => {
    runOnUpdatedListeners(a(o, t));
  }));
  const f = c.bind(0);
  f.Pt = t => {
    s.add(t);
  };
  f.Mt = i;
  return [ (t, o) => {
    const e = createOptionCheck(n, t, o);
    l(e);
    runOnUpdatedListeners(a(e, {}, o));
  }, f, () => {
    s.clear();
    u();
    r();
  } ];
};

const generateScrollbarDOM = t => {
  const n = createDiv(`${F} ${t}`);
  const o = createDiv(B);
  const e = createDiv(V);
  appendChildren(n, o);
  appendChildren(o, e);
  return {
    jt: n,
    Nt: o,
    Rt: e
  };
};

const createScrollbarsSetupElements = (t, n) => {
  const {N: o} = getEnvironment();
  const {Ft: e} = o();
  const {Y: s, V: c, U: i, tt: r} = n;
  const a = !r && t.scrollbarsSlot;
  const l = dynamicInitializationElement([ s, c, i ], (() => c), e, a);
  const u = generateScrollbarDOM(H);
  const f = generateScrollbarDOM(k);
  const {jt: d} = u;
  const {jt: _} = f;
  appendChildren(l, d);
  appendChildren(l, _);
  return [ {
    Ht: u,
    kt: f
  }, removeElements.bind(0, [ d, _ ]) ];
};

const createScrollbarsSetup = (t, n, o) => {
  const e = createState({});
  const [s] = e;
  const [c, i] = createScrollbarsSetupElements(t, o);
  const r = s.bind(0);
  r.Mt = c;
  return [ (t, o) => {
    const e = createOptionCheck(n, t, o);
    console.log(e);
  }, r, () => {
    i();
  } ];
};

const ft = {};

const getPlugins = () => assignDeep({}, ft);

const addPlugin = t => each(isArray(t) ? t : [ t ], (t => {
  ft[t[0]] = t[1];
}));

const dt = {
  boolean: "__TPL_boolean_TYPE__",
  number: "__TPL_number_TYPE__",
  string: "__TPL_string_TYPE__",
  array: "__TPL_array_TYPE__",
  object: "__TPL_object_TYPE__",
  function: "__TPL_function_TYPE__",
  null: "__TPL_null_TYPE__"
};

const _t = dt.number;

const gt = dt.boolean;

const ht = [ dt.array, dt.null ];

const pt = "hidden scroll visible visible-hidden";

const vt = "visible hidden auto";

const wt = "never scroll leavemove";

({
  paddingAbsolute: gt,
  updating: {
    elementEvents: ht,
    attributes: ht,
    debounce: [ dt.number, dt.array, dt.null ],
    ignoreMutation: [ dt.function, dt.null ]
  },
  overflow: {
    x: pt,
    y: pt
  },
  scrollbars: {
    visibility: vt,
    autoHide: wt,
    autoHideDelay: _t,
    dragScroll: gt,
    clickScroll: gt,
    touch: gt
  },
  nativeScrollbarsOverlaid: {
    show: gt,
    initialize: gt
  }
});

const bt = "__osOptionsValidationPlugin";

const yt = new Set;

const mt = new WeakMap;

const addInstance = (t, n) => {
  mt.set(t, n);
  yt.add(t);
};

const removeInstance = t => {
  mt.delete(t);
  yt.delete(t);
};

const getInstance = t => mt.get(t);

const OverlayScrollbars = (t, n, o) => {
  const {F: e, I: s, j: c} = getEnvironment();
  const i = getPlugins();
  const r = isHTMLElement(t) ? t : t.target;
  const a = getInstance(r);
  if (a) {
    return a;
  }
  const l = i[bt];
  const validateOptions = t => {
    const n = t || {};
    const o = l && l.Bt;
    return o ? o(n, true) : n;
  };
  const u = assignDeep({}, e(), validateOptions(n));
  const [f, d, _] = createEventListenerHub(o);
  if (s.x && s.y && !u.nativeScrollbarsOverlaid.initialize) {
    _("initializationWithdrawn");
  }
  const [g, h, p] = createStructureSetup(t, u);
  const [v, , w] = createScrollbarsSetup(t, u, h.Mt);
  const update = (t, n) => {
    g(t, n);
    v(t, n);
  };
  const b = c(update.bind(0, {}, true));
  h.Pt(((t, n, o) => {
    const {it: e, ut: s, ct: c, xt: i, Ct: r, rt: a, bt: l} = t;
    _("updated", {
      updateHints: {
        sizeChanged: e,
        directionChanged: s,
        heightIntrinsicChanged: c,
        overflowAmountChanged: i,
        overflowStyleChanged: r,
        contentMutation: a,
        hostMutation: l
      },
      changedOptions: n,
      force: o
    });
  }));
  const y = {
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
    on: f,
    off: d,
    state() {
      const {yt: t, vt: n, St: o, A: e, ft: s} = h();
      return assignDeep({}, {
        overflowAmount: t,
        overflowStyle: n,
        hasOverflow: o,
        padding: e,
        paddingAbsolute: s
      });
    },
    elements() {
      const {Y: t, V: n, A: o, U: e, $: s} = h.Mt;
      return assignDeep({}, {
        target: t,
        host: n,
        padding: o || e,
        viewport: e,
        content: s || e
      });
    },
    update(t) {
      update({}, t);
    },
    destroy: () => {
      removeInstance(r);
      b();
      d();
      w();
      p();
      _("destroyed");
    }
  };
  each(keys(i), (t => {
    const n = i[t];
    if (isFunction(n)) {
      n(OverlayScrollbars, y);
    }
  }));
  y.update(true);
  addInstance(r, y);
  _("initialized");
  return y;
};

OverlayScrollbars.plugin = addPlugin;

OverlayScrollbars.env = () => {
  const {L: t, I: n, T: o, P: e, M: s, D: c, k: i, B: r, N: a, R: l, F: u, H: f} = getEnvironment();
  return assignDeep({}, {
    scrollbarSize: t,
    scrollbarIsOverlaid: n,
    scrollbarStyling: o,
    rtlScrollBehavior: e,
    flexboxGlue: s,
    cssCustomProperties: c,
    defaultInitializationStrategy: i,
    defaultDefaultOptions: r,
    getInitializationStrategy: a,
    setInitializationStrategy: l,
    getDefaultOptions: u,
    setDefaultOptions: f
  });
};

export { OverlayScrollbars as default };
//# sourceMappingURL=overlayscrollbars.esm.js.map
