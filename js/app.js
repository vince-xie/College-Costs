var app = angular.module("project", ['ngRoute']);

app.config(function($routeProvider, $locationProvider){
  $routeProvider.when('/',{
  	controller: 'map-controller',
  	templateUrl: 'views/browse.html'
  }).when('',{
  	controller: 'map-controller',
  	templateUrl: 'views/browse.html'
  })
  .when('/browse',{
  	controller: 'browse-controller',
  	templateUrl: 'views/browse.html'
  })
  .otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
});

app.controller('map-controller', ['$scope', '$routeParams', function($scope, $routeParams){
  	$('.back-button').hide();
  	$('.browse-button').show();
  	$('#map').show();
    if ($('#browse')) {
      $('#browse').hide();
    }
  	if (window.map) {
      google.maps.event.trigger(map, 'resize');
      var name = $routeParams.name;
	  	if (name) {
	  		toggleSearchWithoutSelect();
	  		$('.main #search').attr('value', name);
	  		getSchoolInfo(name);
	  	}
  	}
}]);

app.controller('browse-controller', ['$scope', '$routeParams', function($scope, $routeParams){
    $('.back-button').show();
    $('.browse-button').hide();
    $('#map').hide();
    if ($('#browse')) {
      $('#browse').show();
    }
    $('#browse .dropdown-menu a').click(function() {
        $(this).parent().parent().parent().children('.btn').html($(this).html() + " <span class=\"caret\"></span>");
        $(this).parent().parent().parent().children('input').attr('value', $(this).parent().children('input').val());
    });
}]);
