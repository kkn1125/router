function getGeoWeather(lat, lon, callback){
    let apis = '9408f969cd4a2305522ad8d4f4c88e82'.toUpperCase();
    let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apis}&units=metric`;
    fetch(url)
    .then(response=>response.json())
    .then(data=> window.weather = data);
}

navigator.geolocation.getCurrentPosition(success, error);

function success(success){
    getGeoWeather(success.coords['latitude'], success.coords['longitude']);
}

function error(error){
    console.warn(error.message);
}