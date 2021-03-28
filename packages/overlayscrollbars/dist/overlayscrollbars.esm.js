const ElementNodeType = Node.ELEMENT_NODE;
const { toString, hasOwnProperty } = Object.prototype;
function isUndefined(obj) {
  return obj === undefined;
}
function isNull(obj) {
  return obj === null;
}
const type = (obj) => {
  return isUndefined(obj) || isNull(obj)
    ? `${obj}`
    : toString
        .call(obj)
        .replace(/^\[object (.+)\]$/, '$1')
        .toLowerCase();
};
function isNumber(obj) {
  return typeof obj === 'number';
}
function isString(obj) {
  return typeof obj === 'string';
}
function isBoolean(obj) {
  return typeof obj === 'boolean';
}
function isFunction(obj) {
  return typeof obj === 'function';
}
function isArray(obj) {
  return Array.isArray(obj);
}
function isObject(obj) {
  return typeof obj === 'object' && !isArray(obj) && !isNull(obj);
}
function isArrayLike(obj) {
  const length = !!obj && obj.length;
  const lengthCorrectFormat = isNumber(length) && length > -1 && length % 1 == 0;
  return isArray(obj) || (!isFunction(obj) && lengthCorrectFormat) ? (length > 0 && isObject(obj) ? length - 1 in obj : true) : false;
}
function isPlainObject(obj) {
  if (!obj || !isObject(obj) || type(obj) !== 'object') return false;
  let key;
  const cstr = 'constructor';
  const ctor = obj[cstr];
  const ctorProto = ctor && ctor.prototype;
  const hasOwnConstructor = hasOwnProperty.call(obj, cstr);
  const hasIsPrototypeOf = ctorProto && hasOwnProperty.call(ctorProto, 'isPrototypeOf');

  if (ctor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  for (key in obj) {
  }

  return isUndefined(key) || hasOwnProperty.call(obj, key);
}
function isHTMLElement(obj) {
  const instanceofObj = window.HTMLElement;
  return obj ? (instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType) : false;
}
function isElement(obj) {
  const instanceofObj = window.Element;
  return obj ? (instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType) : false;
}

function getSetProp(topLeft, fallback, elm, value) {
  if (isUndefined(value)) {
    return elm ? elm[topLeft] : fallback;
  }

  elm && (elm[topLeft] = value);
}

function attr(elm, attrName, value) {
  if (isUndefined(value)) {
    return elm ? elm.getAttribute(attrName) : null;
  }

  elm && elm.setAttribute(attrName, value);
}
const removeAttr = (elm, attrName) => {
  elm && elm.removeAttribute(attrName);
};
function scrollLeft(elm, value) {
  return getSetProp('scrollLeft', 0, elm, value);
}
function scrollTop(elm, value) {
  return getSetProp('scrollTop', 0, elm, value);
}

function each(source, callback) {
  if (isArrayLike(source)) {
    for (let i = 0; i < source.length; i++) {
      if (callback(source[i], i, source) === false) {
        break;
      }
    }
  } else if (source) {
    each(Object.keys(source), (key) => callback(source[key], key, source));
  }

  return source;
}
const indexOf = (arr, item, fromIndex) => arr.indexOf(item, fromIndex);
const push = (array, items, arrayIsSingleItem) => {
  !arrayIsSingleItem && !isString(items) && isArrayLike(items) ? Array.prototype.push.apply(array, items) : array.push(items);
  return array;
};
const from = (arr) => {
  if (Array.from) {
    return Array.from(arr);
  }

  const result = [];
  each(arr, (elm) => {
    push(result, elm);
  });
  return result;
};
const isEmptyArray = (array) => array && array.length === 0;
const runEach = (arr, p1) => {
  const runFn = (fn) => fn && fn(p1);

  if (arr instanceof Set) {
    arr.forEach(runFn);
  } else {
    each(arr, runFn);
  }
};

const hasOwnProperty$1 = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const keys = (obj) => (obj ? Object.keys(obj) : []);
function assignDeep(target, object1, object2, object3, object4, object5, object6) {
  const sources = [object1, object2, object3, object4, object5, object6];

  if ((typeof target !== 'object' || isNull(target)) && !isFunction(target)) {
    target = {};
  }

  each(sources, (source) => {
    each(keys(source), (key) => {
      const copy = source[key];

      if (target === copy) {
        return true;
      }

      const copyIsArray = isArray(copy);

      if (copy && (isPlainObject(copy) || copyIsArray)) {
        const src = target[key];
        let clone = src;

        if (copyIsArray && !isArray(src)) {
          clone = [];
        } else if (!copyIsArray && !isPlainObject(src)) {
          clone = {};
        }

        target[key] = assignDeep(clone, copy);
      } else {
        target[key] = copy;
      }
    });
  });
  return target;
}
function isEmptyObject(obj) {
  for (const name in obj) return false;

  return true;
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
      result = !!action(elm.classList, clazz) && result;
    }
  }

  return result;
};
const addClass = (elm, className) => {
  classListAction(elm, className, (classList, clazz) => classList.add(clazz));
};
const removeClass = (elm, className) => {
  classListAction(elm, className, (classList, clazz) => classList.remove(clazz));
};

const elmPrototype = Element.prototype;

const find = (selector, elm) => {
  const arr = [];
  const rootElm = elm ? (isElement(elm) ? elm : null) : document;
  return rootElm ? push(arr, rootElm.querySelectorAll(selector)) : arr;
};

const is = (elm, selector) => {
  if (isElement(elm)) {
    const fn = elmPrototype.matches || elmPrototype.msMatchesSelector;
    return fn.call(elm, selector);
  }

  return false;
};

const contents = (elm) => (elm ? from(elm.childNodes) : []);

const parent = (elm) => (elm ? elm.parentElement : null);

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

      parentElm.insertBefore(fragment, anchor || null);
    }
  }
};

const appendChildren = (node, children) => {
  before(node, null, children);
};
const prependChildren = (node, children) => {
  before(node, node && node.firstChild, children);
};
const insertAfter = (node, insertedNodes) => {
  before(parent(node), node && node.nextSibling, insertedNodes);
};
const removeElements = (nodes) => {
  if (isArrayLike(nodes)) {
    each(from(nodes), (e) => removeElements(e));
  } else if (nodes) {
    const parentElm = parent(nodes);

    if (parentElm) {
      parentElm.removeChild(nodes);
    }
  }
};

const createDiv = (classNames) => {
  const div = document.createElement('div');

  if (classNames) {
    attr(div, 'class', classNames);
  }

  return div;
};
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
const scrollSize = (elm) =>
  elm
    ? {
        w: elm.scrollWidth,
        h: elm.scrollHeight,
      }
    : zeroObj;
