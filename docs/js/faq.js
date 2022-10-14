$('#faq-click-scrolling-target').overlayScrollbars({ resize : 'both', paddingAbsolute : true, scrollbars : { clickScrolling : true }});
$('#faq-scrollbar-outside-absolute-target').overlayScrollbars({ paddingAbsolute : true });
$('#faq-scrollbar-outside-relative-target').overlayScrollbars({ paddingAbsolute : false });

$('.split-table').each(function() { 
	var elm = $(this);
	var templateTable = elm.find('table').first();
	var sideHead = elm.find('.split-table-side-head').first();
	var sideBody = elm.find('.split-table-side-body').first();
	var mainHead = elm.find('.split-table-main-head').first();
	var mainBody = elm.find('.split-table-main-body').first();
	sideHead.append(templateTable.clone());
	sideBody.append(templateTable.clone());
	mainHead.append(templateTable.clone());
	mainBody.append(templateTable.clone());
	
	var osSideBody = sideBody.overlayScrollbars({ 
		paddingAbsolute : true,
		overflowBehavior : {
			x : 'hidden',
			y : 'hidden',
		},
		scrollbars : {
			visibility : 'hidden',
		}
	}).overlayScrollbars();
	var osMainHead = mainHead.overlayScrollbars({ 
		overflowBehavior : {
			x : 'hidden',
			y : 'hidden',
		},
		scrollbars : {
			visibility : 'hidden',
		}
	}).overlayScrollbars();
	var osMainBody = mainBody.overlayScrollbars({
		resize : 'v',
		paddingAbsolute : true,
		callbacks : {
			onHostSizeChanged : function(e) { 
				sideBody.css("height", e.height);
			},
			onScroll : function() {
				osMainHead.scroll({ x : this.scroll().position.x });
				osSideBody.scroll({ y : this.scroll().position.y });
			}
		}
	}).overlayScrollbars();
});
$('[data-tooltip]').each(function() { 
	var el = this;
	var tt =  $(this).find('.tooltip').first();
	tippy(this, { 
		html : tt[0],
		arrow : true,
		interactive: tt.find('a').length > 0,
	})
});

var githubApi = "https://api.github.com/";
var githubInfosTemplate = {
	overlayscrollbars : githubApi + "repos/kingsora/overlayscrollbars",
	simplebar : githubApi + "repos/Grsmto/simplebar",
	perfectscrollbar : githubApi + "repos/utatti/perfect-scrollbar",
	geminiscrollbar : githubApi + "repos/noeldelgado/gemini-scrollbar",
	nanoscrollerjs : githubApi + "repos/jamesflorentino/nanoScrollerJS",
	smoothscrollbar : githubApi + "repos/idiotWu/smooth-scrollbar",
	optiscroll : githubApi + "repos/albertogasparin/Optiscroll",
	nicescroll : githubApi + "repos/inuyaksa/jquery.nicescroll",
	malihu : githubApi + "repos/malihu/malihu-custom-scrollbar-plugin",
	jscrollpane : githubApi + "repos/vitch/jScrollPane"
}
var pageCache = window.localStorage;
var pageCacheName = hasher.getURL();
var pageCacheGithubProperty = "github";
var cache = pageCache ?  JSON.parse(pageCache.getItem(pageCacheName)) : null;
var refreshGithubCache = true;
var refreshGithubCacheMinsDiff = 60 * 12;
var githubCache = { };

if(cache !== null) {
	if(cache.hasOwnProperty(pageCacheGithubProperty)) {
		githubCache = cache[pageCacheGithubProperty];
		refreshGithubCache = dayjs().diff(githubCache.timestamp, 'minutes', true) > refreshGithubCacheMinsDiff;
	}
}

if(refreshGithubCache) {
	var myArr = [ ];
	$.each(githubInfosTemplate, function(key, value) { 
		myArr.push($.get({ 
			url : value, 
			success : function(data) { 
				githubCache[key] = data;
				
			},
			error : function(e) { 
				githubCache[key] = githubCache[key];
			}
		})); 
	});
	
	$.when.apply($, myArr).always(function() { 
		githubCache.timestamp = dayjs().valueOf();
		if(pageCache) {
			var obj = { };
			obj[pageCacheGithubProperty] = githubCache;
			pageCache.setItem(pageCacheName, JSON.stringify(obj));
		}
		insertGithubData(githubCache);
	})
}
else {
	insertGithubData(githubCache);
}
function insertGithubData(data) {
	var unknown = '<i class="mdi mdi-help-circle txtc-light"></i>';
	$('#github-infos-timestamp').html(dayjs(data.timestamp).format('MMMM DD, YYYY - HH:mm'))
	$.each(data, function(key, value) { 
		if($.isPlainObject(value)) {
			$('.' + key + '-stars').html(value.stargazers_count);
			$('.' + key + '-open-issues').html(value.open_issues_count);
			$('.' + key + '-created').html(dayjs().diff(dayjs(value.created_at), 'months') + " months ago");
			$('.' + key + '-archived').html(value.archived ? "Yes" : "No");
			var license = value.license;
			if(license && value.license.spdx_id != null)
				license = value.license.spdx_id;
			else
				license = unknown;
			$('.' + key + '-license').html(license);
		}
		else {
			$('.' + key + '-stars').html(unknown);
			$('.' + key + '-open-issues').html(unknown);
			$('.' + key + '-created').html(unknown);
			$('.' + key + '-archived').html(unknown);
			$('.' + key + '-license').html(unknown);
		}
	});
	$('#faq-comparison-table .mdi.mdi-loading.mdi-spin').each(function() { 
		var el = this;
		var parent = $(el).parent();
		parent.html(unknown);
	});
}
$('.split-table-expand').on('click', function() { 
	var elm = $(this);
	var icon = elm.find('i').first();
	if(icon.hasClass('mdi-arrow-expand')) {
		icon.removeClass('mdi-arrow-expand').addClass('mdi-arrow-collapse');
		$('#faq-comparison-table').parent().css({ display: 'table', width : 'auto', margin : '0px auto' });
	}
	else {
		icon.removeClass('mdi-arrow-collapse').addClass('mdi-arrow-expand');
		$('#faq-comparison-table').parent().css({ display: '', width : '', margin : '' });
	}
});

