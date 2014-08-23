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
function QueryEngine(view) {
    this.view = view;
    this.initialize = function() {
        //GET data for initial view (tasks completed)
    };
    this.changeView = function(newView) {
        this.view = newView;
        this.renderView();
    };
    this.renderView = function() {

    };
};


