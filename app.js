const locationSpan = document.querySelector('.location')

const spinner = `<div class="spinner-border spinner-border-sm text-secondary" role="status"></div>`

function getUserLocation(){  
    navigator.geolocation.getCurrentPosition((loc)=>{
            localStorage.setItem('userLocation',loc.coords.latitude+','+loc.coords.longitude) 
    })
}



async function getCurrWeather(location){
    const res = await fetch('http://api.weatherstack.com/current?access_key=520abc31ed5c719495950fa244b22ae9&query='+location)
    const resData = await res.json()

    console.log(resData);
    $('.title-forecast').html(`<h1>${resData.location.name}</h1><span>${resData.location.country}</span>`)
    $('.weather-icon').html(`<img src=${resData.current.weather_icons[0]} alt='temp-icon' style='border-radius:10px;'> &nbsp;<span>${resData.current.weather_descriptions[0]}</span>`)
    $('.temp').html(`${resData.current.temperature}&nbsp;<i class='fas fa-temperature-high'>c</i>`)
    $('.additional-info').html(`
    <span class='col-md-4 text-nowrap'>Wind speed: ${resData.current.wind_speed} kmph </span>
    <span class='col-md-4 text-nowrap'>Wind direction: ${resData.current.wind_dir}</span> 
    <span class='col-md-4 text-nowrap'>Pressure: ${resData.current.pressure} MB </span> 
    <span class='col-md-4 text-nowrap'>Precipitation: ${resData.current.precip} MM </span> 
    <span class='col-md-4 text-nowrap'>Humidity: ${resData.current.humidity} </span> 
    <span class='col-md-4 text-nowrap'>Cloud cover: ${resData.current.cloudcover}  </span> 
    <span class='col-md-4 text-nowrap'>Feels like : ${resData.current.feelslike}  </span> 
    `)
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


