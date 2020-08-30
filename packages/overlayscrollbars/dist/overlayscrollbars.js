(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = global || self), (global.OverlayScrollbars = factory()));
})(this, function () {
  'use strict';

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
    var length = !!obj && obj.length;
    return isArray(obj) || (!isFunction(obj) && isNumber(length) && length > -1 && length % 1 == 0);
  }

  function getSetProp(topLeft, fallback, elm, value) {
    if (isUndefined(value)) {
      return elm ? elm[topLeft] : fallback;
    }

    elm && (elm[topLeft] = value);
  }
  var removeAttr = function removeAttr(elm, attrName) {
    elm == null ? void 0 : elm.removeAttribute(attrName);
  };
  function scrollLeft(elm, value) {
    return getSetProp('scrollLeft', 0, elm, value);
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

  var hasOwnProperty = function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  };
  var keys = function keys(obj) {
    return obj ? Object.keys(obj) : [];
  };

  function each(source, callback) {
    if (isArrayLike(source)) {
      for (var i = 0; i < source.length; i++) {
        if (callback(source[i], i, source) === false) {
          break;
        }
      }
    } else if (source) {
      each(keys(source), function (key) {
        return callback(source[key], key, source);
      });
    }

    return source;
  }

  var contents = function contents(elm) {
    return elm ? Array.from(elm.childNodes) : [];
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
  var removeElements = function removeElements(nodes) {
    if (isArrayLike(nodes)) {
      each(Array.from(nodes), function (e) {
        return removeElements(e);
      });
    } else if (nodes) {
      var parentNode = nodes.parentNode;

      if (parentNode) {
        parentNode.removeChild(nodes);
      }
    }
  };

  var createDiv = function createDiv() {
    return document.createElement('div');
  };
  var createDOM = function createDOM(html) {
    var createdDiv = createDiv();
    createdDiv.innerHTML = html.trim();
    return each(contents(createdDiv), function (elm) {
      return removeElements(elm);
    });
  };

  var zeroDomRect = new DOMRect();
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
  var offset = function offset(elm) {
    var rect = elm ? elm.getBoundingClientRect() : 0;
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

  var firstLetterToUpper = function firstLetterToUpper(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  var jsPrefixes = ['WebKit', 'Moz', 'O', 'MS', 'webkit', 'moz', 'o', 'ms'];
  var jsCache = {};
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

  var templateTypePrefixSuffix = ['__TPL_', '_TYPE__'];
  var optionsTemplateTypes = ['boolean', 'number', 'string', 'array', 'object', 'function', 'null'].reduce(function (result, item) {
    result[item] = templateTypePrefixSuffix[0] + item + templateTypePrefixSuffix[1];
    return result;
  }, {});

  var abs = Math.abs,
    round = Math.round;

  var nativeScrollbarSize = function nativeScrollbarSize(body, measureElm) {
    appendChildren(body, measureElm);
    var cSize = clientSize(measureElm);
    var oSize = offsetSize(measureElm);
    return {
      x: oSize.h - cSize.h,
      y: oSize.w - cSize.w,
    };
  };

  var nativeScrollbarStyling = function nativeScrollbarStyling(testElm) {
    var result = false;
    addClass(testElm, 'os-viewport-native-scrollbars-invisible');

    try {
      result =
        style(testElm, 'scrollbar-width') === 'none' ||
        window.getComputedStyle(testElm, '::-webkit-scrollbar').getPropertyValue('display') === 'none';
    } catch (ex) {}

    return result;
  };

  var rtlScrollBehavior = function rtlScrollBehavior(parentElm, childElm) {
    var strHidden = 'hidden';
    style(parentElm, {
      overflowX: strHidden,
      overflowY: strHidden,
    });
    scrollLeft(parentElm, 0);
    var parentOffset = offset(parentElm);
    var childOffset = offset(childElm);
    scrollLeft(parentElm, -999);
    var childOffsetAfterScroll = offset(childElm);
    return {
      i: parentOffset.x === childOffset.x,
      n: childOffset.x !== childOffsetAfterScroll.x,
    };
  };

  var passiveEvents = function passiveEvents() {
    var supportsPassive = false;

    try {
      window.addEventListener(
        'test',
        null,
        Object.defineProperty({}, 'passive', {
          get: function get() {
            supportsPassive = true;
          },
        })
      );
    } catch (e) {}

    return supportsPassive;
  };

  var windowDPR = function windowDPR() {
    var dDPI = window.screen.deviceXDPI || 0;
    var sDPI = window.screen.logicalXDPI || 1;
    return window.devicePixelRatio || dDPI / sDPI;
  };

  var diffBiggerThanOne = function diffBiggerThanOne(valOne, valTwo) {
    var absValOne = abs(valOne);
    var absValTwo = abs(valTwo);
    return !(absValOne === absValTwo || absValOne + 1 === absValTwo || absValOne - 1 === absValTwo);
  };

  var _onChangedListener = new WeakMap();

  var Environment = /*#__PURE__*/ (function () {
    function Environment() {
      _onChangedListener.set(this, {
        writable: true,
        value: void 0,
      });

      classPrivateFieldSet(this, _onChangedListener, new Set());

      var _self = this;

      var _document = document,
        body = _document.body;
      var envDOM = createDOM('<div id="os-dummy-scrollbar-size"><div></div></div>');
      var envElm = envDOM[0];
      var envChildElm = envElm.firstChild;
      var nScrollBarSize = nativeScrollbarSize(body, envElm);
      var nativeScrollbarIsOverlaid = {
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
        var size = windowSize();
        var dpr = windowDPR();

        var onChangedListener = classPrivateFieldGet(this, _onChangedListener);

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
            var dprNew = windowDPR();
            var deltaIsBigger = deltaAbsSize.w > 2 && deltaAbsSize.h > 2;
            var difference = !diffBiggerThanOne(deltaAbsRatio.w, deltaAbsRatio.h);
            var dprChanged = dprNew !== dpr && dpr > 0;
            var isZoom = deltaIsBigger && difference && dprChanged;
            var oldScrollbarSize = _self.nativeScrollbarSize;
            var newScrollbarSize;

            if (isZoom) {
              newScrollbarSize = _self.nativeScrollbarSize = nativeScrollbarSize(body, envElm);
              removeElements(envElm);

              if (oldScrollbarSize.x !== newScrollbarSize.x || oldScrollbarSize.y !== newScrollbarSize.y) {
                onChangedListener.forEach(function (listener) {
                  return listener && listener(_self);
                });
              }
            }

            size = sizeNew;
            dpr = dprNew;
          }
        });
      }
    }

    var _proto = Environment.prototype;

    _proto.addListener = function addListener(listener) {
      classPrivateFieldGet(this, _onChangedListener).add(listener);
    };

    _proto.removeListener = function removeListener(listener) {
      classPrivateFieldGet(this, _onChangedListener).delete(listener);
    };

    return Environment;
  })();

  var env = new Environment();
  var index = function () {
    return [
      env,
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
