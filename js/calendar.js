days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

current_date = new Date(); 

function change(month,year) {

	if(month < 0) {
    nextMonth = 0;
    nextYear = year

		month = 11;
		year = year - 1;
	}
	else { 
    if(month > 11){ 
    		month = 0;
		    year = year + 1; 
      }
    nextMonth = month + 1;
    nextYear = year;

    if (nextMonth > 11) {
      nextMonth = 0;
      nextYear += 1;
    }
  }
  var cal = new Calendar(month,year);
  var nextCal = new Calendar(nextMonth,nextYear);

  cal.generateHTML();
  nextCal.generateHTML();

  document.getElementById('cal-table').innerHTML = cal.getHTML();
  document.getElementById('cal-table').innerHTML += nextCal.getHTML();

  document.getElementById('prev').innerHTML = '<a href="javascript:void(0);" onclick="return change('+(cal.month-1)+',' + cal.year + ');"><div id="sel-prev"></div></a>';
  document.getElementById('next').innerHTML = '<a href="javascript:void(0);" onclick="return change('+(nextCal.month)+',' + nextCal.year + ');"><div id="sel-next"></div></a>';

  display_schedule(month,year);
  display_schedule(nextMonth,nextYear);
}

function display_schedule(month,year)
{
  var slist = empdb.employee.find({fyear : year, fmonth : month});
  console.log(year, month,slist);
  
}

function get_emplist(cid)
{
  var elist = empdb.employee.find({category : cid});
  if(elist.length!=0){
    var result = {};
    result['emp_id'] = elist[0].sn;
    result['name'] = elist[0].ename;
    result['schedules'] = elist[0].schedules;
    return result;
  }
  else
    return false;
}

function Calendar(month, year) {
  this.month = month;
  this.year  = year;
  this.html = '';
}

Calendar.prototype.generateHTML = function(){

  var firstDay = new Date(this.year, this.month, 1);
  var startingDay = firstDay.getDay();
  var monthLength = days_in_month[this.month];
  var monthName = months_labels[this.month];

  // compensate for leap year
  if (this.month == 1) { // February only!
    if((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
      monthLength = 29;
    }
  }

// month header

  var html = '<table id="cal-'+ this.month +'-'+this.year+' class="cal-block"><tr id="month_row">';
  html += '<th colspan="'+ monthLength +'">' + monthName + "&nbsp;" + this.year + '</th></tr>';
  html += '<tr class="calendar-header">';

// day labels

  for(var i = startingDay, j = 0; j < monthLength; i++, j++ ){
    html += '<td class="calendar-header-day">';
    html += days_labels[i];
    html += '</td>';

    if(i == 6){
    	i = -1;
    }
  }
  html += '</tr>';

  // fill in the days

  html += '<tr class = "days-row">';
  for(var i = 1; i <= monthLength; i++) {
  	html += '<td class="calendar-day">' + i + '</td>';
  }

  html += '</tr>';

  cid = document.getElementById('select_category').value;

  var emp_list = get_emplist(cid);
  console.log(emp_list);

  html +='</table>';
  this.html = html;
}

Calendar.prototype.getHTML = function() {
  return this.html;
}   


$(document ).ready(function() {
  document.getElementById('select-cat').innerHTML = select_category("");
  //f = 'get_emplist(this.value)';
  //document.getElementById('select_category').setAttribute('onchange', f); 
  change(current_date.getMonth(),current_date.getFullYear());  
});