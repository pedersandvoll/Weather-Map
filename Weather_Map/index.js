let weatherApiUrl = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=58.97&lon=5.73'
let weatherApiUrl2 = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.91&lon=10.74'
let weatherApiUrl3 = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=60.39&lon=5.32'
let weatherApiUrl4 = 'https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=63.43&lon=10.40'



async function fetchWeather() {
    const response = await fetch(weatherApiUrl);
    console.log(response)
    return await response.json();
}
async function fetchWeather2() {
    const response = await fetch(weatherApiUrl2);
    console.log(response)
    return await response.json();
}
async function fetchWeather3() {
    const response = await fetch(weatherApiUrl3);
    console.log(response)
    return await response.json();
}
async function fetchWeather4() {
    const response = await fetch(weatherApiUrl4);
    console.log(response)
    return await response.json();
}
var map = L.map('map').setView([58.97, 5.73], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 5,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var newMarker = {};
  map.on('click',function(e){
    lat = e.latlng.lat;
    lon = e.latlng.lng;
    console.log("You clicked the map at LAT: "+ lat+" and LONG: "+lon );
        if (newMarker != undefined) {
            map.removeLayer(newMarker);
        };
    newMarker = L.marker([lat,lon]).addTo(map);
});

if (theMarker = onclick){
    map.removeLayer(newMarker)
}


fetchWeather().then((weatherArray) => {
    console.log(weatherArray)
    for (let weather of weatherArray.properties.timeseries) { 
        var stavanger = L.icon({
            iconUrl: `Assets/weather_icons/${(weather.data.next_1_hours.summary.symbol_code)}.png`,
            
            iconSize:     [50, 50],
            iconAnchor:   [20, 20],
            popupAnchor:  [0, 0],
        });
        var stavanger = L.marker([58.97, 5.73], {icon: stavanger}).addTo(map);
        stavanger.bindPopup(`Det er ${Math.round(weather.data.instant.details.air_temperature)}°C i Stavanger!`);
    }
})
fetchWeather2().then((weatherArray) => {
    console.log(weatherArray)
    for (let weather of weatherArray.properties.timeseries) {  
        var oslo = L.icon({
            iconUrl: `Assets/weather_icons/${(weather.data.next_1_hours.summary.symbol_code)}.png`,
            
            iconSize:     [50, 50],
            iconAnchor:   [20, 20],
            popupAnchor:  [0, 0]
        });
        var oslo = L.marker([59.91, 10.74], {icon: oslo}).addTo(map);
        oslo.bindPopup(`Det er ${Math.round(weather.data.instant.details.air_temperature)}°C i Oslo!`);
        });
    }
})
fetchWeather3().then((weatherArray) => {
    console.log(weatherArray)
    for (let weather of weatherArray.properties.timeseries) {  
        var bergen = L.icon({
            iconUrl: `Assets/weather_icons/${(weather.data.next_1_hours.summary.symbol_code)}.png`,
            
            iconSize:     [50, 50],
            iconAnchor:   [20, 20],
            popupAnchor:  [0, 0]
        });
        var bergen = L.marker([60.39, 5.32], {icon: bergen}).addTo(map);
        bergen.bindPopup(`Det er ${Math.round(weather.data.instant.details.air_temperature)}°C i Bergen!`);
    }
})
fetchWeather4().then((weatherArray) => {
    console.log(weatherArray)
    for (let weather of weatherArray.properties.timeseries) {  
        var trondheim = L.icon({
            iconUrl: `Assets/weather_icons/${(weather.data.next_1_hours.summary.symbol_code)}.png`,
            
            iconSize:     [50, 50],
            iconAnchor:   [20, 20],
            popupAnchor:  [0, 0]
        });
        var trondheim = L.marker([63.43, 10.40], {icon: trondheim}).addTo(map);
        trondheim.bindPopup(`Det er ${Math.round(weather.data.instant.details.air_temperature)}°C i Trondheim!`);
    }
})
