(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("OverlayScrollbars", ["exports", "dir/not.png", "jquery"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("dir/not.png"), require("jquery"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.not, global.jQuery);
    global.OverlayScrollbars = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _not, _jquery) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "not", {
    enumerable: true,
    get: function get() {
      return _not.default;
    }
  });
  _exports.file = _exports.c = _exports.b = _exports.abc = _exports.a = _exports.default = void 0;
  _not = _interopRequireDefault(_not);
  _jquery = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var abc = 'abc';
  _exports.abc = abc;
  var a = 1 + 1;
  var file = {
    a: a
  };
  _exports.file = file;
  var a$1 = 'a';
  _exports.a = a$1;
  var b = 'b';
  _exports.b = b;
  var c = 'c';
  _exports.c = c;
  var index = (0, _jquery.default)('div');
  var _default = index;
  _exports.default = _default;
});
//# sourceMappingURL=overlayscrollbars-jquery.js.map
