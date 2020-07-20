(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("OverlayScrollbars", ["exports", "jquery"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("jquery"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.jQuery);
    global.OverlayScrollbars = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _jquery) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _jquery = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function isNumber(obj) {
    return typeof obj === 'number';
  }

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function isArray(obj) {
    return Array.isArray(obj);
  }

  function isArrayLike(obj) {
    var length = !!obj && obj.length;
    return isArray(obj) || !isFunction(obj) && isNumber(length) && length > -1 && length % 1 == 0;
  }

  function each(source, callback) {
    var i = 0;

    if (isArrayLike(source)) {
      for (; i < source.length; i++) {
        if (callback(source[i], i, source) === false) break;
      }
    } else if (source) {
      for (i in source) {
        if (callback(source[i], i, source) === false) break;
      }
    }

    return source;
  }

  var contents = function contents(elm) {
    return elm ? Array.from(elm.childNodes) : [];
  };

  var removeElements = function removeElements(nodes) {
    if (isArrayLike(nodes)) {
      each(Array.from(nodes), function (e) {
        return removeElements(e);
      });
    } else if (nodes) {
      var parentNode = nodes.parentNode;
      if (parentNode) parentNode.removeChild(nodes);
    }
  };

  var createDiv = function createDiv() {
    return document.createElement('div');
  };

  var createDOM = function createDOM(html) {
    var elm = createDiv();
    elm.innerHTML = html.trim();
    return each(contents(elm), function (elm) {
      return removeElements(elm);
    });
  };

  var abc = {
    a: 1,
    b: 1,
    c: 1
  };

  var index = function index() {
    var a = abc.a,
        b = abc.b,
        c = abc.c;
    return [createDOM("    <div class=\"os-host\">        <div class=\"os-resize-observer-host\"></div>        <div class=\"os-padding\">            <div class=\"os-viewport\">                <div class=\"os-content\">                    fdfhdfgh                </div>            </div>        </div>        <div class=\"os-scrollbar os-scrollbar-horizontal\">            <div class=\"os-scrollbar-track\">                <div class=\"os-scrollbar-handle\"></div>            </div>        </div>        <div class=\"os-scrollbar os-scrollbar-vertical\">            <div class=\"os-scrollbar-track\">                <div class=\"os-scrollbar-handle\"></div>            </div>        </div>        <div class=\"os-scrollbar-corner\"></div>    </div>"), (0, _jquery.default)('div'), a, b, c];
  };

  var _default = index;
  _exports.default = _default;
});
//# sourceMappingURL=overlayscrollbars.js.map
