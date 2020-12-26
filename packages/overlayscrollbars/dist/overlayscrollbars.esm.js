const type = (obj) => {
  if (obj === undefined) return `${obj}`;
  if (obj === null) return `${obj}`;
  return Object.prototype.toString
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
function isUndefined(obj) {
  return obj === undefined;
}
function isNull(obj) {
  return obj === null;
}
function isArray(obj) {
  return Array.isArray(obj);
}
function isObject(obj) {
  return typeof obj === 'object' && !isArray(obj) && !isNull(obj);
}
function isArrayLike(obj) {
  const length = !!obj && obj.length;
  return isArray(obj) || (!isFunction(obj) && isNumber(length) && length > -1 && length % 1 == 0);
}
function isPlainObject(obj) {
  if (!obj || !isObject(obj) || type(obj) !== 'object') return false;
  let key;
  const proto = 'prototype';
  const { hasOwnProperty } = Object[proto];
  const hasOwnConstructor = hasOwnProperty.call(obj, 'constructor');
  const hasIsPrototypeOf = obj.constructor && obj.constructor[proto] && hasOwnProperty.call(obj.constructor[proto], 'isPrototypeOf');

  if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
    return false;
  }

  for (key in obj) {
  }

  return isUndefined(key) || hasOwnProperty.call(obj, key);
}
function isHTMLElement(obj) {
  const instaceOfRightHandSide = window.HTMLElement;
  const doInstanceOf = isObject(instaceOfRightHandSide) || isFunction(instaceOfRightHandSide);
  return !!(doInstanceOf ? obj instanceof instaceOfRightHandSide : obj && isObject(obj) && obj.nodeType === 1 && isString(obj.nodeName));
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
  elm == null ? void 0 : elm.removeAttribute(attrName);
};
function scrollLeft(elm, value) {
  return getSetProp('scrollLeft', 0, elm, value);
}
function scrollTop(elm, value) {
  return getSetProp('scrollTop', 0, elm, value);
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
const runEach = (arr) => {
  if (arr instanceof Set) {
    arr.forEach((fn) => fn && fn());
  } else {
    each(arr, (fn) => fn && fn());
  }
};

const matches = (elm, selector) => {
  if (elm) {
    const fn = Element.prototype.matches || Element.prototype.msMatchesSelector;
    return fn.call(elm, selector);
  }

  return false;
};
const is = (elm, selector) => matches(elm, selector);
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

      parentElm.insertBefore(fragment, anchor);
    }
  }
};

