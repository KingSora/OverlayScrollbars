(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(exports, require('dir/not.png'), require('jquery'))
    : typeof define === 'function' && define.amd
    ? define(['exports', 'dir/not.png', 'jquery'], factory)
    : ((global = global || self), factory((global.OverlayScrollbars = {}), global.not_png, global.jQuery));
})(this, function (exports, not_png, j) {
  'use strict';

  not_png = not_png && Object.prototype.hasOwnProperty.call(not_png, 'default') ? not_png['default'] : not_png;
  j = j && Object.prototype.hasOwnProperty.call(j, 'default') ? j['default'] : j;

  var abc = 'abc';

  var a = 1 + 1;
  var file = {
    a: a,
  };

  var a$1 = 'a';
  var b = 'b';
  var c = 'c';

  var index = j('div');

  exports.not = not_png;
  exports.a = a$1;
  exports.abc = abc;
  exports.b = b;
  exports.c = c;
  exports.default = index;
  exports.file = file;

  Object.defineProperty(exports, '__esModule', { value: true });
});
//# sourceMappingURL=overlayscrollbars-jquery.js.map
