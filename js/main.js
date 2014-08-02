//main.js
$(document).ready(function() {
	var hover = false;
	var isIn = true;
	var isOut = false;

	var slideOut = function() {
		isIn = false;
		$('.left_sidebar').toggleClass('hover', true);
		$('#main').toggleClass('shrink', true);
		$('.left_sidebar h2').fadeIn("200");
		var len = $('.left_sidebar section').length;
		$('.left_sidebar section').each(function(i) {
			$(this).delay(200*i+300).slideDown(200, function() {
				if(i === len-1) {
					isOut = true;
					//Is now fully out
					if(!hover) {
						slideIn();
					}
				}
			});
		});
	}
	var slideIn = function() {
		isOut = false;
		$('.left_sidebar h2').fadeOut(200, function() {
			$('#main').toggleClass('shrink', false);
			$('.left_sidebar').toggleClass('hover', false);
			var count = 0;
			$('.left_sidebar section').slideUp(300, function() {
				//is now fully in
				isIn = true;
			});
			isOut = false;
		});
	}

	$('.left_sidebar').hover(function() {
		if(isIn) {
			hover = true;
			slideOut();
		}
	}, function() {
		hover = false;
		if(isOut) {
			slideIn();
			isOut = false;
		}
	});
	window.thing = function() {
		$('#content').append(document.properties);
	}
});