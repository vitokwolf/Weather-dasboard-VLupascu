var cityInputField = document.getElementById('city-input');
var cityDisplayed = document.getElementById('current-city-displayed');
var searchField = document.getElementById('search-form');
var currentCityTemp = document.getElementById('current-city-temp');
var currentCityHumidity = document.getElementById('current-city-humidity');
var currentCityWind = document.getElementById('current-city-wind');
var currentCityUV = document.getElementById('current-city-uv');
var currentCityIcon = document.getElementById('weather-icon');
var citiesArray = JSON.parse(localStorage.getItem('cities')) || [];
var apiKey = 'de36f3d17ff255fa1488513e597dbf11';

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
