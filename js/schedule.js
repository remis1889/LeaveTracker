var emp_schedules = [];
var emp_schedule_length, emp_balance, emp_taken, scheduled, emp_id;

function emp_details(eid)
{
	emp_id = eid;
	var elist = get_emp();
	$('#emp-details').show();		
	document.getElementById('sno').innerHTML = emp_id;
	document.getElementById('name').innerHTML = elist['name'];
	document.getElementById('cat').innerHTML = elist['category'];
	document.getElementById('total').innerHTML = elist['total'];
	document.getElementById('taken').innerHTML = emp_taken;
	document.getElementById('balance').innerHTML = emp_balance;
	show_leave_history();
}

function get_emp()
{
	var elist = empdb.employee.find({sn : emp_id});
	if(elist.length!=0){
		var result = {};
		result['category'] = get_categ_stat(elist[0].category,1).name;
		result['general'] = +get_categ_stat(elist[0].category,1).leave;
		result['coff'] = +elist[0].coff;
		result['carry'] = +elist[0].carry;
		result['total'] = result['general'] + result['coff'] + result['carry'];
		emp_taken = +elist[0].taken;
		emp_balance = result['total'] - emp_taken;
		result['name'] = elist[0].ename;
		emp_schedules = elist[0].schedules;
		emp_schedule_length = emp_schedules.length;
		return result;
	}
	else
		return false;
}

function show_leave_history()
{
	var row_list = "", scheduled = 0;
	
	if(emp_schedule_length>0){
		for (var i = 0; i < emp_schedule_length; i++) {
			var status = get_categ_stat(emp_schedules[i].status,2).name;
			row_list += "<tr id='el_"+emp_schedules[i].sid+"'>";
			row_list += "<td>"+(i+1)+"</td>";
			row_list += "<td>"+emp_schedules[i].fday+" - "+emp_schedules[i].fmonth+" - "+emp_schedules[i].fyear+"</td>";
			row_list += "<td>"+emp_schedules[i].tday+" - "+emp_schedules[i].tmonth+" - "+emp_schedules[i].tyear+"</td>";
			row_list += '<td id="taken_'+emp_schedules[i].sid+'">'+emp_schedules[i].total+'</td>';
			row_list += '<td id="status_'+emp_schedules[i].sid+'">'+status+'</td>';
			row_list += "<td>"+emp_schedules[i].date+"</td>";
			
			if(emp_schedules[i].status!='be19a76096f143498b8561e7ca49d505'){
				row_list += '<td id="edit_'+emp_schedules[i].sid+'">';
				row_list += '<a href="javascript:void(0);" onclick="return edit_leave('+"'"+emp_schedules[i].sid+"'"+');">Edit</a>';
				row_list += '</td><td>';
				row_list += '<a href="javascript:void(0);" onclick="return delete_leave('+"'"+emp_schedules[i].sid+"'"+');">Delete</a></td>';
				scheduled += emp_schedules[i].total;
			}
			else
				row_list += '<td colspan=2></td>';
			
			row_list += "</tr>";
		};
	}
	else{
		row_list = '<tr><td colspan=8>No Leave History Found!</td></tr>';
	}
	if(emp_balance > 0)
		row_list += '<tr id="sform"><td colspan=8><input type="button" value="Schedule" id="add-leave" onclick="return schedule_form();"></td></tr>';
	$('#leave-history').append(row_list);
	document.getElementById('schedule').innerHTML = scheduled;	
}