const getBoundingClientRect = (elm) => elm.getBoundingClientRect();

let passiveEventsSupport;

const supportPassiveEvents = () => {
  if (isUndefined(passiveEventsSupport)) {
    passiveEventsSupport = false;

    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: function () {
            passiveEventsSupport = true;
          },
        })
      );
    } catch (e) {}
  }

  return passiveEventsSupport;
};

const splitEventNames = (eventNames) => eventNames.split(' ');

const off = (target, eventNames, listener, capture) => {
  each(splitEventNames(eventNames), (eventName) => {
    target.removeEventListener(eventName, listener, capture);
  });
};
const on = (target, eventNames, listener, options) => {
  const doSupportPassiveEvents = supportPassiveEvents();
  const passive = (doSupportPassiveEvents && options && options._passive) || false;
  const capture = (options && options._capture) || false;
  const once = (options && options._once) || false;
  const offListeners = [];
  const nativeOptions = doSupportPassiveEvents
    ? {
        passive,
        capture,
      }
    : capture;
  each(splitEventNames(eventNames), (eventName) => {
    const finalListener = once
      ? (evt) => {
          target.removeEventListener(eventName, finalListener, capture);
          listener && listener(evt);
        }
      : listener;
    push(offListeners, off.bind(null, target, eventName, finalListener, capture));
    target.addEventListener(eventName, finalListener, nativeOptions);
  });
  return runEach.bind(0, offListeners);
};
const stopPropagation = (evt) => evt.stopPropagation();
const preventDefault = (evt) => evt.preventDefault();

const equal = (a, b, props) => {
  if (a && b) {
    let result = true;
    each(props, (prop) => {
      if (a[prop] !== b[prop]) {
        result = false;
      }
    });
    return result;
  }

  return false;
};
const equalWH = (a, b) => equal(a, b, ['w', 'h']);
const equalXY = (a, b) => equal(a, b, ['x', 'y']);

const firstLetterToUpper = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const jsPrefixes = ['WebKit', 'Moz', 'O', 'MS', 'webkit', 'moz', 'o', 'ms'];
const jsCache = {};
const jsAPI = (name) => {
  let result = jsCache[name] || window[name];

  if (hasOwnProperty$1(jsCache, name)) {
    return result;
  }

  each(jsPrefixes, (prefix) => {
    result = result || window[prefix + firstLetterToUpper(name)];
    return !result;
  });
  jsCache[name] = result;
  return result;
};

const MutationObserverConstructor = jsAPI('MutationObserver');
const IntersectionObserverConstructor = jsAPI('IntersectionObserver');
const ResizeObserverConstructor = jsAPI('ResizeObserver');
const cAF = jsAPI('cancelAnimationFrame');
const rAF = jsAPI('requestAnimationFrame');

const noop = () => {};
const debounce = (functionToDebounce, timeout, maxWait) => {
  let timeoutId;
  let lastCallTime;
  const hasTimeout = isNumber(timeout) && timeout > 0;
  const hasMaxWait = isNumber(maxWait) && maxWait > 0;
  const cancel = hasTimeout ? window.clearTimeout : cAF;
  const set = hasTimeout ? window.setTimeout : rAF;

  const setFn = function setFn(args) {
    lastCallTime = hasMaxWait ? performance.now() : 0;
    timeoutId && cancel(timeoutId);
    functionToDebounce.apply(this, args);
  };

  return function () {
    const boundSetFn = setFn.bind(this, arguments);
    const forceCall = hasMaxWait ? performance.now() - lastCallTime >= maxWait : false;
    timeoutId && cancel(timeoutId);
    timeoutId = forceCall ? boundSetFn() : set(boundSetFn, timeout);
  };
};

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
const absoluteCoordinates = (elm) => {
  const rect = elm ? getBoundingClientRect(elm) : 0;
  return rect
    ? {
        x: rect.left + window.pageYOffset,
        y: rect.top + window.pageXOffset,
      }
    : zeroObj$1;
};

const createCache = (update, options) => {
  const { _equal, _initialValue, _alwaysUpdateValues } = options || {};
  let _value = _initialValue;

  let _previous;

  const cacheUpdate = (force, context) => {
    const curr = _value;
    const newVal = update ? update(context, _value, _previous) : context;
    const changed = force || (_equal ? !_equal(curr, newVal) : curr !== newVal);

    if (changed || _alwaysUpdateValues) {
      _value = newVal;
      _previous = curr;
    }

    return {
      _value,
      _previous,
      _changed: changed,
    };
  };

  return {
    _update: cacheUpdate,
    _current: (force) => ({
      _value,
      _previous,
      _changed: !!force,
    }),
  };
};

