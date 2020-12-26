(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self), (global.OverlayScrollbars = factory()));
})(this, function () {
  'use strict';

  var type = function type(obj) {
    if (obj === undefined) return '' + obj;
    if (obj === null) return '' + obj;
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
    var length = !!obj && obj.length;
    return isArray(obj) || (!isFunction(obj) && isNumber(length) && length > -1 && length % 1 == 0);
  }
  function isPlainObject(obj) {
    if (!obj || !isObject(obj) || type(obj) !== 'object') return false;
    var key;
    var proto = 'prototype';
    var hasOwnProperty = Object[proto].hasOwnProperty;
    var hasOwnConstructor = hasOwnProperty.call(obj, 'constructor');
    var hasIsPrototypeOf = obj.constructor && obj.constructor[proto] && hasOwnProperty.call(obj.constructor[proto], 'isPrototypeOf');

    if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
      return false;
    }

    for (key in obj) {
    }

    return isUndefined(key) || hasOwnProperty.call(obj, key);
  }
  function isHTMLElement(obj) {
    var instaceOfRightHandSide = window.HTMLElement;
    var doInstanceOf = isObject(instaceOfRightHandSide) || isFunction(instaceOfRightHandSide);
    return !!(doInstanceOf ? obj instanceof instaceOfRightHandSide : obj && isObject(obj) && obj.nodeType === 1 && isString(obj.nodeName));
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
    elm == null ? void 0 : elm.removeAttribute(attrName);
  };
  function scrollLeft(elm, value) {
    return getSetProp('scrollLeft', 0, elm, value);
  }
  function scrollTop(elm, value) {
    return getSetProp('scrollTop', 0, elm, value);
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
        result = action(elm.classList, clazz) && result;
      }
    }

    return result;
  };
  var addClass = function addClass(elm, className) {
    classListAction(elm, className, function (classList, clazz) {
      return classList.add(clazz);
    });
  };

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
  var from = function from(arr) {
    if (Array.from) {
      return Array.from(arr);
    }

    var result = [];
    each(arr, function (elm) {
      result.push(elm);
    });
    return result;
  };
  var runEach = function runEach(arr) {
    if (arr instanceof Set) {
      arr.forEach(function (fn) {
        return fn && fn();
      });
    } else {
      each(arr, function (fn) {
        return fn && fn();
      });
    }
  };

  var matches = function matches(elm, selector) {
    if (elm) {
      var fn = Element.prototype.matches || Element.prototype.msMatchesSelector;
      return fn.call(elm, selector);
    }

    return false;
  };
  var is = function is(elm, selector) {
    return matches(elm, selector);
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

        parentElm.insertBefore(fragment, anchor);
      }
    }
  };

  var appendChildren = function appendChildren(node, children) {
    before(node, null, children);
  };
  var prependChildren = function prependChildren(node, children) {
    before(node, node && node.firstChild, children);
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
  var getBoundingClientRect = function getBoundingClientRect(elm) {
    return elm.getBoundingClientRect();
  };

  var passiveEventsSupport;

  var supportPassiveEvents = function supportPassiveEvents() {
    if (passiveEventsSupport === undefined) {
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

  var off = function off(target, eventNames, listener, capture) {
    each(eventNames.split(' '), function (eventName) {
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
    each(eventNames.split(' '), function (eventName) {
      var finalListener = once
        ? function (evt) {
            target.removeEventListener(eventName, finalListener, capture);
            listener && listener(evt);
          }
        : listener;
      offListeners.push(off.bind(null, target, eventName, finalListener, capture));
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
  var equalTRBL = function equalTRBL(a, b) {
    return equal(a, b, ['t', 'r', 'b', 'l']);
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

  var parseToZeroOrNumber = function parseToZeroOrNumber(value, toFloat) {
    var num = toFloat ? parseFloat(value) : parseInt(value, 10);
    return Number.isNaN(num) ? 0 : num;
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
  var topRightBottomLeft = function topRightBottomLeft(elm, property) {
    var finalProp = property || '';
    var top = finalProp + '-top';
    var right = finalProp + '-right';
    var bottom = finalProp + '-bottom';
    var left = finalProp + '-left';
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

  function createCache(cacheUpdateInfo, isReference) {
    var cache = {};
    var allProps = keys(cacheUpdateInfo);
    each(allProps, function (prop) {
      cache[prop] = {
        _changed: false,
        _value: isReference ? cacheUpdateInfo[prop] : undefined,
      };
    });

    var updateCacheProp = function updateCacheProp(prop, value, equal) {
      var curr = cache[prop]._value;
      cache[prop]._value = value;
      cache[prop]._previous = curr;
      cache[prop]._changed = equal ? !equal(curr, value) : curr !== value;
    };

    var flush = function flush(props, force) {
      var result = assignDeep({}, cache, {
        _anythingChanged: false,
      });
      each(props, function (prop) {
        var changed = force || cache[prop]._changed;
        result._anythingChanged = result._anythingChanged || changed;
        result[prop]._changed = changed;
        cache[prop]._changed = false;
      });
      return result;
    };

    return function (propsToUpdate, force) {
      var finalPropsToUpdate = (isString(propsToUpdate) ? [propsToUpdate] : propsToUpdate) || allProps;
      each(finalPropsToUpdate, function (prop) {
        var cacheVal = cache[prop];
        var curr = cacheUpdateInfo[prop];
        var arr = isReference ? false : isArray(curr);
        var value = arr ? curr[0] : curr;
        var equal = arr ? curr[1] : null;
        updateCacheProp(prop, isReference ? value : value(cacheVal._value, cacheVal._previous), equal);
      });
      return flush(finalPropsToUpdate, force);
    };
  }

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
      result = resultPossibilities.find(function (resultPossibility) {
        return elmStyle[resultPossibility] !== undefined;
      });
      return !result;
    });
    cssCache[name] = result;
    return result;
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

  var resizeObserver = jsAPI('ResizeObserver');

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
      return hasOwnProperty(options, prop);
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
          var isEnumString = typeString === undefined;

          if (isEnumString && isString(optionsValue)) {
            var enumStringSplit = currTemplateType.split(' ');
            isValid = !!enumStringSplit.find(function (possibility) {
              return possibility === optionsValue;
            });
            errorEnumStrings.push.apply(errorEnumStrings, enumStringSplit);
          } else {
            isValid = optionsTemplateTypes[optionsValueType] === currTemplateType;
          }

          errorPossibleTypes.push(isEnumString ? optionsTemplateTypes.string : typeString);
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

  var environmentInstance;
  var abs = Math.abs,
    round = Math.round;
  var environmentElmId = 'os-environment';
  var classNameFlexboxGlue = 'flexbox-glue';
  var classNameFlexboxGlueMax = classNameFlexboxGlue + '-max';

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
    addClass(testElm, 'os-viewport-scrollbar-styled');

    try {
      result =
        style(testElm, 'scrollbar-width') === 'none' ||
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
    addClass(parentElm, classNameFlexboxGlue);
    var minOffsetsizeParent = offsetSize(parentElm);
    var minOffsetsize = offsetSize(childElm);
    var supportsMin = equalWH(minOffsetsize, minOffsetsizeParent);
    addClass(parentElm, classNameFlexboxGlueMax);
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
    var envDOM = createDOM('<div id="' + environmentElmId + '"><div></div></div>');
    var envElm = envDOM[0];
    var envChildElm = envElm.firstChild;
    var onChangedListener = new Set();
    var nativeScrollBarSize = getNativeScrollbarSize(body, envElm);
    var nativeScrollbarIsOverlaid = {
      x: nativeScrollBarSize.x === 0,
      y: nativeScrollBarSize.y === 0,
    };
    var env = {
      _autoUpdateLoop: false,
      _nativeScrollbarSize: nativeScrollBarSize,
      _nativeScrollbarIsOverlaid: nativeScrollbarIsOverlaid,
      _nativeScrollbarStyling: getNativeScrollbarStyling(envElm),
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
    removeAttr(envElm, 'class');
    removeElements(envElm);

    if (!nativeScrollbarIsOverlaid.x || !nativeScrollbarIsOverlaid.y) {
      var size = windowSize();
      var dpr = getWindowDPR();
      var scrollbarSize = nativeScrollBarSize;
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

  var createLifecycleBase = function createLifecycleBase(defaultOptionsWithTemplate, cacheUpdateInfo, initialOptions, updateFunction) {
    var _transformOptions = transformOptions(defaultOptionsWithTemplate),
      optionsTemplate = _transformOptions._template,
      defaultOptions = _transformOptions._options;

    var options = assignDeep({}, defaultOptions, validateOptions(initialOptions || {}, optionsTemplate, null, true)._validated);
    var cacheChange = createCache(cacheUpdateInfo);
    var cacheOptions = createCache(options, true);

    var update = function update(hints) {
      var hasForce = isBoolean(hints._force);
      var force = hints._force === true;
      var changedCache = cacheChange(force ? null : hints._changedCache || (hasForce ? null : []), force);
      var changedOptions = cacheOptions(force ? null : hints._changedOptions, !!hints._changedOptions || force);

      if (changedOptions._anythingChanged || changedCache._anythingChanged) {
        updateFunction(changedOptions, changedCache);
      }
    };

    update({
      _force: true,
    });
    return {
      _options: function _options(newOptions) {
        if (newOptions) {
          var _validateOptions = validateOptions(newOptions, optionsTemplate, options, true),
            changedOptions = _validateOptions._validated;

          assignDeep(options, changedOptions);
          update({
            _changedOptions: keys(changedOptions),
          });
        }

        return options;
      },
      _update: function _update(force) {
        update({
          _force: !!force,
        });
      },
      _updateCache: function _updateCache(cachePropsToUpdate) {
        update({
          _changedCache: cachePropsToUpdate,
        });
      },
    };
  };

  var overflowBehaviorAllowedValues = 'visible-hidden visible-scroll scroll hidden';
  var cssMarginEnd = cssProperty('margin-inline-end');
  var cssBorderEnd = cssProperty('border-inline-end');
  var createStructureLifecycle = function createStructureLifecycle(target, initialOptions) {
    var host = target.host,
      viewport = target.viewport,
      content = target.content;
    var destructFns = [];
    var env = getEnvironment();
    var scrollbarsOverlaid = env._nativeScrollbarIsOverlaid;
    var supportsScrollbarStyling = env._nativeScrollbarStyling;
    var supportFlexboxGlue = env._flexboxGlue;
    var directionObserverObsolete = (cssMarginEnd && cssBorderEnd) || supportsScrollbarStyling || scrollbarsOverlaid.y;

    var _createLifecycleBase = createLifecycleBase(
        {
          paddingAbsolute: [false, optionsTemplateTypes.boolean],
          overflowBehavior: {
            x: ['scroll', overflowBehaviorAllowedValues],
            y: ['scroll', overflowBehaviorAllowedValues],
          },
        },
        {
          padding: [
            function () {
              return topRightBottomLeft(host, 'padding');
            },
            equalTRBL,
          ],
        },
        initialOptions,
        function (options, cache) {
          var _options$paddingAbsol = options.paddingAbsolute,
            paddingAbsolute = _options$paddingAbsol._value,
            paddingAbsoluteChanged = _options$paddingAbsol._changed;
          var _cache$padding = cache.padding,
            padding = _cache$padding._value,
            paddingChanged = _cache$padding._changed;

          if (paddingAbsoluteChanged || paddingChanged) {
            var paddingStyle = {
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
      ),
      _options = _createLifecycleBase._options,
      _update = _createLifecycleBase._update,
      _updateCache = _createLifecycleBase._updateCache;

    var onSizeChanged = function onSizeChanged() {
      _updateCache('padding');
    };

    var onTrinsicChanged = function onTrinsicChanged(widthIntrinsic, heightIntrinsic) {
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
      _options: _options,
      _update: _update,
      _onSizeChanged: onSizeChanged,
      _onTrinsicChanged: onTrinsicChanged,
      _destruct: function _destruct() {
        runEach(destructFns);
      },
    };
  };

  var animationStartEventName = 'animationstart';
  var scrollEventName = 'scroll';
  var scrollAmount = 3333333;
  var ResizeObserverConstructor = jsAPI('ResizeObserver');
  var classNameSizeObserver = 'os-size-observer';
  var classNameSizeObserverAppear = classNameSizeObserver + '-appear';
  var classNameSizeObserverListener = classNameSizeObserver + '-listener';
  var classNameSizeObserverListenerItem = classNameSizeObserverListener + '-item';
  var classNameSizeObserverListenerItemFinal = classNameSizeObserverListenerItem + '-final';
  var cAF = cancelAnimationFrame;
  var rAF = requestAnimationFrame;

  var getDirection = function getDirection(elm) {
    return style(elm, 'direction');
  };

  var createSizeObserver = function createSizeObserver(target, onSizeChangedCallback, options) {
    var _ref = options || {},
      _ref$_direction = _ref._direction,
      direction = _ref$_direction === void 0 ? false : _ref$_direction,
      _ref$_appear = _ref._appear,
      appear = _ref$_appear === void 0 ? false : _ref$_appear;

    var rtlScrollBehavior = getEnvironment()._rtlScrollBehavior;

    var baseElements = createDOM('<div class="' + classNameSizeObserver + '"><div class="' + classNameSizeObserverListener + '"></div></div>');
    var sizeObserver = baseElements[0];
    var listenerElement = sizeObserver.firstChild;

    var onSizeChangedCallbackProxy = function onSizeChangedCallbackProxy(dir) {
      if (direction) {
        var rtl = getDirection(sizeObserver) === 'rtl';
        scrollLeft(sizeObserver, rtl ? (rtlScrollBehavior.n ? -scrollAmount : rtlScrollBehavior.i ? 0 : scrollAmount) : scrollAmount);
        scrollTop(sizeObserver, scrollAmount);
      }

      onSizeChangedCallback(isString(dir) ? dir : undefined);
    };

    var offListeners = [];
    var appearCallback = appear ? onSizeChangedCallbackProxy : null;

    if (ResizeObserverConstructor) {
      var resizeObserverInstance = new ResizeObserverConstructor(onSizeChangedCallbackProxy);
      resizeObserverInstance.observe(listenerElement);
      offListeners.push(function () {
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

        if (!isDirty) {
          return;
        }

        cacheSize = currSize;
        onSizeChangedCallbackProxy();
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

      offListeners.push(on(expandElement, scrollEventName, onScroll));
      offListeners.push(on(shrinkElement, scrollEventName, onScroll));
      style(expandElementChild, {
        width: scrollAmount,
        height: scrollAmount,
      });
      reset();
      appearCallback = appear
        ? function () {
            return onScroll();
          }
        : reset;
    }

    if (direction) {
      var dirCache;
      offListeners.push(
        on(sizeObserver, scrollEventName, function (event) {
          var dir = getDirection(sizeObserver);
          var changed = dir !== dirCache;

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
    return function () {
      runEach(offListeners);
      removeElements(sizeObserver);
    };
  };

  var classNameTrinsicObserver = 'os-trinsic-observer';
  var IntersectionObserverConstructor = jsAPI('IntersectionObserver');
  var createTrinsicObserver = function createTrinsicObserver(target, onTrinsicChangedCallback) {
    var trinsicObserver = createDOM('<div class="' + classNameTrinsicObserver + '"></div>')[0];
    var offListeners = [];
    var heightIntrinsic = false;

    if (IntersectionObserverConstructor) {
      var intersectionObserverInstance = new IntersectionObserverConstructor(
        function (entries) {
          if (entries && entries.length > 0) {
            var last = entries.pop();

            if (last) {
              var newHeightIntrinsic = last.isIntersecting || last.intersectionRatio > 0;

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
      offListeners.push(function () {
        return intersectionObserverInstance.disconnect();
      });
    } else {
      offListeners.push(
        createSizeObserver(trinsicObserver, function () {
          var newSize = offsetSize(trinsicObserver);
          var newHeightIntrinsic = newSize.h === 0;

          if (newHeightIntrinsic !== heightIntrinsic) {
            onTrinsicChangedCallback(false, newHeightIntrinsic);
            heightIntrinsic = newHeightIntrinsic;
          }
        })
      );
    }

    prependChildren(target, trinsicObserver);
    return function () {
      runEach(offListeners);
      removeElements(trinsicObserver);
    };
  };

  var classNameHost = 'os-host';
  var classNameViewport = 'os-viewport';
  var classNameContent = 'os-content';

  var normalizeTarget = function normalizeTarget(target) {
    if (isHTMLElement(target)) {
      var isTextarea = is(target, 'textarea');

      var _host = isTextarea ? createDiv() : target;

      var _viewport = createDiv(classNameViewport);

      var _content = createDiv(classNameContent);

      appendChildren(_viewport, _content);
      appendChildren(_content, contents(target));
      appendChildren(target, _viewport);
      addClass(_host, classNameHost);
      return {
        target: target,
        host: _host,
        viewport: _viewport,
        content: _content,
      };
    }

    var host = target.host,
      viewport = target.viewport,
      content = target.content;
    addClass(host, classNameHost);
    addClass(viewport, classNameViewport);
    addClass(content, classNameContent);
    return target;
  };

  var OverlayScrollbars = function OverlayScrollbars(target, options, extensions) {
    var osTarget = normalizeTarget(target);
    var lifecycles = [];
    var host = osTarget.host;
    lifecycles.push(createStructureLifecycle(osTarget));

    var onSizeChanged = function onSizeChanged(direction) {
      if (direction) {
        each(lifecycles, function (lifecycle) {
          lifecycle._onDirectionChanged && lifecycle._onDirectionChanged(direction);
        });
      } else {
        each(lifecycles, function (lifecycle) {
          lifecycle._onSizeChanged && lifecycle._onSizeChanged();
        });
      }
    };

    var onTrinsicChanged = function onTrinsicChanged(widthIntrinsic, heightIntrinsic) {
      each(lifecycles, function (lifecycle) {
        lifecycle._onTrinsicChanged && lifecycle._onTrinsicChanged(widthIntrinsic, heightIntrinsic);
      });
    };

    createSizeObserver(host, onSizeChanged, {
      _appear: true,
      _direction: true,
    });
    createTrinsicObserver(host, onTrinsicChanged);
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