const appendChildren = (node, children) => {
  before(node, null, children);
};
const prependChildren = (node, children) => {
  before(node, node && node.firstChild, children);
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
const getBoundingClientRect = (elm) => elm.getBoundingClientRect();

let passiveEventsSupport;

const supportPassiveEvents = () => {
  if (passiveEventsSupport === undefined) {
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

const off = (target, eventNames, listener, capture) => {
  each(eventNames.split(' '), (eventName) => {
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
  each(eventNames.split(' '), (eventName) => {
    const finalListener = once
      ? (evt) => {
          target.removeEventListener(eventName, finalListener, capture);
          listener && listener(evt);
        }
      : listener;
    offListeners.push(off.bind(null, target, eventName, finalListener, capture));
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
const equalTRBL = (a, b) => equal(a, b, ['t', 'r', 'b', 'l']);

const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
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

const parseToZeroOrNumber = (value, toFloat) => {
  const num = toFloat ? parseFloat(value) : parseInt(value, 10);
  return Number.isNaN(num) ? 0 : num;
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
const topRightBottomLeft = (elm, property) => {
  const finalProp = property || '';
  const top = `${finalProp}-top`;
  const right = `${finalProp}-right`;
  const bottom = `${finalProp}-bottom`;
  const left = `${finalProp}-left`;
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

function createCache(cacheUpdateInfo, isReference) {
  const cache = {};
  const allProps = keys(cacheUpdateInfo);
  each(allProps, (prop) => {
    cache[prop] = {
      _changed: false,
      _value: isReference ? cacheUpdateInfo[prop] : undefined,
    };
  });

  const updateCacheProp = (prop, value, equal) => {
    const curr = cache[prop]._value;
    cache[prop]._value = value;
    cache[prop]._previous = curr;
    cache[prop]._changed = equal ? !equal(curr, value) : curr !== value;
  };

  const flush = (props, force) => {
    const result = assignDeep({}, cache, {
      _anythingChanged: false,
    });
    each(props, (prop) => {
      const changed = force || cache[prop]._changed;
      result._anythingChanged = result._anythingChanged || changed;
      result[prop]._changed = changed;
      cache[prop]._changed = false;
    });
    return result;
  };

  return (propsToUpdate, force) => {
    const finalPropsToUpdate = (isString(propsToUpdate) ? [propsToUpdate] : propsToUpdate) || allProps;
    each(finalPropsToUpdate, (prop) => {
      const cacheVal = cache[prop];
      const curr = cacheUpdateInfo[prop];
      const arr = isReference ? false : isArray(curr);
      const value = arr ? curr[0] : curr;
      const equal = arr ? curr[1] : null;
      updateCacheProp(prop, isReference ? value : value(cacheVal._value, cacheVal._previous), equal);
    });
    return flush(finalPropsToUpdate, force);
  };
}

const firstLetterToUpper = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const getDummyStyle = () => createDiv().style;

const cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-'];
const jsPrefixes = ['WebKit', 'Moz', 'O', 'MS', 'webkit', 'moz', 'o', 'ms'];
const jsCache = {};
const cssCache = {};
const cssProperty = (name) => {
  let result = cssCache[name];

  if (hasOwnProperty(cssCache, name)) {
    return result;
  }

  const uppercasedName = firstLetterToUpper(name);
  const elmStyle = getDummyStyle();
  each(cssPrefixes, (prefix) => {
    const prefixWithoutDashes = prefix.replace(/-/g, '');
    const resultPossibilities = [name, prefix + name, prefixWithoutDashes + uppercasedName, firstLetterToUpper(prefixWithoutDashes) + uppercasedName];
    result = resultPossibilities.find((resultPossibility) => elmStyle[resultPossibility] !== undefined);
    return !result;
  });
  cssCache[name] = result;
  return result;
};
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

const { stringify } = JSON;
const templateTypePrefixSuffix = ['__TPL_', '_TYPE__'];
const optionsTemplateTypes = ['boolean', 'number', 'string', 'array', 'object', 'function', 'null'].reduce((result, item) => {
  result[item] = templateTypePrefixSuffix[0] + item + templateTypePrefixSuffix[1];
  return result;
}, {});

const validateRecursive = (options, template, optionsDiff, doWriteErrors, propPath) => {
  const validatedOptions = {};

  const optionsCopy = _extends_1({}, options);

  const props = keys(template).filter((prop) => hasOwnProperty(options, prop));
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
        const isEnumString = typeString === undefined;

        if (isEnumString && isString(optionsValue)) {
          const enumStringSplit = currTemplateType.split(' ');
          isValid = !!enumStringSplit.find((possibility) => possibility === optionsValue);
          errorEnumStrings.push(...enumStringSplit);
        } else {
          isValid = optionsTemplateTypes[optionsValueType] === currTemplateType;
        }

        errorPossibleTypes.push(isEnumString ? optionsTemplateTypes.string : typeString);
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

let environmentInstance;
const { abs, round } = Math;
const environmentElmId = 'os-environment';
const classNameFlexboxGlue = 'flexbox-glue';
const classNameFlexboxGlueMax = `${classNameFlexboxGlue}-max`;

const getNativeScrollbarSize = (body, measureElm) => {
  appendChildren(body, measureElm);
  const cSize = clientSize(measureElm);
  const oSize = offsetSize(measureElm);
  return {
    x: oSize.h - cSize.h,
    y: oSize.w - cSize.w,
  };
};

const getNativeScrollbarStyling = (testElm) => {
  let result = false;
  addClass(testElm, 'os-viewport-scrollbar-styled');

  try {
    result =
      style(testElm, 'scrollbar-width') === 'none' || window.getComputedStyle(testElm, '::-webkit-scrollbar').getPropertyValue('display') === 'none';
  } catch (ex) {}

  return result;
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
  addClass(parentElm, classNameFlexboxGlue);
  const minOffsetsizeParent = offsetSize(parentElm);
  const minOffsetsize = offsetSize(childElm);
  const supportsMin = equalWH(minOffsetsize, minOffsetsizeParent);
  addClass(parentElm, classNameFlexboxGlueMax);
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
  const envDOM = createDOM(`<div id="${environmentElmId}"><div></div></div>`);
  const envElm = envDOM[0];
  const envChildElm = envElm.firstChild;
  const onChangedListener = new Set();
  const nativeScrollBarSize = getNativeScrollbarSize(body, envElm);
  const nativeScrollbarIsOverlaid = {
    x: nativeScrollBarSize.x === 0,
    y: nativeScrollBarSize.y === 0,
  };
  const env = {
    _autoUpdateLoop: false,
    _nativeScrollbarSize: nativeScrollBarSize,
    _nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
    _nativeScrollbarStyling: getNativeScrollbarStyling(envElm),
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
  removeAttr(envElm, 'class');
  removeElements(envElm);

  if (!nativeScrollbarIsOverlaid.x || !nativeScrollbarIsOverlaid.y) {
    let size = windowSize();
    let dpr = getWindowDPR();
    let scrollbarSize = nativeScrollBarSize;
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

const createLifecycleBase = (defaultOptionsWithTemplate, cacheUpdateInfo, initialOptions, updateFunction) => {
  const { _template: optionsTemplate, _options: defaultOptions } = transformOptions(defaultOptionsWithTemplate);
  const options = assignDeep({}, defaultOptions, validateOptions(initialOptions || {}, optionsTemplate, null, true)._validated);
  const cacheChange = createCache(cacheUpdateInfo);
  const cacheOptions = createCache(options, true);

  const update = (hints) => {
    const hasForce = isBoolean(hints._force);
    const force = hints._force === true;
    const changedCache = cacheChange(force ? null : hints._changedCache || (hasForce ? null : []), force);
    const changedOptions = cacheOptions(force ? null : hints._changedOptions, !!hints._changedOptions || force);

    if (changedOptions._anythingChanged || changedCache._anythingChanged) {
      updateFunction(changedOptions, changedCache);
    }
  };

  update({
    _force: true,
  });
  return {
    _options(newOptions) {
      if (newOptions) {
        const { _validated: changedOptions } = validateOptions(newOptions, optionsTemplate, options, true);
        assignDeep(options, changedOptions);
        update({
          _changedOptions: keys(changedOptions),
        });
      }

      return options;
    },

    _update: (force) => {
      update({
        _force: !!force,
      });
    },
    _updateCache: (cachePropsToUpdate) => {
      update({
        _changedCache: cachePropsToUpdate,
      });
    },
  };
};

const overflowBehaviorAllowedValues = 'visible-hidden visible-scroll scroll hidden';
const cssMarginEnd = cssProperty('margin-inline-end');
const cssBorderEnd = cssProperty('border-inline-end');
const createStructureLifecycle = (target, initialOptions) => {
  const { host, viewport, content } = target;
  const destructFns = [];
  const env = getEnvironment();
  const scrollbarsOverlaid = env._nativeScrollbarIsOverlaid;
  const supportsScrollbarStyling = env._nativeScrollbarStyling;
  const supportFlexboxGlue = env._flexboxGlue;
  const directionObserverObsolete = (cssMarginEnd && cssBorderEnd) || supportsScrollbarStyling || scrollbarsOverlaid.y;
  const { _options, _update, _updateCache } = createLifecycleBase(
    {
      paddingAbsolute: [false, optionsTemplateTypes.boolean],
      overflowBehavior: {
        x: ['scroll', overflowBehaviorAllowedValues],
        y: ['scroll', overflowBehaviorAllowedValues],
      },
    },
    {
      padding: [() => topRightBottomLeft(host, 'padding'), equalTRBL],
    },
    initialOptions,
    (options, cache) => {
      const { _value: paddingAbsolute, _changed: paddingAbsoluteChanged } = options.paddingAbsolute;
      const { _value: padding, _changed: paddingChanged } = cache.padding;

      if (paddingAbsoluteChanged || paddingChanged) {
        const paddingStyle = {
          t: 0,
          r: 0,
          b: 0,
          l: 0,
        };

        if (!paddingAbsolute) {
          paddingStyle.t = -padding.t;
          paddingStyle.r = -(padding.r + padding.l);
          paddingStyle.b = -(padding.b + padding.t);
          paddingStyle.l = -padding.l;
        }

        if (!supportsScrollbarStyling) {
          paddingStyle.r -= env._nativeScrollbarSize.y;
          paddingStyle.b -= env._nativeScrollbarSize.x;
        }

        style(viewport, {
          top: paddingStyle.t,
          left: paddingStyle.l,
          'margin-right': paddingStyle.r,
          'margin-bottom': paddingStyle.b,
        });
      }

      console.log(options);
      console.log(cache);
    }
  );

  const onSizeChanged = () => {
    _updateCache('padding');
  };

  const onTrinsicChanged = (widthIntrinsic, heightIntrinsic) => {
    if (heightIntrinsic) {
      style(content, {
        height: 'auto',
      });
    } else {
      style(content, {
        height: '100%',
      });
    }
  };

  return {
    _options,
    _update,
    _onSizeChanged: onSizeChanged,
    _onTrinsicChanged: onTrinsicChanged,

    _destruct() {
      runEach(destructFns);
    },
  };
};

const animationStartEventName = 'animationstart';
const scrollEventName = 'scroll';
const scrollAmount = 3333333;
const ResizeObserverConstructor = jsAPI('ResizeObserver');
const classNameSizeObserver = 'os-size-observer';
const classNameSizeObserverAppear = `${classNameSizeObserver}-appear`;
const classNameSizeObserverListener = `${classNameSizeObserver}-listener`;
const classNameSizeObserverListenerItem = `${classNameSizeObserverListener}-item`;
const classNameSizeObserverListenerItemFinal = `${classNameSizeObserverListenerItem}-final`;
const cAF = cancelAnimationFrame;
const rAF = requestAnimationFrame;

const getDirection = (elm) => style(elm, 'direction');

const createSizeObserver = (target, onSizeChangedCallback, options) => {
  const { _direction: direction = false, _appear: appear = false } = options || {};

  const rtlScrollBehavior = getEnvironment()._rtlScrollBehavior;

  const baseElements = createDOM(`<div class="${classNameSizeObserver}"><div class="${classNameSizeObserverListener}"></div></div>`);
  const sizeObserver = baseElements[0];
  const listenerElement = sizeObserver.firstChild;

  const onSizeChangedCallbackProxy = (dir) => {
    if (direction) {
      const rtl = getDirection(sizeObserver) === 'rtl';
      scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
      scrollTop(sizeObserver, scrollAmount);
    }

    onSizeChangedCallback(isString(dir) ? dir : undefined);
  };

  const offListeners = [];
  let appearCallback = appear ? onSizeChangedCallbackProxy : null;

  if (ResizeObserverConstructor) {
    const resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
    resizeObserverInstance.observe(listenerElement);
    offListeners.push(() => resizeObserverInstance.disconnect());
  } else {
    const observerElementChildren = createDOM(
      `<div class="${classNameSizeObserverListenerItem}" dir="ltr"><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}"></div></div><div class="${classNameSizeObserverListenerItem}"><div class="${classNameSizeObserverListenerItemFinal}" style="width: 200%; height: 200%"></div></div></div>`
    );
    appendChildren(listenerElement, observerElementChildren);
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

    const onResized = function onResized() {
      rAFId = 0;

      if (!isDirty) {
        return;
      }

      cacheSize = currSize;
      onSizeChangedCallbackProxy();
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

    offListeners.push(on(expandElement, scrollEventName, onScroll));
    offListeners.push(on(shrinkElement, scrollEventName, onScroll));
    style(expandElementChild, {
      width: scrollAmount,
      height: scrollAmount,
    });
    reset();
    appearCallback = appear ? () => onScroll() : reset;
  }

  if (direction) {
    let dirCache;
    offListeners.push(
      on(sizeObserver, scrollEventName, (event) => {
        const dir = getDirection(sizeObserver);
        const changed = dir !== dirCache;

        if (changed) {
          if (dir === 'rtl') {
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

          dirCache = dir;
          onSizeChangedCallbackProxy(dir);
        }

        preventDefault(event);
        stopPropagation(event);
        return false;
      })
    );
  }

  if (appearCallback) {
    addClass(sizeObserver, classNameSizeObserverAppear);
    offListeners.push(on(sizeObserver, animationStartEventName, appearCallback));
  }

  prependChildren(target, sizeObserver);
  return () => {
    runEach(offListeners);
    removeElements(sizeObserver);
  };
};

const classNameTrinsicObserver = 'os-trinsic-observer';
const IntersectionObserverConstructor = jsAPI('IntersectionObserver');
const createTrinsicObserver = (target, onTrinsicChangedCallback) => {
  const trinsicObserver = createDOM(`<div class="${classNameTrinsicObserver}"></div>`)[0];
  const offListeners = [];
  let heightIntrinsic = false;

  if (IntersectionObserverConstructor) {
    const intersectionObserverInstance = new IntersectionObserverConstructor(
      (entries) => {
        if (entries && entries.length > 0) {
          const last = entries.pop();

          if (last) {
            const newHeightIntrinsic = last.isIntersecting || last.intersectionRatio > 0;

            if (newHeightIntrinsic !== heightIntrinsic) {
              onTrinsicChangedCallback(false, newHeightIntrinsic);
              heightIntrinsic = newHeightIntrinsic;
            }
          }
        }
      },
      {
        root: target,
      }
    );
    intersectionObserverInstance.observe(trinsicObserver);
    offListeners.push(() => intersectionObserverInstance.disconnect());
  } else {
    offListeners.push(
      createSizeObserver(trinsicObserver, () => {
        const newSize = offsetSize(trinsicObserver);
        const newHeightIntrinsic = newSize.h === 0;

        if (newHeightIntrinsic !== heightIntrinsic) {
          onTrinsicChangedCallback(false, newHeightIntrinsic);
          heightIntrinsic = newHeightIntrinsic;
        }
      })
    );
  }

  prependChildren(target, trinsicObserver);
  return () => {
    runEach(offListeners);
    removeElements(trinsicObserver);
  };
};

const classNameHost = 'os-host';
const classNameViewport = 'os-viewport';
const classNameContent = 'os-content';

const normalizeTarget = (target) => {
  if (isHTMLElement(target)) {
    const isTextarea = is(target, 'textarea');

    const _host = isTextarea ? createDiv() : target;

    const _viewport = createDiv(classNameViewport);

    const _content = createDiv(classNameContent);

    appendChildren(_viewport, _content);
    appendChildren(_content, contents(target));
    appendChildren(target, _viewport);
    addClass(_host, classNameHost);
    return {
      target,
      host: _host,
      viewport: _viewport,
      content: _content,
    };
  }

  const { host, viewport, content } = target;
  addClass(host, classNameHost);
  addClass(viewport, classNameViewport);
  addClass(content, classNameContent);
  return target;
};

const OverlayScrollbars = (target, options, extensions) => {
  const osTarget = normalizeTarget(target);
  const lifecycles = [];
  const { host } = osTarget;
  lifecycles.push(createStructureLifecycle(osTarget));

  const onSizeChanged = (direction) => {
    if (direction) {
      each(lifecycles, (lifecycle) => {
        lifecycle._onDirectionChanged && lifecycle._onDirectionChanged(direction);
      });
    } else {
      each(lifecycles, (lifecycle) => {
        lifecycle._onSizeChanged && lifecycle._onSizeChanged();
      });
    }
  };

  const onTrinsicChanged = (widthIntrinsic, heightIntrinsic) => {
    each(lifecycles, (lifecycle) => {
      lifecycle._onTrinsicChanged && lifecycle._onTrinsicChanged(widthIntrinsic, heightIntrinsic);
    });
  };

  createSizeObserver(host, onSizeChanged, {
    _appear: true,
    _direction: true,
  });
  createTrinsicObserver(host, onTrinsicChanged);
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