function createCommonjsModule(fn) {
  var module = { exports: {} };
  return fn(module, module.exports), module.exports;
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

const { stringify } = JSON;
const templateTypePrefixSuffix = ['__TPL_', '_TYPE__'];
const optionsTemplateTypes = ['boolean', 'number', 'string', 'array', 'object', 'function', 'null'].reduce((result, item) => {
  result[item] = templateTypePrefixSuffix[0] + item + templateTypePrefixSuffix[1];
  return result;
}, {});

const validateRecursive = (options, template, optionsDiff, doWriteErrors, propPath) => {
  const validatedOptions = {};

  const optionsCopy = _extends_1({}, options);

  const props = keys(template).filter((prop) => hasOwnProperty$1(options, prop));
  each(props, (prop) => {
    const optionsDiffValue = isUndefined(optionsDiff[prop]) ? {} : optionsDiff[prop];
    const optionsValue = options[prop];
    const templateValue = template[prop];
    const templateIsComplex = isPlainObject(templateValue);
    const propPrefix = propPath ? `${propPath}.` : '';

    if (templateIsComplex && isPlainObject(optionsValue)) {
      const validatedResult = validateRecursive(optionsValue, templateValue, optionsDiffValue, doWriteErrors, propPrefix + prop);
      validatedOptions[prop] = validatedResult._validated;
      optionsCopy[prop] = validatedResult._foreign;
      each([optionsCopy, validatedOptions], (value) => {
        if (isEmptyObject(value[prop])) {
          delete value[prop];
        }
      });
    } else if (!templateIsComplex) {
      let isValid = false;
      const errorEnumStrings = [];
      const errorPossibleTypes = [];
      const optionsValueType = type(optionsValue);
      const templateValueArr = !isArray(templateValue) ? [templateValue] : templateValue;
      each(templateValueArr, (currTemplateType) => {
        let typeString;
        each(optionsTemplateTypes, (value, key) => {
          if (value === currTemplateType) {
            typeString = key;
          }
        });
        const isEnumString = isUndefined(typeString);

        if (isEnumString && isString(optionsValue)) {
          const enumStringSplit = currTemplateType.split(' ');
          isValid = !!enumStringSplit.find((possibility) => possibility === optionsValue);
          push(errorEnumStrings, enumStringSplit);
        } else {
          isValid = optionsTemplateTypes[optionsValueType] === currTemplateType;
        }

        push(errorPossibleTypes, isEnumString ? optionsTemplateTypes.string : typeString);
        return !isValid;
      });

      if (isValid) {
        const doStringifyComparison = isArray(optionsValue) || isPlainObject(optionsValue);

        if (doStringifyComparison ? stringify(optionsValue) !== stringify(optionsDiffValue) : optionsValue !== optionsDiffValue) {
          validatedOptions[prop] = optionsValue;
        }
      } else if (doWriteErrors) {
        console.warn(
          `${
            `The option "${propPrefix}${prop}" wasn't set, because it doesn't accept the type [ ${optionsValueType.toUpperCase()} ] with the value of "${optionsValue}".\r\n` +
            `Accepted types are: [ ${errorPossibleTypes.join(', ').toUpperCase()} ].\r\n`
          }${errorEnumStrings.length > 0 ? `\r\nValid strings are: [ ${errorEnumStrings.join(', ')} ].` : ''}`
        );
      }

      delete optionsCopy[prop];
    }
  });
  return {
    _foreign: optionsCopy,
    _validated: validatedOptions,
  };
};

const validateOptions = (options, template, optionsDiff, doWriteErrors) => {
  return validateRecursive(options, template, optionsDiff || {}, doWriteErrors || false);
};

function transformOptions(optionsWithOptionsTemplate) {
  const result = {
    _template: {},
    _options: {},
  };
  each(keys(optionsWithOptionsTemplate), (key) => {
    const val = optionsWithOptionsTemplate[key];

    if (isArray(val)) {
      result._template[key] = val[1];
      result._options[key] = val[0];
    } else {
      const tmpResult = transformOptions(val);
      result._template[key] = tmpResult._template;
      result._options[key] = tmpResult._options;
    }
  });
  return result;
}

const classNameEnvironment = 'os-environment';
const classNameEnvironmentFlexboxGlue = `${classNameEnvironment}-flexbox-glue`;
const classNameEnvironmentFlexboxGlueMax = `${classNameEnvironmentFlexboxGlue}-max`;
const classNameHost = 'os-host';
const classNamePadding = 'os-padding';
const classNameViewport = 'os-viewport';
const classNameContent = 'os-content';
const classNameContentArrange = `${classNameContent}-arrange`;
const classNameViewportScrollbarStyling = `${classNameViewport}-scrollbar-styled`;
const classNameSizeObserver = 'os-size-observer';
const classNameSizeObserverAppear = `${classNameSizeObserver}-appear`;
const classNameSizeObserverListener = `${classNameSizeObserver}-listener`;
const classNameSizeObserverListenerScroll = `${classNameSizeObserverListener}-scroll`;
const classNameSizeObserverListenerItem = `${classNameSizeObserverListener}-item`;
const classNameSizeObserverListenerItemFinal = `${classNameSizeObserverListenerItem}-final`;
const classNameTrinsicObserver = 'os-trinsic-observer';

let environmentInstance;
const { abs, round } = Math;

const getNativeScrollbarSize = (body, measureElm) => {
  appendChildren(body, measureElm);
  const cSize = clientSize(measureElm);
  const oSize = offsetSize(measureElm);
  return {
    x: oSize.h - cSize.h,
    y: oSize.w - cSize.w,
  };
};

const getRtlScrollBehavior = (parentElm, childElm) => {
  const strHidden = 'hidden';
  style(parentElm, {
    overflowX: strHidden,
    overflowY: strHidden,
    direction: 'rtl',
  });
  scrollLeft(parentElm, 0);
  const parentOffset = absoluteCoordinates(parentElm);
  const childOffset = absoluteCoordinates(childElm);
  scrollLeft(parentElm, -999);
  const childOffsetAfterScroll = absoluteCoordinates(childElm);
  return {
    i: parentOffset.x === childOffset.x,
    n: childOffset.x !== childOffsetAfterScroll.x,
  };
};

const getFlexboxGlue = (parentElm, childElm) => {
  addClass(parentElm, classNameEnvironmentFlexboxGlue);
  const minOffsetsizeParent = offsetSize(parentElm);
  const minOffsetsize = offsetSize(childElm);
  const supportsMin = equalWH(minOffsetsize, minOffsetsizeParent);
  addClass(parentElm, classNameEnvironmentFlexboxGlueMax);
  const maxOffsetsizeParent = offsetSize(parentElm);
  const maxOffsetsize = offsetSize(childElm);
  const supportsMax = equalWH(maxOffsetsize, maxOffsetsizeParent);
  return supportsMin && supportsMax;
};

const getWindowDPR = () => {
  const dDPI = window.screen.deviceXDPI || 0;
  const sDPI = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || dDPI / sDPI;
};

const diffBiggerThanOne = (valOne, valTwo) => {
  const absValOne = abs(valOne);
  const absValTwo = abs(valTwo);
  return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
};

const createEnvironment = () => {
  const { body } = document;
  const envDOM = createDOM(`<div class="${classNameEnvironment}"><div></div></div>`);
  const envElm = envDOM[0];
  const envChildElm = envElm.firstChild;
  const onChangedListener = new Set();
  const nativeScrollbarSize = getNativeScrollbarSize(body, envElm);
  const nativeScrollbarStyling = false;
  const nativeScrollbarIsOverlaid = {
    x: nativeScrollbarSize.x === 0,
    y: nativeScrollbarSize.y === 0,
  };
  const env = {
    _autoUpdateLoop: false,
    _nativeScrollbarSize: nativeScrollbarSize,
    _nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
    _nativeScrollbarStyling: nativeScrollbarStyling,
    _rtlScrollBehavior: getRtlScrollBehavior(envElm, envChildElm),
    _flexboxGlue: getFlexboxGlue(envElm, envChildElm),

    _addListener(listener) {
      onChangedListener.add(listener);
    },

    _removeListener(listener) {
      onChangedListener.delete(listener);
    },
  };
  removeAttr(envElm, 'style');
  removeElements(envElm);

  if (!nativeScrollbarIsOverlaid.x || !nativeScrollbarIsOverlaid.y) {
    let size = windowSize();
    let dpr = getWindowDPR();
    let scrollbarSize = nativeScrollbarSize;
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
        const dprNew = getWindowDPR();
        const deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
        const difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
        const dprChanged = dprNew !== dpr && dpr > 0;
        const isZoom = deltaIsBigger && difference && dprChanged;

        if (isZoom) {
          const newScrollbarSize = (environmentInstance._nativeScrollbarSize = getNativeScrollbarSize(body, envElm));
          removeElements(envElm);

          if (scrollbarSize.x !== newScrollbarSize.x || scrollbarSize.y !== newScrollbarSize.y) {
            runEach(onChangedListener);
          }

          scrollbarSize = newScrollbarSize;
        }

        size = sizeNew;
        dpr = dprNew;
      }
    });
  }

  return env;
};

