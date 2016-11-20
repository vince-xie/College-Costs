var averages;

$(document).ready(function() {
    $('[data-toggle="popover"]').popover();
    queries();
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

function queries() {
    $.ajax({
        dataType: "JSON",
        type: 'post',
        url: "php/QueryAverages.php",
        success: function(result) {
            averages = result;
            getSchoolList();
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
        success: function(school) {
            var location = {lat: parseFloat(school.latitude), 
                lng: parseFloat(school.longitude)};
            if(window.marker != null) {
                window.marker.setMap(null);
            }
            window.marker = new google.maps.Marker({
                position: location,
                map: map
            });
            window.map.panTo(location);
            window.map.setZoom(12);

            $(".school h2").html(school.name);
            $(".location p").html(school.city + ", " + school.state);
            updatePopover(".location span", "The average salary in " + school.state + " is " + formatMoney(school.state_salary) + ".");
            $(".locale p").html(translateLocale(parseInt(school.locale)));
            $(".type p").html(translateType(parseInt(school.type)));

            $(".admission-rate p").html(decimalToPercent(school.admission_rate) + "%");
            $(".retention-rate p").html(decimalToPercent(school.retention_rate) + "%");
            updatePopover(".retention-rate span", getPercentagePopoverMessage(school.retention_rate, averages.retention_rate));
            updateColors(".retention-rate font", getPercentageColor(school.retention_rate, averages.retention_rate));
            $(".graduation-rate p").html(decimalToPercent(school.graduation_rate) + "%");
            updatePopover(".graduation-rate span", getPercentagePopoverMessage(school.graduation_rate, averages.graduation_rate));
            updateColors(".graduation-rate font", getPercentageColor(school.graduation_rate, averages.graduation_rate));

            if (school.homepage.toLowerCase().includes("http")) {
                $(".homepage a").attr('href', school.homepage);
                $(".homepage a").html(school.homepage);
            } else {
                $(".homepage a").attr('href', "http://" + school.homepage);
                $(".homepage a").html("http://" + school.homepage);
            }

            $(".in-state-tuition p").html(formatMoney(school.in_state_tuition));
            updatePopover(".in-state-tuition span", getDecimalPopoverMessage(school.in_state_tuition, averages.in_state_tuition));
            updateColors(".in-state-tuition font", getDecimalColorReverse(school.in_state_tuition, averages.in_state_tuition));
            $(".out-of-state-tuition p").html(formatMoney(school.out_of_state_tuition));
            updatePopover(".out-of-state-tuition span", getDecimalPopoverMessage(school.out_of_state_tuition, averages.out_of_state_tuition));
            updateColors(".out-of-state-tuition font", getDecimalColorReverse(school.out_of_state_tuition, averages.out_of_state_tuition));
            $(".average-debt p").html(formatMoney(school.average_student_debt));
            updatePopover(".average-debt span", getDecimalPopoverMessage(school.average_student_debt, averages.average_student_debt));
            updateColors(".average-debt font", getDecimalColorReverse(school.average_student_debt, averages.average_student_debt));

            google.maps.event.addListener(marker, 'click', function(e) {
                openInfo(school);
            });
        }
    });
}

function browse() {
    if ($('#browse-by .active').html().includes('name')) {
        $.ajax({
            dataType: "JSON",
            type: 'post',
            url: "php/QueryBrowseByName.php",
            data: {
                state: $("[name = 'state']").val(),
                in_state_tuition: $("[name = 'in-state-tuition']").val(),
                out_of_state_tuition: $("[name = 'out-of-state-tuition']").val(),
                average_salary: $("[name = 'average-salary']").val(),
                sort_by: $("[name = 'sort-by']").val(),
                limit: $("[name = 'limit']").val()
            },
            success: function(list) {
                $('.browse-table-body td').remove();
                var row;
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        var s = list[i];
                        row = "<tr><td><a href=\"/?name=" + s.name + "\">" + s.name + "</a></td><td>" 
                            + s.score + "</td><td>" + s.city + "</td><td>" + s.state + "</td><td>" 
                            + formatMoney(s.in_state_tuition) + "</td><td>" + formatMoney(s.out_of_state_tuition) + "</td><td>" 
                            + formatMoney(s.average_salary) + "</td></tr>";
                        $('.browse-table-body').append(row);
                    }
                }
            },
            error: function(e) {
                $('.browse-table-body td').remove();
            }
        });
    } else {
        alert('state');
    }
}

function openInfo(school) {
    $("#radar-chart").remove();
    $("#salary-chart").remove();
    $("#repayment-chart").remove();
    $(".radar-chart-container").append("<canvas id=\"radar-chart\" width=\"400\" height=\"400\"></canvas>");
    $(".salary-chart-container").append("<canvas id=\"salary-chart\" width=\"400\" height=\"400\"></canvas>");
    $(".repayment-chart-container").append("<canvas id=\"repayment-chart\" width=\"400\" height=\"400\"></canvas>");

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
	            data: [school.salary_ten, school.salary_twentyfive, school.salary_seventyfive, school.salary_ninety],
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

    var repaymentChart = document.getElementById("repayment-chart");
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
	            data: [decimalToPercent(school.drr_oneyr), decimalToPercent(school.drr_threeyr), 
                decimalToPercent(school.drr_fiveyr), decimalToPercent(school.drr_sevenyr)],
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
        source: function(request, response) {
            response($.ui.autocomplete.filter(schools, request.term).slice(0, 100));
        },
        select: function (e, ui) {
            $("#search").blur();
            if (window.location.toString().includes("browse")) {
                $("#browse").hide();
                window.location = '/?name=' + ui.item.value;
            }
            var schoolInfo = getSchoolInfo(ui.item.value);
        }
    })
    $("#search").focus(function () {
        $(this).autocomplete("search", this.value);
    });
}

function closeInfo() {
    $(".main").animate({'left': '0px'}, 300);
}

function toggleSearch() {
    var search = $("#search");
    if($("#search").css('width') != "0px") {
        search.animate({'width': '0px'}, 500);
    } else {
        search.animate({'width': '300px'}, 500, function() {
            search.focus();
            search.select();
        });
    }
}

function toggleSearchWithoutSelect() {
    var search = $("#search");
    if($("#search").css('width') != "0px") {
        search.css('width', '0px');
    } else {
        search.css('width', '300px');
    }
}
