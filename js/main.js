
// global variables
var header = $('.main-header');


// add remove scroll on header
$(window).scroll(function(){
	
	if($(window).scrollTop() <= 20){
	  header.removeClass('scroll');
	}else{
	  header.addClass('scroll');
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

