var githubApi = "https://api.github.com/";
var githubOSExtensionsSearchQuery = "search/repositories?q=topic:overlayscrollbars-extension+language:javascript+language:typescript";

var approvedExtensions = {
	"OverlayScrollbarsChat" : { },
	"os-scroll-chain" : { }
}

var pageCache = window.localStorage;
var pageCacheName = hasher.getURL();
var pageCacheGithubProperty = "github";
var cache = pageCache ?  JSON.parse(pageCache.getItem(pageCacheName)) : null;
var refreshGithubCache = true;
var refreshGithubCacheMinsDiff = 60;
var githubCache = { };

if(cache !== null) {
	if(cache.hasOwnProperty(pageCacheGithubProperty)) {
		githubCache = cache[pageCacheGithubProperty];
		refreshGithubCache = dayjs().diff(githubCache.timestamp, 'minutes', true) > refreshGithubCacheMinsDiff;
	}
}
if(refreshGithubCache) {
	var deferred = $.get({ 
		url : githubApi + githubOSExtensionsSearchQuery, 
		success : function(data) { 
			var filteredCache = { 
				extensions : [ ]
			};
			$.each(data.items, function(key, value) {
				var approved = false;
				$.each(approvedExtensions, function(approvedKey, approvedObj) { 
					if(approvedKey === value.name) {
						approved = true;
						return false;
					}
				});
				if(approved)
					filteredCache.extensions.push(value);
			});
			githubCache = filteredCache;
		},
		error : function(e) { 
			githubCache = githubCache;
		}
	});
	$.when(deferred).always(function() { 
		githubCache.timestamp = dayjs().valueOf();
		if(pageCache) {
			var obj = { };
			obj[pageCacheGithubProperty] = githubCache;
			pageCache.setItem(pageCacheName, JSON.stringify(obj));
		}
		insertGithubData(githubCache);
	});
}
else {
	insertGithubData(githubCache);
}
function insertGithubData(data) {
	var count = $('#extensions-count');
	var refreshed = $('#extensions-refreshed');
	var list = $('#extensions-list');
	
	if(!data || $.isEmptyObject(data) || data.extensions === undefined || data.extensions.length < 1) {
		count.text('No Extensions found');
	}
	else {
		refreshed.text('Refreshed on: ' + dayjs(data.timestamp).format('MM.DD.YYYY : HH:mm:ss'));
		count.text(data.extensions.length + ' Extensions found:');
		
		$.each(data.extensions, function(index, value) {
			var itemTemplate = '<div class="extensions-list-item">';
			
			itemTemplate += '<div class="extensions-list-item-name">';
			itemTemplate += 	'<a href="' + value.html_url + '" target="_blank">' + value.name + '</a>';
			itemTemplate += '</div>';
			itemTemplate += '<div class="extensions-list-item-description">';
			itemTemplate += 	value.description;
			itemTemplate += '</div>';
			itemTemplate += '<div class="extensions-list-item-author">';
			itemTemplate += 	'<img src="' + value.owner.avatar_url + '"><a href="' + value.owner.html_url + '" target="_blank">' + value.owner.login + '</a>';
			itemTemplate += '</div>';
			itemTemplate += '<div class="extensions-list-item-infos">';
			itemTemplate += 	'<div>';
			itemTemplate += 		'Updated ' + dayjs(value.updated_at).format('MM.DD.YYYY');
			itemTemplate += 	'</div>';
			itemTemplate += 	'<div>';
			itemTemplate += 		value.stargazers_count + ' stars';
			itemTemplate += 	'</div>';
			itemTemplate += '</div>';

			itemTemplate += '</div>';

			list.append(itemTemplate);
		});
	}
}