//main.js
$(document).ready(function() {
	var canSlideOut = true;
	var canSlideIn = false;
	$('.left_sidebar').hover(function() {
		//Mouseenter
		if(canSlideOut) {
			$(this).toggleClass('hover');
			$('#main').toggleClass('shrink');
			$('.left_sidebar h2').fadeIn("500");
			var len = $('.left_sidebar section').length;
			$('.left_sidebar section').each(function(i) {
				$(this).delay(200*i+200).slideDown(200, function() {
					if(i === len-1) {
						canSlideIn = true;
					}
				});
			});
		}
	}, function() {
		//Mouseleave
		if(canSlideIn) {
			canSlideIn = false;
			var that = $(this);
			$('.left_sidebar h2').fadeOut(200, function() {
				$('.left_sidebar section').slideToggle(200);
				$('#main').toggleClass('shrink');
				that.toggleClass('hover');
				canSlideOut = true;
			});
		}
	});
});