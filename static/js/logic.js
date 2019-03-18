// Creating map object
var map = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 11
});
  
  // Adding tile layer
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(map);
  
// Assemble API query URL
//This one is for all month earthquakes
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
console.log(url);

d3.json(url, function (response){
  L.geoJson(data).addTo(response);
});


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