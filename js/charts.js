function getTwagData(type) {
  var users = [['Week','New Users', 'Total Users'],['Last Week', 125, 523],['This Week', 122, 684]];
  var tasks = [['Week','New Tasks', 'Total Tasks'],['Last Week', 1211, 11421],['This Week', 1251, 11623]];
  var goals = [['Week','New Goals', 'Total Goals'],['Last Week', 902, 1252],['This Week', 1251, 3242]];
  var badges = [['Week','New Badges', 'Total Badges'],['Last Week', 232, 2252],['This Week', 352, 4242]];
  var rewards = [['Week','New Rewards', 'Total Rewards'],['Last Week', 902, 1252],['This Week', 1251, 3242]];
  
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
};

function twagInit(type) {
  var chart = document.getElementById('twag-chart');
  if(chart.innerHTML == "") {
    google.load("visualization", "1", {packages:["corechart"]});
    google.setOnLoadCallback(drawChart);
  } else {
    chart.innerHTML = "";
    drawChart();
  }
  function drawChart() {
    var values = getTwagData(type);
    var data = google.visualization.arrayToDataTable(values);

    var options = {
      height: 400,
      seriesType: "bars",
      backgroundColor: "#454C5A",
      colors: ['#e6693e','#ec8f6e'],
      vAxis: {textStyle: {color: '#9FB2E2'}},
      hAxis: {textStyle: {color: '#9FB2E2'}, baselineColor: "red"},
      legend: {textStyle: {color: '#bbcadf'}, position: 'bottom'},
      chartArea: {backgroundColor: "#485167", left: 0, right: 0, bottom: 0},
      isStacked: true
    };

    var chart = new google.visualization.ComboChart(document.getElementById('twag-chart'));
    chart.draw(data, options);
  }
}

twagInit("users");


