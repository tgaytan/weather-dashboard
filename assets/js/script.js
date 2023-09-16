// let requestURL = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
const apiKey = "c86eb0623623101a8c7e3c242f3d9989";
const testURL = "http://api.openweathermap.org/geo/1.0/direct?q=austin,tx,us&limit=1&appid=" + apiKey;


let buttonEl = document.getElementById('searchButton');
let cityEl = document.getElementById('searchCity');
let stateEl = document.getElementById('searchST');
// console.log(buttonEl);
// console.log(cityEl);
// console.log(stateEl);

function showWeather() {
    console.log('button is clicked');
    // console.log(cityEl.value);
    // console.log(stateEl.value);

    let city = cityEl.value;
    let state = stateEl.value;
    console.log("the city is " + city + " and the state is " + state);
    getCoordinates(city, state);
}

buttonEl.addEventListener('click', showWeather);

function getCoordinates(city, state) {
    const geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + ",us&limit=1&appid=" + apiKey;
    let geoPosition = [];
    // console.log(geoURL);
    fetch(geoURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log(data);
            let lat = data[0].lat; //.slice(0,5);
            let long = data[0].lon; //.slice(0,4);
            console.log(lat + "    " + long);
            getWeatherData(lat, long);
        });
}

function getWeatherData(lat, long) {
    // console.log("lat, long")
    let weatherURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;
    // console.log(weatherURL);
    fetch(weatherURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // console.log(data);
            let temp = data.list[0].main.temp;
            // console.log(temp);
            let humidity = data.list[0].main.humidity;
            // console.log(humidity);
            let windSpeed = data.list[0].wind.speed;
            // console.log(windSpeed);
            displayData(temp, humidity, windSpeed);
        });
}

function displayData(temp, humidity, windSpeed) {
    console.log("temp/humidity/windspeed is ", temp, humidity, windSpeed);
}