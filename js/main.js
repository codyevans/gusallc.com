
// global variables
var header = $('.main-header'),
	intro = $('.intro');


// add remove scroll on header
$(window).scroll(function(){
	
	if($(window).scrollTop() <= 20){

	  header.removeClass('scroll');
	  //intro.removeClass('onScroll');

	}else{

	  header.addClass('scroll');
	  //intro.addClass('onScroll');

	}

});


// mobile nav 
function mobileNav() {

	var btn = $('#mobile-nav-btn');

	enquire.register("(max-width: 820px)", {

		match: function() {

			btn.click(function(e) {
				header.toggleClass('open');
				e.preventDefault();
			});

		},

		unmatch: function() {

			header.removeClass('open');

			btn.click(function(e) {
				header.toggleClass('open');
				e.preventDefault();
			});

		}

	});

};

// run function
mobileNav();


// basic slider - homepage
 $('#intro-slider').bjqs({
 	'width' : 1000,
 	'height' : 300,
    'responsive' : true,
    'showcontrols' : false,
    'showmarkers' : false
});


 // smooth scroll
 $('a#top').smoothScroll();
 $('a#scroll-to-content').smoothScroll({offset: -120});







