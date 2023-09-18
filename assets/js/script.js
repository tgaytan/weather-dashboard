const apiKey = "c86eb0623623101a8c7e3c242f3d9989";

// storing elements in variables
const cityEl = document.getElementById('searchCity');
const stateEl = document.getElementById('searchST');
const cityTitleEl = document.getElementById('city-title');
const tempEl = document.getElementById('temp-0');
const humidityEl = document.getElementById('humidity-0');
const windEl = document.getElementById('wind-0');
const oldSearchEl = document.getElementById('old-searches');
const mainIconEl = document.getElementById('main-icon');
const submitEl = document.getElementById('search-div');

// defining this variable outside of functions since the Weather API
// does not provide state information back. need to save it from user input
let state;

// pulling from local storage and saving in object
// if local storage is empty, then format of object is defined
let searchValues = JSON.parse(localStorage.getItem("prevSearches"));
if (!searchValues) {
    searchValues = {
        data : [{}]
    };
}

// this function runs when the page is first loaded, and also when a new search is done
// it gets prevoius searches and displays them on the webpage
function init() {
    oldSearchEl.textContent = ""; // clearing out the content to start off brand new

    // condition in if statement checks if searchValues already has data. runs if it does
    if (searchValues) {
        for (let i = 1; i < searchValues.data.length; i++) {
            // creating button elements with attributes
            // then setting the content to have previous searches and appending it
            let buttonEl = document.createElement('button');
            buttonEl.setAttribute('class', 'prev-searches');
            buttonEl.setAttribute('type','submit');
            buttonEl.setAttribute('data-element', 'list');
            buttonEl.textContent = searchValues.data[i].city + ", " + searchValues.data[i].state;
            oldSearchEl.appendChild(buttonEl);
        }
    }
}

// this function gets the user input from either the search bar or from previous searches
// then it takes the input (city/state) and calls a function to convert to coordinates
function getCity(event) {
    event.preventDefault(); // stop pages from refreshing

    // checking if the event came from the search bar, or if it came from one of the old searches
    // it checks the data-element attributed I added to the elements
    if (event.submitter.dataset.element === "search-bar") {
        // this block runs if the event came from the search bar
        // it gets the city and state values from the input elements
        let city = cityEl.value;
        state = stateEl.value;
        getCoordinates(city, state); // function that converts city/state to lat and lon coordinates

        // storing the city and state from user in an object. this will be pushed into an array later
        let newSearch = {city:city, state: state};

        // pushing the new search into an object.arry, then storing in local storage
        // then calling init function which will add the new search to previous searches section
        searchValues.data.push(newSearch);
        localStorage.setItem("prevSearches", JSON.stringify(searchValues));
        init();
    } else {
        // this block runs if the event came from one of the previous searches
        // it gets the city and state values from the previous search
        let oldSearch = event.submitter.innerText.split(",");
        let city = oldSearch[0];
        state = oldSearch[1].trim();
        getCoordinates(city, state); //function that converts city/state to lat and lon coordintes
    }
}

// this function takes the city/state values and converts to coordinates using OpenWeather API
// it then passes the lat and lon into a function getWeatherData that gets weather based on coordinates
function getCoordinates(city, state) {
    const geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + ",us&limit=1&appid=" + apiKey;
    fetch(geoURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let lat = data[0].lat;
            let long = data[0].lon;
            getWeatherData(lat, long);
        });
}

// this function takes the coordinates of a city and gets the data back from the OpenWeather API
// the data returned from the API is then sent to the function displayData
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

// this function takes the data from the OpenWeather API and gets the temp, humidity, wind, icon, and displays it to the webpage
function displayData(data) {
    // getting temp, humidity, wind, and city from API
    let temp = data.list[0].main.temp;
    let humidity = data.list[0].main.humidity;
    let windSpeed = data.list[0].wind.speed;
    let city = data.city.name;

    // getting weather icon ID and then created URL with the icon ID
    let weatherIcon = data.list[0].weather[0].icon;
    let iconURL = "https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

    // getting date from API
    let currentDate = new Date(data.list[0].dt * 1000);
    let month = currentDate.getMonth();
    let day = currentDate.getDate();
    let year = currentDate.getFullYear();
    
    // displaying data for today onto webpage
    cityTitleEl.textContent = city + ", " + state + " (" + month + "/" + day + "/" + year + ")";
    mainIconEl.setAttribute("src", iconURL);
    tempEl.textContent = "Temp: " + temp + "° F";
    humidityEl.textContent = "Humidity: " + humidity + " %";
    windEl.textContent = "Wind: " + windSpeed + " mph";

    // a loop that goes through the data and pulls/displays it for the 5 day weather forecast
    let y = 1; // this variable is used as a selector in getElementById
    for (let i = 0; i < data.list.length; i++) {
        let nextDay = new Date(data.list[i].dt * 1000);

        // this if statement checks if the date is equal to the current day + 1. then increases day by 1
        // if the code runs, it gets the weather data and prints it to the webpage
        if (nextDay.getDate() === day + 1) {
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

// this runs when the browser loads the page and displays old searches
init();

submitEl.addEventListener('submit', getCity);