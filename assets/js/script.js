const api = {
  key: "35c1c71e328b8ebef49b92d5953ba402",
  base: "https://api.openweathermap.org/data/2.5/",
  five: "https://api.openweathermap.org/data/2.5/",
};

var search = document.querySelector("#search");
var btn = document.querySelector(".btn");

btn.addEventListener("click", getInput);

// current weather elements
var currentCityEl = document.getElementById("current-city");
var currentTempEl = document.getElementById("current-temp");
var currentHumEl = document.getElementById("current-hum");
var currentWindEl = document.getElementById("current-wind");
var currentUvEl = document.getElementById("current-uv");
var historyEl = document.getElementById("history");
var clearBtn = document.getElementById("clear");

//
var futureCast = document.getElementById("five-day-cast");

let searchHistory = JSON.parse(localStorage.getItem("search")) || [];

function getInput() {
  getApi(search.value);
  getApiFive(search.value);
}

function getApi() {
  fetch(`${api.base}weather?q=${search.value}&units=imperial&appid=${api.key}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data1) {
      updateWeather(data1);
    });
}

// current weather function
function updateWeather(data1) {
  // console.log(data1);

  var img = document.createElement("img");
  img.src = "http://openweathermap.org/img/wn/" + data1.weather[0].icon + ".png";

  document.querySelector("#weather-img").appendChild(img);
  currentTempEl.innerHTML = data1.main.temp + " °";

  currentHumEl.innerHTML = "Humidity: " + data1.main.humidity + "%";
  currentWindEl.innerHTML = data1.wind.speed + " mph";

  var dateString = moment.unix(data1.dt).format("MM/DD/YYYY");
  console.log(dateString);
  currentCityEl.innerHTML = data1.name + " -" + " " + dateString;

  function getUV() {
    let lat = data1.coord.lat;
    let lon = data1.coord.lon;
    console.log(lat);
    console.log(lon);
    let uvURL =
      "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + api.key + "&cnt=1";
    // console.log(uvURL);

    fetch(uvURL)
      .then(function (response) {
        return response.json();
      })
      .then(function (data3) {
        updateUV(data3);
      });
  }

  getUV();

  function updateUV(data3) {
    var uvIndex = document.createElement("p");

    if (data3[0].value < 5) {
      uvIndex.setAttribute("class", "badge badge-success");
    } else if (data3[0].value < 7) {
      uvIndex.setAttribute("class", "badge badge-warning");
    } else {
      uvIndex.setAttribute("class", "badge badge-danger");
    }
    // console.log(data3[0].value);

    currentUvEl.innerHTML = "UV Index: " + data3[0].value;
  }
}

function getApiFive() {
  fetch(`${api.five}forecast?q=${search.value}&units=imperial&appid=${api.key}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data2) {
      updateFiveDay(data2);
    });
}

function updateFiveDay(data2) {
  console.log(data2);
  // converting UNIX timestamp into readable date
  UNIX_timestamp = data2.list[0].dt;
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var month = months[a.getMonth()];
    var date = a.getDate();
    var time = month + " " + date;
    return time;
  }

  var fivedayEl = $("#five-day-cast");

  fivedayEl.empty();

  for (var i = 0; i < 33; i += 8) {
    console.log(data2);
    var dateString = moment.unix(data2.list[i].dt).format("MM/DD/YYYY");
    var temp = data2.list[i].main.temp;
    var city = data2.city.name;
    var humidity = data2.list[i].main.humidity;
    var img = document.createElement("img");
    img.src = "http://openweathermap.org/img/wn/" + data2.list[i].weather[0].icon + ".png";

    futureCast = document.querySelector("#five-day-cast");
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

    futureCast.append(cardContainer);
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

btn.addEventListener("click", function () {
  const searchTerm = search.value;
  getApi(searchTerm);
  searchHistory.push(searchTerm);
  localStorage.setItem("search", JSON.stringify(searchHistory));
  showSearchHistory();
});

clearBtn.addEventListener("click", function () {
  localStorage.clear();
  searchHistory = [];
  showSearchHistory();
});

function showSearchHistory() {
  historyEl.innerHTML = "";
  for (let i = 0; i < searchHistory.length; i++) {
    const historyItem = document.createElement("input");
    historyItem.setAttribute("type", "text");
    historyItem.setAttribute("readonly", true);
    historyItem.setAttribute("class", "form-control d-block bg-white");
    historyItem.setAttribute("value", searchHistory[i]);
    historyItem.addEventListener("click", function () {
      getApi(historyItem.value);
    });
    historyEl.append(historyItem);
  }
}