const getEnvironment = () => {
  if (!environmentInstance) {
    environmentInstance = createEnvironment();
  }

  return environmentInstance;
};

const unwrap = (elm) => {
  appendChildren(parent(elm), contents(elm));
  removeElements(elm);
};

const createStructureSetup = (target) => {
  const targetIsElm = isHTMLElement(target);
  const osTargetObj = targetIsElm
    ? {}
    : {
        _host: target.host,
        _target: target.target,
        _padding: target.padding,
        _viewport: target.viewport,
        _content: target.content,
      };

  if (targetIsElm) {
    const padding = createDiv(classNamePadding);
    const viewport = createDiv(classNameViewport);
    const content = createDiv(classNameContent);
    appendChildren(padding, viewport);
    appendChildren(viewport, content);
    osTargetObj._target = target;
    osTargetObj._padding = padding;
    osTargetObj._viewport = viewport;
    osTargetObj._content = content;
  }

  let { _target, _padding, _viewport, _content } = osTargetObj;
  const destroyFns = [];
  const isTextarea = is(_target, 'textarea');
  const isBody = !isTextarea && is(_target, 'body');

  const _host = isTextarea ? osTargetObj._host || createDiv() : _target;

  const getTargetContents = (contentSlot) => (isTextarea ? _target : contents(contentSlot));

  const isTextareaHostGenerated = isTextarea && _host !== osTargetObj._host;

  if (isTextareaHostGenerated) {
    insertAfter(_target, _host);
    push(destroyFns, () => {
      insertAfter(_host, _target);
      removeElements(_host);
    });
  }

  if (targetIsElm) {
    appendChildren(_content, getTargetContents(_target));
    appendChildren(_host, _padding);
    push(destroyFns, () => {
      appendChildren(_host, contents(_content));
      removeElements(_padding);
      removeClass(_host, classNameHost);
    });
  } else {
    const contentContainingElm = _content || _viewport || _padding || _host;
    const createPadding = isUndefined(_padding);
    const createViewport = isUndefined(_viewport);
    const createContent = isUndefined(_content);
    const targetContents = getTargetContents(contentContainingElm);
    _padding = osTargetObj._padding = createPadding ? createDiv() : _padding;
    _viewport = osTargetObj._viewport = createViewport ? createDiv() : _viewport;
    _content = osTargetObj._content = createContent ? createDiv() : _content;
    appendChildren(_host, _padding);
    appendChildren(_padding || _host, _viewport);
    appendChildren(_viewport, _content);
    const contentSlot = _content || _viewport;
    appendChildren(contentSlot, targetContents);
    push(destroyFns, () => {
      if (createContent) {
        unwrap(_content);
      }

      if (createViewport) {
        unwrap(_viewport);
      }

      if (createPadding) {
        unwrap(_padding);
      }

      removeClass(_host, classNameHost);
      removeClass(_padding, classNamePadding);
      removeClass(_viewport, classNameViewport);
      removeClass(_content, classNameContent);
    });
  }

  addClass(_host, classNameHost);
  addClass(_padding, classNamePadding);
  addClass(_viewport, classNameViewport);
  addClass(_content, classNameContent);
  const ownerDocument = _target.ownerDocument;
  const bodyElm = ownerDocument.body;
  const wnd = ownerDocument.defaultView;
  const ctx = {
    _windowElm: wnd,
    _documentElm: ownerDocument,
    _htmlElm: parent(bodyElm),
    _bodyElm: bodyElm,
    _isTextarea: isTextarea,
    _isBody: isBody,
  };

  const obj = _extends_1({}, osTargetObj, {
    _host,
  });

  const { _nativeScrollbarStyling, _nativeScrollbarIsOverlaid } = getEnvironment();

  if (_nativeScrollbarStyling) {
    push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
  } else if (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y) {
    if (obj._content) {
      const contentArrangeElm = createDiv(classNameContentArrange);
      prependChildren(_viewport, contentArrangeElm);
      push(destroyFns, removeElements.bind(0, contentArrangeElm));
      obj._contentArrange = contentArrangeElm;
    }
  }

  return {
    _targetObj: obj,
    _targetCtx: ctx,
    _destroy: () => {
      runEach(destroyFns);
    },
  };
};

const getPropByPath = (obj, path) => obj && path.split('.').reduce((o, prop) => (o && hasOwnProperty$1(o, prop) ? o[prop] : undefined), obj);

const createLifecycleUpdateFunction = (lifecycleHub, updateFunction) => {
  return (updateHints, changedOptions, force) => {
    const checkOption = (path) => ({
      _value: getPropByPath(lifecycleHub._options, path),
      _changed: force || getPropByPath(changedOptions, path) !== undefined,
    });

    return updateFunction(!!force, updateHints, checkOption) || {};
  };
};

