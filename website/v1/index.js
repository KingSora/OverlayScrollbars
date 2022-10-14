/* 3rd party */
import "./_framework/plugins/js/jquery.min.js";
import "./_framework/plugins/js/jquery.raf.min.js";
import "./_framework/plugins/js/jquery.easing.js";
import "./_framework/plugins/js/day.min.js";
import "./_framework/plugins/js/tippy.min.js";
import "./_framework/plugins/js/highlight.min.js";
import "./_framework/plugins/js/signals.min.js";
import "./_framework/plugins/js/hasher.min.js";
import "./_framework/plugins/js/codemirror/codemirror.min.js";
import "./_framework/plugins/js/codemirror/mode/javascript.min.js";
import "./_framework/plugins/js/viewport-units-buggyfill.min.js";

import "./_framework/js/framework.js";
import "./_framework/js/jquery.overlayScrollbars.js";

$(function () {
  window._framework.buildPage({
    defaultHash: "overview",
  });
});
