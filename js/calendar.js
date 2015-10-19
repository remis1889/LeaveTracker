// these are labels for the days of the week
cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// these are human-readable month name labels, in order
cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

// these are the days of the week for each month, in order
cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// this is the current date
cal_current_date = new Date(); 

function change(month,year) {
	if(month < 0) {
		month = 11;
		year = year - 1;
	}
	else if(month > 11){
		month = 0;
		year = year + 1;
	}
	
	var newCal = new Calendar(month, year);
	newCal.generateHTML();
	document.getElementById('leaveCal').innerHTML = newCal.getHTML();

}

function Calendar(month, year) {
  this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
  this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
  this.html = '';
}

Calendar.prototype.generateHTML = function(){

  // get first day of month
  var firstDay = new Date(this.year, this.month, 1);
  var startingDay = firstDay.getDay();

  // switch to next year after December

    if(this.month + 1 > 11){
		nextMonth = 0;
		nextYear = this.year + 1;
	}
	else{
		nextMonth = this.month + 1;
		nextYear = this.year;
	}
  console.log(nextMonth,nextYear);
  
  // find number of days in month
  var monthLength = cal_days_in_month[this.month];
  var nextMonthLength = cal_days_in_month[nextMonth];

  
  // compensate for leap year
  if (this.month == 1) { // February only!
    if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
      monthLength = 29;
    }
  }
  
  // do the header
  var monthName = cal_months_labels[this.month]
  var nextMonthName = cal_months_labels[nextMonth]

  var html = '<div class = "sel-arrow">';
  html += '<a href="javascript:void(0);" onclick="return change('+(this.month-1)+',' + this.year + ');"><div id="sel-prev"></div></a></div>';
  html += '<div class="cal-table"> <table><tr id="month_row">';
  html += '<th colspan="'+ monthLength +'">' + monthName + "&nbsp;" + this.year + '</th>';
  html += '<th colspan="'+ nextMonthLength +'">' + nextMonthName + "&nbsp;" + nextYear +'</th></tr>';
  html += '<tr class="calendar-header">';
  

  for(var i = startingDay, j = 0; j < (monthLength + nextMonthLength); i++, j++ ){
    
    html += '<td class="calendar-header-day">';
    html += cal_days_labels[i];
    html += '</td>';

    if(i == 6){
    	i = -1;
    }
  }
  html += '</tr>';

  // fill in the days

  html += '<tr class = "days-row">'

  for(var i = 1; i <= monthLength; i++) {
  	html += '<td class="calendar-day">' + i + '</td>';
  }

  for(var i = 1; i <= nextMonthLength; i++) {
  	html += '<td class="calendar-day">' + i + '</td>';
  }

  html += '</tr></table></div></div><div class = "sel-arrow">';
  html += '<a href="javascript:void(0);" onclick="return change('+(nextMonth)+',' + nextYear + ');"><div id="sel-next"></div></a></div>';

  this.html = html;

 
}



Calendar.prototype.getHTML = function() {
  return this.html;
}   

var cal = new Calendar();

cal.generateHTML();

window.onload  =   function() {
    document.getElementById('leaveCal').innerHTML = cal.getHTML();
}


