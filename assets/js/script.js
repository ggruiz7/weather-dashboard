const api = {
  key: "35c1c71e328b8ebef49b92d5953ba402",
  base: "https://api.openweathermap.org/data/2.5/",
  five: "https://api.openweathermap.org/data/2.5/",
};

// //search form and button
const searchInputEl = document.querySelector("#search");
// const searchBtnEl = document.querySelector('#btn');

// history and clear history button
const historyEl = document.querySelector("#history");
const clearBtnEl = document.querySelector("#clear");

const weatherIconEl = document.createElement("img");
const currentCityEl = document.querySelector("#current-city");
const currentTempEl = document.querySelector("current-temp");
const currentHumidEl = document.querySelector("#current-humid");
const currentWindEl = document.querySelector("#current-wind");
const currentUvEl = document.querySelector("#current-uv");

// const fiveDayCast = document.querySelector("#five-day-cast");

let searchHistory = JSON.parse(localStorage.getItem("searchInputEl")) || [];

function getInput() {
  getApi(search.value);
  getApiFive(search.value);
}

function getApi() {
  fetch(`${api.base}weather?q=${search.value}&units=imperial&appid=${api.key}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      currentWeather(data);
    });
}

// appending data to current weather dom
function currentWeather(data) {
  console.log(data);

  var img = document.createElement("img");
  img.src = "http://openweathermap.org/img/wn/" + data.weather[0].icon + ".png";

  document.querySelector("#weather-img").appendChild(img);
  currentTempEl.innerHTML = data.main.temp + " °";

  currentHumidEl.innerHTML = "Humidity: " + data.main.humidity + "%";
  currentWindEl.innerHTML = data.wind.speed + " mph";

  var dateString = moment.unix(data.dt).format("MM/DD/YYYY");
  console.log(dateString);
  currentCityEl.innerHTML = data.name + " -" + " " + dateString;

  function getUV() {
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    console.log("LLLLLLL");
    console.log(lat);
    console.log(lon);
    console.log("LLLLLLL");
    let uvURL =
      "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + api.key + "&cnt=1";
    console.log(uvURL);

    fetch(uvURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        currentUv(data);
      });
  }
  getUV();

  function currentUv(data) {
    var uvIndex = document.createElement("p");

    if (data[0].value < 5) {
      uvIndex.setAttribute("class", "badge badge-success");
    } else if (data[0].value < 7) {
      uvIndex.setAttribute("class", "badge badge-warning");
    } else {
      uvIndex.setAttribute("class", "badge badge-danger");
    }
    console.log(data[0].value);
    uvIndex.innerHTML = data[0].value;
    currentUvEl.innerHTML = "UV Index: ";
    currentUvEl.append(uvIndex);
  }
}

function getApiFive() {
  fetch(`${api.five}forecast?q=${search.value}&units=imperial&appid=${api.key}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      fiveDayCast(data);
    });
}

function fiveDayCast(data) {
  console.log(data);
  // converting UNIX timestamp into readable date
  UNIX_timestamp = data.list[0].dt;
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + " " + date;
    return time;
  }

  var fiveDayEl = document.querySelector("#five-day-cast");
  fiveDayEl.empty();

  for (var i = 0; i < 33; i += 8) {
    console.log(data);
    var dateString = moment.unix(data.list[i].dt).format("MM/DD/YYYY");
    var temp = data.list[i].main.temp;
    var city = data.city.name;
    var humidity = data.list[i].main.humidity;
    var img = document.createElement("img");
    img.src = "http://openweathermap.org/img/wn/" + data2.list[i].weather[0].icon + ".png";

    // futureCast = document.getElementById('five-day-cast');
    cardContainer = document.createElement("div");
    cardBody = document.createElement("div");
    cardHeader = document.createElement("h5");
    cardTemp = document.createElement("h6");
    cardHumidity = document.createElement("p");
    cardImage = document.createElement("div");
    cardDate = document.createElement("p");

    cardContainer.setAttribute("id", "handle");

    cardContainer.classList.add("card");
    cardContainer.classList.add("col-2");
    cardContainer.classList.add("forecast");

    // futureCast.append(cardContainer);
    fiveDayEl.append(cardContainer);
    cardContainer.append(cardBody);
    cardBody.append(cardHeader);
    cardBody.append(cardTemp);
    cardBody.append(cardHumidity);
    cardBody.append(cardImage);
    cardBody.append(cardDate);
    cardImage.append(img);

    cardHeader.innerHTML = city;
    cardTemp.innerHTML = temp + " °";
    cardHumidity.innerHTML = "Humidity: " + humidity + " %";
    cardDate.innerHTML = dateString;
    console.log(dateString);
  }
}
