//DATE & TIME

function showFullTime() {
  let date = new Date();

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let seconds = date.getSeconds();
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  setInterval(showFullTime, 1000);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentMonth = months[date.getMonth()];
  let dateDay = date.getDate();
  {
    if (dateDay < 10) {
      dateDay = `0${dateDay}`;
    }
  }

  let currentYear = date.getFullYear();

  let currentTime = document.querySelector("#show-time");
  currentTime.innerHTML = `<b>${hours} : ${minutes} : ${seconds}</b><br/>${currentDay} <br/>${currentMonth} ${dateDay},<br/> ${currentYear}`;
}
showFullTime();
//Formats the day
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function getForecast(city) {
  let apiKey = "etdae7054o9fa454b23848b5337ab9e4";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let countryElement = document.querySelector("#country");
  let description = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");
  let pressureElement = document.querySelector("#pressure");

  celsiusTemperature = response.data.temperature.current;

  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  cityElement.innerHTML = response.data.city;
  countryElement.innerHTML = response.data.country;
  description.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  pressureElement.innerHTML = Math.round(response.data.temperature.pressure);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.city);
}

function search(city) {
  let apiKey = "etdae7054o9fa454b23848b5337ab9e4";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#search-text-input");
  search(cityInputElement.value);
}

function searchLocation(position) {
  let apiKey = "etdae7054o9fa454b23848b5337ab9e4";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lon=${position.coords.longitude}&lat=${position.coords.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function getLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");

  celsiusBtn.classList.remove("active");
  fahrenheitBtn.classList.add("active");

  let fahrenheitTemprature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemprature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusBtn.classList.add("active");
  fahrenheitBtn.classList.remove("active");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

function displayAlert(event) {
  event.preventDefault();
  let element = document.getElementById("first-alert");
  element.remove();
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
                <div class="col-2">
                  <div class="weather-forecast-date">${formatDay(
                    forecastDay.time
                  )}</div>
                  <div class="weather-forecast-temperature">
                    <span class="weather-forecast-temperature-max" >${Math.round(
                      forecastDay.temperature.maximum
                    )}°</span>
                    <span class="weather-forecast-temperature-min">${Math.round(
                      forecastDay.temperature.minimum
                    )}°</span>
                  </div>
                  <img src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                    forecastDay.condition.icon
                  }.png" alt="" />
                  
                </div>
              
    `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

let celsiusTemperature = null;
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let gpsBtn = document.querySelector("#gps");
gpsBtn.addEventListener("click", getLocation);

let fahrenheitBtn = document.querySelector("#fahrenheit-link");
fahrenheitBtn.addEventListener("click", displayFahrenheitTemperature);

let celsiusBtn = document.querySelector("#celsius-link");
celsiusBtn.addEventListener("click", displayCelsiusTemperature);

let alertBtn = document.querySelector("#alert-btn");
alertBtn.addEventListener("click", displayAlert);

search("Oslo");
