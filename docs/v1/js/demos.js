if(!window.Promise) {
    !function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n():"function"==typeof define&&define.amd?define(n):n()}(0,function(){"use strict";function e(e){var n=this.constructor;return this.then(function(t){return n.resolve(e()).then(function(){return t})},function(t){return n.resolve(e()).then(function(){return n.reject(t)})})}function n(e){return!(!e||"undefined"==typeof e.length)}function t(){}function o(e){if(!(this instanceof o))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],c(e,this)}function r(e,n){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null!==t){var o;try{o=t(e._value)}catch(r){return void f(n.promise,r)}i(n.promise,o)}else(1===e._state?i:f)(n.promise,e._value)})):e._deferreds.push(n)}function i(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var t=n.then;if(n instanceof o)return e._state=3,e._value=n,void u(e);if("function"==typeof t)return void c(function(e,n){return function(){e.apply(n,arguments)}}(t,n),e)}e._state=1,e._value=n,u(e)}catch(r){f(e,r)}}function f(e,n){e._state=2,e._value=n,u(e)}function u(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;t>n;n++)r(e,e._deferreds[n]);e._deferreds=null}function c(e,n){var t=!1;try{e(function(e){t||(t=!0,i(n,e))},function(e){t||(t=!0,f(n,e))})}catch(o){if(t)return;t=!0,f(n,o)}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,n){var o=new this.constructor(t);return r(this,new function(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}(e,n,o)),o},o.prototype["finally"]=e,o.all=function(e){return new o(function(t,o){function r(e,n){try{if(n&&("object"==typeof n||"function"==typeof n)){var u=n.then;if("function"==typeof u)return void u.call(n,function(n){r(e,n)},o)}i[e]=n,0==--f&&t(i)}catch(c){o(c)}}if(!n(e))return o(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(e);if(0===i.length)return t([]);for(var f=i.length,u=0;i.length>u;u++)r(u,i[u])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e)})},o.reject=function(e){return new o(function(n,t){t(e)})},o.race=function(e){return new o(function(t,r){if(!n(e))return r(new TypeError("Promise.race accepts an array"));for(var i=0,f=e.length;f>i;i++)o.resolve(e[i]).then(t,r)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},o._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var l=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"Promise"in l?l.Promise.prototype["finally"]||(l.Promise.prototype["finally"]=e):l.Promise=o});
}

window._framework.defaultPagePath = 'basic';
window._framework.onPagePathChange = function(obj) { 
	if(!obj.isEmpty && obj.path[0] === 'callbacks') {
		setTimeout(function() {
			$('#callbacks-reset').trigger('click');
		}, 50);
	}
};

var changeTimeoutId;
var basicDemoCodeMirror = CodeMirror(document.getElementById("basicdemo-options-codemirror"), {
	value: "{\n\tclassName       : \"os-theme-dark\",\n\tresize          : \"both\",\n\tsizeAutoCapable : true,\n\tpaddingAbsolute : true,\n\tscrollbars : {\n\t\tclickScrolling : true\n\t}\n}",
	smartIndent : true,
	lineNumbers : true,
	lineWrapping: true,
	scrollbarStyle : null,
	cursorHeight: 0.85,
	indentWithTabs : true,
	indentUnit : 4,
	mode: { name: "javascript", json: true },
});
basicDemoCodeMirror.on("change", function(obj) { 
	if(changeTimeoutId !== undefined)
		clearTimeout(changeTimeoutId);
	
	changeTimeoutId = setTimeout(function() {
		$('#basicdemo-options-codemirror').removeClass('codemirror-error');
		try {
			$('#basicdemo-options-codemirror-result').stop().animate({ opacity : 0 }, 300, function() { 
				$('#basicdemo-options-codemirror-messages').stop().slideUp(300);
				$('#basicdemo-options-codemirror-result').find('pre').addClass('hidden');
				$('#basicdemo-options-codemirror-result-target').show();
				var oldWarn = console.warn;
				console.warn = function(msg) { 
					$('#basicdemo-options-codemirror-messages').find('pre').first().text(msg);
					$('#basicdemo-options-codemirror-messages').stop().slideDown(300);
				};
				try {
				window.eval("try { " +
							"var options = $.extend(true, { }, OverlayScrollbars.defaultOptions(), " + basicDemoCodeMirror.getValue() + "); " + 
								"$('#basicdemo-options-codemirror-result-target').overlayScrollbars(options); " + 
							"} catch(e) { " +
								"$('#basicdemo-options-codemirror').addClass('codemirror-error'); " +
								"$('#basicdemo-options-codemirror-result-target').hide(); " + 
								"$('#basicdemo-options-codemirror-result').stop().animate({ opacity : 1 }, 300).find('pre').removeClass('hidden').text(e); " + 
							"}");
				} catch(e) { 
					$('#basicdemo-options-codemirror').addClass('codemirror-error');
					$('#basicdemo-options-codemirror-result-target').hide(); 
					$('#basicdemo-options-codemirror-result').stop().animate({ opacity : 1 }, 300).find('pre').removeClass('hidden').text(e);
				}
				$('#basicdemo-options-codemirror-result').stop().animate({ opacity : 1 }, 300);
				console.warn = oldWarn;
			});
		}
		catch (e) {
			$('#basicdemo-options-codemirror').addClass('codemirror-error');
			$('#basicdemo-options-codemirror-result-target').hide(); 
			$('#basicdemo-options-codemirror-result').stop().animate({ opacity : 1 }, 300).find('pre').removeClass('hidden').text(e);
		}
	}, 500);
});
$('#basicdemo-options-codemirror-messages').overlayScrollbars({ paddingAbsolute : true, overflowBehavior : { y : "hidden" } });
$('#basicdemo-options-codemirror-messages').hide();
eval("$('#basicdemo-options-codemirror-result-target').overlayScrollbars(" + basicDemoCodeMirror.getValue() + ");");

var resizeDragStartSize = { };
var resizeDragStartPosition = { };
var resizer;
var target;
var strMouseTouchDownEvent = 'mousedown touchstart';
var strMouseTouchUpEvent = 'mouseup touchend';
var strMouseTouchMoveEvent = 'mousemove touchmove';
var strSelectStartEvent = 'selectstart';


function resizerMouseDown(event) {
	var originalEvent = event.originalEvent || event;
	var isTouchEvent = originalEvent.touches !== undefined;
	var mouseOffsetHolder = isTouchEvent ? originalEvent.touches[0] : event;

	if(event.buttons === 1 || event.which === 1 || isTouchEvent) {
		resizeDragStartPosition.x = mouseOffsetHolder.pageX;
		resizeDragStartPosition.y = mouseOffsetHolder.pageY;
		
		target = $(event.target).closest('.resizer-handle');
		resizer = target.closest('.resizer');

		resizeDragStartSize.w = resizer[0].clientWidth;
		resizeDragStartSize.h = resizer[0].clientHeight;

		$('body').addClass('resizing');
		$(document).on(strSelectStartEvent, onSelectStart);
		$(document).on(strMouseTouchMoveEvent, resizerResize);
		$(document).on(strMouseTouchUpEvent, resizerResized);

		event.preventDefault();
		event.stopPropagation();
	}
}

function resizerResize(event) {
	var originalEvent = event.originalEvent || event;
	var isTouchEvent = originalEvent.touches !== undefined;
	var mouseOffsetHolder = isTouchEvent ? originalEvent.touches[0] : event;
	var hostElementCSS = { };
	var CSS = { 
		width : (resizeDragStartSize.w + mouseOffsetHolder.pageX - resizeDragStartPosition.x),
		height : (resizeDragStartSize.h + mouseOffsetHolder.pageY - resizeDragStartPosition.y)
	};
	
	if(target.hasClass('resizer-handle-x'))
		delete CSS.height;
	else if(target.hasClass('resizer-handle-y'))
		delete CSS.width;
	resizer.css(CSS);
	event.stopPropagation();
	resizer.trigger('resizer', [ CSS ]);
}

function resizerResized(event) {
	var eventIsTrusted = event !== undefined;

	$('body').removeClass('resizing');
	$(document).off(strSelectStartEvent, onSelectStart);
	$(document).off(strMouseTouchMoveEvent, resizerResize);
	$(document).off(strMouseTouchUpEvent, resizerResized);
	
	resizeDragStartSize = { };
	resizeDragStartPosition = { };
	resizer = undefined;
	target = undefined;
}

