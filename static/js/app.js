//Sample data at URL Below

let url = "http://127.0.0.1:5000/api/v1.0/photocomp";

let urlArray = ["http://127.0.0.1:5000/api/v1.0/photocomp", "http://127.0.0.1:5000/api/v1.0/leaktestcomp", "http://127.0.0.1:5000/api/v1.0/calcomp"];

let names = ["PhotoInv Comp", "LeakTest Comp", "Calibration Comp"];

let facilitiesDict = {}

// Promise Pending
let dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

function init() {
  // Fetch the JSON data and console log it
  let data = d3.json(url).then(function (data) {
    console.log(data);


    preparedata(data);

    // Calling function to create the map

    createMarkers(data);


    // console.log(facilities)
    // let samples = data.samples;
    // let metadata = data.metadata;

    init_dropdown(names);

    // console.log("Names: "+ names);
    // console.log("Samples: " + samples);

    // //Invoking functions to plot charts in the html- Initialization is done on the first element (id = 940)
    // plotBarChart(samples[0]);

    // plotBubbleChart(samples[0]);

    // plotMetaData(metadata[0]);

    // fillGaugeChart(metadata[0]);

    // console.log(PhotoComp)

    // PhotoComp =photocomp()
    // LeakTestComp = leaktestcomp()
    // CalibrationComp = calcomp()

  });
}

