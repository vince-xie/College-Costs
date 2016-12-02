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
            var roi_score = decimalToPercent(1 - 1 / ((school.salary_twentyfive + school.salary_seventyfive) / 2 / ((school.in_state_tuition + school.out_of_state_tuition) / 2)) / 5);
            var cost_score = decimalToPercent(1 - 1 / (100000 / ((school.in_state_tuition + school.out_of_state_tuition + 2 * school.average_student_debt) / 4)));
            var state_score = school.state_score;
            var graduation_score = decimalToPercent(school.graduation_rate);
            var retention_score = decimalToPercent(school.retention_rate);
            var total_score = decimalToPercent((.2 * roi_score + .1 * cost_score + .1 * state_score + .3 * graduation_score + .3 * retention_score) / 100);
            if (total_score >= 87) {
                window.marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                });
            } else if (total_score >= 80) {
                window.marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                });
            } else if (total_score >= 70) {
                window.marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                });
            } else {
                window.marker = new google.maps.Marker({
                    position: location,
                    map: map,
                    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                });
            }
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

            var info = new google.maps.InfoWindow({
                content: "Click on me! "
            });
            info.open(map,marker);

            google.maps.event.addListener(marker, 'click', function(e) {
                openInfo(school);
            });
        }
    });
}

function getSchoolCompare(name) {
    $.ajax({
        dataType: "JSON",
        type: 'post',
        url: "php/QuerySchool.php",
        data: {
            name: name
        },
        success: function(school) {
            var roi_score = decimalToPercent(1 - 1 / ((school.salary_twentyfive + school.salary_seventyfive) / 2 / ((school.in_state_tuition + school.out_of_state_tuition) / 2)) / 5);
            var cost_score = decimalToPercent(1 - 1 / (100000 / ((school.in_state_tuition + school.out_of_state_tuition + 2 * school.average_student_debt) / 4)));
            var state_score = school.state_score;
            var graduation_score = decimalToPercent(school.graduation_rate);
            var retention_score = decimalToPercent(school.retention_rate);
            var total_score = decimalToPercent((.2 * roi_score + .1 * cost_score + .1 * state_score + .3 * graduation_score + .3 * retention_score) / 100);

            $(".school2 h2").html(school.name);
            $(".location2 p").html(school.city + ", " + school.state);
            updatePopover(".location span", "The average salary in " + school.state + " is " + formatMoney(school.state_salary) + ".");
            $(".locale2 p").html(translateLocale(parseInt(school.locale)));
            $(".type2 p").html(translateType(parseInt(school.type)));

            $(".admission-rate2 p").html(decimalToPercent(school.admission_rate) + "%");
            $(".retention-rate2 p").html(decimalToPercent(school.retention_rate) + "%");
            updatePopover(".retention-rate2 span", getPercentagePopoverMessage(school.retention_rate, averages.retention_rate));
            updateColors(".retention-rate2 font", getPercentageColor(school.retention_rate, averages.retention_rate));
            $(".graduation-rate2 p").html(decimalToPercent(school.graduation_rate) + "%");
            updatePopover(".graduation-rate2 span", getPercentagePopoverMessage(school.graduation_rate, averages.graduation_rate));
            updateColors(".graduation-rate2 font", getPercentageColor(school.graduation_rate, averages.graduation_rate));

            if (school.homepage.toLowerCase().includes("http")) {
                $(".homepage2 a").attr('href', school.homepage);
                $(".homepage2 a").html(school.homepage);
            } else {
                $(".homepage2 a").attr('href', "http://" + school.homepage);
                $(".homepage2 a").html("http://" + school.homepage);
            }

            $(".in-state-tuition2 p").html(formatMoney(school.in_state_tuition));
            updatePopover(".in-state-tuition2 span", getDecimalPopoverMessage(school.in_state_tuition, averages.in_state_tuition));
            updateColors(".in-state-tuition2 font", getDecimalColorReverse(school.in_state_tuition, averages.in_state_tuition));
            $(".out-of-state-tuition2 p").html(formatMoney(school.out_of_state_tuition));
            updatePopover(".out-of-state-tuition2 span", getDecimalPopoverMessage(school.out_of_state_tuition, averages.out_of_state_tuition));
            updateColors(".out-of-state-tuition2 font", getDecimalColorReverse(school.out_of_state_tuition, averages.out_of_state_tuition));
            $(".average-debt2 p").html(formatMoney(school.average_student_debt));
            updatePopover(".average-debt2 span", getDecimalPopoverMessage(school.average_student_debt, averages.average_student_debt));
            updateColors(".average-debt2 font", getDecimalColorReverse(school.average_student_debt, averages.average_student_debt));

            openCompare(school);
        }
    });
}