const overlaidScrollbarsHideOffset = 42;
const overlaidScrollbarsHideBorderStyle = `${overlaidScrollbarsHideOffset}px solid transparent`;
const createOverflowLifecycle = (lifecycleHub) => {
  const { _host, _padding, _viewport, _content, _contentArrange } = lifecycleHub._structureSetup._targetObj;
  const { _update: updateContentScrollSizeCache, _current: getCurrentContentScrollSizeCache } = createCache(() => scrollSize(_content || _viewport), {
    _equal: equalWH,
  });
  const { _update: updateOverflowAmountCache, _current: getCurrentOverflowAmountCache } = createCache(
    (ctx) => ({
      x: Math.max(0, Math.round((ctx._contentScrollSize.w - ctx._viewportSize.w) * 100) / 100),
      y: Math.max(0, Math.round((ctx._contentScrollSize.h - ctx._viewportSize.h) * 100) / 100),
    }),
    {
      _equal: equalXY,
    }
  );

  const setViewportOverflowStyle = (horizontal, amount, behavior, styleObj) => {
    const overflowKey = horizontal ? 'overflowX' : 'overflowY';
    const behaviorIsScroll = behavior === 'scroll';
    const behaviorIsVisibleScroll = behavior === 'visible-scroll';
    const hideOverflow = behaviorIsScroll || behavior === 'hidden';
    const applyStyle = amount > 0 && hideOverflow;

    if (applyStyle) {
      styleObj[overflowKey] = behavior;
    }

    return {
      _visible: !applyStyle,
      _behavior: behaviorIsVisibleScroll ? 'scroll' : 'hidden',
    };
  };

  const hideNativeScrollbars = (contentScrollSize, showNativeOverlaidScrollbars, directionIsRTL, viewportStyleObj, contentStyleObj) => {
    const { _nativeScrollbarSize, _nativeScrollbarIsOverlaid, _nativeScrollbarStyling } = getEnvironment();
    const { x: overlaidX, y: overlaidY } = _nativeScrollbarIsOverlaid;
    const scrollX = viewportStyleObj.overflowX === 'scroll';
    const scrollY = viewportStyleObj.overflowY === 'scroll';
    const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
    const horizontalBorderKey = directionIsRTL ? 'borderLeft' : 'borderRight';
    const overlaidHideOffset = _content && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
    const scrollbarsHideOffset = {
      x: overlaidX ? overlaidHideOffset : _nativeScrollbarSize.x,
      y: overlaidY ? overlaidHideOffset : _nativeScrollbarSize.y,
    };

    if (!_nativeScrollbarStyling) {
      if (scrollX) {
        viewportStyleObj.marginBottom = -scrollbarsHideOffset.x;
        contentStyleObj.borderBottom = overlaidX && overlaidHideOffset ? overlaidScrollbarsHideBorderStyle : '';
      }

      if (scrollY) {
        viewportStyleObj.maxWidth = `calc(100% + ${scrollbarsHideOffset.y}px)`;
        viewportStyleObj[horizontalMarginKey] = -scrollbarsHideOffset.y;
        contentStyleObj[horizontalBorderKey] = overlaidY && overlaidHideOffset ? overlaidScrollbarsHideBorderStyle : '';
      }

      if (_contentArrange) {
        style(_contentArrange, {
          width: scrollY && !showNativeOverlaidScrollbars ? overlaidHideOffset + contentScrollSize.w : '',
          height: scrollX && !showNativeOverlaidScrollbars ? overlaidHideOffset + contentScrollSize.h : '',
        });
      }
    }

    return {
      _scrollbarsHideOffset: scrollbarsHideOffset,
      _scroll: {
        x: scrollX,
        y: scrollY,
      },
    };
  };

  const setFlexboxGlueStyle = (heightIntrinsic, scrollX, scrollbarsHideOffsetX) => {
    const offsetLeft = scrollLeft(_viewport);
    const offsetTop = scrollTop(_viewport);
    style(_viewport, {
      maxHeight: '',
    });

    if (heightIntrinsic) {
      style(_viewport, {
        maxHeight: _host.clientHeight + (scrollX ? scrollbarsHideOffsetX : 0),
      });
    }

    scrollLeft(_viewport, offsetLeft);
    scrollTop(_viewport, offsetTop);
  };

  return createLifecycleUpdateFunction(lifecycleHub, (force, updateHints, checkOption) => {
    const { _directionIsRTL, _heightIntrinsic, _sizeChanged, _hostMutation, _contentMutation } = updateHints;
    const { _flexboxGlue, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid } = getEnvironment();
    const { _value: showNativeOverlaidScrollbarsOption, _changed: showNativeOverlaidScrollbarsChanged } = checkOption(
      'nativeScrollbarsOverlaid.show'
    );
    const adjustFlexboxGlue = !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged);
    const showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
    let overflowAmuntCache = getCurrentOverflowAmountCache();
    let contentScrollSizeCache = getCurrentContentScrollSizeCache();

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarStyling) {
      if (showNativeOverlaidScrollbars) {
        removeClass(_viewport, classNameViewportScrollbarStyling);
      } else {
        addClass(_viewport, classNameViewportScrollbarStyling);
      }
    }

    if (_sizeChanged || _contentMutation) {
      const viewportOffsetSize = offsetSize(_padding);
      const contentClientSize = offsetSize(_content || _viewport);
      const contentArrangeOffsetSize = offsetSize(_contentArrange);
      contentScrollSizeCache = updateContentScrollSizeCache(force);
      const { _value: _contentScrollSize } = contentScrollSizeCache;
      overflowAmuntCache = updateOverflowAmountCache(force, {
        _contentScrollSize: {
          w: Math.max(_contentScrollSize.w, contentArrangeOffsetSize.w),
          h: Math.max(_contentScrollSize.h, contentArrangeOffsetSize.h),
        },
        _viewportSize: {
          w: viewportOffsetSize.w + Math.max(0, contentClientSize.w - _contentScrollSize.w),
          h: viewportOffsetSize.h + Math.max(0, contentClientSize.h - _contentScrollSize.h),
        },
      });
    }

    const { _value: directionIsRTL, _changed: directionChanged } = _directionIsRTL;
    const { _value: contentScrollSize, _changed: contentScrollSizeChanged } = contentScrollSizeCache;
    const { _value: overflowAmount, _changed: overflowAmountChanged } = overflowAmuntCache;
    const { _value: overflow, _changed: overflowChanged } = checkOption('overflow');
    const adjustDirection = directionChanged && !_nativeScrollbarStyling;

    if (
      contentScrollSizeChanged ||
      overflowAmountChanged ||
      overflowChanged ||
      showNativeOverlaidScrollbarsChanged ||
      adjustDirection ||
      adjustFlexboxGlue
    ) {
      const viewportStyle = {
        overflowY: '',
        overflowX: '',
        marginTop: '',
        marginRight: '',
        marginBottom: '',
        marginLeft: '',
        maxWidth: '',
      };
      const contentStyle = {
        borderTop: '',
        borderRight: '',
        borderBottom: '',
        borderLeft: '',
      };
      const { _visible: xVisible, _behavior: xVisibleBehavior } = setViewportOverflowStyle(true, overflowAmount.x, overflow.x, viewportStyle);
      const { _visible: yVisible, _behavior: yVisibleBehavior } = setViewportOverflowStyle(false, overflowAmount.y, overflow.y, viewportStyle);

      if (xVisible && !yVisible) {
        viewportStyle.overflowX = xVisibleBehavior;
      }

      if (yVisible && !xVisible) {
        viewportStyle.overflowY = yVisibleBehavior;
      }

      const { _scrollbarsHideOffset, _scroll } = hideNativeScrollbars(
        contentScrollSize,
        showNativeOverlaidScrollbars,
        directionIsRTL,
        viewportStyle,
        contentStyle
      );

      if (adjustFlexboxGlue) {
        setFlexboxGlueStyle(!!_heightIntrinsic._value, _scroll.x, _scrollbarsHideOffset.x);
      }

      style(_viewport, viewportStyle);
      style(_content, contentStyle);
    }
  });
};

