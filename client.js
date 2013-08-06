var $ = require('jquery-browserify');
	require('pretty-photo');

var photos = require('./photos/pub.json');

function loadMore() {
	var album = photos.shift();

	var section = $('<div></div>')
	.attr('id', 'section')
	.appendTo($('#content'));
	
	$('<div></div>')
	.addClass('circle')
	.appendTo(section);

	var content = $('<div></div>')
	.attr('id', 'right')
	.appendTo(section);

	if(album["date"] != undefined) {
		$('<span>'+album["date"]+'</span><br>')
		.addClass('title3')
		.appendTo(content);
	}

	$('<span>'+album["title"]+'</span><br>')
	.addClass('title2')
	.appendTo(content);

	for(id in album["photos"]) {
		$('<a href="/photos/'+album["photos"][id]+'/big" width="80"><img src="/photos/'+album["photos"][id]+'/thumb" /></a>')
		.prettyPhoto()
		.appendTo(content);
	}
	
	$(window).scroll(onScroll);
}

function onScroll(){
	if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
		$(window).unbind('scroll');
		if(photos.length > 0) loadMore();
	}
}

$(document).ready(function() {
	loadMore();
});
