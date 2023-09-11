let requestURL = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";

let buttonEl = document.getElementById('searchButton');
let cityEl = document.getElementById('searchCity');
let stateEl = document.getElementById('searchST');
console.log(buttonEl);
console.log(cityEl);
console.log(stateEl);

function checkWeather() {
    console.log('button is clicked');
    console.log(cityEl.value);
    console.log(stateEl.value);

    let city = cityEl.value;
    let state = stateEl.value;
    console.log("the city is " + city + " and the state is " + state);
}

buttonEl.addEventListener('click', checkWeather);