function preparedata(data){


  let geounits = new Set();

  data.forEach(element => {

    geounits.add(element.Geounit);

  });

  let countries = new Set();

  data.forEach(element => {

    countries.add(element.Country);

  });

  let facilities = new Set();

  data.forEach(element => {

    facilities.add(element.FacilityNamewithFacilityID);

  });

  let facilitiesArray = Array.from(facilities);

  let compStatus = new Set();

  data.forEach(element => {

    compStatus.add(element.ComplianceIndicator);

  });

  let compStatusArray = Array.from(compStatus);


  let bussinessLine = new Set();

  data.forEach(element => {

    bussinessLine.add(element.BusinessLine
    );

  });



  let bussinessLineArray = Array.from(bussinessLine);

  let complianceArray = [];
  let nonComplianceArray = [];
  let criticalArray = [];
  let actionNeededArray = [];


  facilities.forEach(f => {


    facilitiesDict[f] = {

      "count": 0,
      "name": f,
      "geounit": "",
      "country": "",
      "businessLine": "",
      "complianceIndicator": "",
      "compcount": 0,
      "actionNeededCount": 0,
      "complianceCount": 0,
      "criticalCount": 0,
      "nonComplianceCount": 0,
      "lat": 0,
      "lon": 0



    }
    data.forEach(element => {


      if (element.FacilityNamewithFacilityID == f) {


        facilitiesDict[f].count += 1;

        facilitiesDict[f].geounit = element.Geounit;

        facilitiesDict[f].country = element.Country;

        facilitiesDict[f].businessLine = element.BusinessLine;

        facilitiesDict[f].complianceIndicator = element.ComplianceIndicator;

        facilitiesDict[f].compcount += element.Count;

        if (element.ComplianceIndicator === 'Action Needed') {

          facilitiesDict[f].actionNeededCount += element.Count;
        }

        if (element.ComplianceIndicator === 'Compliance') {

          facilitiesDict[f].complianceCount += element.Count;
        }

        if (element.ComplianceIndicator === 'Critical') {

          facilitiesDict[f].criticalCount += element.Count;
        }
        if (element.ComplianceIndicator === 'Non Compliance') {

          facilitiesDict[f].nonComplianceCount += element.Count;
        }

        facilitiesDict[f].lat = element.lat;

        facilitiesDict[f].lon = element.lon;

      }




    });

    complianceArray.push(parseInt(facilitiesDict[f].complianceCount));
    nonComplianceArray.push(parseInt(facilitiesDict[f].nonComplianceCount));
    criticalArray.push(parseInt(facilitiesDict[f].criticalCount));
    actionNeededArray.push(parseInt(facilitiesDict[f].actionNeededCount));


  });

  let seriesData = [{ name: 'Compliance', data: complianceArray },
  { name: 'Action Needed', data: actionNeededArray },
  { name: 'Critical', data: criticalArray },
  { name: 'Non Compliance', data: nonComplianceArray }];




  let percentageCompArrray = percentArrayCalc(complianceArray, actionNeededArray, criticalArray, nonComplianceArray);

  let mainSeriesTest = drilDownMainSeries(facilitiesArray, percentageCompArrray);

  let performerArray = performerMaker(facilitiesArray, percentageCompArrray);

  // let drillDownSeriesTest = drillDownSeries(facilitiesArray, data);

  console.log(percentageCompArrray);

  console.log(performerArray);

  // let percentSorted = percentageCompArrray;

  // percentSorted.sort((a,b) => b-a);

  // console.log(percentSorted);


  console.log(mainSeriesTest);




  console.log(seriesData);

  // console.log(latlonDict);

  // console.log(latlonDict.China);

  let locations = Object.keys(facilitiesDict);

  let locInfo = Object.values(facilitiesDict);




  console.log(facilitiesDict);


  //Info for the summary chart
  let chartTitle = compStatusArray[0];

  let xaxisLabel = bussinessLineArray[bussinessLineArray.length - 1];


  let catArray = facilitiesArray;


  let drillDownSeries = [
    {
      name: 'Chrome',
      id: 'Chrome',
      data: [
        [
          'v65.0',
          0.1
        ],
        [
          'v64.0',
          1.3
        ],
        [
          'v63.0',
          53.02
        ],
        [
          'v62.0',
          1.4
        ],
        [
          'v61.0',
          0.88
        ],
        [
          'v60.0',
          0.56
        ],
        [
          'v59.0',
          0.45
        ],
        [
          'v58.0',
          0.49
        ],
        [
          'v57.0',
          0.32
        ],
        [
          'v56.0',
          0.29
        ],
        [
          'v55.0',
          0.79
        ],
        [
          'v54.0',
          0.18
        ],
        [
          'v51.0',
          0.13
        ],
        [
          'v49.0',
          2.16
        ],
        [
          'v48.0',
          0.13
        ],
        [
          'v47.0',
          0.11
        ],
        [
          'v43.0',
          0.17
        ],
        [
          'v29.0',
          0.26
        ]
      ]
    },
    {
      name: 'Firefox',
      id: 'Firefox',
      data: [
        [
          'v58.0',
          1.02
        ],
        [
          'v57.0',
          7.36
        ],
        [
          'v56.0',
          0.35
        ],
        [
          'v55.0',
          0.11
        ],
        [
          'v54.0',
          0.1
        ],
        [
          'v52.0',
          0.95
        ],
        [
          'v51.0',
          0.15
        ],
        [
          'v50.0',
          0.1
        ],
        [
          'v48.0',
          0.31
        ],
        [
          'v47.0',
          0.12
        ]
      ]
    },
    {
      name: 'Internet Explorer',
      id: 'Internet Explorer',
      data: [
        [
          'v11.0',
          6.2
        ],
        [
          'v10.0',
          0.29
        ],
        [
          'v9.0',
          0.27
        ],
        [
          'v8.0',
          0.47
        ]
      ]
    },
    {
      name: 'Safari',
      id: 'Safari',
      data: [
        [
          'v11.0',
          3.39
        ],
        [
          'v10.1',
          0.96
        ],
        [
          'v10.0',
          0.36
        ],
        [
          'v9.1',
          0.54
        ],
        [
          'v9.0',
          0.13
        ],
        [
          'v5.1',
          0.2
        ]
      ]
    },
    {
      name: 'Edge',
      id: 'Edge',
      data: [
        [
          'v16',
          2.6
        ],
        [
          'v15',
          0.92
        ],
        [
          'v14',
          0.4
        ],
        [
          'v13',
          0.1
        ]
      ]
    },
    {
      name: 'Opera',
      id: 'Opera',
      data: [
        [
          'v50.0',
          0.96
        ],
        [
          'v49.0',
          0.82
        ],
        [
          'v12.1',
          0.14
        ]
      ]
    }
  ];

    //Call summary chart

    sumChart(chartTitle, catArray, xaxisLabel, seriesData);

    // Call drilldown chart

    drillDownChart(mainSeriesTest, drillDownSeries);

    //

    plotMetaData(facilitiesArray, percentageCompArrray) 

}


