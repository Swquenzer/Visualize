/*
** Created By: Stephen Quenzer
** Creation Date: 
*/
/* This Week At a Glance (TWAG) Module */

/* ============================================================
===============================================================
== Chart settings, options, and themes ========================
===============================================================
============================================================ */

/* ============================================================
    Default Theme
============================================================ */
var defaultTheme = {
  colors: ['#2f7ed8', '#0d233a', '#8bbc21', '#910000', '#1aadce', '#492970',
        '#f28f43', '#77a1e5', '#c42525', '#a6c96a'],
   chart: {
      backgroundColor: '#fff',
      borderWidth: 0,
      plotBackgroundColor: '#fff',
      plotShadow: false,
      plotBorderWidth: 0
   },
   title: {
      style: {
            color: '#274b6d',//#3E576F',
            fontSize: '16px'
      }
   },
   subtitle: {
      style: {
            color: '#4d759e'
       }
   },
   xAxis: {
      gridLineWidth: 0,
      lineColor: '#C0D0E0',
      tickColor: '#C0D0E0',
      labels: {
         style: {
            color: '#666',
            cursor: 'default',
            fontSize: '11px',
            lineHeight: '14px'
         }
      },
      title: {
         style: {
                color: '#4d759e',
                fontWeight: 'bold'
        }
      }
   },
   yAxis: {
      minorTickInterval: null,
      lineColor: '#C0D0E0',
      lineWidth: 1,
      tickWidth: 1,
      tickColor: '#C0D0E0',
      labels: {
         style: {
            color: '#666',
            cursor: 'default',
            fontSize: '11px',
            lineHeight: '14px'
         }
      },
      title: {
         style: {
                color: '#4d759e',
                fontWeight: 'bold'
        }
      }
   },
   legend: {
      itemStyle: {
            color: '#274b6d',
            fontSize: '12px'
      },
      itemHoverStyle: {
         color: '#000'
      },
      itemHiddenStyle: {
         color: '#CCC'
      }
   },
   labels: {
      style: {
            color: '#3E576F'
        }
   },

   navigation: {
      buttonOptions: {
         theme: {
            stroke: '#CCCCCC'
         }
      }
   }
};

/* ============================================================
    Query Engine Graph Options
============================================================ */
var qeOptions = {
    chart: {
        renderTo: 'qe-graph'
    },
    title : {
        text: 'Query Engine Results',
        x: -20
    },
    subtitle: {
        text: 'rewards',
        x: -20
    },
    series: [{
        name: 'Rewards Earned',
        data: [10,12,9,18,16,28,28,32,29,43]
    }]
};

