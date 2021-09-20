const locationSpan = document.querySelector(".location");

const spinner = `<div class="spinner"></div>`;

let regionNames = new Intl.DisplayNames(['en'], {type: 'region'});

function getUserLocation() {
  navigator.geolocation.getCurrentPosition((loc) => {
    localStorage.setItem("lat",loc.coords.latitude);
    localStorage.setItem("lon",loc.coords.longitude);
  });
}

async function getCurrWeather(url) {
  const res = await fetch(url);
  const resData = await res.json();

  //console.log(resData);

  $(".weather-dashboard").html(`<h1 class='text-center'>${spinner}</h1>    
                                    <span>
                                        <h4 style="color: lightblue;">
                                            Searching
                                            <span class="dot-1">.</span>
                                            <span class="dot-2">.</span>
                                            <span class="dot-3">.</span>
                                        </h4>
                                    </span>
    `);

  if (resData.message == 'city not found') {
    setTimeout(() => {
      $(".weather-dashboard").html(
        `<h1 class='text-center text-danger'>We were unable to find your location</h1><p class='text-center'>Please elaborate your search and try again...</p>`
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
          `<h1>${resData.name}</h1><span>${resData.sys.country ? regionNames.of(resData.sys.country) : resData.name }</span>`
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
                    <div class='m-4 text-wrap'><span class='text-primary' style='opacity:50%;'>Sunrise:</span> ${sunrise}  </div> 
                    <div class='m-4 text-wrap'><span class='text-primary' style='opacity:50%;'>Sunset:</span> ${sunset}  </div> 
                    <div class='m-4 text-wrap'><span class='text-primary' style='opacity:50%;'>Feels like :</span> ${resData.main.feels_like} &nbsp;<i class='fas fa-temperature-high'>c</i>  </div> 
                    <div class='m-4 text-wrap'><span class='text-primary' style='opacity:50%;'>Wind speed:</span> ${resData.wind.speed} kmph </div> 
                    <div class='m-4 text-wrap'><span class='text-primary' style='opacity:50%;'>Visibility:</span> ${resData.visibility} </div> 
                    <div class='m-4 text-wrap'><span class='text-primary' style='opacity:50%;'>Pressure:</span> ${resData.main.pressure} MB </div> 
                    <div class='m-4 text-wrap'><span class='text-primary' style='opacity:50%;'>Humidity:</span> ${resData.main.humidity} </div> 
                    <div class='m-4 text-wrap'><span class='text-primary' style='opacity:50%;'>Cloud cover:</span> ${resData.clouds.all}  </div> 
                    `);
      }, 100);
    }, 2500);
  }
}

$("#get-loc-btn").on("click", (e) => {
  $("#get-loc-btn").attr("disabled", "disabled");
  $("#get-loc-btn").html("");
  $("#get-loc-btn").html(spinner);
  getUserLocation();
  setTimeout(() => {
    if (localStorage.getItem("lat") != null && localStorage.getItem("lon") != null) {
        console.log(localStorage.getItem("lat"),localStorage.getItem("lon"));
      $("#get-loc-btn").html(
        `<i class='fas fa-check text-success'>&nbsp;Done</i>`
      );

      $("#get-loc-btn").removeAttr("disabled");

      var url = `https://api.openweathermap.org/data/2.5/weather?lat=${localStorage.getItem("lat")}&lon=${localStorage.getItem("lon")}&units=metric&appid=d5eb3cfdf177ba5afa24e733af15e07c`

      getCurrWeather(url);

      setTimeout(() => {
        $("#get-loc-btn").html(`<i class="fas fa-compass"></i>
                                        <span class="nav-link-title">Detect</span>`);
      }, 1000);
    }
    else{
        $("#get-loc-btn").removeAttr("disabled");
        $("#get-loc-btn").html(`<i class="fas fa-compass"></i><span class="nav-link-title">Detect</span>`);
        alert('Something went wrong.')
    }
  }, 2000);
});

$("#search-loc-btn").on("click", (e) => {
  $("#searchModal").modal();
  setTimeout(()=>{
    document.getElementById("searchQuery").focus();
  },1000)
});

$("#search-form").on("submit", (e) => {
  e.preventDefault();
  var searchQuery = $("#searchQuery").val();
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&units=metric&appid=d5eb3cfdf177ba5afa24e733af15e07c`;
  localStorage.setItem("searchedLocation", searchQuery);
  getCurrWeather(url);
  $('#searchQuery').val("")
  $("#searchModal").modal("hide");
});

function fillInitialData() {
  if (localStorage.getItem("searchedLocation") != null) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${localStorage.getItem("searchedLocation")}&units=metric&appid=d5eb3cfdf177ba5afa24e733af15e07c`;
    getCurrWeather(url);
  } else if (localStorage.getItem("lat") != null && localStorage.getItem("lon") != null) {
    var url = `https://api.openweathermap.org/data/2.5/weather?lat=${localStorage.getItem("lat")}&lon=${localStorage.getItem("lon")}&units=metric&appid=d5eb3cfdf177ba5afa24e733af15e07c`
    getCurrWeather(url);
  } 
  // else {
  //   var url = `https://api.openweathermap.org/data/2.5/weather?q=New York,USA&units=metric&appid=d5eb3cfdf177ba5afa24e733af15e07c`;
  //   getCurrWeather(url);
  // }
}

window.onload = fillInitialData()