function onSelectStart(event) {
	event.preventDefault();
	return false;
}
$('.capabilitiesdemo-absolute').on('resizer', function(event, CSS) { 
	$('.capabilitiesdemo-absolute').css(CSS);
	event.preventDefault();
	return false;
});
$('.capabilitiesdemo-resize').on('resizer', function(event, CSS) { 
	$('.capabilitiesdemo-resize').css(CSS);
	event.preventDefault();
	return false;
});
$('.capabilitiesdemo-slot-1 .capabilitiesdemo-slot-resizer').on('resizer', function(event, CSS) { 
	$('.capabilitiesdemo-slot-2 .capabilitiesdemo-slot-resizer').css(CSS);
});
$('.capabilitiesdemo-slot-2 .capabilitiesdemo-slot-resizer').on('resizer', function(event, CSS) { 
	$('.capabilitiesdemo-slot-1 .capabilitiesdemo-slot-resizer').css(CSS);
});

$('.capabilitiesdemo-slot-3 .capabilitiesdemo-slot-resizer').on('resizer', function(event, CSS) { 
	$('.capabilitiesdemo-slot-4 .capabilitiesdemo-slot-resizer').css(CSS);
});
$('.capabilitiesdemo-slot-4 .capabilitiesdemo-slot-resizer').on('resizer', function(event, CSS) { 
	$('.capabilitiesdemo-slot-3 .capabilitiesdemo-slot-resizer').css(CSS);
});

$('.resizer-handle').on(strMouseTouchDownEvent, resizerMouseDown);

var absoluteElms = $('.capabilitiesdemo-absolute');
var resizeElms = $('.capabilitiesdemo-resize');
var hundredElms = $('.capabilitiesdemo-hundred');
var endElms = $('.capabilitiesdemo-end');

var resetBtn = $('#capabilites-reset');
var updateBtn = $('#capabilites-update');
var runBtn = $('#capabilites-run');

var toggleAbsoluteContainerBtn = $('#capabilites-content-absolute');
var toggleResizeContainerBtn = $('#capabilites-content-resize');
var toggleHundredContainerBtn = $('#capabilites-content-hundred');
var toggleEndContainerBtn = $('#capabilites-content-end');

var directionDropdown = $('#capabilites-host-direction');
var boxsizingDropdown = $('#capabilites-host-boxsizing');
var widthDropdown = $('#capabilites-host-width');
var heightDropdown = $('#capabilites-host-height');
var floatDropdown = $('#capabilites-host-float');
var borderDropdown = $('#capabilites-host-border');
var marginDropdown = $('#capabilites-host-margin');
var paddingDropdown = $('#capabilites-host-padding');
var envWidthDropdown = $('#capabilites-env-width');
var envHeightDropdown = $('#capabilites-env-height');

var clipAlwaysCheckbox = $('#capabilites-clip-always');
var absolutePaddingCheckbox = $('#capabilites-padding-absolute');
var minMaxCheckbox = $('#capabilites-min-max');

var defaultSetting = {
   absolutePadding: false,
   minMax: true,
   clip: false,
   dir: null,
   box: null,
   width: null,
   height: null,
   float: null,
   border: null,
   margin: null,
   padding: null,
   envWidth: null,
   envHeight: null,
   containers:  {
     absolute:  {
       hidden:  false,
       size:  {
         width: null,
         height: null
      }
    },
     resize:  {
       hidden:  false,
       size:  {
         width: null,
         height: null
      }
    },
     hundred:  {
       hidden:  false
    },
     end:  {
       hidden:  false
    }
  }
};

function objHasFalses(obj) {
	var hasFalses = false;
	$.each(obj, function(prop, value) { 
		if(typeof value === 'object') {
			hasFalses = objHasFalses(value);
		}
		if (value === false || hasFalses) {
			hasFalses = true;
			return false;
		}
	});
	return hasFalses;
}
function getDropdownValue(dropdown) {
	return dropdown.find('.dropdown-value').first().text();
}
function getCheckboxValue(checkbox) {
	return checkbox.prop('checked');
}
function setElmsSize(elm, width, height) {
	elm.css('width', width === null ? '' : width);
	elm.css('height', height === null ? '' : height);
}
function hideElements(elm, hide) {
	if(hide) {
		elm.addClass('hidden');
	}
	else {
		elm.removeClass('hidden');
	}
}
function setDropdownValue(dropdown, value) {
	if(value === null) {
		dropdown.find('.dropdown-list').first().children().first().trigger('click');
	}
	else {
		dropdown.find('.dropdown-list').first().children().each(function(index, elm) {
			elm = $(elm);			
			if(elm.text().toLowerCase() === value.toLowerCase()) {
				elm.trigger('click');
			}
		});
	}
}
function checkCheckbox(checkbox, checked) {
	checkbox.prop('checked', checked).trigger('change');
}
function applySetting(settingObj) {
	hideElements(absoluteElms, settingObj.containers.absolute.hidden);
	hideElements(resizeElms, settingObj.containers.resize.hidden);
	hideElements(hundredElms, settingObj.containers.hundred.hidden);
	hideElements(endElms, settingObj.containers.end.hidden);
	
	setElmsSize(resizeElms, settingObj.containers.resize.size.width, settingObj.containers.resize.size.height);
	setElmsSize(absoluteElms, settingObj.containers.absolute.size.width, settingObj.containers.absolute.size.height);

	checkCheckbox(absolutePaddingCheckbox, settingObj.absolutePadding);
	checkCheckbox(minMaxCheckbox, settingObj.minMax);
	
	setDropdownValue(widthDropdown, settingObj.width);
	setDropdownValue(heightDropdown, settingObj.height);
	setDropdownValue(paddingDropdown, settingObj.padding);
	setDropdownValue(marginDropdown, settingObj.margin);
	setDropdownValue(floatDropdown, settingObj.float);
	setDropdownValue(envWidthDropdown, settingObj.envWidth);
	setDropdownValue(envHeightDropdown, settingObj.envHeight);
	setDropdownValue(directionDropdown, settingObj.dir);
	setDropdownValue(boxsizingDropdown, settingObj.box);
	setDropdownValue(borderDropdown, settingObj.border);
}
function readSetting() {
	return {
		absolutePadding: getCheckboxValue(absolutePaddingCheckbox),
		minMax: getCheckboxValue(minMaxCheckbox),
		clip: getCheckboxValue(clipAlwaysCheckbox),
		dir: getDropdownValue(directionDropdown),
		box: getDropdownValue(boxsizingDropdown),
		width: getDropdownValue(widthDropdown),
		height: getDropdownValue(heightDropdown),
		float: getDropdownValue(floatDropdown),
		border: getDropdownValue(borderDropdown),
		margin: getDropdownValue(marginDropdown),
		padding: getDropdownValue(paddingDropdown),
		envWidth: getDropdownValue(envWidthDropdown),
		envHeight: getDropdownValue(envHeightDropdown),
		containers: {
			absolute: {
				hidden: absoluteElms.first().hasClass('hidden'),
				size: {
					width: absoluteElms.first().css('width'),
					height: absoluteElms.first().css('height'),
				}
			},
			resize: {
				hidden: resizeElms.first().hasClass('hidden'),
				size: {
					width: resizeElms.first().css('width'),
					height: resizeElms.first().css('height'),
				}
			},
			hundred: {
				hidden: hundredElms.first().hasClass('hidden')
			},
			end: {
				hidden: endElms.first().hasClass('hidden')
			},
		}
	}
}
function resetCapabilities() {	
	$('.capabilitiesdemo-slot-content').removeAttr('style');
	$('.capabilitiesdemo-slot-resizer').removeAttr('style');
	
	applySetting(defaultSetting);
}

window.readSetting = readSetting;
window.applySetting = applySetting;

