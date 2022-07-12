function createCache(t, n) {
  const {o: e, u: o, _: s} = t;
  let c = e;
  let i;
  const cacheUpdateContextual = (t, n) => {
    const e = c;
    const r = t;
    const a = n || (o ? !o(e, r) : e !== r);
    if (a || s) {
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
  const o = "constructor";
  const s = t[o];
  const c = s && s.prototype;
  const i = e.call(t, o);
  const r = c && e.call(c, "isPrototypeOf");
  if (s && !i && !r) {
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

function assignDeep(t, n, e, o, s, c, i) {
  const r = [ n, e, o, s, c, i ];
  if (("object" !== typeof t || isNull(t)) && !isFunction(t)) {
    t = {};
  }
  each(r, (n => {
    each(keys(n), (e => {
      const o = n[e];
      if (t === o) {
        return true;
      }
      const s = isArray(o);
      if (o && (isPlainObject(o) || s)) {
        const n = t[e];
        let c = n;
        if (s && !isArray(n)) {
          c = [];
        } else if (!s && !isPlainObject(n)) {
          c = {};
        }
        t[e] = assignDeep(c, o);
      } else {
        t[e] = o;
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

function getSetProp(t, n, e, o) {
  if (isUndefined(o)) {
    return e ? e[t] : n;
  }
  e && (e[t] = o);
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
  const o = isArray(n) || e;
  if (o) {
    let o = e ? "" : {};
    if (t) {
      const s = window.getComputedStyle(t, null);
      o = e ? getCSSVal(t, s, n) : n.reduce(((n, e) => {
        n[e] = getCSSVal(t, s, e);
        return n;
      }), o);
    }
    return o;
  }
  each(keys(n), (e => setCSSVal(t, e, n[e])));
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

const attrClass = (t, n, e, o) => {
  const s = attr(t, n) || "";
  const c = new Set(s.split(" "));
  c[o ? "add" : "delete"](e);
  attr(t, n, from(c).join(" ").trim());
};

const hasAttrClass = (t, n, e) => {
  const o = attr(t, n) || "";
  const s = new Set(o.split(" "));
  return s.has(e);
};

const removeAttr = (t, n) => {
  t && t.removeAttribute(n);
};

const o = Element.prototype;

const find = (t, n) => {
  const e = [];
  const o = n ? isElement(n) ? n : null : document;
  return o ? push(e, o.querySelectorAll(t)) : e;
};

const findFirst = (t, n) => {
  const e = n ? isElement(n) ? n : null : document;
  return e ? e.querySelector(t) : null;
};

const is = (t, n) => {
  if (isElement(t)) {
    const e = o.matches || o.msMatchesSelector;
    return e.call(t, n);
  }
  return false;
};

const contents = t => t ? from(t.childNodes) : [];

const parent = t => t ? t.parentElement : null;

const closest = (t, n) => {
  if (isElement(t)) {
    const e = o.closest;
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
  const o = t && closest(t, n);
  const s = t && findFirst(e, o);
  return o && s ? o === t || s === t || closest(closest(t, e), n) !== o : false;
};

const before = (t, n, e) => {
  if (e) {
    let o = n;
    let s;
    if (t) {
      if (isArrayLike(e)) {
        s = document.createDocumentFragment();
        each(e, (t => {
          if (t === o) {
            o = t.previousSibling;
          }
          s.appendChild(t);
        }));
      } else {
        s = e;
      }
      if (n) {
        if (!o) {
          o = t.firstChild;
        } else if (o !== n) {
          o = o.nextSibling;
        }
      }
      t.insertBefore(s, o || null);
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
  const e = firstLetterToUpper(t);
  const o = getDummyStyle();
  each(s, (s => {
    const c = s.replace(/-/g, "");
    const i = [ t, s + t, c + e, firstLetterToUpper(c) + e ];
    return !(n = i.find((t => void 0 !== o[t])));
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
  let o;
  let s = 0;
  let c = false;
  if (t && n && isString(n)) {
    const i = n.match(_) || [];
    c = i.length > 0;
    while (o = i[s++]) {
      c = !!e(t.classList, o) && c;
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

const equal = (t, n, e, o) => {
  if (t && n) {
    let s = true;
    each(e, (e => {
      const c = o ? o(t[e]) : t[e];
      const i = o ? o(n[e]) : n[e];
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

const equalBCRWH = (t, n, e) => equal(t, n, [ "width", "height" ], e && (t => Math.round(t)));

const clearTimeouts = t => {
  t && window.clearTimeout(t);
  t && f(t);
};

const noop = () => {};

const debounce = (t, n) => {
  let e;
  let o;
  let s;
  let c;
  const {g: i, p: r, v: a} = n || {};
  const l = window.setTimeout;
  const u = function invokeFunctionToDebounce(n) {
    clearTimeouts(e);
    clearTimeouts(o);
    o = e = s = void 0;
    t.apply(this, n);
  };
  const mergeParms = t => a && s ? a(s, t) : t;
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
      if (a && !o) {
        o = l(flush, i);
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
  const e = n ? parseFloat(t) : parseInt(t, 10);
  return Number.isNaN(e) ? 0 : e;
};

const adaptCSSVal = (t, n) => !g[t.toLowerCase()] && isNumber(n) ? `${n}px` : n;

const getCSSVal = (t, n, e) => null != n ? n[e] || n.getPropertyValue(e) : t.style[e];

const setCSSVal = (t, n, e) => {
  try {
    if (t) {
      const {style: o} = t;
      if (!isUndefined(o[n])) {
        o[n] = adaptCSSVal(n, e);
      } else {
        o.setProperty(n, e);
      }
    }
  } catch (o) {}
};

const topRightBottomLeft = (t, n, e) => {
  const o = n ? `${n}-` : "";
  const s = e ? `-${e}` : "";
  const c = `${o}top${s}`;
  const i = `${o}right${s}`;
  const r = `${o}bottom${s}`;
  const a = `${o}left${s}`;
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

const off = (t, n, e, o) => {
  each(splitEventNames(n), (n => {
    t.removeEventListener(n, e, o);
  }));
};

const on = (t, n, e, o) => {
  const s = supportPassiveEvents();
  const c = s && o && o.S || false;
  const i = o && o.C || false;
  const r = o && o.O || false;
  const a = [];
  const l = s ? {
    passive: c,
    capture: i
  } : i;
  each(splitEventNames(n), (n => {
    const o = r ? s => {
      t.removeEventListener(n, o, i);
      e && e(s);
    } : e;
    push(a, off.bind(null, t, n, o, i));
    t.addEventListener(n, o, l);
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
      const o = n.get(t);
      manageListener((t => {
        if (o) {
          o[t ? "delete" : "clear"](t);
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
    const o = n.get(t) || new Set;
    n.set(t, o);
    manageListener((t => {
      t && o.add(t);
    }), e);
    return removeEvent.bind(0, t, e);
  }
  function triggerEvent(t, e) {
    const o = n.get(t);
    each(from(o), (t => {
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

const createOptionCheck = (t, n, e) => o => [ getPropByPath(t, o), e || void 0 !== getPropByPath(n, o) ];

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

const C = `${m}-overflow-y`;

const x = "overflowVisible";

const O = "viewportStyled";

const A = "os-padding";

const I = "os-viewport";

const L = `${I}-arrange`;

const T = "os-content";

const $ = `${I}-scrollbar-styled`;

const z = `os-overflow-visible`;

const D = "os-size-observer";

const E = `${D}-appear`;

const P = `${D}-listener`;

const M = "os-trinsic-observer";

const j = "os-scrollbar";

const N = `${j}-horizontal`;

const R = `${j}-vertical`;

const H = "os-scrollbar-track";

const F = "os-scrollbar-handle";

const opsStringify = t => JSON.stringify(t, ((t, n) => {
  if (isFunction(n)) {
    throw new Error;
  }
  return n;
}));

const k = {
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
  const o = keys(n).concat(keys(t));
  each(o, (o => {
    const s = t[o];
    const c = n[o];
    if (isObject(s) && isObject(c)) {
      assignDeep(e[o] = {}, getOptionsDiff(s, c));
    } else if (hasOwnProperty(n, o) && c !== s) {
      let t = true;
      if (isArray(s) || isArray(c)) {
        try {
          if (opsStringify(s) === opsStringify(c)) {
            t = false;
          }
        } catch (i) {}
      }
      if (t) {
        e[o] = c;
      }
    }
  }));
  return e;
};

let V;

const {abs: B, round: U} = Math;

const diffBiggerThanOne = (t, n) => {
  const e = B(t);
  const o = B(n);
  return !(e === o || e + 1 === o || e - 1 === o);
};

const getNativeScrollbarSize = (t, n, e) => {
  appendChildren(t, n);
  const o = clientSize(n);
  const s = offsetSize(n);
  const c = fractionalSize(e);
  return {
    x: s.h - o.h + c.h,
    y: s.w - o.w + c.w
  };
};

const getNativeScrollbarStyling = t => {
  let n = false;
  const e = addClass(t, $);
  try {
    n = "none" === style(t, cssProperty("scrollbar-width")) || "none" === window.getComputedStyle(t, "::-webkit-scrollbar").getPropertyValue("display");
  } catch (o) {}
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
  const o = absoluteCoordinates(t);
  const s = absoluteCoordinates(n);
  scrollLeft(t, -999);
  const c = absoluteCoordinates(n);
  return {
    i: o.x === s.x,
    n: s.x !== c.x
  };
};

const getFlexboxGlue = (t, n) => {
  const e = addClass(t, w);
  const o = getBoundingClientRect(t);
  const s = getBoundingClientRect(n);
  const c = equalBCRWH(s, o, true);
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
  const o = e.firstChild;
  const [s, , c] = createEventListenerHub();
  const [i, r] = createCache({
    o: getNativeScrollbarSize(t, e, o),
    u: equalXY
  });
  const [a] = r();
  const l = getNativeScrollbarStyling(e);
  const u = {
    x: 0 === a.x,
    y: 0 === a.y
  };
  const f = {
    A: !l,
    I: false
  };
  const d = assignDeep({}, k);
  const _ = {
    L: a,
    T: u,
    $: l,
    D: "-1" === style(e, "zIndex"),
    P: getRtlScrollBehavior(e, o),
    M: getFlexboxGlue(e, o),
    j: t => s("_", t),
    N: assignDeep.bind(0, {}, f),
    R(t) {
      assignDeep(f, t);
    },
    H: assignDeep.bind(0, {}, d),
    F(t) {
      assignDeep(d, t);
    },
    k: assignDeep({}, f),
    V: assignDeep({}, d)
  };
  removeAttr(e, "style");
  removeElements(e);
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
        w: B(a.w),
        h: B(a.h)
      };
      const u = {
        w: B(U(r.w / (n.w / 100))),
        h: B(U(r.h / (n.h / 100)))
      };
      const f = getWindowDPR();
      const d = l.w > 2 && l.h > 2;
      const _ = !diffBiggerThanOne(u.w, u.h);
      const g = f !== s && s > 0;
      const h = d && _ && g;
      if (h) {
        const [n, s] = i(getNativeScrollbarSize(t, e, o));
        assignDeep(V.L, n);
        removeElements(e);
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
  if (!V) {
    V = createEnvironment();
  }
  return V;
};

const resolveInitialization = (t, n) => isFunction(t) ? t.apply(0, n) : t;

const staticInitializationElement = (t, n, e, o) => resolveInitialization(o || resolveInitialization(e, t), t) || n.apply(0, t);

const dynamicInitializationElement = (t, n, e, o) => {
  let s = resolveInitialization(o, t);
  if (isNull(s) || isUndefined(s)) {
    s = resolveInitialization(e, t);
  }
  return true === s || isNull(s) || isUndefined(s) ? n.apply(0, t) : s;
};

let Y = 0;

const q = createDiv.bind(0, "");

const unwrap = t => {
  appendChildren(parent(t), contents(t));
  removeElements(t);
};

const createUniqueViewportArrangeElement = () => {
  const {$: t, T: n, D: e} = getEnvironment();
  const o = !e && !t && (n.x || n.y);
  const s = o ? document.createElement("style") : false;
  if (s) {
    attr(s, "id", `${L}-${Y}`);
    Y++;
  }
  return s;
};

const addDataAttrHost = (t, n) => {
  attr(t, m, n);
  return removeAttr.bind(0, t, m);
};

const createStructureSetupElements = t => {
  const {N: n, $: e} = getEnvironment();
  const {B: o, U: s, A: c, I: i} = n();
  const r = isHTMLElement(t);
  const a = t;
  const l = r ? t : a.target;
  const f = is(l, "textarea");
  const d = !f && is(l, "body");
  const _ = l.ownerDocument;
  const g = _.body;
  const h = _.defaultView;
  const p = !!u && !f && e;
  const v = staticInitializationElement.bind(0, [ l ]);
  const b = dynamicInitializationElement.bind(0, [ l ]);
  const w = [ v(q, s, a.viewport), v(q, s), v(q) ].filter((t => !p ? t !== l : true))[0];
  const y = w === l;
  const x = {
    Y: l,
    B: f ? v(q, o, a.host) : l,
    U: w,
    A: !y && b(q, c, a.padding),
    I: !y && b(q, i, a.content),
    q: !y && createUniqueViewportArrangeElement(),
    G: h,
    W: _,
    X: parent(g),
    J: g,
    K: f,
    Z: d,
    tt: r,
    nt: y,
    et: (t, n) => y ? hasAttrClass(w, m, n) : hasClass(w, t),
    ot: (t, n, e) => y ? attrClass(w, m, n, e) : (e ? addClass : removeClass)(w, t)
  };
  const O = keys(x).reduce(((t, n) => {
    const e = x[n];
    return push(t, e && !parent(e) ? e : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(O, t) > -1 : null;
  const {Y: L, B: z, A: D, U: E, I: P, q: M} = x;
  const j = [];
  const N = f && elementIsGenerated(z);
  const R = f ? L : contents([ P, E, D, z, L ].find((t => false === elementIsGenerated(t))));
  const H = P || E;
  const appendElements = () => {
    const t = addDataAttrHost(z, y ? "viewport" : "host");
    const n = addClass(D, A);
    const o = addClass(E, !y && I);
    const s = addClass(P, T);
    if (N) {
      insertAfter(L, z);
      push(j, (() => {
        insertAfter(z, L);
        removeElements(z);
      }));
    }
    appendChildren(H, R);
    appendChildren(z, D);
    appendChildren(D || z, !y && E);
    appendChildren(E, P);
    push(j, (() => {
      t();
      removeAttr(E, S);
      removeAttr(E, C);
      if (elementIsGenerated(P)) {
        unwrap(P);
      }
      if (elementIsGenerated(E)) {
        unwrap(E);
      }
      if (elementIsGenerated(D)) {
        unwrap(D);
      }
      n();
      o();
      s();
    }));
    if (e && !y) {
      push(j, removeClass.bind(0, E, $));
    }
    if (M) {
      insertBefore(E, M);
      push(j, removeElements.bind(0, M));
    }
  };
  return [ x, appendElements, runEachAndClear.bind(0, j) ];
};

const createTrinsicUpdate = (t, n) => {
  const {I: e} = t;
  const [o] = n;
  return t => {
    const {M: n} = getEnvironment();
    const {st: s} = o();
    const {ct: c} = t;
    const i = (e || !n) && c;
    if (i) {
      style(e, {
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
  const [e, o] = n;
  const {B: s, A: c, U: i, nt: r} = t;
  const [a, l] = createCache({
    u: equalTRBL,
    o: topRightBottomLeft()
  }, topRightBottomLeft.bind(0, s, "padding", ""));
  return (t, n, s) => {
    let [u, f] = l(s);
    const {$: d, M: _} = getEnvironment();
    const {lt: g} = e();
    const {it: h, rt: p, ut: v} = t;
    const [b, w] = n("paddingAbsolute");
    const y = !_ && p;
    if (h || f || y) {
      [u, f] = a(s);
    }
    const m = !r && (w || v || f);
    if (m) {
      const t = !b || !c && !d;
      const n = u.r + u.l;
      const e = u.t + u.b;
      const s = {
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
      style(c || i, s);
      style(i, r);
      o({
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

const {max: G} = Math;

const W = "visible";

const X = "hidden";

const J = 42;

const K = {
  u: equalWH,
  o: {
    w: 0,
    h: 0
  }
};

const Q = {
  u: equalXY,
  o: {
    x: X,
    y: X
  }
};

const getOverflowAmount = (t, n, e) => {
  const o = window.devicePixelRatio % 1 !== 0 ? 1 : 0;
  const s = {
    w: G(0, t.w - n.w - G(0, e.w)),
    h: G(0, t.h - n.h - G(0, e.h))
  };
  return {
    w: s.w > o ? s.w : 0,
    h: s.h > o ? s.h : 0
  };
};

const conditionalClass = (t, n, e) => e ? addClass(t, n) : removeClass(t, n);

const overflowIsVisible = t => 0 === t.indexOf(W);

const createOverflowUpdate = (t, n) => {
  const [e, o] = n;
  const {B: s, A: c, U: i, q: r, nt: a, ot: l} = t;
  const {L: u, M: f, $: d, T: _} = getEnvironment();
  const g = !a && !d && (_.x || _.y);
  const [h, p] = createCache(K, fractionalSize.bind(0, i));
  const [v, b] = createCache(K, scrollSize.bind(0, i));
  const [w, y] = createCache(K);
  const [A] = createCache(Q);
  const fixFlexboxGlue = (t, n) => {
    style(i, {
      height: ""
    });
    if (n) {
      const {ft: n, A: o} = e();
      const {gt: c, ht: r} = t;
      const a = fractionalSize(s);
      const l = clientSize(s);
      const u = "content-box" === style(i, "boxSizing");
      const f = n || u ? o.b + o.t : 0;
      const d = !(_.x && u);
      style(i, {
        height: l.h + a.h + (c.x && d ? r.x : 0) - f
      });
    }
  };
  const getViewportOverflowState = (t, n) => {
    const e = !d && !t ? J : 0;
    const getStatePerAxis = (t, o, s) => {
      const c = style(i, t);
      const r = n ? n[t] : c;
      const a = "scroll" === r;
      const l = o ? e : s;
      const u = a && !d ? l : 0;
      const f = o && !!e;
      return [ c, a, u, f ];
    };
    const [o, s, c, r] = getStatePerAxis("overflowX", _.x, u.x);
    const [a, l, f, g] = getStatePerAxis("overflowY", _.y, u.y);
    return {
      vt: {
        x: o,
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
      bt: {
        x: r,
        y: g
      }
    };
  };
  const setViewportOverflowState = (t, n, e, o) => {
    const setAxisOverflowStyle = (t, n) => {
      const e = overflowIsVisible(t);
      const o = n && e && t.replace(`${W}-`, "") || "";
      return [ n && !e ? t : "", overflowIsVisible(o) ? "hidden" : o ];
    };
    const [s, c] = setAxisOverflowStyle(e.x, n.x);
    const [i, r] = setAxisOverflowStyle(e.y, n.y);
    o.overflowX = c && i ? c : s;
    o.overflowY = r && s ? r : i;
    return getViewportOverflowState(t, o);
  };
  const arrangeViewport = (t, n, o, s) => {
    if (g) {
      const {dt: c} = e();
      const {ht: a, bt: l} = t;
      const {x: u, y: f} = l;
      const {x: d, y: _} = a;
      const g = s ? "paddingRight" : "paddingLeft";
      const h = c[g];
      const p = c.paddingTop;
      const v = n.w + o.w;
      const b = n.h + o.h;
      const w = {
        w: _ && f ? `${_ + v - h}px` : "",
        h: d && u ? `${d + b - p}px` : ""
      };
      if (r) {
        const {sheet: t} = r;
        if (t) {
          const {cssRules: n} = t;
          if (n) {
            if (!n.length) {
              t.insertRule(`#${attr(r, "id")} + .${L}::before {}`, 0);
            }
            const e = n[0].style;
            e.width = w.w;
            e.height = w.h;
          }
        }
      } else {
        style(i, {
          "--os-vaw": w.w,
          "--os-vah": w.h
        });
      }
    }
    return g;
  };
  const hideNativeScrollbars = (t, n, o, s) => {
    const {ht: c, bt: i} = t;
    const {x: r, y: a} = i;
    const {x: l, y: u} = c;
    const {dt: f} = e();
    const d = n ? "marginLeft" : "marginRight";
    const _ = n ? "paddingLeft" : "paddingRight";
    const g = f[d];
    const h = f.marginBottom;
    const p = f[_];
    const v = f.paddingBottom;
    s.width = `calc(100% + ${u + -1 * g}px)`;
    s[d] = -u + g;
    s.marginBottom = -l + h;
    if (o) {
      s[_] = p + (a ? u : 0);
      s.paddingBottom = v + (r ? l : 0);
    }
  };
  const undoViewportArrange = (t, n, o) => {
    if (g) {
      const s = o || getViewportOverflowState(t);
      const {dt: c} = e();
      const {bt: r} = s;
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
    const {it: u, wt: g, rt: I, _t: L, ct: T, ut: D} = t;
    const {st: E, lt: P} = e();
    const [M, j] = n("nativeScrollbarsOverlaid.show");
    const [N, R] = n("overflow");
    const H = M && _.x && _.y;
    const F = !a && !f && (u || I || g || j || T);
    const k = overflowIsVisible(N.x);
    const V = overflowIsVisible(N.y);
    const B = k || V;
    let U = p(r);
    let Y = b(r);
    let q = y(r);
    let W;
    if (j && d) {
      l($, O, !H);
    }
    if (F) {
      W = getViewportOverflowState(H);
      fixFlexboxGlue(W, E);
    }
    if (u || L || I || D || j) {
      if (B) {
        l(z, x, false);
      }
      const [t, n] = undoViewportArrange(H, P, W);
      const [e, o] = U = h(r);
      const [s, c] = Y = v(r);
      const a = clientSize(i);
      let u = s;
      let f = a;
      t();
      if ((c || o || j) && n && !H && arrangeViewport(n, s, e, P)) {
        f = clientSize(i);
        u = scrollSize(i);
      }
      q = w(getOverflowAmount({
        w: G(s.w, u.w),
        h: G(s.h, u.h)
      }, {
        w: f.w + G(0, a.w - s.w),
        h: f.h + G(0, a.h - s.h)
      }, e), r);
    }
    const [X, J] = q;
    const [K, Q] = Y;
    const [Z, tt] = U;
    const nt = {
      x: X.w > 0,
      y: X.h > 0
    };
    const et = k && V && (nt.x || nt.y) || k && nt.x && !nt.y || V && nt.y && !nt.x;
    if (L || D || tt || Q || J || R || j || F) {
      const t = {
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        width: "",
        overflowY: "",
        overflowX: ""
      };
      const n = setViewportOverflowState(H, nt, N, t);
      const e = arrangeViewport(n, K, Z, P);
      if (!a) {
        hideNativeScrollbars(n, P, e, t);
      }
      if (F) {
        fixFlexboxGlue(n, E);
      }
      if (a) {
        attr(s, S, t.overflowX);
        attr(s, C, t.overflowY);
      } else {
        style(i, t);
      }
    }
    attrClass(s, m, x, et);
    conditionalClass(c, z, et);
    !a && conditionalClass(i, z, B);
    const [ot, st] = A(getViewportOverflowState(H).vt);
    o({
      vt: ot,
      yt: {
        x: X.w,
        y: X.h
      },
      St: nt
    });
    return {
      Ct: st,
      xt: J
    };
  };
};

const prepareUpdateHints = (t, n, e) => {
  const o = {};
  const s = n || {};
  const c = keys(t).concat(keys(s));
  each(c, (n => {
    const c = t[n];
    const i = s[n];
    o[n] = !!(e || c || i);
  }));
  return o;
};

const createStructureSetupUpdate = (t, n) => {
  const {U: e} = t;
  const {$: o, T: s, M: c} = getEnvironment();
  const i = !o && (s.x || s.y);
  const r = [ createTrinsicUpdate(t, n), createPaddingUpdate(t, n), createOverflowUpdate(t, n) ];
  return (t, n, o) => {
    const s = prepareUpdateHints(assignDeep({
      it: false,
      _t: false,
      ut: false,
      ct: false,
      xt: false,
      Ct: false,
      wt: false,
      rt: false
    }, n), {}, o);
    const a = i || !c;
    const l = a && scrollLeft(e);
    const u = a && scrollTop(e);
    let f = s;
    each(r, (n => {
      f = prepareUpdateHints(f, n(f, t, !!o) || {}, o);
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

const Z = "animationstart";

const tt = "scroll";

const nt = 3333333;

const getElmDirectionIsRTL = t => "rtl" === style(t, "direction");

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, e) => {
  const {Ot: o = false, At: s = false} = e || {};
  const {P: c} = getEnvironment();
  const i = createDOM(`<div class="${D}"><div class="${P}"></div></div>`);
  const r = i[0];
  const a = r.firstChild;
  const l = getElmDirectionIsRTL.bind(0, r);
  const [f] = createCache({
    o: void 0,
    _: true,
    u: (t, n) => !(!t || !domRectHasDimensions(t) && domRectHasDimensions(n))
  });
  const onSizeChangedCallbackProxy = t => {
    const e = isArray(t) && t.length > 0 && isObject(t[0]);
    const s = !e && isBoolean(t[0]);
    let i = false;
    let a = false;
    let l = true;
    if (e) {
      const [n, , e] = f(t.pop().contentRect);
      const o = domRectHasDimensions(n);
      const s = domRectHasDimensions(e);
      i = !e || !o;
      a = !s && o;
      l = !i;
    } else if (s) {
      [, l] = t;
    } else {
      a = true === t;
    }
    if (o && l) {
      const n = s ? t[0] : getElmDirectionIsRTL(r);
      scrollLeft(r, n ? c.n ? -nt : c.i ? 0 : nt : nt);
      scrollTop(r, nt);
    }
    if (!i) {
      n({
        it: !s,
        It: s ? t : void 0,
        At: !!a
      });
    }
  };
  const d = [];
  let _ = s ? onSizeChangedCallbackProxy : false;
  let g;
  if (u) {
    const t = new u(onSizeChangedCallbackProxy);
    t.observe(a);
    push(d, (() => {
      t.disconnect();
    }));
  }
  if (o) {
    g = createCache({
      o: !l()
    }, l);
    const [t] = g;
    push(d, on(r, tt, (n => {
      const e = t();
      const [o, s] = e;
      if (s) {
        removeClass(a, "ltr rtl");
        if (o) {
          addClass(a, "rtl");
        } else {
          addClass(a, "ltr");
        }
        onSizeChangedCallbackProxy(e);
      }
      stopAndPrevent(n);
    })));
  }
  if (_) {
    addClass(r, E);
    push(d, on(r, Z, _, {
      O: !!u
    }));
  }
  prependChildren(t, r);
  return () => {
    runEachAndClear(d);
    removeElements(r);
  };
};

const isHeightIntrinsic = t => 0 === t.h || t.isIntersecting || t.intersectionRatio > 0;

const createTrinsicObserver = (t, n) => {
  const e = createDiv(M);
  const o = [];
  const [s] = createCache({
    o: false
  });
  const triggerOnTrinsicChangedCallback = t => {
    if (t) {
      const e = s(isHeightIntrinsic(t));
      const [, o] = e;
      if (o) {
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
    push(o, (() => {
      n.disconnect();
    }));
  } else {
    const onSizeChanged = () => {
      const t = offsetSize(e);
      triggerOnTrinsicChangedCallback(t);
    };
    push(o, createSizeObserver(e, onSizeChanged));
    onSizeChanged();
  }
  prependChildren(t, e);
  return () => {
    runEachAndClear(o);
    removeElements(e);
  };
};

const createEventContentChange = (t, n, e) => {
  let o;
  let s = false;
  const destroy = () => {
    s = true;
  };
  const updateElements = c => {
    if (e) {
      const i = e.reduce(((n, e) => {
        if (e) {
          const o = e[0];
          const s = e[1];
          const i = s && o && (c ? c(o) : find(o, t));
          if (i && i.length && s && isString(s)) {
            push(n, [ i, s.trim() ], true);
          }
        }
        return n;
      }), []);
      each(i, (t => each(t[0], (e => {
        const c = t[1];
        const i = o.get(e);
        if (i) {
          const t = i[0];
          const n = i[1];
          if (t === c) {
            n();
          }
        }
        const r = on(e, c, (t => {
          if (s) {
            r();
            o.delete(e);
          } else {
            n(t);
          }
        }));
        o.set(e, [ c, r ]);
      }))));
    }
  };
  if (e) {
    o = new WeakMap;
    updateElements();
  }
  return [ destroy, updateElements ];
};

const createDOMObserver = (t, n, e, o) => {
  let s = false;
  const {Lt: c, Tt: i, $t: r, zt: l, Dt: u, Et: f} = o || {};
  const [d, _] = createEventContentChange(t, debounce((() => {
    if (s) {
      e(true);
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
    each(s, (e => {
      const {attributeName: s, target: u, type: f, oldValue: _, addedNodes: v} = e;
      const b = "attributes" === f;
      const w = "childList" === f;
      const y = t === u;
      const m = b && isString(s) ? attr(u, s) : 0;
      const S = 0 !== m && _ !== m;
      const C = indexOf(h, s) > -1 && S;
      if (n && !y) {
        const n = !b;
        const r = b && C;
        const f = r && l && is(u, l);
        const d = f ? !c(u, s, _, m) : n || r;
        const h = d && !i(e, !!f, t, o);
        push(a, v);
        g = g || h;
        p = p || w;
      }
      if (!n && y && S && !c(u, s, _, m)) {
        push(r, s);
        d = d || C;
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

const et = `[${m}]`;

const ot = `.${I}`;

const st = [ "tabindex" ];

const ct = [ "wrap", "cols", "rows" ];

const it = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, e) => {
  let o;
  let s;
  let c;
  const [, i] = n;
  const {B: r, U: a, I: l, K: f, nt: d, et: _, ot: g} = t;
  const {$: h, M: p} = getEnvironment();
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
    const e = scrollSize(a);
    const o = fractionalSize(a);
    t && g(z, x, true);
    return {
      w: e.w + n.w + o.w,
      h: e.h + n.h + o.h
    };
  }));
  const b = f ? ct : it.concat(ct);
  const w = debounce(e, {
    g: () => o,
    p: () => s,
    v(t, n) {
      const [e] = t;
      const [o] = n;
      return [ keys(e).concat(keys(o)).reduce(((t, n) => {
        t[n] = e[n] || o[n];
        return t;
      }), {}) ];
    }
  });
  const updateViewportAttrsFromHost = t => {
    each(t || st, (t => {
      if (indexOf(st, t) > -1) {
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
    const [n, o] = t;
    i({
      st: n
    });
    e({
      ct: o
    });
  };
  const onSizeChanged = ({it: t, It: n, At: o}) => {
    const s = !t || o ? e : w;
    let c = false;
    if (n) {
      const [t, e] = n;
      c = e;
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
    const o = t ? e : w;
    if (n) {
      o({
        rt: true
      });
    }
  };
  const onHostMutation = (t, n) => {
    if (n) {
      w({
        wt: true
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
    Tt: it,
    Lt: it.concat(st)
  });
  const C = d && new u(onSizeChanged.bind(0, {
    it: true
  }));
  C && C.observe(r);
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
        Tt: b.concat(e || []),
        Lt: b.concat(e || []),
        $t: r,
        zt: et,
        Et: (t, n) => {
          const {target: e, attributeName: o} = t;
          const s = !n && o ? liesBetween(e, et, ot) : false;
          return s || !!ignoreMutationFromOptions(t);
        }
      });
    }
    if (d) {
      w.m();
      if (isArray(f)) {
        const t = f[0];
        const n = f[1];
        o = isNumber(t) ? t : false;
        s = isNumber(n) ? n : false;
      } else if (isNumber(f)) {
        o = f;
        s = false;
      } else {
        o = false;
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

const rt = {
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
  const e = createOptionCheck(n, {});
  const o = createState(rt);
  const [s, c, i] = createEventListenerHub();
  const [r] = o;
  const [a, l, u] = createStructureSetupElements(t);
  const f = createStructureSetupUpdate(a, o);
  const [d, _] = createStructureSetupObservers(a, o, (t => {
    i("u", [ f(e, t), {}, false ]);
  }));
  const g = r.bind(0);
  g.Pt = t => {
    s("u", t);
  };
  g.Mt = l;
  g.jt = a;
  return [ (t, e) => {
    const o = createOptionCheck(n, t, e);
    d(o);
    i("u", [ f(o, {}, e), t, !!e ]);
  }, g, () => {
    c();
    _();
    u();
  } ];
};

const generateScrollbarDOM = t => {
  const n = createDiv(`${j} ${t}`);
  const e = createDiv(H);
  const o = createDiv(F);
  appendChildren(n, e);
  appendChildren(e, o);
  return {
    Nt: n,
    Rt: e,
    Ht: o
  };
};

const createScrollbarsSetupElements = (t, n) => {
  const {N: e} = getEnvironment();
  const {Ft: o} = e();
  const {Y: s, B: c, U: i, tt: r} = n;
  const a = !r && t.scrollbarsSlot;
  const l = dynamicInitializationElement([ s, c, i ], (() => c), o, a);
  const u = generateScrollbarDOM(N);
  const f = generateScrollbarDOM(R);
  const {Nt: d} = u;
  const {Nt: _} = f;
  const appendElements = () => {
    appendChildren(l, d);
    appendChildren(l, _);
  };
  return [ {
    kt: u,
    Vt: f
  }, appendElements, removeElements.bind(0, [ d, _ ]) ];
};

const createScrollbarsSetup = (t, n, e) => {
  const o = createState({});
  const [s] = o;
  const [c, i, r] = createScrollbarsSetupElements(t, e);
  const a = s.bind(0);
  a.jt = c;
  a.Mt = i;
  return [ (t, e) => {
    const o = createOptionCheck(n, t, e);
    console.log(o);
  }, a, () => {
    r();
  } ];
};

const at = {};

const getPlugins = () => assignDeep({}, at);

const addPlugin = t => each(isArray(t) ? t : [ t ], (t => {
  at[t[0]] = t[1];
}));

const lt = {
  boolean: "__TPL_boolean_TYPE__",
  number: "__TPL_number_TYPE__",
  string: "__TPL_string_TYPE__",
  array: "__TPL_array_TYPE__",
  object: "__TPL_object_TYPE__",
  function: "__TPL_function_TYPE__",
  null: "__TPL_null_TYPE__"
};

const ut = lt.number;

const ft = lt.boolean;

const dt = [ lt.array, lt.null ];

const _t = "hidden scroll visible visible-hidden";

const gt = "visible hidden auto";

const ht = "never scroll leavemove";

({
  paddingAbsolute: ft,
  updating: {
    elementEvents: dt,
    attributes: dt,
    debounce: [ lt.number, lt.array, lt.null ],
    ignoreMutation: [ lt.function, lt.null ]
  },
  overflow: {
    x: _t,
    y: _t
  },
  scrollbars: {
    visibility: gt,
    autoHide: ht,
    autoHideDelay: ut,
    dragScroll: ft,
    clickScroll: ft,
    touch: ft
  },
  nativeScrollbarsOverlaid: {
    show: ft,
    initialize: ft
  }
});

const pt = "__osOptionsValidationPlugin";

const vt = new Set;

const bt = new WeakMap;

const addInstance = (t, n) => {
  bt.set(t, n);
  vt.add(t);
};

const removeInstance = t => {
  bt.delete(t);
  vt.delete(t);
};

const getInstance = t => bt.get(t);

const OverlayScrollbars = (t, n, e) => {
  let o = false;
  const {H: s, T: c, j: i} = getEnvironment();
  const r = getPlugins();
  const a = isHTMLElement(t) ? t : t.target;
  const l = getInstance(a);
  if (l) {
    return l;
  }
  const u = r[pt];
  const validateOptions = t => {
    const n = t || {};
    const e = u && u.Bt;
    return e ? e(n, true) : n;
  };
  const f = assignDeep({}, s(), validateOptions(n));
  const [d, _, g] = createEventListenerHub(e);
  const [h, p, v] = createStructureSetup(t, f);
  const [b, w, y] = createScrollbarsSetup(t, f, p.jt);
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
    o = true;
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
      const {yt: t, vt: n, St: e, A: s, ft: c} = p();
      return assignDeep({}, {
        overflowAmount: t,
        overflowStyle: n,
        hasOverflow: e,
        padding: s,
        paddingAbsolute: c,
        destroyed: o
      });
    },
    elements() {
      const {Y: t, B: n, A: e, U: o, I: s} = p.jt;
      return assignDeep({}, {
        target: t,
        host: n,
        padding: e || o,
        viewport: o,
        content: s || o
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
  p.Mt();
  w.Mt();
  addInstance(a, S);
  g("initialized", [ S ]);
  p.Pt(((t, n, e) => {
    const {it: o, ut: s, ct: c, xt: i, Ct: r, rt: a, wt: l} = t;
    g("updated", [ S, {
      updateHints: {
        sizeChanged: o,
        directionChanged: s,
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
  const {L: t, T: n, $: e, P: o, M: s, D: c, k: i, V: r, N: a, R: l, H: u, F: f} = getEnvironment();
  return assignDeep({}, {
    scrollbarSize: t,
    scrollbarIsOverlaid: n,
    scrollbarStyling: e,
    rtlScrollBehavior: o,
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
