var cityInputField = document.getElementById('city-input');
var previousSearches = document.getElementById('history');
var cityDisplayed = document.getElementById('current-city-displayed');
var searchField = document.getElementById('search-form');
var currentCityTemp = document.getElementById('current-city-temp');
var currentCityHumidity = document.getElementById('current-city-humidity');
var currentCityWind = document.getElementById('current-city-wind');
var currentCityUV = document.getElementById('current-city-uv');
var currentCityIcon = document.getElementById('weather-icon');
var citiesArray = JSON.parse(localStorage.getItem('cities')) || [];
var apiKey = 'de36f3d17ff255fa1488513e597dbf11';

// Start search city
function formSubmitHandler(event) {
    event.preventDefault();
    var currentCity = cityInputField
        .value
        .trim();
    // check if any city was entered
    if (currentCity) {
        // check if searched city was searched before
        if (citiesArray.indexOf(currentCity) === -1) {
            // if not present in the localStorage push in the array and save
            citiesArray.push(currentCity);
            cityDisplayed.innerHTML = currentCity;
            localStorage.setItem("cities", JSON.stringify(citiesArray));
            // create a new button for the searched city
            var newBtn = document.createElement("button");
            newBtn.classList = "btn btn-outline-primary btn-lg btn-block city-btn";
            newBtn.setAttribute("id", "city-" + currentCity)
            newBtn.innerHTML = currentCity;
            // append it to history container
            previousSearches.appendChild(newBtn);
        };
        // clear search form
        cityInputField.value = "";
        displayCurrentWeather(currentCity);
    } else {
        alert('Please Enter a City Name');
    }
};
// call function on click
searchField.addEventListener("submit", formSubmitHandler);
// End search city

// Start render search history
function searchHistory() {
    for (var i = 0; i < citiesArray.length; i++) {
        var newBtn = document.createElement("button");
        previousSearches.appendChild(newBtn);
        newBtn.classList = "btn btn-outline-primary btn-lg btn-block city-btn";
        newBtn.setAttribute("id", "city-" + citiesArray[i])
        newBtn.innerHTML = citiesArray[i];
    }
};
searchHistory();
// End render search history

// Start create dates and times across the page
function displayDate() {
    // header
    var todayDate = moment().format('dddd, MMMM Do');
    var todayEl = $('#current-date');
    todayEl.text(todayDate);
    // today
    var currentHour = moment().format('h:mm A');
    var todayDiv = $('#currentDay');
    todayDiv.text(currentHour);
    // 5 day forecast
    var fiveDay1 = moment().add(1, 'day').format('l');
    var forecastDate1 = $('#date1');
    forecastDate1.text(fiveDay1);

    var fiveDay2 = moment().add(2, 'day').format('l');
    var forecastDate2 = $('#date2');
    forecastDate2.text(fiveDay2);

    var fiveDay3 = moment().add(3, 'day').format('l');
    var forecastDate3 = $('#date3');
    forecastDate3.text(fiveDay3);

    var fiveDay4 = moment().add(4, 'day').format('l');
    var forecastDate4 = $('#date4');
    forecastDate4.text(fiveDay4);

    var fiveDay5 = moment().add(5, 'day').format('l');
    var forecastDate5 = $('#date5');
    forecastDate5.text(fiveDay5);
};

displayDate();
// End create dates and times across the page

// Start Current weather
function displayCurrentWeather(currentCity) {
    // display city as a header on current weather container
    cityDisplayed.innerHTML = currentCity;
    // fetch first data from weather api
    fetch('https://api.openweathermap.org/data/2.5/weather?q='
        + currentCity
        + '&appid='
        + apiKey
        + '&units=imperial'
    )
        // check if a known city was entered
        .then(function (weatherResponse) {
            if (weatherResponse.ok) {
                return weatherResponse.json();
            } else {
                alert('Error: City not Found!');
            }
        })
        .then(function (weatherResponse) {
            console.log(weatherResponse);
            // fetch the uv data
            fetch(
                'https://api.openweathermap.org/data/2.5/uvi?appid='
                + apiKey
                + '&lat='
                + weatherResponse.coord.lat
                + '&lon='
                + weatherResponse.coord.lon
            )
                .then(function (response) {
                    return response.json();
                })
                .then(function (response) {
                    console.log(weatherResponse);
                    console.log(response);
                    // create variables for each data value we need
                    var uvIndex = response.value
                    var temperatureValue = Math.round(weatherResponse.main.feels_like);
                    var humidityValue = weatherResponse.main.humidity;
                    var windSpeedValue = weatherResponse.wind.speed;
                    var uvIndexValue = JSON.stringify(uvIndex);
                    var weatherIcon = weatherResponse.weather[0].icon;
                    var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
                    // Append current weather values to <span> elements within the current weather container
                    currentCityTemp.textContent = temperatureValue;
                    currentCityHumidity.textContent = humidityValue;
                    currentCityWind.textContent = windSpeedValue;
                    currentCityUV.textContent = uvIndexValue;//Please remember that data is provided only for 12:00 p.m.
                    // change the color of UV index
                    if (uvIndexValue < 3) {
                        currentCityUV.setAttribute("class", "badge badge-success")
                    } else if (uvIndexValue > 7) {
                        currentCityUV.setAttribute("class", "badge badge-danger")
                    } else if (uvIndexValue >= 3 && uvIndexValue <= 7) {
                        currentCityUV.setAttribute("class", "badge badge-warning")
                    };
                    currentCityIcon.setAttribute("src", iconUrl);
                    cityDisplayed.innerHTML = currentCity;
                })
        })
};
// End current weather

