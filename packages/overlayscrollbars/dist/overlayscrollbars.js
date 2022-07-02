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
    return arr.indexOf(item, fromIndex);
  };
  var push = function push(array, items, arrayIsSingleItem) {
    !arrayIsSingleItem && !isString(items) && isArrayLike(items) ? Array.prototype.push.apply(array, items) : array.push(items);
    return array;
  };
  var from = function from(arr) {
    if (Array.from && arr) {
      return Array.from(arr);
    }

    var result = [];

    if (arr instanceof Set) {
      arr.forEach(function (value) {
        push(result, value);
      });
    } else {
      each(arr, function (elm) {
        push(result, elm);
      });
    }

    return result;
  };
  var isEmptyArray = function isEmptyArray(array) {
    return !!array && array.length === 0;
  };
  var runEach = function runEach(arr, args) {
    var runFn = function runFn(fn) {
      return fn && fn.apply(undefined, args || []);
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
  var removeClass = function removeClass(elm, className) {
    classListAction(elm, className, function (classList, clazz) {
      return classList.remove(clazz);
    });
  };
  var addClass = function addClass(elm, className) {
    classListAction(elm, className, function (classList, clazz) {
      return classList.add(clazz);
    });
    return removeClass.bind(0, elm, className);
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
  var equalXY = function equalXY(a, b) {
    return equal(a, b, ['x', 'y']);
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
  var fractionalSize = function fractionalSize(elm) {
    var cssHeight = parseFloat(style(elm, 'height')) || 0;
    var cssWidth = parseFloat(style(elm, 'height')) || 0;
    return {
      w: cssWidth - Math.round(cssWidth),
      h: cssHeight - Math.round(cssHeight)
    };
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

  var manageListener = function manageListener(callback, listener) {
    each(isArray(listener) ? listener : [listener], callback);
  };

  var createEventListenerHub = function createEventListenerHub(initialEventListeners) {
    var events = new Map();

    var removeEvent = function removeEvent(name, listener) {
      if (name) {
        var eventSet = events.get(name);
        manageListener(function (currListener) {
          if (eventSet) {
            eventSet[currListener ? 'delete' : 'clear'](currListener);
          }
        }, listener);
      } else {
        events.forEach(function (eventSet) {
          eventSet.clear();
        });
        events.clear();
      }
    };

    var addEvent = function addEvent(name, listener) {
      var eventSet = events.get(name) || new Set();
      events.set(name, eventSet);
      manageListener(function (currListener) {
        currListener && eventSet.add(currListener);
      }, listener);
      return removeEvent.bind(0, name, listener);
    };

    var triggerEvent = function triggerEvent(name, args) {
      var eventSet = events.get(name);
      each(from(eventSet), function (event) {
        if (args) {
          event(args);
        } else {
          event();
        }
      });
    };

    var initialListenerKeys = keys(initialEventListeners);
    each(initialListenerKeys, function (key) {
      addEvent(key, initialEventListeners[key]);
    });
    return [addEvent, removeEvent, triggerEvent];
  };

  var getPropByPath = function getPropByPath(obj, path) {
    return obj ? path.split('.').reduce(function (o, prop) {
      return o && hasOwnProperty(o, prop) ? o[prop] : undefined;
    }, obj) : undefined;
  };

  var createOptionCheck = function createOptionCheck(options, changedOptions, force) {
    return function (path) {
      return [getPropByPath(options, path), force || getPropByPath(changedOptions, path) !== undefined];
    };
  };
  var createState = function createState(initialState) {
    var state = initialState;
    return [function () {
      return state;
    }, function (newState) {
      state = assignDeep({}, state, newState);
    }];
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

  var stringify = function stringify(value) {
    return JSON.stringify(value, function (_, val) {
      if (isFunction(val)) {
        throw new Error();
      }

      return val;
    });
  };

  var defaultOptions = {
    resize: 'none',
    paddingAbsolute: false,
    updating: {
      elementEvents: [['img', 'load']],
      attributes: null,
      debounce: [0, 33]
    },
    overflow: {
      x: 'scroll',
      y: 'scroll'
    },
    scrollbars: {
      visibility: 'auto',
      autoHide: 'never',
      autoHideDelay: 800,
      dragScroll: true,
      clickScroll: false,
      touch: true
    },
    textarea: {
      dynWidth: false,
      dynHeight: false,
      inheritedAttrs: ['style', 'class']
    },
    nativeScrollbarsOverlaid: {
      show: false,
      initialize: false
    },
    callbacks: {
      onUpdated: null
    }
  };
  var getOptionsDiff = function getOptionsDiff(currOptions, newOptions) {
    var diff = {};
    var optionsKeys = keys(newOptions).concat(keys(currOptions));
    each(optionsKeys, function (optionKey) {
      var currOptionValue = currOptions[optionKey];
      var newOptionValue = newOptions[optionKey];

      if (isObject(currOptionValue) && isObject(newOptionValue)) {
        assignDeep(diff[optionKey] = {}, getOptionsDiff(currOptionValue, newOptionValue));
      } else if (hasOwnProperty(newOptions, optionKey) && newOptionValue !== currOptionValue) {
        var isDiff = true;

        if (isArray(currOptionValue) || isArray(newOptionValue)) {
          try {
            if (stringify(currOptionValue) === stringify(newOptionValue)) {
              isDiff = false;
            }
          } catch (_unused) {}
        }

        if (isDiff) {
          diff[optionKey] = newOptionValue;
        }
      }
    });
    return diff;
  };

  var environmentInstance;
  var abs = Math.abs,
      round = Math.round;

  var diffBiggerThanOne = function diffBiggerThanOne(valOne, valTwo) {
    var absValOne = abs(valOne);
    var absValTwo = abs(valTwo);
    return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
  };

  var getNativeScrollbarSize = function getNativeScrollbarSize(body, measureElm, measureElmChild) {
    appendChildren(body, measureElm);
    var cSize = clientSize(measureElm);
    var oSize = offsetSize(measureElm);
    var fSize = fractionalSize(measureElmChild);
    return {
      x: oSize.h - cSize.h + fSize.h,
      y: oSize.w - cSize.w + fSize.w
    };
  };

  var getNativeScrollbarStyling = function getNativeScrollbarStyling(testElm) {
    var result = false;
    var revertClass = addClass(testElm, classNameViewportScrollbarStyling);

    try {
      result = style(testElm, cssProperty('scrollbar-width')) === 'none' || window.getComputedStyle(testElm, '::-webkit-scrollbar').getPropertyValue('display') === 'none';
    } catch (ex) {}

    revertClass();
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
    var revertFbxGlue = addClass(parentElm, classNameEnvironmentFlexboxGlue);
    var minOffsetsizeParent = getBoundingClientRect(parentElm);
    var minOffsetsize = getBoundingClientRect(childElm);
    var supportsMin = equalBCRWH(minOffsetsize, minOffsetsizeParent, true);
    var revertFbxGlueMax = addClass(parentElm, classNameEnvironmentFlexboxGlueMax);
    var maxOffsetsizeParent = getBoundingClientRect(parentElm);
    var maxOffsetsize = getBoundingClientRect(childElm);
    var supportsMax = equalBCRWH(maxOffsetsize, maxOffsetsizeParent, true);
    revertFbxGlue();
    revertFbxGlueMax();
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
      _padding: !nativeScrollbarStyling,
      _content: false,
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

    var _createCache = createCache({
      _initialValue: getNativeScrollbarSize(body, envElm, envChildElm),
      _equal: equalXY
    }),
        updateNativeScrollbarSizeCache = _createCache[0],
        getNativeScrollbarSizeCache = _createCache[1];

    var _getNativeScrollbarSi = getNativeScrollbarSizeCache(),
        nativeScrollbarSize = _getNativeScrollbarSi[0];

    var nativeScrollbarStyling = getNativeScrollbarStyling(envElm);
    var nativeScrollbarIsOverlaid = {
      x: nativeScrollbarSize.x === 0,
      y: nativeScrollbarSize.y === 0
    };
    var initializationStrategy = getDefaultInitializationStrategy(nativeScrollbarStyling);
    var defaultDefaultOptions = assignDeep({}, defaultOptions);
    var env = {
      _nativeScrollbarSize: nativeScrollbarSize,
      _nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
      _nativeScrollbarStyling: nativeScrollbarStyling,
      _cssCustomProperties: style(envElm, 'zIndex') === '-1',
      _rtlScrollBehavior: getRtlScrollBehavior(envElm, envChildElm),
      _flexboxGlue: getFlexboxGlue(envElm, envChildElm),
      _addListener: function _addListener(listener) {
        onChangedListener.add(listener);
        return function () {
          return onChangedListener.delete(listener);
        };
      },
      _getInitializationStrategy: assignDeep.bind(0, {}, initializationStrategy),
      _setInitializationStrategy: function _setInitializationStrategy(newInitializationStrategy) {
        assignDeep(initializationStrategy, newInitializationStrategy);
      },
      _getDefaultOptions: assignDeep.bind(0, {}, defaultDefaultOptions),
      _setDefaultOptions: function _setDefaultOptions(newDefaultOptions) {
        assignDeep(defaultDefaultOptions, newDefaultOptions);
      },
      _defaultInitializationStrategy: assignDeep({}, initializationStrategy),
      _defaultDefaultOptions: assignDeep({}, defaultDefaultOptions)
    };
    removeAttr(envElm, 'style');
    removeElements(envElm);

    if (!nativeScrollbarStyling && (!nativeScrollbarIsOverlaid.x || !nativeScrollbarIsOverlaid.y)) {
      var size = windowSize();
      var dpr = getWindowDPR();
      window.addEventListener('resize', function () {
        if (onChangedListener.size) {
          var sizeNew = windowSize();
          var deltaSize = {
            w: sizeNew.w - size.w,
            h: sizeNew.h - size.h
          };
          if (deltaSize.w === 0 && deltaSize.h === 0) return;
          var deltaAbsSize = {
            w: abs(deltaSize.w),
            h: abs(deltaSize.h)
          };
          var deltaAbsRatio = {
            w: abs(round(sizeNew.w / (size.w / 100.0))),
            h: abs(round(sizeNew.h / (size.h / 100.0)))
          };
          var dprNew = getWindowDPR();
          var deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
          var difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
          var dprChanged = dprNew !== dpr && dpr > 0;
          var isZoom = deltaIsBigger && difference && dprChanged;

          if (isZoom) {
            var _updateNativeScrollba = updateNativeScrollbarSizeCache(getNativeScrollbarSize(body, envElm, envChildElm)),
                scrollbarSize = _updateNativeScrollba[0],
                scrollbarSizeChanged = _updateNativeScrollba[1];

            assignDeep(environmentInstance._nativeScrollbarSize, scrollbarSize);
            removeElements(envElm);

            if (scrollbarSizeChanged) {
              runEach(onChangedListener);
            }
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
    var result = initializationValue || (isFunction(strategy) ? strategy(target) : strategy);
    return result || createDiv(elementClass);
  };

  var dynamicCreationFromStrategy = function dynamicCreationFromStrategy(target, initializationValue, strategy, elementClass) {
    var takeInitializationValue = isBoolean(initializationValue) || initializationValue;
    var result = takeInitializationValue ? initializationValue : isFunction(strategy) ? strategy(target) : strategy;
    return result === true ? createDiv(elementClass) : result;
  };

  var createStructureSetupElements = function createStructureSetupElements(target) {
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
      _padding: dynamicCreationFromStrategy(targetElement, targetStructureInitialization.padding, paddingInitializationStrategy, classNamePadding),
      _content: dynamicCreationFromStrategy(targetElement, targetStructureInitialization.content, contentInitializationStrategy, classNameContent),
      _viewportArrange: createUniqueViewportArrangeElement(),
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

    return [evaluatedTargetObj, runEach.bind(0, destroyFns)];
  };

  var createTrinsicUpdate = function createTrinsicUpdate(structureSetupElements, state) {
    var _content = structureSetupElements._content;
    var getState = state[0];
    return function (updateHints) {
      var _getState = getState(),
          _heightIntrinsic = _getState._heightIntrinsic;

      var _heightIntrinsicChanged = updateHints._heightIntrinsicChanged;

      if (_heightIntrinsicChanged) {
        style(_content, {
          height: _heightIntrinsic ? '' : '100%',
          display: _heightIntrinsic ? '' : 'inline'
        });
      }

      return {
        _sizeChanged: _heightIntrinsicChanged,
        _contentMutation: _heightIntrinsicChanged
      };
    };
  };

  var createPaddingUpdate = function createPaddingUpdate(structureSetupElements, state) {
    var getState = state[0],
        setState = state[1];
    var _host = structureSetupElements._host,
        _padding = structureSetupElements._padding,
        _viewport = structureSetupElements._viewport;

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

      var _getState = getState(),
          _directionIsRTL = _getState._directionIsRTL;

      var _sizeChanged = updateHints._sizeChanged,
          _contentMutation = updateHints._contentMutation,
          _directionChanged = updateHints._directionChanged;

      var _checkOption = checkOption('paddingAbsolute'),
          paddingAbsolute = _checkOption[0],
          paddingAbsoluteChanged = _checkOption[1];

      var contentMutation = !_flexboxGlue && _contentMutation;

      if (_sizeChanged || paddingChanged || contentMutation) {
        var _updatePaddingCache = updatePaddingCache(force);

        padding = _updatePaddingCache[0];
        paddingChanged = _updatePaddingCache[1];
      }

      var paddingStyleChanged = paddingAbsoluteChanged || _directionChanged || paddingChanged;

      if (paddingStyleChanged) {
        var paddingRelative = !paddingAbsolute || !_padding && !_nativeScrollbarStyling;
        var paddingHorizontal = padding.r + padding.l;
        var paddingVertical = padding.t + padding.b;
        var paddingStyle = {
          marginRight: paddingRelative && !_directionIsRTL ? -paddingHorizontal : 0,
          marginBottom: paddingRelative ? -paddingVertical : 0,
          marginLeft: paddingRelative && _directionIsRTL ? -paddingHorizontal : 0,
          top: paddingRelative ? -padding.t : 0,
          right: paddingRelative ? _directionIsRTL ? -padding.r : 'auto' : 0,
          left: paddingRelative ? _directionIsRTL ? 'auto' : -padding.l : 0,
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
        setState({
          _padding: padding,
          _paddingAbsolute: !paddingRelative,
          _viewportPaddingStyle: _padding ? viewportStyle : assignDeep({}, paddingStyle, viewportStyle)
        });
      }

      return {
        _paddingStyleChanged: paddingStyleChanged
      };
    };
  };

  var max = Math.max;
  var overlaidScrollbarsHideOffset = 42;
  var whCacheOptions = {
    _equal: equalWH,
    _initialValue: {
      w: 0,
      h: 0
    }
  };
  var xyCacheOptions = {
    _equal: equalXY,
    _initialValue: {
      x: false,
      y: false
    }
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

    return [behaviorIsVisible, behaviorIsVisibleHidden ? 'hidden' : 'scroll'];
  };

  var getOverflowAmount = function getOverflowAmount(viewportScrollSize, viewportClientSize, sizeFraction) {
    var tollerance = window.devicePixelRatio % 2 !== 0 ? 1 : 0;
    var amount = {
      w: max(0, viewportScrollSize.w - viewportClientSize.w - max(0, sizeFraction.w)),
      h: max(0, viewportScrollSize.h - viewportClientSize.h - max(0, sizeFraction.h))
    };
    return {
      w: amount.w >= tollerance ? amount.w : 0,
      h: amount.h >= tollerance ? amount.h : 0
    };
  };

  var createOverflowUpdate = function createOverflowUpdate(structureSetupElements, state) {
    var getState = state[0],
        setState = state[1];
    var _host = structureSetupElements._host,
        _viewport = structureSetupElements._viewport,
        _viewportArrange = structureSetupElements._viewportArrange;

    var _getEnvironment = getEnvironment(),
        _nativeScrollbarSize = _getEnvironment._nativeScrollbarSize,
        _flexboxGlue = _getEnvironment._flexboxGlue,
        _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
        _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid;

    var doViewportArrange = !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);

    var _createCache = createCache(whCacheOptions, fractionalSize.bind(0, _host)),
        updateSizeFraction = _createCache[0],
        getCurrentSizeFraction = _createCache[1];

    var _createCache2 = createCache(whCacheOptions, scrollSize.bind(0, _viewport)),
        updateViewportScrollSizeCache = _createCache2[0],
        getCurrentViewportScrollSizeCache = _createCache2[1];

    var _createCache3 = createCache(whCacheOptions),
        updateOverflowAmountCache = _createCache3[0],
        getCurrentOverflowAmountCache = _createCache3[1];

    var _createCache4 = createCache(xyCacheOptions),
        updateOverflowScrollCache = _createCache4[0];

    var fixFlexboxGlue = function fixFlexboxGlue(viewportOverflowState, heightIntrinsic) {
      style(_viewport, {
        height: ''
      });

      if (heightIntrinsic) {
        var _getState = getState(),
            _paddingAbsolute = _getState._paddingAbsolute,
            _padding = _getState._padding;

        var _overflowScroll = viewportOverflowState._overflowScroll,
            _scrollbarsHideOffset = viewportOverflowState._scrollbarsHideOffset;
        var fSize = fractionalSize(_host);
        var hostClientSize = clientSize(_host);
        var isContentBox = style(_viewport, 'boxSizing') === 'content-box';
        var paddingVertical = _paddingAbsolute || isContentBox ? _padding.b + _padding.t : 0;
        var subtractXScrollbar = !(_nativeScrollbarIsOverlaid.x && isContentBox);
        style(_viewport, {
          height: hostClientSize.h + fSize.h + (_overflowScroll.x && subtractXScrollbar ? _scrollbarsHideOffset.x : 0) - paddingVertical
        });
      }
    };

    var getViewportOverflowState = function getViewportOverflowState(showNativeOverlaidScrollbars, viewportStyleObj) {
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
          xVisible = _setAxisOverflowStyle[0],
          xVisibleBehavior = _setAxisOverflowStyle[1];

      var _setAxisOverflowStyle2 = setAxisOverflowStyle(false, overflowAmount.h, overflow.y, viewportStyleObj),
          yVisible = _setAxisOverflowStyle2[0],
          yVisibleBehavior = _setAxisOverflowStyle2[1];

      if (xVisible && !yVisible) {
        viewportStyleObj.overflowX = xVisibleBehavior;
      }

      if (yVisible && !xVisible) {
        viewportStyleObj.overflowY = yVisibleBehavior;
      }

      return getViewportOverflowState(showNativeOverlaidScrollbars, viewportStyleObj);
    };

    var arrangeViewport = function arrangeViewport(viewportOverflowState, viewportScrollSize, sizeFraction, directionIsRTL) {
      if (doViewportArrange) {
        var _getState2 = getState(),
            _viewportPaddingStyle = _getState2._viewportPaddingStyle;

        var _scrollbarsHideOffset = viewportOverflowState._scrollbarsHideOffset,
            _scrollbarsHideOffsetArrange = viewportOverflowState._scrollbarsHideOffsetArrange;
        var arrangeX = _scrollbarsHideOffsetArrange.x,
            arrangeY = _scrollbarsHideOffsetArrange.y;
        var hideOffsetX = _scrollbarsHideOffset.x,
            hideOffsetY = _scrollbarsHideOffset.y;
        var viewportArrangeHorizontalPaddingKey = directionIsRTL ? 'paddingRight' : 'paddingLeft';
        var viewportArrangeHorizontalPaddingValue = _viewportPaddingStyle[viewportArrangeHorizontalPaddingKey];
        var viewportArrangeVerticalPaddingValue = _viewportPaddingStyle.paddingTop;
        var fractionalContentWidth = viewportScrollSize.w + sizeFraction.w;
        var fractionalContenHeight = viewportScrollSize.h + sizeFraction.h;
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

      return doViewportArrange;
    };

    var hideNativeScrollbars = function hideNativeScrollbars(viewportOverflowState, directionIsRTL, viewportArrange, viewportStyleObj) {
      var _scrollbarsHideOffset = viewportOverflowState._scrollbarsHideOffset,
          _scrollbarsHideOffsetArrange = viewportOverflowState._scrollbarsHideOffsetArrange;
      var arrangeX = _scrollbarsHideOffsetArrange.x,
          arrangeY = _scrollbarsHideOffsetArrange.y;
      var hideOffsetX = _scrollbarsHideOffset.x,
          hideOffsetY = _scrollbarsHideOffset.y;

      var _getState3 = getState(),
          viewportPaddingStyle = _getState3._viewportPaddingStyle;

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
      if (doViewportArrange) {
        var finalViewportOverflowState = viewportOverflowState || getViewportOverflowState(showNativeOverlaidScrollbars);

        var _getState4 = getState(),
            viewportPaddingStyle = _getState4._viewportPaddingStyle;

        var _scrollbarsHideOffsetArrange = finalViewportOverflowState._scrollbarsHideOffsetArrange;
        var arrangeX = _scrollbarsHideOffsetArrange.x,
            arrangeY = _scrollbarsHideOffsetArrange.y;
        var finalPaddingStyle = {};

        var assignProps = function assignProps(props) {
          return each(props.split(' '), function (prop) {
            finalPaddingStyle[prop] = viewportPaddingStyle[prop];
          });
        };

        if (arrangeX) {
          assignProps('marginBottom paddingTop paddingBottom');
        }

        if (arrangeY) {
          assignProps('marginLeft marginRight paddingLeft paddingRight');
        }

        var prevStyle = style(_viewport, keys(finalPaddingStyle));
        removeClass(_viewport, classNameViewportArrange);

        if (!_flexboxGlue) {
          finalPaddingStyle.height = '';
        }

        style(_viewport, finalPaddingStyle);
        return [function () {
          hideNativeScrollbars(finalViewportOverflowState, directionIsRTL, doViewportArrange, prevStyle);
          style(_viewport, prevStyle);
          addClass(_viewport, classNameViewportArrange);
        }, finalViewportOverflowState];
      }

      return [noop];
    };

    return function (updateHints, checkOption, force) {
      var _sizeChanged = updateHints._sizeChanged,
          _hostMutation = updateHints._hostMutation,
          _contentMutation = updateHints._contentMutation,
          _paddingStyleChanged = updateHints._paddingStyleChanged,
          _heightIntrinsicChanged = updateHints._heightIntrinsicChanged,
          _directionChanged = updateHints._directionChanged;

      var _getState5 = getState(),
          _heightIntrinsic = _getState5._heightIntrinsic,
          _directionIsRTL = _getState5._directionIsRTL;

      var _checkOption = checkOption('nativeScrollbarsOverlaid.show'),
          showNativeOverlaidScrollbarsOption = _checkOption[0],
          showNativeOverlaidScrollbarsChanged = _checkOption[1];

      var _checkOption2 = checkOption('overflow'),
          overflow = _checkOption2[0],
          overflowChanged = _checkOption2[1];

      var showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
      var adjustFlexboxGlue = !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged || _heightIntrinsicChanged);
      var sizeFractionCache = getCurrentSizeFraction(force);
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
        fixFlexboxGlue(preMeasureViewportOverflowState, _heightIntrinsic);
      }

      if (_sizeChanged || _paddingStyleChanged || _contentMutation || _directionChanged || showNativeOverlaidScrollbarsChanged) {
        var _undoViewportArrange = undoViewportArrange(showNativeOverlaidScrollbars, _directionIsRTL, preMeasureViewportOverflowState),
            redoViewportArrange = _undoViewportArrange[0],
            undoViewportArrangeOverflowState = _undoViewportArrange[1];

        var _sizeFractionCache = sizeFractionCache = updateSizeFraction(force),
            _sizeFraction = _sizeFractionCache[0],
            _sizeFractionChanged = _sizeFractionCache[1];

        var _viewportScrollSizeCa = viewportScrollSizeCache = updateViewportScrollSizeCache(force),
            _viewportScrollSize = _viewportScrollSizeCa[0],
            _viewportScrollSizeChanged = _viewportScrollSizeCa[1];

        var viewportContentSize = clientSize(_viewport);
        var arrangedViewportScrollSize = _viewportScrollSize;
        var arrangedViewportClientSize = viewportContentSize;
        redoViewportArrange();

        if ((_viewportScrollSizeChanged || _sizeFractionChanged || showNativeOverlaidScrollbarsChanged) && undoViewportArrangeOverflowState && !showNativeOverlaidScrollbars && arrangeViewport(undoViewportArrangeOverflowState, _viewportScrollSize, _sizeFraction, _directionIsRTL)) {
          arrangedViewportClientSize = clientSize(_viewport);
          arrangedViewportScrollSize = scrollSize(_viewport);
        }

        overflowAmuntCache = updateOverflowAmountCache(getOverflowAmount({
          w: max(_viewportScrollSize.w, arrangedViewportScrollSize.w),
          h: max(_viewportScrollSize.h, arrangedViewportScrollSize.h)
        }, {
          w: arrangedViewportClientSize.w + max(0, viewportContentSize.w - _viewportScrollSize.w),
          h: arrangedViewportClientSize.h + max(0, viewportContentSize.h - _viewportScrollSize.h)
        }, _sizeFraction), force);
      }

      var _overflowAmuntCache = overflowAmuntCache,
          overflowAmount = _overflowAmuntCache[0],
          overflowAmountChanged = _overflowAmuntCache[1];
      var _viewportScrollSizeCa2 = viewportScrollSizeCache,
          viewportScrollSize = _viewportScrollSizeCa2[0],
          viewportScrollSizeChanged = _viewportScrollSizeCa2[1];
      var _sizeFractionCache2 = sizeFractionCache,
          sizeFraction = _sizeFractionCache2[0],
          sizeFractionChanged = _sizeFractionCache2[1];

      if (_paddingStyleChanged || _directionChanged || sizeFractionChanged || viewportScrollSizeChanged || overflowAmountChanged || overflowChanged || showNativeOverlaidScrollbarsChanged || adjustFlexboxGlue) {
        var viewportStyle = {
          marginRight: 0,
          marginBottom: 0,
          marginLeft: 0,
          width: '',
          overflowY: '',
          overflowX: ''
        };
        var viewportOverflowState = setViewportOverflowState(showNativeOverlaidScrollbars, overflowAmount, overflow, viewportStyle);
        var viewportArranged = arrangeViewport(viewportOverflowState, viewportScrollSize, sizeFraction, _directionIsRTL);

        var _updateOverflowScroll = updateOverflowScrollCache(viewportOverflowState._overflowScroll),
            overflowScroll = _updateOverflowScroll[0],
            overflowScrollChanged = _updateOverflowScroll[1];

        hideNativeScrollbars(viewportOverflowState, _directionIsRTL, viewportArranged, viewportStyle);

        if (adjustFlexboxGlue) {
          fixFlexboxGlue(viewportOverflowState, _heightIntrinsic);
        }

        style(_viewport, viewportStyle);
        setState({
          _overflowScroll: overflowScroll,
          _overflowAmount: overflowAmount
        });
        return {
          _overflowAmountChanged: overflowAmountChanged,
          _overflowScrollChanged: overflowScrollChanged
        };
      }
    };
  };

  var prepareUpdateHints = function prepareUpdateHints(leading, adaptive, force) {
    var result = {};
    var finalAdaptive = adaptive || {};
    var objKeys = keys(leading).concat(keys(finalAdaptive));
    each(objKeys, function (key) {
      var leadingValue = leading[key];
      var adaptiveValue = finalAdaptive[key];
      result[key] = !!(force || leadingValue || adaptiveValue);
    });
    return result;
  };

  var createStructureSetupUpdate = function createStructureSetupUpdate(structureSetupElements, state) {
    var _viewport = structureSetupElements._viewport;

    var _getEnvironment = getEnvironment(),
        _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
        _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid,
        _flexboxGlue = _getEnvironment._flexboxGlue;

    var doViewportArrange = !_nativeScrollbarStyling && (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y);
    var updateSegments = [createTrinsicUpdate(structureSetupElements, state), createPaddingUpdate(structureSetupElements, state), createOverflowUpdate(structureSetupElements, state)];
    return function (checkOption, updateHints, force) {
      var initialUpdateHints = prepareUpdateHints(assignDeep({
        _sizeChanged: false,
        _paddingStyleChanged: false,
        _directionChanged: false,
        _heightIntrinsicChanged: false,
        _overflowScrollChanged: false,
        _overflowAmountChanged: false,
        _hostMutation: false,
        _contentMutation: false
      }, updateHints), {}, force);
      var adjustScrollOffset = doViewportArrange || !_flexboxGlue;
      var scrollOffsetX = adjustScrollOffset && scrollLeft(_viewport);
      var scrollOffsetY = adjustScrollOffset && scrollTop(_viewport);
      var adaptivedUpdateHints = initialUpdateHints;
      each(updateSegments, function (updateSegment) {
        adaptivedUpdateHints = prepareUpdateHints(adaptivedUpdateHints, updateSegment(adaptivedUpdateHints, checkOption, !!force) || {}, force);
      });

      if (isNumber(scrollOffsetX)) {
        scrollLeft(_viewport, scrollOffsetX);
      }

      if (isNumber(scrollOffsetY)) {
        scrollTop(_viewport, scrollOffsetY);
      }

      return adaptivedUpdateHints;
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
    return function () {
      runEach(offListeners);
      removeElements(sizeObserver);
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
        updateHeightIntrinsicCache = _createCache[0];

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

      push(offListeners, createSizeObserver(trinsicObserver, onSizeChanged));
      onSizeChanged();
    }

    prependChildren(target, trinsicObserver);
    return function () {
      runEach(offListeners);
      removeElements(trinsicObserver);
    };
  };

  var createEventContentChange = function createEventContentChange(target, callback, eventContentChange) {
    var map;
    var destroyed = false;

    var destroy = function destroy() {
      destroyed = true;
    };

    var updateElements = function updateElements(getElements) {
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
      updateElements();
    }

    return [destroy, updateElements];
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
        destroyEventContentChange = _createEventContentCh[0],
        updateEventContentChangeElements = _createEventContentCh[1];

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
    return [function () {
      if (isConnected) {
        destroyEventContentChange();
        mutationObserver.disconnect();
        isConnected = false;
      }
    }, function () {
      if (isConnected) {
        observerCallback(mutationObserver.takeRecords());
      }
    }];
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

  var createStructureSetupObservers = function createStructureSetupObservers(structureSetupElements, state, structureSetupUpdate) {
    var debounceTimeout;
    var debounceMaxDelay;
    var contentMutationObserver;
    var setState = state[1];
    var _host = structureSetupElements._host,
        _viewport = structureSetupElements._viewport,
        _content = structureSetupElements._content,
        _isTextarea = structureSetupElements._isTextarea;

    var _getEnvironment = getEnvironment(),
        _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
        _flexboxGlue = _getEnvironment._flexboxGlue;

    var contentMutationObserverAttr = _isTextarea ? baseStyleChangingAttrsTextarea : baseStyleChangingAttrs.concat(baseStyleChangingAttrsTextarea);
    var structureSetupUpdateWithDebouncedAdaptiveUpdateHints = debounce(structureSetupUpdate, {
      _timeout: function _timeout() {
        return debounceTimeout;
      },
      _maxDelay: function _maxDelay() {
        return debounceMaxDelay;
      },
      _mergeParams: function _mergeParams(prev, curr) {
        var prevObj = prev[0];
        var currObj = curr[0];
        return [keys(prevObj).concat(keys(currObj)).reduce(function (obj, key) {
          obj[key] = prevObj[key] || currObj[key];
          return obj;
        }, {})];
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

    var onTrinsicChanged = function onTrinsicChanged(heightIntrinsicCache) {
      var heightIntrinsic = heightIntrinsicCache[0],
          heightIntrinsicChanged = heightIntrinsicCache[1];
      setState({
        _heightIntrinsic: heightIntrinsic
      });
      structureSetupUpdate({
        _heightIntrinsicChanged: heightIntrinsicChanged
      });
    };

    var onSizeChanged = function onSizeChanged(_ref) {
      var _sizeChanged = _ref._sizeChanged,
          _directionIsRTLCache = _ref._directionIsRTLCache,
          _appear = _ref._appear;
      var updateFn = !_sizeChanged || _appear ? structureSetupUpdate : structureSetupUpdateWithDebouncedAdaptiveUpdateHints;
      var directionChanged = false;

      if (_directionIsRTLCache) {
        var directionIsRTL = _directionIsRTLCache[0],
            directionIsRTLChanged = _directionIsRTLCache[1];
        directionChanged = directionIsRTLChanged;
        setState({
          _directionIsRTL: directionIsRTL
        });
      }

      updateFn({
        _sizeChanged: _sizeChanged,
        _directionChanged: directionChanged
      });
    };

    var onContentMutation = function onContentMutation(contentChangedTroughEvent) {
      var updateFn = contentChangedTroughEvent ? structureSetupUpdate : structureSetupUpdateWithDebouncedAdaptiveUpdateHints;
      updateFn({
        _contentMutation: true
      });
    };

    var onHostMutation = function onHostMutation(targetChangedAttrs, targetStyleChanged) {
      if (targetStyleChanged) {
        structureSetupUpdateWithDebouncedAdaptiveUpdateHints({
          _hostMutation: true
        });
      } else {
        updateViewportAttrsFromHost(targetChangedAttrs);
      }
    };

    var destroyTrinsicObserver = (_content || !_flexboxGlue) && createTrinsicObserver(_host, onTrinsicChanged);
    var destroySizeObserver = createSizeObserver(_host, onSizeChanged, {
      _appear: true,
      _direction: !_nativeScrollbarStyling
    });

    var _createDOMObserver = createDOMObserver(_host, false, onHostMutation, {
      _styleChangingAttributes: baseStyleChangingAttrs,
      _attributes: baseStyleChangingAttrs.concat(viewportAttrsFromTarget),
      _ignoreTargetChange: ignoreTargetChange
    }),
        destroyHostMutationObserver = _createDOMObserver[0];

    updateViewportAttrsFromHost();
    return [function (checkOption) {
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
          contentMutationObserver[1]();
          contentMutationObserver[0]();
        }

        contentMutationObserver = createDOMObserver(_content || _viewport, true, onContentMutation, {
          _styleChangingAttributes: contentMutationObserverAttr.concat(attributes || []),
          _attributes: contentMutationObserverAttr.concat(attributes || []),
          _eventContentChange: elementEvents,
          _ignoreNestedTargetChange: ignoreTargetChange
        });
      }

      if (debounceChanged) {
        structureSetupUpdateWithDebouncedAdaptiveUpdateHints._flush();

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
    }, function () {
      contentMutationObserver && contentMutationObserver[0]();
      destroyTrinsicObserver && destroyTrinsicObserver();
      destroySizeObserver();
      destroyHostMutationObserver();
    }];
  };

  var initialStructureSetupUpdateState = {
    _padding: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    _paddingAbsolute: false,
    _viewportPaddingStyle: {
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
      paddingTop: 0,
      paddingRight: 0,
      paddingBottom: 0,
      paddingLeft: 0
    },
    _overflowAmount: {
      w: 0,
      h: 0
    },
    _overflowScroll: {
      x: false,
      y: false
    },
    _heightIntrinsic: false,
    _directionIsRTL: false
  };
  var createStructureSetup = function createStructureSetup(target, options) {
    var checkOptionsFallback = createOptionCheck(options, {});
    var state = createState(initialStructureSetupUpdateState);
    var onUpdatedListeners = new Set();
    var getState = state[0];

    var runOnUpdatedListeners = function runOnUpdatedListeners(updateHints, changedOptions, force) {
      runEach(onUpdatedListeners, [updateHints, changedOptions || {}, !!force]);
    };

    var _createStructureSetup = createStructureSetupElements(target),
        elements = _createStructureSetup[0],
        destroyElements = _createStructureSetup[1];

    var updateStructure = createStructureSetupUpdate(elements, state);

    var _createStructureSetup2 = createStructureSetupObservers(elements, state, function (updateHints) {
      runOnUpdatedListeners(updateStructure(checkOptionsFallback, updateHints));
    }),
        updateObservers = _createStructureSetup2[0],
        destroyObservers = _createStructureSetup2[1];

    var structureSetupState = getState.bind(0);

    structureSetupState._addOnUpdatedListener = function (listener) {
      onUpdatedListeners.add(listener);
    };

    structureSetupState._elements = elements;
    return [function (changedOptions, force) {
      var checkOption = createOptionCheck(options, changedOptions, force);
      updateObservers(checkOption);
      runOnUpdatedListeners(updateStructure(checkOption, {}, force));
    }, structureSetupState, function () {
      onUpdatedListeners.clear();
      destroyObservers();
      destroyElements();
    }];
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

  var createScrollbarsSetupElements = function createScrollbarsSetupElements(target, structureSetupElements) {
    var _getEnvironment = getEnvironment(),
        _getInitializationStrategy = _getEnvironment._getInitializationStrategy;

    var _getInitializationStr = _getInitializationStrategy(),
        environmentScrollbarSlot = _getInitializationStr._scrollbarsSlot;

    var _target = structureSetupElements._target,
        _host = structureSetupElements._host,
        _viewport = structureSetupElements._viewport,
        _targetIsElm = structureSetupElements._targetIsElm;
    var initializationScrollbarSlot = !_targetIsElm && target.scrollbarsSlot;
    var initializationScrollbarSlotResult = isFunction(initializationScrollbarSlot) ? initializationScrollbarSlot(_target, _host, _viewport) : initializationScrollbarSlot;
    var evaluatedScrollbarSlot = initializationScrollbarSlotResult || (isFunction(environmentScrollbarSlot) ? environmentScrollbarSlot(_target, _host, _viewport) : environmentScrollbarSlot) || _host;
    var horizontalScrollbarStructure = generateScrollbarDOM(classNameScrollbarHorizontal);
    var verticalScrollbarStructure = generateScrollbarDOM(classNameScrollbarVertical);
    var horizontalScrollbar = horizontalScrollbarStructure._scrollbar;
    var verticalScrollbar = verticalScrollbarStructure._scrollbar;
    appendChildren(evaluatedScrollbarSlot, horizontalScrollbar);
    appendChildren(evaluatedScrollbarSlot, verticalScrollbar);
    return [{
      _horizontalScrollbarStructure: horizontalScrollbarStructure,
      _verticalScrollbarStructure: verticalScrollbarStructure
    }, removeElements.bind(0, [horizontalScrollbar, verticalScrollbar])];
  };

  var createScrollbarsSetup = function createScrollbarsSetup(target, options, structureSetupElements) {
    var state = createState({});
    var getState = state[0];

    var _createScrollbarsSetu = createScrollbarsSetupElements(target, structureSetupElements),
        elements = _createScrollbarsSetu[0],
        destroyElements = _createScrollbarsSetu[1];

    var scrollbarsSetupState = getState.bind(0);
    scrollbarsSetupState._elements = elements;
    return [function (changedOptions, force) {
      var checkOption = createOptionCheck(options, changedOptions, force);
      console.log(checkOption);
    }, scrollbarsSetupState, function () {
      destroyElements();
    }];
  };

  var pluginRegistry = {};
  var getPlugins = function getPlugins() {
    return assignDeep({}, pluginRegistry);
  };
  var addPlugin = function addPlugin(addedPlugin) {
    return each(isArray(addedPlugin) ? addedPlugin : [addedPlugin], function (plugin) {
      pluginRegistry[plugin[0]] = plugin[1];
    });
  };

  function getDefaultExportFromCjs (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  var _extends = {exports: {}};

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
  })(_extends);

  getDefaultExportFromCjs(_extends.exports);

  var templateTypePrefixSuffix = ['__TPL_', '_TYPE__'];
  var optionsTemplateTypes = ['boolean', 'number', 'string', 'array', 'object', 'function', 'null'].reduce(function (result, item) {
    result[item] = templateTypePrefixSuffix[0] + item + templateTypePrefixSuffix[1];
    return result;
  }, {});

  var numberAllowedValues = optionsTemplateTypes.number;
  var booleanAllowedValues = optionsTemplateTypes.boolean;
  var arrayNullValues = [optionsTemplateTypes.array, optionsTemplateTypes.null];
  var stringArrayNullAllowedValues = [optionsTemplateTypes.string, optionsTemplateTypes.array, optionsTemplateTypes.null];
  var resizeAllowedValues = 'none both horizontal vertical';
  var overflowAllowedValues = 'hidden scroll visible visible-hidden';
  var scrollbarsVisibilityAllowedValues = 'visible hidden auto';
  var scrollbarsAutoHideAllowedValues = 'never scroll leavemove';
  ({
    resize: resizeAllowedValues,
    paddingAbsolute: booleanAllowedValues,
    updating: {
      elementEvents: arrayNullValues,
      attributes: arrayNullValues,
      debounce: [optionsTemplateTypes.number, optionsTemplateTypes.array, optionsTemplateTypes.null]
    },
    overflow: {
      x: overflowAllowedValues,
      y: overflowAllowedValues
    },
    scrollbars: {
      visibility: scrollbarsVisibilityAllowedValues,
      autoHide: scrollbarsAutoHideAllowedValues,
      autoHideDelay: numberAllowedValues,
      dragScroll: booleanAllowedValues,
      clickScroll: booleanAllowedValues,
      touch: booleanAllowedValues
    },
    textarea: {
      dynWidth: booleanAllowedValues,
      dynHeight: booleanAllowedValues,
      inheritedAttrs: stringArrayNullAllowedValues
    },
    nativeScrollbarsOverlaid: {
      show: booleanAllowedValues,
      initialize: booleanAllowedValues
    },
    callbacks: {
      onUpdated: [optionsTemplateTypes.function, optionsTemplateTypes.null]
    }
  });
  var optionsValidationPluginName = '__osOptionsValidationPlugin';

  var targets = new Set();
  var targetInstanceMap = new WeakMap();
  var addInstance = function addInstance(target, osInstance) {
    targetInstanceMap.set(target, osInstance);
    targets.add(target);
  };
  var removeInstance = function removeInstance(target) {
    targetInstanceMap.delete(target);
    targets.delete(target);
  };
  var getInstance = function getInstance(target) {
    return targetInstanceMap.get(target);
  };

  var createOSEventListenerHub = function createOSEventListenerHub(initialEventListeners) {
    return createEventListenerHub(initialEventListeners);
  };

  var createOverflowChangedArgs = function createOverflowChangedArgs(overflowAmount, overflowScroll) {
    return {
      amount: {
        x: overflowAmount.w,
        y: overflowAmount.h
      },
      overflow: {
        x: overflowAmount.w > 0,
        y: overflowAmount.h > 0
      },
      scrollableOverflow: assignDeep({}, overflowScroll)
    };
  };

  var OverlayScrollbars = function OverlayScrollbars(target, options, eventListeners) {
    var _getEnvironment = getEnvironment(),
        _getDefaultOptions = _getEnvironment._getDefaultOptions,
        _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid,
        addEnvListener = _getEnvironment._addListener;

    var plugins = getPlugins();
    var instanceTarget = isHTMLElement(target) ? target : target.target;
    var potentialInstance = getInstance(instanceTarget);

    if (potentialInstance) {
      return potentialInstance;
    }

    var optionsValidationPlugin = plugins[optionsValidationPluginName];

    var validateOptions = function validateOptions(newOptions) {
      var opts = newOptions || {};
      var validate = optionsValidationPlugin && optionsValidationPlugin._;
      return validate ? validate(opts, true) : opts;
    };

    var currentOptions = assignDeep({}, _getDefaultOptions(), validateOptions(options));

    var _createOSEventListene = createOSEventListenerHub(eventListeners),
        addEvent = _createOSEventListene[0],
        removeEvent = _createOSEventListene[1],
        triggerEvent = _createOSEventListene[2];

    if (_nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y && !currentOptions.nativeScrollbarsOverlaid.initialize) {
      triggerEvent('initializationWithdrawn');
    }

    var _createStructureSetup = createStructureSetup(target, currentOptions),
        updateStructure = _createStructureSetup[0],
        structureState = _createStructureSetup[1],
        destroyStructure = _createStructureSetup[2];

    var _createScrollbarsSetu = createScrollbarsSetup(target, currentOptions, structureState._elements),
        updateScrollbars = _createScrollbarsSetu[0],
        destroyScrollbars = _createScrollbarsSetu[2];

    var _update = function update(changedOptions, force) {
      updateStructure(changedOptions, force);
      updateScrollbars(changedOptions, force);
    };

    structureState._addOnUpdatedListener(function (updateHints, changedOptions, force) {
      var _sizeChanged = updateHints._sizeChanged,
          _directionChanged = updateHints._directionChanged,
          _heightIntrinsicChanged = updateHints._heightIntrinsicChanged,
          _overflowAmountChanged = updateHints._overflowAmountChanged,
          _overflowScrollChanged = updateHints._overflowScrollChanged,
          _contentMutation = updateHints._contentMutation,
          _hostMutation = updateHints._hostMutation;

      var _structureState = structureState(),
          _overflowAmount = _structureState._overflowAmount,
          _overflowScroll = _structureState._overflowScroll;

      if (_overflowAmountChanged || _overflowScrollChanged) {
        triggerEvent('overflowChanged', assignDeep({}, createOverflowChangedArgs(_overflowAmount, _overflowScroll), {
          previous: createOverflowChangedArgs(_overflowAmount, _overflowScroll)
        }));
      }

      triggerEvent('updated', {
        updateHints: {
          sizeChanged: _sizeChanged,
          directionChanged: _directionChanged,
          heightIntrinsicChanged: _heightIntrinsicChanged,
          overflowAmountChanged: _overflowAmountChanged,
          overflowScrollChanged: _overflowScrollChanged,
          contentMutation: _contentMutation,
          hostMutation: _hostMutation
        },
        changedOptions: changedOptions,
        force: force
      });
    });

    var removeEnvListener = addEnvListener(_update.bind(0, {}, true));
    var instance = {
      options: function options(newOptions) {
        if (newOptions) {
          var changedOptions = getOptionsDiff(currentOptions, validateOptions(newOptions));

          if (!isEmptyObject(changedOptions)) {
            assignDeep(currentOptions, changedOptions);

            _update(changedOptions);
          }
        }

        return currentOptions;
      },
      on: addEvent,
      off: removeEvent,
      state: function state() {
        return {
          _overflowAmount: structureState()._overflowAmount
        };
      },
      update: function update(force) {
        _update({}, force);
      },
      destroy: function destroy() {
        removeInstance(instanceTarget);
        removeEnvListener();
        removeEvent();
        destroyScrollbars();
        destroyStructure();
        triggerEvent('destroyed');
      }
    };
    each(keys(plugins), function (pluginName) {
      var pluginInstance = plugins[pluginName];

      if (isFunction(pluginInstance)) {
        pluginInstance(OverlayScrollbars, instance);
      }
    });
    instance.update(true);
    addInstance(instanceTarget, instance);
    triggerEvent('initialized');
    return instance;
  };
  OverlayScrollbars.extend = addPlugin;

  return OverlayScrollbars;

}));
//# sourceMappingURL=overlayscrollbars.js.map
