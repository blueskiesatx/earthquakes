//Creating the map object, center in Austin
var map = L.map("map", {
    center: [30.2669444, -97.7427778],
    zoom: 11
});
  
  //Added tile layer
L.tileLayer("https://api.tiles.mapbox.com/v8/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.mapbox-streets-v8",
    accessToken: API_KEY
}).addTo(map);
  
// Assemble API query URL. I used url but it is really for the map using Leaflet that plots all of the earthquakes 
//from your data set based on their longitude and latitude.

//This one is for all month earthquakes 'earthquake url'
var EQurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
///alternative all week
///var API_quakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
///alternative past day
///var url = https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
////Even more var urls for other data ranges at: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
console.log(EQurl);

//Bonus: To plot a second data set on your map to illustrate the relationship between tectonic plates 
//and seismic activity. Need to pull in a second data set and visualize it 
//along side your original set of data. Data on tectonic plates can be found at https://github.com/fraxen/tectonicplates
//'tectonic plates url'
var TPurl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
console.log (TPurl)

// Get data
d3.json(EQurl, function(data) {
  createFeatures(data.features);
});
// Define function to run on each feature 
function createFeatures(earthquakeData) {
  var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
        },

        pointToLayer: function (feature, latlng) {
          return new L.circle(latlng,
            {radius: getRadius(feature.properties.mag),
            fillColor: getColor(feature.properties.mag),
            fillOpacity: .6,
            color: "#000",
            stroke: true,
            weight: .8
        })
      }
      });

  createMap(earthquakes);
}

function createMap(earthquakes) {

  //map layers
  var outdoors = = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiZGlteTEzIiwiYSI6ImNqbXNocG42ODAzZXgza28yZDh1OWtndGEifQ." +
  "-MYwn1UYQcumCt22eErCsw");

  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiZGlteTEzIiwiYSI6ImNqbXNocG42ODAzZXgza28yZDh1OWtndGEifQ." +
  "-MYwn1UYQcumCt22eErCsw");

  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoiZGlteTEzIiwiYSI6ImNqbXNocG42ODAzZXgza28yZDh1OWtndGEifQ." +
  "-MYwn1UYQcumCt22eErCsw");
  
    //base maps
  var baseMaps = {
      "Light Map": lightMap,
      "Outdoors": outdoors,
      "Satellite": satellite
  };

  //tectonic plate layer
  var tectonicPlates = new L.LayerGroup();

  //overlay object to hold overlay layer
  var overlayMaps = {
      "Earthquakes": earthquakes,
      "Tectonic Plates": tectonicPlates
  };

  //map
  var myMap = L.map("map", {
      center: [40.7, -94.5],
      zoom: 3,
      layers: [lightMap, earthquakes, tectonicPlates]
  });

  //tectonic plates data added
  d3.json(tectonicPlatesURL, function(tectonicData) {
      L.geoJson(tectonicData, {
          color: "yellow",
          weight: 2
      })
      .addTo(tectonicPlates);
  });

  //layer control for map
  L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
  }).addTo(myMap);

  //legend
  var legend = L.control({
      position: "bottomright"
  });

  legend.onAdd = function(myMap) {
      var div = L.DomUtil.create("div", "info legend"),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];

  //legend
  for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
          '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
  }
  return div;
  };
  legend.addTo(myMap);
}

//color functions
function getColor(magnitude) {
  if (magnitude > 5) {
      return 'red'
  } else if (magnitude > 4) {
      return 'orange'
  } else if (magnitude > 3) {
      return 'yellow'
  } else if (magnitude > 2) {
      return 'lightgreen'
  } else if (magnitude > 1) {
      return 'green'
  } else {
      return '#58C9CB'
  }
};

//radius
function getRadius(magnitude) {
  return magnitude * 25000;
};


//get the data
//d3.json(url, function (response){
//  L.geoJson(data).addTo(response);
//});
  //   console.log("test1");
  
//   var markers=L.markerClusterGroup();
//   console.log("test2");
//   for (var i = 0; i < response.length; i++){
//     console.log("test3");
//     // set the data location property to a varialbe
//     var features = response[i].features;
//     console.log("test4");
//     if (features){
//       markers.addLayer(L.marker(features.geometry.coordinates[0],features.geometry.coordinates[1]))
//           .bindPopup(features.properties.place[i])
//     };
//   };
//   map.addLayer(markers);
// });    
