var link = document.createElement("link");
link.href = "style.css";



// map

L.mapquest.key = "ck2OXUAJsF0iz999XGQ62jyXo8AXOVp7";

var map = L.mapquest.map("map", {
  center: [60.472, 8.4689],
  layers: L.mapquest.tileLayer("map"),
  zoom: 5,
});

var directions = L.mapquest
  .directionsControl({
    routeSummary: {
      enabled: true,
    },
    narrativeControl: {
      enabled: true,
      compactResults: true,
    },
  }).addTo(map);

  L.control.resetView({
    position: "topleft",
    title: "Reset view",
    latlng: L.latLng([60.472, 8.4689]),
    zoom: 5
  }).addTo(map);

  var worldMiniMap = L.control.worldMiniMap({position: 'bottomright', style: {opacity: 0.5, borderRadius: '0px', backgroundColor: 'gray'}}).addTo(map);

// tilelayer

var basicDark = L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    minZoom: 3,
  }
).addTo(map);

var basicLight = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 3,
});

var advanced = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    minZoom: 3,
  }
);

var osm = L.tileLayer(
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
  {
    maxZoom: 3,
  }
);  

var clouds = L.OWM.clouds({showLegend: false, opacity: 0.5, appId: '774b87efbcc42746ba3e00edf936f3b3'})
var wind = L.OWM.wind({showLegend: false, opacity: 0.5, appId: '774b87efbcc42746ba3e00edf936f3b3'})
var temperature = L.OWM.temperature({showLegend: false, opacity: 0.5, appId: '774b87efbcc42746ba3e00edf936f3b3'})

//leaflet layer control

var baseMaps = {
  "Basic Dark Theme": basicDark,
  "Basic light Theme": basicLight,
  "Advanced": advanced,
};

var weather = {
  "Clouds": clouds,
  "Wind": wind,
  "Temperature": temperature,
}

map.addControl(new L.Control.Fullscreen());

L.control.locate().addTo(map);

// var markers = L.markerClusterGroup({
//   spiderfyOnMaxZoom: true,
//   showCoverageOnHover: false,
//   zoomToBoundsOnClick: true
// });

// leaflet layer control

L.control.layers(baseMaps, weather, chkBox).addTo(map);

// search

var search = placeSearch({
  key: "ucOKfYhC4s2tu4lumOn4CmZtcEy24PQH",
  container: document.querySelector("#place-search-input"),
});


var searchMarker = null;