(function setupCapabilities() {
	toggleAbsoluteContainerBtn.on('click', function() { 
		$('.capabilitiesdemo-absolute').toggleClass('hidden');
	});
	toggleResizeContainerBtn.on('click', function() { 
		$('.capabilitiesdemo-resize').toggleClass('hidden');
	});
	toggleHundredContainerBtn.on('click', function() { 
		$('.capabilitiesdemo-hundred').toggleClass('hidden');
	});
	toggleEndContainerBtn.on('click', function() { 
		$('.capabilitiesdemo-end').toggleClass('hidden');
	});

	directionDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'direction-rtl',
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-slot-resizer').removeClass(classes[i]);
		if(value === "RTL") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[0]);
		}
	});
	boxsizingDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'boxsizing-contentbox',
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-slot-resizer').removeClass(classes[i]);
		if(value === "content-box") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[0]);
		}
	});
	widthDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'width-auto',
			'width-hundred'
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-slot-resizer').removeClass(classes[i]);
		if(value === "Auto") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[0]);
		}
		else if(value === "100%") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[1]);
		}
	});
	heightDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'height-auto',
			'height-hundred'
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-slot-resizer').removeClass(classes[i]);
		if(value === "Auto") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[0]);
		}
		else if(value === "100%") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[1]);
		}
	});
	floatDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'float-left',
			'float-right'
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-slot-resizer').removeClass(classes[i]);
		if(value === "Left") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[0]);
		}
		else if(value === "Right") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[1]);
		}
		$('.capabilitiesdemo-slot-content').removeAttr('style');
	});
	borderDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'border-eight',
			'border-none'
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-slot-resizer').removeClass(classes[i]);
		if(value === "8px") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[0]);
		}
		else if(value === "None") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[1]);
		}
	});
	marginDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'margin-ten',
			'margin-twenty'
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-slot-resizer').removeClass(classes[i]);
		if(value === "10px") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[0]);
		}
		else if(value === "20px") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[1]);
		}
	});
	paddingDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'padding-twenty',
			'padding-thirty',
			'padding-none'
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-slot-resizer').removeClass(classes[i]);
		if(value === "20px") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[0]);
		}
		else if(value === "30px") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[1]);
		}
		else if(value === "0px") {
			$('.capabilitiesdemo-slot-resizer').addClass(classes[2]);
		}
	});
	envWidthDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'width-auto',
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-env').removeClass(classes[i]);
		if(value === "Auto") {
			$('.capabilitiesdemo-env').addClass(classes[0]);
		}
	});
	envHeightDropdown.on('dropdownvaluechanged', function(event, value) { 
		var classes = [ 
			'height-auto',
		];
		var i;
		for(i = 0; i < classes.length; i++)
			$('.capabilitiesdemo-env').removeClass(classes[i]);
		if(value === "Auto") {
			$('.capabilitiesdemo-env').addClass(classes[0]);
		}
	});

	minMaxCheckbox.on('change', function() { 
		if($(this).is(":checked"))
			$('.capabilitiesdemo-slot-resizer').removeClass('infinite');
		else
			$('.capabilitiesdemo-slot-resizer').addClass('infinite');
		$('.capabilitiesdemo-slot-content').removeAttr('style');
	}).prop('checked', true);
	absolutePaddingCheckbox.on('change', function() { 
		if($(this).is(":checked")) {
			plugin.options('paddingAbsolute', true);
			pluginTextarea.options('paddingAbsolute', true);
		}
		else {
			plugin.options('paddingAbsolute', false);
			pluginTextarea.options('paddingAbsolute', false);
		}
	}).prop('checked', false);
	clipAlwaysCheckbox.on('change', function() { 
		if($(this).is(":checked")) {
			plugin.options('clipAlways', true);
			pluginTextarea.options('clipAlways', true);
		}
		else {
			plugin.options('clipAlways', false);
			pluginTextarea.options('clipAlways', false);
		}
	}).prop('checked', false);


	var txt = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
	$('#capabilitiesdemo-target-textarea').val(txt);
	$('#capabilitiesdemo-native-textarea').val(txt);

	var plugin = window.i = $('#capabilitiesdemo-target').overlayScrollbars({ 
		normalizeRTL : false,
		clipAlways : false,
		callbacks : {
			onScroll : function() { 
				$('#capabilitiesdemo-native').scrollTop($('#capabilitiesdemo-target').overlayScrollbars().scroll().position.y);
				$('#capabilitiesdemo-native').scrollLeft($('#capabilitiesdemo-target').overlayScrollbars().scroll().position.x);
			},
		}
	}).overlayScrollbars();
	var pluginTextarea = window.t = $('#capabilitiesdemo-target-textarea').overlayScrollbars({ 
		normalizeRTL : false,
		clipAlways : false,
		callbacks : {
			onScroll : function() { 
				$('#capabilitiesdemo-native-textarea').scrollTop($('#capabilitiesdemo-target-textarea').overlayScrollbars().scroll().position.y);
				$('#capabilitiesdemo-native-textarea').scrollLeft($('#capabilitiesdemo-target-textarea').overlayScrollbars().scroll().position.x);
			},
		}
	}).overlayScrollbars();

	$('#capabilitiesdemo-target-textarea').on('keyup', function() { 
		$('#capabilitiesdemo-native-textarea').val($('#capabilitiesdemo-target-textarea').val());
	});
	$('#capabilitiesdemo-native-textarea').on('keyup', function() { 
		$('#capabilitiesdemo-target-textarea').val($('#capabilitiesdemo-native-textarea').val());
		pluginTextarea.update();
	});

	resetBtn.on('click', resetCapabilities);
	updateBtn.on('click', function() { 
		plugin.update();
		pluginTextarea.update();
	});
})();

