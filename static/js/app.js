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


    // Calling function to plot initial charts
    
    preparedata(data);

    // Calling function to create the map

    createMarkers(data);


    //Function to fill the dropdown menu

    init_dropdown(names);



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

  let drilDownSeriesArray = [];
  let drilDownSeriesArrayBL = [];


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

    let dataLoc= [];
    let blComp= [];

    let compPer = 0 ;

    let actionNeededCount = 0;
    let complianceCount = 0;
    let criticalCount = 0;
    let nonCompCount = 0;

    let start = 0;

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


      bussinessLine.forEach(buselement => {
        

        if (buselement == element.BusinessLine){


          if(element.ComplianceIndicator === 'Action Needed'){
            let dataPointL = element.BusinessLine +  ' - Action Needed';
            let dataPointV = element.Count;
            dataLoc.push([dataPointL,dataPointV]);
            actionNeededCount +=element.Count;
           }
          if(element.ComplianceIndicator === 'Compliance'){
            let dataPointL = element.BusinessLine +  ' - Compliance';
            let dataPointV = element.Count;
            dataLoc.push([dataPointL,dataPointV]);
            complianceCount  +=element.Count;
          }
          if(element.ComplianceIndicator === 'Critical'){
            let dataPointL = element.BusinessLine +  ' - Critical';
            let dataPointV = element.Count;
            dataLoc.push([dataPointL,dataPointV]);
            criticalCount +=element.Count;          
          }  
          if(element.ComplianceIndicator === 'Ignore Case'){
            let dataPointL = element.BusinessLine +  ' - Ignore Case';
            let dataPointV = element.Count;
            dataLoc.push([dataPointL,dataPointV]);
          } 
          if(element.ComplianceIndicator === 'Non Compliance'){
            let dataPointL = element.BusinessLine +  ' - Non Compliance';
            let dataPointV = element.Count;
            dataLoc.push([dataPointL,dataPointV]);
            nonCompCount +=element.Count;
          }   
          if(element.ComplianceIndicator === 'Not Applicable'){
            let dataPointL = element.BusinessLine +  ' - Not Applicable';
            let dataPointV = element.Count;
            dataLoc.push([dataPointL,dataPointV]);
          }
          
        }  
        

      });

      let locComp = (actionNeededCount+complianceCount+criticalCount)/(actionNeededCount+complianceCount+criticalCount+nonCompCount)
      let currentBL  = element.BusinessLine;
      blComp.push([currentBL ,locComp])

    }

    });

    let drillDownElementName = f;
    let drillDownElementid = f;

    let drilldownElement = {
      name : drillDownElementName,
      id: drillDownElementid,
      data: dataLoc
    }    


    let drillDownElementName02 = f;
    let drillDownElementid02 = f;

    let drilldownElement02 = {
      name : drillDownElementName,
      id: drillDownElementid,
      data: blComp
    }   

    //Object with drill down information as required by HighCharts Drill Down JS
    drilDownSeriesArray.push(drilldownElement);

    //Array with drill down information as required by HighCharts Drill Down JS (Not used for display purposes)

    drilDownSeriesArrayBL.push(drilldownElement02);

    complianceArray.push(parseInt(facilitiesDict[f].complianceCount));
    nonComplianceArray.push(parseInt(facilitiesDict[f].nonComplianceCount));
    criticalArray.push(parseInt(facilitiesDict[f].criticalCount));
    actionNeededArray.push(parseInt(facilitiesDict[f].actionNeededCount));


  });


  //Object with= information as required by HighCharts for the summary table
  let seriesData = [{ name: 'Compliance', data: complianceArray },
  { name: 'Action Needed', data: actionNeededArray },
  { name: 'Critical', data: criticalArray },
  { name: 'Non Compliance', data: nonComplianceArray }];

  console.log(drilDownSeriesArray);

  console.log(drilDownSeriesArrayBL);




  let percentageCompArrray = percentArrayCalc(complianceArray, actionNeededArray, criticalArray, nonComplianceArray);

  let mainSeriesTest = drilDownMainSeries(facilitiesArray, percentageCompArrray);

  let performerArray = performerMaker(facilitiesArray, percentageCompArrray);

  console.log(facilitiesArray);

  console.log(percentageCompArrray);

  console.log(performerArray);



  console.log(mainSeriesTest);



  console.log(seriesData);


  console.log(facilitiesDict);




  let chartTitle = "Snapshot of compliance per location";

  let xaxisLabel = "Assets";


  let catArray = facilitiesArray;


    //Call summary chart

    sumChart(chartTitle, catArray, xaxisLabel, seriesData);

    // // Call drilldown chart

    drillDownChart(mainSeriesTest, drilDownSeriesArray);

    // Summary first locations

    plotMetaData(facilitiesArray, percentageCompArrray); 




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



  // Clear previous contents
  d3.select("#sample-metadata").html("");


  // Plotting just 5 locations for Information.  Writing The keys and Values in the HTML

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


  let urlArray = ["http://127.0.0.1:5000/api/v1.0/photocomp", "http://127.0.0.1:5000/api/v1.0/leaktestcomp", "http://127.0.0.1:5000/api/v1.0/calcomp"];

  let url = urlArray[dataset];
  

  if(this.myMap) {
    this.myMap.remove();
  }
  let data = d3.json(url).then(function (data) {
    console.log(data);

    // Function to rearrange plots

    preparedata(data);

    // Calling function to create the map

    createMarkers2(data);

  });


}

init();


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

  // creating variable with the response

  let stations = response;


  // Create a new marker cluster group.
  let markers = L.markerClusterGroup();

  // Loop through the stations array.
  for (let index = 0; index < stations.length; index++) {
    let station = stations[index];


    // For each station, create a marker, and bind a popup with the station's details
    markers.addLayer(L.marker([station.lat, station.lon])
      .bindPopup("<h3>" + station.FacilityNamewithFacilityID + "<h3><h3>Compliance Indicator: " + station.ComplianceIndicator + "<h3><h3>Business Line: " + station.BusinessLine + "<h3><h3>Count: " + station.Count + "</h3>"));

  }

  myMap.addLayer(markers);


}

function createMarkers2(response) {
  


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
      text: 'Compliance Information'
    },
    subtitle: {
      align: 'left',
      text: 'Click the columns to view Business Line Drilled Down Data.</a>'
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
        text: '<br> % Compliance / Ind. quantities<br/>'
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
          format: '{point.y:.1f}'
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


