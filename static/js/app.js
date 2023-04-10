//Sample data at URL Below

let url = "http://127.0.0.1:5000/api/v1.0/calcomp";

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

    let compStatus  = new Set();

    data.forEach(element => {

      compStatus.add(element.ComplianceIndicator);

    });


    let bussinessLine = new Set();

    data.forEach(element => {

      bussinessLine.add(element.BusinessLine
        );

    });
 

    facilities.forEach(f => {


      facilitiesDict[f] = {

        "count": 0,
        "name": f,
        "geounit" : "",
        "country": "",
        "businessLine": "",
        "complianceIndicator": "",
        "compcount":  0,


      }
      data.forEach(element => {


        if (element.FacilityNamewithFacilityID == f) {


          facilitiesDict[f].count += 1;

          facilitiesDict[f].geounit = element.Geounit;

          facilitiesDict[f].country = element.Country;

          facilitiesDict[f].businessLine = element.BusinessLine;

          facilitiesDict[f].complianceIndicator = element.ComplianceIndicator;

          facilitiesDict[f].compcount = element.Count;

        }

        


        // facilities.add(element.FacilityNamewithFacilityID);

        // f.


      });

     

    });

    console.log(facilitiesDict);

    console.log(geounits);

    console.log(countries);

    console.log(facilities);

    console.log(compStatus);

    console.log(bussinessLine);
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