function createData(facilitiesDict) {

  let complianceArray = [];
  let nonComplianceArray = [];
  let criticalArray = [];
  let actionNeededArray = [];

  facilitiesDict.forEach(f => {

    complianceArray[f].push(facilitiesDict.complianceCount);
    nonComplianceArray[f].push(facilitiesDict.nonComplianceCount);
    criticalArray[f].push(facilitiesDict.criticalCount);
    actionNeededArray[f].push(facilitiesDict.actionNeededCount);

  });


  let seriesData = [{ name: 'Compliance', data: complianceArray },
  { name: 'Action Needed', data: actionNeededArray },
  { name: 'Critical', data: criticalArray },
  { name: 'Non Compliance', data: nonComplianceArray }

  ];

  return seriesData;

}

//Function to plot the BarCharts

function plotBarChart(samples) {


  //Top 10 data
  let numSamples = (samples.sample_values.slice(0, 10));
  numSamples = numSamples.reverse();

  let axis = samples.otu_ids.slice(0, 10).map(sample => `OTU ${sample}`);
  axis = axis.reverse();


  let labels = (samples.otu_labels.slice(0, 10));
  labels = labels.reverse();


  // Trace1 for the Top 10 OTUs

  let trace = {
    x: numSamples,
    y: axis,
    text: labels,
    name: "OTU",
    type: "bar",
    orientation: "h"
  };

  // Data array
  let traceData = [trace];

  // Apply a title to the layout
  let layout = {
    title: "<b>Top 10 OTUs</b>",
    margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
    }
  };

  // Render the plot to the div tag with id "bar"
  Plotly.newPlot("bar", traceData, layout);

}


//Function to plot the BarChart

function plotBubbleChart(samples) {


  //Top 10 data

  let numSamples = (samples.sample_values);

  let axis = samples.otu_ids;

  let labels = (samples.otu_labels);

  let trace = {
    x: axis,
    y: numSamples,
    text: labels,
    mode: "markers",
    marker: {
      size: numSamples,
      color: axis,
      colorscale: "Earth"
    }
  };

  // Data array

  let traceData = [trace];

  // Apply a title to the layout
  let layout = {
    hovermode: "closest",
    xaxis: { title: "<b>OTU ID</b>" }
  };

  Plotly.newPlot("bubble", traceData, layout);


}

//Function to plot the MetaData

function plotMetaData(facilitiesArray, percentageCompArrray) {

  // // Create an array of category labels
  // let dataLabels = Object.keys(metadata);
  // // Create an array with Metadata Values
  // let dataValues = Object.values(metadata);


  // console.log("Labels " + dataLabels);
  // console.log("values " + dataValues);


  // Clear previous contents
  d3.select("#sample-metadata").html("");


  // There are 7 properties in the metadata. Writing The keys and Values in the HTML

  for (let i = 0; i < 5; i++) {

    console.log(facilitiesArray[i] + " : " + percentageCompArrray[i]);

    d3.select("#sample-metadata").append("h6").text(`${facilitiesArray[i]}  :  ${percentageCompArrray[i]}%`);
  }



}

//Function to fill the dropdowns with all the names
function init_dropdown(names) {


  // Checking current Test Subject ID
  let dropdownMenu = d3.select("#selDataset");


  //Fill the dropdown with the names and a value that will later match the 
  for (let i = 0; i < names.length; i++) {

    dropdownMenu.append("option").text(names[i]).property("value", i);

  }

}