(function capabilitiesTests() {
	var waitForPluginTime = 100;
	var testResults = window.testResults = {
		passed: [],
		failed: []
	};
	
    function beforeEveryTest() {
        resetBtn.trigger('click');
    }
    function afterEveryTest() {
        console.log(testResults);
    }
	function wait(ms) {
		return function() { 
			return new Promise(function(r) { setTimeout(r, ms) });
		};
	}
	function getPadding(elm) {
        return {
            top: elm.css('padding-top'),
            right: elm.css('padding-right'),
            bottom: elm.css('padding-bottom'),
            left: elm.css('padding-left')
        }
    }
    function getInset(elm) {
        return {
            top: elm.css('top'),
            right: elm.css('right'),
            bottom: elm.css('bottom'),
            left: elm.css('left')
        }
    }
    function isTRBLEqual(a, b) {
        return a.top === b.top &&
            a.right === b.right &&
            a.bottom === b.bottom &&
            a.left === b.left;
    }
    function isEqualBCR(a, b) {
		return Math.floor(a.width) === Math.floor(b.width) && Math.floor(a.height) === Math.floor(b.height);
	}
	function getBCR(elm) {
		var bcr = elm[0].getBoundingClientRect();
		return {
			width: bcr.width,
			height: bcr.height
		};
	}
	function compareElmsBCR(a, b) {
		return isEqualBCR(getBCR(a), getBCR(b));
	}
	function testFinished(name, testPassedFunc) {
		return function() { 
			return new Promise(function(resolve) {
				setTimeout(function() { 
					var result = testPassedFunc();
					var testFailed = objHasFalses(result);
					var testResultObj = { 
						name: name, 
						setting: readSetting(),
						result: result 
					};
					
					if(testFailed) {
						testResults.failed.push(testResultObj);
					}
					else {
						testResults.passed.push(testResultObj);
					}
					
					resolve();
				}, waitForPluginTime);
			});
		}
	}

	//resize
	var setWideContent = setElmsSize.bind(this, resizeElms, 500, 0);
	var setHighContent = setElmsSize.bind(this, resizeElms, 0, 500);
	var setMinContent = setElmsSize.bind(this, resizeElms, 0, 0);
	var setMaxContent = setElmsSize.bind(this, resizeElms, 500, 500);
	
	var setWidthFixed = setDropdownValue.bind(this, widthDropdown, 'fixed');
	var setWidthAuto = setDropdownValue.bind(this, widthDropdown, 'auto');
	var setWidth100 = setDropdownValue.bind(this, widthDropdown, '100%');
	
	var setHeightFixed = setDropdownValue.bind(this, heightDropdown, 'fixed');
	var setHeightAuto = setDropdownValue.bind(this, heightDropdown, 'auto');
	var setHeight100 = setDropdownValue.bind(this, heightDropdown, '100%');
	
	var setFloatNone = setDropdownValue.bind(this, floatDropdown, 'none');
	var setFloatLeft = setDropdownValue.bind(this, floatDropdown, 'left');
	var setFloatRight = setDropdownValue.bind(this, floatDropdown, 'right');

	var setPadding10 = setDropdownValue.bind(this, paddingDropdown, '10px');
	var setPadding20 = setDropdownValue.bind(this, paddingDropdown, '20px');
	var setPadding30 = setDropdownValue.bind(this, paddingDropdown, '30px');
	var setPadding0 = setDropdownValue.bind(this, paddingDropdown, '0px');

	var setMargin0 = setDropdownValue.bind(this, marginDropdown, '0px');
	var setMargin10 = setDropdownValue.bind(this, marginDropdown, '10px');
	var setMargin20 = setDropdownValue.bind(this, marginDropdown, '20px');

	var setBorder2 = setDropdownValue.bind(this, borderDropdown, '2px');
	var setBorder8 = setDropdownValue.bind(this, borderDropdown, '8px');
	var setBorderNone = setDropdownValue.bind(this, borderDropdown, 'none');

	//box-sizing
	var setBorderBox = setDropdownValue.bind(this, boxsizingDropdown, 'border-box');
	var setContentBox = setDropdownValue.bind(this, boxsizingDropdown, 'content-box');

	//hide
	var hideAbsoluteElms = hideElements.bind(this, absoluteElms, true);
	var hideResizeElms = hideElements.bind(this, resizeElms, true);
	var hideHundredElms = hideElements.bind(this, hundredElms, true);
	var hideEndElms = hideElements.bind(this, endElms, true);
	
	//show
	var showAbsoluteElms = hideElements.bind(this, absoluteElms, false);
	var showResizeElms = hideElements.bind(this, resizeElms, false);
	var showHundredElms = hideElements.bind(this, hundredElms, false);
	var showEndElms = hideElements.bind(this, endElms, false);
	
	//checkbox
	var checkMinMaxCheckbox = checkCheckbox.bind(this, minMaxCheckbox, true);
	var uncheckMinMaxCheckbox = checkCheckbox.bind(this, minMaxCheckbox, false);
	var checkAbsolutePaddingCheckbox = checkCheckbox.bind(this, absolutePaddingCheckbox, true);
	var uncheckAbsolutePaddingCheckbox = checkCheckbox.bind(this, absolutePaddingCheckbox, false);
	
	function containersSizeTests() {
        
        function prepare() {
            console.log("containersSizeTests");

            hideAbsoluteElms();
            hideHundredElms();
            hideEndElms();
            
            setFloatLeft();
            setWidthAuto();
            setHeightAuto();
        }
        
		function testPassed() {
			var pluginElm = $('#capabilitiesdemo-target');
			var nativeElm = $('#capabilitiesdemo-native');
			var pluginTextareaElm = $('#capabilitiesdemo-target-textarea').closest('.os-host-textarea').first();
			var nativeTextareaElm = $('#capabilitiesdemo-native-textarea');
			
			var pluginElmBCR = getBCR(pluginElm);
			var nativeElmBCR = getBCR(nativeElm);
			var pluginTextareaElmBCR = getBCR(pluginTextareaElm);
			var nativeTextareaElmBCR = getBCR(nativeTextareaElm);
			
			var generalPassed = isEqualBCR(pluginElmBCR, nativeElmBCR);
			var textareaPassed = isEqualBCR(pluginTextareaElmBCR, nativeTextareaElmBCR);
			
			
			return {
				child: {
					hundred: compareElmsBCR(pluginElm.find(hundredElms), nativeElm.find(hundredElms)),
					end: compareElmsBCR(pluginElm.find(endElms), nativeElm.find(endElms))
				},
				host: {
					general: {
						passed: generalPassed,
						size: {
							plugin: pluginElmBCR,
							native: nativeElmBCR
						}
					},
					textarea: {
						passed: textareaPassed,
						size: {
							plugin: pluginTextareaElmBCR,
							native: nativeTextareaElmBCR
						}
					}
				}
			};
		}
		
		function runContainersSizeTest(setContentSizeFunc) {
			return function() { 
				return new Promise(function(resolve) {
					Promise.resolve()
						.then(setContentSizeFunc)
						.then(testFinished('containersSizeTest', testPassed))
						.then(resolve);
				});
			}
		}
		
		function runAllContainersSizeTests() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(runContainersSizeTest(setMinContent))
					.then(runContainersSizeTest(setMaxContent))
					.then(runContainersSizeTest(setWideContent))
					.then(runContainersSizeTest(setHighContent))
					.then(resolve);
			});
		}
		
		function runAllContainersSizeTestsWithMargins() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(setMargin0)
					.then(runAllContainersSizeTests)
					.then(setMargin10)
					.then(runAllContainersSizeTests)
					.then(setMargin20)
					.then(runAllContainersSizeTests)
					.then(resolve);
			});
		}
		
		function runAllContainersSizeTestsWithMarginsWithBorders() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(setBorder2)
					.then(runAllContainersSizeTestsWithMargins)
					.then(setBorder8)
					.then(runAllContainersSizeTestsWithMargins)
					.then(setBorderNone)
					.then(runAllContainersSizeTestsWithMargins)
					.then(resolve);
			});
		}
		
		function runAllContainersSizeTestsWithMarginsWithBordersWithPaddings() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(setPadding0)
					.then(runAllContainersSizeTestsWithMarginsWithBorders)
					.then(setPadding10)
					.then(runAllContainersSizeTestsWithMarginsWithBorders)
					.then(setPadding20)
					.then(runAllContainersSizeTestsWithMarginsWithBorders)
					.then(setPadding30)
					.then(runAllContainersSizeTestsWithMarginsWithBorders)
					.then(resolve);
			});
		}
		
		function runAllContainersSizeTestsWithMarginsWithBordersWithPaddingsWithMinMax() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(checkMinMaxCheckbox)
					.then(runAllContainersSizeTestsWithMarginsWithBordersWithPaddings)
					.then(uncheckMinMaxCheckbox)
					.then(runAllContainersSizeTestsWithMarginsWithBordersWithPaddings)
					.then(resolve);
			});
		}
		
		function runAllContainersSizeTestsWithMarginsWithBordersWithPaddingsWithMinMaxWithAbsolutePadding() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(uncheckAbsolutePaddingCheckbox)
					.then(runAllContainersSizeTestsWithMarginsWithBordersWithPaddingsWithMinMax)
					.then(checkAbsolutePaddingCheckbox)
					.then(runAllContainersSizeTestsWithMarginsWithBordersWithPaddingsWithMinMax)
					.then(resolve);
			});
		}
		
		function runAllContainersSizeTestsWithMarginsWithBordersWithPaddingsWithMinMaxWithAbsolutePaddingWithBox() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(setBorderBox)
					.then(runAllContainersSizeTestsWithMarginsWithBordersWithPaddingsWithMinMaxWithAbsolutePadding)
					.then(setContentBox)
					.then(runAllContainersSizeTestsWithMarginsWithBordersWithPaddingsWithMinMaxWithAbsolutePadding)
					.then(resolve);
			});
		}

		return function() {
            return new Promise(function(resolve) {
                Promise.resolve()
                    .then(beforeEveryTest)
                    .then(prepare)
                    .then(runAllContainersSizeTestsWithMarginsWithBordersWithPaddingsWithMinMaxWithAbsolutePaddingWithBox)
                    .then(afterEveryTest)
                    .then(resolve);
            });
        }
	}
	
	function paddingTests() {
        
        function prepare() {
            console.log("paddingTests");
        }
        
		function testPassed() {
			var pluginElm = $('#capabilitiesdemo-target');
			var nativeElm = $('#capabilitiesdemo-native');
			var pluginTextareaElm = $('#capabilitiesdemo-target-textarea').closest('.os-host-textarea').first();
			var nativeTextareaElm = $('#capabilitiesdemo-native-textarea');
			
			var generalOsInstance = pluginElm.overlayScrollbars();
			var textareaOsInstance = $('#capabilitiesdemo-target-textarea').overlayScrollbars();
			
			var isPaddingAbsoluteGeneral = generalOsInstance.options().paddingAbsolute;
			var isPaddingAbsoluteTextarea = textareaOsInstance.options().paddingAbsolute;
			
			var generalPaddingElm = $(generalOsInstance.getElements().padding);
			var generalContentElm = $(generalOsInstance.getElements().content);
			
			var textareaPaddingElm = $(textareaOsInstance.getElements().padding);
			var textareaContentElm = $(textareaOsInstance.getElements().target);
			
			var generalPaddingNative = getPadding(pluginElm);
			var generalPaddingPlugin = isPaddingAbsoluteGeneral ? getInset(generalPaddingElm) : getPadding(generalContentElm);
			var textareaPaddingNative = getPadding(pluginTextareaElm);
			var textareaPaddingPlugin = isPaddingAbsoluteTextarea ? getInset(textareaPaddingElm) : getPadding(textareaContentElm);
			
			var generalPassed = isTRBLEqual(generalPaddingPlugin, generalPaddingNative);
			var textareaPassed = isTRBLEqual(textareaPaddingPlugin, textareaPaddingNative);
			
			return {
				general: {
					passed: generalPassed,
					padding: {
						plugin: generalPaddingPlugin,
						native: generalPaddingNative
					}
				},
				textarea: {
					passed: textareaPassed,
					padding: {
						plugin: textareaPaddingPlugin,
						native: textareaPaddingNative
					}
				}
			};
		}
		
		function runPaddingTest(paddingSizeFunc) {
			return function() { 
				return new Promise(function(resolve) {
					Promise.resolve()
						.then(paddingSizeFunc)
						.then(testFinished('paddingTest', testPassed))
						.then(resolve);
				});
			}
		}
		
		function runAllPaddingTests() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(runPaddingTest(setPadding0))
					.then(runPaddingTest(setPadding10))
					.then(runPaddingTest(setPadding20))
					.then(runPaddingTest(setPadding30))
					.then(resolve);
			});
		}
		
		function runAllPaddingTestsWithSizeChange() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(setMinContent)
					.then(runAllPaddingTests)
					.then(setWideContent)
					.then(runAllPaddingTests)
                    .then(setHighContent)
					.then(runAllPaddingTests)
					.then(setMaxContent)
					.then(runAllPaddingTests)
					.then(resolve);
			});
		}
        
        function runAllPaddingTestsWithSizeChangeWithBorderMargin() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(setBorderNone)
                    .then(setMargin0)
					.then(runAllPaddingTestsWithSizeChange)
					.then(setBorder2)
                    .then(setMargin10)
					.then(runAllPaddingTestsWithSizeChange)
					.then(resolve);
			});
		}
		
		function runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSize() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(function() {
                        setFloatNone();
                        setWidthFixed();
                        setHeightFixed();
                    })
					.then(runAllPaddingTestsWithSizeChangeWithBorderMargin)
					.then(function() {
                        setFloatLeft();
                        setWidthAuto();
                        setHeightAuto();
                    })
					.then(runAllPaddingTestsWithSizeChangeWithBorderMargin)
					.then(resolve);
			});
		}
		
		function runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSizeWithMinMax() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(checkMinMaxCheckbox)
					.then(runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSize)
					.then(uncheckMinMaxCheckbox)
					.then(runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSize)
					.then(resolve);
			});
		}
		
		function runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSizeWithMinMaxWithAbsolutePadding() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(checkAbsolutePaddingCheckbox)
					.then(runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSizeWithMinMax)
					.then(uncheckAbsolutePaddingCheckbox)
					.then(runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSizeWithMinMax)
					.then(resolve);
			});
		}
		
		function runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSizeWithMinMaxWithAbsolutePaddingWithBox() {
			return new Promise(function(resolve) {
				Promise.resolve()
					.then(setBorderBox)
					.then(runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSizeWithMinMaxWithAbsolutePadding)
					.then(setContentBox)
					.then(runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSizeWithMinMaxWithAbsolutePadding)
					.then(resolve);
			});
		}
		
        return function() {
            return new Promise(function(resolve) {
                Promise.resolve()
                    .then(beforeEveryTest)
                    .then(prepare)
                    .then(runAllPaddingTestsWithSizeChangeWithBorderMarginWithFixedAutoSizeWithMinMaxWithAbsolutePaddingWithBox)
                    .then(afterEveryTest)
                    .then(resolve);
            });
        }
	}
	
	window.tests = function() {
        return new Promise(function(resolve) {
            Promise.resolve()
                .then(containersSizeTests())
                .then(paddingTests())
                .then(function() {
                    function log(str, blockSize) {
                        // blockSize is a parameter only to support the tests.
                        if (blockSize === undefined) {
                            blockSize = 1024;
                        }
                        var limit = Math.floor(str.length / blockSize);
                        for (var k = 0; k < limit+1; k++) {
                          if (k == limit)
                              console.log(str.substring(blockSize*k, str.length));
                          else
                              console.log(str.substring(blockSize*k, blockSize*(k+1)));
                        }
                    }
                    log(JSON.stringify(testResults.failed))
                    console.log(testResults);
                })
                .then(resolve);
        });
    }
})();

