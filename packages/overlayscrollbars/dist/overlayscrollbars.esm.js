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

const hasOwnProperty = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const keys = (obj) => (obj ? Object.keys(obj) : []);

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
    appearCallback = appear ? onScroll : reset;
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

var index = () => {
  return [
    getEnvironment(),
    createSizeObserver(document.body, () => {}),
    createTrinsicObserver(document.body, () => {}),
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
