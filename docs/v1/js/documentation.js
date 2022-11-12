window._framework.defaultPagePath = 'options';

$('#radio-domelements-standard').on('radioon', function() { 
	$('.domelements-wrapper').removeClass('domelements-wrapper-textarea').addClass('domelements-wrapper-standard');
});
$('#radio-domelements-textarea').on('radioon', function() { 
	$('.domelements-wrapper').removeClass('domelements-wrapper-standard').addClass('domelements-wrapper-textarea');
});

$('#builtinthemes-theme-demo-none').overlayScrollbars({ className : null, paddingAbsolute : true, resize : "both" });
$('#builtinthemes-theme-demo-dark').overlayScrollbars({ className : 'os-theme-dark', paddingAbsolute : true, resize : "both" });
$('#builtinthemes-theme-demo-light').overlayScrollbars({ className : 'os-theme-light', paddingAbsolute : true, resize : "both" });

$('#themesandstyling-styling-handle-length-target').overlayScrollbars({ className : 'os-theme-dark limited-handles', paddingAbsolute : true, resize : "both" });
$('#themesandstyling-styling-scrollbar-position-target').overlayScrollbars({ className : 'os-theme-dark deviant-scrollbars', paddingAbsolute : true, resize : "both" });

var classnamesDomDraftScrollbar = '.classnames-scrollbars-domdraft-element-scrollbar';
var classnamesDesignDraftScrollbar = '.classnames-scrollbars-designdraft-scrollbar';

var classnamesDomDraftScrollbarTrack = '.classnames-scrollbars-domdraft-element-scrollbar-track';
var classnamesDesignDraftScrollbarTrack = '.classnames-scrollbars-designdraft-scrollbar-track';

var classnamesDomDraftScrollbarHandle = '.classnames-scrollbars-domdraft-element-scrollbar-handle';
var classnamesDesignDraftScrollbarHandle = '.classnames-scrollbars-designdraft-scrollbar-handle';

var classnamesDomDraftScrollbarCorner = '.classnames-scrollbars-domdraft-element-corner';
var classnamesDesignDraftScrollbarCorner = '.classnames-scrollbars-designdraft-corner';

var strActive = 'active';
$(classnamesDesignDraftScrollbar + ', ' + classnamesDomDraftScrollbar).on('mouseover', function(e) { 
	$(classnamesDesignDraftScrollbar).addClass(strActive);
	$(classnamesDomDraftScrollbar).addClass(strActive);
	e.stopPropagation();
	e.preventDefault();
}).on('mouseout', function() {
	$(classnamesDesignDraftScrollbar).removeClass(strActive);
	$(classnamesDomDraftScrollbar).removeClass(strActive);
});

$(classnamesDesignDraftScrollbarTrack + ', ' + classnamesDomDraftScrollbarTrack).on('mouseover', function(e) { 
	$(classnamesDesignDraftScrollbarTrack).addClass(strActive);
	$(classnamesDomDraftScrollbarTrack).addClass(strActive);
	e.stopPropagation();
	e.preventDefault();
}).on('mouseout', function() {
	$(classnamesDesignDraftScrollbarTrack).removeClass(strActive);
	$(classnamesDomDraftScrollbarTrack).removeClass(strActive);
});

$(classnamesDesignDraftScrollbarHandle + ', ' + classnamesDomDraftScrollbarHandle).on('mouseover', function(e) { 
	$(classnamesDesignDraftScrollbarHandle).addClass(strActive);
	$(classnamesDomDraftScrollbarHandle).addClass(strActive);
	e.stopPropagation();
	e.preventDefault();
}).on('mouseout', function() {
	$(classnamesDesignDraftScrollbarHandle).removeClass(strActive);
	$(classnamesDomDraftScrollbarHandle).removeClass(strActive);
});

$(classnamesDesignDraftScrollbarCorner + ', ' + classnamesDomDraftScrollbarCorner).on('mouseover', function(e) { 
	$(classnamesDesignDraftScrollbarCorner).addClass(strActive);
	$(classnamesDomDraftScrollbarCorner).addClass(strActive);
	e.stopPropagation();
	e.preventDefault();
}).on('mouseout', function() {
	$(classnamesDesignDraftScrollbarCorner).removeClass(strActive);
	$(classnamesDomDraftScrollbarCorner).removeClass(strActive);
});


OverlayScrollbars.extension("myBasicExtension", function(defaultOptions, framework, compatibility) { 
	var osInstance = this;
	var extInstance = { };
	
	var handleElmHorizontal;
	var handleElmVertical;
	
	extInstance.added = function() { 
		var instanceElements = osInstance.getElements();
		var scrollbarHorizontalHandle = instanceElements.scrollbarHorizontal.handle;
		var scrollbarVerticalHandle = instanceElements.scrollbarVertical.handle;
		var html = '<div style="height: 100%; width: 100%; background: red;"></div>';
		
		handleElmHorizontal = framework(html);
		handleElmVertical = framework(html);
		
		framework(scrollbarHorizontalHandle).append(handleElmHorizontal);
		framework(scrollbarVerticalHandle).append(handleElmVertical);
	}
	
	extInstance.removed = function() { 
		handleElmHorizontal.remove();
		handleElmVertical.remove();
	}
	
	return extInstance;
});

