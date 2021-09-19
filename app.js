const locationSpan = document.querySelector(".location");

const spinner = `<div class="spinner"></div>`;

function getUserLocation() {
  navigator.geolocation.getCurrentPosition((loc) => {
    localStorage.setItem(
      "userLocation",
      loc.coords.latitude + "," + loc.coords.longitude
    );
  });
}

async function getCurrWeather(url) {
  const res = await fetch(url);
  const resData = await res.json();

  console.log(resData);

  $(".weather-dashboard").html(`<h1 class='text-center'>${spinner}</h1>    
                                    <span>
                                        <h4 style="color: lightblue;">
                                            Please wait
                                            <span class="dot-1">.</span>
                                            <span class="dot-2">.</span>
                                            <span class="dot-3">.</span>
                                        </h4>
                                    </span>
    `);

  if (resData.message == 'city not found') {
    setTimeout(() => {
      $(".weather-dashboard").html(
        `<h1 class='text-center text-danger'>We were unable to find your location</h1><p class='text-center'>Please try again...</p>`
      );
    }, 2000);
  } else {
    setTimeout(() => {
      $(".weather-dashboard")
        .html(`<div class=" title-forecast align-self-start text-light"><h1></h1><p></p></div>
                                                <div class="current-forecast mt-4 align-self-start">
                                                    <div class="weather-icon d-flex align-items-baseline mb-3"></div>
                                                    <h1 class="temp"></h1>
                                                    <div class="additional-info d-flex flex-wrap row"></div>
                                              </div>`);
      setTimeout(() => {
        $(".title-forecast").html(
          `<h1>${resData.name}</h1><span>${resData.sys.country}</span>`
        );
        $(".weather-icon").html(
          `<img src="http://openweathermap.org/img/w/${resData.weather[0].icon}.png" alt='${resData.weather[0].icon}' style='border-radius:10px;'> &nbsp;<span>${resData.weather[0].main}</span>`
        );
        $(".temp").html(
          `${resData.main.temp}&nbsp;<i class='fas fa-temperature-high'>c</i>`
        );
        sunrise = new Date(resData.sys.sunrise * 1000).toLocaleTimeString('en-US');
        sunset = new Date(resData.sys.sunset * 1000).toLocaleTimeString('en-US');
        $(".additional-info").html(`
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Sunrise:</span> ${sunrise}  </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Sunrise:</span> ${sunset}  </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Feels like :</span> ${resData.main.feels_like} &nbsp;<i class='fas fa-temperature-high'>c</i>  </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Wind speed:</span> ${resData.wind.speed} kmph </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Visibility:</span> ${resData.visibility} </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Pressure:</span> ${resData.main.pressure} MB </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Humidity:</span> ${resData.main.humidity} </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Cloud cover:</span> ${resData.clouds.all}  </span> 
                    `);
      }, 100);
    }, 2500);
  }
}

$("#get-loc-btn").on("click", (e) => {
  $("#get-loc-btn").attr("disabled", "disabled");
  $("#get-loc-btn").html("");
  $("#get-loc-btn").html(spinner);
  setTimeout(() => {
    getUserLocation();
    if (localStorage.getItem("userLocation") != "undefined") {
      $("#get-loc-btn").html(
        `<i class='fas fa-check text-success'>&nbsp;Done</i>`
      );

      $("#get-loc-btn").removeAttr("disabled");

      getCurrWeather(localStorage.getItem("userLocation"));

      setTimeout(() => {
        $("#get-loc-btn").html(`<i class="fas fa-compass"></i>
                                        <span class="nav-link-title">Detect</span>`);
      }, 1000);
    }
  }, 2000);
});

$("#search-loc-btn").on("click", (e) => {
  $("#searchModal").modal();
});

$("#search-form").on("submit", (e) => {
  e.preventDefault();
  var searchQuery = $("#searchQuery").val();
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=d5eb3cfdf177ba5afa24e733af15e07c`;
  localStorage.setItem("searchedLocation", searchQuery);
  getCurrWeather(url);
  $("#searchModal").modal("hide");
});

function fillInitialData() {
  if (localStorage.getItem("searchedLocation") != null) {
    getCurrWeather(localStorage.getItem("searchedLocation"));
  } else if (localStorage.getItem("userLocation") != null) {
    getCurrWeather(localStorage.getItem("userLocation"));
  } else {
    getCurrWeather("New York, USA");
  }
}

// window.onload = fillInitialData()