//Function that is run everytime there is a change in teh TEst Subject ID
function optionChanged() {

  // Checking current Test Subject ID
  let dropdownMenu = d3.select("#selDataset");

  // Assign the value of the dropdown menu option to a variable the metadata id and sample id
  let dataset = dropdownMenu.property("value");

  // let url = "http://127.0.0.1:5000/api/v1.0/leaktestcomp";

  let urlArray = ["http://127.0.0.1:5000/api/v1.0/photocomp", "http://127.0.0.1:5000/api/v1.0/leaktestcomp", "http://127.0.0.1:5000/api/v1.0/calcomp"];

  let url = urlArray[dataset];
  

  if(this.myMap) {
    this.myMap.remove();
  }
  let data = d3.json(url).then(function (data) {
    console.log(data);

    preparedata(data);

    // Calling function to create the map

    // myMap.off();
    // myMap.remove();

    createMarkers2(data);
    // createMarkers(data);


    // plotBarChart(samples[dataset]);

    // plotBubbleChart(samples[dataset]);

    // plotMetaData(metadata[dataset]);

    // fillGaugeChart(metadata[dataset]);

  });


}

init();


//Function to generate teh Gauge Chart
function fillGaugeChart(metadata) {

  // Create an array of category labels
  let dataLabels = Object.keys(metadata);


  // Create an array with Metadata Values
  let dataValues = Object.values(metadata);


  console.log("Labels " + dataLabels);

  console.log("values " + dataValues);


  let washingFrequency = dataValues[6];

  // Set up the trace for the gauge chart
  //Colors taken from https://learn.microsoft.com/en-us/power-platform/power-fx/reference/function-colors
  let trace = {
    value: washingFrequency,
    domain: { x: [0, 1], y: [0, 1] },
    title: {
      text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
      // font: {color: "black", size: 16}
      font: { color: "black" }
    },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [0, 9], tickmode: "linear", tick0: 1, dtick: 1 },
      steps: [
        { range: [0, 1], color: "rgba(240, 248, 255, 1)" },
        { range: [1, 2], color: "rgba( 250, 235, 215, 1 )" },
        { range: [2, 3], color: "rgba( 250, 235, 215, 1 )" },
        { range: [3, 4], color: "rgba(250, 250, 210, 1)" },
        { range: [4, 5], color: "rgba(211, 211, 211, 1)" },
        { range: [5, 6], color: "rgba(102, 205, 170, 1 )" },
        { range: [6, 7], color: "rgba(0, 250, 154, 1 )" },
        { range: [7, 8], color: "rgba( 60, 179, 113, 1)" },
        { range: [8, 9], color: "rgba(107, 142, 35, 1)" },

      ]
    }
  };

  // Set up the Layout
  let layout = {
    width: 400,
    height: 400,
    margin: { t: 0, b: 0 }
  };

  // Call Plotly to plot the gauge chart
  Plotly.newPlot("gauge", [trace], layout)

};


function createMarkers(response) {


  // Creating the map object
  let myMap = L.map("bar", {
    center: [0, 130],
    zoom: 2
  });

  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Pull the "stations" property from response.data.
  // let stations = response.data.stations;
  let stations = response;


  // Create a new marker cluster group.
  let markers = L.markerClusterGroup();

  // Loop through the stations array.
  for (let index = 0; index < stations.length; index++) {
    let station = stations[index];


    // For each station, create a marker, and bind a popup with the station's name.
    markers.addLayer(L.marker([station.lat, station.lon])
      .bindPopup("<h3>" + station.FacilityNamewithFacilityID + "<h3><h3>Compliance Indicator: " + station.ComplianceIndicator + "<h3><h3>Business Line: " + station.BusinessLine + "<h3><h3>Count: " + station.Count + "</h3>"));

  }

  myMap.addLayer(markers);


}

function createMarkers2(response) {
  
  // document.getElementById('bar').innerHTML = "<div id='bar' style='height: 400px;;'></div>";

  // myMap.off();
  // myMap.remove();

  // Creating the map object
  myMap = L.map("bar", {
    center: [0, 130],
    zoom: 2
  });


  

  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Pull the "stations" property from response.data.
  // let stations = response.data.stations;
  let stations = response;


  // Create a new marker cluster group.
  let markers = L.markerClusterGroup();

  // Loop through the stations array.
  for (let index = 0; index < stations.length; index++) {
    let station = stations[index];


    // For each station, create a marker, and bind a popup with the station's name.
    markers.addLayer(L.marker([station.lat, station.lon])
      .bindPopup("<h3>" + station.FacilityNamewithFacilityID + "<h3><h3>Compliance Indicator: " + station.ComplianceIndicator + "<h3><h3>Business Line: " + station.BusinessLine + "<h3><h3>Count: " + station.Count + "</h3>"));

  }

  myMap.addLayer(markers);


}

