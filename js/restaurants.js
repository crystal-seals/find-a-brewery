var longitude, latitude;
var currentRestaurant = {};

document.getElementById('button').addEventListener("click", function() {
    getRestaurants();
    document.getElementById('loading-screen').style.display = "block"
    document.getElementById('homepage').style.display = "none";
    setTimeout(function(){
    document.getElementById('results').style.display = "block";
    document.getElementById('loading-screen').style.display = "none"

}, 2000)
})

var xhr = new XMLHttpRequest();

function updateRestaurant() {
  var result = JSON.parse(xhr.response)
  var input = result.restaurants[count].restaurant;
  currentRestaurant.name = input.name
  currentRestaurant.id = input.id;
  currentRestaurant.thumb = input.thumb
  currentRestaurant.cuisines = input.cuisines
  currentRestaurant.rating = input.user_rating.aggregate_rating;
  currentRestaurant.address = input.location.address;
  currentRestaurant.latitude = input.location.latitude;
  currentRestaurant.longitude = input.location.longitude;
  updateElements();
  count++;
}

  var count = 0;
  function getRestaurants() {
    xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      updateRestaurant();
    }
  }
  xhr.open('GET', 'https://developers.zomato.com/api/v2.1/search?count=20&lat=' + latitude + "&lon=" + longitude + "&radius=1000&cuisines=40&sort=real_distance&apikey=3c2968b8e9cb6e81212628d734ccb726", true)
  xhr.send();
}
setTimeout(function(){
document.getElementById('button').style.display = 'block';
}, 4000);

document.getElementById("button1").addEventListener("click", function() {
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("ITS WORKING")
      updateRestaurant();
      if (count === 19) {
        count = 0;
      }
    }
  }
  xhr.open('GET', 'https://developers.zomato.com/api/v2.1/search?count=20&lat=' + latitude + "&lon=" + longitude + "&radius=1000&cuisines=40&sort=real_distance&apikey=3c2968b8e9cb6e81212628d734ccb726", true)
  xhr.send();
});

function updateElements() {
  document.getElementById("image").style.backgroundImage = "url(" + currentRestaurant.thumb + ")"
  // document.getElementById("address").innerHTML = currentRestaurant.address;
  document.getElementById("title").innerHTML = currentRestaurant.name;
  document.getElementById("cuisine").innerHTML = currentRestaurant.cuisines + '<br>' + currentRestaurant.address + '<br>' + currentRestaurant.rating + '/5';
  // document.getElementById("rating").innerHTML = currentRestaurant.rating + '/5';
  document.getElementById("link").href = "http://maps.google.com/?q=" + currentRestaurant.latitude + "," + currentRestaurant.longitude;

}
function getGeolocation(callback){
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        console.log('Your current position is:');
        console.log('Latitude : ' + crd.latitude);
        console.log('Longitude: ' + crd.longitude);
        console.log('More or less ' + crd.accuracy + ' meters.');
        callback(crd.latitude, crd.longitude);
    };

    function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
        alert('Geolocation Error!');
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
}

function geolocationHandler(lat, long){
    latitude = lat;
    longitude = long;
    console.log(lat,long)

    updateRestaurant();
    updateElements();
}

getGeolocation(geolocationHandler);