runBtn.on('click', function() { 
	window.tests();
});




var strActive = 'active';
var timeout = 250;
var scrollStartTimeout;
var scrollTimeout;
var scrollStopTimeout;
var overflowChangedTimeout;
var overflowAmountChangedTimeout;
var directionChangedTimeout;
var contentSizeChangedTimeout;
var hostSizeChangedTimeout;
var updatedTimeout;
var scrollStartNum = 0;
var scrollNum = 0;
var scrollStopNum = 0;
var overflowChangedNum = 0;
var overflowAmountChangedNum = 0;
var directionChangedNum = 0;
var contentSizeChangedNum = 0;
var hostSizeChangedNum = 0;
var updatedNum = 0;

$('#callbacks-container-right-plugin').overlayScrollbars({ 
	resize : 'both',
	callbacks : {
		onScrollStart : function(e) {
			var elem = $('#callbacks-light-onScrollStart').addClass(strActive);
			scrollStartNum++;
			$('#callbacks-num-onScrollStart').text(scrollStartNum);
			clearTimeout(scrollStartTimeout);
			scrollStartTimeout = setTimeout(function() { 
				elem.removeClass(strActive);
			}, timeout);
		},
		onScroll : function(e) {
			var elem = $('#callbacks-light-onScroll').addClass(strActive);
			scrollNum++;
			$('#callbacks-num-onScroll').text(scrollNum);
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(function() { 
				elem.removeClass(strActive);
			}, timeout);
		},
		onScrollStop : function(e) {
			var elem = $('#callbacks-light-onScrollStop').addClass(strActive);
			scrollStopNum++;
			$('#callbacks-num-onScrollStop').text(scrollStopNum);
			clearTimeout(scrollStopTimeout);
			scrollStopTimeout = setTimeout(function() { 
				elem.removeClass(strActive);
			}, timeout);
		},
		onOverflowChanged : function(e) {
			var elem = $('#callbacks-light-onOverflowChanged').addClass(strActive);
			overflowChangedNum++;
			$('#callbacks-num-onOverflowChanged').text(overflowChangedNum);
			//console.log("onOverflowChanged : " + JSON.stringify(e, null, 2));
			clearTimeout(overflowChangedTimeout);
			overflowChangedTimeout = setTimeout(function() { 
				elem.removeClass(strActive);
			}, timeout);
		},
		onOverflowAmountChanged : function(e) {
			var elem = $('#callbacks-light-onOverflowAmountChanged').addClass(strActive);
			overflowAmountChangedNum++;
			$('#callbacks-num-onOverflowAmountChanged').text(overflowAmountChangedNum);
			//console.log("onOverflowAmountChanged : " + JSON.stringify(e, null, 2));
			clearTimeout(overflowAmountChangedTimeout);
			overflowAmountChangedTimeout = setTimeout(function() { 
				elem.removeClass(strActive);
			}, timeout);
		},
		onDirectionChanged : function(e) {
			var elem = $('#callbacks-light-onDirectionChanged').addClass(strActive);
			directionChangedNum++;
			$('#callbacks-num-onDirectionChanged').text(directionChangedNum);
			//console.log("onDirectionChanged : " + JSON.stringify(e, null, 2));
			clearTimeout(directionChangedTimeout);
			directionChangedTimeout = setTimeout(function() { 
				elem.removeClass(strActive);
			}, timeout);
		},
		onContentSizeChanged : function(e) {
			var elem = $('#callbacks-light-onContentSizeChanged').addClass(strActive);
			contentSizeChangedNum++;
			$('#callbacks-num-onContentSizeChanged').text(contentSizeChangedNum);
			//console.log("onContentSizeChanged : " + JSON.stringify(e, null, 2));
			clearTimeout(contentSizeChangedTimeout);
			contentSizeChangedTimeout = setTimeout(function() { 
				elem.removeClass(strActive);
			}, timeout);
		},
		onHostSizeChanged : function(e) {
			var elem = $('#callbacks-light-onHostSizeChanged').addClass(strActive);
			hostSizeChangedNum++;
			$('#callbacks-num-onHostSizeChanged').text(hostSizeChangedNum);
			//console.log("onHostSizeChanged : " + JSON.stringify(e, null, 2));
			clearTimeout(hostSizeChangedTimeout);
			hostSizeChangedTimeout = setTimeout(function() { 
				elem.removeClass(strActive);
			}, timeout);
		},
		onUpdated : function(e) {
			var elem = $('#callbacks-light-onUpdated').addClass(strActive);
			updatedNum++;
			$('#callbacks-num-onUpdated').text(updatedNum);
			//console.log("onUpdated : " + JSON.stringify(e, null, 2));
			clearTimeout(updatedTimeout);
			updatedTimeout = setTimeout(function() { 
				elem.removeClass(strActive);
			}, timeout);
		},
	}
});

$('#callbacks-reset').on('click', function() { 
	$('#callbacks-container-right-plugin').removeAttr('style');
	$('.callbacks-resizer').removeAttr('style');
	setTimeout(function() { 
		scrollStartNum = 0;
		scrollNum = 0;
		scrollStopNum = 0;
		overflowChangedNum = 0;
		overflowAmountChangedNum = 0;
		directionChangedNum = 0;
		contentSizeChangedNum = 0;
		hostSizeChangedNum = 0;
		updatedNum = 0;
		$('#callbacks-num-onScrollStart').text(scrollStartNum);
		$('#callbacks-num-onScroll').text(scrollNum);
		$('#callbacks-num-onScrollStop').text(scrollStopNum);
		$('#callbacks-num-onOverflowChanged').text(overflowChangedNum);
		$('#callbacks-num-onOverflowAmountChanged').text(overflowAmountChangedNum);
		$('#callbacks-num-onDirectionChanged').text(directionChangedNum);
		$('#callbacks-num-onContentSizeChanged').text(contentSizeChangedNum);
		$('#callbacks-num-onHostSizeChanged').text(hostSizeChangedNum);
		$('#callbacks-num-onUpdated').text(updatedNum);
	}, 50);
});

