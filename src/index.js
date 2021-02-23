// current time & day of the week
function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  return `Last updated: ${formatDay(timestamp)} ${hour}:${minute}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp);
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let weekDay = weekDays[date.getDay()];
  return `${weekDay}`
}

function formatForecastDate(timestamp) {
  let date = new Date(timestamp);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let month = months[date.getMonth()];
  let monthDay = date.getDate();
  return `${monthDay} ${month}`;
}


function formatLocalTime (timestamp) {
  let date = new Date(timestamp);
  console.log(date);
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }  
  console.log(hour);
  return `${hour}:${minute}`;
}  


// weather forecast
function showWeatherForecast(response) {
  let forecastElement = document.querySelector(".forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    forecast = response.data.daily[index]; 
    cTempMaxForecast = Math.round(forecast.temp.max);
    cTempMinForecast = Math.round(forecast.temp.min);
    forecastElement.innerHTML += `
      <div class="col daily">
        <p><span class="daily-weekday">${formatDay(forecast.dt*1000)}</span><br><span class="daily-date">${formatForecastDate(forecast.dt*1000)}</span></p> 
        <p class="daily-temp"><span class="forecast-max">${cTempMaxForecast}</span>°<small>/<span class="forecast-min"> ${cTempMinForecast}</span>°</small></p>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="" class="daily-image">
      </div>`;
  }    
}
function getForecastCoords(response) {
  let key = `ecc7fef62a02dbb22a9dbe2d8e3727b7`;
  let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.lat}&lon=${response.lon}&appid=${key}&units=metric`;
  axios.get(urlForecast).then(showWeatherForecast);
}

// display searched city & live weather data
function showTodaysWeather(response) {
  //console.log(response.data.timezone);
  document.querySelector("h2").innerHTML = response.data.name;
  document.querySelector("h5").innerHTML = formatDate(response.data.dt*1000);
  cTemp = response.data.main.temp;
  document.querySelector(".main-temp").innerHTML = `${Math.round(cTemp)}`;
  feelsLikeTemp = response.data.main.feels_like;
  document.querySelector(".feels-like").innerHTML = `${Math.round(feelsLikeTemp)}`
  document.querySelector("#wind").innerHTML = `${response.data.wind.speed}m/s`;
  document.querySelector("#humidity").innerHTML = `${response.data.main.humidity}%`;
  document.querySelector(".today-description").innerHTML = `${response.data.weather[0].main}`;
  getForecastCoords(response.data.coord);
  document.querySelector(".today-weather-image").setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`); 
  document.querySelector(".today-weather-image").setAttribute("alt", `http://openweathermap.org/img/wn/${response.data.weather[0].description}@2x.png`);
  cLink.classList.add("active");
  fLink.classList.remove("active");
  cLink.removeEventListener("click", displayC);
  fLink.addEventListener("click", displayF); 

  let localTimestamp = ((response.data.dt + response.data.timezone) * 1000);
  document.querySelector(".local-time").innerHTML = `${formatLocalTime(localTimestamp)}`;
  /*if (celsius.classList.contains("active")) { IMPLEMENT THIS INSTEAD OF THE ABOVE
    displayC ();
  } else {
    displayF ();
  };*/
} 

function search(city) {
  let key = `ecc7fef62a02dbb22a9dbe2d8e3727b7`;
  let celsius = document.querySelector(".c-link");
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${key}`;
  axios.get(url).then(showTodaysWeather);
}

function getSearchedCity(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value.trim().toLowerCase();
  /*cLink.classList.add("active");
  fLink.classList.remove("active");
  cLink.removeEventListener("click", displayC);*/
  search(city);
}

let searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", getSearchedCity);


// my location
function handlePosition(position) {
  let key = `ecc7fef62a02dbb22a9dbe2d8e3727b7`;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${key}`;
  axios.get(url).then(showTodaysWeather);

  let urlForecast = `https://https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${key}&units=metric`;
  axios.get(urlForecast).then(showWeatherForecast);
}
function findLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let locationButton = document.querySelector(".my-location-button");
locationButton.addEventListener("click", findLocation);

