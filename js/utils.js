$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
    getSchoolList();
});

function getSchoolList() {
    $.ajax({
        dataType: "JSON",
        type: 'post',
        url: "php/QuerySchoolList.php",
        success: function(result) {
            setUpSearch(result);
        }
    });
}

function getSchoolInfo(name) {
    $.ajax({
        dataType: "JSON",
        type: 'post',
        url: "php/QuerySchool.php",
        data: {
            name: name
        },
        success: function(result) {
            alert(result);
        }
    });
}

function openMenu() {
	var radarChart = document.getElementById("radar-chart");
    var data = {
    	labels: ["Return on investment", "Cost", "Location", "Graduation Rate", "Retention Rate"],
    	datasets: [
	        {
	            label: "Individual scores",
	            backgroundColor: "rgba(255,99,132,0.2)",
            	borderColor: "rgba(255,99,132,1)",
            	pointBackgroundColor: "rgba(255,99,132,1)",
            	pointBorderColor: "#fff",
            	pointHoverBackgroundColor: "#fff",
            	pointHoverBorderColor: "rgba(255,99,132,1)",
	            data: [85, 39, 52, 71, 56]
	        }
    	]
	};
	var radarChart = new Chart(radarChart, {
    	type: 'radar',
    	data: data,
    	options: {
    		animation: {
    			duration: 2500,
    			easing: 'easeOutCubic'
    		},
    		scale: {
    			ticks: {
    				display: false,
                    beginAtZero: true
                }
    		}
    	}
	});

	var salaryChart = document.getElementById("salary-chart");
    var data = {
    	labels: ["10%", "25%", "75%", "90%"],
    	datasets: 
    	[
	        {
	        	label: 'Salary in USD',
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 206, 86, 0.2)',
	                'rgba(75, 192, 192, 0.2)',
	                'rgba(153, 102, 255, 0.2)',
	                'rgba(255, 159, 64, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1,
	            data: [12523, 32425, 62432, 85234],
	        }
    	]
	};
	new Chart(salaryChart, {
        type: "bar",
        data: data,
        options:
        {
        	title: {
            	display: true,
            	text: 'Salary 6 years after entry by percentile'
        	},
        	animation: {
        		duration: 2500,
        		easing: 'easeOutCubic'
        	},
        	scales: {
            	yAxes: [{
                	ticks: {
                    	beginAtZero:true
                	}
            	}]
        	}
    	}
    });

    var repaymentChart = document.getElementById("debt-repayment-chart");
    var data = {
    	labels: ["1 year", "3 years", "5 years", "7 years"],
    	datasets: 
    	[
	        {
	        	label: 'Repayment rate (%)',
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 206, 86, 0.2)',
	                'rgba(75, 192, 192, 0.2)',
	                'rgba(153, 102, 255, 0.2)',
	                'rgba(255, 159, 64, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)',
	                'rgba(75, 192, 192, 1)',
	                'rgba(153, 102, 255, 1)',
	                'rgba(255, 159, 64, 1)'
	            ],
	            borderWidth: 1,
	            data: [10, 24, 52, 74],
	        }
    	]
	};
	new Chart(repaymentChart, {
        type: "bar",
        data: data,
        options:
        {
        	title: {
            	display: true,
            	text: 'Debt repayment rate after graduation'
        	},
        	animation: {
        		duration: 2500,
        		easing: 'easeOutCubic'
        	},
        	scales: {
            	yAxes: [{
                	ticks: {
                    	beginAtZero:true
                	}
            	}]
        	}
    	}
    });

    $(".main").animate({'left': '410px'}, 300);
}

function setUpSearch(schools) {
    $("#search").autocomplete({
        source: schools,
        select: function (e, ui) {
            $("#search").blur();
            var schoolInfo = getSchoolInfo(ui.item.value);
            var chicago = {lat: 41.85, lng: -87.65};
            if(window.marker != null) {
                window.marker.setMap(null);
            }
            window.marker = new google.maps.Marker({
                position: chicago,
                map: map
            });
            window.map.panTo(chicago);
            window.map.setZoom(12);
            google.maps.event.addListener(marker, 'click', function(e) {
                openMenu();
            });
        }
    })
    $("#search").focus(function () {
        $(this).autocomplete("search", this.value);
    });
}

function closeMenu() {
    $(".main").animate({'left': '0px'}, 300);
}

function toggleSearch() {
    var search = $("#search");
    if($("#search").css('width') != "0px") {
        search.animate({'width': '0px'}, 500);
    } else {
        search.animate({'width': '300px'}, 500, function() {
            search.focus();
        });
    }
}
