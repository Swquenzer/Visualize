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

var spinner = $('.spinner');

$(document).ready(function() {
	/////////////////////////////////////////////////////////////////////////////////////
	// Initialize

	//Random

	//Page history stack
	var pageHistory = [];
	$('#back-btn').on("click", function() {
		previousPage();
	});

	/////////////////////////////////////////////////////////////////////////////////////
	//Initialize Query Engine 1
	//view: rewards, badges, metrics, etc
	//viewMode: type, userList, user
	//viewName: string value of first td in selected row ('swquenzer' or 'saving habits')

	var options = {
		view: "rewards",
		target: "qe-dashboard",
		//type: "table",
		viewMode: "type",
		graph: true,
		visible: true,
		completed: true
	};
	options2 = {
		view: "",
		target: "qe-messaging",
		//type: "table",
		viewMode: "type",
		graph: false,
		visible: false,
		completed: true
	};
	options3 = {
		view: "questions",
		target: "qe-questions",
		viewMode: "type",
		graph: false,
		visible: true,
		completed: true

	};
	options4 = {
		view: "responses",
		target: "qe-responses",
		viewMode: "type",
		graph: false,
		visible: true,
		completed: true

	};
	qe = [];
	qe[0] = new QueryEngine(options);
	qe[3] = new QueryEngine(options3);
	//Make all non-current sections (non dashboard) display:none
	$('.content').not('.current').hide();

	/////////////////////////////////////////////////////////////////////////////////////
	// Page Functionality

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

	//Initialize event handlers for specific pages here
	function getPage(section, pageName) {
		spinner.fadeIn(300);
		$.get(pageName + ".html", function(data) {
			spinner.fadeOut(300);
			//Add page to html
			section[0].innerHTML = data;
			//Custom page events & functionality
			if(pageName === 'messaging') {
				//Initialize messaging query engine
				qe[1] = new QueryEngine(options2);
				//Add recipients if necessary
				addSelectedRecipients();
			} else if(pageName === 'questions') {
				//Initialize question and response query engines
				qe[2] = new QueryEngine(options3);
				qe[3] = new QueryEngine(options4);
				qe[2].initialize('questions');
				//qe[3] = new QueryEngine(options4);
			}
			//Display new page
			section.delay('slow').slideDown('slow', function() {
				$(window).resize();
			});
		});
	}
	//Main page transition
	changePage = function(section, newPage, history) {
		var current = $('.option.current');
		//Get plaintext name of new page (string)
		var newPageName = newPage.attr('class').substr(0, newPage.attr('class').indexOf(' '));
		//Collapse TWAG module
		var twag = $('.twag-body');
		if(twag.hasClass('down')) {
			$('.twag-header h2').css("font-size", "24px");
			$('.twag-toggle').fadeOut(100);
			twag.slideUp("slow", function() {
				$('.twag-footer img').attr("src", "images/down.png");
			});
		}
		if(!history) {
			$('#back-btn').toggleClass('disabled', false);
			//Add previously viewed page to pageHistory stack
			pageHistory.push(current.attr('class').substr(0,current.attr('class').indexOf(' ')));
		}
		//Remove left border marking current page (sidebar)
		$('.option').toggleClass('current', false);
		//Then mark the new page as current (sidebar)
		$(newPage).toggleClass('current', true);
		//But only change page if it's a new page
		if(!section.hasClass('current')) {
			//Hide the current page
			$('.content.current').toggleClass('current').slideUp('slow');
			//Mark the new section as current page (content)
			section.toggleClass('current');
			//If section is being loaded for the first time, $.GET it (and show it)!
			if(section[0].innerHTML === "") {
				getPage(section, newPageName);
			} else {
				//Otherwise simply display new current page
				section.delay('slow').slideDown('slow', function() {
					$(window).resize();
				});
			}
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Sidebar Functionality

	var isIn = true;
	var isOut = false; 

	var slideOut = function() {
		isIn = false;
		$('.left_sidebar').toggleClass('open', true);
		$('#main').toggleClass('shrink', true);
		//$('.left_sidebar h2').delay(100).fadeIn(200);
		var len = $('.left_sidebar section').length;
		$('.left_sidebar section').each(function(i) {
			$(this).delay(100*i+300).slideDown(100, function() {
				$(window).resize();
				if(i === len-1) {
					//is now fully out
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
			$('.left_sidebar section').show().hide(100, function() {
				isIn = true;
				$(window).resize();

		console.log('in');
			});
			isOut = false;
		});
	}

	//Slide in/out events
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

	//Button hover effects
	$('.left_sidebar').hover(function() {
		if(isIn) $('.icon-menu img').css("opacity", 1);
	}, function() {
		if(isIn) $('.icon-menu img').css("opacity", .8);
	});

	//Section accordian events
	$('.left_sidebar').on("click", ".header", function() {
		$(this).nextUntil($('.header')).slideToggle('fast');
		$(this).toggleClass('up');
	});

	//On page load
	slideOut();

	$('.icon-menu img').toggleClass('invisible');

	/////////////////////////////////////////////////////////////////////////////////////
	// Page links

	$('.option.dashboard').on("click", function() {
		var section = $('.content.dashboard');
		changePage(section, $(this));
	});
	$('.option.messaging').on("click", function() {
		var section = $('.content.messaging');
		changePage(section, $(this));
	});
	$('.option.userView').on("click", function() {
		var section = $('.content.userView');
		changePage(section, $(this));
	});
	$('.option.registration').on("click", function() {
		var section = $('.content.registration');
		changePage(section, $(this));
	});
	$('.option.clientSettings').on("click", function() {
		var section = $('.content.clientSettings');
		changePage(section, $(this));
	});
	$('.option.questions').on("click", function() {
		var section = $('.content.questions');
		changePage(section, $(this));
	});

	/////////////////////////////////////////////////////////////////////////////////////
	// This Week at a Glance

	if(dev) {
		var twag = $('.twag-body');
		$('.twag-header h2').css("font-size", "24px")
		twag.slideUp("slow", function() {
			$('.twag-footer img').attr("src", "images/down.png");
		});
	}

	$('.twag-footer').on("click", function() {
		var twag = $('.twag-body');
		if(twag.hasClass('down')) {
			$('.twag-header h2').css("font-size", "24px")
			$('.twag-toggle').fadeOut(100);
			twag.slideUp("slow", function() {
				$('.twag-footer img').attr("src", "images/down.png");
			});
		} else {
			$('.twag-header h2').css("font-size", "36px");
			$('.twag-toggle').fadeIn(100);
			twag.slideDown("slow", function() {
				$('.twag-footer img').attr("src", "images/up.png");
			});
		}
		twag.toggleClass("down","up");
	});
});

/////////////////////////////////////////////////////////////////////////////////////
// Messaging

recipients = [];
selectAll = true;
$('.content.messaging').on("click", '.recipient', function() {
	removeRecipient(this);
});
function selectRecipient(row, single) {
	if(single) {
	    //If it's already selected, don't add it again!
	    if(!$(row).hasClass('selected')) {
	        //Select
	        $(row).toggleClass('selected', true);
	    } else {
	    	//Deselect
	    	$(row).toggleClass('selected', false);
	    }
	} else {
		if(selectAll) $(row).toggleClass('selected', true);
			else   $(row).toggleClass('selected', false);
	}
}
function addRecipient(row) {
	var duplicate = false;
	var email = $(row).find('td')[3].innerHTML;
	//Check each current recipient for duplicate email
	$('#recipient-list .recipient').each(function() {
		if(this.innerHTML === email) {
			duplicate = true;
		}
	});
	if(!duplicate) {
	    //Add email to recipient array
	    recipients.push(email);
	    //And add to the on-page list
	    $('#recipient-list').append("<span class='recipient'>" + email + "</span>");
	}
}
function addSelectedRecipients() {
	if(recipients.length > 0) {
		for(var i=0; i<recipients.length; i++) {
			$('#recipient-list').append("<span class='recipient'>" + recipients[i] + "</span>");
		}
	}
}
function addAllRecipients(rows) {
	rows.each(function(i, el) {
		addRecipient(el);
	});
}
function removeRecipient(email) {
	var index = recipients.indexOf(email.innerHTML);
	recipients.splice(index, 1);
	$(email).remove();
}


/////////////////////////////////////////////////////////////////////////////////////
// Modules

//Module footer accordian
$('body').on('click', '.module-footer', function() {
	var that = this;
	var body = $(this).siblings().last();
	if(body.hasClass('down')) {
		body.slideUp('slow', function() {
			$(that).find('img').attr('src', 'images/down.png');
		});
	} else {
		body.slideDown('slow', function() {
			$(that).find('img').attr('src', 'images/up.png');
			$(window).resize();
		});
	}
	body.toggleClass("down","up");
});

/////////////////////////////////////////////////////////////////////////////////////
// Registration

$('.reg-form .affiliation-list').on("click", "input:checked", function() {
	var subjectList = $(this).siblings().next();
	subjectList.show();
});
$('.reg-form .affiliation-list').on("click", "input:not(:checked)", function() {
	var subjectList = $(this).siblings().next();
	subjectList.hide();
});

/////////////////////////////////////////////////////////////////////////////////////
// Client Settings

$('#main').on("click", "#special-permissions li", function() {
	console.log($(this).find('span').toggleClass('selected'));
	$(this).find('span').toggleClass('.selected');
});
