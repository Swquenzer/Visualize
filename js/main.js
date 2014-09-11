//main.js
//Prototypes
var dev = false;
//Captializes first letter of string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
//Adds a space in between camel-case words
String.prototype.separate = function() {
	return this.replace(/([A-Z]+)/g, " $1");
};

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

	//Page history stack
	var pageHistory = [];
	$('#back-btn').on("click", function() {
		previousPage();
	});

	////////////////////////////
	//Initialize Query Engine 1
	//view: rewards, badges, metrics, etc
	//viewMode: type, userList, user
	//viewName: string value of first td in selected row ('swquenzer' or 'saving habits')
	var options = {
		view: "rewards",
		target: "qe-dashboard",
		type: "table",
		viewMode: "type",
		graph: true,
		visible: true
	};
	options2 = {
		view: "",
		target: "qe-messaging",
		type: "table",
		viewMode: "type",
		graph: false,
		visible: false
	};
	qe = [];
	qe[0] = new QueryEngine(options);
	qe[0].initialize();
	qe[1] = new QueryEngine(options2);

	//Make all non-current sections (non dashboard) display:none
	$('.content').not('.current').hide();
	/*
	** Main Page
	*/
	function previousPage() {
		if(pageHistory.length === 0) {
			$('#back-btn').toggleClass('disabled', true);
		} else if(pageHistory.length === 1) {
			var page = pageHistory.pop();
			changePage($('.content.' + page), $('.option.' + page), true);
			$('#back-btn').toggleClass('disabled', true);
		} else {
			var page = pageHistory.pop();
			changePage($('.content.' + page), $('.option.' + page), true);
		}
	}

	//Main page transition
	changePage = function(section, newPage, history) {
		var current = $('.option.current');
		if(!history) {
			$('#back-btn').toggleClass('disabled', false);
			//Add previously viewed page to pageHistory stack
			pageHistory.push(current.attr('class').substr(0,current.attr('class').indexOf(' ')));
		}
		$('.option').toggleClass('current', false);
		$(newPage).toggleClass('current', true);
		if(!section.hasClass('current')) {
			$('.content.current').toggleClass('current').slideUp('slow');
			section.toggleClass('current');
			section.delay('slow').slideDown('slow', function() {
				//Refresh screen width
				$(window).resize();
			});
		}
	}

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
					//Forces resize of charts to match container width
					$(window).resize();
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

	//On page load
	slideOut();
	$('.icon-menu img').toggleClass('invisible');

	/*** --- Left Sidebar Controls --- ***/
	$('.option.dashboard').on("click", function() {
		var section = $('.content.dashboard');
		changePage(section, this);
	});
	$('.option.messaging').on("click", function() {
		var section = $('.content.messaging');
		changePage(section, this);
	});
	$('.option.userView').on("click", function() {
		var section = $('.content.userView');
		changePage(section, this);
	});
	$('.option.registration').on("click", function() {
		var section = $('.content.registration');
		changePage(section, this);
	});

	if(dev) {
		var twag = $('.twag-body');
		$('.twag-header h2').css("font-size", "24px")
		twag.slideUp("slow", function() {
			$('.twag-footer img').attr("src", "images/down.png");
		});
	}
	

	//twag.toggleClass("down","up");
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
	
	/* Messaging */
    recipients = [];

    /* Modules */
    moduleAccordian = function() {
    	$('.module-footer').on('click', function() {
	    	var that = this;
	    	var body = $(this).siblings().last();
	    	if(body.hasClass('down')) {
	    		body.slideUp('slow', function() {
	    			$(that).find('img').attr('src', 'images/down.png');
	    		});
	    	} else {
	    		body.slideDown('slow', function() {
	    			$(that).find('img').attr('src', 'images/up.png');
	    		});
	    	}
	    	body.toggleClass("down","up");
	    });
    };
    //Activate Initial Module Accordian//
	moduleAccordian();
});