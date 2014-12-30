// ======================================================================
function fixDrawErrors () {
	//refresh page on browser resize
	$(window).bind('resize', function(e) {

	  if (window.RT) {
	  	clearTimeout(window.RT);
	  }
	  window.RT = setTimeout(function() {
	    this.location.reload(false); /* false to get page from cache */
	  }, 200);
	});
	
	$('aside').height( $(".main").height() );
	$('section').height( $('aside').height() );
	fixWidthEqual( $('#wExp') );
	fixWidthEqual( $('#wAdvExp') );
	fixWidthOuterNumberPad( $('#outerNumberPad') );
	fixWidthNumberPad( $('#wNumPad') );
}
// ======================================================================
function fixWidthEqual (parent) {

	var parentWidth = $(parent)[0].getBoundingClientRect().width;
	var parentBorder = 2;

	var childrenNumber = $(parent).children().length;

	var childWidth = (parentWidth - parentBorder - childrenNumber) / childrenNumber;

	$(parent).children().each(function (argument) {
		$(this).width( childWidth );
	});
}
// ======================================================================
function fixWidthNumberPad (parent) {// divaid by 3

	var parentWidth = $(parent)[0].getBoundingClientRect().width;
	var parentBorder = 0;

	var childrenNumber = 3;

	var childWidth = (parentWidth  - parentBorder - childrenNumber) / childrenNumber;

	$(parent).children().each(function (argument) {
		$(this).width( childWidth );
	});
}
// ======================================================================
function fixWidthOuterNumberPad (parent) {// divaid by 3

	var parentWidth = $(parent)[0].getBoundingClientRect().width;
	var parentBorder = 1;

	var childrenNumber = 2;

	var childWidth = (parentWidth  - parentBorder - childrenNumber) / 4;
	var childWidthFirst = childWidth * 3 + parentBorder;

	var children = $(parent).children();

	$(parent).children().each(function (index) {
		if (index == 0) {
			$(this).width( childWidthFirst );
		} else {
			$(this).width( childWidth );
		}
	});
}
// ======================================================================