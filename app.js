const locationSpan = document.querySelector('.location')

const spinner = `<div class="spinner"></div>`

function getUserLocation(){  
    navigator.geolocation.getCurrentPosition((loc)=>{
            localStorage.setItem('userLocation',loc.coords.latitude+','+loc.coords.longitude) 
    })
}



async function getCurrWeather(location){
    const res = await fetch('http://api.weatherstack.com/current?access_key=520abc31ed5c719495950fa244b22ae9&query='+location)
    const resData = await res.json()

    console.log(resData);

    $('.weather-dashboard').html(`<h1 class='text-center'>${spinner}</h1>    
                                    <span>
                                        <h4 style="color: lightblue;">
                                            Please wait
                                            <span class="dot-1">.</span>
                                            <span class="dot-2">.</span>
                                            <span class="dot-3">.</span>
                                        </h4>
                                    </span>
    `)

        if(resData.success == false){
           setTimeout(()=>{
               $('.weather-dashboard').html(`<h1 class='text-center text-danger'>We were unable to process your request</h1><p class='text-center'>Please try again...</p>`)
           },2000)
        }
        else{
            setTimeout(()=>{
                $('.weather-dashboard').html(`<div class=" title-forecast align-self-start text-light"><h1></h1><p></p></div>
                                                <div class="current-forecast mt-4 align-self-start">
                                                    <div class="weather-icon d-flex align-items-baseline mb-3"></div>
                                                    <h1 class="temp"></h1>
                                                    <div class="additional-info d-flex flex-wrap row"></div>
                                              </div>`)
                setTimeout(()=>{
                    $('.title-forecast').html(`<h1>${resData.location.name}</h1><span>${resData.location.country}</span>`)
                    $('.weather-icon').html(`<img src=${resData.current.weather_icons[0]} alt='temp-icon' style='border-radius:10px;'> &nbsp;<span>${resData.current.weather_descriptions[0]}</span>`)
                    $('.temp').html(`${resData.current.temperature}&nbsp;<i class='fas fa-temperature-high'>c</i>`)
                    $('.additional-info').html(`
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Wind speed:</span> ${resData.current.wind_speed} kmph </span>
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Wind direction:</span> ${resData.current.wind_dir}</span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Pressure:</span> ${resData.current.pressure} MB </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Precipitation:</span> ${resData.current.precip} MM </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Humidity:</span> ${resData.current.humidity} </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Cloud cover:</span> ${resData.current.cloudcover}  </span> 
                    <span class='col-md-4 mb-4 text-nowrap'><span class='text-muted'>Feels like :</span> ${resData.current.feelslike} &nbsp;<i class='fas fa-temperature-high'>c</i>  </span> 
                    `)
                },100)
            },2500)
        }
}


$('#get-loc-btn').on('click',(e)=>{
    $('#get-loc-btn').attr('disabled','disabled')
    $('#get-loc-btn').html('')
    $('#get-loc-btn').html(spinner)
    setTimeout(()=>{
        getUserLocation()
        if(localStorage.getItem('userLocation') != 'undefined'){
            $('#get-loc-btn').html(`<i class='fas fa-check text-success'>&nbsp;Done</i>`)
            
            $('#get-loc-btn').removeAttr('disabled')
            
            getCurrWeather(localStorage.getItem('userLocation'))

            setTimeout(()=>{
                $('#get-loc-btn').html(`<i class="fas fa-compass"></i>
                                        <span class="nav-link-title">Detect</span>`)
            },1000)
        }
    },2000)
})

$('#search-loc-btn').on('click',(e)=>{
    $('#searchModal').modal()
})

$('#search-form').on('submit',(e)=>{
    e.preventDefault()
    var searchQuery = $('#searchQuery').val()
    localStorage.setItem('searchedLocation', searchQuery)
    getCurrWeather(searchQuery)
    $('#searchModal').modal('hide'); 
})


function fillInitialData(){
    if(localStorage.getItem('searchedLocation') != null){
        getCurrWeather(localStorage.getItem('searchedLocation'))
   }
   else if(localStorage.getItem('userLocation') != null){
        getCurrWeather(localStorage.getItem('userLocation'))
   }
   else{
        getCurrWeather('New York, USA')
   }
}

window.onload = fillInitialData()


