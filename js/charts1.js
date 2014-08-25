/*
** Created By: Stephen Quenzer
** Creation Date: 
*/
/* This Week At a Glance (TWAG) Module */
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
//Create new bar chart
twagChart = new Highcharts.Chart({
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
});

//On click event for controlling different engagement views
//New Users, Tasks Completed, Goals Completed, Badges Earned, Rewards Earned
function twagUpdate(type) {
    var data = getTwagData(type);
    twagChart.series[0].setData(data.dataNew, false);
    twagChart.series[1].setData(data.dataTotal, false);
    twagChart.redraw();
}

/* Render Engine */
//Table
//Temp Data
var rewards = {
    name: 'PRA Debt Reduction',
    completion: '192 Users (82%)', //Placeholder until dynamic data
    subject: 'FHA',
    dateAssigned: '',
    dateAwarded: 'Feb 19, 2014'
};
var numRecords = 1;
//Query Engine Class
function QueryEngine(options) {
    this.options = options;
    //add to options?
    this.target = $("#" + options.target);
    this.affiliation = [];
    this.subject = "";
    this.initialize = function() {
        var that = this;
        //Get affiliation from sidebar form
        this.affiliation = [];
        var aff = $('.qe input[name="affiliation"]');
        $.each(aff, function(index, value) {
            if(value.checked) {
                that.affiliation.push(value.value);
            }
        });
        //Get subject from sidebar form
        this.subject = $('.qe input[name="subject"]:checked');

        //Create Query Table Structure
        var queryTable = "<div class='module qt'><div class='module-header'><h3>User Engagement: " + this.options.view.capitalize() + "<span class='affiliate-listing'> > " + this.affiliation.join(" + ") + "</span></h3></div><div class='module-body'><table class='tablesorter'><thead><tr></tr></thead><tbody></tbody></table></div></div>";
        //Add to top of QE module stack
        this.target.prepend(queryTable);
        /////Add loading icon
        this.renderView();
        /////Remove loading icon
        //After view has finished rendering, display
        this.target.slideDown('slow');
    };
    this.changeView = function(newView) {
        //Change to new view type (reward, badge, metric, etc)
        this.options.view = newView;
        var that = this;
        this.target.slideUp('fast', function() {
            //Remove current module for replacement
            that.target.children().first().empty();
            //Initialize new module with updated view
            that.initialize();
        });
    };
    this.renderView = function() {
        console.log(this.subject);
        var that = this;
        var table = this.target.children().first().find('table');
        //Create thead Row
        $.getJSON('rewards.json', function(data) {
            //console.log(data);
            for(var i=0; i<data.columns.length; i++) {
                table.find('thead tr').append("<th>" + data.columns[i].separate().capitalize() + "</th>");
            }
            table.find('thead tr').append("<th>Subject</th><th>Related Badges</th><th>Related Goals</th>");
            //Create tbody Rows
            for(var i=0; i<data.results.length; i++) {
                table.find('tbody').append('<tr></tr>');
                for(var j=0; j<data.results[i].length; j++) {
                    table.find('tbody tr:last').append("<td>" + data.results[i][j] + "</td>");
                }
                //Subject name extracted from previous sibling label
                var subject = that.subject.prev().html();
                table.find('tbody tr:last').append("<td>" + subject + "</td><td>Clickable Icon</td><td>Clickable Icon</td>");
            }     
            $(".qt table").tablesorter();
        });
    };
}


