(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.OverlayScrollbars = factory());
})(this, (function () { 'use strict';

  function createCache(options, update) {
    var _initialValue = options._initialValue,
        _equal = options._equal,
        _alwaysUpdateValues = options._alwaysUpdateValues;
    var _value = _initialValue;

    var _previous;

    var cacheUpdateContextual = function cacheUpdateContextual(newValue, force) {
      var curr = _value;
      var newVal = newValue;
      var changed = force || (_equal ? !_equal(curr, newVal) : curr !== newVal);

      if (changed || _alwaysUpdateValues) {
        _value = newVal;
        _previous = curr;
      }

      return [_value, changed, _previous];
    };

    var cacheUpdateIsolated = function cacheUpdateIsolated(force) {
      return cacheUpdateContextual(update(_value, _previous), force);
    };

    var getCurrentCache = function getCurrentCache(force) {
      return [_value, !!force, _previous];
    };

    return [update ? cacheUpdateIsolated : cacheUpdateContextual, getCurrentCache];
  }

  var ElementNodeType = Node.ELEMENT_NODE;
  var _Object$prototype = Object.prototype,
      toString = _Object$prototype.toString,
      hasOwnProperty$1 = _Object$prototype.hasOwnProperty;
  function isUndefined(obj) {
    return obj === undefined;
  }
  function isNull(obj) {
    return obj === null;
  }
  var type = function type(obj) {
    return isUndefined(obj) || isNull(obj) ? "" + obj : toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
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
    var length = !!obj && obj.length;
    var lengthCorrectFormat = isNumber(length) && length > -1 && length % 1 == 0;
    return isArray(obj) || !isFunction(obj) && lengthCorrectFormat ? length > 0 && isObject(obj) ? length - 1 in obj : true : false;
  }
  function isPlainObject(obj) {
    if (!obj || !isObject(obj) || type(obj) !== 'object') return false;
    var key;
    var cstr = 'constructor';
    var ctor = obj[cstr];
    var ctorProto = ctor && ctor.prototype;
    var hasOwnConstructor = hasOwnProperty$1.call(obj, cstr);
    var hasIsPrototypeOf = ctorProto && hasOwnProperty$1.call(ctorProto, 'isPrototypeOf');

    if (ctor && !hasOwnConstructor && !hasIsPrototypeOf) {
      return false;
    }

    for (key in obj) {}

    return isUndefined(key) || hasOwnProperty$1.call(obj, key);
  }
  function isHTMLElement(obj) {
    var instanceofObj = window.HTMLElement;
    return obj ? instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType : false;
  }
  function isElement(obj) {
    var instanceofObj = window.Element;
    return obj ? instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType : false;
  }

  function each(source, callback) {
    if (isArrayLike(source)) {
      for (var i = 0; i < source.length; i++) {
        if (callback(source[i], i, source) === false) {
          break;
        }
      }
    } else if (source) {
      each(Object.keys(source), function (key) {
        return callback(source[key], key, source);
      });
    }

    return source;
  }
  var indexOf = function indexOf(arr, item, fromIndex) {
    return isArray(arr) ? arr.indexOf(item, fromIndex) : -1;
  };
  var push = function push(array, items, arrayIsSingleItem) {
    !arrayIsSingleItem && !isString(items) && isArrayLike(items) ? Array.prototype.push.apply(array, items) : array.push(items);
    return array;
  };
  var from = function from(arr) {
    if (Array.from) {
      return Array.from(arr);
    }

    var result = [];
    each(arr, function (elm) {
      push(result, elm);
    });
    return result;
  };
  var isEmptyArray = function isEmptyArray(array) {
    return !!array && array.length === 0;
  };
  var runEach = function runEach(arr, p1) {
    var runFn = function runFn(fn) {
      return fn && fn(p1);
    };

    if (arr instanceof Set) {
      arr.forEach(runFn);
    } else {
      each(arr, runFn);
    }
  };

  var hasOwnProperty = function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
  var keys = function keys(obj) {
    return obj ? Object.keys(obj) : [];
  };
  function assignDeep(target, object1, object2, object3, object4, object5, object6) {
    var sources = [object1, object2, object3, object4, object5, object6];

    if ((typeof target !== 'object' || isNull(target)) && !isFunction(target)) {
      target = {};
    }

    each(sources, function (source) {
      each(keys(source), function (key) {
        var copy = source[key];

        if (target === copy) {
          return true;
        }

        var copyIsArray = isArray(copy);

        if (copy && (isPlainObject(copy) || copyIsArray)) {
          var src = target[key];
          var clone = src;

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
    for (var name in obj) {
      return false;
    }

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
  var removeAttr = function removeAttr(elm, attrName) {
    elm && elm.removeAttribute(attrName);
  };
  function scrollLeft(elm, value) {
    return getSetProp('scrollLeft', 0, elm, value);
  }
  function scrollTop(elm, value) {
    return getSetProp('scrollTop', 0, elm, value);
  }

  var elmPrototype = Element.prototype;

  var find = function find(selector, elm) {
    var arr = [];
    var rootElm = elm ? isElement(elm) ? elm : null : document;
    return rootElm ? push(arr, rootElm.querySelectorAll(selector)) : arr;
  };

  var is = function is(elm, selector) {
    if (isElement(elm)) {
      var fn = elmPrototype.matches || elmPrototype.msMatchesSelector;
      return fn.call(elm, selector);
    }

    return false;
  };

  var contents = function contents(elm) {
    return elm ? from(elm.childNodes) : [];
  };

  var parent = function parent(elm) {
    return elm ? elm.parentElement : null;
  };

  var before = function before(parentElm, preferredAnchor, insertedElms) {
    if (insertedElms) {
      var anchor = preferredAnchor;
      var fragment;

      if (parentElm) {
        if (isArrayLike(insertedElms)) {
          fragment = document.createDocumentFragment();
          each(insertedElms, function (insertedElm) {
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

  var appendChildren = function appendChildren(node, children) {
    before(node, null, children);
  };
  var prependChildren = function prependChildren(node, children) {
    before(node, node && node.firstChild, children);
  };
  var insertBefore = function insertBefore(node, insertedNodes) {
    before(parent(node), node, insertedNodes);
  };
  var insertAfter = function insertAfter(node, insertedNodes) {
    before(parent(node), node && node.nextSibling, insertedNodes);
  };
  var removeElements = function removeElements(nodes) {
    if (isArrayLike(nodes)) {
      each(from(nodes), function (e) {
        return removeElements(e);
      });
    } else if (nodes) {
      var parentElm = parent(nodes);

      if (parentElm) {
        parentElm.removeChild(nodes);
      }
    }
  };

  var createDiv = function createDiv(classNames) {
    var div = document.createElement('div');

    if (classNames) {
      attr(div, 'class', classNames);
    }

    return div;
  };
  var createDOM = function createDOM(html) {
    var createdDiv = createDiv();
    createdDiv.innerHTML = html.trim();
    return each(contents(createdDiv), function (elm) {
      return removeElements(elm);
    });
  };

  var firstLetterToUpper = function firstLetterToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  var getDummyStyle = function getDummyStyle() {
    return createDiv().style;
  };

  var cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-'];
  var jsPrefixes = ['WebKit', 'Moz', 'O', 'MS', 'webkit', 'moz', 'o', 'ms'];
  var jsCache = {};
  var cssCache = {};
  var cssProperty = function cssProperty(name) {
    var result = cssCache[name];

    if (hasOwnProperty(cssCache, name)) {
      return result;
    }

    var uppercasedName = firstLetterToUpper(name);
    var elmStyle = getDummyStyle();
    each(cssPrefixes, function (prefix) {
      var prefixWithoutDashes = prefix.replace(/-/g, '');
      var resultPossibilities = [name, prefix + name, prefixWithoutDashes + uppercasedName, firstLetterToUpper(prefixWithoutDashes) + uppercasedName];
      return !(result = resultPossibilities.find(function (resultPossibility) {
        return elmStyle[resultPossibility] !== undefined;
      }));
    });
    return cssCache[name] = result || '';
  };
  var jsAPI = function jsAPI(name) {
    var result = jsCache[name] || window[name];

    if (hasOwnProperty(jsCache, name)) {
      return result;
    }

    each(jsPrefixes, function (prefix) {
      result = result || window[prefix + firstLetterToUpper(name)];
      return !result;
    });
    jsCache[name] = result;
    return result;
  };

  var MutationObserverConstructor = jsAPI('MutationObserver');
  var IntersectionObserverConstructor = jsAPI('IntersectionObserver');
  var ResizeObserverConstructor = jsAPI('ResizeObserver');
  var cAF = jsAPI('cancelAnimationFrame');
  var rAF = jsAPI('requestAnimationFrame');

  var rnothtmlwhite = /[^\x20\t\r\n\f]+/g;

  var classListAction = function classListAction(elm, className, action) {
    var clazz;
    var i = 0;
    var result = false;

    if (elm && isString(className)) {
      var classes = className.match(rnothtmlwhite) || [];
      result = classes.length > 0;

      while (clazz = classes[i++]) {
        result = !!action(elm.classList, clazz) && result;
      }
    }

    return result;
  };
  var addClass = function addClass(elm, className) {
    classListAction(elm, className, function (classList, clazz) {
      return classList.add(clazz);
    });
  };
  var removeClass = function removeClass(elm, className) {
    classListAction(elm, className, function (classList, clazz) {
      return classList.remove(clazz);
    });
  };
  var diffClass = function diffClass(classNameA, classNameB) {
    var classNameASplit = classNameA && classNameA.split(' ');
    var classNameBSplit = classNameB && classNameB.split(' ');
    var tempObj = {};
    each(classNameASplit, function (className) {
      tempObj[className] = 1;
    });
    each(classNameBSplit, function (className) {
      if (tempObj[className]) {
        delete tempObj[className];
      } else {
        tempObj[className] = 1;
      }
    });
    return keys(tempObj);
  };

  var zeroObj$1 = {
    w: 0,
    h: 0
  };
  var windowSize = function windowSize() {
    return {
      w: window.innerWidth,
      h: window.innerHeight
    };
  };
  var offsetSize = function offsetSize(elm) {
    return elm ? {
      w: elm.offsetWidth,
      h: elm.offsetHeight
    } : zeroObj$1;
  };
  var clientSize = function clientSize(elm) {
    return elm ? {
      w: elm.clientWidth,
      h: elm.clientHeight
    } : zeroObj$1;
  };
  var scrollSize = function scrollSize(elm) {
    return elm ? {
      w: elm.scrollWidth,
      h: elm.scrollHeight
    } : zeroObj$1;
  };
  var getBoundingClientRect = function getBoundingClientRect(elm) {
    return elm.getBoundingClientRect();
  };

  var passiveEventsSupport;

  var supportPassiveEvents = function supportPassiveEvents() {
    if (isUndefined(passiveEventsSupport)) {
      passiveEventsSupport = false;

      try {
        window.addEventListener('test', null, Object.defineProperty({}, 'passive', {
          get: function get() {
            passiveEventsSupport = true;
          }
        }));
      } catch (e) {}
    }

    return passiveEventsSupport;
  };

  var splitEventNames = function splitEventNames(eventNames) {
    return eventNames.split(' ');
  };

  var off = function off(target, eventNames, listener, capture) {
    each(splitEventNames(eventNames), function (eventName) {
      target.removeEventListener(eventName, listener, capture);
    });
  };
  var on = function on(target, eventNames, listener, options) {
    var doSupportPassiveEvents = supportPassiveEvents();
    var passive = doSupportPassiveEvents && options && options._passive || false;
    var capture = options && options._capture || false;
    var once = options && options._once || false;
    var offListeners = [];
    var nativeOptions = doSupportPassiveEvents ? {
      passive: passive,
      capture: capture
    } : capture;
    each(splitEventNames(eventNames), function (eventName) {
      var finalListener = once ? function (evt) {
        target.removeEventListener(eventName, finalListener, capture);
        listener && listener(evt);
      } : listener;
      push(offListeners, off.bind(null, target, eventName, finalListener, capture));
      target.addEventListener(eventName, finalListener, nativeOptions);
    });
    return runEach.bind(0, offListeners);
  };
  var stopPropagation = function stopPropagation(evt) {
    return evt.stopPropagation();
  };
  var preventDefault = function preventDefault(evt) {
    return evt.preventDefault();
  };
  var stopAndPrevent = function stopAndPrevent(evt) {
    return stopPropagation(evt) || preventDefault(evt);
  };

  var equal = function equal(a, b, props, propMutation) {
    if (a && b) {
      var result = true;
      each(props, function (prop) {
        var compareA = propMutation ? propMutation(a[prop]) : a[prop];
        var compareB = propMutation ? propMutation(b[prop]) : b[prop];

        if (compareA !== compareB) {
          result = false;
        }
      });
      return result;
    }

    return false;
  };
  var equalWH = function equalWH(a, b) {
    return equal(a, b, ['w', 'h']);
  };
  var equalTRBL = function equalTRBL(a, b) {
    return equal(a, b, ['t', 'r', 'b', 'l']);
  };
  var equalBCRWH = function equalBCRWH(a, b, round) {
    return equal(a, b, ['width', 'height'], round && function (value) {
      return Math.round(value);
    });
  };

  var clearTimeouts = function clearTimeouts(id) {
    id && window.clearTimeout(id);
    id && cAF(id);
  };

  var noop = function noop() {};
  var debounce = function debounce(functionToDebounce, options) {
    var timeoutId;
    var maxTimeoutId;
    var prevArguments;
    var latestArguments;

    var _ref = options || {},
        _timeout = _ref._timeout,
        _maxDelay = _ref._maxDelay,
        _mergeParams = _ref._mergeParams;

    var setT = window.setTimeout;

    var invokeFunctionToDebounce = function invokeFunctionToDebounce(args) {
      clearTimeouts(timeoutId);
      clearTimeouts(maxTimeoutId);
      maxTimeoutId = timeoutId = prevArguments = undefined;
      functionToDebounce.apply(this, args);
    };

    var mergeParms = function mergeParms(curr) {
      return _mergeParams && prevArguments ? _mergeParams(prevArguments, curr) : curr;
    };

    var flush = function flush() {
      if (timeoutId) {
        invokeFunctionToDebounce(mergeParms(latestArguments) || latestArguments);
      }
    };

    var debouncedFn = function debouncedFn() {
      var args = from(arguments);
      var finalTimeout = isFunction(_timeout) ? _timeout() : _timeout;
      var hasTimeout = isNumber(finalTimeout) && finalTimeout >= 0;

      if (hasTimeout) {
        var finalMaxWait = isFunction(_maxDelay) ? _maxDelay() : _maxDelay;
        var hasMaxWait = isNumber(finalMaxWait) && finalMaxWait >= 0;
        var setTimeoutFn = finalTimeout > 0 ? setT : rAF;
        var mergeParamsResult = mergeParms(args);
        var invokedArgs = mergeParamsResult || args;
        var boundInvoke = invokeFunctionToDebounce.bind(0, invokedArgs);
        clearTimeouts(timeoutId);
        timeoutId = setTimeoutFn(boundInvoke, finalTimeout);

        if (hasMaxWait && !maxTimeoutId) {
          maxTimeoutId = setT(flush, finalMaxWait);
        }

        prevArguments = latestArguments = invokedArgs;
      } else {
        invokeFunctionToDebounce(args);
      }
    };

    debouncedFn._flush = flush;
    return debouncedFn;
  };

  var cssNumber = {
    opacity: 1,
    zindex: 1
  };

  var parseToZeroOrNumber = function parseToZeroOrNumber(value, toFloat) {
    var num = toFloat ? parseFloat(value) : parseInt(value, 10);
    return Number.isNaN(num) ? 0 : num;
  };

  var adaptCSSVal = function adaptCSSVal(prop, val) {
    return !cssNumber[prop.toLowerCase()] && isNumber(val) ? val + "px" : val;
  };

  var getCSSVal = function getCSSVal(elm, computedStyle, prop) {
    return computedStyle != null ? computedStyle[prop] || computedStyle.getPropertyValue(prop) : elm.style[prop];
  };

  var setCSSVal = function setCSSVal(elm, prop, val) {
    try {
      if (elm) {
        var elmStyle = elm.style;

        if (!isUndefined(elmStyle[prop])) {
          elmStyle[prop] = adaptCSSVal(prop, val);
        } else {
          elmStyle.setProperty(prop, val);
        }
      }
    } catch (e) {}
  };

  function style(elm, styles) {
    var getSingleStyle = isString(styles);
    var getStyles = isArray(styles) || getSingleStyle;

    if (getStyles) {
      var getStylesResult = getSingleStyle ? '' : {};

      if (elm) {
        var computedStyle = window.getComputedStyle(elm, null);
        getStylesResult = getSingleStyle ? getCSSVal(elm, computedStyle, styles) : styles.reduce(function (result, key) {
          result[key] = getCSSVal(elm, computedStyle, key);
          return result;
        }, getStylesResult);
      }

      return getStylesResult;
    }

    each(keys(styles), function (key) {
      return setCSSVal(elm, key, styles[key]);
    });
  }
  var topRightBottomLeft = function topRightBottomLeft(elm, propertyPrefix, propertySuffix) {
    var finalPrefix = propertyPrefix ? propertyPrefix + "-" : '';
    var finalSuffix = propertySuffix ? "-" + propertySuffix : '';
    var top = finalPrefix + "top" + finalSuffix;
    var right = finalPrefix + "right" + finalSuffix;
    var bottom = finalPrefix + "bottom" + finalSuffix;
    var left = finalPrefix + "left" + finalSuffix;
    var result = style(elm, [top, right, bottom, left]);
    return {
      t: parseToZeroOrNumber(result[top]),
      r: parseToZeroOrNumber(result[right]),
      b: parseToZeroOrNumber(result[bottom]),
      l: parseToZeroOrNumber(result[left])
    };
  };

  var zeroObj = {
    x: 0,
    y: 0
  };
  var absoluteCoordinates = function absoluteCoordinates(elm) {
    var rect = elm ? getBoundingClientRect(elm) : 0;
    return rect ? {
      x: rect.left + window.pageYOffset,
      y: rect.top + window.pageXOffset
    } : zeroObj;
  };

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var _extends$1 = {exports: {}};

  (function (module) {
    function _extends() {
      module.exports = _extends = Object.assign ? Object.assign.bind() : function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      }, module.exports.__esModule = true, module.exports["default"] = module.exports;
      return _extends.apply(this, arguments);
    }

    module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })(_extends$1);

  var _extends = getDefaultExportFromCjs(_extends$1.exports);

  var stringify = JSON.stringify;
  var templateTypePrefixSuffix = ['__TPL_', '_TYPE__'];
  var optionsTemplateTypes = ['boolean', 'number', 'string', 'array', 'object', 'function', 'null'].reduce(function (result, item) {
    result[item] = templateTypePrefixSuffix[0] + item + templateTypePrefixSuffix[1];
    return result;
  }, {});

  var validateRecursive = function validateRecursive(options, template, optionsDiff, doWriteErrors, propPath) {
    var validatedOptions = {};

    var optionsCopy = _extends({}, options);

    var props = keys(template).filter(function (prop) {
      return hasOwnProperty(options, prop);
    });
    each(props, function (prop) {
      var optionsDiffValue = isUndefined(optionsDiff[prop]) ? {} : optionsDiff[prop];
      var optionsValue = options[prop];
      var templateValue = template[prop];
      var templateIsComplex = isPlainObject(templateValue);
      var propPrefix = propPath ? propPath + "." : '';

      if (templateIsComplex && isPlainObject(optionsValue)) {
        var validatedResult = validateRecursive(optionsValue, templateValue, optionsDiffValue, doWriteErrors, propPrefix + prop);
        validatedOptions[prop] = validatedResult._validated;
        optionsCopy[prop] = validatedResult._foreign;
        each([optionsCopy, validatedOptions], function (value) {
          if (isEmptyObject(value[prop])) {
            delete value[prop];
          }
        });
      } else if (!templateIsComplex) {
        var isValid = false;
        var errorEnumStrings = [];
        var errorPossibleTypes = [];
        var optionsValueType = type(optionsValue);
        var templateValueArr = !isArray(templateValue) ? [templateValue] : templateValue;
        each(templateValueArr, function (currTemplateType) {
          var typeString;
          each(optionsTemplateTypes, function (value, key) {
            if (value === currTemplateType) {
              typeString = key;
            }
          });
          var isEnumString = isUndefined(typeString);

          if (isEnumString && isString(optionsValue)) {
            var enumStringSplit = currTemplateType.split(' ');
            isValid = !!enumStringSplit.find(function (possibility) {
              return possibility === optionsValue;
            });
            push(errorEnumStrings, enumStringSplit);
          } else {
            isValid = optionsTemplateTypes[optionsValueType] === currTemplateType;
          }

          push(errorPossibleTypes, isEnumString ? optionsTemplateTypes.string : typeString);
          return !isValid;
        });

        if (isValid) {
          var isPrimitiveArr = isArray(optionsValue) && !optionsValue.some(function (val) {
            return !isNumber(val) && !isString(val) && !isBoolean(val);
          });
          var doStringifyComparison = isPrimitiveArr || isPlainObject(optionsValue);

          if (doStringifyComparison ? stringify(optionsValue) !== stringify(optionsDiffValue) : optionsValue !== optionsDiffValue) {
            validatedOptions[prop] = optionsValue;
          }
        } else if (doWriteErrors) {
          console.warn("" + ("The option \"" + propPrefix + prop + "\" wasn't set, because it doesn't accept the type [ " + optionsValueType.toUpperCase() + " ] with the value of \"" + optionsValue + "\".\r\n" + ("Accepted types are: [ " + errorPossibleTypes.join(', ').toUpperCase() + " ].\r\n")) + (errorEnumStrings.length > 0 ? "\r\nValid strings are: [ " + errorEnumStrings.join(', ') + " ]." : ''));
        }

        delete optionsCopy[prop];
      }
    });
    return {
      _foreign: optionsCopy,
      _validated: validatedOptions
    };
  };

  var validateOptions = function validateOptions(options, template, optionsDiff, doWriteErrors) {
    return validateRecursive(options, template, optionsDiff || {}, doWriteErrors || false);
  };

  var transformOptions = function transformOptions(optionsWithOptionsTemplate) {
    var result = {
      _template: {},
      _options: {}
    };
    each(keys(optionsWithOptionsTemplate), function (key) {
      var val = optionsWithOptionsTemplate[key];

      if (isArray(val)) {
        result._template[key] = val[1];
        result._options[key] = val[0];
      } else {
        var tmpResult = transformOptions(val);
        result._template[key] = tmpResult._template;
        result._options[key] = tmpResult._options;
      }
    });
    return result;
  };

  var classNameEnvironment = 'os-environment';
  var classNameEnvironmentFlexboxGlue = classNameEnvironment + "-flexbox-glue";
  var classNameEnvironmentFlexboxGlueMax = classNameEnvironmentFlexboxGlue + "-max";
  var classNameHost = 'os-host';
  var classNamePadding = 'os-padding';
  var classNameViewport = 'os-viewport';
  var classNameViewportArrange = classNameViewport + "-arrange";
  var classNameContent = 'os-content';
  var classNameViewportScrollbarStyling = classNameViewport + "-scrollbar-styled";
  var classNameSizeObserver = 'os-size-observer';
  var classNameSizeObserverAppear = classNameSizeObserver + "-appear";
  var classNameSizeObserverListener = classNameSizeObserver + "-listener";
  var classNameSizeObserverListenerScroll = classNameSizeObserverListener + "-scroll";
  var classNameSizeObserverListenerItem = classNameSizeObserverListener + "-item";
  var classNameSizeObserverListenerItemFinal = classNameSizeObserverListenerItem + "-final";
  var classNameTrinsicObserver = 'os-trinsic-observer';
  var classNameScrollbar = 'os-scrollbar';
  var classNameScrollbarHorizontal = classNameScrollbar + "-horizontal";
  var classNameScrollbarVertical = classNameScrollbar + "-vertical";
  var classNameScrollbarTrack = 'os-scrollbar-track';
  var classNameScrollbarHandle = 'os-scrollbar-handle';

  var numberAllowedValues = optionsTemplateTypes.number;
  var arrayNullValues = [optionsTemplateTypes.array, optionsTemplateTypes.null];
  var stringArrayNullAllowedValues = [optionsTemplateTypes.string, optionsTemplateTypes.array, optionsTemplateTypes.null];
  var booleanTrueTemplate = [true, optionsTemplateTypes.boolean];
  var booleanFalseTemplate = [false, optionsTemplateTypes.boolean];
  var resizeAllowedValues = 'none both horizontal vertical';
  var overflowAllowedValues = 'hidden scroll visible visible-hidden';
  var scrollbarsVisibilityAllowedValues = 'visible hidden auto';
  var scrollbarsAutoHideAllowedValues = 'never scroll leavemove';
  var defaultOptionsWithTemplate = {
    resize: ['none', resizeAllowedValues],
    paddingAbsolute: booleanFalseTemplate,
    updating: {
      elementEvents: [[['img', 'load']], arrayNullValues],
      attributes: [null, arrayNullValues],
      debounce: [[0, 33], [optionsTemplateTypes.number, optionsTemplateTypes.array, optionsTemplateTypes.null]]
    },
    overflow: {
      x: ['scroll', overflowAllowedValues],
      y: ['scroll', overflowAllowedValues]
    },
    scrollbars: {
      visibility: ['auto', scrollbarsVisibilityAllowedValues],
      autoHide: ['never', scrollbarsAutoHideAllowedValues],
      autoHideDelay: [800, numberAllowedValues],
      dragScroll: booleanTrueTemplate,
      clickScroll: booleanFalseTemplate,
      touch: booleanTrueTemplate
    },
    textarea: {
      dynWidth: booleanFalseTemplate,
      dynHeight: booleanFalseTemplate,
      inheritedAttrs: [['style', 'class'], stringArrayNullAllowedValues]
    },
    nativeScrollbarsOverlaid: {
      show: booleanFalseTemplate,
      initialize: booleanFalseTemplate
    },
    callbacks: {
      onUpdated: [null, [optionsTemplateTypes.function, optionsTemplateTypes.null]]
    }
  };

  var _transformOptions = transformOptions(defaultOptionsWithTemplate),
      optionsTemplate = _transformOptions._template,
      defaultOptions = _transformOptions._options;

  var environmentInstance;
  var abs$1 = Math.abs,
      round$1 = Math.round;

  var diffBiggerThanOne = function diffBiggerThanOne(valOne, valTwo) {
    var absValOne = abs$1(valOne);
    var absValTwo = abs$1(valTwo);
    return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
  };

  var getNativeScrollbarSize = function getNativeScrollbarSize(body, measureElm) {
    appendChildren(body, measureElm);
    var cSize = clientSize(measureElm);
    var oSize = offsetSize(measureElm);
    return {
      x: oSize.h - cSize.h,
      y: oSize.w - cSize.w
    };
  };

  var getNativeScrollbarStyling = function getNativeScrollbarStyling(testElm) {
    var result = false;
    addClass(testElm, classNameViewportScrollbarStyling);

    try {
      result = style(testElm, cssProperty('scrollbar-width')) === 'none' || window.getComputedStyle(testElm, '::-webkit-scrollbar').getPropertyValue('display') === 'none';
    } catch (ex) {}

    return result;
  };

  var getRtlScrollBehavior = function getRtlScrollBehavior(parentElm, childElm) {
    var strHidden = 'hidden';
    style(parentElm, {
      overflowX: strHidden,
      overflowY: strHidden,
      direction: 'rtl'
    });
    scrollLeft(parentElm, 0);
    var parentOffset = absoluteCoordinates(parentElm);
    var childOffset = absoluteCoordinates(childElm);
    scrollLeft(parentElm, -999);
    var childOffsetAfterScroll = absoluteCoordinates(childElm);
    return {
      i: parentOffset.x === childOffset.x,
      n: childOffset.x !== childOffsetAfterScroll.x
    };
  };

  var getFlexboxGlue = function getFlexboxGlue(parentElm, childElm) {
    addClass(parentElm, classNameEnvironmentFlexboxGlue);
    var minOffsetsizeParent = getBoundingClientRect(parentElm);
    var minOffsetsize = getBoundingClientRect(childElm);
    var supportsMin = equalBCRWH(minOffsetsize, minOffsetsizeParent, true);
    addClass(parentElm, classNameEnvironmentFlexboxGlueMax);
    var maxOffsetsizeParent = getBoundingClientRect(parentElm);
    var maxOffsetsize = getBoundingClientRect(childElm);
    var supportsMax = equalBCRWH(maxOffsetsize, maxOffsetsizeParent, true);
    return supportsMin && supportsMax;
  };

  var getWindowDPR = function getWindowDPR() {
    var dDPI = window.screen.deviceXDPI || 0;
    var sDPI = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || dDPI / sDPI;
  };

  var getDefaultInitializationStrategy = function getDefaultInitializationStrategy(nativeScrollbarStyling) {
    return {
      _host: null,
      _viewport: null,
      _padding: null,
      _content: null,
      _scrollbarsSlot: null
    };
  };

  var createEnvironment = function createEnvironment() {
    var _document = document,
        body = _document.body;
    var envDOM = createDOM("<div class=\"" + classNameEnvironment + "\"><div></div></div>");
    var envElm = envDOM[0];
    var envChildElm = envElm.firstChild;
    var onChangedListener = new Set();
    var nativeScrollbarSize = getNativeScrollbarSize(body, envElm);
    var nativeScrollbarStyling = getNativeScrollbarStyling(envElm);
    var nativeScrollbarIsOverlaid = {
      x: nativeScrollbarSize.x === 0,
      y: nativeScrollbarSize.y === 0
    };
    var defaultInitializationStrategy = getDefaultInitializationStrategy();
    var initializationStrategy = defaultInitializationStrategy;
    var defaultDefaultOptions = defaultOptions;
    var env = {
      _nativeScrollbarSize: nativeScrollbarSize,
      _nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
      _nativeScrollbarStyling: nativeScrollbarStyling,
      _cssCustomProperties: style(envElm, 'zIndex') === '-1',
      _rtlScrollBehavior: getRtlScrollBehavior(envElm, envChildElm),
      _flexboxGlue: getFlexboxGlue(envElm, envChildElm),
      _addListener: function _addListener(listener) {
        onChangedListener.add(listener);
      },
      _removeListener: function _removeListener(listener) {
        onChangedListener.delete(listener);
      },
      _getInitializationStrategy: function _getInitializationStrategy() {
        return _extends({}, initializationStrategy);
      },
      _setInitializationStrategy: function _setInitializationStrategy(newInitializationStrategy) {
        initializationStrategy = assignDeep({}, initializationStrategy, newInitializationStrategy);
      },
      _getDefaultOptions: function _getDefaultOptions() {
        return _extends({}, defaultDefaultOptions);
      },
      _setDefaultOptions: function _setDefaultOptions(newDefaultOptions) {
        defaultDefaultOptions = assignDeep({}, defaultDefaultOptions, newDefaultOptions);
      },
      _defaultInitializationStrategy: defaultInitializationStrategy,
      _defaultDefaultOptions: defaultDefaultOptions
    };
    removeAttr(envElm, 'style');
    removeElements(envElm);

    if (!nativeScrollbarStyling && (!nativeScrollbarIsOverlaid.x || !nativeScrollbarIsOverlaid.y)) {
      var size = windowSize();
      var dpr = getWindowDPR();
      var scrollbarSize = nativeScrollbarSize;
      window.addEventListener('resize', function () {
        if (onChangedListener.size) {
          var sizeNew = windowSize();
          var deltaSize = {
            w: sizeNew.w - size.w,
            h: sizeNew.h - size.h
          };
          if (deltaSize.w === 0 && deltaSize.h === 0) return;
          var deltaAbsSize = {
            w: abs$1(deltaSize.w),
            h: abs$1(deltaSize.h)
          };
          var deltaAbsRatio = {
            w: abs$1(round$1(sizeNew.w / (size.w / 100.0))),
            h: abs$1(round$1(sizeNew.h / (size.h / 100.0)))
          };
          var dprNew = getWindowDPR();
          var deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
          var difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
          var dprChanged = dprNew !== dpr && dpr > 0;
          var isZoom = deltaIsBigger && difference && dprChanged;

          if (isZoom) {
            var newScrollbarSize = environmentInstance._nativeScrollbarSize = getNativeScrollbarSize(body, envElm);
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

  var getEnvironment = function getEnvironment() {
    if (!environmentInstance) {
      environmentInstance = createEnvironment();
    }

    return environmentInstance;
  };

  var contentArrangeCounter = 0;

  var unwrap = function unwrap(elm) {
    appendChildren(parent(elm), contents(elm));
    removeElements(elm);
  };

  var createUniqueViewportArrangeElement = function createUniqueViewportArrangeElement() {
    var _getEnvironment = getEnvironment(),
        _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
        _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid,
        _cssCustomProperties = _getEnvironment._cssCustomProperties;

    var create = !_cssCustomProperties && !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);
    var result = create ? document.createElement('style') : false;

    if (result) {
      attr(result, 'id', classNameViewportArrange + "-" + contentArrangeCounter);
      contentArrangeCounter++;
    }

    return result;
  };

  var staticCreationFromStrategy = function staticCreationFromStrategy(target, initializationValue, strategy, elementClass) {
    var result = initializationValue ? initializationValue : isFunction(strategy) ? strategy(target) : strategy;
    return result ? result : createDiv(elementClass);
  };

  var dynamicCreationFromStrategy = function dynamicCreationFromStrategy(target, initializationValue, strategy, elementClass, defaultValue) {
    var takeInitializationValue = isBoolean(initializationValue) || initializationValue;
    var result = takeInitializationValue ? initializationValue : isFunction(strategy) ? strategy(target) : strategy;

    if (result === null) {
      return defaultValue ? createDiv(elementClass) : false;
    }

    return result === true ? createDiv(elementClass) : result;
  };

  var createStructureSetup = function createStructureSetup(target) {
    var _getEnvironment2 = getEnvironment(),
        _getInitializationStrategy = _getEnvironment2._getInitializationStrategy,
        _nativeScrollbarStyling = _getEnvironment2._nativeScrollbarStyling;

    var _getInitializationStr = _getInitializationStrategy(),
        hostInitializationStrategy = _getInitializationStr._host,
        viewportInitializationStrategy = _getInitializationStr._viewport,
        paddingInitializationStrategy = _getInitializationStr._padding,
        contentInitializationStrategy = _getInitializationStr._content;

    var targetIsElm = isHTMLElement(target);
    var targetStructureInitialization = target;
    var targetElement = targetIsElm ? target : targetStructureInitialization.target;
    var isTextarea = is(targetElement, 'textarea');
    var isBody = !isTextarea && is(targetElement, 'body');
    var ownerDocument = targetElement.ownerDocument;
    var bodyElm = ownerDocument.body;
    var wnd = ownerDocument.defaultView;
    var evaluatedTargetObj = {
      _target: targetElement,
      _host: isTextarea ? staticCreationFromStrategy(targetElement, targetStructureInitialization.host, hostInitializationStrategy, classNameHost) : targetElement,
      _viewport: staticCreationFromStrategy(targetElement, targetStructureInitialization.viewport, viewportInitializationStrategy, classNameViewport),
      _padding: dynamicCreationFromStrategy(targetElement, targetStructureInitialization.padding, paddingInitializationStrategy, classNamePadding, !_nativeScrollbarStyling),
      _content: dynamicCreationFromStrategy(targetElement, targetStructureInitialization.content, contentInitializationStrategy, classNameContent, false),
      _viewportArrange: createUniqueViewportArrangeElement()
    };
    var ctx = {
      _windowElm: wnd,
      _documentElm: ownerDocument,
      _htmlElm: parent(bodyElm),
      _bodyElm: bodyElm,
      _isTextarea: isTextarea,
      _isBody: isBody,
      _targetIsElm: targetIsElm
    };
    var generatedElements = keys(evaluatedTargetObj).reduce(function (arr, key) {
      var value = evaluatedTargetObj[key];
      return push(arr, value && !parent(value) ? value : false);
    }, []);

    var elementIsGenerated = function elementIsGenerated(elm) {
      return elm ? indexOf(generatedElements, elm) > -1 : null;
    };

    var _target = evaluatedTargetObj._target,
        _host = evaluatedTargetObj._host,
        _padding = evaluatedTargetObj._padding,
        _viewport = evaluatedTargetObj._viewport,
        _content = evaluatedTargetObj._content,
        _viewportArrange = evaluatedTargetObj._viewportArrange;
    var destroyFns = [];
    var isTextareaHostGenerated = isTextarea && elementIsGenerated(_host);
    var targetContents = isTextarea ? _target : contents([_content, _viewport, _padding, _host, _target].find(function (elm) {
      return elementIsGenerated(elm) === false;
    }));
    var contentSlot = _content || _viewport;

    if (isTextareaHostGenerated) {
      insertAfter(_target, _host);
      push(destroyFns, function () {
        insertAfter(_host, _target);
        removeElements(_host);
      });
    }

    appendChildren(contentSlot, targetContents);
    appendChildren(_host, _padding);
    appendChildren(_padding || _host, _viewport);
    appendChildren(_viewport, _content);
    addClass(_host, classNameHost);
    addClass(_padding, classNamePadding);
    addClass(_viewport, classNameViewport);
    addClass(_content, classNameContent);
    push(destroyFns, function () {
      if (targetIsElm) {
        appendChildren(_host, contents(contentSlot));
        removeElements(_padding || _viewport);
        removeClass(_host, classNameHost);
      } else {
        if (elementIsGenerated(_content)) {
          unwrap(_content);
        }

        if (elementIsGenerated(_viewport)) {
          unwrap(_viewport);
        }

        if (elementIsGenerated(_padding)) {
          unwrap(_padding);
        }

        removeClass(_host, classNameHost);
        removeClass(_padding, classNamePadding);
        removeClass(_viewport, classNameViewport);
        removeClass(_content, classNameContent);
      }
    });

    if (_nativeScrollbarStyling) {
      push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
    }

    if (_viewportArrange) {
      insertBefore(_viewport, _viewportArrange);
      push(destroyFns, removeElements.bind(0, _viewportArrange));
    }

    return {
      _targetObj: evaluatedTargetObj,
      _targetCtx: ctx,
      _destroy: function _destroy() {
        runEach(destroyFns);
      }
    };
  };

  var generateScrollbarDOM = function generateScrollbarDOM(scrollbarClassName) {
    var scrollbar = createDiv(classNameScrollbar + " " + scrollbarClassName);
    var track = createDiv(classNameScrollbarTrack);
    var handle = createDiv(classNameScrollbarHandle);
    appendChildren(scrollbar, track);
    appendChildren(track, handle);
    return {
      _scrollbar: scrollbar,
      _track: track,
      _handle: handle
    };
  };

  var createScrollbarsSetup = function createScrollbarsSetup(target, structureSetup) {
    var _getEnvironment = getEnvironment(),
        _getInitializationStrategy = _getEnvironment._getInitializationStrategy;

    var _getInitializationStr = _getInitializationStrategy(),
        environmentScrollbarSlot = _getInitializationStr._scrollbarsSlot;

    var _targetObj = structureSetup._targetObj,
        _targetCtx = structureSetup._targetCtx;
    var _target = _targetObj._target,
        _host = _targetObj._host,
        _viewport = _targetObj._viewport;
    var initializationScrollbarSlot = !_targetCtx._targetIsElm && target.scrollbarsSlot;
    var initializationScrollbarSlotResult = isFunction(initializationScrollbarSlot) ? initializationScrollbarSlot(_target, _host, _viewport) : initializationScrollbarSlot;
    var evaluatedScrollbarSlot = initializationScrollbarSlotResult || (isFunction(environmentScrollbarSlot) ? environmentScrollbarSlot(_target, _host, _viewport) : environmentScrollbarSlot) || _host;
    var horizontalScrollbarStructure = generateScrollbarDOM(classNameScrollbarHorizontal);
    var verticalScrollbarStructure = generateScrollbarDOM(classNameScrollbarVertical);
    var horizontalScrollbar = horizontalScrollbarStructure._scrollbar;
    var verticalScrollbar = verticalScrollbarStructure._scrollbar;
    appendChildren(evaluatedScrollbarSlot, horizontalScrollbar);
    appendChildren(evaluatedScrollbarSlot, verticalScrollbar);
    return {
      _horizontalScrollbarStructure: horizontalScrollbarStructure,
      _verticalScrollbarStructure: verticalScrollbarStructure,
      _destroy: function _destroy() {
        removeElements([horizontalScrollbar, verticalScrollbar]);
      }
    };
  };

  var animationStartEventName = 'animationstart';
  var scrollEventName = 'scroll';
  var scrollAmount = 3333333;

  var getElmDirectionIsRTL = function getElmDirectionIsRTL(elm) {
    return style(elm, 'direction') === 'rtl';
  };

  var domRectHasDimensions = function domRectHasDimensions(rect) {
    return rect && (rect.height || rect.width);
  };

  var createSizeObserver = function createSizeObserver(target, onSizeChangedCallback, options) {
    var _ref = options || {},
        _ref$_direction = _ref._direction,
        observeDirectionChange = _ref$_direction === void 0 ? false : _ref$_direction,
        _ref$_appear = _ref._appear,
        observeAppearChange = _ref$_appear === void 0 ? false : _ref$_appear;

    var _getEnvironment = getEnvironment(),
        rtlScrollBehavior = _getEnvironment._rtlScrollBehavior;

    var baseElements = createDOM("<div class=\"" + classNameSizeObserver + "\"><div class=\"" + classNameSizeObserverListener + "\"></div></div>");
    var sizeObserver = baseElements[0];
    var listenerElement = sizeObserver.firstChild;
    var getIsDirectionRTL = getElmDirectionIsRTL.bind(0, sizeObserver);

    var _createCache = createCache({
      _initialValue: undefined,
      _alwaysUpdateValues: true,
      _equal: function _equal(currVal, newVal) {
        return !(!currVal || !domRectHasDimensions(currVal) && domRectHasDimensions(newVal));
      }
    }),
        updateResizeObserverContentRectCache = _createCache[0];

    var onSizeChangedCallbackProxy = function onSizeChangedCallbackProxy(sizeChangedContext) {
      var isResizeObserverCall = isArray(sizeChangedContext) && sizeChangedContext.length > 0 && isObject(sizeChangedContext[0]);
      var hasDirectionCache = !isResizeObserverCall && isBoolean(sizeChangedContext[0]);
      var skip = false;
      var appear = false;
      var doDirectionScroll = true;

      if (isResizeObserverCall) {
        var _updateResizeObserver = updateResizeObserverContentRectCache(sizeChangedContext.pop().contentRect),
            currRContentRect = _updateResizeObserver[0],
            prevContentRect = _updateResizeObserver[2];

        var hasDimensions = domRectHasDimensions(currRContentRect);
        var hadDimensions = domRectHasDimensions(prevContentRect);
        skip = !prevContentRect || !hasDimensions;
        appear = !hadDimensions && hasDimensions;
        doDirectionScroll = !skip;
      } else if (hasDirectionCache) {
        doDirectionScroll = sizeChangedContext[1];
      } else {
        appear = sizeChangedContext === true;
      }

      if (observeDirectionChange && doDirectionScroll) {
        var rtl = hasDirectionCache ? sizeChangedContext[0] : getElmDirectionIsRTL(sizeObserver);
        scrollLeft(sizeObserver, rtl ? rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount : scrollAmount);
        scrollTop(sizeObserver, scrollAmount);
      }

      if (!skip) {
        onSizeChangedCallback({
          _sizeChanged: !hasDirectionCache,
          _directionIsRTLCache: hasDirectionCache ? sizeChangedContext : undefined,
          _appear: !!appear
        });
      }
    };

    var offListeners = [];
    var appearCallback = observeAppearChange ? onSizeChangedCallbackProxy : false;
    var directionIsRTLCache;

    if (ResizeObserverConstructor) {
      var resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
      resizeObserverInstance.observe(listenerElement);
      push(offListeners, function () {
        resizeObserverInstance.disconnect();
      });
    } else {
      var observerElementChildren = createDOM("<div class=\"" + classNameSizeObserverListenerItem + "\" dir=\"ltr\"><div class=\"" + classNameSizeObserverListenerItem + "\"><div class=\"" + classNameSizeObserverListenerItemFinal + "\"></div></div><div class=\"" + classNameSizeObserverListenerItem + "\"><div class=\"" + classNameSizeObserverListenerItemFinal + "\" style=\"width: 200%; height: 200%\"></div></div></div>");
      appendChildren(listenerElement, observerElementChildren);
      addClass(listenerElement, classNameSizeObserverListenerScroll);
      var observerElementChildrenRoot = observerElementChildren[0];
      var shrinkElement = observerElementChildrenRoot.lastChild;
      var expandElement = observerElementChildrenRoot.firstChild;
      var expandElementChild = expandElement == null ? void 0 : expandElement.firstChild;
      var cacheSize = offsetSize(observerElementChildrenRoot);
      var currSize = cacheSize;
      var isDirty = false;
      var rAFId;

      var reset = function reset() {
        scrollLeft(expandElement, scrollAmount);
        scrollTop(expandElement, scrollAmount);
        scrollLeft(shrinkElement, scrollAmount);
        scrollTop(shrinkElement, scrollAmount);
      };

      var onResized = function onResized(appear) {
        rAFId = 0;

        if (isDirty) {
          cacheSize = currSize;
          onSizeChangedCallbackProxy(appear === true);
        }
      };

      var onScroll = function onScroll(scrollEvent) {
        currSize = offsetSize(observerElementChildrenRoot);
        isDirty = !scrollEvent || !equalWH(currSize, cacheSize);

        if (scrollEvent) {
          stopAndPrevent(scrollEvent);

          if (isDirty && !rAFId) {
            cAF(rAFId);
            rAFId = rAF(onResized);
          }
        } else {
          onResized(scrollEvent === false);
        }

        reset();
      };

      push(offListeners, [on(expandElement, scrollEventName, onScroll), on(shrinkElement, scrollEventName, onScroll)]);
      style(expandElementChild, {
        width: scrollAmount,
        height: scrollAmount
      });
      reset();
      appearCallback = observeAppearChange ? onScroll.bind(0, false) : reset;
    }

    if (observeDirectionChange) {
      directionIsRTLCache = createCache({
        _initialValue: !getIsDirectionRTL()
      }, getIsDirectionRTL);
      var _directionIsRTLCache = directionIsRTLCache,
          updateDirectionIsRTLCache = _directionIsRTLCache[0];
      push(offListeners, on(sizeObserver, scrollEventName, function (event) {
        var directionIsRTLCacheValues = updateDirectionIsRTLCache();
        var directionIsRTL = directionIsRTLCacheValues[0],
            directionIsRTLChanged = directionIsRTLCacheValues[1];

        if (directionIsRTLChanged) {
          removeClass(listenerElement, 'ltr rtl');

          if (directionIsRTL) {
            addClass(listenerElement, 'rtl');
          } else {
            addClass(listenerElement, 'ltr');
          }

          onSizeChangedCallbackProxy(directionIsRTLCacheValues);
        }

        stopAndPrevent(event);
      }));
    }

    if (appearCallback) {
      addClass(sizeObserver, classNameSizeObserverAppear);
      push(offListeners, on(sizeObserver, animationStartEventName, appearCallback, {
        _once: !!ResizeObserverConstructor
      }));
    }

    prependChildren(target, sizeObserver);
    return {
      _destroy: function _destroy() {
        runEach(offListeners);
        removeElements(sizeObserver);
      },
      _getCurrentCacheValues: function _getCurrentCacheValues(force) {
        return {
          _directionIsRTL: directionIsRTLCache ? directionIsRTLCache[1](force) : [false, false, false]
        };
      }
    };
  };

  var isHeightIntrinsic = function isHeightIntrinsic(ioEntryOrSize) {
    return ioEntryOrSize.h === 0 || ioEntryOrSize.isIntersecting || ioEntryOrSize.intersectionRatio > 0;
  };

  var createTrinsicObserver = function createTrinsicObserver(target, onTrinsicChangedCallback) {
    var trinsicObserver = createDiv(classNameTrinsicObserver);
    var offListeners = [];

    var _createCache = createCache({
      _initialValue: false
    }),
        updateHeightIntrinsicCache = _createCache[0],
        getCurrentHeightIntrinsicCache = _createCache[1];

    var triggerOnTrinsicChangedCallback = function triggerOnTrinsicChangedCallback(updateValue) {
      if (updateValue) {
        var heightIntrinsic = updateHeightIntrinsicCache(isHeightIntrinsic(updateValue));
        var heightIntrinsicChanged = heightIntrinsic[1];

        if (heightIntrinsicChanged) {
          onTrinsicChangedCallback(heightIntrinsic);
        }
      }
    };

    if (IntersectionObserverConstructor) {
      var intersectionObserverInstance = new IntersectionObserverConstructor(function (entries) {
        if (entries && entries.length > 0) {
          triggerOnTrinsicChangedCallback(entries.pop());
        }
      }, {
        root: target
      });
      intersectionObserverInstance.observe(trinsicObserver);
      push(offListeners, function () {
        intersectionObserverInstance.disconnect();
      });
    } else {
      var onSizeChanged = function onSizeChanged() {
        var newSize = offsetSize(trinsicObserver);
        triggerOnTrinsicChangedCallback(newSize);
      };

      push(offListeners, createSizeObserver(trinsicObserver, onSizeChanged)._destroy);
      onSizeChanged();
    }

    prependChildren(target, trinsicObserver);
    return {
      _destroy: function _destroy() {
        runEach(offListeners);
        removeElements(trinsicObserver);
      },
      _getCurrentCacheValues: function _getCurrentCacheValues(force) {
        return {
          _heightIntrinsic: getCurrentHeightIntrinsicCache(force)
        };
      }
    };
  };

  var createEventContentChange = function createEventContentChange(target, callback, eventContentChange) {
    var map;
    var destroyed = false;

    var _destroy = function _destroy() {
      destroyed = true;
    };

    var _updateElements = function _updateElements(getElements) {
      if (eventContentChange) {
        var eventElmList = eventContentChange.reduce(function (arr, item) {
          if (item) {
            var selector = item[0];
            var eventNames = item[1];
            var elements = eventNames && selector && (getElements ? getElements(selector) : find(selector, target));

            if (elements && elements.length && eventNames && isString(eventNames)) {
              push(arr, [elements, eventNames.trim()], true);
            }
          }

          return arr;
        }, []);
        each(eventElmList, function (item) {
          return each(item[0], function (elm) {
            var eventNames = item[1];
            var entry = map.get(elm);

            if (entry) {
              var entryEventNames = entry[0];
              var entryOff = entry[1];

              if (entryEventNames === eventNames) {
                entryOff();
              }
            }

            var off = on(elm, eventNames, function (event) {
              if (destroyed) {
                off();
                map.delete(elm);
              } else {
                callback(event);
              }
            });
            map.set(elm, [eventNames, off]);
          });
        });
      }
    };

    if (eventContentChange) {
      map = new WeakMap();

      _updateElements();
    }

    return {
      _destroy: _destroy,
      _updateElements: _updateElements
    };
  };

  var createDOMObserver = function createDOMObserver(target, isContentObserver, callback, options) {
    var isConnected = false;

    var _ref = options || {},
        _attributes = _ref._attributes,
        _styleChangingAttributes = _ref._styleChangingAttributes,
        _eventContentChange = _ref._eventContentChange,
        _nestedTargetSelector = _ref._nestedTargetSelector,
        _ignoreTargetChange = _ref._ignoreTargetChange,
        _ignoreNestedTargetChange = _ref._ignoreNestedTargetChange,
        _ignoreContentChange = _ref._ignoreContentChange;

    var _createEventContentCh = createEventContentChange(target, debounce(function () {
      if (isConnected) {
        callback(true);
      }
    }, {
      _timeout: 33,
      _maxDelay: 99
    }), _eventContentChange),
        destroyEventContentChange = _createEventContentCh._destroy,
        updateEventContentChangeElements = _createEventContentCh._updateElements;

    var finalAttributes = _attributes || [];
    var finalStyleChangingAttributes = _styleChangingAttributes || [];
    var observedAttributes = finalAttributes.concat(finalStyleChangingAttributes);

    var observerCallback = function observerCallback(mutations) {
      var ignoreTargetChange = (isContentObserver ? _ignoreNestedTargetChange : _ignoreTargetChange) || noop;
      var ignoreContentChange = _ignoreContentChange || noop;
      var targetChangedAttrs = [];
      var totalAddedNodes = [];
      var targetStyleChanged = false;
      var contentChanged = false;
      var childListChanged = false;
      each(mutations, function (mutation) {
        var attributeName = mutation.attributeName,
            mutationTarget = mutation.target,
            type = mutation.type,
            oldValue = mutation.oldValue,
            addedNodes = mutation.addedNodes;
        var isAttributesType = type === 'attributes';
        var isChildListType = type === 'childList';
        var targetIsMutationTarget = target === mutationTarget;
        var attributeValue = isAttributesType && isString(attributeName) ? attr(mutationTarget, attributeName) : 0;
        var attributeChanged = attributeValue !== 0 && oldValue !== attributeValue;
        var styleChangingAttrChanged = indexOf(finalStyleChangingAttributes, attributeName) > -1 && attributeChanged;

        if (isContentObserver && !targetIsMutationTarget) {
          var notOnlyAttrChanged = !isAttributesType;
          var contentAttrChanged = isAttributesType && styleChangingAttrChanged;
          var isNestedTarget = contentAttrChanged && _nestedTargetSelector && is(mutationTarget, _nestedTargetSelector);
          var baseAssertion = isNestedTarget ? !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue) : notOnlyAttrChanged || contentAttrChanged;
          var contentFinalChanged = baseAssertion && !ignoreContentChange(mutation, !!isNestedTarget, target, options);
          push(totalAddedNodes, addedNodes);
          contentChanged = contentChanged || contentFinalChanged;
          childListChanged = childListChanged || isChildListType;
        }

        if (!isContentObserver && targetIsMutationTarget && attributeChanged && !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue)) {
          push(targetChangedAttrs, attributeName);
          targetStyleChanged = targetStyleChanged || styleChangingAttrChanged;
        }
      });

      if (childListChanged && !isEmptyArray(totalAddedNodes)) {
        updateEventContentChangeElements(function (selector) {
          return totalAddedNodes.reduce(function (arr, node) {
            push(arr, find(selector, node));
            return is(node, selector) ? push(arr, node) : arr;
          }, []);
        });
      }

      if (isContentObserver) {
        contentChanged && callback(false);
      } else if (!isEmptyArray(targetChangedAttrs) || targetStyleChanged) {
        callback(targetChangedAttrs, targetStyleChanged);
      }
    };

    var mutationObserver = new MutationObserverConstructor(observerCallback);
    mutationObserver.observe(target, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: observedAttributes,
      subtree: isContentObserver,
      childList: isContentObserver,
      characterData: isContentObserver
    });
    isConnected = true;
    return {
      _destroy: function _destroy() {
        if (isConnected) {
          destroyEventContentChange();
          mutationObserver.disconnect();
          isConnected = false;
        }
      },
      _update: function _update() {
        if (isConnected) {
          observerCallback(mutationObserver.takeRecords());
        }
      }
    };
  };

  var ignorePrefix = 'os-';
  var viewportAttrsFromTarget = ['tabindex'];
  var baseStyleChangingAttrsTextarea = ['wrap', 'cols', 'rows'];
  var baseStyleChangingAttrs = ['id', 'class', 'style', 'open'];

  var ignoreTargetChange = function ignoreTargetChange(target, attrName, oldValue, newValue) {
    if (attrName === 'class' && oldValue && newValue) {
      var diff = diffClass(oldValue, newValue);
      return !!diff.find(function (addedOrRemovedClass) {
        return addedOrRemovedClass.indexOf(ignorePrefix) !== 0;
      });
    }

    return false;
  };

  var lifecycleHubOservers = function lifecycleHubOservers(instance, updateLifecycles) {
    var debounceTimeout;
    var debounceMaxDelay;
    var contentMutationObserver;
    var _structureSetup = instance._structureSetup;
    var _targetObj = _structureSetup._targetObj,
        _targetCtx = _structureSetup._targetCtx;
    var _host = _targetObj._host,
        _viewport = _targetObj._viewport,
        _content = _targetObj._content;
    var _isTextarea = _targetCtx._isTextarea;

    var _getEnvironment = getEnvironment(),
        _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
        _flexboxGlue = _getEnvironment._flexboxGlue;

    var contentMutationObserverAttr = _isTextarea ? baseStyleChangingAttrsTextarea : baseStyleChangingAttrs.concat(baseStyleChangingAttrsTextarea);
    var updateLifecyclesWithDebouncedAdaptiveUpdateHints = debounce(updateLifecycles, {
      _timeout: function _timeout() {
        return debounceTimeout;
      },
      _maxDelay: function _maxDelay() {
        return debounceMaxDelay;
      },
      _mergeParams: function _mergeParams(prev, curr) {
        var _prev$ = prev[0],
            prevSizeChanged = _prev$._sizeChanged,
            prevHostMutation = _prev$._hostMutation,
            prevContentMutation = _prev$._contentMutation;
        var _curr$ = curr[0],
            currSizeChanged = _curr$._sizeChanged,
            currvHostMutation = _curr$._hostMutation,
            currContentMutation = _curr$._contentMutation;
        var merged = [{
          _sizeChanged: prevSizeChanged || currSizeChanged,
          _hostMutation: prevHostMutation || currvHostMutation,
          _contentMutation: prevContentMutation || currContentMutation
        }];
        return merged;
      }
    });

    var updateViewportAttrsFromHost = function updateViewportAttrsFromHost(attributes) {
      each(attributes || viewportAttrsFromTarget, function (attribute) {
        if (indexOf(viewportAttrsFromTarget, attribute) > -1) {
          var hostAttr = attr(_host, attribute);

          if (isString(hostAttr)) {
            attr(_viewport, attribute, hostAttr);
          } else {
            removeAttr(_viewport, attribute);
          }
        }
      });
    };

    var onTrinsicChanged = function onTrinsicChanged(heightIntrinsic) {
      updateLifecycles({
        _heightIntrinsic: heightIntrinsic
      });
    };

    var onSizeChanged = function onSizeChanged(_ref) {
      var _sizeChanged = _ref._sizeChanged,
          _directionIsRTLCache = _ref._directionIsRTLCache,
          _appear = _ref._appear;
      var updateFn = !_sizeChanged || _appear ? updateLifecycles : updateLifecyclesWithDebouncedAdaptiveUpdateHints;
      updateFn({
        _sizeChanged: _sizeChanged,
        _directionIsRTL: _directionIsRTLCache
      });
    };

    var onContentMutation = function onContentMutation(contentChangedTroughEvent) {
      var updateFn = contentChangedTroughEvent ? updateLifecycles : updateLifecyclesWithDebouncedAdaptiveUpdateHints;
      updateFn({
        _contentMutation: true
      });
    };

    var onHostMutation = function onHostMutation(targetChangedAttrs, targetStyleChanged) {
      if (targetStyleChanged) {
        updateLifecyclesWithDebouncedAdaptiveUpdateHints({
          _hostMutation: true
        });
      } else {
        updateViewportAttrsFromHost(targetChangedAttrs);
      }
    };

    var trinsicObserver = (_content || !_flexboxGlue) && createTrinsicObserver(_host, onTrinsicChanged);
    var sizeObserver = createSizeObserver(_host, onSizeChanged, {
      _appear: true,
      _direction: !_nativeScrollbarStyling
    });
    var hostMutationObserver = createDOMObserver(_host, false, onHostMutation, {
      _styleChangingAttributes: baseStyleChangingAttrs,
      _attributes: baseStyleChangingAttrs.concat(viewportAttrsFromTarget),
      _ignoreTargetChange: ignoreTargetChange
    });

    var updateOptions = function updateOptions(checkOption) {
      var _checkOption = checkOption('updating.elementEvents'),
          elementEvents = _checkOption[0],
          elementEventsChanged = _checkOption[1];

      var _checkOption2 = checkOption('updating.attributes'),
          attributes = _checkOption2[0],
          attributesChanged = _checkOption2[1];

      var _checkOption3 = checkOption('updating.debounce'),
          debounceValue = _checkOption3[0],
          debounceChanged = _checkOption3[1];

      var updateContentMutationObserver = elementEventsChanged || attributesChanged;

      if (updateContentMutationObserver) {
        if (contentMutationObserver) {
          contentMutationObserver._update();

          contentMutationObserver._destroy();
        }

        contentMutationObserver = createDOMObserver(_content || _viewport, true, onContentMutation, {
          _styleChangingAttributes: contentMutationObserverAttr.concat(attributes || []),
          _attributes: contentMutationObserverAttr.concat(attributes || []),
          _eventContentChange: elementEvents,
          _ignoreNestedTargetChange: ignoreTargetChange
        });
      }

      if (debounceChanged) {
        updateLifecyclesWithDebouncedAdaptiveUpdateHints._flush();

        if (isArray(debounceValue)) {
          var timeout = debounceValue[0];
          var maxWait = debounceValue[1];
          debounceTimeout = isNumber(timeout) ? timeout : false;
          debounceMaxDelay = isNumber(maxWait) ? maxWait : false;
        } else if (isNumber(debounceValue)) {
          debounceTimeout = debounceValue;
          debounceMaxDelay = false;
        } else {
          debounceTimeout = false;
          debounceMaxDelay = false;
        }
      }
    };

    updateViewportAttrsFromHost();
    return {
      _trinsicObserver: trinsicObserver,
      _sizeObserver: sizeObserver,
      _updateObserverOptions: updateOptions,
      _destroy: function _destroy() {
        contentMutationObserver && contentMutationObserver._destroy();
        trinsicObserver && trinsicObserver._destroy();

        sizeObserver._destroy();

        hostMutationObserver._destroy();
      }
    };
  };

  var createTrinsicLifecycle = function createTrinsicLifecycle(lifecycleHub) {
    var _structureSetup = lifecycleHub._structureSetup;
    var _content = _structureSetup._targetObj._content;
    return function (updateHints) {
      var _heightIntrinsic = updateHints._heightIntrinsic;
      var heightIntrinsic = _heightIntrinsic[0],
          heightIntrinsicChanged = _heightIntrinsic[1];

      if (heightIntrinsicChanged) {
        style(_content, {
          height: heightIntrinsic ? '' : '100%',
          display: heightIntrinsic ? '' : 'inline'
        });
      }

      return {
        _sizeChanged: heightIntrinsicChanged,
        _contentMutation: heightIntrinsicChanged
      };
    };
  };

  var createPaddingLifecycle = function createPaddingLifecycle(lifecycleHub) {
    var _structureSetup = lifecycleHub._structureSetup,
        _setLifecycleCommunication = lifecycleHub._setLifecycleCommunication;
    var _structureSetup$_targ = _structureSetup._targetObj,
        _host = _structureSetup$_targ._host,
        _padding = _structureSetup$_targ._padding,
        _viewport = _structureSetup$_targ._viewport;

    var _createCache = createCache({
      _equal: equalTRBL,
      _initialValue: topRightBottomLeft()
    }, topRightBottomLeft.bind(0, _host, 'padding', '')),
        updatePaddingCache = _createCache[0],
        currentPaddingCache = _createCache[1];

    return function (updateHints, checkOption, force) {
      var _currentPaddingCache = currentPaddingCache(force),
          padding = _currentPaddingCache[0],
          paddingChanged = _currentPaddingCache[1];

      var _getEnvironment = getEnvironment(),
          _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
          _flexboxGlue = _getEnvironment._flexboxGlue;

      var _sizeChanged = updateHints._sizeChanged,
          _directionIsRTL = updateHints._directionIsRTL,
          _contentMutation = updateHints._contentMutation;
      var directionIsRTL = _directionIsRTL[0],
          directionChanged = _directionIsRTL[1];

      var _checkOption = checkOption('paddingAbsolute'),
          paddingAbsolute = _checkOption[0],
          paddingAbsoluteChanged = _checkOption[1];

      var contentMutation = !_flexboxGlue && _contentMutation;

      if (_sizeChanged || paddingChanged || contentMutation) {
        var _updatePaddingCache = updatePaddingCache(force);

        padding = _updatePaddingCache[0];
        paddingChanged = _updatePaddingCache[1];
      }

      var paddingStyleChanged = paddingAbsoluteChanged || directionChanged || paddingChanged;

      if (paddingStyleChanged) {
        var paddingRelative = !paddingAbsolute || !_padding && !_nativeScrollbarStyling;
        var paddingHorizontal = padding.r + padding.l;
        var paddingVertical = padding.t + padding.b;
        var paddingStyle = {
          marginRight: paddingRelative && !directionIsRTL ? -paddingHorizontal : 0,
          marginBottom: paddingRelative ? -paddingVertical : 0,
          marginLeft: paddingRelative && directionIsRTL ? -paddingHorizontal : 0,
          top: paddingRelative ? -padding.t : 0,
          right: paddingRelative ? directionIsRTL ? -padding.r : 'auto' : 0,
          left: paddingRelative ? directionIsRTL ? 'auto' : -padding.l : 0,
          width: paddingRelative ? "calc(100% + " + paddingHorizontal + "px)" : ''
        };
        var viewportStyle = {
          paddingTop: paddingRelative ? padding.t : 0,
          paddingRight: paddingRelative ? padding.r : 0,
          paddingBottom: paddingRelative ? padding.b : 0,
          paddingLeft: paddingRelative ? padding.l : 0
        };
        style(_padding || _viewport, paddingStyle);
        style(_viewport, viewportStyle);

        _setLifecycleCommunication({
          _paddingInfo: {
            _absolute: !paddingRelative,
            _padding: padding
          },
          _viewportPaddingStyle: _padding ? viewportStyle : _extends({}, paddingStyle, viewportStyle)
        });
      }

      return {
        _paddingStyleChanged: paddingStyleChanged
      };
    };
  };

  var max = Math.max,
      abs = Math.abs,
      round = Math.round;
  var overlaidScrollbarsHideOffset = 42;
  var whCacheOptions = {
    _equal: equalWH,
    _initialValue: {
      w: 0,
      h: 0
    }
  };

  var sizeFraction = function sizeFraction(elm) {
    var viewportOffsetSize = offsetSize(elm);
    var viewportRect = getBoundingClientRect(elm);
    return {
      w: viewportRect.width - viewportOffsetSize.w,
      h: viewportRect.height - viewportOffsetSize.h
    };
  };

  var fractionalPixelRatioTollerance = function fractionalPixelRatioTollerance() {
    return window.devicePixelRatio % 1 === 0 ? 0 : 1;
  };

  var setAxisOverflowStyle = function setAxisOverflowStyle(horizontal, overflowAmount, behavior, styleObj) {
    var overflowKey = horizontal ? 'overflowX' : 'overflowY';
    var behaviorIsVisible = behavior.indexOf('visible') === 0;
    var behaviorIsVisibleHidden = behavior === 'visible-hidden';
    var behaviorIsScroll = behavior === 'scroll';
    var hasOverflow = overflowAmount > 0;

    if (behaviorIsVisible) {
      styleObj[overflowKey] = 'visible';
    }

    if (behaviorIsScroll && hasOverflow) {
      styleObj[overflowKey] = behavior;
    }

    return {
      _visible: behaviorIsVisible,
      _behavior: behaviorIsVisibleHidden ? 'hidden' : 'scroll'
    };
  };

  var getOverflowAmount = function getOverflowAmount(viewportScrollSize, viewportClientSize, viewportSizeFraction) {
    return {
      w: max(0, round(max(0, viewportScrollSize.w - viewportClientSize.w) - (fractionalPixelRatioTollerance() || max(0, viewportSizeFraction.w)))),
      h: max(0, round(max(0, viewportScrollSize.h - viewportClientSize.h) - (fractionalPixelRatioTollerance() || max(0, viewportSizeFraction.h))))
    };
  };

  var createOverflowLifecycle = function createOverflowLifecycle(lifecycleHub) {
    var _structureSetup = lifecycleHub._structureSetup,
        _doViewportArrange = lifecycleHub._doViewportArrange,
        _getLifecycleCommunication = lifecycleHub._getLifecycleCommunication,
        _setLifecycleCommunication = lifecycleHub._setLifecycleCommunication;
    var _structureSetup$_targ = _structureSetup._targetObj,
        _host = _structureSetup$_targ._host,
        _viewport = _structureSetup$_targ._viewport,
        _viewportArrange = _structureSetup$_targ._viewportArrange;

    var _createCache = createCache(whCacheOptions, sizeFraction.bind(0, _viewport)),
        updateViewportSizeFraction = _createCache[0],
        getCurrentViewportSizeFraction = _createCache[1];

    var _createCache2 = createCache(whCacheOptions, scrollSize.bind(0, _viewport)),
        updateViewportScrollSizeCache = _createCache2[0],
        getCurrentViewportScrollSizeCache = _createCache2[1];

    var _createCache3 = createCache(whCacheOptions),
        updateOverflowAmountCache = _createCache3[0],
        getCurrentOverflowAmountCache = _createCache3[1];

    var fixFlexboxGlue = function fixFlexboxGlue(viewportOverflowState, heightIntrinsic) {
      style(_viewport, {
        height: ''
      });

      if (heightIntrinsic) {
        var _getEnvironment = getEnvironment(),
            _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid;

        var _getLifecycleCommunic = _getLifecycleCommunication()._paddingInfo,
            paddingAbsolute = _getLifecycleCommunic._absolute,
            padding = _getLifecycleCommunic._padding;

        var _overflowScroll = viewportOverflowState._overflowScroll,
            _scrollbarsHideOffset = viewportOverflowState._scrollbarsHideOffset;
        var hostSizeFraction = sizeFraction(_host);
        var hostClientSize = clientSize(_host);
        var isContentBox = style(_viewport, 'boxSizing') === 'content-box';
        var paddingVertical = paddingAbsolute || isContentBox ? padding.b + padding.t : 0;
        var fractionalClientHeight = hostClientSize.h + (abs(hostSizeFraction.h) < 1 ? hostSizeFraction.h : 0);
        var subtractXScrollbar = !(_nativeScrollbarIsOverlaid.x && isContentBox);
        style(_viewport, {
          height: fractionalClientHeight + (_overflowScroll.x && subtractXScrollbar ? _scrollbarsHideOffset.x : 0) - paddingVertical
        });
      }
    };

    var getViewportOverflowState = function getViewportOverflowState(showNativeOverlaidScrollbars, viewportStyleObj) {
      var _getEnvironment2 = getEnvironment(),
          _nativeScrollbarSize = _getEnvironment2._nativeScrollbarSize,
          _nativeScrollbarIsOverlaid = _getEnvironment2._nativeScrollbarIsOverlaid,
          _nativeScrollbarStyling = _getEnvironment2._nativeScrollbarStyling;

      var overlaidX = _nativeScrollbarIsOverlaid.x,
          overlaidY = _nativeScrollbarIsOverlaid.y;
      var determineOverflow = !viewportStyleObj;
      var arrangeHideOffset = !_nativeScrollbarStyling && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
      var styleObj = determineOverflow ? style(_viewport, ['overflowX', 'overflowY']) : viewportStyleObj;
      var scroll = {
        x: styleObj.overflowX === 'scroll',
        y: styleObj.overflowY === 'scroll'
      };
      var nonScrollbarStylingHideOffset = {
        x: overlaidX ? arrangeHideOffset : _nativeScrollbarSize.x,
        y: overlaidY ? arrangeHideOffset : _nativeScrollbarSize.y
      };
      var scrollbarsHideOffset = {
        x: scroll.x && !_nativeScrollbarStyling ? nonScrollbarStylingHideOffset.x : 0,
        y: scroll.y && !_nativeScrollbarStyling ? nonScrollbarStylingHideOffset.y : 0
      };
      return {
        _overflowScroll: scroll,
        _scrollbarsHideOffsetArrange: {
          x: overlaidX && !!arrangeHideOffset,
          y: overlaidY && !!arrangeHideOffset
        },
        _scrollbarsHideOffset: scrollbarsHideOffset
      };
    };

    var setViewportOverflowState = function setViewportOverflowState(showNativeOverlaidScrollbars, overflowAmount, overflow, viewportStyleObj) {
      var _setAxisOverflowStyle = setAxisOverflowStyle(true, overflowAmount.w, overflow.x, viewportStyleObj),
          xVisible = _setAxisOverflowStyle._visible,
          xVisibleBehavior = _setAxisOverflowStyle._behavior;

      var _setAxisOverflowStyle2 = setAxisOverflowStyle(false, overflowAmount.h, overflow.y, viewportStyleObj),
          yVisible = _setAxisOverflowStyle2._visible,
          yVisibleBehavior = _setAxisOverflowStyle2._behavior;

      if (xVisible && !yVisible) {
        viewportStyleObj.overflowX = xVisibleBehavior;
      }

      if (yVisible && !xVisible) {
        viewportStyleObj.overflowY = yVisibleBehavior;
      }

      return getViewportOverflowState(showNativeOverlaidScrollbars, viewportStyleObj);
    };

    var arrangeViewport = function arrangeViewport(viewportOverflowState, viewportScrollSize, viewportSizeFraction, directionIsRTL) {
      if (_doViewportArrange) {
        var _scrollbarsHideOffset = viewportOverflowState._scrollbarsHideOffset,
            _scrollbarsHideOffsetArrange = viewportOverflowState._scrollbarsHideOffsetArrange;
        var arrangeX = _scrollbarsHideOffsetArrange.x,
            arrangeY = _scrollbarsHideOffsetArrange.y;
        var hideOffsetX = _scrollbarsHideOffset.x,
            hideOffsetY = _scrollbarsHideOffset.y;

        var _getLifecycleCommunic2 = _getLifecycleCommunication(),
            viewportPaddingStyle = _getLifecycleCommunic2._viewportPaddingStyle;

        var viewportArrangeHorizontalPaddingKey = directionIsRTL ? 'paddingRight' : 'paddingLeft';
        var viewportArrangeHorizontalPaddingValue = viewportPaddingStyle[viewportArrangeHorizontalPaddingKey];
        var viewportArrangeVerticalPaddingValue = viewportPaddingStyle.paddingTop;
        var fractionalContentWidth = viewportScrollSize.w + (abs(viewportSizeFraction.w) < 1 ? viewportSizeFraction.w : 0);
        var fractionalContenHeight = viewportScrollSize.h + (abs(viewportSizeFraction.h) < 1 ? viewportSizeFraction.h : 0);
        var arrangeSize = {
          w: hideOffsetY && arrangeY ? hideOffsetY + fractionalContentWidth - viewportArrangeHorizontalPaddingValue + "px" : '',
          h: hideOffsetX && arrangeX ? hideOffsetX + fractionalContenHeight - viewportArrangeVerticalPaddingValue + "px" : ''
        };

        if (_viewportArrange) {
          var sheet = _viewportArrange.sheet;

          if (sheet) {
            var cssRules = sheet.cssRules;

            if (cssRules) {
              if (!cssRules.length) {
                sheet.insertRule("#" + attr(_viewportArrange, 'id') + " + ." + classNameViewportArrange + "::before {}", 0);
              }

              var ruleStyle = cssRules[0].style;
              ruleStyle.width = arrangeSize.w;
              ruleStyle.height = arrangeSize.h;
            }
          }
        } else {
          style(_viewport, {
            '--os-vaw': arrangeSize.w,
            '--os-vah': arrangeSize.h
          });
        }
      }

      return _doViewportArrange;
    };

    var hideNativeScrollbars = function hideNativeScrollbars(viewportOverflowState, directionIsRTL, viewportArrange, viewportStyleObj) {
      var _scrollbarsHideOffset = viewportOverflowState._scrollbarsHideOffset,
          _scrollbarsHideOffsetArrange = viewportOverflowState._scrollbarsHideOffsetArrange;
      var arrangeX = _scrollbarsHideOffsetArrange.x,
          arrangeY = _scrollbarsHideOffsetArrange.y;
      var hideOffsetX = _scrollbarsHideOffset.x,
          hideOffsetY = _scrollbarsHideOffset.y;

      var _getLifecycleCommunic3 = _getLifecycleCommunication(),
          viewportPaddingStyle = _getLifecycleCommunic3._viewportPaddingStyle;

      var horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
      var viewportHorizontalPaddingKey = directionIsRTL ? 'paddingLeft' : 'paddingRight';
      var horizontalMarginValue = viewportPaddingStyle[horizontalMarginKey];
      var verticalMarginValue = viewportPaddingStyle.marginBottom;
      var horizontalPaddingValue = viewportPaddingStyle[viewportHorizontalPaddingKey];
      var verticalPaddingValue = viewportPaddingStyle.paddingBottom;
      viewportStyleObj.width = "calc(100% + " + (hideOffsetY + horizontalMarginValue * -1) + "px)";
      viewportStyleObj[horizontalMarginKey] = -hideOffsetY + horizontalMarginValue;
      viewportStyleObj.marginBottom = -hideOffsetX + verticalMarginValue;

      if (viewportArrange) {
        viewportStyleObj[viewportHorizontalPaddingKey] = horizontalPaddingValue + (arrangeY ? hideOffsetY : 0);
        viewportStyleObj.paddingBottom = verticalPaddingValue + (arrangeX ? hideOffsetX : 0);
      }
    };

    var undoViewportArrange = function undoViewportArrange(showNativeOverlaidScrollbars, directionIsRTL, viewportOverflowState) {
      if (_doViewportArrange) {
        var finalViewportOverflowState = viewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars);

        var _getLifecycleCommunic4 = _getLifecycleCommunication(),
            viewportPaddingStyle = _getLifecycleCommunic4._viewportPaddingStyle;

        var _getEnvironment3 = getEnvironment(),
            _flexboxGlue = _getEnvironment3._flexboxGlue;

        var _scrollbarsHideOffsetArrange = finalViewportOverflowState._scrollbarsHideOffsetArrange;
        var arrangeX = _scrollbarsHideOffsetArrange.x,
            arrangeY = _scrollbarsHideOffsetArrange.y;
        var finalPaddingStyle = {};

        var assignProps = function assignProps(props) {
          return each(props.split(' '), function (prop) {
            finalPaddingStyle[prop] = viewportPaddingStyle[prop];
          });
        };

        if (!_flexboxGlue) {
          finalPaddingStyle.height = '';
        }

        if (arrangeX) {
          assignProps('marginBottom paddingTop paddingBottom');
        }

        if (arrangeY) {
          assignProps('marginLeft marginRight paddingLeft paddingRight');
        }

        var prevStyle = style(_viewport, keys(finalPaddingStyle));
        removeClass(_viewport, classNameViewportArrange);
        style(_viewport, finalPaddingStyle);
        return [function () {
          hideNativeScrollbars(finalViewportOverflowState, directionIsRTL, _doViewportArrange, prevStyle);
          style(_viewport, prevStyle);
          addClass(_viewport, classNameViewportArrange);
        }, finalViewportOverflowState];
      }

      return [noop];
    };

    return function (updateHints, checkOption, force) {
      var _directionIsRTL = updateHints._directionIsRTL,
          _heightIntrinsic = updateHints._heightIntrinsic,
          _sizeChanged = updateHints._sizeChanged,
          _hostMutation = updateHints._hostMutation,
          _contentMutation = updateHints._contentMutation,
          _paddingStyleChanged = updateHints._paddingStyleChanged;

      var _getEnvironment4 = getEnvironment(),
          _flexboxGlue = _getEnvironment4._flexboxGlue,
          _nativeScrollbarStyling = _getEnvironment4._nativeScrollbarStyling,
          _nativeScrollbarIsOverlaid = _getEnvironment4._nativeScrollbarIsOverlaid;

      var heightIntrinsic = _heightIntrinsic[0],
          heightIntrinsicChanged = _heightIntrinsic[1];
      var directionIsRTL = _directionIsRTL[0],
          directionChanged = _directionIsRTL[1];

      var _checkOption = checkOption('nativeScrollbarsOverlaid.show'),
          showNativeOverlaidScrollbarsOption = _checkOption[0],
          showNativeOverlaidScrollbarsChanged = _checkOption[1];

      var showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
      var adjustFlexboxGlue = !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged || heightIntrinsicChanged);
      var viewportSizeFractionCache = getCurrentViewportSizeFraction(force);
      var viewportScrollSizeCache = getCurrentViewportScrollSizeCache(force);
      var overflowAmuntCache = getCurrentOverflowAmountCache(force);
      var preMeasureViewportOverflowState;

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
        var _undoViewportArrange = undoViewportArrange(showNativeOverlaidScrollbars, directionIsRTL, preMeasureViewportOverflowState),
            redoViewportArrange = _undoViewportArrange[0],
            undoViewportArrangeOverflowState = _undoViewportArrange[1];

        var _viewportSizeFraction2 = viewportSizeFractionCache = updateViewportSizeFraction(force),
            _viewportSizeFraction = _viewportSizeFraction2[0],
            viewportSizeFractionCahnged = _viewportSizeFraction2[1];

        var _viewportScrollSizeCa = viewportScrollSizeCache = updateViewportScrollSizeCache(force),
            _viewportScrollSize = _viewportScrollSizeCa[0],
            _viewportScrollSizeChanged = _viewportScrollSizeCa[1];

        var viewportContentSize = clientSize(_viewport);
        var arrangedViewportScrollSize = _viewportScrollSize;
        var arrangedViewportClientSize = viewportContentSize;
        redoViewportArrange();

        if ((_viewportScrollSizeChanged || viewportSizeFractionCahnged || showNativeOverlaidScrollbarsChanged) && undoViewportArrangeOverflowState && !showNativeOverlaidScrollbars && arrangeViewport(undoViewportArrangeOverflowState, _viewportScrollSize, _viewportSizeFraction, directionIsRTL)) {
          arrangedViewportClientSize = clientSize(_viewport);
          arrangedViewportScrollSize = scrollSize(_viewport);
        }

        overflowAmuntCache = updateOverflowAmountCache(getOverflowAmount({
          w: max(_viewportScrollSize.w, arrangedViewportScrollSize.w),
          h: max(_viewportScrollSize.h, arrangedViewportScrollSize.h)
        }, {
          w: arrangedViewportClientSize.w + max(0, viewportContentSize.w - _viewportScrollSize.w),
          h: arrangedViewportClientSize.h + max(0, viewportContentSize.h - _viewportScrollSize.h)
        }, _viewportSizeFraction), force);
      }

      var _viewportSizeFraction3 = viewportSizeFractionCache,
          viewportSizeFraction = _viewportSizeFraction3[0],
          viewportSizeFractionChanged = _viewportSizeFraction3[1];
      var _viewportScrollSizeCa2 = viewportScrollSizeCache,
          viewportScrollSize = _viewportScrollSizeCa2[0],
          viewportScrollSizeChanged = _viewportScrollSizeCa2[1];
      var _overflowAmuntCache = overflowAmuntCache,
          overflowAmount = _overflowAmuntCache[0],
          overflowAmountChanged = _overflowAmuntCache[1];

      var _checkOption2 = checkOption('overflow'),
          overflow = _checkOption2[0],
          overflowChanged = _checkOption2[1];

      if (_paddingStyleChanged || viewportSizeFractionChanged || viewportScrollSizeChanged || overflowAmountChanged || overflowChanged || showNativeOverlaidScrollbarsChanged || directionChanged || adjustFlexboxGlue) {
        var viewportStyle = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: '',
          overflowY: '',
          overflowX: ''
        };
        var viewportOverflowState = setViewportOverflowState(showNativeOverlaidScrollbars, overflowAmount, overflow, viewportStyle);
        var viewportArranged = arrangeViewport(viewportOverflowState, viewportScrollSize, viewportSizeFraction, directionIsRTL);
        hideNativeScrollbars(viewportOverflowState, directionIsRTL, viewportArranged, viewportStyle);

        if (adjustFlexboxGlue) {
          fixFlexboxGlue(viewportOverflowState, !!heightIntrinsic);
        }

        style(_viewport, viewportStyle);

        _setLifecycleCommunication({
          _viewportOverflowScroll: viewportOverflowState._overflowScroll,
          _viewportOverflowAmount: overflowAmount
        });
      }
    };
  };

  var getPropByPath = function getPropByPath(obj, path) {
    return obj ? path.split('.').reduce(function (o, prop) {
      return o && hasOwnProperty(o, prop) ? o[prop] : undefined;
    }, obj) : undefined;
  };

  var booleanCacheValuesFallback = [false, false, false];
  var lifecycleCommunicationFallback = {
    _paddingInfo: {
      _absolute: false,
      _padding: {
        t: 0,
        r: 0,
        b: 0,
        l: 0
      }
    },
    _viewportOverflowScroll: {
      x: false,
      y: false
    },
    _viewportOverflowAmount: {
      w: 0,
      h: 0
    },
    _viewportPaddingStyle: {
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    }
  };
  var createLifecycleHub = function createLifecycleHub(options, structureSetup, scrollbarsSetup) {
    var lifecycleCommunication = lifecycleCommunicationFallback;
    var _viewport = structureSetup._targetObj._viewport;

    var _getEnvironment = getEnvironment(),
        _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
        _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid,
        _flexboxGlue = _getEnvironment._flexboxGlue,
        addEnvironmentListener = _getEnvironment._addListener,
        removeEnvironmentListener = _getEnvironment._removeListener;

    var doViewportArrange = !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);
    var instance = {
      _options: options,
      _structureSetup: structureSetup,
      _doViewportArrange: doViewportArrange,
      _getLifecycleCommunication: function _getLifecycleCommunication() {
        return lifecycleCommunication;
      },
      _setLifecycleCommunication: function _setLifecycleCommunication(newLifecycleCommunication) {
        lifecycleCommunication = assignDeep({}, lifecycleCommunication, newLifecycleCommunication);
      }
    };
    var lifecycles = [createTrinsicLifecycle(instance), createPaddingLifecycle(instance), createOverflowLifecycle(instance)];

    var updateLifecycles = function updateLifecycles(updateHints, changedOptions, force) {
      var _ref = updateHints || {},
          _directionIsRTL = _ref._directionIsRTL,
          _heightIntrinsic = _ref._heightIntrinsic,
          _ref$_sizeChanged = _ref._sizeChanged,
          _sizeChanged = _ref$_sizeChanged === void 0 ? force || false : _ref$_sizeChanged,
          _ref$_hostMutation = _ref._hostMutation,
          _hostMutation = _ref$_hostMutation === void 0 ? force || false : _ref$_hostMutation,
          _ref$_contentMutation = _ref._contentMutation,
          _contentMutation = _ref$_contentMutation === void 0 ? force || false : _ref$_contentMutation,
          _ref$_paddingStyleCha = _ref._paddingStyleChanged,
          _paddingStyleChanged = _ref$_paddingStyleCha === void 0 ? force || false : _ref$_paddingStyleCha;

      var finalDirectionIsRTL = _directionIsRTL || (_sizeObserver ? _sizeObserver._getCurrentCacheValues(force)._directionIsRTL : booleanCacheValuesFallback);
      var finalHeightIntrinsic = _heightIntrinsic || (_trinsicObserver ? _trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : booleanCacheValuesFallback);

      var checkOption = function checkOption(path) {
        return [getPropByPath(options, path), force || getPropByPath(changedOptions, path) !== undefined];
      };

      var adjustScrollOffset = doViewportArrange || !_flexboxGlue;
      var scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
      var scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);

      if (_updateObserverOptions) {
        _updateObserverOptions(checkOption);
      }

      each(lifecycles, function (lifecycle) {
        var _ref2 = lifecycle({
          _directionIsRTL: finalDirectionIsRTL,
          _heightIntrinsic: finalHeightIntrinsic,
          _sizeChanged: _sizeChanged,
          _hostMutation: _hostMutation,
          _contentMutation: _contentMutation,
          _paddingStyleChanged: _paddingStyleChanged
        }, checkOption, !!force) || {},
            adaptiveSizeChanged = _ref2._sizeChanged,
            adaptiveHostMutation = _ref2._hostMutation,
            adaptiveContentMutation = _ref2._contentMutation,
            adaptivePaddingStyleChanged = _ref2._paddingStyleChanged;

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

      if (options.callbacks.onUpdated) {
        options.callbacks.onUpdated();
      }
    };

    var _lifecycleHubOservers = lifecycleHubOservers(instance, updateLifecycles),
        _sizeObserver = _lifecycleHubOservers._sizeObserver,
        _trinsicObserver = _lifecycleHubOservers._trinsicObserver,
        _updateObserverOptions = _lifecycleHubOservers._updateObserverOptions,
        destroyObservers = _lifecycleHubOservers._destroy;

    var update = function update(changedOptions, force) {
      return updateLifecycles({}, changedOptions, force);
    };

    var envUpdateListener = update.bind(0, {}, true);
    addEnvironmentListener(envUpdateListener);
    console.log(getEnvironment());
    return {
      _update: update,
      _state: function _state() {
        return {
          _overflowAmount: lifecycleCommunication._viewportOverflowAmount
        };
      },
      _destroy: function _destroy() {
        destroyObservers();
        removeEnvironmentListener(envUpdateListener);

        structureSetup._destroy();

        scrollbarsSetup._destroy();
      }
    };
  };

  var OverlayScrollbars = function OverlayScrollbars(target, options, extensions) {
    var _getEnvironment = getEnvironment(),
        _getDefaultOptions = _getEnvironment._getDefaultOptions;

    var currentOptions = assignDeep({}, _getDefaultOptions(), validateOptions(options || {}, optionsTemplate, null, true)._validated);
    var structureSetup = createStructureSetup(target);
    var scrollbarsSetup = createScrollbarsSetup(target, structureSetup);
    var lifecycleHub = createLifecycleHub(currentOptions, structureSetup, scrollbarsSetup);
    var instance = {
      options: function options(newOptions) {
        if (newOptions) {
          var _validateOptions = validateOptions(newOptions, optionsTemplate, currentOptions, true),
              _changedOptions = _validateOptions._validated;

          if (!isEmptyObject(_changedOptions)) {
            assignDeep(currentOptions, _changedOptions);

            lifecycleHub._update(_changedOptions);
          }
        }

        return currentOptions;
      },
      state: function state() {
        return lifecycleHub._state();
      },
      update: function update(force) {
        lifecycleHub._update({}, force);
      },
      destroy: function destroy() {
        return lifecycleHub._destroy();
      }
    };
    instance.update(true);
    return instance;
  };

  return OverlayScrollbars;

}));
//# sourceMappingURL=overlayscrollbars.js.map
