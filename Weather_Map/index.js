var weatherApi = [
  { name: "Oslo", lat: 59.91, lng: 10.74 },
  { name: "Bergen", lat: 60.39, lng: 5.32 },
  { name: "Trondheim", lat: 63.43, lng: 10.40 },
  { name: "Hammerfest", lat: 70.66, lng: 23.67 },
  { name: "Tromsø", lat: 69.64, lng: 18.97 },
  { name: "Stockholm", lat: 59.33, lng: 18.07 },
  { name: "København", lat: 55.65, lng: 12.60 },
  { name: "London", lat: 51.50, lng: -0.12 },
  { name: "Berlin", lat: 52.52, lng: 13.42 },
  { name: "Amsterdam", lat: 52.36, lng: 4.90 },
  { name: "Helsinki", lat: 60.17, lng: 24.95 },
  { name: "Reykjavik", lat: 64.13, lng: -21.88 },
];

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
      console.log(data.properties.timeseries[0])

      var weatherIcon = L.icon({
        iconUrl: `Assets/weather_icons/${weather.data.next_1_hours.summary.symbol_code}.png`,

        iconSize: [50, 50],
        iconAnchor: [0, 55],
        popupAnchor: [30, -45],
      });

      locationMarker = L.marker([location.lat, location.lng], {
        icon: weatherIcon,
      }).addTo(map);
      locationMarker.bindPopup(
        `Det er ${Math.round(
          weather.data.instant.details.air_temperature
        )}°C i ${location.name}!`
      );
    });
}
var map = L.map("map").setView([58.97, 5.73], 5);

L.tileLayer(
  "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  {
    minZoom: 5,
  }
).addTo(map);

var popup;

var newMarker = {};
map.on("click", function (e) {
  fetch(
    "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=" +
      e.latlng.lat +
      "&lon=" +
      e.latlng.lng
  )
    .then((r) => r.json())
    .then((data) => {
      lat = e.latlng.lat;
      lon = e.latlng.lng;
      console.log("You clicked the map at LAT: " + lat + " and LONG: " + lon);
      if (newMarker != undefined) {
        map.removeLayer(newMarker);
      }
      var weather = data.properties.timeseries[0];

      var weatherIcon = L.icon({
        iconUrl: `Assets/weather_icons/${weather.data.next_1_hours.summary.symbol_code}.png`,

        iconSize: [50, 50],
        iconAnchor: [20, 20],
        popupAnchor: [0, -10],
      });

      newMarker = L.marker([lat, lon], { icon: weatherIcon }).addTo(map);
      newMarker
        .bindPopup(
          `Det er ${Math.round(
            weather.data.instant.details.air_temperature
          )}°C!`
        )
        .openPopup();
    });
});

if ((newMarker = onclick)) {
  map.removeLayer(newMarker);
}
