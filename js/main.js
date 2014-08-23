//main.js
$(document).ready(function() {
	/*
	** Initialize
	*/
	//Make first stat animate out
	//$('.stats-mod:nth-child(1)').toggleClass('stats-mod-open').children(2).toggleClass('light-green');
	//Slide the remaining stats down one at a time
	$('.stats-mod').not(':nth-child(1)').toggleClass('invisible').each(function(i) {
		$(this).delay(200*i).slideDown(200);
	});
	$('#content.current').show();

	//Initialize Tablesorter
	$(".qt table").tablesorter();
	////////////////////////////
	//Initialize Query Engine 1
	var qe = [];
	qe[0] = new QueryEngine("rewards");

	/*
	** Sidebar Module 
	*/
	var isIn = true;
	var isOut = false; 

	var slideOut = function() {
		isIn = false;
		$('.left_sidebar').toggleClass('open', true);
		$('#main').toggleClass('shrink', true);
		$('.left_sidebar h2').delay(100).fadeIn("200");
		var len = $('.left_sidebar section').length;
		$('.left_sidebar section').each(function(i) {
			$(this).delay(100*i+300).slideDown(100, function() {
				if(i === len-1) {
					isOut = true;
				}
			});
		});
	}
	var slideIn = function() {
		isOut = false;
		$('.left_sidebar h2').fadeOut(200, function() {
			$('#main').toggleClass('shrink', false);
			$('.left_sidebar').toggleClass('open', false);
			var count = 0;
			$('.left_sidebar section').slideUp(300, function() {
				//is now fully in
				isIn = true;
			});
			isOut = false;
		});
	}
	$('.left_sidebar').on("click", function() {
		if(isIn) {
			slideOut();
			$('.icon-menu img').toggleClass('invisible');
		}
	});
	$('.icon-menu img').on("click", function() {
		if(isOut) {
			slideIn();
			$('.icon-menu img').toggleClass('invisible');
		}
	});
	$('.left_sidebar').hover(function() {
		if(isIn) $('.icon-menu img').css("opacity", 1);
	}, function() {
		if(isIn) $('.icon-menu img').css("opacity", .8);
	});
	/*
	** Statistics Drawer
	
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
	*/
	$('.option.dashboard').on("click", function() {
		var that = $('.content.dashboard');
		if(!that.hasClass("current")) {
			$('.content.current').toggleClass('current').slideUp('slow');
			that.toggleClass('current');
			that.delay('slow').slideDown('slow');
		}
	});
	$('.option.settings').on("click", function() {
		var that = $('.content.settings');
		if(!that.hasClass("current")) {
			$('.content.current').toggleClass('current').slideUp('slow');
			that.toggleClass('current');
			that.delay('slow').slideDown('slow');
		}
	})

	/* TWAG Slider */
	$('.twag-footer').on("click", function() {
		var twag = $('.twag-body');
		if(twag.hasClass('down')) {
			$('.twag-header h2').css("font-size", "24px")
			twag.slideUp("slow", function() {
				$('.twag-footer img').attr("src", "images/down.png");
			});
		} else {
			$('.twag-header h2').css("font-size", "36px")
			twag.slideDown("slow", function() {
				$('.twag-footer img').attr("src", "images/up.png");
			});
		}
		twag.toggleClass("down","up");
	});

	window.addStat = function(stat, description) {
		console.log("IN");
		var html = '<div class="stats-mod"><span class="value">' + stat + '</span><span class="description">' + description + '</span></div>';
		$('#stats').append(html);
	}
	window.thing = function() {
		$('.stats-mod:last').clone(true, true).appendTo('#stats');
	}
});