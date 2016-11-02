function initMap() {
  	var uluru = {lat: -25.363, lng: 131.044};
  	window.map = new google.maps.Map(document.getElementById('map'), {
    	zoom: 4,
    	center: uluru
  	});
  	window.marker = new google.maps.Marker({
    	position: uluru,
		  map: map
    });
    google.maps.event.addListener(marker, 'click', function(e) {
        openMenu();
    });
    google.maps.event.addListener(map, 'click', function(e) {
        closeMenu();
    });
}