var basicExtensionTarget = $('#extensions-createextensions-basic-target').overlayScrollbars({ paddingAbsolute : true }).overlayScrollbars();
$('#extensions-createextensions-basic-target-add').on('click', function() { 
	basicExtensionTarget.addExt("myBasicExtension");
});
$('#extensions-createextensions-basic-target-remove').on('click', function() { 
	basicExtensionTarget.removeExt("myBasicExtension");
});


OverlayScrollbars.extension("myAdvancedExtension", function(defaultOptions, framework, compatibility) { 
	var osInstance = this;
	var extInstance = { };
	
	var trackElmHorizontal;
	var trackElmHorizontal2;
	var trackElmVertical;
	var trackElmVertical2;
	
	//add the divs after the extension has been added to a instance
	extInstance.added = function(options) { 
		//extend the defaultOptions with the passed options
		//to determine the correct color
		var parsedOptions = framework.extend(true, { }, defaultOptions, options); 
		var instanceElements = osInstance.getElements();
		var scrollbarHorizontalHandle = instanceElements.scrollbarHorizontal.track;
		var scrollbarVerticalHandle = instanceElements.scrollbarVertical.track;
		var html = '<div style="height: 100%; width: 100%; top: 0; left: 0; position: absolute;"></div>';
		var sInfo = osInstance.scroll();
		
		trackElmHorizontal = framework(html).css({
			background : parsedOptions.color,
			width : sInfo.handleOffset.x
		});
		trackElmHorizontal2 = framework(html).css({
			background : parsedOptions.color,
			width : sInfo.trackLength.x - (sInfo.handleOffset.x + sInfo.handleLength.x),
			left : sInfo.handleOffset.x + sInfo.handleLength.x
		});
		trackElmVertical = framework(html).css({
			background : parsedOptions.color,
			height : sInfo.handleOffset.y
		});
		trackElmVertical2 = framework(html).css({
			background : parsedOptions.color,
			height : sInfo.trackLength.y - (sInfo.handleOffset.y + sInfo.handleLength.y),
			top : sInfo.handleOffset.y + sInfo.handleLength.y
		});

		framework(scrollbarHorizontalHandle).append([trackElmHorizontal, trackElmHorizontal2])
		framework(scrollbarVerticalHandle).append([trackElmVertical, trackElmVertical2]);
	}
	
	//remove the divs after the extension has been removed from a instance
	extInstance.removed = function() { 
		trackElmHorizontal.remove();
		trackElmHorizontal2.remove();
		trackElmVertical.remove();
		trackElmVertical2.remove();
	}
	
	//hide the custom divs during scrolling
	extInstance.on = function(callbackName, args) {
		switch(callbackName) {
			case "scroll":
				var sInfo = osInstance.scroll();
		
				trackElmHorizontal.css({
					width : sInfo.handleOffset.x
				});
				trackElmHorizontal2.css({
					width : sInfo.trackLength.x - (sInfo.handleOffset.x + sInfo.handleLength.x),
					left : sInfo.handleOffset.x + sInfo.handleLength.x
				});
				trackElmVertical.css({
					height : sInfo.handleOffset.y
				});
				trackElmVertical2.css({
					height : sInfo.trackLength.y - (sInfo.handleOffset.y + sInfo.handleLength.y),
					top : sInfo.handleOffset.y + sInfo.handleLength.y
				});
				break;
		}
	}
	
	//a custom method which changes the colors of the added divs
	extInstance.changeColor = function(color) {
		trackElmHorizontal.css("background", color);
		trackElmHorizontal2.css("background", color);
		trackElmVertical.css("background", color);
		trackElmVertical2.css("background", color);
	}
	
	return extInstance;
}, { //defaultOptions:
	color : "orange"
});

var advancedExtensionTarget = $('#extensions-createextensions-advanced-target').overlayScrollbars({ 
	paddingAbsolute : true,
	scrollbars : { 
		clickScrolling : true
	}
 }).overlayScrollbars();
$('#extensions-createextensions-advanced-target-add').on('click', function() { 
	advancedExtensionTarget.addExt("myAdvancedExtension");
});
$('#extensions-createextensions-advanced-target-add-pink').on('click', function() { 
	advancedExtensionTarget.addExt("myAdvancedExtension", { color : "DodgerBlue" });
});
$('#extensions-createextensions-advanced-target-changeColor').on('click', function() { 
	try {
		advancedExtensionTarget.ext("myAdvancedExtension").changeColor("Crimson");
	} catch(ex) { 
		console.error(ex); 
	}
});
$('#extensions-createextensions-advanced-target-changeColor-two').on('click', function() { 
	try {
		advancedExtensionTarget.ext("myAdvancedExtension").changeColor("GreenYellow");
	} catch(ex) { 
		console.error(ex); 
	}
});
$('#extensions-createextensions-advanced-target-remove').on('click', function() { 
	advancedExtensionTarget.removeExt("myAdvancedExtension");
});