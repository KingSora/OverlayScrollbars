function isNumber(obj) {
  return typeof obj === 'number';
}
function isString(obj) {
  return typeof obj === 'string';
}
function isFunction(obj) {
  return typeof obj === 'function';
}
function isUndefined(obj) {
  return obj === undefined;
}
function isArray(obj) {
  return Array.isArray(obj);
}
function isArrayLike(obj) {
  const length = !!obj && obj.length;
  return isArray(obj) || (!isFunction(obj) && isNumber(length) && length > -1 && length % 1 == 0);
}

function getSetProp(topLeft, fallback, elm, value) {
  if (isUndefined(value)) {
    return elm ? elm[topLeft] : fallback;
  }

  elm && (elm[topLeft] = value);
}
const removeAttr = (elm, attrName) => {
  elm == null ? void 0 : elm.removeAttribute(attrName);
};
function scrollLeft(elm, value) {
  return getSetProp('scrollLeft', 0, elm, value);
}

const rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

const classListAction = (elm, className, action) => {
  let clazz;
  let i = 0;
  let result = false;

  if (elm && isString(className)) {
    const classes = className.match(rnothtmlwhite) || [];
    result = classes.length > 0;

    while ((clazz = classes[i++])) {
      result = action(elm.classList, clazz) && result;
    }
  }

  return result;
};
const addClass = (elm, className) => {
  classListAction(elm, className, (classList, clazz) => classList.add(clazz));
};

const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const keys = (obj) => (obj ? Object.keys(obj) : []);

function each(source, callback) {
  if (isArrayLike(source)) {
    for (let i = 0; i < source.length; i++) {
      if (callback(source[i], i, source) === false) {
        break;
      }
    }
  } else if (source) {
    each(keys(source), (key) => callback(source[key], key, source));
  }

  return source;
}
const from = (arr) => {
  if (Array.from) {
    return Array.from(arr);
  }

  const result = [];
  each(arr, (elm) => {
    result.push(elm);
  });
  return result;
};

const contents = (elm) => (elm ? from(elm.childNodes) : []);

const before = (parentElm, preferredAnchor, insertedElms) => {
  if (insertedElms) {
    let anchor = preferredAnchor;
    let fragment;

    if (parentElm) {
      if (isArrayLike(insertedElms)) {
        fragment = document.createDocumentFragment();
        each(insertedElms, (insertedElm) => {
          if (insertedElm === anchor) {
            anchor = insertedElm.previousSibling;
          }

          fragment.appendChild(insertedElm);
        });
      } else {
        fragment = insertedElms;
      }

      if (preferredAnchor) {
        if (!anchor) {
          anchor = parentElm.firstChild;
        } else if (anchor !== preferredAnchor) {
          anchor = anchor.nextSibling;
        }
      }

      parentElm.insertBefore(fragment, anchor);
    }
  }
};

const appendChildren = (node, children) => {
  before(node, null, children);
};
const removeElements = (nodes) => {
  if (isArrayLike(nodes)) {
    each(from(nodes), (e) => removeElements(e));
  } else if (nodes) {
    const { parentNode } = nodes;

    if (parentNode) {
      parentNode.removeChild(nodes);
    }
  }
};

const createDiv = () => document.createElement('div');
const createDOM = (html) => {
  const createdDiv = createDiv();
  createdDiv.innerHTML = html.trim();
  return each(contents(createdDiv), (elm) => removeElements(elm));
};

const zeroObj = {
  w: 0,
  h: 0,
};
const windowSize = () => ({
  w: window.innerWidth,
  h: window.innerHeight,
});
const offsetSize = (elm) =>
  elm
    ? {
        w: elm.offsetWidth,
        h: elm.offsetHeight,
      }
    : zeroObj;
const clientSize = (elm) =>
  elm
    ? {
        w: elm.clientWidth,
        h: elm.clientHeight,
      }
    : zeroObj;
const getBoundingClientRect = (elm) => elm.getBoundingClientRect();

const cssNumber = {
  animationiterationcount: 1,
  columncount: 1,
  fillopacity: 1,
  flexgrow: 1,
  flexshrink: 1,
  fontweight: 1,
  lineheight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  widows: 1,
  zindex: 1,
  zoom: 1,
};

const adaptCSSVal = (prop, val) => (!cssNumber[prop.toLowerCase()] && isNumber(val) ? `${val}px` : val);

const getCSSVal = (elm, computedStyle, prop) => (computedStyle != null ? computedStyle.getPropertyValue(prop) : elm.style[prop]);

