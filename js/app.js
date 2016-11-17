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

app.controller('browse-controller', ['$scope', '$routeParams', function($scope, $routeParams){
  	$('.back-button').show();
  	$('.browse-button').hide();
  	$('#map').hide();
}]);

app.controller('map-controller', ['$scope', '$routeParams', function($scope, $routeParams){
  	$('.back-button').hide();
  	$('.browse-button').show();
  	$('#map').show();
  	if (window.map) {
  	var name = $routeParams.name;
	  	if (name) {
	  		toggleSearchWithoutSelect();
	  		$('#search').attr('value', name);
	  		getSchoolInfo(name);
	  	}
  	}
}]);