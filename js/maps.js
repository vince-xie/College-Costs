function initMap() {
  	var usa = {lat: 42.877742, lng: -97.380979};
  	window.map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 4,
    	center: usa
  	});
    google.maps.event.addListener(map, 'click', function(e) {
        closeInfo();
    });
}
