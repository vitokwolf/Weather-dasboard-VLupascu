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
        console.log(currentCity);
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
};
// call function on click
searchField.addEventListener("submit", formSubmitHandler);
// End search city

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
