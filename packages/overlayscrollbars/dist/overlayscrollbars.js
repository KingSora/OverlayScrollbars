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

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function isArray(obj) {
    return Array.isArray(obj);
  }

  function isArrayLike(obj) {
    var length = !!obj && obj.length;
    return isArray(obj) || (!isFunction(obj) && isNumber(length) && length > -1 && length % 1 == 0);
  }

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

  var abc = {
    a: 1,
    b: 1,
    c: 1,
  };

  var index = function index() {
    var a = abc.a,
      b = abc.b,
      c = abc.c;
    return [
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
      a,
      b,
      c,
    ];
  };

  return index;
});
//# sourceMappingURL=overlayscrollbars.js.map
