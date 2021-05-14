(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self), (global.OverlayScrollbars = factory()));
})(this, function () {
  'use strict';

  var createCache = function createCache(update, options) {
    var _ref = options || {},
      _equal = _ref._equal,
      _initialValue = _ref._initialValue,
      _alwaysUpdateValues = _ref._alwaysUpdateValues;

    var _value = _initialValue;

    var _previous;

    var cacheUpdate = function cacheUpdate(force, context) {
      var curr = _value;
      var newVal = update ? update(context, _value, _previous) : context;
      var changed = force || (_equal ? !_equal(curr, newVal) : curr !== newVal);

      if (changed || _alwaysUpdateValues) {
        _value = newVal;
        _previous = curr;
      }

      return {
        _value: _value,
        _previous: _previous,
        _changed: changed,
      };
    };

    return {
      _update: cacheUpdate,
      _current: function _current(force) {
        return {
          _value: _value,
          _previous: _previous,
          _changed: !!force,
        };
      },
    };
  };

  var ElementNodeType = Node.ELEMENT_NODE;
  var _Object$prototype = Object.prototype,
    toString = _Object$prototype.toString,
    hasOwnProperty = _Object$prototype.hasOwnProperty;
  function isUndefined(obj) {
    return obj === undefined;
  }
  function isNull(obj) {
    return obj === null;
  }
  var type = function type(obj) {
    return isUndefined(obj) || isNull(obj)
      ? '' + obj
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
    var length = !!obj && obj.length;
    var lengthCorrectFormat = isNumber(length) && length > -1 && length % 1 == 0;
    return isArray(obj) || (!isFunction(obj) && lengthCorrectFormat) ? (length > 0 && isObject(obj) ? length - 1 in obj : true) : false;
  }
  function isPlainObject(obj) {
    if (!obj || !isObject(obj) || type(obj) !== 'object') return false;
    var key;
    var cstr = 'constructor';
    var ctor = obj[cstr];
    var ctorProto = ctor && ctor.prototype;
    var hasOwnConstructor = hasOwnProperty.call(obj, cstr);
    var hasIsPrototypeOf = ctorProto && hasOwnProperty.call(ctorProto, 'isPrototypeOf');

    if (ctor && !hasOwnConstructor && !hasIsPrototypeOf) {
      return false;
    }

    for (key in obj) {
    }

    return isUndefined(key) || hasOwnProperty.call(obj, key);
  }
  function isHTMLElement(obj) {
    var instanceofObj = window.HTMLElement;
    return obj ? (instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType) : false;
  }
  function isElement(obj) {
    var instanceofObj = window.Element;
    return obj ? (instanceofObj ? obj instanceof instanceofObj : obj.nodeType === ElementNodeType) : false;
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
    return arr.indexOf(item, fromIndex);
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
    return array && array.length === 0;
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

  var hasOwnProperty$1 = function hasOwnProperty(obj, prop) {
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
    var rootElm = elm ? (isElement(elm) ? elm : null) : document;
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

    if (hasOwnProperty$1(cssCache, name)) {
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
    return (cssCache[name] = result || '');
  };
  var jsAPI = function jsAPI(name) {
    var result = jsCache[name] || window[name];

    if (hasOwnProperty$1(jsCache, name)) {
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

      while ((clazz = classes[i++])) {
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

  var zeroObj = {
    w: 0,
    h: 0,
  };
  var windowSize = function windowSize() {
    return {
      w: window.innerWidth,
      h: window.innerHeight,
    };
  };
  var offsetSize = function offsetSize(elm) {
    return elm
      ? {
          w: elm.offsetWidth,
          h: elm.offsetHeight,
        }
      : zeroObj;
  };
  var clientSize = function clientSize(elm) {
    return elm
      ? {
          w: elm.clientWidth,
          h: elm.clientHeight,
        }
      : zeroObj;
  };
  var scrollSize = function scrollSize(elm) {
    return elm
      ? {
          w: elm.scrollWidth,
          h: elm.scrollHeight,
        }
      : zeroObj;
  };
  var getBoundingClientRect = function getBoundingClientRect(elm) {
    return elm.getBoundingClientRect();
  };

  var passiveEventsSupport;

  var supportPassiveEvents = function supportPassiveEvents() {
    if (isUndefined(passiveEventsSupport)) {
      passiveEventsSupport = false;

      try {
        window.addEventListener(
          'test',
          null,
          Object.defineProperty({}, 'passive', {
            get: function get() {
              passiveEventsSupport = true;
            },
          })
        );
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
    var passive = (doSupportPassiveEvents && options && options._passive) || false;
    var capture = (options && options._capture) || false;
    var once = (options && options._once) || false;
    var offListeners = [];
    var nativeOptions = doSupportPassiveEvents
      ? {
          passive: passive,
          capture: capture,
        }
      : capture;
    each(splitEventNames(eventNames), function (eventName) {
      var finalListener = once
        ? function (evt) {
            target.removeEventListener(eventName, finalListener, capture);
            listener && listener(evt);
          }
        : listener;
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
    return equal(
      a,
      b,
      ['width', 'height'],
      round &&
        function (value) {
          return Math.round(value);
        }
    );
  };

  var setT = window.setTimeout;

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
    var _timeout = options._timeout,
      _maxDelay = options._maxDelay,
      _mergeParams = options._mergeParams;

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
      var args = arguments;
      var finalTimeout = isFunction(_timeout) ? _timeout() : _timeout;
      var hasTimeout = isNumber(finalTimeout) && finalTimeout >= 0;

      if (hasTimeout) {
        var finalMaxWait = isFunction(_maxDelay) ? _maxDelay() : _maxDelay;
        var hasMaxWait = isNumber(finalMaxWait) && finalMaxWait >= 0;
        var setTimeoutFn = finalTimeout > 0 ? setT : rAF;
        var mergeParamsResult = mergeParms(args);
        var invokedArgs = mergeParamsResult || args;
        var boundInvoke = invokeFunctionToDebounce.bind(0, invokedArgs);

        if (!mergeParamsResult) {
          invokeFunctionToDebounce(prevArguments || args);
        }

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
    zindex: 1,
  };

  var parseToZeroOrNumber = function parseToZeroOrNumber(value, toFloat) {
    var num = toFloat ? parseFloat(value) : parseInt(value, 10);
    return Number.isNaN(num) ? 0 : num;
  };

  var adaptCSSVal = function adaptCSSVal(prop, val) {
    return !cssNumber[prop.toLowerCase()] && isNumber(val) ? val + 'px' : val;
  };

  var getCSSVal = function getCSSVal(elm, computedStyle, prop) {
    return computedStyle != null ? computedStyle[prop] || computedStyle.getPropertyValue(prop) : elm.style[prop];
  };

  var setCSSVal = function setCSSVal(elm, prop, val) {
    try {
      if (elm) {
        var _style = elm.style;

        if (!isUndefined(_style[prop])) {
          _style[prop] = adaptCSSVal(prop, val);
        } else {
          _style.setProperty(prop, val);
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
        getStylesResult = getSingleStyle
          ? getCSSVal(elm, computedStyle, styles)
          : styles.reduce(function (result, key) {
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
    var finalPrefix = propertyPrefix ? propertyPrefix + '-' : '';
    var finalSuffix = propertySuffix ? '-' + propertySuffix : '';
    var top = finalPrefix + 'top' + finalSuffix;
    var right = finalPrefix + 'right' + finalSuffix;
    var bottom = finalPrefix + 'bottom' + finalSuffix;
    var left = finalPrefix + 'left' + finalSuffix;
    var result = style(elm, [top, right, bottom, left]);
    return {
      t: parseToZeroOrNumber(result[top]),
      r: parseToZeroOrNumber(result[right]),
      b: parseToZeroOrNumber(result[bottom]),
      l: parseToZeroOrNumber(result[left]),
    };
  };

  var zeroObj$1 = {
    x: 0,
    y: 0,
  };
  var absoluteCoordinates = function absoluteCoordinates(elm) {
    var rect = elm ? getBoundingClientRect(elm) : 0;
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

  var stringify = JSON.stringify;
  var templateTypePrefixSuffix = ['__TPL_', '_TYPE__'];
  var optionsTemplateTypes = ['boolean', 'number', 'string', 'array', 'object', 'function', 'null'].reduce(function (result, item) {
    result[item] = templateTypePrefixSuffix[0] + item + templateTypePrefixSuffix[1];
    return result;
  }, {});

  var validateRecursive = function validateRecursive(options, template, optionsDiff, doWriteErrors, propPath) {
    var validatedOptions = {};

    var optionsCopy = _extends_1({}, options);

    var props = keys(template).filter(function (prop) {
      return hasOwnProperty$1(options, prop);
    });
    each(props, function (prop) {
      var optionsDiffValue = isUndefined(optionsDiff[prop]) ? {} : optionsDiff[prop];
      var optionsValue = options[prop];
      var templateValue = template[prop];
      var templateIsComplex = isPlainObject(templateValue);
      var propPrefix = propPath ? propPath + '.' : '';

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
          var doStringifyComparison = isArray(optionsValue) || isPlainObject(optionsValue);

          if (doStringifyComparison ? stringify(optionsValue) !== stringify(optionsDiffValue) : optionsValue !== optionsDiffValue) {
            validatedOptions[prop] = optionsValue;
          }
        } else if (doWriteErrors) {
          console.warn(
            '' +
              ('The option "' +
                propPrefix +
                prop +
                "\" wasn't set, because it doesn't accept the type [ " +
                optionsValueType.toUpperCase() +
                ' ] with the value of "' +
                optionsValue +
                '".\r\n' +
                ('Accepted types are: [ ' + errorPossibleTypes.join(', ').toUpperCase() + ' ].\r\n')) +
              (errorEnumStrings.length > 0 ? '\r\nValid strings are: [ ' + errorEnumStrings.join(', ') + ' ].' : '')
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

  var validateOptions = function validateOptions(options, template, optionsDiff, doWriteErrors) {
    return validateRecursive(options, template, optionsDiff || {}, doWriteErrors || false);
  };

  var transformOptions = function transformOptions(optionsWithOptionsTemplate) {
    var result = {
      _template: {},
      _options: {},
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
  var classNameEnvironmentFlexboxGlue = classNameEnvironment + '-flexbox-glue';
  var classNameEnvironmentFlexboxGlueMax = classNameEnvironmentFlexboxGlue + '-max';
  var classNameHost = 'os-host';
  var classNamePadding = 'os-padding';
  var classNameViewport = 'os-viewport';
  var classNameViewportArrange = classNameViewport + '-arrange';
  var classNameContent = 'os-content';
  var classNameViewportScrollbarStyling = classNameViewport + '-scrollbar-styled';
  var classNameSizeObserver = 'os-size-observer';
  var classNameSizeObserverAppear = classNameSizeObserver + '-appear';
  var classNameSizeObserverListener = classNameSizeObserver + '-listener';
  var classNameSizeObserverListenerScroll = classNameSizeObserverListener + '-scroll';
  var classNameSizeObserverListenerItem = classNameSizeObserverListener + '-item';
  var classNameSizeObserverListenerItemFinal = classNameSizeObserverListenerItem + '-final';
  var classNameTrinsicObserver = 'os-trinsic-observer';

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
      debounce: [
        [0, 33],
        [optionsTemplateTypes.number, optionsTemplateTypes.array, optionsTemplateTypes.null],
      ],
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
    callbacks: {
      onUpdated: [null, [optionsTemplateTypes.function, optionsTemplateTypes.null]],
    },
  };

  var _transformOptions = transformOptions(defaultOptionsWithTemplate),
    optionsTemplate = _transformOptions._template,
    defaultOptions = _transformOptions._options;

  var environmentInstance;
  var abs = Math.abs,
    round = Math.round;

  var diffBiggerThanOne = function diffBiggerThanOne(valOne, valTwo) {
    var absValOne = abs(valOne);
    var absValTwo = abs(valTwo);
    return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
  };

  var getNativeScrollbarSize = function getNativeScrollbarSize(body, measureElm) {
    appendChildren(body, measureElm);
    var cSize = clientSize(measureElm);
    var oSize = offsetSize(measureElm);
    return {
      x: oSize.h - cSize.h,
      y: oSize.w - cSize.w,
    };
  };

  var getNativeScrollbarStyling = function getNativeScrollbarStyling(testElm) {
    var result = false;
    addClass(testElm, classNameViewportScrollbarStyling);

    try {
      result =
        style(testElm, cssProperty('scrollbar-width')) === 'none' ||
        window.getComputedStyle(testElm, '::-webkit-scrollbar').getPropertyValue('display') === 'none';
    } catch (ex) {}

    return result;
  };

  var getRtlScrollBehavior = function getRtlScrollBehavior(parentElm, childElm) {
    var strHidden = 'hidden';
    style(parentElm, {
      overflowX: strHidden,
      overflowY: strHidden,
      direction: 'rtl',
    });
    scrollLeft(parentElm, 0);
    var parentOffset = absoluteCoordinates(parentElm);
    var childOffset = absoluteCoordinates(childElm);
    scrollLeft(parentElm, -999);
    var childOffsetAfterScroll = absoluteCoordinates(childElm);
    return {
      i: parentOffset.x === childOffset.x,
      n: childOffset.x !== childOffsetAfterScroll.x,
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
      _padding: !nativeScrollbarStyling,
      _content: false,
    };
  };

  var createEnvironment = function createEnvironment() {
    var _document = document,
      body = _document.body;
    var envDOM = createDOM('<div class="' + classNameEnvironment + '"><div></div></div>');
    var envElm = envDOM[0];
    var envChildElm = envElm.firstChild;
    var onChangedListener = new Set();
    var nativeScrollbarSize = getNativeScrollbarSize(body, envElm);
    var nativeScrollbarStyling = getNativeScrollbarStyling(envElm);
    var nativeScrollbarIsOverlaid = {
      x: nativeScrollbarSize.x === 0,
      y: nativeScrollbarSize.y === 0,
    };
    var defaultInitializationStrategy = getDefaultInitializationStrategy(nativeScrollbarStyling);
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
        return _extends_1({}, initializationStrategy);
      },
      _setInitializationStrategy: function _setInitializationStrategy(newInitializationStrategy) {
        initializationStrategy = assignDeep({}, initializationStrategy, newInitializationStrategy);
      },
      _getDefaultOptions: function _getDefaultOptions() {
        return _extends_1({}, defaultDefaultOptions);
      },
      _setDefaultOptions: function _setDefaultOptions(newDefaultOptions) {
        defaultDefaultOptions = assignDeep({}, defaultDefaultOptions, newDefaultOptions);
      },
      _defaultInitializationStrategy: defaultInitializationStrategy,
      _defaultDefaultOptions: defaultDefaultOptions,
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
            h: sizeNew.h - size.h,
          };
          if (deltaSize.w === 0 && deltaSize.h === 0) return;
          var deltaAbsSize = {
            w: abs(deltaSize.w),
            h: abs(deltaSize.h),
          };
          var deltaAbsRatio = {
            w: abs(round(sizeNew.w / (size.w / 100.0))),
            h: abs(round(sizeNew.h / (size.h / 100.0))),
          };
          var dprNew = getWindowDPR();
          var deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
          var difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
          var dprChanged = dprNew !== dpr && dpr > 0;
          var isZoom = deltaIsBigger && difference && dprChanged;

          if (isZoom) {
            var newScrollbarSize = (environmentInstance._nativeScrollbarSize = getNativeScrollbarSize(body, envElm));
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

  var unwrap = function unwrap(elm) {
    appendChildren(parent(elm), contents(elm));
    removeElements(elm);
  };

  var contentArrangeCounter = 0;

  var createUniqueViewportArrangeElement = function createUniqueViewportArrangeElement() {
    var elm = document.createElement('style');
    attr(elm, 'id', classNameViewportArrange + '-' + contentArrangeCounter);
    contentArrangeCounter++;
    return elm;
  };

  var evaluateCreationFromStrategy = function evaluateCreationFromStrategy(initializationValue, strategy) {
    var isBooleanValue = isBoolean(initializationValue);

    if (isBooleanValue || isUndefined(initializationValue)) {
      return (isBooleanValue ? initializationValue : strategy) && undefined;
    }

    return initializationValue;
  };

  var createStructureSetup = function createStructureSetup(target) {
    var _getEnvironment = getEnvironment(),
      _getInitializationStrategy = _getEnvironment._getInitializationStrategy,
      _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
      _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid,
      _cssCustomProperties = _getEnvironment._cssCustomProperties;

    var _getInitializationStr = _getInitializationStrategy(),
      paddingNeeded = _getInitializationStr._padding,
      contentNeeded = _getInitializationStr._content;

    var targetIsElm = isHTMLElement(target);
    var osTargetObj = targetIsElm
      ? {}
      : {
          _host: target.host,
          _target: target.target,
          _viewport: target.viewport,
          _padding: evaluateCreationFromStrategy(target.padding, paddingNeeded),
          _content: evaluateCreationFromStrategy(target.content, contentNeeded),
        };

    if (targetIsElm) {
      var viewport = createDiv(classNameViewport);
      var padding = paddingNeeded && createDiv(classNamePadding);
      var content = contentNeeded && createDiv(classNameContent);
      osTargetObj._target = target;
      osTargetObj._padding = padding;
      osTargetObj._viewport = viewport;
      osTargetObj._content = content;
    }

    var _target = osTargetObj._target,
      _padding = osTargetObj._padding,
      _viewport = osTargetObj._viewport,
      _content = osTargetObj._content;
    var destroyFns = [];
    var isTextarea = is(_target, 'textarea');
    var isBody = !isTextarea && is(_target, 'body');

    var _host = isTextarea ? osTargetObj._host || createDiv() : _target;

    var getTargetContents = function getTargetContents(contentSlot) {
      return isTextarea ? _target : contents(contentSlot);
    };

    var isTextareaHostGenerated = isTextarea && _host !== osTargetObj._host;

    if (isTextareaHostGenerated) {
      insertAfter(_target, _host);
      push(destroyFns, function () {
        insertAfter(_host, _target);
        removeElements(_host);
      });
    }

    if (targetIsElm) {
      var contentSlot = _content || _viewport;
      appendChildren(contentSlot, getTargetContents(_target));
      appendChildren(_host, _padding);
      appendChildren(_padding || _host, _viewport);
      appendChildren(_viewport, _content);
      push(destroyFns, function () {
        appendChildren(_host, contents(contentSlot));
        removeElements(_padding || _viewport);
        removeClass(_host, classNameHost);
      });
    } else {
      var contentContainingElm = _content || _viewport || _padding || _host;
      var createPadding = isUndefined(_padding);
      var createViewport = isUndefined(_viewport);
      var createContent = isUndefined(_content);
      var targetContents = getTargetContents(contentContainingElm);
      _padding = osTargetObj._padding = createPadding ? createDiv() : _padding;
      _viewport = osTargetObj._viewport = createViewport ? createDiv() : _viewport;
      _content = osTargetObj._content = createContent ? createDiv() : _content;
      appendChildren(_host, _padding);
      appendChildren(_padding || _host, _viewport);
      appendChildren(_viewport, _content);

      var _contentSlot = _content || _viewport;

      appendChildren(_contentSlot, targetContents);
      push(destroyFns, function () {
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
    var ownerDocument = _target.ownerDocument;
    var bodyElm = ownerDocument.body;
    var wnd = ownerDocument.defaultView;
    var ctx = {
      _windowElm: wnd,
      _documentElm: ownerDocument,
      _htmlElm: parent(bodyElm),
      _bodyElm: bodyElm,
      _isTextarea: isTextarea,
      _isBody: isBody,
    };

    var obj = _extends_1({}, osTargetObj, {
      _host: _host,
    });

    if (_nativeScrollbarStyling) {
      push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
    } else if (!_cssCustomProperties && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y)) {
      var viewportArrangeElm = createUniqueViewportArrangeElement();
      insertBefore(_viewport, viewportArrangeElm);
      push(destroyFns, removeElements.bind(0, viewportArrangeElm));
      obj._viewportArrange = viewportArrangeElm;
    }

    return {
      _targetObj: obj,
      _targetCtx: ctx,
      _destroy: function _destroy() {
        runEach(destroyFns);
      },
    };
  };

  var animationStartEventName = 'animationstart';
  var scrollEventName = 'scroll';
  var scrollAmount = 3333333;

  var directionIsRTL = function directionIsRTL(elm) {
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

    var baseElements = createDOM('<div class="' + classNameSizeObserver + '"><div class="' + classNameSizeObserverListener + '"></div></div>');
    var sizeObserver = baseElements[0];
    var listenerElement = sizeObserver.firstChild;

    var _createCache = createCache(0, {
        _alwaysUpdateValues: true,
        _equal: function _equal(currVal, newVal) {
          return !(!currVal || (!domRectHasDimensions(currVal) && domRectHasDimensions(newVal)));
        },
      }),
      updateResizeObserverContentRectCache = _createCache._update;

    var onSizeChangedCallbackProxy = function onSizeChangedCallbackProxy(sizeChangedContext) {
      var hasDirectionCache = sizeChangedContext && isBoolean(sizeChangedContext._value);
      var skip = false;
      var appear = false;
      var doDirectionScroll = true;

      if (isArray(sizeChangedContext) && sizeChangedContext.length > 0) {
        var _updateResizeObserver = updateResizeObserverContentRectCache(0, sizeChangedContext.pop().contentRect),
          _previous = _updateResizeObserver._previous,
          _value = _updateResizeObserver._value;

        var hasDimensions = domRectHasDimensions(_value);
        var hadDimensions = domRectHasDimensions(_previous);
        skip = !_previous || !hasDimensions;
        appear = !hadDimensions && hasDimensions;
        doDirectionScroll = !skip;
      } else if (hasDirectionCache) {
        doDirectionScroll = sizeChangedContext._changed;
      } else {
        appear = sizeChangedContext === true;
      }

      if (observeDirectionChange && doDirectionScroll) {
        var rtl = hasDirectionCache ? sizeChangedContext._value : directionIsRTL(sizeObserver);
        scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
        scrollTop(sizeObserver, scrollAmount);
      }

      if (!skip) {
        onSizeChangedCallback({
          _sizeChanged: !hasDirectionCache,
          _directionIsRTLCache: hasDirectionCache ? sizeChangedContext : undefined,
          _appear: !!appear,
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
      var observerElementChildren = createDOM(
        '<div class="' +
          classNameSizeObserverListenerItem +
          '" dir="ltr"><div class="' +
          classNameSizeObserverListenerItem +
          '"><div class="' +
          classNameSizeObserverListenerItemFinal +
          '"></div></div><div class="' +
          classNameSizeObserverListenerItem +
          '"><div class="' +
          classNameSizeObserverListenerItemFinal +
          '" style="width: 200%; height: 200%"></div></div></div>'
      );
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
        height: scrollAmount,
      });
      reset();
      appearCallback = observeAppearChange ? onScroll.bind(0, false) : reset;
    }

    if (observeDirectionChange) {
      directionIsRTLCache = createCache(directionIsRTL.bind(0, sizeObserver));
      var _directionIsRTLCache = directionIsRTLCache,
        updateDirectionIsRTLCache = _directionIsRTLCache._update;
      push(
        offListeners,
        on(sizeObserver, scrollEventName, function (event) {
          var directionIsRTLCacheValues = updateDirectionIsRTLCache();
          var _value = directionIsRTLCacheValues._value,
            _changed = directionIsRTLCacheValues._changed;

          if (_changed) {
            removeClass(listenerElement, 'ltr rtl');

            if (_value) {
              addClass(listenerElement, 'rtl');
            } else {
              addClass(listenerElement, 'ltr');
            }

            onSizeChangedCallbackProxy(directionIsRTLCacheValues);
          }

          stopAndPrevent(event);
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
      _destroy: function _destroy() {
        runEach(offListeners);
        removeElements(sizeObserver);
      },
      _getCurrentCacheValues: function _getCurrentCacheValues(force) {
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

  var createTrinsicObserver = function createTrinsicObserver(target, onTrinsicChangedCallback) {
    var trinsicObserver = createDiv(classNameTrinsicObserver);
    var offListeners = [];

    var _createCache = createCache(
        function (ioEntryOrSize) {
          return ioEntryOrSize.h === 0 || ioEntryOrSize.isIntersecting || ioEntryOrSize.intersectionRatio > 0;
        },
        {
          _initialValue: false,
        }
      ),
      updateHeightIntrinsicCache = _createCache._update,
      getCurrentHeightIntrinsicCache = _createCache._current;

    if (IntersectionObserverConstructor) {
      var intersectionObserverInstance = new IntersectionObserverConstructor(
        function (entries) {
          if (entries && entries.length > 0) {
            var last = entries.pop();

            if (last) {
              var heightIntrinsic = updateHeightIntrinsicCache(0, last);

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
      push(offListeners, function () {
        intersectionObserverInstance.disconnect();
      });
    } else {
      var onSizeChanged = function onSizeChanged() {
        var newSize = offsetSize(trinsicObserver);
        var heightIntrinsicCache = updateHeightIntrinsicCache(0, newSize);

        if (heightIntrinsicCache._changed) {
          onTrinsicChangedCallback(heightIntrinsicCache);
        }
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
          _heightIntrinsic: getCurrentHeightIntrinsicCache(force),
        };
      },
    };
  };

  var createEventContentChange = function createEventContentChange(target, eventContentChange, callback) {
    var map;

    var _destroy = function _destroy() {
      if (map) {
        map.forEach(function (eventName, elm) {
          off(elm, eventName, callback);
        });
        map.clear();
      }
    };

    var _updateElements = function _updateElements(getElements) {
      if (map && eventContentChange) {
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
            var registredEventNames = map.get(elm);
            var newEntry = isUndefined(registredEventNames);
            var changingExistingEntry = !newEntry && eventNames !== registredEventNames;
            var finalEventNames = changingExistingEntry ? registredEventNames + ' ' + eventNames : eventNames;

            if (changingExistingEntry) {
              off(elm, registredEventNames, callback);
            }

            map.set(elm, finalEventNames);
            on(elm, finalEventNames, callback);
          });
        });
      }
    };

    if (eventContentChange) {
      map = map || new Map();

      _destroy();

      _updateElements();
    }

    return {
      _destroy: _destroy,
      _updateElements: _updateElements,
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

    var _createEventContentCh = createEventContentChange(
        target,
        isContentObserver && _eventContentChange,
        debounce(
          function () {
            if (isConnected) {
              callback(true);
            }
          },
          {
            _timeout: 33,
            _maxDelay: 99,
          }
        )
      ),
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
          var baseAssertion = isNestedTarget
            ? !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue)
            : notOnlyAttrChanged || contentAttrChanged;
          var contentFinalChanged = baseAssertion && !ignoreContentChange(mutation, !!isNestedTarget, target, options);
          push(totalAddedNodes, addedNodes);
          contentChanged = contentChanged || contentFinalChanged;
          childListChanged = childListChanged || isChildListType;
        }

        if (
          !isContentObserver &&
          targetIsMutationTarget &&
          attributeChanged &&
          !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue)
        ) {
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
      characterData: isContentObserver,
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
      },
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
        var merged = [
          {
            _sizeChanged: prevSizeChanged || currSizeChanged,
            _hostMutation: prevHostMutation || currvHostMutation,
            _contentMutation: prevContentMutation || currContentMutation,
          },
        ];
        return merged;
      },
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
        _heightIntrinsic: heightIntrinsic,
      });
    };

    var onSizeChanged = function onSizeChanged(_ref) {
      var _sizeChanged = _ref._sizeChanged,
        _directionIsRTLCache = _ref._directionIsRTLCache,
        _appear = _ref._appear;
      var updateFn = !_sizeChanged || _appear ? updateLifecycles : updateLifecyclesWithDebouncedAdaptiveUpdateHints;
      updateFn({
        _sizeChanged: _sizeChanged,
        _directionIsRTL: _directionIsRTLCache,
      });
    };

    var onContentMutation = function onContentMutation(contentChangedTroughEvent) {
      var updateFn = contentChangedTroughEvent ? updateLifecycles : updateLifecyclesWithDebouncedAdaptiveUpdateHints;
      updateFn({
        _contentMutation: true,
      });
    };

    var onHostMutation = function onHostMutation(targetChangedAttrs, targetStyleChanged) {
      if (targetStyleChanged) {
        updateLifecyclesWithDebouncedAdaptiveUpdateHints({
          _hostMutation: true,
        });
      } else {
        updateViewportAttrsFromHost(targetChangedAttrs);
      }
    };

    var trinsicObserver = (_content || !_flexboxGlue) && createTrinsicObserver(_host, onTrinsicChanged);
    var sizeObserver = createSizeObserver(_host, onSizeChanged, {
      _appear: true,
      _direction: !_nativeScrollbarStyling,
    });
    var hostMutationObserver = createDOMObserver(_host, false, onHostMutation, {
      _styleChangingAttributes: baseStyleChangingAttrs,
      _attributes: baseStyleChangingAttrs.concat(viewportAttrsFromTarget),
      _ignoreTargetChange: ignoreTargetChange,
    });

    var updateOptions = function updateOptions(checkOption) {
      var _checkOption = checkOption('updating.elementEvents'),
        elementEvents = _checkOption._value,
        elementEventsChanged = _checkOption._changed;

      var _checkOption2 = checkOption('updating.attributes'),
        attributes = _checkOption2._value,
        attributesChanged = _checkOption2._changed;

      var _checkOption3 = checkOption('updating.debounce'),
        debounce = _checkOption3._value,
        debounceChanged = _checkOption3._changed;

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
          _ignoreNestedTargetChange: ignoreTargetChange,
        });
      }

      if (debounceChanged) {
        updateLifecyclesWithDebouncedAdaptiveUpdateHints._flush();

        if (isArray(debounce)) {
          var timeout = debounce[0];
          var maxWait = debounce[1];
          debounceTimeout = isNumber(timeout) ? timeout : false;
          debounceMaxDelay = isNumber(maxWait) ? maxWait : false;
        } else if (isNumber(debounce)) {
          debounceTimeout = debounce;
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
      },
    };
  };

  var createTrinsicLifecycle = function createTrinsicLifecycle(lifecycleHub) {
    var _structureSetup = lifecycleHub._structureSetup;
    var _content = _structureSetup._targetObj._content;
    return function (updateHints) {
      var _heightIntrinsic = updateHints._heightIntrinsic;
      var heightIntrinsic = _heightIntrinsic._value,
        heightIntrinsicChanged = _heightIntrinsic._changed;

      if (heightIntrinsicChanged) {
        style(_content, {
          height: heightIntrinsic ? '' : '100%',
          display: heightIntrinsic ? '' : 'inline',
        });
      }

      return {
        _sizeChanged: heightIntrinsicChanged,
        _contentMutation: heightIntrinsicChanged,
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

    var _createCache = createCache(topRightBottomLeft.bind(0, _host, 'padding'), {
        _equal: equalTRBL,
        _initialValue: topRightBottomLeft(),
      }),
      updatePaddingCache = _createCache._update,
      currentPaddingCache = _createCache._current;

    return function (updateHints, checkOption, force) {
      var _currentPaddingCache = currentPaddingCache(force),
        padding = _currentPaddingCache._value,
        paddingChanged = _currentPaddingCache._changed;

      var _getEnvironment = getEnvironment(),
        _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
        _flexboxGlue = _getEnvironment._flexboxGlue;

      var _sizeChanged = updateHints._sizeChanged,
        _directionIsRTL = updateHints._directionIsRTL,
        _contentMutation = updateHints._contentMutation;
      var directionIsRTL = _directionIsRTL._value,
        directionChanged = _directionIsRTL._changed;

      var _checkOption = checkOption('paddingAbsolute'),
        paddingAbsolute = _checkOption._value,
        paddingAbsoluteChanged = _checkOption._changed;

      var contentMutation = !_flexboxGlue && _contentMutation;

      if (_sizeChanged || paddingChanged || contentMutation) {
        var _updatePaddingCache = updatePaddingCache(force);

        padding = _updatePaddingCache._value;
        paddingChanged = _updatePaddingCache._changed;
      }

      var paddingStyleChanged = paddingAbsoluteChanged || directionChanged || paddingChanged;

      if (paddingStyleChanged) {
        var paddingRelative = !paddingAbsolute || (!_padding && !_nativeScrollbarStyling);
        var paddingHorizontal = padding.r + padding.l;
        var paddingVertical = padding.t + padding.b;
        var paddingStyle = {
          marginRight: paddingRelative && !directionIsRTL ? -paddingHorizontal : 0,
          marginBottom: paddingRelative ? -paddingVertical : 0,
          marginLeft: paddingRelative && directionIsRTL ? -paddingHorizontal : 0,
          top: paddingRelative ? -padding.t : 0,
          right: paddingRelative ? (directionIsRTL ? -padding.r : 'auto') : 0,
          left: paddingRelative ? (directionIsRTL ? 'auto' : -padding.l) : 0,
          width: paddingRelative ? 'calc(100% + ' + paddingHorizontal + 'px)' : '',
        };
        var viewportStyle = {
          paddingTop: paddingRelative ? padding.t : 0,
          paddingRight: paddingRelative ? padding.r : 0,
          paddingBottom: paddingRelative ? padding.b : 0,
          paddingLeft: paddingRelative ? padding.l : 0,
        };
        style(_padding || _viewport, paddingStyle);
        style(_viewport, viewportStyle);

        _setLifecycleCommunication({
          _paddingInfo: {
            _absolute: !paddingRelative,
            _padding: padding,
          },
          _viewportPaddingStyle: _padding ? viewportStyle : _extends_1({}, paddingStyle, viewportStyle),
        });
      }

      return {
        _paddingStyleChanged: paddingStyleChanged,
      };
    };
  };

  var max = Math.max,
    abs$1 = Math.abs,
    round$1 = Math.round;
  var overlaidScrollbarsHideOffset = 42;
  var whCacheOptions = {
    _equal: equalWH,
    _initialValue: {
      w: 0,
      h: 0,
    },
  };

  var sizeFraction = function sizeFraction(elm) {
    var viewportOffsetSize = offsetSize(elm);
    var viewportRect = getBoundingClientRect(elm);
    return {
      w: viewportRect.width - viewportOffsetSize.w,
      h: viewportRect.height - viewportOffsetSize.h,
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
      _behavior: behaviorIsVisibleHidden ? 'hidden' : 'scroll',
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

    var _createCache = createCache(sizeFraction.bind(0, _viewport), whCacheOptions),
      updateViewportSizeFraction = _createCache._update,
      getCurrentViewportSizeFraction = _createCache._current;

    var _createCache2 = createCache(scrollSize.bind(0, _viewport), whCacheOptions),
      updateViewportScrollSizeCache = _createCache2._update,
      getCurrentViewportScrollSizeCache = _createCache2._current;

    var _createCache3 = createCache(function (_ref) {
        var _viewportScrollSize = _ref._viewportScrollSize,
          _viewportClientSize = _ref._viewportClientSize,
          _viewportSizeFraction = _ref._viewportSizeFraction;
        return {
          w: max(
            0,
            round$1(max(0, _viewportScrollSize.w - _viewportClientSize.w) - (fractionalPixelRatioTollerance() || max(0, _viewportSizeFraction.w)))
          ),
          h: max(
            0,
            round$1(max(0, _viewportScrollSize.h - _viewportClientSize.h) - (fractionalPixelRatioTollerance() || max(0, _viewportSizeFraction.h)))
          ),
        };
      }, whCacheOptions),
      updateOverflowAmountCache = _createCache3._update,
      getCurrentOverflowAmountCache = _createCache3._current;

    var fixFlexboxGlue = function fixFlexboxGlue(viewportOverflowState, heightIntrinsic) {
      style(_viewport, {
        height: '',
      });

      if (heightIntrinsic) {
        var _getLifecycleCommunic = _getLifecycleCommunication()._paddingInfo,
          paddingAbsolute = _getLifecycleCommunic._absolute,
          padding = _getLifecycleCommunic._padding;

        var _overflowScroll = viewportOverflowState._overflowScroll,
          _scrollbarsHideOffset = viewportOverflowState._scrollbarsHideOffset;
        var hostSizeFraction = sizeFraction(_host);
        var hostClientSize = clientSize(_host);
        var paddingVertical = paddingAbsolute || style(_viewport, 'boxSizing') === 'content-box' ? padding.b + padding.t : 0;
        var fractionalClientHeight = hostClientSize.h + (abs$1(hostSizeFraction.h) < 1 ? hostSizeFraction.h : 0);
        style(_viewport, {
          height: fractionalClientHeight + (_overflowScroll.x ? _scrollbarsHideOffset.x : 0) - paddingVertical,
        });
      }
    };

    var getViewportOverflowState = function getViewportOverflowState(showNativeOverlaidScrollbars, viewportStyleObj) {
      var _getEnvironment = getEnvironment(),
        _nativeScrollbarSize = _getEnvironment._nativeScrollbarSize,
        _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid,
        _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling;

      var overlaidX = _nativeScrollbarIsOverlaid.x,
        overlaidY = _nativeScrollbarIsOverlaid.y;
      var determineOverflow = !viewportStyleObj;
      var arrangeHideOffset = !_nativeScrollbarStyling && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
      var styleObj = determineOverflow ? style(_viewport, ['overflowX', 'overflowY']) : viewportStyleObj;
      var scroll = {
        x: styleObj.overflowX === 'scroll',
        y: styleObj.overflowY === 'scroll',
      };
      var scrollbarsHideOffset = {
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
        var fractionalContentWidth = viewportScrollSize.w + (abs$1(viewportSizeFraction.w) < 1 ? viewportSizeFraction.w : 0);
        var fractionalContenHeight = viewportScrollSize.h + (abs$1(viewportSizeFraction.h) < 1 ? viewportSizeFraction.h : 0);
        var arrangeSize = {
          w: hideOffsetY && arrangeY ? hideOffsetY + fractionalContentWidth - viewportArrangeHorizontalPaddingValue + 'px' : '',
          h: hideOffsetX && arrangeX ? hideOffsetX + fractionalContenHeight - viewportArrangeVerticalPaddingValue + 'px' : '',
        };

        if (_viewportArrange) {
          var sheet = _viewportArrange.sheet;

          if (sheet) {
            var cssRules = sheet.cssRules;

            if (cssRules) {
              if (!cssRules.length) {
                sheet.insertRule('#' + attr(_viewportArrange, 'id') + ' + .' + classNameViewportArrange + '::before {}', 0);
              }

              var ruleStyle = cssRules[0].style;
              ruleStyle.width = arrangeSize.w;
              ruleStyle.height = arrangeSize.h;
            }
          }
        } else {
          style(_viewport, {
            '--os-vaw': arrangeSize.w,
            '--os-vah': arrangeSize.h,
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
      viewportStyleObj.width = 'calc(100% + ' + (hideOffsetY + horizontalMarginValue * -1) + 'px)';
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

        var _getEnvironment2 = getEnvironment(),
          _flexboxGlue = _getEnvironment2._flexboxGlue;

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
        return {
          _redoViewportArrange: function _redoViewportArrange() {
            hideNativeScrollbars(finalViewportOverflowState, directionIsRTL, _doViewportArrange, prevStyle);
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

    return function (updateHints, checkOption, force) {
      var _directionIsRTL = updateHints._directionIsRTL,
        _heightIntrinsic = updateHints._heightIntrinsic,
        _sizeChanged = updateHints._sizeChanged,
        _hostMutation = updateHints._hostMutation,
        _contentMutation = updateHints._contentMutation,
        _paddingStyleChanged = updateHints._paddingStyleChanged;

      var _getEnvironment3 = getEnvironment(),
        _flexboxGlue = _getEnvironment3._flexboxGlue,
        _nativeScrollbarStyling = _getEnvironment3._nativeScrollbarStyling,
        _nativeScrollbarIsOverlaid = _getEnvironment3._nativeScrollbarIsOverlaid;

      var heightIntrinsic = _heightIntrinsic._value,
        heightIntrinsicChanged = _heightIntrinsic._changed;
      var directionIsRTL = _directionIsRTL._value,
        directionChanged = _directionIsRTL._changed;

      var _checkOption = checkOption('nativeScrollbarsOverlaid.show'),
        showNativeOverlaidScrollbarsOption = _checkOption._value,
        showNativeOverlaidScrollbarsChanged = _checkOption._changed;

      var showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
      var adjustFlexboxGlue =
        !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged || heightIntrinsicChanged);
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
          _redoViewportArrange = _undoViewportArrange._redoViewportArrange,
          undoViewportArrangeOverflowState = _undoViewportArrange._viewportOverflowState;

        var _viewportSizeFraction3 = (viewportSizeFractionCache = updateViewportSizeFraction(force)),
          _viewportSizeFraction2 = _viewportSizeFraction3._value,
          viewportSizeFractionCahnged = _viewportSizeFraction3._changed;

        var _viewportScrollSizeCa = (viewportScrollSizeCache = updateViewportScrollSizeCache(force)),
          _viewportScrollSize2 = _viewportScrollSizeCa._value,
          _viewportScrollSizeChanged = _viewportScrollSizeCa._changed;

        var viewportContentSize = clientSize(_viewport);
        var arrangedViewportScrollSize = _viewportScrollSize2;
        var arrangedViewportClientSize = viewportContentSize;

        _redoViewportArrange();

        if (
          (_viewportScrollSizeChanged || viewportSizeFractionCahnged || showNativeOverlaidScrollbarsChanged) &&
          undoViewportArrangeOverflowState &&
          !showNativeOverlaidScrollbars &&
          arrangeViewport(undoViewportArrangeOverflowState, _viewportScrollSize2, _viewportSizeFraction2, directionIsRTL)
        ) {
          arrangedViewportClientSize = clientSize(_viewport);
          arrangedViewportScrollSize = scrollSize(_viewport);
        }

        overflowAmuntCache = updateOverflowAmountCache(force, {
          _viewportSizeFraction: _viewportSizeFraction2,
          _viewportScrollSize: {
            w: max(_viewportScrollSize2.w, arrangedViewportScrollSize.w),
            h: max(_viewportScrollSize2.h, arrangedViewportScrollSize.h),
          },
          _viewportClientSize: {
            w: arrangedViewportClientSize.w + max(0, viewportContentSize.w - _viewportScrollSize2.w),
            h: arrangedViewportClientSize.h + max(0, viewportContentSize.h - _viewportScrollSize2.h),
          },
        });
      }

      var _viewportSizeFraction4 = viewportSizeFractionCache,
        viewportSizeFraction = _viewportSizeFraction4._value,
        viewportSizeFractionChanged = _viewportSizeFraction4._changed;
      var _viewportScrollSizeCa2 = viewportScrollSizeCache,
        viewportScrollSize = _viewportScrollSizeCa2._value,
        viewportScrollSizeChanged = _viewportScrollSizeCa2._changed;
      var _overflowAmuntCache = overflowAmuntCache,
        overflowAmount = _overflowAmuntCache._value,
        overflowAmountChanged = _overflowAmuntCache._changed;

      var _checkOption2 = checkOption('overflow'),
        overflow = _checkOption2._value,
        overflowChanged = _checkOption2._changed;

      if (
        _paddingStyleChanged ||
        viewportSizeFractionChanged ||
        viewportScrollSizeChanged ||
        overflowAmountChanged ||
        overflowChanged ||
        showNativeOverlaidScrollbarsChanged ||
        directionChanged ||
        adjustFlexboxGlue
      ) {
        var viewportStyle = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: '',
          overflowY: '',
          overflowX: '',
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
          _viewportOverflowAmount: overflowAmount,
        });
      }
    };
  };

  var getPropByPath = function getPropByPath(obj, path) {
    return obj
      ? path.split('.').reduce(function (o, prop) {
          return o && hasOwnProperty$1(o, prop) ? o[prop] : undefined;
        }, obj)
      : undefined;
  };

  var booleanCacheValuesFallback = {
    _value: false,
    _previous: false,
    _changed: false,
  };
  var lifecycleCommunicationFallback = {
    _paddingInfo: {
      _absolute: false,
      _padding: {
        t: 0,
        r: 0,
        b: 0,
        l: 0,
      },
    },
    _viewportOverflowScroll: {
      x: false,
      y: false,
    },
    _viewportOverflowAmount: {
      w: 0,
      h: 0,
    },
    _viewportPaddingStyle: {
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0,
    },
  };
  var createLifecycleHub = function createLifecycleHub(options, structureSetup) {
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
      },
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

      var finalDirectionIsRTL =
        _directionIsRTL || (_sizeObserver ? _sizeObserver._getCurrentCacheValues(force)._directionIsRTL : booleanCacheValuesFallback);
      var finalHeightIntrinsic =
        _heightIntrinsic || (_trinsicObserver ? _trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : booleanCacheValuesFallback);

      var checkOption = function checkOption(path) {
        return {
          _value: getPropByPath(options, path),
          _changed: force || getPropByPath(changedOptions, path) !== undefined,
        };
      };

      var adjustScrollOffset = doViewportArrange || !_flexboxGlue;
      var scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
      var scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);

      if (_updateObserverOptions) {
        _updateObserverOptions(checkOption);
      }

      each(lifecycles, function (lifecycle) {
        var _ref2 =
            lifecycle(
              {
                _directionIsRTL: finalDirectionIsRTL,
                _heightIntrinsic: finalHeightIntrinsic,
                _sizeChanged: _sizeChanged,
                _hostMutation: _hostMutation,
                _contentMutation: _contentMutation,
                _paddingStyleChanged: _paddingStyleChanged,
              },
              checkOption,
              !!force
            ) || {},
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
      return updateLifecycles(null, changedOptions, force);
    };

    var envUpdateListener = update.bind(null, null, true);
    addEnvironmentListener(envUpdateListener);
    console.log(getEnvironment());
    return {
      _update: update,
      _state: function _state() {
        return {
          _overflowAmount: lifecycleCommunication._viewportOverflowAmount,
        };
      },
      _destroy: function _destroy() {
        destroyObservers();
        removeEnvironmentListener(envUpdateListener);
      },
    };
  };

  var OverlayScrollbars = function OverlayScrollbars(target, options, extensions) {
    var _getEnvironment = getEnvironment(),
      _getDefaultOptions = _getEnvironment._getDefaultOptions;

    var currentOptions = assignDeep({}, _getDefaultOptions(), validateOptions(options || {}, optionsTemplate, null, true)._validated);
    var structureSetup = createStructureSetup(target);
    var lifecycleHub = createLifecycleHub(currentOptions, structureSetup);
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
        lifecycleHub._update(null, force);
      },
    };
    instance.update(true);
    return instance;
  };

  return OverlayScrollbars;
});
//# sourceMappingURL=overlayscrollbars.js.map
