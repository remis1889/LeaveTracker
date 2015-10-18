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

function Calendar(month, year) {
  this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month;
  this.year  = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
  this.html = '';
}

Calendar.prototype.generateHTML = function(){

  // get first day of month
  var firstDay = new Date(this.year, this.month, 1);
  var startingDay = firstDay.getDay();
  
  // find number of days in month
  var monthLength = cal_days_in_month[this.month];
  var nextMonthLength = cal_days_in_month[this.month + 1];

  
  // compensate for leap year
  if (this.month == 1) { // February only!
    if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
      monthLength = 29;
    }
  }
  
  // do the header
  var monthName = cal_months_labels[this.month]
  var nextMonthName = cal_months_labels[this.month + 1]

  var html = '<div class = "sel-arrow">';
  html += '<div id="sel-prev"></div></div>';
  html += '<div id="month_row"><span id="month_' + this.month + '">';
  html += monthName + "&nbsp;" + this.year + '</span><span id="month_' + (this.month + 1) + '">';
  html += nextMonthName + "&nbsp;" + this.year+'</span></div>';
  html += '<div class="calendar-header">';
  for(var i = startingDay, j = 0; j < (monthLength + nextMonthLength); i++, j++ ){
    
    html += '<span class="calendar-header-day">';
    html += cal_days_labels[i];
    html += '</span>';

    if(i == 6){
    	i = -1;
    }
  }
  html += '</div>';

  // fill in the days

  html += '<div class = "days-row">'

  for(var i = 1; i <= monthLength; i++) {
  	html += '<span class="calendar-day">' + i + '</span>';
  }

  for(var i = 1; i <= nextMonthLength; i++) {
  	html += '<span class="calendar-day">' + i + '</span>';
  }

  html += '</div></div><div class = "sel-arrow"><div id="sel-next"></div></div>';

  this.html = html;

 
}



Calendar.prototype.getHTML = function() {
  return this.html;
}                     
var cal = new Calendar();

cal.generateHTML();

window.onload  =   function() {
    document.getElementById('leaveCal').innerHTML = cal.getHTML();
    document.getElementById('cmonth').value = cal.month;
    document.getElementById('cyear').value = cal.year;
}


