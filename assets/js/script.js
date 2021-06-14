// Start global variable
var cityInputField = document.getElementById('city-input');
var previousSearches = document.getElementById('history');
var clearHistory = document.getElementById('clear');
var cityDisplayed = document.getElementById('current-city-displayed');
var searchField = document.getElementById('search-form');
var currentCityTemp = document.getElementById('current-city-temp');
var currentCityHumidity = document.getElementById('current-city-humidity');
var currentCityWind = document.getElementById('current-city-wind');
var currentCityUV = document.getElementById('current-city-uv');
var currentCityIcon = document.getElementById('weather-icon');
var currentWeatherCondition = document.getElementById('weather-condition');
var citiesArray = JSON.parse(localStorage.getItem('cities')) || [];
var apiKey = 'de36f3d17ff255fa1488513e597dbf11';
// End global variables

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
            // show weather upon clicking newly created btn
            newBtn.setAttribute("value", currentCity);
            newBtn.onclick = function (event) {
                var city = $(this).attr("value"); // After setting the attribute, use jQuery to target said attribute.
                // call the functions to show the weather 
                displayCurrentWeather(city);
                displayForecast(city);
                showForecast();
            }
        };
        // clear search form
        cityInputField.value = "";
        // call the functions to show the weather
        displayCurrentWeather(currentCity);
        displayForecast(currentCity);
        showForecast();
    } else {
        alert('Please Enter a City Name');
    }
};
// call function on click
searchField.addEventListener("submit", formSubmitHandler);
// End search city

// Start render search history
function searchHistory() {
    for (let i = 0; i < citiesArray.length; i++) {
        var newBtn = document.createElement("button");
        previousSearches.appendChild(newBtn);
        newBtn.classList = "btn btn-outline-primary btn-lg btn-block city-btn";
        newBtn.setAttribute("id", "city-" + citiesArray[i])
        newBtn.innerHTML = citiesArray[i];
        // call the function to render weather for the clicked btn
        newBtn.onclick = function (event) {
            var city = event.target.textContent;
            displayCurrentWeather(city);
            displayForecast(city);
            showForecast();
        }
    }

};
// End render search history

// Start clear history
clearHistory.addEventListener('click', function () {
    var accept = confirm('Search History will be cleared! Do you want to proceed?');
    if (accept === true) {
        localStorage.clear();
        window.location.reload();
    }
});
// End clear history

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
                weatherResponse.json().then(function (weatherResponse) {
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
                            // create variables for each data value we need
                            var uvIndex = response.value
                            var temperatureValue = Math.round(weatherResponse.main.feels_like);
                            var humidityValue = weatherResponse.main.humidity;
                            var windSpeedValue = weatherResponse.wind.speed;
                            var uvIndexValue = JSON.stringify(uvIndex);
                            var weatherIcon = weatherResponse.weather[0].icon;
                            var currentWeatherCond = weatherResponse.weather[0].description;
                            var iconUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
                            // Append current weather values to <span> elements within the current weather container
                            currentWeatherCondition.textContent = currentWeatherCond.toUpperCase();
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
            } else {
                alert('Error: City not Found!');
            }
        })
};
// End current weather

// Start 5 day forecast
function displayForecast(currentCity) {
    // fetch forecast data
    fetch('https://api.openweathermap.org/data/2.5/forecast?q='
        + currentCity
        + '&appid='
        + apiKey
        + '&units=imperial'
    )
        .then(function (forecastResponse) {
            if (forecastResponse.ok) {
                forecastResponse.json().then(function (forecastResponse) {
                    // initialize an array to save the data we need
                    var dates = [];
                    // itterate thru weather api data and choose what we need
                    for (let i = 0; i < forecastResponse.list.length; i++) {
                        // create a var to use ONLY the data as of 3:00 PM, 
                        var highTemp = forecastResponse.list[i]["dt_txt"].split(" ")[1].split(":")[0] == 15;
                        if (highTemp) {
                            // populate with weather data from this object
                            dates.push(forecastResponse.list[i]);
                        }
                    };
                    // console.log(dates);

                    // itterate thru newly created array of data as of 3pm, and render the inforamtion in our forecast cards
                    // high temp
                    for (let i = 0; i < dates.length; i++) {
                        var cardTemp = document.getElementsByClassName("forecast-temp");
                        cardTemp[i].innerHTML = Math.round(dates[i].main.temp) + "&#8457;";
                        // humidity
                        var cardHumidity = document.getElementsByClassName("forecast-humidity");
                        cardHumidity[i].innerHTML = dates[i].main.humidity + "%";
                        // icons
                        var cardIcon = document.getElementsByClassName("forecast-icon");
                        var cardIconId = dates[i].weather[0].icon
                        var cardIconUrl = "http://openweathermap.org/img/w/"
                            + cardIconId
                            + ".png";
                        cardIcon[i].setAttribute("src", cardIconUrl);
                    }
                })
            } else {
                return;
            }
        })
};
// End 5 day forecast

// Show the Weather Forecast
function showForecast() {
    document.getElementById("forecast-container").style.display = "inline-block";
};

// Call functions on reload or open the page
searchHistory();
displayDate();