(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.OverlayScrollbars = {}));
}(this, (function (exports) { 'use strict';

    const attr = (elm, attrName, value) => {
        if (value === undefined)
            return elm.getAttribute(attrName);
        elm.setAttribute(attrName, value);
    };
    const removeAttr = (elm, attrName) => {
        elm.removeAttribute(attrName);
    };
    const scrollLeft = (elm, value) => {
        if (value === undefined)
            return elm.scrollLeft;
        elm.scrollLeft = value;
    };
    const scrollTop = (elm, value) => {
        if (value === undefined)
            return elm.scrollTop;
        elm.scrollTop = value;
    };
    const val = (elm, value) => {
        if (value === undefined)
            return elm.value;
        elm.value = value;
    };

    const rnothtmlwhite = (/[^\x20\t\r\n\f]+/g);
    const hasClass = (elm, className) => {
        return elm.classList.contains(className);
    };
    const addClass = (elm, className) => {
        let clazz;
        let i = 0;
        if (className) {
            const classes = className.match(rnothtmlwhite) || [];
            while ((clazz = classes[i++]))
                elm.classList.add(clazz);
        }
    };
    const removeClass = (elm, className) => {
        let clazz;
        let i = 0;
        if (className) {
            const classes = className.match(rnothtmlwhite) || [];
            while ((clazz = classes[i++]))
                elm.classList.remove(clazz);
        }
    };
    const conditionalClass = (elm, className, condition) => {
        if (condition) {
            addClass(elm, className);
        }
        else {
            removeClass(elm, className);
        }
    };

    const type = (obj) => {
        if (obj === undefined)
            return obj + '';
        if (obj === null)
            return obj + '';
        return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
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
    function isObject(obj) {
        return typeof obj === 'object' && !isArray(obj) && !isNull(obj);
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
    function isArrayLike(obj) {
        const length = !!obj && obj.length;
        return isArray(obj) || (!isFunction(obj) && isNumber(length) && length > -1 && length % 1 == 0);
    }
    function isPlainObject(obj) {
        if (!obj || !isObject(obj) || type(obj) !== 'object')
            return false;
        let key;
        const proto = 'prototype';
        const hasOwnProperty = Object[proto].hasOwnProperty;
        const hasOwnConstructor = hasOwnProperty.call(obj, 'constructor');
        const hasIsPrototypeOf = obj.constructor && obj.constructor[proto] && hasOwnProperty.call(obj.constructor[proto], 'isPrototypeOf');
        if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
            return false;
        }
        for (key in obj) { }
        return isUndefined(key) || hasOwnProperty.call(obj, key);
    }
    function isHTMLElement(obj) {
        const strOwnerDocument = 'ownerDocument';
        const strHTMLElement = 'HTMLElement';
        const wnd = obj && obj[strOwnerDocument] ? (obj[strOwnerDocument].parentWindow || window) : window;
        return !!(isObject(wnd[strHTMLElement]) ? obj instanceof wnd[strHTMLElement] :
            obj && isObject(obj) && obj !== null && obj.nodeType === 1 && isString(obj.nodeName));
    }
    function isEmptyObject(obj) {
        for (let name in obj)
            return false;
        return true;
    }

    function each(source, callback) {
        let i = 0;
        if (isArrayLike(source)) {
            for (; i < source.length; i++) {
                if (callback(source[i], i, source) === false)
                    break;
            }
        }
        else if (source) {
            for (i in source) {
                if (callback(source[i], i, source) === false)
                    break;
            }
        }
        return source;
    }
    const indexOf = (arr, item, fromIndex) => {
        return arr.indexOf(item, fromIndex);
    };

    const extend = (target, ...sources) => {
        if (typeof target !== "object" && !isFunction(target)) {
            target = {};
        }
        each(sources, (source) => {
            if (source != null) {
                for (const name in source) {
                    const copy = source[name];
                    if (name === "__proto__" || target === copy) {
                        continue;
                    }
                    const copyIsArray = isArray(copy);
                    if (copy && (isPlainObject(copy) || copyIsArray)) {
                        const src = target[name];
                        let clone = src;
                        if (copyIsArray && !isArray(src)) {
                            clone = [];
                        }
                        else if (!copyIsArray && !isPlainObject(src)) {
                            clone = {};
                        }
                        target[name] = extend(clone, copy);
                    }
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        });
        return target;
    };

    const matchesFallback = (elm, selector) => {
        var nodeList = (elm.parentNode || document).querySelectorAll(selector) || [];
        var i = nodeList.length;
        while (i--)
            if (nodeList[i] == elm)
                return true;
        return false;
    };
    const matches = (elm, selector) => {
        return (elm.matches && elm.matches(selector)) || matchesFallback(elm, selector);
    };
    const elementIsVisible = (elm) => {
        return !!(elm.offsetWidth || elm.offsetHeight || elm.getClientRects().length);
    };
    const find = (selector, elm) => {
        const arr = [];
        each((elm || document).querySelectorAll(selector), (e) => {
            arr.push(e);
        });
        return arr;
    };
    const findFirst = (selector, elm) => {
        return (elm || document).querySelector(selector);
    };
    const is = (elm, selector) => {
        if (elm) {
            if (selector === ':visible')
                return elementIsVisible(elm);
            if (selector === ':hidden')
                return !elementIsVisible(elm);
            if (matches(elm, selector))
                return true;
        }
        return false;
    };
    const children = (elm, selector) => {
        const children = [];
        each(elm && elm.children, (child) => {
            if (selector) {
                if (matches(child, selector))
                    children.push(child);
            }
            else
                children.push(child);
        });
        return children;
    };
    const contents = (elm) => {
        return elm ? Array.from(elm.childNodes) : [];
    };
    const parent = (elm) => elm ? elm.parentElement : null;

    const before = (parent, preferredAnchor, insertedElms) => {
        if (insertedElms) {
            let anchor = preferredAnchor;
            let fragment;
            if (!parent)
                return;
            if (isArrayLike(insertedElms)) {
                fragment = document.createDocumentFragment();
                each(insertedElms, (insertedElm) => {
                    if (insertedElm === anchor) {
                        anchor = insertedElm.previousSibling;
                    }
                    fragment.appendChild(insertedElm);
                });
            }
            else {
                fragment = insertedElms;
            }
            if (preferredAnchor) {
                if (!anchor) {
                    anchor = parent.firstChild;
                }
                else if (anchor !== preferredAnchor) {
                    anchor = anchor.nextSibling;
                }
            }
            parent.insertBefore(fragment, anchor);
        }
    };
    const appendChildren = (node, children) => { before(node, null, children); };
    const prependChildren = (node, children) => { before(node, node.firstChild, children); };
    const insertBefore = (node, insertedNodes) => { before(parent(node), node, insertedNodes); };
    const insertAfter = (node, insertedNodes) => { before(parent(node), node.nextSibling, insertedNodes); };
    const removeElements = (nodes) => {
        if (isArrayLike(nodes)) {
            each(Array.from(nodes), (e) => removeElements(e));
        }
        else if (nodes) {
            const parentNode = nodes.parentNode;
            if (parentNode)
                parentNode.removeChild(nodes);
        }
    };

    const createDiv = () => {
        return document.createElement('div');
    };
    const createDOM = (html) => {
        const elm = createDiv();
        elm.innerHTML = html.trim();
        return each(contents(elm), (elm) => removeElements(elm));
    };

    const cssNumber = {
        animationIterationCount: true,
        columnCount: true,
        fillOpacity: true,
        flexGrow: true,
        flexShrink: true,
        fontWeight: true,
        lineHeight: true,
        opacity: true,
        order: true,
        orphans: true,
        widows: true,
        zIndex: true,
        zoom: true
    };
    const setCSSVal = (elm, prop, val) => {
        try {
            if (elm.style[prop] !== undefined) {
                elm.style[prop] = parseCSSVal(prop, val);
            }
        }
        catch (e) { }
    };
    const parseCSSVal = (prop, val) => {
        return !cssNumber[prop.toLowerCase()] && isNumber(val) ? val + 'px' : val;
    };
    function style(elm, styles, val) {
        const getCptStyle = window.getComputedStyle;
        if (isString(styles)) {
            if (isUndefined(val)) {
                const cptStyle = getCptStyle(elm, null);
                return cptStyle != null ? cptStyle.getPropertyValue(styles) : elm.style[styles];
            }
            else {
                setCSSVal(elm, styles, val);
            }
        }
        else {
            for (const key in styles)
                setCSSVal(elm, key, styles[key]);
        }
    }
    const hide = (elm) => {
        elm.style.display = 'none';
    };
    const show = (elm) => {
        elm.style.display = 'block';
    };

    const offset = (elm) => {
        const rect = elm.getBoundingClientRect();
        return {
            top: rect.top + window.pageXOffset,
            left: rect.left + window.pageYOffset
        };
    };
    const position = (elm) => {
        return {
            top: elm.offsetTop,
            left: elm.offsetLeft
        };
    };

    const jsCache = {};
    const cssCache = {};
    const firstLetterToUpper = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const getDummyStyle = () => {
        return createDiv().style;
    };
    const cssPrefixes = ['-webkit-', '-moz-', '-o-', '-ms-'];
    const jsPrefixes = ['WebKit', 'Moz', 'O', 'MS', 'webkit', 'moz', 'o', 'ms'];
    const cssProperty = (name) => {
        let result = cssCache[name];
        if (cssCache.hasOwnProperty(name))
            return result;
        const uppercasedName = firstLetterToUpper(name);
        const elmStyle = getDummyStyle();
        each(cssPrefixes, (prefix) => {
            const prefixWithoutDashes = prefix.replace(/-/g, '');
            const resultPossibilities = [
                name,
                prefix + name,
                prefixWithoutDashes + uppercasedName,
                firstLetterToUpper(prefixWithoutDashes) + uppercasedName
            ];
            each(resultPossibilities, (resultPossibility) => {
                if (elmStyle[resultPossibility] !== undefined) {
                    result = resultPossibility;
                    return false;
                }
            });
            if (result) {
                return false;
            }
        });
        cssCache[name] = result;
        return result;
    };
    const cssPropertyValue = (property, values, suffix) => {
        const name = property + ' ' + values;
        let result = cssCache[name];
        if (cssCache.hasOwnProperty(name))
            return result;
        const dummyStyle = getDummyStyle();
        const possbleValues = values.split(' ');
        const preparedSuffix = suffix || '';
        const cssPrefixesWithFirstEmpty = [''].concat(cssPrefixes);
        each(possbleValues, (possibleValue) => {
            each(cssPrefixesWithFirstEmpty, (prefix) => {
                const prop = prefix + possibleValue;
                dummyStyle.cssText = property + ':' + prop + preparedSuffix;
                if (dummyStyle.length) {
                    result = prop;
                    return false;
                }
            });
            if (result) {
                return false;
            }
        });
        cssCache[name] = result;
        return result;
    };
    const jsAPI = (name) => {
        let result = jsCache[name];
        if (!jsCache.hasOwnProperty(name)) {
            result = window[name];
            each(jsPrefixes, (prefix) => {
                result = result || window[prefix + firstLetterToUpper(name)];
                if (result) {
                    return false;
                }
            });
        }
        return result;
    };

    const resizeObserver = jsAPI('ResizeObserver');
    const mouseButton = (event) => {
        const button = event.button;
        if (!event.which && button !== undefined)
            return (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0)));
        else
            return event.which;
    };

    const templateTypePrefixSuffix = ['__TPL_', '_TYPE__'];
    const optionsTemplateTypes = [
        'boolean',
        'number',
        'string',
        'array',
        'object',
        'function',
        'null'
    ].reduce((result, item) => {
        result[item] = templateTypePrefixSuffix[0] + item + templateTypePrefixSuffix[1];
        return result;
    }, {});
    const validateInternal = function (options, template, optionsDiff, doWriteErrors, propPath) {
        const validatedOptions = {};
        const optionsCopy = Object.assign({}, options);
        for (const prop in template) {
            if (template.hasOwnProperty(prop) && options.hasOwnProperty(prop)) {
                const optionsDiffValue = isUndefined(optionsDiff[prop]) ? {} : optionsDiff[prop];
                const optionsValue = optionsCopy[prop];
                const templateValue = template[prop];
                const templateIsComplex = isPlainObject(templateValue);
                const propPrefix = propPath ? propPath + '.' : '';
                if (templateIsComplex && isPlainObject(optionsValue)) {
                    const validatedInternal = validateInternal(optionsValue, templateValue, optionsDiffValue, doWriteErrors, propPrefix + prop);
                    validatedOptions[prop] = validatedInternal.validated;
                    optionsCopy[prop] = validatedInternal.foreign;
                    each([optionsCopy, validatedOptions], (value) => {
                        if (isEmptyObject(value[prop])) {
                            delete value[prop];
                        }
                    });
                }
                else if (!templateIsComplex) {
                    let isValid = false;
                    const errorEnumStrings = [];
                    const errorPossibleTypes = [];
                    const optionsValueType = type(optionsValue);
                    const templateValueArr = !isArray(templateValue) ? [templateValue] : templateValue;
                    each(templateValueArr, (currTemplateType) => {
                        const isEnumString = indexOf(Object.values(optionsTemplateTypes), currTemplateType) < 0;
                        if (isEnumString && isString(optionsValue)) {
                            const enumStringSplit = currTemplateType.split(' ');
                            isValid = !!enumStringSplit.find(possibility => possibility === optionsValue);
                            errorEnumStrings.push(...enumStringSplit);
                        }
                        else {
                            isValid = optionsTemplateTypes[optionsValueType] === currTemplateType;
                        }
                        errorPossibleTypes.push(isEnumString ? optionsTemplateTypes.string : currTemplateType);
                        return !isValid;
                    });
                    if (isValid) {
                        if (optionsValue !== optionsDiffValue) {
                            validatedOptions[prop] = optionsValue;
                        }
                    }
                    else if (doWriteErrors) {
                        console.warn(`The option "${propPrefix}${prop}" wasn't set, because it doesn't accept the type [ ${optionsValueType.toUpperCase()} ] with the value of "${optionsValue}".\r\n` +
                            `Accepted types are: [ ${errorPossibleTypes.join(', ').toUpperCase()} ].\r\n` +
                            (errorEnumStrings.length > 0 ? `\r\nValid strings are: [ ${errorEnumStrings.join(', ')} ].` : ''));
                    }
                }
                delete optionsCopy[prop];
            }
        }
        return {
            foreign: optionsCopy,
            validated: validatedOptions
        };
    };
    const validate = function (options, template, optionsDiff, doWriteErrors) {
        const result = validateInternal(options, template, optionsDiff || {}, doWriteErrors || false);
        const foreign = result.foreign;
        if (!isEmptyObject(foreign) && doWriteErrors)
            console.warn(`The following options are discarded due to invalidity:\r\n ${window.JSON.stringify(foreign, null, 2)}`);
        return result.validated;
    };

    const classNameAllowedValues = [optionsTemplateTypes.string, optionsTemplateTypes.null];
    const numberAllowedValues = optionsTemplateTypes.number;
    const booleanNullAllowedValues = [optionsTemplateTypes.boolean, optionsTemplateTypes.null];
    const stringArrayNullAllowedValues = [optionsTemplateTypes.string, optionsTemplateTypes.array, optionsTemplateTypes.null];
    const booleanTrueTemplate = [true, optionsTemplateTypes.boolean];
    const booleanFalseTemplate = [false, optionsTemplateTypes.boolean];
    const callbackTemplate = [null, [optionsTemplateTypes.function, optionsTemplateTypes.null]];
    const resizeAllowedValues = 'none both horizontal vertical';
    const overflowBehaviorAllowedValues = 'visible-hidden visible-scroll scroll hidden';
    const scrollbarsVisibilityAllowedValues = 'visible hidden auto';
    const scrollbarsAutoHideAllowedValues = 'never scroll leavemove';
    const defaultOptionsWithTemplate = {
        className: ['os-theme-dark', classNameAllowedValues],
        resize: ['none', resizeAllowedValues],
        sizeAutoCapable: booleanTrueTemplate,
        clipAlways: booleanTrueTemplate,
        normalizeRTL: booleanTrueTemplate,
        paddingAbsolute: booleanFalseTemplate,
        autoUpdate: [null, booleanNullAllowedValues],
        autoUpdateInterval: [33, numberAllowedValues],
        updateOnLoad: [['img'], stringArrayNullAllowedValues],
        nativeScrollbarsOverlaid: {
            showNativeScrollbars: booleanFalseTemplate,
            initialize: booleanFalseTemplate
        },
        overflowBehavior: {
            x: ['scroll', overflowBehaviorAllowedValues],
            y: ['scroll', overflowBehaviorAllowedValues]
        },
        scrollbars: {
            visibility: ['auto', scrollbarsVisibilityAllowedValues],
            autoHide: ['never', scrollbarsAutoHideAllowedValues],
            autoHideDelay: [800, numberAllowedValues],
            dragScrolling: booleanTrueTemplate,
            clickScrolling: booleanFalseTemplate,
            touchSupport: booleanTrueTemplate,
            snapHandle: booleanFalseTemplate
        },
        textarea: {
            dynWidth: booleanFalseTemplate,
            dynHeight: booleanFalseTemplate,
            inheritedAttrs: [['style', 'class'], stringArrayNullAllowedValues],
        },
        callbacks: {
            onInitialized: callbackTemplate,
            onInitializationWithdrawn: callbackTemplate,
            onDestroyed: callbackTemplate,
            onScrollStart: callbackTemplate,
            onScroll: callbackTemplate,
            onScrollStop: callbackTemplate,
            onOverflowChanged: callbackTemplate,
            onOverflowAmountChanged: callbackTemplate,
            onDirectionChanged: callbackTemplate,
            onContentSizeChanged: callbackTemplate,
            onHostSizeChanged: callbackTemplate,
            onUpdated: callbackTemplate
        }
    };
    function convert(optionsWithTemplateObj, toTemplate) {
        const result = {};
        for (const key in optionsWithTemplateObj) {
            if (optionsWithTemplateObj.hasOwnProperty(key)) {
                const val = optionsWithTemplateObj[key];
                if (isArray(val))
                    result[key] = val[toTemplate ? 1 : 0];
                else if (isObject(val))
                    result[key] = convert(val, toTemplate);
            }
        }
        return result;
    }
    const optionsTemplate = convert(defaultOptionsWithTemplate, true);
    const defaultOptions = convert(defaultOptionsWithTemplate);

    const targets = new Set();
    const targetInstanceMap = new WeakMap();
    const addInstance = (target, osInstance) => {
        targetInstanceMap.set(target, osInstance);
        targets.add(target);
    };
    const removeInstance = (target) => {
        targetInstanceMap.delete(target);
        targets.delete(target);
    };
    const getInstance = (target) => {
        return targetInstanceMap.get(target);
    };
    const allInstances = () => {
        const validTargetInstanceMap = new Map();
        targets.forEach((target) => {
            if (targetInstanceMap.has(target)) {
                validTargetInstanceMap.set(target, targetInstanceMap.get(target));
            }
        });
        targets.clear();
        validTargetInstanceMap.forEach((instance, validTarget) => {
            targets.add(validTarget);
        });
        return validTargetInstanceMap;
    };

    window['hi'] = createDOM(`\
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
    </div>`);

    exports.addClass = addClass;
    exports.addInstance = addInstance;
    exports.allInstances = allInstances;
    exports.appendChildren = appendChildren;
    exports.attr = attr;
    exports.children = children;
    exports.conditionalClass = conditionalClass;
    exports.contents = contents;
    exports.createDOM = createDOM;
    exports.createDiv = createDiv;
    exports.cssPrefixes = cssPrefixes;
    exports.cssProperty = cssProperty;
    exports.cssPropertyValue = cssPropertyValue;
    exports.defaultOptions = defaultOptions;
    exports.each = each;
    exports.extend = extend;
    exports.find = find;
    exports.findFirst = findFirst;
    exports.getInstance = getInstance;
    exports.hasClass = hasClass;
    exports.hide = hide;
    exports.indexOf = indexOf;
    exports.insertAfter = insertAfter;
    exports.insertBefore = insertBefore;
    exports.is = is;
    exports.isArray = isArray;
    exports.isArrayLike = isArrayLike;
    exports.isBoolean = isBoolean;
    exports.isEmptyObject = isEmptyObject;
    exports.isFunction = isFunction;
    exports.isHTMLElement = isHTMLElement;
    exports.isNull = isNull;
    exports.isNumber = isNumber;
    exports.isObject = isObject;
    exports.isPlainObject = isPlainObject;
    exports.isString = isString;
    exports.isUndefined = isUndefined;
    exports.jsAPI = jsAPI;
    exports.jsPrefixes = jsPrefixes;
    exports.mouseButton = mouseButton;
    exports.offset = offset;
    exports.optionsTemplate = optionsTemplate;
    exports.optionsTemplateTypes = optionsTemplateTypes;
    exports.parent = parent;
    exports.position = position;
    exports.prependChildren = prependChildren;
    exports.removeAttr = removeAttr;
    exports.removeClass = removeClass;
    exports.removeElements = removeElements;
    exports.removeInstance = removeInstance;
    exports.resizeObserver = resizeObserver;
    exports.scrollLeft = scrollLeft;
    exports.scrollTop = scrollTop;
    exports.show = show;
    exports.style = style;
    exports.type = type;
    exports.val = val;
    exports.validate = validate;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.bundle.js.map
