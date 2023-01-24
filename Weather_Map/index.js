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
  })
  .addTo(map);

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

//leaflet layer control

var baseMaps = {
  "Basic Dark Theme": basicDark,
  "Basic light Theme": basicLight,
  Advanced: advanced,
};

map.addControl(new L.Control.Fullscreen());

L.control.locate().addTo(map);

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

// leaflet layer control

L.control.layers(baseMaps).addTo(map);

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
