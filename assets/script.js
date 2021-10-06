searchContainerEl = document.querySelector("#search-container");
searchBtnEls = document.querySelectorAll(".searchBtn");
cityTextEl = document.querySelector("#city-text");
previousSearchEl = document.querySelector("#previous-search");
currentWeatherContainer = document.querySelector("#current-weather");
fiveDayContainer = document.querySelector("#five-day-container");

var archive = JSON.parse(window.localStorage.getItem('cities')) || [];

var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
var apiUrlOneCall = "https://api.openweathermap.org/data/2.5/onecall?"
var apiKey = "&appid=c56a7ec985604e456420329bbe0f3d58";

// Event listener for the search button
$("#search-container").on('click', '.searchBtn', function(event){
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        console.log("search button checked");
        var city = $("#search-container").find("input").val();
        console.log(city);
        if(archive.indexOf(city) === -1) {
          archive.push(city);
          window.localStorage.setItem('cities', JSON.stringify(archive))
          previousButton(city);
        }
        localStorage.setItem("city", city);
        getLatLon();
});

// Event listener for the previous searches
$('#previous-search').on('click', 'button', function() {
  getLatLon($(this).text())
  localStorage.setItem('city', $(this).text())
})

// Adds the previous searches as buttons
function previousButton(citiesHistory) {
  var btn = $('<button>').addClass('btn btn-secondary col-12').text(citiesHistory).css("margin-bottom", "10px")
  $('#previous-search').append(btn)
}

// This function can request the daily weather only, but the object returned contains lat and lon for the next api call with the 5 day
function getLatLon (cityInput) {
    var city = localStorage.getItem("city");
    var search = apiUrl + city.split(' ').join('+') + apiKey;
    console.log(search);

    fetch(search)
      .then(function (response) {
        if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
                var latitude = data.coord.lat;
                var longitude = data.coord.lon;
                console.log(latitude, longitude);
                var exclude = "&exclude=minutely,hourly";
                var units = "&units=imperial";
                var newSearch = apiUrlOneCall + "lat=" + latitude + "&lon=" + longitude + units + exclude + apiKey;
                requestWeather(newSearch);
                console.log(newSearch);
                console.log(data);
        });
      } else {
        alert('Error: ' + response.statusText);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to OpenWeatherApp');
    });
};

// This function returns the current and five day forecast and dynamically creates the elements for the page
function requestWeather (newSearch) {
    fetch(newSearch)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          $('#current-weather').empty();
          $('#five-day-container').empty();
          console.log(data);
          dataObj = data;
          var h2El = document.createElement("h2");
          var city = localStorage.getItem("city");
          var dateString = moment.unix(data.current.dt).format("MM/DD/YYYY");
          h2El.textContent = city + " " + dateString;
          var weatherIcon = document.createElement("img");
          var iconcode = data.current.weather[0].icon;
          var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
          weatherIcon.setAttribute('src', iconurl);
          var list = document.createElement("ul");
          var currentTemp = document.createElement("li");
          currentTemp.textContent = "Temp: " + data.current.temp + " °F";
          var currentWind = document.createElement("li");
          currentWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
          var currentHumidity = document.createElement("li");
          currentHumidity.textContent = "Humidity: " + data.current.humidity + "%";
          var currentUv = document.createElement("li");
          var UVbtn = document.createElement('button');
          UVbtn.textContent = data.current.uvi
          if(data.current.uvi < 4) {
            UVbtn.classList = "btn-success"
          } else if( data.current.uvi < 7 ) {
            UVbtn.classList = 'btn-warning'
          } else {
            UVbtn.classList = 'btn-danger';
          }
          currentUv.textContent = "UV Index: ";
          currentUv.appendChild(UVbtn)
          list.append(h2El, weatherIcon, currentTemp, currentWind, currentHumidity, currentUv);
          currentWeatherContainer.append(h2El, list);

            for (var i = 1; i < dataObj.daily.length - 2; i++) {
                var weatherCard = document.createElement('div');
                weatherCard.classList.add('col-2', 'card', 'weatherCard');
                weatherCard.style.marginLeft = '25px';

                var weatherBody = document.createElement('div');
                weatherBody.classList.add('card-body');

                var weatherList = document.createElement('ul');
                weatherList.style.listStyle = 'none'
                weatherList.style.paddingLeft = '0px'

                var dateEl = document.createElement('h5');
                dateEl.textContent = moment.unix(dataObj.daily[i].dt).format("MM/DD/YYYY");

                var weatherIcon = document.createElement("img");
                var iconcode = data.daily[i].weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                weatherIcon.setAttribute('src', iconurl);

                var tempEl = document.createElement('li');
                tempEl.textContent = "Temp: " + dataObj.daily[i].temp.day + " °F";

                var windEl = document.createElement('li');
                windEl.textContent = "Wind: " + dataObj.daily[i].wind_speed + " MPH";

                var humidityEl = document.createElement('li');
                humidityEl.textContent = "Humidity: " + dataObj.daily[i].humidity + "%";

                weatherList.append(tempEl, windEl, humidityEl);
                weatherBody.append(dateEl, weatherIcon, weatherList);
                weatherCard.append(weatherBody);
                fiveDayContainer.append(weatherCard);

            }




      })
    
};

// Loop to keep track of the previously searched cities
for(var i = 0; i < archive.length; i ++) {
  previousButton(archive[i]);
}
