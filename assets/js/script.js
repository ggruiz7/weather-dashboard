const api = {
  key: "35c1c71e328b8ebef49b92d5953ba402",
  base: "https://api.openweathermap.org/data/2.5/",
  five: "https://api.openweathermap.org/data/2.5/",
};

// search form and button
const searchInputEl = document.querySelector("#search");
const searchBtnEl = document.querySelector("#btn");

// history and clear history button
const historyEl = document.querySelector("#history");
const clearBtnEl = document.querySelector("#clear");

const weatherIconEl = document.createElement("img");
const currentCityEl = document.querySelector("#current-city");
const currentTempEl = document.querySelector("current-temp");
const currentHumidEl = document.querySelector("#current-humid");
const currentWindEl = document.querySelector("#current-wind");
const currentUvEl = document.querySelector("#current-uv");

const fiveDayCast = document.querySelector("#five-day-cast");

let searchHistory = JSON.parse(localStorage.getItem("searchInputEl")) || [];
