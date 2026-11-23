const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const statusMessage = document.getElementById("status-message");
const weatherCard = document.getElementById("weather-card");

const cityNameEl = document.getElementById("city-name");
const countryNameEl = document.getElementById("country-name");
const weatherIconEl = document.getElementById("weather-icon");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("weather-description");
const feelsLikeEl = document.getElementById("feels-like");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");

/**
 * Maps WMO weather codes from Open-Meteo to readable descriptions and icons.
 */
function interpretWeatherCode(code) {
  const weatherMap = {
    0: { label: "Clear Sky", icon: "☀️" },
    1: { label: "Mainly Clear", icon: "🌤️" },
    2: { label: "Partly Cloudy", icon: "⛅" },
    3: { label: "Overcast", icon: "☁️" },
    45: { label: "Foggy", icon: "🌫️" },
    48: { label: "Depositing Rime Fog", icon: "🌫️" },
    51: { label: "Light Drizzle", icon: "🌦️" },
    53: { label: "Moderate Drizzle", icon: "🌦️" },
    55: { label: "Dense Drizzle", icon: "🌧️" },
    61: { label: "Slight Rain", icon: "🌧️" },
    63: { label: "Moderate Rain", icon: "🌧️" },
    65: { label: "Heavy Rain", icon: "⛈️" },
    71: { label: "Slight Snowfall", icon: "🌨️" },
    73: { label: "Moderate Snowfall", icon: "❄️" },
    75: { label: "Heavy Snowfall", icon: "❄️" },
    80: { label: "Rain Showers", icon: "🌦️" },
    95: { label: "Thunderstorm", icon: "⛈️" },
  };

  return weatherMap[code] || { label: "Variable Conditions", icon: "🌡️" };
}

/**
 * Fetches coordinates for a city name, then retrieves current weather conditions.
 */
async function fetchWeatherByCity(city) {
  statusMessage.textContent = "Fetching weather data...";
  statusMessage.classList.add("loading");
  weatherCard.classList.add("hidden");

  try {
    // 1. Geocode city name -> latitude & longitude
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error("Failed to connect to geocoding service.");
    }

    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${city}" not found. Please check spelling and try again.`);
    }

    const { name, country, latitude, longitude } = geoData.results[0];

    // 2. Fetch live weather using coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error("Failed to retrieve weather forecast.");
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    const condition = interpretWeatherCode(current.weather_code);

    // 3. Update DOM dynamically
    cityNameEl.textContent = name;
    countryNameEl.textContent = country || "Global";
    weatherIconEl.textContent = condition.icon;
    temperatureEl.textContent = `${Math.round(current.temperature_2m)}°C`;
    descriptionEl.textContent = condition.label;
    feelsLikeEl.textContent = `${Math.round(current.apparent_temperature)}°C`;
    humidityEl.textContent = `${current.relative_humidity_2m}%`;
    windSpeedEl.textContent = `${current.wind_speed_10m} km/h`;

    statusMessage.textContent = "";
    statusMessage.classList.remove("loading");
    weatherCard.classList.remove("hidden");
  } catch (error) {
    statusMessage.classList.remove("loading");
    statusMessage.textContent = error.message;
  }
}

// Form submission handler
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeatherByCity(city);
  }
});

// Load a default city on initial page load
window.addEventListener("DOMContentLoaded", () => {
  fetchWeatherByCity("Lagos");
});