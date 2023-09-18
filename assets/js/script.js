// let requestURL = "http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}";
const apiKey = "c86eb0623623101a8c7e3c242f3d9989";

const cityEl = document.getElementById('searchCity');
const stateEl = document.getElementById('searchST');
const cityTitleEl = document.getElementById('city-title');
const tempEl = document.getElementById('temp-0');
const humidityEl = document.getElementById('humidity-0');
const windEl = document.getElementById('wind-0');
const oldSearchEl = document.getElementById('old-searches');
const mainIconEl = document.getElementById('main-icon');
const submitEl = document.getElementById('search-div');
// console.log(submitEl);

let state = "";

let searchValues = JSON.parse(localStorage.getItem("prevSearches"));

// console.log(buttonEl);
// console.log(cityEl);
// console.log(stateEl);

function init() {
    oldSearchEl.textContent = "";
    if (searchValues) {
        for (let i = 1; i < searchValues.data.length; i++) {
            // console.log(searchValues);
            let buttonEl = document.createElement('button');
            buttonEl.setAttribute('class', 'prev-searches');
            buttonEl.setAttribute('type','submit');
            buttonEl.setAttribute('data-element', 'list');
            buttonEl.textContent = searchValues.data[i].city + ", " + searchValues.data[i].state;
            oldSearchEl.appendChild(buttonEl);
        }
    }
}

function showWeather(event) {
    event.preventDefault();
    // console.log('button is clicked');
    // console.log(cityEl.value);
    // console.log(stateEl.value);

    // console.log("test");
    // console.log(event.target);

    console.log(event);
    if (event.submitter.dataset.element === "search-bar") {
    

        let city = cityEl.value;
        state = stateEl.value;
        // console.log("the city is " + city + " and the state is " + state);
        getCoordinates(city, state);

        let newSearch = {city:city, state: state};

        if (!searchValues) {
            searchValues = {
                data : [{}]
            };
        }

        searchValues.data.push(newSearch);
        localStorage.setItem("prevSearches", JSON.stringify(searchValues));
        init();
    } else {
        let oldSearch = event.submitter.innerText.split(",");
        let city = oldSearch[0];
        state = oldSearch[1];
        getCoordinates(city, state);

        let newSearch = {city:city, state: state};

        if (!searchValues) {
            searchValues = {
                data : [{}]
            };
        }

    }

    // console.log(newSearch);
    // console.log(searchValues.data)
}

function getCoordinates(city, state) {
    const geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + ",us&limit=1&appid=" + apiKey;
    // console.log(geoURL);
    fetch(geoURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            // console.log(data);
            let lat = data[0].lat; //.slice(0,5);
            let long = data[0].lon; //.slice(0,4);
            // console.log("the late and long is " + lat + "    " + long);
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
            displayData(data);
        });
}

function displayData(data) {
    // console.log("temp/humidity/windspeed is ", temp, humidity, windSpeed);
    let temp = data.list[0].main.temp;
    // console.log(temp);
    let humidity = data.list[0].main.humidity;
    // console.log(humidity);
    let windSpeed = data.list[0].wind.speed;
    // console.log(windSpeed);
    let city = data.city.name;
    let currentDate = new Date(data.list[0].dt * 1000);
    let lastTime = new Date(data.list[39].dt * 1000);
    // console.log(currentDate);
    // console.log(lastTime);
    let month = currentDate.getMonth();
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();
    cityTitleEl.textContent = city + ", " + state + " (" + month + "/" + day + "/" + year + ")";
    // cityTitleEl.textContent = city + ", " + state + " (" + month + "/" + day + "/" + year + ")";
    tempEl.textContent = "Temp: " + temp + "° F";
    humidityEl.textContent = "Humidity: " + humidity + " %";
    windEl.textContent = "Wind: " + windSpeed + " mph";

    let weatherIcon = data.list[0].weather[0].icon;
    let iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
    // console.log(data);
    mainIconEl.setAttribute("src", iconURL);


    // console.log(data.list.length);
    let y = 1;
    for (let i = 0; i < data.list.length; i++) {
        let nextDay = new Date(data.list[i].dt * 1000);
        if (nextDay.getDate() === day + 1) {
            // console.log(nextDay.getDay());
            // console.log(y);
            let dailyEl = document.getElementById('day' + y);
            // console.log(dailyEl.children);
            let dailyTemp = data.list[i].main.temp;
            let dailyHumidity = data.list[i].main.humidity;
            let dailyWindSpeed = data.list[i].wind.speed;
            let dailyMonth = nextDay.getMonth();
            let dailyDay = nextDay.getDate();
            let dailyYear = nextDay.getFullYear();
            let weatherIcon = data.list[i].weather[0].icon;
            let iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

            dailyEl.children[1].setAttribute('src', iconURL);
            dailyEl.children[0].textContent = dailyMonth + "/" + dailyDay + "/" + dailyYear;
            dailyEl.children[2].children[0].textContent = "Temp: " + dailyTemp + "° F";
            dailyEl.children[2].children[1].textContent = "Wind: " + dailyWindSpeed + " mph";
            dailyEl.children[2].children[2].textContent = "Humidity: " + dailyHumidity + " %";
            day++;
            y++;
        }
    }
}

init();

submitEl.addEventListener('submit', showWeather);