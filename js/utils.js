function decimalToPercent(num) {
    return Math.round(num * 10000) / 100;
}

function formatMoney(amount) {
    return "$" + (Math.round(amount * 100) / 100).toLocaleString();
}

function updatePopover(element, message) {
    $(element).attr('data-content', message);
}

function updateColors(element, color) {
	$(element).css('color', color);
}

function getPercentagePopoverMessage(rate, average) {
    var difference = decimalToPercent(rate - average);
    if (difference >= 0) {
        return difference + "% higher than the national average.";
    } else {
        return Math.abs(difference) + "% lower than the national average.";
    }
}

function getPercentageColor(rate, average) {
	var difference = rate - average;
	if (difference >= .1) {
		return "#009900";
	} else if (difference >= 0) {
		return "#b5af17";
	} else if (difference >= -.1) {
		return "#b37200";
	} else {
		return "#cc5200";
	}
}

function getDecimalColor(rate, average) {
	var difference = rate - average;
	if (difference >= 10000) {
		return "#009900";
	} else if (difference >= 0) {
		return "#b5af17";
	} else if (difference >= -10000) {
		return "#b37200";
	} else {
		return "#cc5200";
	}
}

function getDecimalColorReverse(rate, average) {
	var difference = rate - average;
	if (difference <= -10000) {
		return "#009900";
	} else if (difference <= 0) {
		return "#b5af17";
	} else if (difference <= 10000) {
		return "#b37200";
	} else {
		return "#cc5200";
	}
}

function getScoreColor(score) {
	if (score >= 90) {
		return "#009900";
	} else if (score >= 80) {
		return "#b5af17";
	} else if (score >= 70) {
		return "#b37200";
	} else {
		return "#cc5200";
	}
}

function getDecimalPopoverMessage(rate, average) {
    var difference = rate - average;
    if(difference >= 0) {
        return formatMoney(difference) + " higher than the national average.";
    } else {
        return formatMoney(Math.abs(difference)) + " lower than the national average.";
    }
}

function translateType(type) {
	switch (type) {
		case 1:
			return "Public University";
		case 2:
			return "Private Non-Profit University";
		case 3:
			return "Private For-Profit University";
		default:
			return type;
	}
}

function translateLocale(locale) {
	switch (locale) {
		case 11:
			return "Large City (population of 250,000 or more)"
		case 12:
			return "Midsize City (population of 100,000 or more)"
		case 13:
			return "Small City (population of less than 100,000)"
		case 21:
			return "Large Suburb"
		case 22:
			return "Midsize Suburb"
		case 23:
			return "Small Suburb"
		case 31:
		case 32:
		case 33:
			return "Small Town"
		case 41:
		case 42:
		case 43:
			return "Rural"
		default:
			return locale;
	}
}