function percentArrayCalc(complianceArray, actionNeededArray, criticalArray, nonComplianceArray) {

  let percentArray = [];
  for (i = 0; i < complianceArray.length; i++) {

    let per = (complianceArray[i] + actionNeededArray[i] + criticalArray[i]) / (complianceArray[i] + actionNeededArray[i] + criticalArray[i] + nonComplianceArray[i]) * 100;

    percentArray.push(per);
  }

  return percentArray;

}


function drilDownMainSeries(facilitiesArray, percentArrayCalc) {

  let dataDrill = [];

  for (i = 0; i < facilitiesArray.length; i++) {

    let temp = { name: facilitiesArray[i], y: percentArrayCalc[i], drilldown: facilitiesArray[i] };

    dataDrill.push(temp);

  }

  let mainSeries = [{
    name: 'Location',
    colorByPoint: true,
    data: dataDrill
  }];

  return mainSeries;

}


function sumChart(chartTitle, catArray, xaxisLabel, seriesData) {


  //Create  chart with  summary
  Highcharts.chart('bubble', {
    chart: {
      type: 'bar'
    },
    title: {
      text: chartTitle
    },
    xAxis: {
      categories: catArray
    },
    yAxis: {
      min: 0,
      title: {
        text: xaxisLabel
      }
    },
    legend: {
      reversed: true
    },
    plotOptions: {
      series: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
    },
    series: seriesData
  });


}

function drillDownChart(mainSeriesTest, drillDownSeries) {


  // Create the drill - down chart
  Highcharts.chart('gauge', {
    chart: {
      type: 'column'
    },
    title: {
      align: 'left',
      text: 'Browser market shares. January, 2022'
    },
    subtitle: {
      align: 'left',
      text: 'Click the columns to view versions. Source: <a href="http://statcounter.com" target="_blank">statcounter.com</a>'
    },
    accessibility: {
      announceNewData: {
        enabled: true
      }
    },
    xAxis: {
      type: 'category'
    },
    yAxis: {
      title: {
        text: 'Total percent market share'
      }

    },
    legend: {
      enabled: false
    },
    plotOptions: {
      series: {
        borderWidth: 0,
        dataLabels: {
          enabled: true,
          format: '{point.y:.1f}%'
        }
      }
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
    },

    series: mainSeriesTest,
    drilldown: {
      breadcrumbs: {
        position: {
          align: 'right'
        }
      },
      series: drillDownSeries
    }
  });

}

function performerMaker(facilitiesArray, percentageCompArrray){

  let sortable =[];

  for (i=0;i<facilitiesArray;i++){

      // temp = [{percom : percentageCompArrray[i], loc: facilitiesArray [i]}];

      sortable.push([facilitiesArray [i], percentageCompArrray[i]]);
  }

  console.log(sortable);

  sortable.sort(function(a,b){

    return a[1] - b[1];
  }) ;

  console.log(sortable);

  return sortable;
}


// function drillDownSeries(facilitiesArray, data) {

//   let bussinessLine = new Set();

//   data.forEach(element => {

//     bussinessLine.add(element.BusinessLine
//     );

//   });

//   let bussinessLineArray = Array.from(bussinessLine);


//   let CompIndicator = new Set();

//   data.forEach(element => {

//     CompIndicator.add(element.ComplianceIndicator
//     );

//   });

//   let CompIndicatorArray = Array.from(CompIndicator);




//   for (i = 0; i < facilitiesArray.length; i++) {

//     let location = facilitiesArray[i];

//     for (l = 0; l < data.length; l++) {

//       if (data{l}.FacilityNamewithFacilityID == location) {

//         for (j = 0; j < bussinessLineArray.length; j++) {

//           if (bussinessLineArray[j] == data{ l }.BusinessLine) {


//             for (k = 0; k < CompIndicatorArray.length; k++) {

//               if (CompIndicatorArray[k] =){}



//             }


//           }

//         }




//       }


//     }

//   )