$('#callbacks-change-dir').on('click', function() { 
	var dir = $('#callbacks-container-right-plugin').css('direction');
	if(dir === 'ltr')
		$('#callbacks-container-right-plugin').css('direction', 'rtl');
	else
		$('#callbacks-container-right-plugin').css('direction', 'ltr');
});

$('#callbacks-rnd-size').on('click', function() { 
	var w = Math.floor(Math.random() * 600) + 50;  
	var h = Math.floor(Math.random() * 400) + 50;
	$('#callbacks-container-right-plugin').css({ 'width' : w, 'height' : h });
});







$('#textarea-demo-width').on('dropdownvaluechanged', function(event, value) { 
	var classes = [ 
		'auto-width'
	];
	var i;
	for(i = 0; i < classes.length; i++)
		$('.textarea-demo-plugin').removeClass(classes[i]);
	if(value === "Auto") {
		$('.textarea-demo-plugin').addClass(classes[0]);
	}
});
$('#textarea-demo-height').on('dropdownvaluechanged', function(event, value) { 
	var classes = [ 
		'auto-height'
	];
	var i;
	for(i = 0; i < classes.length; i++)
		$('.textarea-demo-plugin').removeClass(classes[i]);
	if(value === "Auto") {
		$('.textarea-demo-plugin').addClass(classes[0]);
	}
});
$('#textarea-demo-wrap').on('dropdownvaluechanged', function(event, value) { 
	if(value === "Off") {
		$('#textarea-demo-plugin').attr('wrap', 'off');
	}
	else {
		$('#textarea-demo-plugin').removeAttr('wrap');
	}
});
$('#textarea-demo-rows').on('dropdownvaluechanged', function(event, value) { 
	if(value === "15") {
		$('#textarea-demo-plugin').attr('rows', 15);
	}
	else if(value === "30") {
		$('#textarea-demo-plugin').attr('rows', 30);
	}
	else {
		$('#textarea-demo-plugin').removeAttr('rows');
	}
});
$('#textarea-demo-cols').on('dropdownvaluechanged', function(event, value) { 
	if(value === "30") {
		$('#textarea-demo-plugin').attr('cols', 30);
	}
	else if(value === "60") {
		$('#textarea-demo-plugin').attr('cols', 60);
	}
	else {
		$('#textarea-demo-plugin').removeAttr('cols');
	}
});

var textareaDemoTxt = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr," + "\r\n" +
"sed diam nonumy eirmod tempor invidunt ut labore et dolore magna" + "\r\n" +
"aliquyam erat, sed diam voluptua." + "\r\n" +
"At vero eos et accusam et justo duo dolores et ea rebum." + "\r\n" +
"Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor" + "\r\n" +
"sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam" + "\r\n" +
"nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat," + "\r\n" +
"sed diam voluptua.\r\n\r\n" +
"-----------------------This line is extra long to demonstrate text wrap=\"off\"-----------------------" + "\r\n" +
"" + "\r\n" +
"At vero eos et accusam et justo duo dolores et ea rebum." + "\r\n" +
"Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet." + "\r\n" +
"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam" + "\r\n" +
"nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat," + "\r\n" +
" sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum." + "\r\n" +
"Stet clita kasd gubergren, no sea takimata sanctus est" + "\r\n" +
"Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur" + "\r\n" +
"sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore" + "\r\n" +
"magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo" + "\r\n" +
"duo dolores et ea rebum." + "\r\n" +
"Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
$('#textarea-demo-plugin').val(textareaDemoTxt);
var textareaDemoPlugin = $('#textarea-demo-plugin').overlayScrollbars({ 
	className : 'os-theme-dark',
	resize : 'both',
}).overlayScrollbars();

$('#textarea-demo-dynwidth').on('change', function() { 
	if($(this).is(":checked"))
		textareaDemoPlugin.options('textarea.dynWidth', true);
	else
		textareaDemoPlugin.options('textarea.dynWidth', false);
}).prop('checked', false);

$('#textarea-demo-dynheight').on('change', function() { 
	if($(this).is(":checked"))
		textareaDemoPlugin.options('textarea.dynHeight', true);
	else
		textareaDemoPlugin.options('textarea.dynHeight', false);
}).prop('checked', false);

$('#textarea-demo-reset').on('click', function() { 
	$('#textarea-demo-width > .dropdown-value').text($('#textarea-demo-width > .dropdown-list > div').first().text());
	$('#textarea-demo-width').trigger('dropdownvaluechanged');
	$('#textarea-demo-height > .dropdown-value').text($('#textarea-demo-height > .dropdown-list > div').first().text());
	$('#textarea-demo-height').trigger('dropdownvaluechanged');
	$('#textarea-demo-wrap > .dropdown-value').text($('#textarea-demo-wrap > .dropdown-list > div').first().text());
	$('#textarea-demo-wrap').trigger('dropdownvaluechanged');
	$('#textarea-demo-cols > .dropdown-value').text($('#textarea-demo-cols > .dropdown-list > div').first().text());
	$('#textarea-demo-cols').trigger('dropdownvaluechanged');
	$('#textarea-demo-rows > .dropdown-value').text($('#textarea-demo-rows > .dropdown-list > div').first().text());
	$('#textarea-demo-rows').trigger('dropdownvaluechanged');
	$('#textarea-demo-dynwidth').prop('checked', false).trigger('change');
	$('#textarea-demo-dynheight').prop('checked', false).trigger('change');
	$('.os-host-textarea.textarea-demo-plugin').removeAttr('style');
});
$('#textarea-demo-full-dynwidth').on('click', function() { 
	$('#textarea-demo-width > .dropdown-value').text($('#textarea-demo-width > .dropdown-list > div').last().text());
	$('#textarea-demo-plugin').attr('wrap', 'off');
	$('#textarea-demo-wrap > .dropdown-value').text($('#textarea-demo-wrap > .dropdown-list > div').last().text());
	$('.textarea-demo-plugin').addClass('auto-width');
	$('#textarea-demo-dynwidth').prop('checked', true).trigger('change');
});
$('#textarea-demo-full-dynheight').on('click', function() { 
	$('#textarea-demo-height > .dropdown-value').text($('#textarea-demo-height > .dropdown-list > div').last().text());
	$('.textarea-demo-plugin').addClass('auto-height');
	$('#textarea-demo-dynheight').prop('checked', true).trigger('change');
});




$('#theme-demo-plugin-one').overlayScrollbars({
	className : 'os-theme-violet',
	paddingAbsolute: true,
	resize : 'both',
	scrollbars : {
		clickScrolling : true,
	}
});
$('#theme-demo-plugin-two').overlayScrollbars({
	className : 'os-theme-thin',
	paddingAbsolute: true,
	resize : 'both',
	scrollbars : {
		autoHide : 'leave',
		clickScrolling : true
	}
});
$('#theme-demo-plugin-three').overlayScrollbars({
	className : 'os-theme-minimal',
	paddingAbsolute: true,
	resize : 'both',
	scrollbars : {
		autoHide : 'scroll'
	}
});
var gradientTop = $('<div id="theme-demo-plugin-four-graidient-top"></div>');
var gradientBot = $('<div id="theme-demo-plugin-four-graidient-bottom"></div>');
var show = false;
var onScrollCallback = function() {
	var instance = this;
	var host = $(instance.getElements().host);
	var scrollInfo = instance.scroll();
	host.css({ 
		//'background' : 'rgba(' + Math.min(Math.round(54 * scrollInfo.ratio.y), 255) + ', ' + Math.max((255 - Math.round(190 * scrollInfo.ratio.y)), Math.round(190 * scrollInfo.ratio.y)) + ', ' + Math.max(Math.round(253 * scrollInfoy.ratio.y), 30) + ', ' + 1 + ')',
		'background' : 'rgb(' + 
		(100 - Math.round((100 - 46) * scrollInfo.ratio.y)) + ', ' + 
		(97 - Math.round((97 - 190) * scrollInfo.ratio.y)) + ', ' + 
		(246 - Math.round((246 - 253) * scrollInfo.ratio.y)) + ')',
		'color' : 'rgb(' + Math.round(255 * scrollInfo.ratio.y) + ', ' + Math.round(255 * scrollInfo.ratio.y) + ', ' + Math.round(255 * scrollInfo.ratio.y) + ')'
	});
	if(show) {
		if(scrollInfo.ratio.y > 0)
			gradientTop.css('opacity', 1);
		else
			gradientTop.css('opacity', 0);
		
		if(scrollInfo.ratio.y < 1)
			gradientBot.css('opacity', 1);
		else
			gradientBot.css('opacity', 0);
	}
	else {
		gradientTop.css('opacity', 0);
		gradientBot.css('opacity', 0);
	}
};
$('#theme-demo-plugin-four').overlayScrollbars({
	paddingAbsolute: true,
	resize : 'both',
	callbacks : {
		onScroll : onScrollCallback,
		onInitialized : function() {
			var instance = this;
			var padding = instance.getElements().padding;
			gradientBot.insertAfter(padding);
			gradientTop.insertAfter(padding);
			onScrollCallback.call(this);
		},
		onOverflowChanged : function(e) {
			show = e.yScrollable && e.y;
			onScrollCallback.call(this);
		}
	}
});