/* ============================================================
    This week at a glance
============================================================ */
var isBar = true;
var twagBarOptions = {
    chart: {
        renderTo: 'twag-chart',
        type: 'bar',
    },
    title: {
        text: 'User Engagement'
    },
    xAxis: {
        categories: ['Last Week', 'This Week', 'Next Week (trend)']
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    }
}
var twagLineOptions = {
    chart: {
        type: 'line',
        renderTo: 'twag-chart'
    },
    title: {
        text: 'User Engagement'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
        title: {
            text: 'Number of Users'
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true
            },
            enableMouseTracking: false
        }
    },
    series: [{
        name: 'Tokyo',
        data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    }, {
        name: 'London',
        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
    }]
};
// name: User-facing value
// dataTotal: Array containing 2 values: Total data from last week & Total data from this week
// dataNew: Array containing 2 values: New data from last week & New data from this week
var users = {
    name: 'Users'
};
var tasks = {
    name: 'Tasks Completed'
};
var goals = {
    name: 'Goals Completed'
};
var badges = {
    name: 'Badges Completed'
};
var rewards = {
    name: 'Rewards Completed'
};
//Calculate change in values from 3 weeks to 2 weeks ago ([0]) and 2 weeks to 1 week ago ([1])
function calculateNewData(option, total) {
    //Calculate total values
    option.dataTotal = [total[1],total[2]];
    option.dataNew = [total[1]-total[0], total[2]-total[1]];
}
function createTwagGraph(type, callback) {
    $.getJSON('twag.json', {}, function(json) {
        calculateNewData(users, json.results[0]);
        calculateNewData(tasks, json.results[1]);
        calculateNewData(goals, json.results[2]);
        calculateNewData(badges, json.results[3]);
        calculateNewData(rewards, json.results[4]);
        return callback(eval(type));
    }).error(function(error) {
        console.log("Error in getTwagData");
    });
}
function initializeTwag() {
    createTwagGraph('users', function(type) {
            //Options for bar graph
        twagBarOptions.yAxis = {
            min: 0,
            title: {
                text: 'Total ' + type.name
            }
        };
        twagBarOptions.series = [{
            name: 'New ' + type.name,
            data: type.dataNew
        }, {
            name: 'Total ' + type.name,
            data: type.dataTotal
        }];
        //Options for line graph

        function insertTableData(row, type) {
            tr.eq(row).find('td')[1].innerHTML = type.dataNew[0];
            tr.eq(row).find('td')[2].innerHTML = type.dataNew[1];
            tr.eq(row).find('td')[3].innerHTML = (((type.dataNew[1]-type.dataNew[0])/type.dataNew[0])*100).toFixed(1) + "%";
            if (type.dataNew[1] > type.dataNew[0])
                tr.eq(row).find('td').eq(3).addClass('light-green');
            else
                tr.eq(row).find('td').eq(3).addClass('red');
        }
        //Get twag table rows
        var tr = $('.twag-body tr').filter(':not(:first)');
        //Users
        insertTableData(0, users);
        insertTableData(1, tasks);
        insertTableData(2, goals);
        insertTableData(3, badges);
        insertTableData(4, rewards);
        //Create new bar chart

        twagGraph = (isBar === true) ? new Highcharts.Chart(twagBarOptions) : new Highcharts.Chart(twagLineOptions);
    });
}
//Chart-type toggle
$('.twag-header .twag-toggle').on("click", "img", function() {
    $('.twag-toggle img').toggleClass("current");
    $('#twag-chart')[0].innerHTML = "";
    isBar = !isBar;
    initializeTwag();
});
initializeTwag();

//On click event for controlling different engagement views
//New Users, Tasks Completed, Goals Completed, Badges Earned, Rewards Earned
function twagUpdate(type) {
    createTwagGraph(type, function(data) {
        if(isBar === true) {
            twagGraph.series[0].setData(data.dataNew, false);
            twagGraph.series[1].setData(data.dataTotal, false);
            twagGraph.redraw();
        } else {
            //update line graph
        }
    });
}


