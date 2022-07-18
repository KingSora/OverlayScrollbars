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

const g = window.clearTimeout;

const h = /[^\x20\t\r\n\f]+/g;

const classListAction = (t, n, o) => {
  const s = t && t.classList;
  let e;
  let c = 0;
  let r = false;
  if (s && n && isString(n)) {
    const t = n.match(h) || [];
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
    g(o);
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
      const h = n > 0 ? g : d;
      const v = mergeParms(t);
      const w = v || t;
      const p = a.bind(0, w);
      c();
      const b = u(p, n);
      c = () => h(b);
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

const C = `${x}-overflow-x`;

const $ = `${x}-overflow-y`;

const O = "overflowVisible";

const z = "viewportStyled";

const A = "os-padding";

const I = "os-viewport";

const T = `${I}-arrange`;

const E = "os-content";

const P = `${I}-scrollbar-styled`;

const L = `os-overflow-visible`;

const H = "os-size-observer";

const M = `${H}-appear`;

const R = `${H}-listener`;

const D = `${R}-scroll`;

const j = `${R}-item`;

const V = `${j}-final`;

const k = "os-trinsic-observer";

const B = "os-scrollbar";

const F = `${B}-horizontal`;

const Y = `${B}-vertical`;

const q = "os-scrollbar-track";

const G = "os-scrollbar-handle";

const N = `${B}-visible`;

const U = `${B}-cornerless`;

const W = `${B}-transitionless`;

const X = `${B}-interaction`;

const J = `${B}-auto-hidden`;

const opsStringify = t => JSON.stringify(t, ((t, n) => {
  if (isFunction(n)) {
    throw new Error;
  }
  return n;
}));

const K = {
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

var Q = {
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
})(Q);

const tt = getDefaultExportFromCjs(Q.exports);

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
    theme: [ nt.string, nt.null ],
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
    A: (t, n) => {
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
    A: (t, n, o) => {
      const s = createDOM(`<div class="${j}" dir="ltr"><div class="${j}"><div class="${V}"></div></div><div class="${j}"><div class="${V}" style="width: 200%; height: 200%"></div></div></div>`);
      appendChildren(t, s);
      addClass(t, D);
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
    I: t => {
      const {T: n, P: o, L: s} = t;
      const e = !s && !n && (o.x || o.y);
      const c = e ? document.createElement("style") : false;
      if (c) {
        attr(c, "id", `${T}-${ht}`);
        ht++;
      }
      return c;
    },
    H: (t, n, o, s, e, c, r) => {
      const arrangeViewport = (n, c, r, i) => {
        if (t) {
          const {M: t} = e();
          const {R: l, D: a} = n;
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
          const {M: u} = e();
          const {D: d} = a;
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
          const h = style(o, keys(g));
          removeClass(o, T);
          if (!n) {
            g.height = "";
          }
          style(o, g);
          return [ () => {
            r(a, i, t, h);
            style(o, h);
            addClass(o, T);
          }, a ];
        }
        return [ noop ];
      };
      return [ arrangeViewport, undoViewportArrange ];
    },
    j: () => {
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
    padding: !a,
    content: false
  };
  const f = assignDeep({}, K);
  const _ = {
    V: l,
    P: u,
    T: a,
    L: "-1" === style(o, "zIndex"),
    k: getRtlScrollBehavior(o, s),
    B: getFlexboxGlue(o, s),
    F: t => e("_", t),
    Y: assignDeep.bind(0, {}, d),
    q(t) {
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
      const n = getPlugins()[pt];
      t = t || n && n.j();
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

const staticInitializationElement = (t, n, o, s) => resolveInitialization(s || resolveInitialization(o, t), t) || n.apply(0, t);

const dynamicInitializationElement = (t, n, o, s) => {
  let e = resolveInitialization(s, t);
  if (isNull(e) || isUndefined(e)) {
    e = resolveInitialization(o, t);
  }
  return true === e || isNull(e) || isUndefined(e) ? n.apply(0, t) : e;
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
  const c = e && e.I;
  const {host: r, viewport: i, padding: l, content: a} = o();
  const d = isHTMLElement(t);
  const f = t;
  const _ = d ? t : f.target;
  const g = is(_, "textarea");
  const h = !g && is(_, "body");
  const v = _.ownerDocument;
  const w = v.body;
  const p = v.defaultView;
  const b = !!u && !g && s;
  const y = staticInitializationElement.bind(0, [ _ ]);
  const m = dynamicInitializationElement.bind(0, [ _ ]);
  const S = [ y(mt, i, f.viewport), y(mt, i), y(mt) ].filter((t => !b ? t !== _ : true))[0];
  const O = S === _;
  const z = {
    X: _,
    J: g ? y(mt, r, f.host) : _,
    K: S,
    Z: !O && m(mt, l, f.padding),
    tt: !O && m(mt, a, f.content),
    nt: !O && !s && c && c(n),
    ot: p,
    st: v,
    et: parent(w),
    ct: w,
    rt: g,
    it: h,
    lt: d,
    ut: O,
    dt: (t, n) => O ? hasAttrClass(S, x, n) : hasClass(S, t),
    ft: (t, n, o) => O ? attrClass(S, x, n, o) : (o ? addClass : removeClass)(S, t)
  };
  const T = keys(z).reduce(((t, n) => {
    const o = z[n];
    return push(t, o && !parent(o) ? o : false);
  }), []);
  const elementIsGenerated = t => t ? indexOf(T, t) > -1 : null;
  const {X: L, J: H, Z: M, K: R, tt: D, nt: j} = z;
  const V = [];
  const k = g && elementIsGenerated(H);
  const B = g ? L : contents([ D, R, M, H, L ].find((t => false === elementIsGenerated(t))));
  const F = D || R;
  const appendElements = () => {
    const t = addDataAttrHost(H, O ? "viewport" : "host");
    const n = addClass(M, A);
    const o = addClass(R, !O && I);
    const e = addClass(D, E);
    if (k) {
      insertAfter(L, H);
      push(V, (() => {
        insertAfter(H, L);
        removeElements(H);
      }));
    }
    appendChildren(F, B);
    appendChildren(H, M);
    appendChildren(M || H, !O && R);
    appendChildren(R, D);
    push(V, (() => {
      t();
      removeAttr(R, C);
      removeAttr(R, $);
      if (elementIsGenerated(D)) {
        unwrap(D);
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
    if (s && !O) {
      push(V, removeClass.bind(0, R, P));
    }
    if (j) {
      insertBefore(R, j);
      push(V, removeElements.bind(0, j));
    }
  };
  return [ z, appendElements, runEachAndClear.bind(0, V) ];
};

const createTrinsicUpdateSegment = (t, n) => {
  const {tt: o} = t;
  const [s] = n;
  return t => {
    const {B: n} = getEnvironment();
    const {_t: e} = s();
    const {gt: c} = t;
    const r = (o || !n) && c;
    if (r) {
      style(o, {
        height: e ? "" : "100%"
      });
    }
    return {
      ht: r,
      vt: r
    };
  };
};

const createPaddingUpdateSegment = (t, n) => {
  const [o, s] = n;
  const {J: e, Z: c, K: r, ut: i} = t;
  const [l, a] = createCache({
    _: equalTRBL,
    u: topRightBottomLeft()
  }, topRightBottomLeft.bind(0, e, "padding", ""));
  return (t, n, e) => {
    let [u, d] = a(e);
    const {T: f, B: _} = getEnvironment();
    const {wt: g} = o();
    const {ht: h, vt: v, bt: w} = t;
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
        Z: u,
        yt: !t,
        M: c ? i : assignDeep({}, e, i)
      });
    }
    return {
      St: m
    };
  };
};

const {max: St} = Math;

const xt = St.bind(0, 0);

const Ct = "visible";

const $t = "hidden";

const Ot = 42;

const zt = {
  _: equalWH,
  u: {
    w: 0,
    h: 0
  }
};

const At = {
  _: equalXY,
  u: {
    x: $t,
    y: $t
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

const overflowIsVisible = t => 0 === t.indexOf(Ct);

const createOverflowUpdateSegment = (t, n) => {
  const [o, s] = n;
  const {J: e, Z: c, K: r, nt: i, ut: l, ft: a} = t;
  const {V: u, B: d, T: f, P: _} = getEnvironment();
  const g = getPlugins()[pt];
  const h = !l && !f && (_.x || _.y);
  const [v, w] = createCache(zt, fractionalSize.bind(0, r));
  const [p, b] = createCache(zt, scrollSize.bind(0, r));
  const [y, m] = createCache(zt);
  const [S, A] = createCache(zt);
  const [I] = createCache(At);
  const fixFlexboxGlue = (t, n) => {
    style(r, {
      height: ""
    });
    if (n) {
      const {yt: n, Z: s} = o();
      const {xt: c, R: i} = t;
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
    const o = !f && !t ? Ot : 0;
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
      Ct: {
        x: s,
        y: l
      },
      xt: {
        x: e,
        y: a
      },
      R: {
        x: c,
        y: d
      },
      D: {
        x: i,
        y: g
      }
    };
  };
  const setViewportOverflowState = (t, n, o, s) => {
    const setAxisOverflowStyle = (t, n) => {
      const o = overflowIsVisible(t);
      const s = n && o && t.replace(`${Ct}-`, "") || "";
      return [ n && !o ? t : "", overflowIsVisible(s) ? "hidden" : s ];
    };
    const [e, c] = setAxisOverflowStyle(o.x, n.x);
    const [r, i] = setAxisOverflowStyle(o.y, n.y);
    s.overflowX = c && r ? c : e;
    s.overflowY = i && e ? i : r;
    return getViewportOverflowState(t, s);
  };
  const hideNativeScrollbars = (t, n, s, e) => {
    const {R: c, D: r} = t;
    const {x: i, y: l} = r;
    const {x: a, y: u} = c;
    const {M: d} = o();
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
  const [T, E] = g ? g.H(h, d, r, i, o, getViewportOverflowState, hideNativeScrollbars) : [ () => h, () => [ noop ] ];
  return (t, n, i) => {
    const {ht: u, $t: g, vt: h, St: H, gt: M, bt: R} = t;
    const {_t: D, wt: j} = o();
    const [V, k] = n("nativeScrollbarsOverlaid.show");
    const [B, F] = n("overflow");
    const Y = V && _.x && _.y;
    const q = !l && !d && (u || h || g || k || M);
    const G = overflowIsVisible(B.x);
    const N = overflowIsVisible(B.y);
    const U = G || N;
    let W = w(i);
    let X = b(i);
    let J = m(i);
    let K = A(i);
    let Z;
    if (k && f) {
      a(P, z, !Y);
    }
    if (q) {
      Z = getViewportOverflowState(Y);
      fixFlexboxGlue(Z, D);
    }
    if (u || H || h || R || k) {
      if (U) {
        a(L, O, false);
      }
      const [t, n] = E(Y, j, Z);
      const [o, s] = W = v(i);
      const [e, c] = X = p(i);
      const l = clientSize(r);
      let u = e;
      let d = l;
      t();
      if ((c || s || k) && n && !Y && T(n, e, o, j)) {
        d = clientSize(r);
        u = scrollSize(r);
      }
      const f = {
        w: xt(St(e.w, u.w) + o.w),
        h: xt(St(e.h, u.h) + o.h)
      };
      const _ = {
        w: xt(d.w + xt(l.w - e.w) + o.w),
        h: xt(d.h + xt(l.h - e.h) + o.h)
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
      const o = T(n, st, ct, j);
      if (!l) {
        hideNativeScrollbars(n, j, o, t);
      }
      if (q) {
        fixFlexboxGlue(n, D);
      }
      if (l) {
        attr(e, C, t.overflowX);
        attr(e, $, t.overflowY);
      } else {
        style(r, t);
      }
    }
    attrClass(e, x, O, lt);
    conditionalClass(c, L, lt);
    !l && conditionalClass(r, L, U);
    const [at, ut] = I(getViewportOverflowState(Y).Ct);
    s({
      Ct: at,
      Ot: {
        x: Q.w,
        y: Q.h
      },
      zt: {
        x: nt.w,
        y: nt.h
      },
      At: it
    });
    return {
      It: ut,
      Tt: tt,
      Et: ot
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
  const {T: s, P: e, B: c} = getEnvironment();
  const r = !s && (e.x || e.y);
  const i = [ createTrinsicUpdateSegment(t, n), createPaddingUpdateSegment(t, n), createOverflowUpdateSegment(t, n) ];
  return (t, n, s) => {
    const e = prepareUpdateHints(assignDeep({
      ht: false,
      St: false,
      bt: false,
      gt: false,
      Tt: false,
      Et: false,
      It: false,
      $t: false,
      vt: false
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

const It = 3333333;

const getElmDirectionIsRTL = t => "rtl" === style(t, "direction");

const domRectHasDimensions = t => t && (t.height || t.width);

const createSizeObserver = (t, n, o) => {
  const {Pt: s = false, Lt: e = false} = o || {};
  const c = getPlugins()[_t];
  const {k: r} = getEnvironment();
  const i = createDOM(`<div class="${H}"><div class="${R}"></div></div>`);
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
      scrollLeft(l, n ? r.n ? -It : r.i ? 0 : It : It);
      scrollTop(l, It);
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
  let g = e ? onSizeChangedCallbackProxy : false;
  let h;
  if (u) {
    const t = new u(onSizeChangedCallbackProxy);
    t.observe(a);
    push(_, (() => {
      t.disconnect();
    }));
  } else if (c) {
    const [t, n] = c.A(a, onSizeChangedCallbackProxy, e);
    g = t;
    push(_, n);
  }
  if (s) {
    h = createCache({
      u: !d()
    }, d);
    const [t] = h;
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
  if (g) {
    addClass(l, M);
    push(_, on(l, "animationstart", g, {
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
  let o;
  const s = createDiv(k);
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
  const {Mt: c, Rt: r, Dt: i, jt: a, Vt: u, kt: d} = s || {};
  const f = debounce((() => {
    if (e) {
      o(true);
    }
  }), {
    v: 33,
    p: 99
  });
  const [_, g] = createEventContentChange(t, f, i);
  const h = c || [];
  const v = r || [];
  const w = h.concat(v);
  const observerCallback = (e, c) => {
    const r = u || noop;
    const i = d || noop;
    const l = [];
    const f = [];
    let _ = false;
    let h = false;
    let w = false;
    each(e, (o => {
      const {attributeName: e, target: c, type: u, oldValue: d, addedNodes: g} = o;
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
        push(f, g);
        h = h || v;
        w = w || b;
      }
      if (!n && y && S && !r(c, e, d, m)) {
        push(l, e);
        _ = _ || x;
      }
    }));
    if (w && !isEmptyArray(f)) {
      g((t => f.reduce(((n, o) => {
        push(n, find(t, o));
        return is(o, t) ? push(n, o) : n;
      }), [])));
    }
    if (n) {
      !c && h && o(false);
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

const Tt = `[${x}]`;

const Et = `.${I}`;

const Pt = [ "tabindex" ];

const Lt = [ "wrap", "cols", "rows" ];

const Ht = [ "id", "class", "style", "open" ];

const createStructureSetupObservers = (t, n, o) => {
  let s;
  let e;
  let c;
  const [, r] = n;
  const {J: i, K: l, tt: a, rt: d, ut: f, dt: _, ft: g} = t;
  const {T: h, B: v} = getEnvironment();
  const [w] = createCache({
    _: equalWH,
    u: {
      w: 0,
      h: 0
    }
  }, (() => {
    const t = _(L, O);
    const n = _(T, "");
    const o = n && scrollLeft(l);
    const s = n && scrollTop(l);
    g(L, O);
    g(T, "");
    const e = scrollSize(a);
    const c = scrollSize(l);
    const r = fractionalSize(l);
    g(L, O, t);
    g(T, "", n);
    scrollLeft(l, o);
    scrollTop(l, s);
    return {
      w: c.w + e.w + r.w,
      h: c.h + e.h + r.h
    };
  }));
  const p = d ? Lt : Ht.concat(Lt);
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
    each(t || Pt, (t => {
      if (indexOf(Pt, t) > -1) {
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
      gt: e
    };
    r({
      _t: s
    });
    !n && o(c);
    return c;
  };
  const onSizeChanged = ({ht: t, Ht: n, Lt: s}) => {
    const e = !t || s ? o : b;
    let c = false;
    if (n) {
      const [t, o] = n;
      c = o;
      r({
        wt: t
      });
    }
    e({
      ht: t,
      bt: c
    });
  };
  const onContentMutation = (t, n) => {
    const [, s] = w();
    const e = {
      vt: s
    };
    const c = t ? o : b;
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
      !o && b(s);
    } else if (!f) {
      updateViewportAttrsFromHost(t);
    }
    return s;
  };
  const y = (a || !v) && createTrinsicObserver(i, onTrinsicChanged);
  const m = !f && createSizeObserver(i, onSizeChanged, {
    Lt: true,
    Pt: !h
  });
  const [S, x] = createDOMObserver(i, false, onHostMutation, {
    Rt: Ht,
    Mt: Ht.concat(Pt)
  });
  const C = f && new u(onSizeChanged.bind(0, {
    ht: true
  }));
  C && C.observe(i);
  updateViewportAttrsFromHost();
  return [ () => {
    c && c[0]();
    y && y[0]();
    m && m();
    C && C.disconnect();
    S();
  }, () => {
    const t = {};
    const n = x();
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
        Rt: p.concat(o || []),
        Mt: p.concat(o || []),
        Dt: i,
        jt: Tt,
        kt: (t, n) => {
          const {target: o, attributeName: s} = t;
          const e = !n && s ? liesBetween(o, Tt, Et) : false;
          return e || !!closest(o, `.${B}`) || !!ignoreMutationFromOptions(t);
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
  } ];
};

const Mt = {
  x: 0,
  y: 0
};

const Rt = {
  Z: {
    t: 0,
    r: 0,
    b: 0,
    l: 0
  },
  yt: false,
  M: {
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0
  },
  Ot: Mt,
  zt: Mt,
  Ct: {
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
  const s = createState(Rt);
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
  const [f, _, g] = createStructureSetupObservers(l, s, (t => {
    triggerUpdateEvent(d(o, t), {}, false);
  }));
  const h = i.bind(0);
  h.Bt = t => {
    e("u", t);
  };
  h.Ft = a;
  h.Yt = l;
  return [ (t, o) => {
    const s = createOptionCheck(n, t, o);
    g(s);
    triggerUpdateEvent(d(s, _(), o), t, !!o);
  }, h, () => {
    c();
    f();
    u();
  } ];
};

const Dt = "touchstart mouseenter";

const jt = "touchend touchcancel mouseleave";

const stopRootClickPropagation = (t, n) => on(t, "mousedown", on.bind(0, n, "click", stopPropagation, {
  O: true,
  $: true
}), {
  $: true
});

const createScrollbarsSetupElements = (t, n) => {
  const {Y: o} = getEnvironment();
  const {scrollbarsSlot: s} = o();
  const {st: e, X: c, J: r, K: i, lt: l} = n;
  const a = l ? null : t.scrollbarsSlot;
  const u = dynamicInitializationElement([ c, r, i ], (() => r), s, a);
  const scrollbarsAddRemoveClass = (t, n, o, s) => {
    const e = o ? addClass : removeClass;
    each(t, (t => {
      e((s || noop)(t) || t.qt, n);
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
  const g = [];
  const h = scrollbarsAddRemoveClass.bind(0, f);
  const v = scrollbarsAddRemoveClass.bind(0, g);
  const generateScrollbarDOM = t => {
    const n = t ? F : Y;
    const o = t ? f : g;
    const s = isEmptyArray(o) ? W : "";
    const c = createDiv(`${B} ${n} ${s}`);
    const r = createDiv(q);
    const i = createDiv(G);
    const l = {
      qt: c,
      Gt: r,
      Nt: i
    };
    appendChildren(c, r);
    appendChildren(r, i);
    push(o, l);
    push(d, [ removeElements.bind(0, c), on(c, Dt, (() => {
      h(X, true);
      v(X, true);
    })), on(c, jt, (() => {
      h(X);
      v(X);
    })), stopRootClickPropagation(c, e) ]);
    return l;
  };
  const w = generateScrollbarDOM.bind(0, true);
  const p = generateScrollbarDOM.bind(0, false);
  const appendElements = () => {
    appendChildren(u, f[0].qt);
    appendChildren(u, g[0].qt);
    _((() => {
      h(W);
      v(W);
    }), 300);
  };
  w();
  p();
  return [ {
    Ut: {
      Wt: f,
      Xt: w,
      Jt: h,
      Kt: scrollbarsHandleStyle.bind(0, f)
    },
    Zt: {
      Wt: g,
      Xt: p,
      Jt: v,
      Kt: scrollbarsHandleStyle.bind(0, g)
    }
  }, appendElements, runEachAndClear.bind(0, d) ];
};

const {min: Vt} = Math;

const createSelfCancelTimeout = t => {
  let n;
  const o = t ? _ : f;
  const s = t ? g : d;
  return [ e => {
    s(n);
    n = o(e, isFunction(t) ? t() : t);
  }, () => s(n) ];
};

const refreshScrollbarHandleLength = (t, n, o) => {
  const {zt: s, Ot: e} = n;
  const c = o ? "x" : "y";
  const r = e[c];
  const i = s[c];
  const l = Vt(1, r / (r + i));
  t((t => [ t.Nt, {
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
  const [_, g] = createSelfCancelTimeout();
  const [h, v] = createSelfCancelTimeout(100);
  const [w, p] = createSelfCancelTimeout(100);
  const [b, y] = createSelfCancelTimeout((() => l));
  const [m, S, x] = createScrollbarsSetupElements(t, o.Yt);
  const {J: C, K: $} = o.Yt;
  const {Ut: O, Zt: z} = m;
  const {Jt: A, Kt: I} = O;
  const {Jt: T, Kt: E} = z;
  const manageScrollbarsAutoHide = (t, n) => {
    y();
    if (t) {
      A(J);
      T(J);
    } else {
      const hide = () => {
        A(J, true);
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
  const P = [ v, y, p, g, f, x, on(C, "mouseover", onHostMouseEnter, {
    O: true
  }), on(C, "mouseenter", onHostMouseEnter), on(C, "mouseleave", (() => {
    r = false;
    e && manageScrollbarsAutoHide(false);
  })), on(C, "mousemove", (() => {
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
      h((() => {
        c && !r && manageScrollbarsAutoHide(false);
      }));
    }));
  })) ];
  const L = u.bind(0);
  L.Yt = m;
  L.Ft = S;
  return [ (t, r, a) => {
    const {Tt: u, Et: d, It: f} = a;
    const _ = createOptionCheck(n, t, r);
    const g = o();
    const [h, v] = _("scrollbars.theme");
    const [w, p] = _("scrollbars.visibility");
    const [b, y] = _("scrollbars.autoHide");
    const [m] = _("scrollbars.autoHideDelay");
    _("scrollbars.dragScrolling");
    _("scrollbars.touchSupport");
    const S = u || d;
    const x = f || p;
    const setScrollbarVisibility = (t, n) => {
      const o = "visible" === w || "auto" === w && "scroll" === t;
      n(N, o);
      return o;
    };
    l = m;
    if (x) {
      const {Ct: t} = g;
      const n = setScrollbarVisibility(t.x, A);
      const o = setScrollbarVisibility(t.y, T);
      const s = n && o;
      A(U, !s);
      T(U, !s);
    }
    if (v) {
      A(i);
      T(i);
      A(h, true);
      T(h, true);
      i = h;
    }
    if (y) {
      s = "move" === b;
      e = "leave" === b;
      c = "never" !== b;
      manageScrollbarsAutoHide(!c, true);
    }
    if (S) {
      refreshScrollbarHandleLength(I, g, true);
      refreshScrollbarHandleLength(E, g);
    }
  }, L, runEachAndClear.bind(0, P) ];
};

const kt = new Set;

const Bt = new WeakMap;

const addInstance = (t, n) => {
  Bt.set(t, n);
  kt.add(t);
};

const removeInstance = t => {
  Bt.delete(t);
  kt.delete(t);
};

const getInstance = t => Bt.get(t);

const OverlayScrollbars = (t, n, o) => {
  let s = false;
  const {G: e, P: c, F: r} = getEnvironment();
  const i = getPlugins();
  const l = isHTMLElement(t) ? t : t.target;
  const a = getInstance(l);
  if (a) {
    return a;
  }
  const u = i[at];
  const validateOptions = t => {
    const n = t || {};
    const o = u && u.A;
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
      const {Ot: t, zt: n, Ct: o, At: e, Z: c, yt: r} = v();
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
      const {X: t, J: n, Z: o, K: s, tt: e} = v.Yt;
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
  v.Bt(((t, n, o) => {
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
  v.Ft();
  b.Ft();
  addInstance(l, S);
  g("initialized", [ S ]);
  v.Bt(((t, n, o) => {
    const {ht: s, bt: e, gt: c, Tt: r, Et: i, It: l, vt: a, $t: u} = t;
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
  const {V: t, P: n, T: o, k: s, B: e, L: c, U: r, W: i, Y: l, q: a, G: u, N: d} = getEnvironment();
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

export { OverlayScrollbars, ut as optionsValidationPlugin, bt as scrollbarsHidingPlugin, gt as sizeObserverPlugin };
//# sourceMappingURL=overlayscrollbars.esm.js.map