function schedule_form() {
	var sform = '<form id="form"><td id="err">&nbsp;</td>'
	sform += '<td><input type="text" id="from" readonly="true" placeholder="Starting Date"></td>';
	sform += '<td><input type="text" id="to" readonly="true" placeholder="Ending Date"></td>';
	sform += '<td>Status '+select_status('')+'</td>';
	sform += '<td><input type="button" value="Submit" id="add_leave" onclick="return schedule_leave();"></td>';
    sform += '<td><input type="button" onclick="return refresh();" value="Cancel"></td></form>';
	document.getElementById('sform').innerHTML = sform;

    var startDate, endDate, today = new Date();
    var dateRange = [];
    
	if(emp_schedule_length>0){
		for (var i = 0; i < emp_schedule_length; i++) {
			
			startDate = new Date(emp_schedules[i].fyear+"-"+emp_schedules[i].fmonth+"-"+emp_schedules[i].fday);
			endDate = new Date(emp_schedules[i].tyear+"-"+emp_schedules[i].tmonth+"-"+emp_schedules[i].tday);

			if(startDate < today){
				if(endDate < today)	
					continue;
				else if(endDate >= today)	
					startDate = today;
			}
			for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    			dateRange.push($.datepicker.formatDate('yy-mm-dd', d));
			}	
		}	
	}	
	
	$( "#from" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3,
      dateFormat: 'dd - mm - yy',
      beforeShowDay: function (date) {
		    var dateString = jQuery.datepicker.formatDate('yy-mm-dd', date);
		    return [dateRange.indexOf(dateString) == -1];
		},
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });

    $( "#to" ).datepicker({
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 3,
      dateFormat: 'dd - mm - yy',
      beforeShowDay: function (date) {
		    var dateString = jQuery.datepicker.formatDate('yy-mm-dd', date);
		    return [dateRange.indexOf(dateString) == -1];
		},
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
    });
    $("#from").datepicker("option", "minDate", 0);
}

function schedule_leave() {
	
	if($('#from').val()=="" || $('#to').val()==""){
		alert("Enter start date and end date!");
		return false;
	}

	var start = $('#from').datepicker('getDate');
	var end   = $('#to').datepicker('getDate');

	var days   = ((end - start)/1000/60/60/24) + 1;
	var leave_days = days - (Math.floor(days/7)*2); 
	
	if((emp_balance - scheduled) < leave_days) {
		alert("Sorry, you have reached the schedule limit!");
		return false;
	}	
	
	else {
		var from = $("#from").val();
		var to = $("#to").val();

		var f = from.split(" - ");
		var	t = to.split(" - ");
		

		var date = $.datepicker.formatDate('dd - mm - yy', new Date());
		var status = $("#select_status").val();
		if(status=="be19a76096f143498b8561e7ca49d505")
			emp_taken += leave_days;
		
		var s = {
			fday : f[0],
			fmonth : f[1],
			fyear : f[2],
		    tday : t[0],
			tmonth : t[1],
			tyear : t[2],
		    status : status,
		    date : date,
		    total : leave_days,
		    sid : Date.now()
		}
		emp_schedules[emp_schedule_length++] = s;
		update_schedule();
		alert("Leave scheduled successfully!");
	}
}

function delete_leave(id){
	if(confirm("Are you sure?")){
		emp_schedules = emp_schedules.filter(function( obj ) {
		    return obj.sid != id;
		});
		
		update_schedule();
		alert("Schedule deleted successfully!");
	}
}

function edit_leave(lid)
{
	var status = document.getElementById('status_'+lid).innerHTML;
	
	document.getElementById('status_'+lid).innerHTML = select_status(status);
	document.getElementById('edit_'+lid).innerHTML = '<input type="button" value="Update" onclick="return update_leave_status('+"'"+lid+"'"+');"><input type="button" onclick="return refresh();" value="Cancel">';
}

function update_leave_status(id)
{
	var status = document.getElementById('select_status').value;
	for (var i = 0; i < emp_schedule_length; i++) {
	    if (emp_schedules[i].sid == id) {
	        emp_schedules[i].status = status;
	    }
	}
	if(status=="be19a76096f143498b8561e7ca49d505")
		emp_taken += +(document.getElementById('taken_'+id).innerHTML);		

	update_schedule();
	alert("Schedule updated successfully!");
}

function update_schedule()
{
	var query = {
	  sn : emp_id
	};
	
	var uemp = {
		schedules : emp_schedules,
		taken : emp_balance
	}; 

	empdb.employee.update(query, uemp);
	refresh();
}

function select_status(select){
	var slist = statusdb.status.find();
	var stat = '<select name="status" id="select_status">';
	for(var i=0; i<slist.length; i++)
	{
		if(slist[i].name==select)
			stat += '<option value="'+slist[i]._id+'" selected>'+slist[i].name+'</option>';
		else
			stat += '<option value="'+slist[i]._id+'">'+slist[i].name+'</option>';      
	}
	stat += '</td>';

	return stat;
}

function refresh()
{
	$("#leave-history").find("tr:gt(0)").remove();
	emp_details(emp_id);
	
}