// c-f link funtion
function displayF(event) {
  event.preventDefault();
  let tempElement = document.querySelector(".main-temp");
  let feelsLikeElement = document.querySelector(".feels-like");
  cLink.classList.remove("active");
  fLink.classList.add("active");
  cLink.addEventListener("click", displayC);
  fLink.removeEventListener("click", displayF);
  tempElement.innerHTML = Math.round((cTemp * 1.8) + 32);
  feelsLikeElement.innerHTML = Math.round((feelsLikeTemp * 1.8) + 32);

  //display forecast F
  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function(temp) {
    maxForecast = temp.innerHTML;
    temp.innerHTML = Math.round((maxForecast * 9) / 5 + 32);
  })

  let forecastMin = document.querySelectorAll(".forecast-min");
  forecastMin.forEach(function(temp) {
    minForecast = temp.innerHTML;
    temp.innerHTML = Math.round((minForecast * 9) / 5 + 32);
  })
  cLink.addEventListener("click", displayC);
  fLink.removeEventListener("click", displayF);
}
function displayC(event) {
  event.preventDefault();
  let tempElement = document.querySelector(".main-temp");
  let feelsLikeElement = document.querySelector(".feels-like");
  cLink.classList.add("active");
  fLink.classList.remove("active");
  tempElement.innerHTML = Math.round(cTemp); 
  feelsLikeElement.innerHTML = Math.round(feelsLikeTemp);


  //display forecast C
  let forecastMax = document.querySelectorAll(".forecast-max");
  forecastMax.forEach(function(temp) {
    maxForecast = temp.innerHTML;
    temp.innerHTML = Math.round(((maxForecast - 32) * 5) / 9);
  })

  let forecastMin = document.querySelectorAll(".forecast-min");
  forecastMin.forEach(function(temp) {
    minForecast = temp.innerHTML;
    temp.innerHTML = Math.round(((minForecast - 32) * 5) / 9);
  })
  fLink.addEventListener("click", displayF);
  cLink.removeEventListener("click", displayC);
}

let cTemp = null;
let feelsLikeTemp = null;
let maxForecast = null;
let minForecast = null;

let fLink = document.querySelector(".f-link");
fLink.addEventListener("click", displayF);
let cLink = document.querySelector(".c-link");


//always show on load
search("london");





  // add feels like on the app
  //let feelsLike = document.querySelector("#feels-like");
  //feelsLike.innerHTML = `${Math.round(response.data.main.feels_like)}°C`;
  //console.log(Math.round(response.data.main.feels_like))

  //add min, max temp to the app
  /*let maxTemp = document.querySelector("#max-temp");
  maxTemp.innerHTML = `${Math.round(response.data.main.temp_max)}°C`
  let minTemp = document.querySelector("#min-temp");
  maxTemp.innerHTML = `${Math.round(response.data.main.temp_min)}°C`*/



/*// SUNRISE
  let unixSunrise = response.data.sys.sunrise;
  let sunriseDate = new Date(unixSunrise * 1000);
  
  let sunriseHour = sunriseDate.getHours();
  let sunriseMinute = sunriseDate.getMinutes();
  if (sunriseHour < 10) {
    sunriseHour = `0${sunriseHour}`;
  }
  if (sunriseMinute < 10) {
    sunriseMinute = `0${sunriseMinute}`;
  }
  document.querySelector(
    "#sunrise"
  ).innerHTML = `${sunriseHour}:${sunriseMinute}`;
  // SUNSET
  let unixSunset = response.data.sys.sunset;
  let sunsetDate = new Date(unixSunset * 1000);
  let sunsetHour = sunsetDate.getHours();
  let sunsetMinute = sunsetDate.getMinutes();
  if (sunsetHour < 10) {
    sunsetHour = `0${sunsetHour}`;
  }
  if (sunsetMinute < 10) {
    sunsetMinute = `0${sunsetMinute}`;
  }
  document.querySelector(
    "#sunset"
  ).innerHTML = `${sunsetHour}:${sunsetMinute}`;*/