function toggleBrowse() {
    if ($('#browse-by .active').html().includes('name')) {
        $('#state').hide();
        $('#name').show();
        $('#state-table').hide();
        $('#name-table').show();
        $('#state-table .browse-table-body').hide();
        $('#name-table .browse-table-body').show();
    } else {
        $('#name').hide();
        $('#state').show();
        $('#name-table').hide();
        $('#state-table').show();
        $('#name-table .browse-table-body').hide();
        $('#state-table .browse-table-body').show();
    }
}

function openCompare(school) {
    $(".compare .info-list").show();
    $("#radar-chart2").remove();
    $("#salary-chart2").remove();
    $("#repayment-chart2").remove();
    $(".radar-chart-container2").append("<canvas id=\"radar-chart2\" width=\"400\" height=\"400\"></canvas>");
    $(".salary-chart-container2").append("<canvas id=\"salary-chart2\" width=\"400\" height=\"400\"></canvas>");
    $(".repayment-chart-container2").append("<canvas id=\"repayment-chart2\" width=\"400\" height=\"400\"></canvas>");

    var radarChart = document.getElementById("radar-chart2");
    var roi_score = decimalToPercent(1 - 1 / ((school.salary_twentyfive + school.salary_seventyfive) / 2 / ((school.in_state_tuition + school.out_of_state_tuition) / 2)) / 5);
    var cost_score = decimalToPercent(1 - 1 / (100000 / ((school.in_state_tuition + school.out_of_state_tuition + 2 * school.average_student_debt) / 4)));
    var state_score = school.state_score;
    var graduation_score = decimalToPercent(school.graduation_rate);
    var retention_score = decimalToPercent(school.retention_rate);
    var total_score = decimalToPercent((.2 * roi_score + .1 * cost_score + .1 * state_score + .3 * graduation_score + .3 * retention_score) / 100);
    $('.score2 p').html(total_score);
    updateColors(".score2 font", getScoreColor(total_score));
    var data = {
        labels: ["Return on investment", "Cost and debt", "Location", "Graduation rate", "Retention rate"],
        datasets: [
            {
                label: "Individual score",
                backgroundColor: "rgba(255,99,132,0.2)",
                borderColor: "rgba(255,99,132,1)",
                pointBackgroundColor: "rgba(255,99,132,1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(255,99,132,1)",
                data: [roi_score, cost_score, state_score, graduation_score, retention_score]
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

    var salaryChart = document.getElementById("salary-chart2");
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

    var repaymentChart = document.getElementById("repayment-chart2");
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
}

function browse() {
    if ($('#browse-by .active').html().includes('name')) {
        $('#state').hide();
        $('#name').show();
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
                $('#name-table .browse-table-body td').remove();
                var row;
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        var s = list[i];
                        row = "<tr><td>" + (i + 1) + "</td><td><a href=\"/?name=" + s.name + "\">" + s.name + "</a></td><td><font style=\"color: "
                            + getScoreColor(decimalToPercent(s.score)) + ";\">"
                            + decimalToPercent(s.score) + "</font></td><td>" + s.city + "</td><td>" + s.state + "</td><td><font style=\"color: " 
                            + getDecimalColorReverse(s.in_state_tuition, averages.in_state_tuition) + ";\">"
                            + formatMoney(s.in_state_tuition) + "</font></td><td><font style=\"color: " 
                            + getDecimalColorReverse(s.out_of_state_tuition, averages.out_of_state_tuition) + ";\">"
                            + formatMoney(s.out_of_state_tuition) + "</font></td><td><font style=\"color: " 
                            + getDecimalColor(s.average_salary, averages.average_income) + ";\">"
                            + formatMoney(s.average_salary) + "</font></td></tr>";
                        $('#name-table .browse-table-body').append(row);
                    }
                }
            },
            error: function(e) {
                $('#name-table .browse-table-body td').remove();
            }
        });
    } else {
        $.ajax({
            dataType: "JSON",
            type: 'post',
            url: "php/QueryBrowseByState.php",
            data: {
                state: $("[name = 'state-state']").val(),
                sort_by: $("[name = 'state-sort-by']").val(),
                limit: $("[name = 'state-limit']").val()
            },
            success: function(list) {
                $('#state-table .browse-table-body td').remove();
                var row;
                if (list) {
                    for (var i = 0; i < list.length; i++) {
                        var s = list[i];
                        row = "<tr><td>" + (i + 1) + "</td><td>" + s.name + "</td><td>" + s.score + "</td><td>" + decimalToPercent(s.average_school_score) + "</td><td>" 
                            + formatMoney(s.average_in_state_tuition) + "</td><td>" + formatMoney(s.average_out_of_state_tuition) + "</td><td>" 
                            + formatMoney(s.avg_salary) + "</td></tr>";
                        $('#state-table .browse-table-body').append(row);
                    }
                }
            },
            error: function(e) {
                $('#state-table .browse-table-body td').remove();
            }
        });
    }
}