const setCSSVal = (elm, prop, val) => {
  try {
    if (elm && elm.style[prop] !== undefined) {
      elm.style[prop] = adaptCSSVal(prop, val);
    }
  } catch (e) {}
};

function style(elm, styles) {
  const getSingleStyle = isString(styles);
  const getStyles = isArray(styles) || getSingleStyle;

  if (getStyles) {
    let getStylesResult = getSingleStyle ? '' : {};

    if (elm) {
      const computedStyle = window.getComputedStyle(elm, null);
      getStylesResult = getSingleStyle
        ? getCSSVal(elm, computedStyle, styles)
        : styles.reduce((result, key) => {
            result[key] = getCSSVal(elm, computedStyle, key);
            return result;
          }, getStylesResult);
    }

    return getStylesResult;
  }

  each(keys(styles), (key) => setCSSVal(elm, key, styles[key]));
}

const zeroObj$1 = {
  x: 0,
  y: 0,
};
const offset = (elm) => {
  const rect = elm ? getBoundingClientRect(elm) : 0;
  return rect
    ? {
        x: rect.left + window.pageYOffset,
        y: rect.top + window.pageXOffset,
      }
    : zeroObj$1;
};

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError('attempted to get private field on non-instance');
  }

  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

var classPrivateFieldGet = _classPrivateFieldGet;

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = privateMap.get(receiver);

  if (!descriptor) {
    throw new TypeError('attempted to set private field on non-instance');
  }

  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError('attempted to set read only private field');
    }

    descriptor.value = value;
  }

  return value;
}

var classPrivateFieldSet = _classPrivateFieldSet;

const firstLetterToUpper = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const jsPrefixes = ['WebKit', 'Moz', 'O', 'MS', 'webkit', 'moz', 'o', 'ms'];
const jsCache = {};
const jsAPI = (name) => {
  let result = jsCache[name] || window[name];

  if (hasOwnProperty(jsCache, name)) {
    return result;
  }

  each(jsPrefixes, (prefix) => {
    result = result || window[prefix + firstLetterToUpper(name)];
    return !result;
  });
  jsCache[name] = result;
  return result;
};

const resizeObserver = jsAPI('ResizeObserver');

function createCommonjsModule(fn, basedir, module) {
  return (
    (module = {
      path: basedir,
      exports: {},
      require: function (path, base) {
        return commonjsRequire(path, base === undefined || base === null ? module.path : base);
      },
    }),
    fn(module, module.exports),
    module.exports
  );
}

