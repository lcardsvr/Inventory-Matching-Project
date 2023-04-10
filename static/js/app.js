//Sample data at URL Below

let url = "http://127.0.0.1:5000/api/v1.0/leaktestcomp";

let facilitiesDict = {}

// Promise Pending
let dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);

function init() {
  // Fetch the JSON data and console log it
  let data = d3.json(url).then(function (data) {
    console.log(data);

    // let tot = data.length;

    // let names = data.FacilityNamewithFacilityID;

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

    let compStatus  = new Set();

    data.forEach(element => {

      compStatus.add(element.ComplianceIndicator);

    });

    compStatusArray = Array.from(compStatus);


    let bussinessLine = new Set();

    data.forEach(element => {

      bussinessLine.add(element.BusinessLine
        );

    });
 
   

    let bussinessLineArray = Array.from(bussinessLine);

    let latlonDict = [
      {country : "China", latlon :[35.8617 , 104.1954 ]},
      {country : "Indonesia", latlon :[-0.7893, 113.9213]},
      {country : "Australia", latlon : [-25.2744 , 133.7751]},
      {country : "Japan", latlon :[36.2048 , 138.2529]},
      {country : "New Zealand", latlon :[-40.9006, 174.8860]},
      {country : "Papua New Guinea", latlon :[-6, 148]},
      {country : "Taiwan, Province Of China", latlon :[23.6978, 120.9605]}
    ];


    let complianceArray = [];
    let nonComplianceArray = [];
    let criticalArray = [];
    let actionNeededArray = [];
  

    facilities.forEach(f => {


      facilitiesDict[f] = {

        "count": 0,
        "name": f,
        "geounit" : "",
        "country": "",
        "businessLine": "",
        "complianceIndicator": "",
        "compcount":  0,
        "actionNeededCount" : 0,
        "complianceCount" : 0,
        "criticalCount" : 0,
        "nonComplianceCount" : 0,
        "latitude": 0,
        "longitude": 0



      }
      data.forEach(element => {


        if (element.FacilityNamewithFacilityID == f) {


          facilitiesDict[f].count += 1;

          facilitiesDict[f].geounit = element.Geounit;

          facilitiesDict[f].country = element.Country;

          facilitiesDict[f].businessLine = element.BusinessLine;

          facilitiesDict[f].complianceIndicator = element.ComplianceIndicator;

          facilitiesDict[f].compcount += element.Count;

          if (element.ComplianceIndicator === 'Action Needed'){

            facilitiesDict[f].actionNeededCount += element.Count;
          }

          if (element.ComplianceIndicator === 'Compliance'){

            facilitiesDict[f].complianceCount += element.Count;
          }

          if (element.ComplianceIndicator === 'Critical'){

            facilitiesDict[f].criticalCount += element.Count;
          }
          if (element.ComplianceIndicator === 'Non Compliance'){

            facilitiesDict[f].nonComplianceCount += element.Count;
          }  
          
          facilitiesDict[f].latitude = getlat(facilitiesDict[f].country) ;

          facilitiesDict[f].longitude= getlon(facilitiesDict[f].country);
          
        }

        


        // facilities.add(element.FacilityNamewithFacilityID);

        // f.


      });

      complianceArray.push(parseInt(facilitiesDict[f].complianceCount));
      nonComplianceArray.push(parseInt(facilitiesDict[f].nonComplianceCount));
      criticalArray.push(parseInt(facilitiesDict[f].criticalCount));
      actionNeededArray.push(parseInt(facilitiesDict[f].actionNeededCount));
     

    });

    let seriesData= [{name: 'Compliance', data: complianceArray },
    {name: 'Action Needed', data: actionNeededArray },
    {name: 'Critical', data: criticalArray},
    {name: 'Non Compliance', data: nonComplianceArray}];


    console.log(seriesData);

    console.log(latlonDict);

    console.log(latlonDict.China);

    // let test = Array.from(complianceArray);

    // console.log(test);

    // console.log(nonComplianceArray);


    console.log(facilitiesDict);

    // console.log(facilitiesDict.length);
    // console.log(facilitiesDict.size);

    console.log(geounits);

    console.log(countries);

    console.log(facilities);




    console.log(compStatusArray);

    console.log(bussinessLineArray);


    console.log(compStatusArray.length);

    console.log(bussinessLineArray.length);

    console.log(compStatusArray[0]);

    console.log(compStatusArray[compStatusArray.length-1]);

    console.log(bussinessLineArray[bussinessLineArray.length-1]);
    


    let catArray = ['2020/21', '2019/20', '2018/19', '2017/18', '2016/17'];

    // let seriesData =  [{
    //   name: 'Gabriela Soter',
    //   data: [4, 4, 6, 15, 12]
    //   }, {
    //   name: 'Luis Cardenas',
    //   data: [5, 3, 12, 6, 11]
    //   }, {
    //   name: 'Agatha Mendes',
    //   data: [5, 15, 8, 5, 8]
    //    }];


    let chartTitle = compStatusArray[0];

    let xaxisLabel = bussinessLineArray[bussinessLineArray.length-1];


    catArray = facilitiesArray ; 


    // Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
    responseMap = d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_information.json").then(createMarkers);

    console.log(responseMap.data);



    // seriesData = createData (facilitiesDict);





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


  // Create the chart
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

  series: [
      {
          name: 'Browsers',
          colorByPoint: true,
          data: [
              {
                  name: 'Chrome',
                  y: 63.06,
                  drilldown: 'Chrome'
              },
              {
                  name: 'Safari',
                  y: 19.84,
                  drilldown: 'Safari'
              },
              {
                  name: 'Firefox',
                  y: 4.18,
                  drilldown: 'Firefox'
              },
              {
                  name: 'Edge',
                  y: 4.12,
                  drilldown: 'Edge'
              },
              {
                  name: 'Opera',
                  y: 2.33,
                  drilldown: 'Opera'
              },
              {
                  name: 'Internet Explorer',
                  y: 0.45,
                  drilldown: 'Internet Explorer'
              },
              {
                  name: 'Other',
                  y: 1.582,
                  drilldown: null
              }
          ]
      }
  ],
  drilldown: {
      breadcrumbs: {
          position: {
              align: 'right'
          }
      },
      series: [
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
      ]
  }
});


function getlat(country){

  let ChinaCoord = [35.8617 , 104.1954 ];
  let IndonesiaCoord = [-0.7893, 113.9213];
  let AustraliaCoord = [-25.2744 , 133.7751];
  let JapanCoord = [36.2048 , 138.2529];
  let NZCoord = [-40.9006, 174.8860];
  let PNGCoord = [-6, 148];
  let TaiwanCoord = [23.6978, 120.9605];

  if (country == 'China'){
    return ChinaCoord[0];
  }
  if (country == 'Indonesia'){
    return IndonesiaCoord[0];
  }
  if (country == 'Australia'){
    return AustraliaCoord[0];
  }
  if (country == 'Japan'){
    return JapanCoord[0];
  }
  if (country == 'New Zealand'){
    return NZCoord[0];
  }
  if (country == 'Papua New Guinea'){
    return PNGCoord[0];
  }
  if (country == 'Taiwan, Province Of China'){
    return TaiwanCoord[0];
  }

};

function getlon(country){

  let ChinaCoord = [35.8617 , 104.1954 ];
  let IndonesiaCoord = [-0.7893, 113.9213];
  let AustraliaCoord = [-25.2744 , 133.7751];
  let JapanCoord = [36.2048 , 138.2529];
  let NZCoord = [-40.9006, 174.8860];
  let PNGCoord = [-6, 148];
  let TaiwanCoord = [23.6978, 120.9605];

  if (country == 'China'){
    return ChinaCoord[1];
  }
  if (country == 'Indonesia'){
    return IndonesiaCoord[1];
  }
  if (country == 'Australia'){
    return AustraliaCoord[1];
  }
  if (country == 'Japan'){
    return JapanCoord[1];
  }
  if (country == 'New Zealand'){
    return NZCoord[1];
  }
  if (country == 'Papua New Guinea'){
    return PNGCoord[1];
  }
  if (country == 'Taiwan, Province Of China'){
    return TaiwanCoord[1];
  }


};

    // console.log(facilities)
    // let samples = data.samples;
    // let metadata = data.metadata;

    // init_dropdown (names);

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


function createData (facilitiesDict) {

  let complianceArray = [];
  let nonComplianceArray = [];
  let criticalArray = [];
  let actionNeededArray = [];

  facilitiesDict.forEach(f=>{

    complianceArray[f].push(facilitiesDict.complianceCount);
    nonComplianceArray[f].push(facilitiesDict.nonComplianceCount);
    criticalArray[f].push(facilitiesDict.criticalCount);
    actionNeededArray[f].push(facilitiesDict.actionNeededCount);

  });


  let seriesData= [{name: 'Compliance', data: complianceArray },
                   {name: 'Action Needed', data: actionNeededArray },
                   {name: 'Critical', data: criticalArray},
                   {name: 'Non Compliance', data: nonComplianceArray}

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

function plotMetaData(metadata) {

  // Create an array of category labels
  let dataLabels = Object.keys(metadata);
  // Create an array with Metadata Values
  let dataValues = Object.values(metadata);


  console.log("Labels " + dataLabels);
  console.log("values " + dataValues);


  // Clear previous contents
  d3.select("#sample-metadata").html("");


  // There are 7 properties in the metadata. Writing The keys and Values in the HTML

  for (let i = 0; i < 7; i++) {

    console.log(dataLabels[i] + " : " + dataValues[i]);

    d3.select("#sample-metadata").append("h6").text(`${dataLabels[i]}  :  ${dataValues[i]}`);
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

  let data = d3.json(url).then(function (data) {
    console.log(data);

    let samples = data.samples;
    let metadata = data.metadata;



    plotBarChart(samples[dataset]);

    plotBubbleChart(samples[dataset]);

    plotMetaData(metadata[dataset]);

    fillGaugeChart(metadata[dataset]);

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


function createMap(bikeStations) {

  // Create the tile layer that will be the background of our map.
  let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });


  // Create a baseMaps object to hold the streetmap layer.
  let baseMaps = {
    "Street Map": streetmap
  };

  // Create an overlayMaps object to hold the bikeStations layer.
  let overlayMaps = {
    "Bike Stations": bikeStations
  };

  // Create the map object with options.
  let map = L.map("bar", {
    center: [40.73, -74.0059],
    zoom: 12,
    layers: [streetmap, bikeStations]
  });

  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
}

function createMarkers(response) {

  // Pull the "stations" property from response.data.
  let stations = response.data.stations;

  // Initialize an array to hold bike markers.
  let bikeMarkers = [];

  // Loop through the stations array.
  for (let index = 0; index < stations.length; index++) {
    let station = stations[index];

    // For each station, create a marker, and bind a popup with the station's name.
    let bikeMarker = L.marker([station.lat, station.lon])
      .bindPopup("<h3>" + station.name + "<h3><h3>Capacity: " + station.capacity + "</h3>");

    // Add the marker to the bikeMarkers array.
    bikeMarkers.push(bikeMarker);
  }

  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  createMap(L.layerGroup(bikeMarkers));
}