function openInfo(school) {
    $(".main").animate({'left': '410px'}, 300);
    $("#radar-chart").remove();
    $("#salary-chart").remove();
    $("#repayment-chart").remove();
    $(".radar-chart-container").append("<canvas id=\"radar-chart\" width=\"400\" height=\"400\"></canvas>");
    $(".salary-chart-container").append("<canvas id=\"salary-chart\" width=\"400\" height=\"400\"></canvas>");
    $(".repayment-chart-container").append("<canvas id=\"repayment-chart\" width=\"400\" height=\"400\"></canvas>");

	var radarChart = document.getElementById("radar-chart");
    var roi_score = decimalToPercent(1 - 1 / ((school.salary_twentyfive + school.salary_seventyfive) / 2 / ((school.in_state_tuition + school.out_of_state_tuition) / 2)) / 5);
    var cost_score = decimalToPercent(1 - 1 / (100000 / ((school.in_state_tuition + school.out_of_state_tuition + 2 * school.average_student_debt) / 4)));
    var state_score = school.state_score;
    var graduation_score = decimalToPercent(school.graduation_rate);
    var retention_score = decimalToPercent(school.retention_rate);
    var total_score = decimalToPercent((.2 * roi_score + .1 * cost_score + .1 * state_score + .3 * graduation_score + .3 * retention_score) / 100);
    $('.score p').html(total_score);
    updateColors(".score font", getScoreColor(total_score));
    var data = {
    	labels: ["Return on investment", "Cost and debt", "Location", "Graduation rate", "Retention rate"],
    	datasets: [
	        {
	            label: "Individual score",
	            backgroundColor: "rgba(255,99,132,0.2)",
            	borderColor: "rgba(255,99,132,1)",
            	pointBackgroundColor: "rgba(255,99,132,1)",
            	pointBorderColor: "#fff",
            	pointHoverBackgroundColor: "#fff",
            	pointHoverBorderColor: "rgba(255,99,132,1)",
	            data: [roi_score, cost_score, state_score, graduation_score, retention_score]
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
}

function setUpSearch(schools) {
    $(".main #search").autocomplete({
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
    $(".main #search").focus(function () {
        $(this).autocomplete("search", this.value);
    });
    $(".compare #search").autocomplete({
        source: function(request, response) {
            response($.ui.autocomplete.filter(schools, request.term).slice(0, 100));
        },
        select: function (e, ui) {
            $("#search").blur();
            if (window.location.toString().includes("browse")) {
                $("#browse").hide();
                window.location = '/?name=' + ui.item.value;
            }
            var schoolInfo = getSchoolCompare(ui.item.value);
        }
    })
    $(".compare #search").focus(function () {
        $(this).autocomplete("search", this.value);
    });
}

function closeInfo() {
    $(".main").animate({'left': '0px'}, 300);
}

function toggleCompare() {
    var main = $(".main");
    if (main.css('left') != "410px") {
        main.animate({'left': '410px'}, 300);
    } else {
        main.animate({'left': '820px'}, 300, function() {
            $(".compare #search").focus();
            $(".compare #search").select();
        });
    }
}

function toggleSearch() {
    var search = $(".main #search");
    if (search.css('width') != "0px") {
        search.animate({'width': '0px'}, 500);
    } else {
        search.animate({'width': '300px'}, 500, function() {
            search.focus();
            search.select();
        });
    }
}

function toggleSearchWithoutSelect() {
    var search = $(".main #search");
    if(search.css('width') != "0px") {
        search.css('width', '0px');
    } else {
        search.css('width', '300px');
    }
}