//var numRecords = 1;
//Query Engine Class
function QueryEngine(options) {
    this.options = options;
    //add to options?
    this.target = $("#" + options.target);
    this.affiliation = "";
    this.subject = []; 

    //Event Triggers
    //Messaging type options
    var that = this;
    $('#messaging-options').on("click", '.option', function() {
        //that.initialize(this[0].innerHTML);
    });
    this.initialize = function(view) {
        //If there's anything in target container, remove it and start fresh
        this.target.children().remove();
        if(view != null) this.options.view = view;
        var that = this;
        //Get subject from sidebar form
        this.subject = [];
        var sub = $('.qe input[name="subject"]');

        $.each(sub, function(index, value) {
            if(value.checked) {
                that.subject.push(value.value);
            }
        });
        //If no checkboxes are selected
        if(this.subject.length === 0) {
            //*Give user message to select a checkbox. For now auto-select first option
            sub.first().prop('checked', true);
            this.subject.push(sub.first()[0].value);
        }
        //Get affiliation from sidebar form
        this.affiliation = $('.qe input[name="affiliation"]:checked');

        //Create Query Table Structures
        this.createTable();
        if(this.options.graph === true) this.createGraph();
        /////Add loading icon
        this.renderView();
        /////Remove loading icon
        //After view has finished rendering, display
        this.target.slideDown('slow', function() {
            //Forces resize of charts to match container width
            $(window).resize();
        });
    };
    this.changeView = function(newView) {
        //Make sure RE is visible
        this.options.visible = true;
        //Change to new view type (reward, badge, metric, etc)
        if(newView === 'userList') {
            this.options.viewMode = 'userList';
        } else {
            var section = $('.content.dashboard');
            if(this.options.target === 'qe-dashboard') changePage(section, $('.option.dashboard'));
            this.options.viewMode = 'type';
            this.options.view = newView;
        }
        var that = this;
        this.target.slideUp('fast', function() {
            //Initialize new module with updated view
            that.initialize();
        });
    };
    this.createUserView = function() {
        console.log("view: " + this.options.view);
        console.log("viewMode: " + this.options.viewMode);
        console.log("viewName: " + this.options.viewName);
        var section = $('.content.userView');
        changePage(section, $('.option.userView'));
    }; 
    this.renderView = function() {
        var that = this;
        var table = this.target.children().find('table');
        //*Needs to be in form rewards.aspx?option1=option1&option2=option2
        //OR use getJSON parameters
        var getURL = this.options.view + '.json';
        if(this.options.viewMode === 'userList') {
            var paramList = {};
            paramList.view = this.options.view;
            paramList.affiliation = this.affiliation[0].value;
            paramList.subject = this.subject;
            paramList.completed = this.options.completed;
            //Gather data for query
            switch(this.options.view) {
                case 'rewards':
                    paramList.viewName = this.options.viewName;
                    break;
                case 'badges':

                    break;
                case 'goals':

                    break;
                case 'tasks':

                    break;
                case 'questionnaires':

                    break;
                case 'metrics':

                    break;
            }

            //If array doesn't get through in paramList, look up "traditional flag" with Google
            var URL = 'getUsers.json';
            if(!paramList.completed) URL = 'getUsers1.json';
            $.getJSON('getUsers.json', paramList, function(data) {
                //On Success
                for(var i=0; i<data.columns.length; i++) {
                    //Column Names (table headers) should originally be in lower *camelCase*
                    table.find('thead tr').append("<th>" + data.columns[i].separate().capitalize() + "</th>");
                }
                for(var i=0; i<data.results.length; i++) {
                    table.find('tbody').append('<tr></tr>');
                    for(var j=0; j<data.results[i].length; j++) {
                        table.find('tbody tr:last').append("<td>" + data.results[i][j]  + "</td>");
                    }
                }
                //*Add another click handler (as below) that creates a BACK button to show prev view
                //onclick handler to go into Level 3: USER mode
                table.find('tbody tr').on("click", function() {
                    //If messaging query engine, add selected user's email to the send list
                    if(that.options.target === "qe-messaging") {
                        selectRecipient(this, true);
                    } else if(that.options.target === "qe-dashboard") {
                        //If dashboard query engine, create user profile
                        //This is what decides the parameter for getting a user view
                        that.options.viewName = $(this).find('td')[0].innerHTML;
                        that.options.viewMode = 'user';
                        that.createUserView();
                    }
                });

                //Apply to all tables
                $(".footable").footable();
            });
        } else {
            //Create thead Row
            $.getJSON(getURL, {},function(data) {
                for(var i=0; i<data.columns.length; i++) {
                    //Column Names (table headers) should originally be in lower *camelCase*
                    table.find('thead tr').append("<th>" + data.columns[i].separate().capitalize() + "</th>");
                }
                //*Need switch statment for related badges and goals
                //*Don't forget
                if(that.options.target !== 'qe-questions' && that.options.target !== 'qe-responses') {
                    table.find('thead tr').append("<th>Related Badges</th><th>Related Goals</th>");
                }
                //Create tbody Rows
                for(var i=0; i<data.results.length; i++) {
                    table.find('tbody').append('<tr></tr>');
                    for(var j=0; j<data.results[i].length; j++) {
                        table.find('tbody tr:last').append("<td>" + data.results[i][j]  + "</td>");
                    }
                    //Subject name extracted from previous sibling label
                    //var subject = that.subject.prev().html();
                    //*Need another switch statment here
                    if(that.options.target !== 'qe-questions' && that.options.target !== 'qe-responses') {
                        table.find('tbody tr:last').append("<td>Clickable Icon</td><td>Clickable Icon</td>");
                    }
                }
                //Select all tr's except for first (header)
                table.find('tbody tr').on("click", function() {
                    that.options.viewName = $(this).find('td')[0].innerHTML;
                    //* For Christ's sake, make this a switch statement (use default case for below)
                    //If not in questions view, change this table...
                    if(that.options.target !== 'qe-questions' && that.options.target !== 'qe-responses') {
                        //This is what decides the paramter for getting a userList view
                        that.changeView('userList');
                    } else if(that.options.target === 'qe-questions') {
                        //...otherwise don't change this table, change the responses table

                        qe[3].options.viewName = $(this).find('td')[0].innerHTML;
                        qe[3].initialize('responses');
                    } else {
                        //or still change the responses table
                    }
                });
                
                //Apply to all tables
                $(".footable").footable();
            }).error(function() {
                console.log("Error retrieving data");
            });
        }
    };
    this.createTable = function() {
        var that = this;
        //If it's a userlist, allow group emailing from footer
        var queryTable = "<div class='module qt'><div class='module-body'><table class='footable' data-page-size='6'><thead><tr></tr></thead><tfoot><tr><td colspan='7'><div class='pagination pagination-centered hide-if-no-paging'></div></td></tr></tfoot><tbody></tbody></table><div id='pager' class='pager'></div></div></div>";
        //Push to top of QE module stack
        this.target.prepend(queryTable);
        this.createHeader(this.target.find('.qt.module'), 'table');
        this.createFooter(this.target.find('.qt .module-body'), 'table');
    };
    this.createGraph = function() {
        var queryGraph = "<div class='module qg'><div class='module-body down'><div id='qe-graph' style='height: 300px'></div></div><div class='module-footer'><img src='images/up.png'></div></div><!--end module qg-->";
        this.target.prepend(queryGraph);
        this.createHeader(this.target.find('.qg.module'), 'graph');
        this.createFooter(this.target.find('.qg .module-body'), 'graph');
        //Create new highcharts chart
        var qeGraph = new Highcharts.Chart(Highcharts.merge(qeOptions, defaultTheme));
    };
    this.createHeader = function(target, type) {
        var header = $("<div class='module-header'></div>");
        if(this.options.target === 'qe-dashboard') {
            if(type === 'graph') {
                //header.append("<h3>Graph</h3>");
            }
            if(type === 'table' && this.options.viewMode === 'type') {
                header.append("<h3>Filter By: " + this.options.view.capitalize() + "<span class='subject-listing'> > " + this.affiliation[0].value.toUpperCase() + " > " + this.subject.join(" + ").toUpperCase() + "</span></h3>");
            }
        } else if(this.options.target === 'qe-messaging') {
            //complex header
            //header.css("text-align", "center").addClass("right");
        } else if(this.options.target === 'qe-questions') {
            header.append("<h2>Questions</h2>")
        } else if(this.options.target === 'qe-responses') {
            header.append("<h2>Responses to question: " + that.options.viewName + "</h2>")
        }
        if(this.options.viewMode === 'userList' && type==='table') {
            //Filter by users who have completed the <goal>
            header.addClass('right').append("<div class='left'></div><div class='right'><div>");
            var current = "<strong class='green'>have</strong>";
            var otherwise = "<strong class='red'>have not</strong>";
            if(!this.options.completed) {
                //Switch
                var temp = current;
                current = otherwise;
                otherwise = temp;
            }
            var heading = "<h3>Filtering by users who " + current + " completed the " + this.options.view.slice(0,-1);
            var button = "OR <h3 class='completion-button hover'>List users who " + otherwise + "</h3>";
            header.find('.left').append(heading);
            header.find('.right').append(button).on("click", '.hover', function() {
                that.options.completed = !that.options.completed;
                that.initialize();
            });
        }
        target.prepend(header);
        return;
    };
    this.createFooter = function(target, type) {
        var that = this;
        var content = "";
        var messaging = this.options.target === 'qe-messaging';

        //If in user-list (level 2) mode, make footer button available
        if(this.options.viewMode === 'userList' && type === 'table') {
            if(messaging) content = "<h4 class='hover'>Select/Deselect All</h4>";
            content += "<h4 class='hover'>Add to recipient list</h4><span class='clear'></span>";
            target.append(content);

            //Messaging
            this.target.on("click", '.qt .module-body h4', function() {
                var selectButton = $(this).parent().find('h4');
                //Select All/Deselect All button
                if(that.options.target === 'qe-messaging') {
                    if($(this).is(selectButton.first())) {
                        //Select all
                        that.target.find('tbody tr').each(function() {
                            selectRecipient(this, false);
                        });
                        //If was select all, now deselect all & vice versa
                        selectAll = !selectAll;
                    } else if($(this).is(selectButton.last())) {
                        //Add selected users button
                        that.target.find('tbody .selected').each(function() {
                            addRecipient(this);
                        });
                    }
                } else {
                    //Add all users button
                    addAllRecipients(that.target.find('tbody tr'));
                    changePage($('.content.messaging'), $('.option.messaging'));
                }
            });
        }
    };
}

