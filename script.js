const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const notFoundSection = document.querySelector(".not-found");
const searchCity = document.querySelector(".search-city");
const WeatherInfo = document.querySelector(".Weather-info");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditionTxt = document.querySelector(".condition-txt");
const humidityValueTxt = document.querySelector(".humidity-value-txt");
const WindValueTxt = document.querySelector(".Wind-value-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const cuurentDateTxt = document.querySelector(".cuurent-date-txt");
const forecastItemsContainer = document.querySelector(".forecast-items-container");

const apiKey = "ad6474c76cddabd55ecf720356ef8124";

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    // console.log(event);
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiUrl);
  return response.json();
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }
//   console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  countryTxt.textContent = country;
  tempTxt.textContent = Math.round(temp) + " °C";
  conditionTxt.textContent = main;
  humidityValueTxt.textContent = humidity + "%";
  WindValueTxt.textContent = speed + " M/s";

  cuurentDateTxt.textContent = getCurrentDate();

  weatherSummaryImg.src = `assets/${getWeatherIcon(id)}`;
//   console.log(id);

  await updateForecastsInfo(city);
  showDisplaySection(WeatherInfo);
}
async function updateForecastsInfo(city) {
  const forecastData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";
  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
      // console.log(forecastWeather);
    }
  });

}

function updateForecastItems(weatherData) {
//   console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateoption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateoption);

  const forecastItem = `
    <div class="forecast-item">
          <h5 class="forecast-item-date regular-txt">
            ${dateResult}
          </h5>
          <img src="assets/${getWeatherIcon(id)}" class="forecast-item-img">
          <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `;
  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}

function showDisplaySection(section) {
  [WeatherInfo, searchCity, notFoundSection].forEach((section) => {
    section.style.display = "None";
  });
  section.style.display = "flex";
}
