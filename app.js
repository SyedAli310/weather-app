const locationSpan = document.querySelector(".location");

const toggleBtn = document.querySelector(".toggle-btn");

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

  //console.log(resData);   // -for dev purpose only-

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

  if (resData.message == 'city not found' || resData.message == 'Nothing to geocode') {
    setTimeout(() => {
      $(".weather-dashboard").html(
        `
        <img src='./img/not-found.svg' alt='Location not found' style='height:200px;'>
        <br>
        <h3 class='text-center text-danger'>We were unable to find your location</h3><p class='text-center'>Please elaborate your search and try again.</p>`
      );
    }, 2000);
  } else {
    setTimeout(() => {
      $(".weather-dashboard")
        .html(`<div class=" title-forecast text-center text-light"><h1></h1><p></p></div>
                                                <span class='sep'></span>
                                                <div class="current-forecast mt-4 align-self-center">
                                                    <div class="weather-icon d-flex justify-content-center align-items-center mb-3"></div>
                                                    <h1 class="temp text-center"></h1>
                                                <div class="additional-info p-4 d-flex justify-content-center align-items-center flex-wrap"></div>
                                              </div>`);
      setTimeout(() => {
        $(".title-forecast").html(
          `<h1><a href ='https://www.google.com/maps/place/${resData.name}/' id='map-link' target='_blank' title='Locate on map'><i class='fas fa-map-marker-alt fa-sm'></i></a>&nbsp;${resData.name}</h1><span class='text-center text-primary'>${resData.sys.country ? regionNames.of(resData.sys.country) : resData.name }</span>`
        );
        if(getIcon(resData.weather[0].main)){
          $(".weather-icon").html(
            `${getIcon(resData.weather[0].main)}
             <span>${resData.weather[0].main}</span>`
          );
        }else{
          $(".weather-icon").html(
            `<img src="https://openweathermap.org/img/w/${resData.weather[0].icon}.png" alt='${resData.weather[0].icon}' style='border-radius:10px;'>
             &nbsp;
             <span>${resData.weather[0].main}</span>`
          );
        }
        $(".temp").html(
          `${Math.round(resData.main.temp)}&nbsp;<i class='fas fa-temperature-high'>c</i>`
        );
        sunrise = new Date(resData.sys.sunrise * 1000).toLocaleTimeString('en-US');
        sunset = new Date(resData.sys.sunset * 1000).toLocaleTimeString('en-US');
        $(".additional-info").html(`

                    <div class='m-4 text-wrap text-center'>
                        <span class='additional-info-title'>Sunrise: </span> 
                        <span class='text-nowrap'> ${sunrise} </span>
                     </div> 

                    <div class='m-4 text-wrap text-center'>
                        <span class='additional-info-title'>Sunset: </span> 
                        <span class='text-nowrap'>${sunset} </span> 
                    </div> 

                    <div class='m-4 text-wrap text-center'>
                        <span class='additional-info-title'>Feels like: </span>
                        <span class='text-nowrap'> ${Math.round(resData.main.feels_like)} &nbsp;<i class='fas fa-temperature-high'>c</i> </span>
                    </div> 

                    <div class='m-4 text-wrap text-center'>
                        <span class='additional-info-title'>Wind speed: </span>
                        <span class='text-nowrap'>${resData.wind.speed} kmph </span>
                    </div>

                    <div class='m-4 text-wrap text-center'>
                        <span class='additional-info-title'>Visibility: </span>
                        <span class='text-nowrap'>${resData.visibility} </span>
                    </div> 

                    <div class='m-4 text-wrap text-center'>
                        <span class='additional-info-title'>Pressure: </span>
                        <span class='text-nowrap'> ${resData.main.pressure} MB</span> 
                    </div> 

                    <div class='m-4 text-wrap text-center'>
                        <span class='additional-info-title'>Humidity: </span>
                        <span class='text-nowrap'>${resData.main.humidity}</span>
                    </div> 

                    <div class='m-4 text-wrap text-center'>
                        <span class='additional-info-title'>Cloud cover: </span>
                        <span class='text-nowrap'>${resData.clouds.all} </span> 
                    </div> 
                    
                    `);
      }, 100);
    }, 2500);
  }
}

function getIcon(condition){
  var validConditions = ['Clear','Clouds','Drizzle','Rain','Mist','Snow','Haze','Thunderstorm']
  var icon ;
  if(validConditions.includes(condition)){
    icon = `<img src="./img/weather-condition-icons/animated/${condition}.svg" alt='${condition}' style='width:70px; height:70px;'`
    return icon
  }
  else{
    return false
  }
}


$("#get-loc-btn").on("click", (e) => {
  $("#get-loc-btn").attr("disabled", "disabled");
  $("#get-loc-btn").html("");
  $("#get-loc-btn").html(spinner);
  getUserLocation();
  setTimeout(() => {
    if (localStorage.getItem("lat") != null && localStorage.getItem("lon") != null) {
        //console.log(localStorage.getItem("lat"),localStorage.getItem("lon"));
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

$('.toggle-btn').on('click',(e)=>{
    if($('.container__sidebar').width() == 240){
      if(x){
        clearTimeout(x)
      }
      let tooltip = document.createElement('span')
      tooltip.classList.add('tool-tip')
      tooltip.innerText=`Click outside to minimise.`
      toggleBtn.appendChild(tooltip)
      var x = setTimeout(()=>{
        $('.tool-tip').css('opacity','0')  
        $('.tool-tip').css('display','none')  
        tooltip.remove()
      },3000)
      console.log('hello');
    }
})



// $('body').on('click',(e)=>{
//   if ($('.toggle-btn').find('.tool-tip').length && e.target.id!='toggle-btn' && e.target.id!='toggle-btn-i'){
//     $('.tool-tip').css('opacity','0')  
//     $('.tool-tip').css('display','none') 
//     console.log('bye');
// }
// })
$('.container__sidebar').on('mouseleave',()=>{
  if ($('.toggle-btn').find('.tool-tip').length){
    $('.tool-tip').css('opacity','0')  
    $('.tool-tip').css('display','none') 
    console.log('bye');
}
})


window.onload = fillInitialData()