const animationStartEventName = 'animationstart';
const scrollEventName = 'scroll';
const scrollAmount = 3333333;
const directionIsRTLMap = {
  direction: ['rtl'],
};

const directionIsRTL = (elm) => {
  let isRTL = false;
  const styles = style(elm, ['direction']);
  each(styles, (value, key) => {
    isRTL = isRTL || indexOf(directionIsRTLMap[key], value) > -1;
  });
  return isRTL;
};

const domRectHasDimensions = (rect) => rect && (rect.height || rect.width);

const createSizeObserver = (target, onSizeChangedCallback, options) => {
  const { _direction: observeDirectionChange = false, _appear: observeAppearChange = false } = options || {};
  const { _rtlScrollBehavior: rtlScrollBehavior } = getEnvironment();
  const baseElements = createDOM(`<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`);
  const sizeObserver = baseElements[0];
  const listenerElement = sizeObserver.firstChild;
  const { _update: updateResizeObserverContentRectCache } = createCache(0, {
    _alwaysUpdateValues: true,
    _equal: (currVal, newVal) => !(!currVal || (!domRectHasDimensions(currVal) && domRectHasDimensions(newVal))),
  });

  const onSizeChangedCallbackProxy = (sizeChangedContext) => {
    const hasDirectionCache = sizeChangedContext && isBoolean(sizeChangedContext._value);
    let skip = false;

    if (isArray(sizeChangedContext) && sizeChangedContext.length > 0) {
      const { _previous, _value, _changed } = updateResizeObserverContentRectCache(0, sizeChangedContext.pop().contentRect);
      skip = !_previous || !domRectHasDimensions(_value);
    } else if (hasDirectionCache) {
      sizeChangedContext._changed;
    }

    if (observeDirectionChange) {
      const rtl = hasDirectionCache ? sizeChangedContext._value : directionIsRTL(sizeObserver);
      scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
      scrollTop(sizeObserver, scrollAmount);
    }

    if (!skip) {
      onSizeChangedCallback(hasDirectionCache ? sizeChangedContext : undefined);
    }
  };

  const offListeners = [];
  let appearCallback = observeAppearChange ? onSizeChangedCallbackProxy : false;
  let directionIsRTLCache;

  if (ResizeObserverConstructor) {
    const resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
    resizeObserverInstance.observe(listenerElement);
    push(offListeners, () => resizeObserverInstance.disconnect());
  } else {
    const observerElementChildren = createDOM(
      `<div class="${classNameSizeObserverListenerItem}" dir="ltr"><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}"></div></div><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}" style="width: 200%; height: 200%"></div></div></div>`
    );
    appendChildren(listenerElement, observerElementChildren);
    addClass(listenerElement, classNameSizeObserverListenerScroll);
    const observerElementChildrenRoot = observerElementChildren[0];
    const shrinkElement = observerElementChildrenRoot.lastChild;
    const expandElement = observerElementChildrenRoot.firstChild;
    const expandElementChild = expandElement == null ? void 0 : expandElement.firstChild;
    let cacheSize = offsetSize(listenerElement);
    let currSize = cacheSize;
    let isDirty = false;
    let rAFId;

    const reset = () => {
      scrollLeft(expandElement, scrollAmount);
      scrollTop(expandElement, scrollAmount);
      scrollLeft(shrinkElement, scrollAmount);
      scrollTop(shrinkElement, scrollAmount);
    };

    const onResized = () => {
      rAFId = 0;

      if (isDirty) {
        cacheSize = currSize;
        onSizeChangedCallbackProxy();
      }
    };

    const onScroll = (scrollEvent) => {
      currSize = offsetSize(listenerElement);
      isDirty = !scrollEvent || !equalWH(currSize, cacheSize);

      if (scrollEvent && isDirty && !rAFId) {
        cAF(rAFId);
        rAFId = rAF(onResized);
      } else if (!scrollEvent) {
        onResized();
      }

      reset();

      if (scrollEvent) {
        preventDefault(scrollEvent);
        stopPropagation(scrollEvent);
      }

      return false;
    };

    push(offListeners, [on(expandElement, scrollEventName, onScroll), on(shrinkElement, scrollEventName, onScroll)]);
    style(expandElementChild, {
      width: scrollAmount,
      height: scrollAmount,
    });
    reset();
    appearCallback = observeAppearChange ? () => onScroll() : reset;
  }

  if (observeDirectionChange) {
    directionIsRTLCache = createCache(() => directionIsRTL(sizeObserver));
    const { _update: updateDirectionIsRTLCache } = directionIsRTLCache;
    push(
      offListeners,
      on(sizeObserver, scrollEventName, (event) => {
        const directionIsRTLCacheValues = updateDirectionIsRTLCache();
        const { _value, _changed } = directionIsRTLCacheValues;

        if (_changed) {
          if (_value) {
            style(listenerElement, {
              left: 'auto',
              right: 0,
            });
          } else {
            style(listenerElement, {
              left: 0,
              right: 'auto',
            });
          }

          onSizeChangedCallbackProxy(directionIsRTLCacheValues);
        }

        preventDefault(event);
        stopPropagation(event);
        return false;
      })
    );
  }

  if (appearCallback) {
    addClass(sizeObserver, classNameSizeObserverAppear);
    push(
      offListeners,
      on(sizeObserver, animationStartEventName, appearCallback, {
        _once: !!ResizeObserverConstructor,
      })
    );
  }

  prependChildren(target, sizeObserver);
  return {
    _destroy() {
      runEach(offListeners);
      removeElements(sizeObserver);
    },

    _getCurrentCacheValues(force) {
      return {
        _directionIsRTL: directionIsRTLCache
          ? directionIsRTLCache._current(force)
          : {
              _value: false,
              _previous: false,
              _changed: false,
            },
      };
    },
  };
};