var markElement;
var scrollDemo = $('#scroll-demo-plugin').overlayScrollbars({ 
	paddingAbsolute: true,
	callbacks : {
		onScrollStop : function() { 
			if(markElement) {
				var remove = markElement;
				markElement.addClass('blink');
				setTimeout(function() { 
					remove.removeClass('blink');
				}, 600);
			}
			markElement = undefined;
		},
	}
}).overlayScrollbars();
var scrollDemoCodeMirror = CodeMirror(document.getElementById("scroll-demo-codemirror"), {
	value: "scroll(0);",
	smartIndent : true,
	lineNumbers : true,
	lineWrapping: true,
	scrollbarStyle : null,
	cursorHeight: 0.85,
	indentWithTabs : true,
	indentUnit : 4,
	mode: { name: "javascript", json: true },
});
var scrollCodeMirrorChangeTimeout;
var scrollCodeMirrorChangeTimeoutDelay;
var scrollCodeMirrorOldValue;
var checkForSameVal = false;
scrollDemo.scroll(0);
scrollDemoCodeMirror.on("change", function(obj) {
	clearTimeout(scrollCodeMirrorChangeTimeout);
	scrollCodeMirrorChangeTimeout = setTimeout(function() {
		var value = scrollDemoCodeMirror.getValue();
		var indexScroll = value.indexOf('scroll');
		if(scrollCodeMirrorOldValue === value && checkForSameVal) {
			checkForSameVal = false;
			return;
		}
		$('#scroll-demo-codemirror').removeClass('codemirror-error');
		scrollCodeMirrorOldValue = value;
		value = value.substring(indexScroll);
		if(value !== undefined) {
			value = '.' + value.replace(/ /g, '');
			var elSplit = value.split('el:');
			if(elSplit.length > 1) {
				elSplit = elSplit[1].split('}')[0].split(',')[0].split('("');
				if(elSplit.length > 1) {
					elSplit = elSplit[1].split('")')[0];
					markElement = $(elSplit);
				}
			}
		}
		scrollDemo.scrollStop();
		try {
			eval('try { scrollDemo' + value + ' } catch(e) { $("#scroll-demo-codemirror").addClass("codemirror-error"); }');
		} catch(e) { 
			$('#scroll-demo-codemirror').addClass('codemirror-error');
		}
	}, scrollCodeMirrorChangeTimeoutDelay);
	scrollCodeMirrorChangeTimeoutDelay = 500;
});
$('#scroll-demo-reset').on('click', function() { 
	scrollCodeMirrorChangeTimeoutDelay = 0;
	scrollDemoCodeMirror.getDoc().setValue('scroll(0, 250);');
});
$('.scroll-demo-item').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	scrollDemoCodeMirror.getDoc().setValue('scroll($(".scroll-demo-item:nth-child(' + ($(this).index() + 1) + ')")' + ', 500);');
});
$('#scroll-demo-relative').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ x : "+=98", y : "+=98" }, 500);');
});
$('#scroll-demo-absolute').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ x : 333, y : 777 }, 500);');
});
$('#scroll-demo-units').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ x : "1vw - 33% - 30px", y : "1vh + 33% + 30px" }, 1000);');
});
$('#scroll-demo-calc').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ x : "((100% / 2) * 2) - 98", y : "((100% / 2) * 2) - 98" }, 1000);');
});
$('#scroll-demo-easing').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ x : "50%", y : "50%" }, 5000, "easeOutElastic");');
});
$('#scroll-demo-specialeasing').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	scrollDemoCodeMirror.getDoc().setValue('scroll("100%", 3300, { x : "linear", y : "easeOutBounce" });');
});
$('#scroll-demo-elementwmargin').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	checkForSameVal = true;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ el: ' + '$(".scroll-demo-item:nth-child(' + 69 + ')"), margin: true }' + ', 500);');
});
$('#scroll-demo-elementwomargin').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	checkForSameVal = true;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ el: ' + '$(".scroll-demo-item:nth-child(' + 69 + ')"), margin: false }' + ', 500);');
});
$('#scroll-demo-elementcmargin').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	checkForSameVal = true;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ el: ' + '$(".scroll-demo-item:nth-child(' + 69 + ')"), margin: [10, 10, 10, 10] }' + ', 500);');
});
$('#scroll-demo-blockbegin').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	checkForSameVal = true;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ el: ' + '$(".scroll-demo-item:nth-child(' + 169 + ')"), block : "begin"}' + ', 500);');
});
$('#scroll-demo-blockcenter').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	checkForSameVal = true;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ el: ' + '$(".scroll-demo-item:nth-child(' + 169 + ')"), block : "center"}' + ', 500);');
});
$('#scroll-demo-blockend').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	checkForSameVal = true;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ el: ' + '$(".scroll-demo-item:nth-child(' + 169 + ')"), block : "end"}' + ', 500);');
});
$('#scroll-demo-blockarr').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	checkForSameVal = true;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ el: ' + '$(".scroll-demo-item:nth-child(' + 330 + ')"), block : ["center", "begin"] }' + ', 500);');
});
$('#scroll-demo-yonly').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	checkForSameVal = true;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ el: ' + '$(".scroll-demo-item:nth-child(' + 250 + ')"), scroll : { x : "never" } }' + ', 500);');
});
$('#scroll-demo-xonly').on('click', function() {
	scrollCodeMirrorChangeTimeoutDelay = 0;
	checkForSameVal = true;
	scrollDemoCodeMirror.getDoc().setValue('scroll({ el: ' + '$(".scroll-demo-item:nth-child(' + 250 + ')"), scroll : { y : "never" } }' + ', 500);');
});
$('#scroll-demo-rtl').on('change', function() { 
	if($(this).is(":checked"))
		$('#scroll-demo-plugin').css('direction', 'rtl');
	else
		$('#scroll-demo-plugin').css('direction', '');
	$('#scroll-demo-reset').trigger('click');
}).prop('checked', false);



$('.nesting-demo-element-plugin').overlayScrollbars({ });






