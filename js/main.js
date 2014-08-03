//main.js
$(document).ready(function() {
	/*
	** Initialize
	*/
	//Make first stat animate out
	$('.stats-mod:nth-child(1)').toggleClass('stats-mod-open').children(2).toggleClass('light-green');
	//Slide the remaining stats down one at a time
	$('.stats-mod').not(':nth-child(1)').toggleClass('invisible').each(function(i) {
		$(this).delay(200*i).slideDown(200);
	});

	/*
	** Sidebar Module 
	*/
	var hovering = false;
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
					if(!hovering) {
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
			hovering = true;
			slideOut();
		}
	}, function() {
		hovering = false;
		if(isOut) {
			slideIn();
			isOut = false;
		}
	});

	/*
	** Statistics Drawer
	*/
	$('.stats-mod').on("click", function() {
		//If drawer is not open, move to top
		if(!$(this).hasClass('stats-mod-open')) {
			var elements = $(this).siblings();
			elements.detach().appendTo($(this).parent());
		}
		//Close other open drawer if possible
		$('.stats-mod-open').children(2).toggleClass('light-green');
		$('.stats-mod-open').toggleClass('stats-mod-open');
		//Open or close drawer
		$(this).toggleClass('stats-mod-open');
		$(this).children(2).toggleClass('light-green');
	});


	window.thing = function() {
		$('#content').append(document.properties);
	}
});