const createTrinsicObserver = (target, onTrinsicChangedCallback) => {
  const trinsicObserver = createDOM(`<div class="${classNameTrinsicObserver}"></div>`)[0];
  const offListeners = [];
  const { _update: updateHeightIntrinsicCache, _current: getCurrentHeightIntrinsicCache } = createCache(
    (ioEntryOrSize) => ioEntryOrSize.h === 0 || ioEntryOrSize.isIntersecting || ioEntryOrSize.intersectionRatio > 0,
    {
      _initialValue: false,
    }
  );

  if (IntersectionObserverConstructor) {
    const intersectionObserverInstance = new IntersectionObserverConstructor(
      (entries) => {
        if (entries && entries.length > 0) {
          const last = entries.pop();

          if (last) {
            const heightIntrinsic = updateHeightIntrinsicCache(0, last);

            if (heightIntrinsic._changed) {
              onTrinsicChangedCallback(heightIntrinsic);
            }
          }
        }
      },
      {
        root: target,
      }
    );
    intersectionObserverInstance.observe(trinsicObserver);
    push(offListeners, () => intersectionObserverInstance.disconnect());
  } else {
    push(
      offListeners,
      createSizeObserver(trinsicObserver, () => {
        const newSize = offsetSize(trinsicObserver);
        const heightIntrinsicCache = updateHeightIntrinsicCache(0, newSize);

        if (heightIntrinsicCache._changed) {
          onTrinsicChangedCallback(heightIntrinsicCache);
        }
      })._destroy
    );
  }

  prependChildren(target, trinsicObserver);
  return {
    _destroy() {
      runEach(offListeners);
      removeElements(trinsicObserver);
    },

    _getCurrentCacheValues(force) {
      return {
        _heightIntrinsic: getCurrentHeightIntrinsicCache(force),
      };
    },
  };
};

const createEventContentChange = (target, eventContentChange, map, callback) => {
  let eventContentChangeRef;

  const addEvent = (elm, eventName) => {
    const entry = map.get(elm);
    const newEntry = isUndefined(entry);

    const registerEvent = () => {
      map.set(elm, eventName);
      on(elm, eventName, callback);
    };

    if (!newEntry && eventName !== entry) {
      off(elm, entry, callback);
      registerEvent();
    } else if (newEntry) {
      registerEvent();
    }
  };

  const _destroy = () => {
    map.forEach((eventName, elm) => {
      off(elm, eventName, callback);
    });
    map.clear();
  };

  const _updateElements = (getElements) => {
    if (eventContentChangeRef) {
      const eventElmList = eventContentChangeRef.reduce((arr, item) => {
        if (item) {
          const selector = item[0];
          const eventName = item[1];
          const elements = eventName && selector && (getElements ? getElements(selector) : find(selector, target));

          if (elements) {
            push(arr, [elements, isFunction(eventName) ? eventName(elements) : eventName], true);
          }
        }

        return arr;
      }, []);
      each(eventElmList, (item) => {
        const elements = item[0];
        const eventName = item[1];
        each(elements, (elm) => {
          addEvent(elm, eventName);
        });
      });
    }
  };

  const _update = (newEventContentChange) => {
    eventContentChangeRef = newEventContentChange;

    _destroy();

    _updateElements();
  };

  if (eventContentChange) {
    _update(eventContentChange);
  }

  return {
    _destroy,
    _updateElements,
    _update,
  };
};

const createDOMObserver = (target, callback, options) => {
  let isConnected = false;
  const {
    _observeContent,
    _attributes,
    _styleChangingAttributes,
    _eventContentChange,
    _nestedTargetSelector,
    _ignoreTargetAttrChange: _ignoreTargetChange,
    _ignoreContentChange,
  } = options || {};
  const {
    _updateElements: updateEventContentChangeElements,
    _destroy: destroyEventContentChange,
    _update: updateEventContentChange,
  } = createEventContentChange(
    target,
    _observeContent && _eventContentChange,
    new Map(),
    debounce(() => {
      if (isConnected) {
        callback([], false, true);
      }
    }, 84)
  );
  const finalAttributes = _attributes || [];
  const finalStyleChangingAttributes = _styleChangingAttributes || [];
  const observedAttributes = finalAttributes.concat(finalStyleChangingAttributes);

  const observerCallback = (mutations) => {
    const ignoreTargetChange = _ignoreTargetChange || noop;
    const ignoreContentChange = _ignoreContentChange || noop;
    const targetChangedAttrs = [];
    const totalAddedNodes = [];
    let targetStyleChanged = false;
    let contentChanged = false;
    let childListChanged = false;
    each(mutations, (mutation) => {
      const { attributeName, target: mutationTarget, type, oldValue, addedNodes } = mutation;
      const isAttributesType = type === 'attributes';
      const isChildListType = type === 'childList';
      const targetIsMutationTarget = target === mutationTarget;
      const attributeValue = isAttributesType && isString(attributeName) ? attr(mutationTarget, attributeName) : 0;
      const attributeChanged = attributeValue !== 0 && oldValue !== attributeValue;
      const targetAttrChanged =
        attributeChanged &&
        targetIsMutationTarget &&
        !_observeContent &&
        !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue);
      const styleChangingAttrChanged = indexOf(finalStyleChangingAttributes, attributeName) > -1 && attributeChanged;

      if (targetAttrChanged) {
        push(targetChangedAttrs, attributeName);
      }

      if (_observeContent) {
        const notOnlyAttrChanged = !isAttributesType;
        const contentAttrChanged = isAttributesType && styleChangingAttrChanged && !targetIsMutationTarget;
        const isNestedTarget = contentAttrChanged && _nestedTargetSelector && is(mutationTarget, _nestedTargetSelector);
        const baseAssertion = isNestedTarget
          ? !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue)
          : notOnlyAttrChanged || contentAttrChanged;
        const contentFinalChanged = baseAssertion && !ignoreContentChange(mutation, !!isNestedTarget, target, options);
        push(totalAddedNodes, addedNodes);
        contentChanged = contentChanged || contentFinalChanged;
        childListChanged = childListChanged || isChildListType;
      }

      targetStyleChanged = targetStyleChanged || (targetAttrChanged && styleChangingAttrChanged);
    });

    if (childListChanged && !isEmptyArray(totalAddedNodes)) {
      updateEventContentChangeElements((selector) =>
        totalAddedNodes.reduce((arr, node) => {
          push(arr, find(selector, node));
          return is(node, selector) ? push(arr, node) : arr;
        }, [])
      );
    }

    if (!isEmptyArray(targetChangedAttrs) || targetStyleChanged || contentChanged) {
      callback(targetChangedAttrs, targetStyleChanged, contentChanged);
    }
  };

  const mutationObserver = new MutationObserverConstructor(observerCallback);
  mutationObserver.observe(target, {
    attributes: true,
    attributeOldValue: true,
    attributeFilter: observedAttributes,
    subtree: _observeContent,
    childList: _observeContent,
    characterData: _observeContent,
  });
  isConnected = true;
  return {
    _disconnect: () => {
      if (isConnected) {
        destroyEventContentChange();
        mutationObserver.disconnect();
        isConnected = false;
      }
    },
    _updateEventContentChange: (newEventContentChange) => {
      updateEventContentChange(isConnected && _observeContent && newEventContentChange);
    },
    _update: () => {
      if (isConnected) {
        observerCallback(mutationObserver.takeRecords());
      }
    },
  };
};

