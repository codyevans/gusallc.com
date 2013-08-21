
// add remove scroll on header
$(window).scroll(function(){
	
	if($(window).scrollTop() <= 20){
	  $('.main-header').removeClass('scroll')
	}else{
	  $('.main-header').addClass('scroll')
	}

});


// mobile nav 
function mobileNav() {

	var btn = $('#mobile-nav-btn'),
		header = $('.main-header');

	enquire.register("(max-width: 820px)", {

		match: function() {

			btn.click(function(e) {
				$('.test').toggleClass('open-test');
				e.preventDefault();
			});

		},

		unmatch: function() {

			$('.test').removeClass('open-test');

			$('#mobile-nav-btn').click(function(e) {
				$('.test').toggleClass('open-test');
				e.preventDefault();
			});

		}

	});

};

// run function
mobileNav();

