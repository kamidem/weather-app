// Feature 1 (current time & day of the week)
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
  return `Last updated on ${weekDay} ${hour}:${minute}`;
}


// Feature 2&4 (click search button: display searched city & live weather data)
function showTodaysWeatherAndCity(response) {
  document.querySelector("h2").innerHTML = response.data.name;
  console.log(response);
  document.querySelector("h5").innerHTML = formatDate(response.data.dt*1000);
  cTemp = response.data.main.temp;
  document.querySelector(".main-temp").innerHTML = `${Math.round(
    cTemp
  )}`;
  document.querySelector("#wind").innerHTML = `${response.data.wind.speed}m/s`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
  document.querySelector(
    ".today-description"
  ).innerHTML = `${response.data.weather[0].main}`;

  // SUNRISE
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
  ).innerHTML = `${sunsetHour}:${sunsetMinute}`;
}

function search(city) {
  let apiKey = `ecc7fef62a02dbb22a9dbe2d8e3727b7`;
  let urlSearchedCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  axios.get(urlSearchedCity).then(showTodaysWeatherAndCity);
}

function searchWeather(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value.trim().toLowerCase();
  search(city);
}

let searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", searchWeather);


// Feature 5 (current location weather) maybe add FEELS LIKE, MIN TEMP, MAX TEMP
function showCurrLocTemp(response) {
  document.querySelector("h2").innerHTML = response.data.name;
  document.querySelector(".main-temp").innerHTML = `${Math.round(
    response.data.main.temp
  )}`;
  document.querySelector("#wind").innerHTML = `${response.data.wind.speed}m/s`;
  document.querySelector(
    "#humidity"
  ).innerHTML = `${response.data.main.humidity}%`;
  document.querySelector(
    ".today-description"
  ).innerHTML = `${response.data.weather[0].main}`;
  // SUNRISE
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
  ).innerHTML = `${sunsetHour}:${sunsetMinute}`;
}

function handlePosition(position) {
  let key = `ecc7fef62a02dbb22a9dbe2d8e3727b7`;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${key}`;
  axios.get(url).then(showCurrLocTemp);
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
  cLink.classList.remove("active");
  fLink.classList.add("active");
  let fTemp = (cTemp * 1.8) + 32;
  tempElement.innerHTML = Math.round(fTemp);
}
function displayC(event) {
  event.preventDefault();
  let tempElement = document.querySelector(".main-temp");
  cLink.classList.add("active");
  fLink.classList.remove("active");
  tempElement.innerHTML = Math.round(cTemp);
}

let cTemp = null;

let fLink = document.querySelector(".f-link");
fLink.addEventListener("click", displayF);
let cLink = document.querySelector(".c-link");
cLink.addEventListener("click", displayC);

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