const attrs = ['id', 'class', 'style', 'open'];
const directionIsRTLCacheValuesFallback = {
  _value: false,
  _previous: false,
  _changed: false,
};
const heightIntrinsicCacheValuesFallback = {
  _value: false,
  _previous: false,
  _changed: false,
};
const createLifecycleHub = (options, structureSetup) => {
  const { _host, _viewport, _content } = structureSetup._targetObj;
  const {
    _nativeScrollbarStyling,
    _flexboxGlue,
    _addListener: addEnvironmentListener,
    _removeListener: removeEnvironmentListener,
  } = getEnvironment();
  const lifecycles = [];
  const instance = {
    _options: options,
    _structureSetup: structureSetup,
  };
  push(lifecycles, createOverflowLifecycle(instance));

  const runLifecycles = (updateHints, changedOptions, force) => {
    let { _directionIsRTL, _heightIntrinsic, _sizeChanged = force || false, _hostMutation = force || false, _contentMutation = force || false } =
      updateHints || {};
    const finalDirectionIsRTL =
      _directionIsRTL || (sizeObserver ? sizeObserver._getCurrentCacheValues(force)._directionIsRTL : directionIsRTLCacheValuesFallback);
    const finalHeightIntrinsic =
      _heightIntrinsic || (trinsicObserver ? trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : heightIntrinsicCacheValuesFallback);
    each(lifecycles, (lifecycle) => {
      const { _sizeChanged: adaptiveSizeChanged, _hostMutation: adaptiveHostMutation, _contentMutation: adaptiveContentMutation } = lifecycle(
        {
          _directionIsRTL: finalDirectionIsRTL,
          _heightIntrinsic: finalHeightIntrinsic,
          _sizeChanged,
          _hostMutation,
          _contentMutation,
        },
        changedOptions,
        force
      );
      _sizeChanged = adaptiveSizeChanged || _sizeChanged;
      _hostMutation = adaptiveHostMutation || _hostMutation;
      _contentMutation = adaptiveContentMutation || _contentMutation;
    });
  };

  const onSizeChanged = (directionIsRTL) => {
    const sizeChanged = !directionIsRTL;
    runLifecycles({
      _directionIsRTL: directionIsRTL,
      _sizeChanged: sizeChanged,
    });
  };

  const onTrinsicChanged = (heightIntrinsic) => {
    runLifecycles({
      _heightIntrinsic: heightIntrinsic,
    });
  };

  const onHostMutation = () => {
    requestAnimationFrame(() => {
      runLifecycles({
        _hostMutation: true,
      });
    });
  };

  const onContentMutation = () => {
    requestAnimationFrame(() => {
      runLifecycles({
        _contentMutation: true,
      });
    });
  };

  const sizeObserver = createSizeObserver(_host, onSizeChanged, {
    _appear: true,
    _direction: !_nativeScrollbarStyling,
  });
  const trinsicObserver = createTrinsicObserver(_host, onTrinsicChanged);
  const hostMutationObserver = createDOMObserver(_host, onHostMutation, {
    _styleChangingAttributes: attrs,
    _attributes: attrs,
  });
  const contentMutationObserver = createDOMObserver(_content || _viewport, onContentMutation, {
    _observeContent: true,
    _styleChangingAttributes: attrs,
    _attributes: attrs,
    _eventContentChange: options.updating.elementEvents,
  });

  const updateAll = (changedOptions, force) => {
    runLifecycles(null, changedOptions, force);
  };

  const envUpdateListener = updateAll.bind(null, null, true);
  addEnvironmentListener(envUpdateListener);
  console.log('flexboxGlue', _flexboxGlue);
  return {
    _update: updateAll,

    _destroy() {
      removeEnvironmentListener(envUpdateListener);
    },
  };
};

const numberAllowedValues = optionsTemplateTypes.number;
const stringArrayNullAllowedValues = [optionsTemplateTypes.string, optionsTemplateTypes.array, optionsTemplateTypes.null];
const booleanTrueTemplate = [true, optionsTemplateTypes.boolean];
const booleanFalseTemplate = [false, optionsTemplateTypes.boolean];
const resizeAllowedValues = 'none both horizontal vertical';
const overflowAllowedValues = 'visible-hidden visible-scroll scroll hidden';
const scrollbarsVisibilityAllowedValues = 'visible hidden auto';
const scrollbarsAutoHideAllowedValues = 'never scroll leavemove';
const defaultOptionsWithTemplate = {
  resize: ['none', resizeAllowedValues],
  paddingAbsolute: booleanFalseTemplate,
  updating: {
    elementEvents: [[['img', 'load']], [optionsTemplateTypes.array, optionsTemplateTypes.null]],
    contentMutationDebounce: [80, numberAllowedValues],
    hostMutationDebounce: [0, numberAllowedValues],
    resizeDebounce: [0, numberAllowedValues],
  },
  overflow: {
    x: ['scroll', overflowAllowedValues],
    y: ['scroll', overflowAllowedValues],
  },
  scrollbars: {
    visibility: ['auto', scrollbarsVisibilityAllowedValues],
    autoHide: ['never', scrollbarsAutoHideAllowedValues],
    autoHideDelay: [800, numberAllowedValues],
    dragScroll: booleanTrueTemplate,
    clickScroll: booleanFalseTemplate,
    touch: booleanTrueTemplate,
  },
  textarea: {
    dynWidth: booleanFalseTemplate,
    dynHeight: booleanFalseTemplate,
    inheritedAttrs: [['style', 'class'], stringArrayNullAllowedValues],
  },
  nativeScrollbarsOverlaid: {
    show: booleanFalseTemplate,
    initialize: booleanFalseTemplate,
  },
};
const { _template: optionsTemplate, _options: defaultOptions } = transformOptions(defaultOptionsWithTemplate);

const OverlayScrollbars = (target, options, extensions) => {
  const currentOptions = assignDeep({}, defaultOptions, validateOptions(options || {}, optionsTemplate, null, true)._validated);
  const structureSetup = createStructureSetup(target);
  const lifecycleHub = createLifecycleHub(currentOptions, structureSetup);
  const instance = {
    options(newOptions) {
      if (newOptions) {
        const { _validated: _changedOptions } = validateOptions(newOptions, optionsTemplate, currentOptions, true);

        if (!isEmptyObject(_changedOptions)) {
          assignDeep(currentOptions, _changedOptions);

          lifecycleHub._update(_changedOptions);
        }
      }

      return currentOptions;
    },

    update(force) {
      lifecycleHub._update(null, force);
    },
  };
  instance.update(true);
  return instance;
};

var index = () => {
  return [
    getEnvironment(),
    OverlayScrollbars(document.body),
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
