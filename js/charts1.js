/*
** Created By: Stephen Quenzer
** Creation Date: 
*/
/* This Week At a Glance (TWAG) Module */
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

function getTwagData(type) {
    //Model
    var users = {
        name: 'Users',
        dataNew: [125, 134],
        dataTotal: [1410, 1601]
    };
    var tasks = {
        name: 'Tasks Completed',
        dataNew: [1000, 1002],
        dataTotal: [6410, 7601]
    };
    var goals = {
        name: 'Goals Completed',
        dataNew: [432, 425],
        dataTotal: [1410, 1601]
    };
    var badges = {
        name: 'Badges Completed',
        dataNew: [210, 232],
        dataTotal: [792, 920]
    };
    var rewards = {
        name: 'Rewards Completed',
        dataNew: [98, 102],
        dataTotal: [320, 422]
    };
  
    switch(type) {
        case "users":
          return users;
          break;
        case "tasks":
          return tasks;
          break;
        case "goals":
          return goals;
          break;
        case "badges":
          return badges;
          break;
        case "rewards":
          return rewards;
          break;
      }
}
//Default type for initial view
var type = getTwagData('users');
var twagOptions = {
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
    yAxis: {
        min: 0,
        title: {
            text: 'Total ' + type.name
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },
        series: [{
        name: 'New ' + type.name,
        data: type.dataNew
    }, {
        name: 'Total ' + type.name,
        data: type.dataTotal
    }]
}
//Create new bar chart
twagChart = new Highcharts.Chart(twagOptions);

//On click event for controlling different engagement views
//New Users, Tasks Completed, Goals Completed, Badges Earned, Rewards Earned
function twagUpdate(type) {
    var data = getTwagData(type);
    twagChart.series[0].setData(data.dataNew, false);
    twagChart.series[1].setData(data.dataTotal, false);
    twagChart.redraw();
}

/* Render Engine */
var numRecords = 1;
//Query Engine Class
function QueryEngine(options) {
    this.options = options;
    //add to options?
    this.target = $("#" + options.target);
    this.affiliation = "";
    this.subject = []; 
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

        //Create Query Table Structure
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
            changePage(section, $('.option.dashboard'));
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
                table.find('tr').slice(1).on("click", function() {
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
                $(".qt table").tablesorter();
            });
        } else {
            //Create thead Row
            $.getJSON(getURL, {},function(data) {
                for(var i=0; i<data.columns.length; i++) {
                    //Column Names (table headers) should originally be in lower *camelCase*
                    table.find('thead tr').append("<th>" + data.columns[i].separate().capitalize() + "</th>");
                }
                //*Need switch statment for related badges and goals
                table.find('thead tr').append("<th>Subject</th><th>Related Badges</th><th>Related Goals</th>");
                //Create tbody Rows
                for(var i=0; i<data.results.length; i++) {
                    table.find('tbody').append('<tr></tr>');
                    for(var j=0; j<data.results[i].length; j++) {
                        table.find('tbody tr:last').append("<td>" + data.results[i][j]  + "</td>");
                    }
                    //Subject name extracted from previous sibling label
                    //var subject = that.subject.prev().html();
                    //*Need another switch statment here
                    table.find('tbody tr:last').append("<td>" + "subject" + "</td><td>Clickable Icon</td><td>Clickable Icon</td>");
                }
                //Select all tr's except for first (header)
                table.find('tr').slice(1).on("click", function() {
                    //This is what decides the paramter for getting a userList view
                    that.options.viewName = $(this).find('td')[0].innerHTML;
                    that.changeView('userList');
                });
                //Apply to all tables
                $(".qt table").tablesorter();
            }).error(function() {
                console.log("Error retrieving data");
            });
        }
    };
    this.createTable = function() {
        var that = this;
        //If it's a userlist, allow group emailing from footer
        
        var queryTable = "<div class='module qt'><div class='module-header'></div><div class='module-body'><table class='tablesorter'><thead><tr></tr></thead><tbody></tbody></table></div></div>";
        //Push to top of QE module stack
        this.target.prepend(queryTable);
        this.createHeader(this.target.find('.qt .module-header'), 'table');
        this.createFooter(this.target.find('.qt .module-body'), 'table');
        //Activate module footer accordian
        //moduleAccordian(); Hard wire it in
    };
    this.createGraph = function() {
        var queryGraph = "<div class='module qg'><div class='module-header'></div><div class='module-body down'><div id='qe-graph' style='height: 400px'></div></div><div class='module-footer'><img src='images/up.png'></div></div><!--end module qg-->";
        this.target.prepend(queryGraph);
        this.createHeader(this.target.find('.qg .module-header'), 'graph');
        this.createFooter(this.target.find('.qg .module-body'), 'graph');
        //Activate module footer accordian
        moduleAccordian();
        //Create new highcharts chart
        var qeGraph = new Highcharts.Chart(Highcharts.merge(qeOptions, defaultTheme));
    };
    this.createHeader = function(target, type) {
        var content = "";
        switch (type) {
            case 'graph':
                content = "<h3>Graph</h3>";
            break;
            case 'table':
                if(this.options.target === 'qe-dashboard') {
                    content = "<h3>Filter By: " + this.options.view.capitalize() + "<span class='subject-listing'> > " + this.affiliation[0].value.toUpperCase() + " > " + this.subject.join(" + ").toUpperCase() + "</span></h3>";
                } else {
                    content = "";
                }
            break;
            case 'other':
                content = "";
            break;
        }
        target.prepend(content);
    };
    this.createFooter = function(target, type) {
        var that = this;
        var content = "";
        var messaging = this.options.target === 'qe-messaging';

        //If in user-list (level 2) mode, make footer button available
        if(this.options.viewMode === 'userList' && type === 'table') {
            if(messaging) content = "<h4>Select/Deselect All</h4>";
            content += "<h4>Add to recipient list</h4><span class='clear'></span>";
            target.append(content);

            this.target.on("click", '.qt h4', function() {
                var selectButton = $(this).parent().find('h4');
                //Select All/Deselect All button
                if($(this).is(selectButton.first())) {
                    //Select all
                    that.target.find('tbody tr').each(function() {
                        selectRecipient(this, false);
                    });
                    //If was select all, now deselect all & vice versa
                    selectAll = !selectAll;
                } else if($(this).is(selectButton.last())) {
                    //Add all subset of users to recipient list
                    that.target.find('tbody .selected').each(function() {
                        addRecipient(this);
                    });
                }
            });
        }
    };
}

