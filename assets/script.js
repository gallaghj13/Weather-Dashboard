searchContainerEl = document.querySelector("#search-container");
searchBtnEls = document.querySelectorAll(".searchBtn");
cityTextEl = document.querySelector("#city-text");

var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiKey = "&appid=c56a7ec985604e456420329bbe0f3d58";


$("#search-container").on('click', '.searchBtn', function(event){
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log("search button checked");
        var city = $("#search-container").find("input").val();
        console.log(city);
        localStorage.setItem("city", city);
        requestWeather();
});

function requestWeather () {
    var city = localStorage.getItem("city");
    var search = apiUrl + city.split(' ').join('') + apiKey;
    console.log(search);

    fetch(search)
      .then(function (response) {
        if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
        //   displayRepos(data, user);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeatherApp');
    });
    // displayWeather();
};

function displayWeather () {

};