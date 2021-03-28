(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self), (global.OverlayScrollbars = factory()));
})(this, function () {
  'use strict';

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

  var equal = function equal(a, b, props) {
    if (a && b) {
      var result = true;
      each(props, function (prop) {
        if (a[prop] !== b[prop]) {
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

  var firstLetterToUpper = function firstLetterToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  var jsPrefixes = ['WebKit', 'Moz', 'O', 'MS', 'webkit', 'moz', 'o', 'ms'];
  var jsCache = {};
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

  var noop = function noop() {};
  var debounce = function debounce(functionToDebounce, timeout, maxWait) {
    var timeoutId;
    var lastCallTime;
    var hasTimeout = isNumber(timeout) && timeout > 0;
    var hasMaxWait = isNumber(maxWait) && maxWait > 0;
    var cancel = hasTimeout ? window.clearTimeout : cAF;
    var set = hasTimeout ? window.setTimeout : rAF;

    var setFn = function setFn(args) {
      lastCallTime = hasMaxWait ? performance.now() : 0;
      timeoutId && cancel(timeoutId);
      functionToDebounce.apply(this, args);
    };

    return function () {
      var boundSetFn = setFn.bind(this, arguments);
      var forceCall = hasMaxWait ? performance.now() - lastCallTime >= maxWait : false;
      timeoutId && cancel(timeoutId);
      timeoutId = forceCall ? boundSetFn() : set(boundSetFn, timeout);
    };
  };

  var cssNumber = {
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

  var adaptCSSVal = function adaptCSSVal(prop, val) {
    return !cssNumber[prop.toLowerCase()] && isNumber(val) ? val + 'px' : val;
  };

  var getCSSVal = function getCSSVal(elm, computedStyle, prop) {
    return computedStyle != null ? computedStyle.getPropertyValue(prop) : elm.style[prop];
  };

  var setCSSVal = function setCSSVal(elm, prop, val) {
    try {
      if (elm && elm.style[prop] !== undefined) {
        elm.style[prop] = adaptCSSVal(prop, val);
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

  function transformOptions(optionsWithOptionsTemplate) {
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
  }

  var classNameEnvironment = 'os-environment';
  var classNameEnvironmentFlexboxGlue = classNameEnvironment + '-flexbox-glue';
  var classNameEnvironmentFlexboxGlueMax = classNameEnvironmentFlexboxGlue + '-max';
  var classNameHost = 'os-host';
  var classNamePadding = 'os-padding';
  var classNameViewport = 'os-viewport';
  var classNameContent = 'os-content';
  var classNameContentArrange = classNameContent + '-arrange';
  var classNameViewportScrollbarStyling = classNameViewport + '-scrollbar-styled';
  var classNameSizeObserver = 'os-size-observer';
  var classNameSizeObserverAppear = classNameSizeObserver + '-appear';
  var classNameSizeObserverListener = classNameSizeObserver + '-listener';
  var classNameSizeObserverListenerScroll = classNameSizeObserverListener + '-scroll';
  var classNameSizeObserverListenerItem = classNameSizeObserverListener + '-item';
  var classNameSizeObserverListenerItemFinal = classNameSizeObserverListenerItem + '-final';
  var classNameTrinsicObserver = 'os-trinsic-observer';

  var environmentInstance;
  var abs = Math.abs,
    round = Math.round;

  var getNativeScrollbarSize = function getNativeScrollbarSize(body, measureElm) {
    appendChildren(body, measureElm);
    var cSize = clientSize(measureElm);
    var oSize = offsetSize(measureElm);
    return {
      x: oSize.h - cSize.h,
      y: oSize.w - cSize.w,
    };
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
    var minOffsetsizeParent = offsetSize(parentElm);
    var minOffsetsize = offsetSize(childElm);
    var supportsMin = equalWH(minOffsetsize, minOffsetsizeParent);
    addClass(parentElm, classNameEnvironmentFlexboxGlueMax);
    var maxOffsetsizeParent = offsetSize(parentElm);
    var maxOffsetsize = offsetSize(childElm);
    var supportsMax = equalWH(maxOffsetsize, maxOffsetsizeParent);
    return supportsMin && supportsMax;
  };

  var getWindowDPR = function getWindowDPR() {
    var dDPI = window.screen.deviceXDPI || 0;
    var sDPI = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || dDPI / sDPI;
  };

  var diffBiggerThanOne = function diffBiggerThanOne(valOne, valTwo) {
    var absValOne = abs(valOne);
    var absValTwo = abs(valTwo);
    return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
  };

  var createEnvironment = function createEnvironment() {
    var _document = document,
      body = _document.body;
    var envDOM = createDOM('<div class="' + classNameEnvironment + '"><div></div></div>');
    var envElm = envDOM[0];
    var envChildElm = envElm.firstChild;
    var onChangedListener = new Set();
    var nativeScrollbarSize = getNativeScrollbarSize(body, envElm);
    var nativeScrollbarStyling = false;
    var nativeScrollbarIsOverlaid = {
      x: nativeScrollbarSize.x === 0,
      y: nativeScrollbarSize.y === 0,
    };
    var env = {
      _autoUpdateLoop: false,
      _nativeScrollbarSize: nativeScrollbarSize,
      _nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
      _nativeScrollbarStyling: nativeScrollbarStyling,
      _rtlScrollBehavior: getRtlScrollBehavior(envElm, envChildElm),
      _flexboxGlue: getFlexboxGlue(envElm, envChildElm),
      _addListener: function _addListener(listener) {
        onChangedListener.add(listener);
      },
      _removeListener: function _removeListener(listener) {
        onChangedListener.delete(listener);
      },
    };
    removeAttr(envElm, 'style');
    removeElements(envElm);

    if (!nativeScrollbarIsOverlaid.x || !nativeScrollbarIsOverlaid.y) {
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

  var createStructureSetup = function createStructureSetup(target) {
    var targetIsElm = isHTMLElement(target);
    var osTargetObj = targetIsElm
      ? {}
      : {
          _host: target.host,
          _target: target.target,
          _padding: target.padding,
          _viewport: target.viewport,
          _content: target.content,
        };

    if (targetIsElm) {
      var padding = createDiv(classNamePadding);
      var viewport = createDiv(classNameViewport);
      var content = createDiv(classNameContent);
      appendChildren(padding, viewport);
      appendChildren(viewport, content);
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
      appendChildren(_content, getTargetContents(_target));
      appendChildren(_host, _padding);
      push(destroyFns, function () {
        appendChildren(_host, contents(_content));
        removeElements(_padding);
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
      var contentSlot = _content || _viewport;
      appendChildren(contentSlot, targetContents);
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

    var _getEnvironment = getEnvironment(),
      _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
      _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid;

    if (_nativeScrollbarStyling) {
      push(destroyFns, removeClass.bind(0, _viewport, classNameViewportScrollbarStyling));
    } else if (_nativeScrollbarIsOverlaid.x || _nativeScrollbarIsOverlaid.y) {
      if (obj._content) {
        var contentArrangeElm = createDiv(classNameContentArrange);
        prependChildren(_viewport, contentArrangeElm);
        push(destroyFns, removeElements.bind(0, contentArrangeElm));
        obj._contentArrange = contentArrangeElm;
      }
    }

    return {
      _targetObj: obj,
      _targetCtx: ctx,
      _destroy: function _destroy() {
        runEach(destroyFns);
      },
    };
  };

  var getPropByPath = function getPropByPath(obj, path) {
    return (
      obj &&
      path.split('.').reduce(function (o, prop) {
        return o && hasOwnProperty$1(o, prop) ? o[prop] : undefined;
      }, obj)
    );
  };

  var createLifecycleUpdateFunction = function createLifecycleUpdateFunction(lifecycleHub, updateFunction) {
    return function (updateHints, changedOptions, force) {
      var checkOption = function checkOption(path) {
        return {
          _value: getPropByPath(lifecycleHub._options, path),
          _changed: force || getPropByPath(changedOptions, path) !== undefined,
        };
      };

      return updateFunction(!!force, updateHints, checkOption) || {};
    };
  };

  var overlaidScrollbarsHideOffset = 42;
  var overlaidScrollbarsHideBorderStyle = overlaidScrollbarsHideOffset + 'px solid transparent';
  var createOverflowLifecycle = function createOverflowLifecycle(lifecycleHub) {
    var _lifecycleHub$_struct = lifecycleHub._structureSetup._targetObj,
      _host = _lifecycleHub$_struct._host,
      _padding = _lifecycleHub$_struct._padding,
      _viewport = _lifecycleHub$_struct._viewport,
      _content = _lifecycleHub$_struct._content,
      _contentArrange = _lifecycleHub$_struct._contentArrange;

    var _createCache = createCache(
        function () {
          return scrollSize(_content || _viewport);
        },
        {
          _equal: equalWH,
        }
      ),
      updateContentScrollSizeCache = _createCache._update,
      getCurrentContentScrollSizeCache = _createCache._current;

    var _createCache2 = createCache(
        function (ctx) {
          return {
            x: Math.max(0, Math.round((ctx._contentScrollSize.w - ctx._viewportSize.w) * 100) / 100),
            y: Math.max(0, Math.round((ctx._contentScrollSize.h - ctx._viewportSize.h) * 100) / 100),
          };
        },
        {
          _equal: equalXY,
        }
      ),
      updateOverflowAmountCache = _createCache2._update,
      getCurrentOverflowAmountCache = _createCache2._current;

    var setViewportOverflowStyle = function setViewportOverflowStyle(horizontal, amount, behavior, styleObj) {
      var overflowKey = horizontal ? 'overflowX' : 'overflowY';
      var behaviorIsScroll = behavior === 'scroll';
      var behaviorIsVisibleScroll = behavior === 'visible-scroll';
      var hideOverflow = behaviorIsScroll || behavior === 'hidden';
      var applyStyle = amount > 0 && hideOverflow;

      if (applyStyle) {
        styleObj[overflowKey] = behavior;
      }

      return {
        _visible: !applyStyle,
        _behavior: behaviorIsVisibleScroll ? 'scroll' : 'hidden',
      };
    };

    var hideNativeScrollbars = function hideNativeScrollbars(
      contentScrollSize,
      showNativeOverlaidScrollbars,
      directionIsRTL,
      viewportStyleObj,
      contentStyleObj
    ) {
      var _getEnvironment = getEnvironment(),
        _nativeScrollbarSize = _getEnvironment._nativeScrollbarSize,
        _nativeScrollbarIsOverlaid = _getEnvironment._nativeScrollbarIsOverlaid,
        _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling;

      var overlaidX = _nativeScrollbarIsOverlaid.x,
        overlaidY = _nativeScrollbarIsOverlaid.y;
      var scrollX = viewportStyleObj.overflowX === 'scroll';
      var scrollY = viewportStyleObj.overflowY === 'scroll';
      var horizontalMarginKey = directionIsRTL ? 'marginLeft' : 'marginRight';
      var horizontalBorderKey = directionIsRTL ? 'borderLeft' : 'borderRight';
      var overlaidHideOffset = _content && !showNativeOverlaidScrollbars ? overlaidScrollbarsHideOffset : 0;
      var scrollbarsHideOffset = {
        x: overlaidX ? overlaidHideOffset : _nativeScrollbarSize.x,
        y: overlaidY ? overlaidHideOffset : _nativeScrollbarSize.y,
      };

      if (!_nativeScrollbarStyling) {
        if (scrollX) {
          viewportStyleObj.marginBottom = -scrollbarsHideOffset.x;
          contentStyleObj.borderBottom = overlaidX && overlaidHideOffset ? overlaidScrollbarsHideBorderStyle : '';
        }

        if (scrollY) {
          viewportStyleObj.maxWidth = 'calc(100% + ' + scrollbarsHideOffset.y + 'px)';
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

    var setFlexboxGlueStyle = function setFlexboxGlueStyle(heightIntrinsic, scrollX, scrollbarsHideOffsetX) {
      var offsetLeft = scrollLeft(_viewport);
      var offsetTop = scrollTop(_viewport);
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

    return createLifecycleUpdateFunction(lifecycleHub, function (force, updateHints, checkOption) {
      var _directionIsRTL = updateHints._directionIsRTL,
        _heightIntrinsic = updateHints._heightIntrinsic,
        _sizeChanged = updateHints._sizeChanged,
        _hostMutation = updateHints._hostMutation,
        _contentMutation = updateHints._contentMutation;

      var _getEnvironment2 = getEnvironment(),
        _flexboxGlue = _getEnvironment2._flexboxGlue,
        _nativeScrollbarStyling = _getEnvironment2._nativeScrollbarStyling,
        _nativeScrollbarIsOverlaid = _getEnvironment2._nativeScrollbarIsOverlaid;

      var _checkOption = checkOption('nativeScrollbarsOverlaid.show'),
        showNativeOverlaidScrollbarsOption = _checkOption._value,
        showNativeOverlaidScrollbarsChanged = _checkOption._changed;

      var adjustFlexboxGlue = !_flexboxGlue && (_sizeChanged || _contentMutation || _hostMutation || showNativeOverlaidScrollbarsChanged);
      var showNativeOverlaidScrollbars = showNativeOverlaidScrollbarsOption && _nativeScrollbarIsOverlaid.x && _nativeScrollbarIsOverlaid.y;
      var overflowAmuntCache = getCurrentOverflowAmountCache();
      var contentScrollSizeCache = getCurrentContentScrollSizeCache();

      if (showNativeOverlaidScrollbarsChanged && _nativeScrollbarStyling) {
        if (showNativeOverlaidScrollbars) {
          removeClass(_viewport, classNameViewportScrollbarStyling);
        } else {
          addClass(_viewport, classNameViewportScrollbarStyling);
        }
      }

      if (_sizeChanged || _contentMutation) {
        var viewportOffsetSize = offsetSize(_padding);
        var contentClientSize = offsetSize(_content || _viewport);
        var contentArrangeOffsetSize = offsetSize(_contentArrange);
        contentScrollSizeCache = updateContentScrollSizeCache(force);
        var _contentScrollSizeCac = contentScrollSizeCache,
          _contentScrollSize = _contentScrollSizeCac._value;
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

      var directionIsRTL = _directionIsRTL._value,
        directionChanged = _directionIsRTL._changed;
      var _contentScrollSizeCac2 = contentScrollSizeCache,
        contentScrollSize = _contentScrollSizeCac2._value,
        contentScrollSizeChanged = _contentScrollSizeCac2._changed;
      var _overflowAmuntCache = overflowAmuntCache,
        overflowAmount = _overflowAmuntCache._value,
        overflowAmountChanged = _overflowAmuntCache._changed;

      var _checkOption2 = checkOption('overflow'),
        overflow = _checkOption2._value,
        overflowChanged = _checkOption2._changed;

      var adjustDirection = directionChanged && !_nativeScrollbarStyling;

      if (
        contentScrollSizeChanged ||
        overflowAmountChanged ||
        overflowChanged ||
        showNativeOverlaidScrollbarsChanged ||
        adjustDirection ||
        adjustFlexboxGlue
      ) {
        var viewportStyle = {
          overflowY: '',
          overflowX: '',
          marginTop: '',
          marginRight: '',
          marginBottom: '',
          marginLeft: '',
          maxWidth: '',
        };
        var contentStyle = {
          borderTop: '',
          borderRight: '',
          borderBottom: '',
          borderLeft: '',
        };

        var _setViewportOverflowS = setViewportOverflowStyle(true, overflowAmount.x, overflow.x, viewportStyle),
          xVisible = _setViewportOverflowS._visible,
          xVisibleBehavior = _setViewportOverflowS._behavior;

        var _setViewportOverflowS2 = setViewportOverflowStyle(false, overflowAmount.y, overflow.y, viewportStyle),
          yVisible = _setViewportOverflowS2._visible,
          yVisibleBehavior = _setViewportOverflowS2._behavior;

        if (xVisible && !yVisible) {
          viewportStyle.overflowX = xVisibleBehavior;
        }

        if (yVisible && !xVisible) {
          viewportStyle.overflowY = yVisibleBehavior;
        }

        var _hideNativeScrollbars = hideNativeScrollbars(
            contentScrollSize,
            showNativeOverlaidScrollbars,
            directionIsRTL,
            viewportStyle,
            contentStyle
          ),
          _scrollbarsHideOffset = _hideNativeScrollbars._scrollbarsHideOffset,
          _scroll = _hideNativeScrollbars._scroll;

        if (adjustFlexboxGlue) {
          setFlexboxGlueStyle(!!_heightIntrinsic._value, _scroll.x, _scrollbarsHideOffset.x);
        }

        style(_viewport, viewportStyle);
        style(_content, contentStyle);
      }
    });
  };

  var animationStartEventName = 'animationstart';
  var scrollEventName = 'scroll';
  var scrollAmount = 3333333;
  var directionIsRTLMap = {
    direction: ['rtl'],
  };

  var directionIsRTL = function directionIsRTL(elm) {
    var isRTL = false;
    var styles = style(elm, ['direction']);
    each(styles, function (value, key) {
      isRTL = isRTL || indexOf(directionIsRTLMap[key], value) > -1;
    });
    return isRTL;
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

      if (isArray(sizeChangedContext) && sizeChangedContext.length > 0) {
        var _updateResizeObserver = updateResizeObserverContentRectCache(0, sizeChangedContext.pop().contentRect),
          _previous = _updateResizeObserver._previous,
          _value = _updateResizeObserver._value,
          _changed = _updateResizeObserver._changed;

        skip = !_previous || !domRectHasDimensions(_value);
      } else if (hasDirectionCache) {
        sizeChangedContext._changed;
      }

      if (observeDirectionChange) {
        var rtl = hasDirectionCache ? sizeChangedContext._value : directionIsRTL(sizeObserver);
        scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
        scrollTop(sizeObserver, scrollAmount);
      }

      if (!skip) {
        onSizeChangedCallback(hasDirectionCache ? sizeChangedContext : undefined);
      }
    };

    var offListeners = [];
    var appearCallback = observeAppearChange ? onSizeChangedCallbackProxy : false;
    var directionIsRTLCache;

    if (ResizeObserverConstructor) {
      var resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
      resizeObserverInstance.observe(listenerElement);
      push(offListeners, function () {
        return resizeObserverInstance.disconnect();
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
      var cacheSize = offsetSize(listenerElement);
      var currSize = cacheSize;
      var isDirty = false;
      var rAFId;

      var reset = function reset() {
        scrollLeft(expandElement, scrollAmount);
        scrollTop(expandElement, scrollAmount);
        scrollLeft(shrinkElement, scrollAmount);
        scrollTop(shrinkElement, scrollAmount);
      };

      var onResized = function onResized() {
        rAFId = 0;

        if (isDirty) {
          cacheSize = currSize;
          onSizeChangedCallbackProxy();
        }
      };

      var onScroll = function onScroll(scrollEvent) {
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
      appearCallback = observeAppearChange
        ? function () {
            return onScroll();
          }
        : reset;
    }

    if (observeDirectionChange) {
      directionIsRTLCache = createCache(function () {
        return directionIsRTL(sizeObserver);
      });
      var _directionIsRTLCache = directionIsRTLCache,
        updateDirectionIsRTLCache = _directionIsRTLCache._update;
      push(
        offListeners,
        on(sizeObserver, scrollEventName, function (event) {
          var directionIsRTLCacheValues = updateDirectionIsRTLCache();
          var _value = directionIsRTLCacheValues._value,
            _changed = directionIsRTLCacheValues._changed;

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
    var trinsicObserver = createDOM('<div class="' + classNameTrinsicObserver + '"></div>')[0];
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
        return intersectionObserverInstance.disconnect();
      });
    } else {
      push(
        offListeners,
        createSizeObserver(trinsicObserver, function () {
          var newSize = offsetSize(trinsicObserver);
          var heightIntrinsicCache = updateHeightIntrinsicCache(0, newSize);

          if (heightIntrinsicCache._changed) {
            onTrinsicChangedCallback(heightIntrinsicCache);
          }
        })._destroy
      );
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

  var createEventContentChange = function createEventContentChange(target, eventContentChange, map, callback) {
    var eventContentChangeRef;

    var addEvent = function addEvent(elm, eventName) {
      var entry = map.get(elm);
      var newEntry = isUndefined(entry);

      var registerEvent = function registerEvent() {
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

    var _destroy = function _destroy() {
      map.forEach(function (eventName, elm) {
        off(elm, eventName, callback);
      });
      map.clear();
    };

    var _updateElements = function _updateElements(getElements) {
      if (eventContentChangeRef) {
        var eventElmList = eventContentChangeRef.reduce(function (arr, item) {
          if (item) {
            var selector = item[0];
            var eventName = item[1];
            var elements = eventName && selector && (getElements ? getElements(selector) : find(selector, target));

            if (elements) {
              push(arr, [elements, isFunction(eventName) ? eventName(elements) : eventName], true);
            }
          }

          return arr;
        }, []);
        each(eventElmList, function (item) {
          var elements = item[0];
          var eventName = item[1];
          each(elements, function (elm) {
            addEvent(elm, eventName);
          });
        });
      }
    };

    var _update = function _update(newEventContentChange) {
      eventContentChangeRef = newEventContentChange;

      _destroy();

      _updateElements();
    };

    if (eventContentChange) {
      _update(eventContentChange);
    }

    return {
      _destroy: _destroy,
      _updateElements: _updateElements,
      _update: _update,
    };
  };

  var createDOMObserver = function createDOMObserver(target, callback, options) {
    var isConnected = false;

    var _ref = options || {},
      _observeContent = _ref._observeContent,
      _attributes = _ref._attributes,
      _styleChangingAttributes = _ref._styleChangingAttributes,
      _eventContentChange = _ref._eventContentChange,
      _nestedTargetSelector = _ref._nestedTargetSelector,
      _ignoreTargetChange = _ref._ignoreTargetAttrChange,
      _ignoreContentChange = _ref._ignoreContentChange;

    var _createEventContentCh = createEventContentChange(
        target,
        _observeContent && _eventContentChange,
        new Map(),
        debounce(function () {
          if (isConnected) {
            callback([], false, true);
          }
        }, 84)
      ),
      updateEventContentChangeElements = _createEventContentCh._updateElements,
      destroyEventContentChange = _createEventContentCh._destroy,
      updateEventContentChange = _createEventContentCh._update;

    var finalAttributes = _attributes || [];
    var finalStyleChangingAttributes = _styleChangingAttributes || [];
    var observedAttributes = finalAttributes.concat(finalStyleChangingAttributes);

    var observerCallback = function observerCallback(mutations) {
      var ignoreTargetChange = _ignoreTargetChange || noop;
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
        var targetAttrChanged =
          attributeChanged &&
          targetIsMutationTarget &&
          !_observeContent &&
          !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue);
        var styleChangingAttrChanged = indexOf(finalStyleChangingAttributes, attributeName) > -1 && attributeChanged;

        if (targetAttrChanged) {
          push(targetChangedAttrs, attributeName);
        }

        if (_observeContent) {
          var notOnlyAttrChanged = !isAttributesType;
          var contentAttrChanged = isAttributesType && styleChangingAttrChanged && !targetIsMutationTarget;
          var isNestedTarget = contentAttrChanged && _nestedTargetSelector && is(mutationTarget, _nestedTargetSelector);
          var baseAssertion = isNestedTarget
            ? !ignoreTargetChange(mutationTarget, attributeName, oldValue, attributeValue)
            : notOnlyAttrChanged || contentAttrChanged;
          var contentFinalChanged = baseAssertion && !ignoreContentChange(mutation, !!isNestedTarget, target, options);
          push(totalAddedNodes, addedNodes);
          contentChanged = contentChanged || contentFinalChanged;
          childListChanged = childListChanged || isChildListType;
        }

        targetStyleChanged = targetStyleChanged || (targetAttrChanged && styleChangingAttrChanged);
      });

      if (childListChanged && !isEmptyArray(totalAddedNodes)) {
        updateEventContentChangeElements(function (selector) {
          return totalAddedNodes.reduce(function (arr, node) {
            push(arr, find(selector, node));
            return is(node, selector) ? push(arr, node) : arr;
          }, []);
        });
      }

      if (!isEmptyArray(targetChangedAttrs) || targetStyleChanged || contentChanged) {
        callback(targetChangedAttrs, targetStyleChanged, contentChanged);
      }
    };

    var mutationObserver = new MutationObserverConstructor(observerCallback);
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
      _disconnect: function _disconnect() {
        if (isConnected) {
          destroyEventContentChange();
          mutationObserver.disconnect();
          isConnected = false;
        }
      },
      _updateEventContentChange: function _updateEventContentChange(newEventContentChange) {
        updateEventContentChange(isConnected && _observeContent && newEventContentChange);
      },
      _update: function _update() {
        if (isConnected) {
          observerCallback(mutationObserver.takeRecords());
        }
      },
    };
  };

  var attrs = ['id', 'class', 'style', 'open'];
  var directionIsRTLCacheValuesFallback = {
    _value: false,
    _previous: false,
    _changed: false,
  };
  var heightIntrinsicCacheValuesFallback = {
    _value: false,
    _previous: false,
    _changed: false,
  };
  var createLifecycleHub = function createLifecycleHub(options, structureSetup) {
    var _structureSetup$_targ = structureSetup._targetObj,
      _host = _structureSetup$_targ._host,
      _viewport = _structureSetup$_targ._viewport,
      _content = _structureSetup$_targ._content;

    var _getEnvironment = getEnvironment(),
      _nativeScrollbarStyling = _getEnvironment._nativeScrollbarStyling,
      _flexboxGlue = _getEnvironment._flexboxGlue,
      addEnvironmentListener = _getEnvironment._addListener,
      removeEnvironmentListener = _getEnvironment._removeListener;

    var lifecycles = [];
    var instance = {
      _options: options,
      _structureSetup: structureSetup,
    };
    push(lifecycles, createOverflowLifecycle(instance));

    var runLifecycles = function runLifecycles(updateHints, changedOptions, force) {
      var _ref = updateHints || {},
        _directionIsRTL = _ref._directionIsRTL,
        _heightIntrinsic = _ref._heightIntrinsic,
        _ref$_sizeChanged = _ref._sizeChanged,
        _sizeChanged = _ref$_sizeChanged === void 0 ? force || false : _ref$_sizeChanged,
        _ref$_hostMutation = _ref._hostMutation,
        _hostMutation = _ref$_hostMutation === void 0 ? force || false : _ref$_hostMutation,
        _ref$_contentMutation = _ref._contentMutation,
        _contentMutation = _ref$_contentMutation === void 0 ? force || false : _ref$_contentMutation;

      var finalDirectionIsRTL =
        _directionIsRTL || (sizeObserver ? sizeObserver._getCurrentCacheValues(force)._directionIsRTL : directionIsRTLCacheValuesFallback);
      var finalHeightIntrinsic =
        _heightIntrinsic || (trinsicObserver ? trinsicObserver._getCurrentCacheValues(force)._heightIntrinsic : heightIntrinsicCacheValuesFallback);
      each(lifecycles, function (lifecycle) {
        var _lifecycle = lifecycle(
            {
              _directionIsRTL: finalDirectionIsRTL,
              _heightIntrinsic: finalHeightIntrinsic,
              _sizeChanged: _sizeChanged,
              _hostMutation: _hostMutation,
              _contentMutation: _contentMutation,
            },
            changedOptions,
            force
          ),
          adaptiveSizeChanged = _lifecycle._sizeChanged,
          adaptiveHostMutation = _lifecycle._hostMutation,
          adaptiveContentMutation = _lifecycle._contentMutation;

        _sizeChanged = adaptiveSizeChanged || _sizeChanged;
        _hostMutation = adaptiveHostMutation || _hostMutation;
        _contentMutation = adaptiveContentMutation || _contentMutation;
      });
    };

    var onSizeChanged = function onSizeChanged(directionIsRTL) {
      var sizeChanged = !directionIsRTL;
      runLifecycles({
        _directionIsRTL: directionIsRTL,
        _sizeChanged: sizeChanged,
      });
    };

    var onTrinsicChanged = function onTrinsicChanged(heightIntrinsic) {
      runLifecycles({
        _heightIntrinsic: heightIntrinsic,
      });
    };

    var onHostMutation = function onHostMutation() {
      requestAnimationFrame(function () {
        runLifecycles({
          _hostMutation: true,
        });
      });
    };

    var onContentMutation = function onContentMutation() {
      requestAnimationFrame(function () {
        runLifecycles({
          _contentMutation: true,
        });
      });
    };

    var sizeObserver = createSizeObserver(_host, onSizeChanged, {
      _appear: true,
      _direction: !_nativeScrollbarStyling,
    });
    var trinsicObserver = createTrinsicObserver(_host, onTrinsicChanged);
    var hostMutationObserver = createDOMObserver(_host, onHostMutation, {
      _styleChangingAttributes: attrs,
      _attributes: attrs,
    });
    var contentMutationObserver = createDOMObserver(_content || _viewport, onContentMutation, {
      _observeContent: true,
      _styleChangingAttributes: attrs,
      _attributes: attrs,
      _eventContentChange: options.updating.elementEvents,
    });

    var updateAll = function updateAll(changedOptions, force) {
      runLifecycles(null, changedOptions, force);
    };

    var envUpdateListener = updateAll.bind(null, null, true);
    addEnvironmentListener(envUpdateListener);
    console.log('flexboxGlue', _flexboxGlue);
    return {
      _update: updateAll,
      _destroy: function _destroy() {
        removeEnvironmentListener(envUpdateListener);
      },
    };
  };

  var numberAllowedValues = optionsTemplateTypes.number;
  var stringArrayNullAllowedValues = [optionsTemplateTypes.string, optionsTemplateTypes.array, optionsTemplateTypes.null];
  var booleanTrueTemplate = [true, optionsTemplateTypes.boolean];
  var booleanFalseTemplate = [false, optionsTemplateTypes.boolean];
  var resizeAllowedValues = 'none both horizontal vertical';
  var overflowAllowedValues = 'visible-hidden visible-scroll scroll hidden';
  var scrollbarsVisibilityAllowedValues = 'visible hidden auto';
  var scrollbarsAutoHideAllowedValues = 'never scroll leavemove';
  var defaultOptionsWithTemplate = {
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

  var _transformOptions = transformOptions(defaultOptionsWithTemplate),
    optionsTemplate = _transformOptions._template,
    defaultOptions = _transformOptions._options;

  var OverlayScrollbars = function OverlayScrollbars(target, options, extensions) {
    var currentOptions = assignDeep({}, defaultOptions, validateOptions(options || {}, optionsTemplate, null, true)._validated);
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
      update: function update(force) {
        lifecycleHub._update(null, force);
      },
    };
    instance.update(true);
    return instance;
  };

  var index = function () {
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

  return index;
});
//# sourceMappingURL=overlayscrollbars.js.map