var inputElement = $('.content-demo-input');
var inputIconElement = $('.content-demo-input-user-icon');
var chatElement = $('.content-demo-chat-content');
var backgroundUrl = "url(img/";
var possibleLeftUsers = [ 
	{ n: "Reiner Braun", i: backgroundUrl + "demo_content_reiner.png)" , m: "Good day, %!<br>How are you doing? Any plans for tonight?" },
	{ n: "Eren Jäger", i: backgroundUrl + "demo_content_eren.png)", m: "Whats up %.<br>Wanna talk about our god and savior?" },
	{ n: "Levi Ackerman", i: backgroundUrl + "demo_content_levi.png)", m: "Hi %." },
	{ n: "Sasha Braus", i: backgroundUrl + "demo_content_sasha.png)", m: "Yo, %!<br>Do you know what is my favorite food?" }
];
var possibleRightUsers = [ 
	{ n: "Annie Leonhardt", i: backgroundUrl + "demo_content_annie.png)", 
		m: [ "Hi %.<br>That's none of your business.", "%, have you gone crazy?", "%.<br> What do you want?", "%. Honestly, I don't care." ] 
	},
	{ n: "Connie Springer", i: backgroundUrl + "demo_content_connie.png)", 
		m: [ "Yo %.<br>Nah nothing, do you have any bright ideas?", "What the heck %, are you alright?", "%, please help me!<br>Some weird guys are stalking me, and I dont know what to do!", "%, everyone knows that you love any kind of food." ] 
	},
	{ n: "Mikasa Ackerman", i: backgroundUrl + "demo_content_mikasa.png)", 
		m: [ "...%...<br>Are you trying to ask me out? Not interested.", "%, since when are you religious?<br>Do you have any hobbies I don't know about?", "Hi %?", "Well %, your nickname is \"Potatoegirl\"." ] 
	},
	{ n: "Erwin Smith", i: backgroundUrl + "demo_content_erwin.png)", 
		m: [ "%, I am your supervisor and not your buddy.", "What a silly question %. I am not religious.", "%, you are making a very good Job. Your'e indeed mankinds strongest soldier.", "Well, I know you like potatoes, but your favorite food is meat.<br>Am I right??" ] 
	}
];
var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
var trim = function(str) { 
	return str.replace(/^\s+|\s+$/g, ''); 
};
var leftUserRnd = getRandomInt(0, possibleLeftUsers.length - 1);
var rightUserRnd = getRandomInt(0, possibleRightUsers.length - 1);
var leftUser = possibleLeftUsers[leftUserRnd];
var rightUser = possibleRightUsers[rightUserRnd];
var getCurrentInputUser = function() {
	if(inputElement.hasClass('content-demo-input-right'))
		return rightUser;
	return leftUser;
};
var updateInputUserIcons = function() { 
	var user = getCurrentInputUser();
	inputIconElement.css("background", user.i);
};
var setChatHead = function() { 
	$('.content-demo-chat-head-datetime').text(dayjs().format('MMMM DD, YYYY'));
	var leftUserElements = $('.content-demo-chat-head-users-user-left');
	var rightUserElements = $('.content-demo-chat-head-users-user-right');
	var iconElementSelector = '.content-demo-chat-head-users-user-icon';
	var nameElementSelector = '.content-demo-chat-head-users-user-name';
	leftUserElements.find(iconElementSelector).css("background", leftUser.i);
	rightUserElements.find(iconElementSelector).css("background", rightUser.i);
	leftUserElements.find(nameElementSelector).text(leftUser.n);
	rightUserElements.find(nameElementSelector).text(rightUser.n);
};
var leftUserMessageGroups = [ ];
var rightUserMessageGroups = [ ];
var allUsersMessageGroups = [ ];
var getUserLastMessageGroup = function(user) {
	if(user === leftUser) {
		if(leftUserMessageGroups.length === 0)
			return null;
		return leftUserMessageGroups[leftUserMessageGroups.length -1];
	}
	else {
		if(rightUserMessageGroups.length === 0)
			return null;
		return rightUserMessageGroups[rightUserMessageGroups.length -1];
	}
};
var getUserLastMessageGroupList = function(user) {
	if(user === leftUser)
		return leftUserMessageGroups;
	else
		return rightUserMessageGroups;
};
var sendNewMessageGroup = function(user, message) { 
	var messageGroupList = getUserLastMessageGroupList(user);
	var groupSuffix = user === leftUser ? 'left' : 'right';
	var element = $('<div class="content-demo-chat-message-group-' + groupSuffix + ' content-demo-chat-message-group"></div>');
	var msgGroup = { 
		time : dayjs(),
		user : user,
		elem : element,
		messages : [ message ]
	};
	messageGroupList.push(msgGroup);
	allUsersMessageGroups.push(msgGroup);
	element.append(
		'<div class="content-demo-chat-message-group-head">' +
			'<span class="content-demo-chat-message-group-head-username">' + msgGroup.user.n + '</span>, <span class="content-demo-chat-message-group-head-datetime">' + msgGroup.time.format('HH:mm') + '</span>' +
		'</div>' +
		'<div class="content-demo-chat-message-group-user-icon" style="background:' + msgGroup.user.i + '">' +
		'</div>' +
		'<div class="content-demo-chat-message-group-content">' +
			'<div class="content-demo-chat-message-group-content-item">' +
				'<div class="content-demo-chat-message-group-content-item-datetime">' +
					msgGroup.messages[0].time.format('HH:mm:ss') +
				'</div>' +
				'<div class="content-demo-chat-message-group-content-item-content">' +
					msgGroup.messages[0].content +
				'</div>' +
			'</div>' +
		'</div>'
	);
	chatElement.append(element);
};
var appendToMessageGroup = function(messageGroup, message) {
	var el = messageGroup.elem;
	var msgSlot = el.find('.content-demo-chat-message-group-content').first();
	messageGroup.messages.push(message);
	msgSlot.append(
		'<div class="content-demo-chat-message-group-content-item">' +
			'<div class="content-demo-chat-message-group-content-item-datetime">' +
				message.time.format('HH:mm:ss') +
			'</div>' +
			'<div class="content-demo-chat-message-group-content-item-content">' +
				message.content +
			'</div>' +
		'</div>'
	);
}
var sendMessage = function(user, content) { 
	var lastMessageGroup = getUserLastMessageGroup(user);
	var message = { time : dayjs(), content : content };
	if(lastMessageGroup == null || allUsersMessageGroups[allUsersMessageGroups.length -1] !== lastMessageGroup) {
		sendNewMessageGroup(user, message);
	}
	else {
		var messageGroupEndTime = lastMessageGroup.time.endOf('minute');
		if(message.time > messageGroupEndTime) {
			sendNewMessageGroup(user, message);
		} 
		else {
			appendToMessageGroup(lastMessageGroup, message);
		}
	}
};
var sendFirstMessages = function() { 
	sendMessage(leftUser, leftUser.m.replace("%", rightUser.n.split(' ')[0]));
	sendMessage(rightUser, rightUser.m[$.inArray(leftUser, possibleLeftUsers)].replace("%", leftUser.n.split(' ')[0]));
};


var doScroll;
var animationRunning = false;
var setDoScroll = function() {
	if(!animationRunning)
		doScroll = this.scroll().ratio.y === 1;
	else
		doScroll = true;
};
var performScroll = function() { 
	animationRunning = true;
	chatOS.scrollStop();
	chatOS.scroll({ y : '100%' }, 250, 'swing', function() { animationRunning = false; });
};
var chatOS = $('.content-demo-chat').overlayScrollbars({ 
	sizeAutoCapable : false,
	callbacks : { 
		onHostSizeChanged : function() { 
			if(doScroll)
				performScroll();
		},
		onContentSizeChanged : function() { 
			if(doScroll)
				performScroll();
		},
		onScroll : setDoScroll,
		onInitialized : setDoScroll,
		onOverflowChanged : function(e) {	
			if(e.y) 
				performScroll();
		},
	}
}).overlayScrollbars();
var chatInputOS = $('.content-demo-input-textarea-plugin').overlayScrollbars({ paddingAbsolute : true }).overlayScrollbars();
$('.content-demo-input-textarea-plugin').on('focus', function() { 
	$('.content-demo-input-textarea').addClass('focus');
}).on('focusout', function() { 
	$('.content-demo-input-textarea').removeClass('focus');
});
$('.content-demo-input-switch').on('click', function() { 
	inputElement.toggleClass('content-demo-input-right');
	updateInputUserIcons();
	$('.content-demo-input textarea').focus();
});
$('.content-demo-input textarea').on('keydown', function(e) { 
	var value = $('.content-demo-input textarea').val();
	if (e.keyCode === 13 && !e.shiftKey) {
		if (value && trim(value.replace(/(?:\r\n|\r|\n)/g, '')).length > 0) {
			value = trim(value.replace(/(?:\r\n|\r|\n)/g, '<br/>'));
			sendMessage(getCurrentInputUser(), value);
			$('.content-demo-input textarea').val("");
			chatInputOS.update();
		}
		return false;
	}
    else
        return true;
});
updateInputUserIcons();
setChatHead();
sendFirstMessages();

$('body').on("contentDestruct", function() { 
    var iFrameInstance = window.osiFrame;
    if(iFrameInstance instanceof OverlayScrollbars && iFrameInstance.destroy)
        iFrameInstance.destroy();
	try { delete window.osiFrame; } catch(e) { }
});


var scaleDemoTarget = $('#scale-demo-plugin');
var scaleDemo = scaleDemoTarget.overlayScrollbars({ 
	paddingAbsolute: true,
	resize: 'both'
}).overlayScrollbars();
$('#scale-demo-input-numeric').on('valuechanged', function(e, value) {
	scaleDemoTarget.css({ transform : 'scale(' + value + ')' });
});



var snappedHandle = $('<div class="os-scrollbar-handle" style="background: red;"></div>');
var updateSnappedHandle = function() {
	snappedHandle.css('width', $(this.getElements().scrollbarHorizontal.handle)[0].offsetWidth);
	snappedHandle.css('transform', 'translate(' + this.scroll().snappedHandleOffset.x + 'px, 0)');
};
var os = $('#hi').overlayScrollbars({ 
	scrollbars : {
		clickScrolling : true,
		snapHandle : false
	},
	callbacks : {
		onInitialized : updateSnappedHandle,
		onScroll : updateSnappedHandle
	}
}).overlayScrollbars();
$(os.getElements().scrollbarHorizontal.track).prepend(snappedHandle);