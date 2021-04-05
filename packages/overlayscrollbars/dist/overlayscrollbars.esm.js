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
const insertBefore = (node, insertedNodes) => {
  before(parent(node), node, insertedNodes);
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

const equal = (a, b, props, propMutation) => {
  if (a && b) {
    let result = true;
    each(props, (prop) => {
      const compareA = propMutation ? propMutation(a[prop]) : a[prop];
      const compareB = propMutation ? propMutation(b[prop]) : b[prop];

      if (compareA !== compareB) {
        result = false;
      }
    });
    return result;
  }

  return false;
};
const equalWH = (a, b) => equal(a, b, ['w', 'h']);
const equalXY = (a, b) => equal(a, b, ['x', 'y']);
const equalTRBL = (a, b) => equal(a, b, ['t', 'r', 'b', 'l']);
const equalBCRWH = (a, b, round) => equal(a, b, ['width', 'height'], round && ((value) => Math.round(value)));

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

const cssNumber = {};

const parseToZeroOrNumber = (value, toFloat) => {
  const num = toFloat ? parseFloat(value) : parseInt(value, 10);
  return Number.isNaN(num) ? 0 : num;
};

const adaptCSSVal = (prop, val) => (!cssNumber[prop.toLowerCase()] && isNumber(val) ? `${val}px` : val);

const getCSSVal = (elm, computedStyle, prop) =>
  computedStyle != null ? computedStyle[prop] || computedStyle.getPropertyValue(prop) : elm.style[prop];

const setCSSVal = (elm, prop, val) => {
  try {
    if (elm) {
      const { style } = elm;

      if (!isUndefined(style[prop])) {
        style[prop] = adaptCSSVal(prop, val);
      } else {
        style.setProperty(prop, val);
      }
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
const topRightBottomLeft = (elm, propertyPrefix, propertySuffix) => {
  const finalPrefix = propertyPrefix ? `${propertyPrefix}-` : '';
  const finalSuffix = propertySuffix ? `-${propertySuffix}` : '';
  const top = `${finalPrefix}top${finalSuffix}`;
  const right = `${finalPrefix}right${finalSuffix}`;
  const bottom = `${finalPrefix}bottom${finalSuffix}`;
  const left = `${finalPrefix}left${finalSuffix}`;
  const result = style(elm, [top, right, bottom, left]);
  return {
    t: parseToZeroOrNumber(result[top]),
    r: parseToZeroOrNumber(result[right]),
    b: parseToZeroOrNumber(result[bottom]),
    l: parseToZeroOrNumber(result[left]),
  };
};

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

const transformOptions = (optionsWithOptionsTemplate) => {
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
};

const classNameEnvironment = 'os-environment';
const classNameEnvironmentFlexboxGlue = `${classNameEnvironment}-flexbox-glue`;
const classNameEnvironmentFlexboxGlueMax = `${classNameEnvironmentFlexboxGlue}-max`;
const classNameHost = 'os-host';
const classNamePadding = 'os-padding';
const classNameViewport = 'os-viewport';
const classNameViewportArrange = `${classNameViewport}-arrange`;
const classNameContent = 'os-content';
const classNameViewportScrollbarStyling = `${classNameViewport}-scrollbar-styled`;
const classNameSizeObserver = 'os-size-observer';
const classNameSizeObserverAppear = `${classNameSizeObserver}-appear`;
const classNameSizeObserverListener = `${classNameSizeObserver}-listener`;
const classNameSizeObserverListenerScroll = `${classNameSizeObserverListener}-scroll`;
const classNameSizeObserverListenerItem = `${classNameSizeObserverListener}-item`;
const classNameSizeObserverListenerItemFinal = `${classNameSizeObserverListenerItem}-final`;
const classNameTrinsicObserver = 'os-trinsic-observer';

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

let environmentInstance;
const { abs, round } = Math;

const diffBiggerThanOne = (valOne, valTwo) => {
  const absValOne = abs(valOne);
  const absValTwo = abs(valTwo);
  return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
};

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
  const minOffsetsizeParent = getBoundingClientRect(parentElm);
  const minOffsetsize = getBoundingClientRect(childElm);
  const supportsMin = equalBCRWH(minOffsetsize, minOffsetsizeParent, true);
  addClass(parentElm, classNameEnvironmentFlexboxGlueMax);
  const maxOffsetsizeParent = getBoundingClientRect(parentElm);
  const maxOffsetsize = getBoundingClientRect(childElm);
  const supportsMax = equalBCRWH(maxOffsetsize, maxOffsetsizeParent, true);
  return supportsMin && supportsMax;
};

const getWindowDPR = () => {
  const dDPI = window.screen.deviceXDPI || 0;
  const sDPI = window.screen.logicalXDPI || 1;
  return window.devicePixelRatio || dDPI / sDPI;
};

const getDefaultInitializationStrategy = (nativeScrollbarStyling) => ({
  _padding: !nativeScrollbarStyling,
  _content: false,
});

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
  const defaultInitializationStrategy = getDefaultInitializationStrategy(nativeScrollbarStyling);
  let initializationStrategy = defaultInitializationStrategy;
  let defaultDefaultOptions = defaultOptions;
  const env = {
    _autoUpdateLoop: false,
    _nativeScrollbarSize: nativeScrollbarSize,
    _nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
    _nativeScrollbarStyling: nativeScrollbarStyling,
    _cssCustomProperties: style(envElm, 'zIndex') === '-1',
    _rtlScrollBehavior: getRtlScrollBehavior(envElm, envChildElm),
    _flexboxGlue: getFlexboxGlue(envElm, envChildElm),

    _addListener(listener) {
      onChangedListener.add(listener);
    },

    _removeListener(listener) {
      onChangedListener.delete(listener);
    },

    _getInitializationStrategy: () => _extends_1({}, initializationStrategy),

    _setInitializationStrategy(newInitializationStrategy) {
      initializationStrategy = assignDeep({}, initializationStrategy, newInitializationStrategy);
    },

    _getDefaultOptions: () => _extends_1({}, defaultDefaultOptions),

    _setDefaultOptions(newDefaultOptions) {
      defaultDefaultOptions = assignDeep({}, defaultDefaultOptions, newDefaultOptions);
    },

    _defaultInitializationStrategy: defaultInitializationStrategy,
    _defaultDefaultOptions: defaultDefaultOptions,
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

let contentArrangeCounter = 0;

const createUniqueViewportArrangeElement = () => {
  const elm = document.createElement('style');
  attr(elm, 'id', `${classNameViewportArrange}-${contentArrangeCounter}`);
  contentArrangeCounter++;
  return elm;
};

const evaluateCreationFromStrategy = (initializationValue, strategy) => {
  const isBooleanValue = isBoolean(initializationValue);

  if (isBooleanValue || isUndefined(initializationValue)) {
    return (isBooleanValue ? initializationValue : strategy) && undefined;
  }

  return initializationValue;
};

const createStructureSetup = (target) => {
  const { _getInitializationStrategy, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid, _cssCustomProperties } = getEnvironment();

  const { _padding: paddingNeeded, _content: contentNeeded } = _getInitializationStrategy();

  const targetIsElm = isHTMLElement(target);
  const osTargetObj = targetIsElm
    ? {}
    : {
        _host: target.host,
        _target: target.target,
        _viewport: target.viewport,
        _padding: evaluateCreationFromStrategy(target.padding, paddingNeeded),
        _content: evaluateCreationFromStrategy(target.content, contentNeeded),
      };

  if (targetIsElm) {
    const viewport = createDiv(classNameViewport);
    const padding = paddingNeeded && createDiv(classNamePadding);
    const content = contentNeeded && createDiv(classNameContent);
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
    const contentSlot = _content || _viewport;
    appendChildren(contentSlot, getTargetContents(_target));
    appendChildren(_host, _padding);
    appendChildren(_padding || _host, _viewport);
    appendChildren(_viewport, _content);
    push(destroyFns, () => {
      appendChildren(_host, contents(contentSlot));
      removeElements(_padding || _viewport);
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

  if (_nativeScrollbarStyling) {
    push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
  } else if (!_cssCustomProperties && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y)) {
    const viewportArrangeElm = createUniqueViewportArrangeElement();
    insertBefore(_viewport, viewportArrangeElm);
    push(destroyFns, removeElements.bind(0, viewportArrangeElm));
    obj._viewportArrange = viewportArrangeElm;
  }

  return {
    _targetObj: obj,
    _targetCtx: ctx,
    _destroy: () => {
      runEach(destroyFns);
    },
  };
};

const createTrinsicLifecycle = (lifecycleHub) => {
  const { _structureSetup } = lifecycleHub;
  const { _content } = _structureSetup._targetObj;
  return (updateHints) => {
    const { _heightIntrinsic } = updateHints;
    const { _value: heightIntrinsic, _changed: heightIntrinsicChanged } = _heightIntrinsic;

    if (heightIntrinsicChanged) {
      style(_content, {
        height: heightIntrinsic ? 'auto' : '100%',
      });
    }
  };
};

const createPaddingLifecycle = (lifecycleHub) => {
  const { _setPaddingInfo, _setViewportPaddingStyle, _structureSetup } = lifecycleHub;
  const { _host, _padding, _viewport } = _structureSetup._targetObj;
  const { _update: updatePaddingCache, _current: currentPaddingCache } = createCache(() => topRightBottomLeft(_host, 'padding'), {
    _equal: equalTRBL,
  });
  return (updateHints, checkOption, force) => {
    let { _value: padding, _changed: paddingChanged } = currentPaddingCache(force);
    const { _nativeScrollbarStyling } = getEnvironment();
    const { _sizeChanged, _directionIsRTL } = updateHints;
    const { _value: directionIsRTL, _changed: directionChanged } = _directionIsRTL;
    const { _value: paddingAbsolute, _changed: paddingAbsoluteChanged } = checkOption('paddingAbsolute');

    if (_sizeChanged || paddingChanged) {
      ({ _value: padding, _changed: paddingChanged } = updatePaddingCache(force));
    }

    const paddingStyleChanged = paddingAbsoluteChanged || directionChanged || paddingChanged;

    if (paddingStyleChanged) {
      const { _value: _padding2 } = updatePaddingCache(force);
      const paddingRelative = !paddingAbsolute || (!_padding && !_nativeScrollbarStyling);
      const paddingHorizontal = _padding2.r + _padding2.l;
      const paddingVertical = _padding2.t + _padding2.b;
      const paddingStyle = {
        marginTop: 0,
        marginRight: 0,
        marginBottom: paddingRelative ? -paddingVertical : 0,
        marginLeft: 0,
        top: paddingRelative ? -_padding2.t : 0,
        right: 0,
        bottom: 0,
        left: 0,
        maxWidth: paddingRelative ? `calc(100% + ${paddingHorizontal}px)` : '',
      };
      const viewportStyle = {
        paddingTop: paddingRelative ? _padding2.t : 0,
        paddingRight: paddingRelative ? _padding2.r : 0,
        paddingBottom: paddingRelative ? _padding2.b : 0,
        paddingLeft: paddingRelative ? _padding2.l : 0,
      };

      if (paddingRelative) {
        const horizontalPositionKey = directionIsRTL ? 'right' : 'left';
        const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
        const horizontalPositionValue = directionIsRTL ? _padding2.r : _padding2.l;
        paddingStyle[horizontalPositionKey] = -horizontalPositionValue;
        paddingStyle[horizontalMarginKey] = -paddingHorizontal;
      }

      style(_padding || _viewport, paddingStyle);
      style(_viewport, viewportStyle);

      _setPaddingInfo({
        _absolute: !paddingRelative,
        _padding: _padding2,
      });

      _setViewportPaddingStyle(_padding ? viewportStyle : _extends_1({}, paddingStyle, viewportStyle));
    }

    return {
      _paddingStyleChanged: paddingStyleChanged,
    };
  };
};

const overlaidScrollbarsHideOffset = 42;
const createOverflowLifecycle = (lifecycleHub) => {
  const { _structureSetup, _doViewportArrange, _getViewportPaddingStyle, _getPaddingInfo, _setViewportOverflowScroll } = lifecycleHub;
  const { _host, _padding, _viewport, _viewportArrange } = _structureSetup._targetObj;
  const { _update: updateContentScrollSizeCache, _current: getCurrentContentScrollSizeCache } = createCache(
    (ctx) => fixScrollSizeRounding(ctx._viewportScrollSize, ctx._viewportOffsetSize, ctx._viewportRect),
    {
      _equal: equalWH,
    }
  );
  const { _update: updateOverflowAmountCache, _current: getCurrentOverflowAmountCache } = createCache(
    (ctx) => ({
      x: Math.max(0, ctx._contentScrollSize.w - ctx._viewportSize.w),
      y: Math.max(0, ctx._contentScrollSize.h - ctx._viewportSize.h),
    }),
    {
      _equal: equalXY,
      _initialValue: {
        x: 0,
        y: 0,
      },
    }
  );

  const fixScrollSizeRounding = (viewportScrollSize, viewportOffsetSize, viewportRect) => ({
    w: viewportScrollSize.w - Math.round(Math.max(0, viewportRect.width - viewportOffsetSize.w)),
    h: viewportScrollSize.h - Math.round(Math.max(0, viewportRect.height - viewportOffsetSize.h)),
  });

  const fixFlexboxGlue = (viewportOverflowState, heightIntrinsic) => {
    style(_viewport, {
      height: '',
    });

    if (heightIntrinsic) {
      const { _absolute: paddingAbsolute, _padding: padding } = _getPaddingInfo();

      const { _overflowScroll, _scrollbarsHideOffset } = viewportOverflowState;
      const hostBCR = getBoundingClientRect(_host);
      const hostOffsetSize = offsetSize(_host);
      const hostClientSize = clientSize(_host);
      const paddingAbsoluteVertical = paddingAbsolute ? padding.b + padding.t : 0;
      const clientSizeWithoutRounding = hostClientSize.h + (hostBCR.height - hostOffsetSize.h);
      style(_viewport, {
        height: clientSizeWithoutRounding + (_overflowScroll.x ? _scrollbarsHideOffset.x : 0) - paddingAbsoluteVertical,
      });
    }
  };

  const getViewportOverflowState = (showNativeOverlaidScrollbars, viewportStyleObj) => {
    const { _nativeScrollbarSize, _nativeScrollbarIsOverlaid, _nativeScrollbarStyling } = getEnvironment();
    const { x: overlaidX, y: overlaidY } = _nativeScrollbarIsOverlaid;
    const determineOverflow = !viewportStyleObj;
    const arrangeHideOffset = !_nativeScrollbarStyling && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
    const styleObj = determineOverflow ? style(_viewport, ['overflowX', 'overflowY']) : viewportStyleObj;
    const scroll = {
      x: styleObj.overflowX === 'scroll',
      y: styleObj.overflowY === 'scroll',
    };
    const scrollbarsHideOffset = {
      x: scroll.x && !_nativeScrollbarStyling ? (overlaidX ? arrangeHideOffset : _nativeScrollbarSize.x) : 0,
      y: scroll.y && !_nativeScrollbarStyling ? (overlaidY ? arrangeHideOffset : _nativeScrollbarSize.y) : 0,
    };
    return {
      _overflowScroll: scroll,
      _scrollbarsHideOffsetArrange: {
        x: overlaidX && !!arrangeHideOffset,
        y: overlaidY && !!arrangeHideOffset,
      },
      _scrollbarsHideOffset: scrollbarsHideOffset,
    };
  };

  const setViewportOverflowState = (showNativeOverlaidScrollbars, overflowAmount, overflow, viewportStyleObj) => {
    const setPartialStylePerAxis = (horizontal, overflowAmount, behavior, styleObj) => {
      const overflowKey = horizontal ? 'overflowX' : 'overflowY';
      const behaviorIsScroll = behavior === 'scroll';
      const behaviorIsVisibleScroll = behavior === 'visible-scroll';
      const hideOverflow = behaviorIsScroll || behavior === 'hidden';
      const applyStyle = overflowAmount > 0 && hideOverflow;

      if (applyStyle) {
        styleObj[overflowKey] = behavior;
      }

      return {
        _visible: !applyStyle,
        _behavior: behaviorIsVisibleScroll ? 'scroll' : 'hidden',
      };
    };

    const { _visible: xVisible, _behavior: xVisibleBehavior } = setPartialStylePerAxis(true, overflowAmount.x, overflow.x, viewportStyleObj);
    const { _visible: yVisible, _behavior: yVisibleBehavior } = setPartialStylePerAxis(false, overflowAmount.y, overflow.y, viewportStyleObj);

    if (xVisible && !yVisible) {
      viewportStyleObj.overflowX = xVisibleBehavior;
    }

    if (yVisible && !xVisible) {
      viewportStyleObj.overflowY = yVisibleBehavior;
    }

    return getViewportOverflowState(showNativeOverlaidScrollbars, viewportStyleObj);
  };

  const arrangeViewport = (viewportOverflowState, contentScrollSize, directionIsRTL) => {
    if (_doViewportArrange) {
      const { _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
      const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
      const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;

      const viewportPaddingStyle = _getViewportPaddingStyle();

      const viewportArrangeHorizontalPaddingKey = directionIsRTL ? 'paddingRight' : 'paddingLeft';
      const viewportArrangeHorizontalPaddingValue = viewportPaddingStyle[viewportArrangeHorizontalPaddingKey];
      const viewportArrangeVerticalPaddingValue = viewportPaddingStyle.paddingTop;
      const arrangeSize = {
        w: hideOffsetY && arrangeY ? `${hideOffsetY + contentScrollSize.w - viewportArrangeHorizontalPaddingValue}px` : '',
        h: hideOffsetX && arrangeX ? `${hideOffsetX + contentScrollSize.h - viewportArrangeVerticalPaddingValue}px` : '',
      };

      if (_viewportArrange) {
        const { sheet } = _viewportArrange;

        if (sheet) {
          const { cssRules } = sheet;

          if (cssRules) {
            if (!cssRules.length) {
              sheet.insertRule(`#${attr(_viewportArrange, 'id')} + .${classNameViewportArrange}::before {}`, 0);
            }

            const ruleStyle = cssRules[0].style;
            ruleStyle.width = arrangeSize.w;
            ruleStyle.height = arrangeSize.h;
          }
        }
      } else {
        style(_viewport, {
          '--viewport-arrange-width': arrangeSize.w,
          '--viewport-arrange-height': arrangeSize.h,
        });
      }
    }

    return _doViewportArrange;
  };

  const hideNativeScrollbars = (viewportOverflowState, directionIsRTL, viewportArrange, viewportStyleObj) => {
    const { _nativeScrollbarStyling } = getEnvironment();
    const { _overflowScroll, _scrollbarsHideOffset, _scrollbarsHideOffsetArrange } = viewportOverflowState;
    const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
    const { x: hideOffsetX, y: hideOffsetY } = _scrollbarsHideOffset;
    const { x: scrollX, y: scrollY } = _overflowScroll;

    const paddingStyle = _getViewportPaddingStyle();

    const horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
    const viewportHorizontalPaddingKey = directionIsRTL ? 'paddingLeft' : 'paddingRight';
    const horizontalMarginValue = paddingStyle[horizontalMarginKey];
    const verticalMarginValue = paddingStyle.marginBottom;
    const horizontalPaddingValue = paddingStyle[viewportHorizontalPaddingKey];
    const verticalPaddingValue = paddingStyle.paddingBottom;
    viewportStyleObj.maxWidth = `calc(100% + ${hideOffsetY + horizontalMarginValue * -1}px)`;
    viewportStyleObj[horizontalMarginKey] = -hideOffsetY + horizontalMarginValue;
    viewportStyleObj.marginBottom = -hideOffsetX + verticalMarginValue;

    if (viewportArrange) {
      viewportStyleObj[viewportHorizontalPaddingKey] = horizontalPaddingValue + (arrangeY ? hideOffsetY : 0);
      viewportStyleObj.paddingBottom = verticalPaddingValue + (arrangeX ? hideOffsetX : 0);
    }

    if (!_nativeScrollbarStyling) {
      style(_padding || _host, {
        overflow: scrollX || scrollY ? 'hidden' : '',
      });
    }
  };

  const undoViewportArrange = (showNativeOverlaidScrollbars, viewportOverflowState) => {
    if (_doViewportArrange) {
      const finalViewportOverflowState = viewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars);

      const paddingStyle = _getViewportPaddingStyle();

      const { _flexboxGlue } = getEnvironment();
      const { _scrollbarsHideOffsetArrange } = finalViewportOverflowState;
      const { x: arrangeX, y: arrangeY } = _scrollbarsHideOffsetArrange;
      const finalPaddingStyle = {};

      const assignProps = (props) =>
        each(props.split(' '), (prop) => {
          finalPaddingStyle[prop] = paddingStyle[prop];
        });

      if (!_flexboxGlue) {
        finalPaddingStyle.height = '';
      }

      if (arrangeX) {
        assignProps('marginTop marginBottom paddingTop paddingBottom');
      }

      if (arrangeY) {
        assignProps('marginLeft marginRight paddingLeft paddingRight');
      }

      const prevStyle = style(_viewport, keys(finalPaddingStyle));
      removeClass(_viewport, classNameViewportArrange);
      style(_viewport, finalPaddingStyle);
      return {
        _redoViewportArrange: () => {
          style(_viewport, prevStyle);
          addClass(_viewport, classNameViewportArrange);
        },
        _viewportOverflowState: finalViewportOverflowState,
      };
    }

    return {
      _redoViewportArrange: noop,
    };
  };

  return (updateHints, checkOption, force) => {
    const { _directionIsRTL, _heightIntrinsic, _sizeChanged, _hostMutation, _contentMutation, _paddingStyleChanged } = updateHints;
    const { _flexboxGlue, _nativeScrollbarStyling, _nativeScrollbarIsOverlaid } = getEnvironment();
    const { _value: heightIntrinsic, _changed: heightIntrinsicChanged } = _heightIntrinsic;
    const { _value: directionIsRTL, _changed: directionChanged } = _directionIsRTL;
    const { _value: showNativeOverlaidScrollbarsOption, _changed: showNativeOverlaidScrollbarsChanged } = checkOption(
      'nativeScrollbarsOverlaid.show'
    );
    const showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
    const adjustFlexboxGlue =
      !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged || heightIntrinsicChanged);
    let overflowAmuntCache = getCurrentOverflowAmountCache(force);
    let contentScrollSizeCache = getCurrentContentScrollSizeCache(force);
    let preMeasureViewportOverflowState;

    if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarStyling) {
      if (showNativeOverlaidScrollbars) {
        removeClass(_viewport, classNameViewportScrollbarStyling);
      } else {
        addClass(_viewport, classNameViewportScrollbarStyling);
      }
    }

    if (adjustFlexboxGlue) {
      preMeasureViewportOverflowState = getViewportOverflowState(showNativeOverlaidScrollbars);
      fixFlexboxGlue(preMeasureViewportOverflowState, !!heightIntrinsic);
    }

    if (_sizeChanged || _paddingStyleChanged || _contentMutation || showNativeOverlaidScrollbarsChanged || directionChanged) {
      const { _redoViewportArrange, _viewportOverflowState: undoViewportArrangeOverflowState } = undoViewportArrange(
        showNativeOverlaidScrollbars,
        preMeasureViewportOverflowState
      );
      const contentSize = clientSize(_viewport);
      const viewportRect = getBoundingClientRect(_viewport);
      const viewportOffsetSize = offsetSize(_viewport);
      let viewportScrollSize = scrollSize(_viewport);
      let viewportClientSize = contentSize;
      const { _value: _contentScrollSize, _changed: _contentScrollSizeChanged } = (contentScrollSizeCache = updateContentScrollSizeCache(force, {
        _viewportRect: viewportRect,
        _viewportOffsetSize: viewportOffsetSize,
        _viewportScrollSize: viewportScrollSize,
      }));

      _redoViewportArrange();

      if (
        (_contentScrollSizeChanged || showNativeOverlaidScrollbarsChanged) &&
        undoViewportArrangeOverflowState &&
        !showNativeOverlaidScrollbars &&
        arrangeViewport(undoViewportArrangeOverflowState, _contentScrollSize, directionIsRTL)
      ) {
        viewportClientSize = clientSize(_viewport);
        viewportScrollSize = fixScrollSizeRounding(scrollSize(_viewport), offsetSize(_viewport), getBoundingClientRect(_viewport));
      }

      overflowAmuntCache = updateOverflowAmountCache(force, {
        _contentScrollSize: {
          w: Math.max(_contentScrollSize.w, viewportScrollSize.w),
          h: Math.max(_contentScrollSize.h, viewportScrollSize.h),
        },
        _viewportSize: {
          w: viewportClientSize.w + Math.max(0, contentSize.w - _contentScrollSize.w),
          h: viewportClientSize.h + Math.max(0, contentSize.h - _contentScrollSize.h),
        },
      });
    }

    const { _value: overflow, _changed: overflowChanged } = checkOption('overflow');
    const { _value: contentScrollSize, _changed: contentScrollSizeChanged } = contentScrollSizeCache;
    const { _value: overflowAmount, _changed: overflowAmountChanged } = overflowAmuntCache;

    if (
      _paddingStyleChanged ||
      contentScrollSizeChanged ||
      overflowAmountChanged ||
      overflowChanged ||
      showNativeOverlaidScrollbarsChanged ||
      directionChanged ||
      adjustFlexboxGlue
    ) {
      const viewportStyle = {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0,
        maxWidth: '',
        overflowY: '',
        overflowX: '',
      };
      const viewportOverflowState = setViewportOverflowState(showNativeOverlaidScrollbars, overflowAmount, overflow, viewportStyle);
      const viewportArranged = arrangeViewport(viewportOverflowState, contentScrollSize, directionIsRTL);
      hideNativeScrollbars(viewportOverflowState, directionIsRTL, viewportArranged, viewportStyle);

      if (adjustFlexboxGlue) {
        fixFlexboxGlue(viewportOverflowState, !!heightIntrinsic);
      }

      style(_viewport, viewportStyle);

      _setViewportOverflowScroll(viewportOverflowState._overflowScroll);
    }
  };
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
    const onSizeChanged = () => {
      const newSize = offsetSize(trinsicObserver);
      const heightIntrinsicCache = updateHeightIntrinsicCache(0, newSize);

      if (heightIntrinsicCache._changed) {
        onTrinsicChangedCallback(heightIntrinsicCache);
      }
    };

    push(offListeners, createSizeObserver(trinsicObserver, onSizeChanged)._destroy);
    onSizeChanged();
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

const getPropByPath = (obj, path) => obj && path.split('.').reduce((o, prop) => (o && hasOwnProperty$1(o, prop) ? o[prop] : undefined), obj);

const emptyStylePropsToZero = (stlyeObj, baseStyle) =>
  keys(stlyeObj).reduce((obj, key) => {
    const value = stlyeObj[key];
    obj[key] = value === '' ? 0 : value;
    return obj;
  }, _extends_1({}, baseStyle));

const attrs = ['id', 'class', 'style', 'open'];
const paddingInfoFallback = {
  _absolute: false,
  _padding: {
    t: 0,
    r: 0,
    b: 0,
    l: 0,
  },
};
const viewportPaddingStyleFallback = {
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
};
const viewportOverflowScrollFallback = {
  x: false,
  y: false,
};
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
  let paddingInfo = paddingInfoFallback;
  let viewportPaddingStyle = viewportPaddingStyleFallback;
  let viewportOverflowScroll = viewportOverflowScrollFallback;
  const { _host, _viewport, _content } = structureSetup._targetObj;
  const {
    _nativeScrollbarStyling,
    _nativeScrollbarIsOverlaid,
    _flexboxGlue,
    _addListener: addEnvironmentListener,
    _removeListener: removeEnvironmentListener,
  } = getEnvironment();
  const doViewportArrange = !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);
  const lifecycles = [];
  const instance = {
    _options: options,
    _structureSetup: structureSetup,
    _doViewportArrange: doViewportArrange,
    _getPaddingInfo: () => paddingInfo,

    _setPaddingInfo(newPaddingInfo) {
      paddingInfo = newPaddingInfo || paddingInfoFallback;
    },

    _getViewportPaddingStyle: () => viewportPaddingStyle,

    _setViewportPaddingStyle(newPaddingStlye) {
      viewportPaddingStyle = newPaddingStlye ? emptyStylePropsToZero(newPaddingStlye, viewportPaddingStyleFallback) : viewportPaddingStyleFallback;
    },

    _getViewportOverflowScroll: () => viewportOverflowScroll,

    _setViewportOverflowScroll(newViewportOverflowScroll) {
      viewportOverflowScroll = newViewportOverflowScroll || viewportOverflowScrollFallback;
    },
  };
  push(lifecycles, createTrinsicLifecycle(instance));
  push(lifecycles, createPaddingLifecycle(instance));
  push(lifecycles, createOverflowLifecycle(instance));

  const updateLifecycles = (updateHints, changedOptions, force) => {
    let {
      _directionIsRTL,
      _heightIntrinsic,
      _sizeChanged = force || false,
      _hostMutation = force || false,
      _contentMutation = force || false,
      _paddingStyleChanged = force || false,
    } = updateHints || {};
    const finalDirectionIsRTL =
      _directionIsRTL || (sizeObserver ? sizeObserver._getCurrentCacheValues(force)._directionIsRTL : directionIsRTLCacheValuesFallback);
    const finalHeightIntrinsic =
      _heightIntrinsic || (trinsicObserver ? trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : heightIntrinsicCacheValuesFallback);

    const checkOption = (path) => ({
      _value: getPropByPath(options, path),
      _changed: force || getPropByPath(changedOptions, path) !== undefined,
    });

    const adjustScrollOffset = doViewportArrange || !_flexboxGlue;
    const scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
    const scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);
    each(lifecycles, (lifecycle) => {
      const {
        _sizeChanged: adaptiveSizeChanged,
        _hostMutation: adaptiveHostMutation,
        _contentMutation: adaptiveContentMutation,
        _paddingStyleChanged: adaptivePaddingStyleChanged,
      } =
        lifecycle(
          {
            _directionIsRTL: finalDirectionIsRTL,
            _heightIntrinsic: finalHeightIntrinsic,
            _sizeChanged,
            _hostMutation,
            _contentMutation,
            _paddingStyleChanged,
          },
          checkOption,
          !!force
        ) || {};
      _sizeChanged = adaptiveSizeChanged || _sizeChanged;
      _hostMutation = adaptiveHostMutation || _hostMutation;
      _contentMutation = adaptiveContentMutation || _contentMutation;
      _paddingStyleChanged = adaptivePaddingStyleChanged || _paddingStyleChanged;
    });

    if (isNumber(scrollOffsetX)) {
      scrollLeft(_viewport, scrollOffsetX);
    }

    if (isNumber(scrollOffsetY)) {
      scrollTop(_viewport, scrollOffsetY);
    }
  };

  const onSizeChanged = (directionIsRTL) => {
    const sizeChanged = !directionIsRTL;
    updateLifecycles({
      _directionIsRTL: directionIsRTL,
      _sizeChanged: sizeChanged,
    });
  };

  const onTrinsicChanged = (heightIntrinsic) => {
    updateLifecycles({
      _heightIntrinsic: heightIntrinsic,
    });
  };

  const onHostMutation = () => {
    requestAnimationFrame(() => {
      updateLifecycles({
        _hostMutation: true,
      });
    });
  };

  const onContentMutation = () => {
    requestAnimationFrame(() => {
      updateLifecycles({
        _contentMutation: true,
      });
    });
  };

  const trinsicObserver = _content && createTrinsicObserver(_host, onTrinsicChanged);

  const sizeObserver = createSizeObserver(_host, onSizeChanged, {
    _appear: true,
    _direction: !_nativeScrollbarStyling,
  });
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

  const update = (changedOptions, force) => {
    updateLifecycles(null, changedOptions, force);
  };

  const envUpdateListener = update.bind(null, null, true);
  addEnvironmentListener(envUpdateListener);
  console.log(getEnvironment());
  return {
    _update: update,

    _destroy() {
      removeEnvironmentListener(envUpdateListener);
    },
  };
};

const OverlayScrollbars = (target, options, extensions) => {
  const { _getDefaultOptions } = getEnvironment();
  const currentOptions = assignDeep({}, _getDefaultOptions(), validateOptions(options || {}, optionsTemplate, null, true)._validated);
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

export default OverlayScrollbars;
//# sourceMappingURL=overlayscrollbars.esm.js.map