function commonjsRequire() {
  throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var _extends_1 = createCommonjsModule(function (module) {
  function _extends() {
    module.exports = _extends =
      Object.assign ||
      function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

    return _extends.apply(this, arguments);
  }

  module.exports = _extends;
});

const templateTypePrefixSuffix = ['__TPL_', '_TYPE__'];
const optionsTemplateTypes = ['boolean', 'number', 'string', 'array', 'object', 'function', 'null'].reduce((result, item) => {
  result[item] = templateTypePrefixSuffix[0] + item + templateTypePrefixSuffix[1];
  return result;
}, {});

const { abs, round } = Math;

const nativeScrollbarSize = (body, measureElm) => {
  appendChildren(body, measureElm);
  const cSize = clientSize(measureElm);
  const oSize = offsetSize(measureElm);
  return {
    x: oSize.h - cSize.h,
    y: oSize.w - cSize.w,
  };
};

const nativeScrollbarStyling = (testElm) => {
  let result = false;
  addClass(testElm, 'os-viewport-native-scrollbars-invisible');

  try {
    result =
      style(testElm, 'scrollbar-width') === 'none' || window.getComputedStyle(testElm, '::-webkit-scrollbar').getPropertyValue('display') === 'none';
  } catch (ex) {}

  return result;
};

const rtlScrollBehavior = (parentElm, childElm) => {
  const strHidden = 'hidden';
  style(parentElm, {
    overflowX: strHidden,
    overflowY: strHidden,
  });
  scrollLeft(parentElm, 0);
  const parentOffset = offset(parentElm);
  const childOffset = offset(childElm);
  scrollLeft(parentElm, -999);
  const childOffsetAfterScroll = offset(childElm);
  return {
    i: parentOffset.x === childOffset.x,
    n: childOffset.x !== childOffsetAfterScroll.x,
  };
};

const passiveEvents = () => {
  let supportsPassive = false;

  try {
    window.addEventListener(
      'test',
      null,
      Object.defineProperty({}, 'passive', {
        get: function () {
          supportsPassive = true;
        },
      })
    );
  } catch (e) {}

  return supportsPassive;
};

const windowDPR = () => {
  const dDPI = window.screen.deviceXDPI || 0;
  const sDPI = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || dDPI / sDPI;
};

const diffBiggerThanOne = (valOne, valTwo) => {
  const absValOne = abs(valOne);
  const absValTwo = abs(valTwo);
  return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
};

var _onChangedListener = new WeakMap();

class Environment {
  constructor() {
    _onChangedListener.set(this, {
      writable: true,
      value: void 0,
    });

    classPrivateFieldSet(this, _onChangedListener, new Set());

    const _self = this;

    const { body } = document;
    const envDOM = createDOM('<div id="os-dummy-scrollbar-size"><div></div></div>');
    const envElm = envDOM[0];
    const envChildElm = envElm.firstChild;
    const nScrollBarSize = nativeScrollbarSize(body, envElm);
    const nativeScrollbarIsOverlaid = {
      x: nScrollBarSize.x === 0,
      y: nScrollBarSize.y === 0,
    };
    _self.autoUpdateLoop = false;
    _self.nativeScrollbarSize = nScrollBarSize;
    _self.nativeScrollbarIsOverlaid = nativeScrollbarIsOverlaid;
    _self.nativeScrollbarStyling = nativeScrollbarStyling(envElm);
    _self.rtlScrollBehavior = rtlScrollBehavior(envElm, envChildElm);
    _self.supportPassiveEvents = passiveEvents();
    _self.supportResizeObserver = !!jsAPI('ResizeObserver');
    removeAttr(envElm, 'style');
    removeElements(envElm);

    if (nativeScrollbarIsOverlaid.x && nativeScrollbarIsOverlaid.y) {
      let size = windowSize();
      let dpr = windowDPR();

      const onChangedListener = classPrivateFieldGet(this, _onChangedListener);

      window.addEventListener('resize', () => {
        if (onChangedListener.size) {
          const sizeNew = windowSize();
          const deltaSize = {
            w: sizeNew.w - size.w,
            h: sizeNew.h - size.h,
          };
          if (deltaSize.w === 0 && deltaSize.h === 0) return;
          const deltaAbsSize = {
            w: abs(deltaSize.w),
            h: abs(deltaSize.h),
          };
          const deltaAbsRatio = {
            w: abs(round(sizeNew.w / (size.w / 100.0))),
            h: abs(round(sizeNew.h / (size.h / 100.0))),
          };
          const dprNew = windowDPR();
          const deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
          const difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
          const dprChanged = dprNew !== dpr && dpr > 0;
          const isZoom = deltaIsBigger && difference && dprChanged;
          const oldScrollbarSize = _self.nativeScrollbarSize;
          let newScrollbarSize;

          if (isZoom) {
            newScrollbarSize = _self.nativeScrollbarSize = nativeScrollbarSize(body, envElm);
            removeElements(envElm);

            if (oldScrollbarSize.x !== newScrollbarSize.x || oldScrollbarSize.y !== newScrollbarSize.y) {
              onChangedListener.forEach((listener) => listener && listener(_self));
            }
          }

          size = sizeNew;
          dpr = dprNew;
        }
      });
    }
  }

  addListener(listener) {
    classPrivateFieldGet(this, _onChangedListener).add(listener);
  }

  removeListener(listener) {
    classPrivateFieldGet(this, _onChangedListener).delete(listener);
  }
}

var index = () => {
  return [
    new Environment(),
    createDOM(
      '\
    <div class="os-host">\
        <div class="os-resize-observer-host"></div>\
        <div class="os-padding">\
            <div class="os-viewport">\
                <div class="os-content">\
                    fdfhdfgh\
                </div>\
            </div>\
        </div>\
        <div class="os-scrollbar os-scrollbar-horizontal">\
            <div class="os-scrollbar-track">\
                <div class="os-scrollbar-handle"></div>\
            </div>\
        </div>\
        <div class="os-scrollbar os-scrollbar-vertical">\
            <div class="os-scrollbar-track">\
                <div class="os-scrollbar-handle"></div>\
            </div>\
        </div>\
        <div class="os-scrollbar-corner"></div>\
    </div>'
    ),
  ];
};

export default index;
//# sourceMappingURL=overlayscrollbars.esm.js.map