search.on("change", (e) => {
  console.log(e);
  if (searchMarker !== null) {
    map.removeLayer(searchMarker);
  }
  const response = fetch(
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${e.result.latlng.lat}&lon=${e.result.latlng.lng}`
  )
    .then((r) => r.json())
    .then((data) => {
      var weather = data.properties.timeseries[0];
      console.log(data.properties.timeseries[0]);

      var weatherIcon = L.icon({
        iconUrl: `Assets/weather_icons/${weather.data.next_1_hours.summary.symbol_code}.png`,
        iconSize: [50, 50],
        iconAnchor: [0, 55],
        popupAnchor: [30, -45],
      });

      searchMarker = L.marker([e.result.latlng.lat, e.result.latlng.lng], {
        icon: weatherIcon,
      });
      searchMarker.bindPopup(
        `Det er ${Math.round(
          weather.data.instant.details.air_temperature
        )}°C i ${e.result.name}!`
      );
      searchMarker.addTo(map);
      searchMarker.openPopup();
      searchMarker.getPopup().on("remove", function () {
        map.removeLayer(searchMarker);
      });
    });
});

// show markers and popup when markers is clicked

var weatherApi = [
  { name: "Oslo", lat: 59.91, lng: 10.74 },
  { name: "Bergen", lat: 60.39, lng: 5.32 },
  { name: "Trondheim", lat: 63.43, lng: 10.4 },
  { name: "Hammerfest", lat: 70.66, lng: 23.67 },
  { name: "Tromsø", lat: 69.64, lng: 18.97 },
  { name: "Stockholm", lat: 59.33, lng: 18.07 },
  { name: "København", lat: 55.65, lng: 12.6 },
  { name: "London", lat: 51.5, lng: -0.12 },
  { name: "Berlin", lat: 52.52, lng: 13.42 },
  { name: "Amsterdam", lat: 52.36, lng: 4.9 },
  { name: "Helsinki", lat: 60.17, lng: 24.95 },
  { name: "Reykjavik", lat: 64.13, lng: -21.88 },
];

var locationLayer = L.layerGroup();

var arrayLength = weatherApi.length;
for (var i = 0; i < arrayLength; i++) {
  fetchWeather(weatherApi[i]);
}

function fetchWeather(location) {
  const response = fetch(
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${location.lat}&lon=${location.lng}`
  )
    .then((r) => r.json())
    .then((data) => {
      var weather = data.properties.timeseries[0];
      console.log(data.properties.timeseries[0]);

      var weatherIcon = L.icon({
        iconUrl: `Assets/weather_icons/${weather.data.next_1_hours.summary.symbol_code}.png`,

        iconSize: [50, 50],
        iconAnchor: [0, 55],
        popupAnchor: [30, -45],
      });

      locationMarker = L.marker([location.lat, location.lng], {
        icon: weatherIcon,
      });
      locationMarker.bindPopup(
        `Det er ${Math.round(
          weather.data.instant.details.air_temperature
        )}°C i ${location.name}!`
      );
      locationLayer.addLayer(locationMarker);
    });
}
locationLayer.addTo(map);

// view degree based on coordinates

// var newMarker = {};
// map.on("click", function (e) {
//   fetch(
//     "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=" +
//       e.latlng.lat +
//       "&lon=" +
//       e.latlng.lng
//   )
//     .then((r) => r.json())
//     .then((data) => {
//       lat = e.latlng.lat;
//       lon = e.latlng.lng;
//       console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
//       if (newMarker != undefined) {
//         map.removeLayer(newMarker);
//       }
//       var weather = data.properties.timeseries[0];

//       var weatherIcon = L.icon({
//         iconUrl: `Assets/weather_icons/${weather.data.next_1_hours.summary.symbol_code}.png`,

//         iconSize: [50, 50],
//         iconAnchor: [20, 20],
//         popupAnchor: [0, -10],
//       });

//       newMarker = L.marker([lat, lon], { icon: weatherIcon }).addTo(map);
//       newMarker
//         .bindPopup(
//           `Det er ${Math.round(
//             weather.data.instant.details.air_temperature
//           )}°C!`
//         )
//         .openPopup();
//         newMarker.getPopup().on('remove', function() {
//           map.removeLayer(newMarker);
//         });
//     });
// });
// if ((newMarker = onclick)) {
//   map.removeLayer(newMarker);
//   closure(marker);
// }

// hide/show markers

var command = L.control({ position: "topright" });

command.onAdd = function (map) {
  var div = L.DomUtil.create("div", "command");

  div.innerHTML =
    '<input checked id="command" type="checkbox" name="chk"/><label class="chk"></label>';
  return div;
};

command.addTo(map);

function handleCommand(e) {
  console.log(e.target.checked);
  locationLayer.eachLayer(function (layer) {
    if (!e.target.checked) {
      layer.remove();
    } else {
      map.addLayer(layer);
    }
  });
}

document.getElementById("command").addEventListener("click", handleCommand);

var chkBox = document.getElementById("chk").value;

var productivity = {
  "Hide/Show": osm,
};

// Hide markers based on zoom level

map.on("zoomend", function () {
  var currentZoom = map.getZoom();
  if (currentZoom <= 4) {
    locationLayer.remove();
  } else if (currentZoom >= 9) {
    locationLayer.remove();
  } else {
    map.addLayer(locationLayer);
  }
});

// var tunnel = fetch("https://www.vegvesen.no/trafikkdata/api/", {
//   method: "POST",
//   headers: { "content-type": "application/json" },
//   body: JSON.stringify({
//     query: `{
//       trafficRegistrationPoints(searchQuery: {roadCategoryIds: [F] }) {
//         id
//         name
//         location {
//           coordinates {
//             latLon {
//               lat
//               lon
//             }
//           }
//         }
//       }
//     }`
//   })
// })
//   .then((response) => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error("NETWORK RESPONSE ERROR");
//     }
//   })
//   .then(data => {
//     console.log(data);
//     displayTunnel(data)
//   })
//   .catch((error) => console.error("FETCH ERROR:", error));

// function displayTunnel(data) {
//   var tunnelIcon = L.icon({
//     iconUrl: "images/black_marker.png",

//     iconSize: [50, 50],
//     iconAnchor: [0, 55],
//     popupAnchor: [30, -45],
//   });

//   tunnelMarker = L.marker([], {
//     icon: tunnelIcon,
//   });
//   tunnelMarker.addTo(map);
// }


// console.log(tunnel);
