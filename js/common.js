$(function(){
    $("#header").load("header.html"); 
});

function isNumeric(value) {
    return /^\d+$/.test(value);
}

function get_category(cid){
	var c = categdb.category.find({_id : cid});
	return c[0];
}

function get_status(sid){
	var s = statusdb.status.find({_id : sid});
	return s[0];
}

/*

Sort by array property

function compare(a,b) {
  if (a.last_nom < b.last_nom)
    return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}

objs.sort(compare);

*/



function emp_details()
{
	var emp_id = document.getElementById('emp_id').value;
	if(!isNumeric(emp_id) || emp_id=='' || emp_id.length!=5)
		alert("Enter a valid staff number!");
	else{
		var elist = get_emp(emp_id);
		if(!elist){
			alert("Enter a valid staff number!");
		}
		else{	
			$('#emp-details').show();		

			document.getElementById('sno').innerHTML = emp_id;
			document.getElementById('name').innerHTML = elist['name'];
			document.getElementById('cat').innerHTML = elist['category'];
			document.getElementById('total').innerHTML = elist['total'];
			document.getElementById('taken').innerHTML = elist['taken'];
			document.getElementById('balance').innerHTML = elist['balance'];
			show_leave_history(emp_id);
		}
	}
}

function get_emp(emp_id)
{
	var elist = empdb.employee.find({sn : emp_id});
	if(elist.length!=0){
		var result = {};

		result['category'] = get_category(elist[0].category).name;
		result['general'] = +get_category(elist[0].category).leave;
		result['coff'] = +elist[0].coff;
		result['carry'] = +elist[0].carry;
		result['total'] = result['general'] + result['coff'] + result['carry'];
		result['taken'] = +elist[0].taken;
		result['balance'] = result['total'] - result['taken'];
		result['name'] = elist[0].ename;
		return result;
	}
	else
		return false;
}

function show_leave_history(emp_id)
{
	var slist = scheduledb.schedule.find({emp : emp_id});
	var row_list = "";
	var scheduled = 0;
	
	if(slist.length>0){
		for (var i = 0; i < slist.length; i++) {
			var status = get_status(slist[i].status).name;
			row_list += "<tr id='el_"+slist[i]._id+"'>";
			row_list += "<td>"+(i+1)+"</td>";
			row_list += "<td>"+slist[i].fday+" - "+slist[i].fmonth+" - "+slist[i].fyear+"</td>";
			row_list += "<td>"+slist[i].tday+" - "+slist[i].tmonth+" - "+slist[i].tyear+"</td>";
			row_list += '<td id="taken_'+slist[i]._id+'">'+slist[i].total+'</td>';
			row_list += '<td id="status_'+slist[i]._id+'">'+status+'</td>';
			row_list += "<td>"+slist[i].date+"</td>";
			
			if(slist[i].status!='be19a76096f143498b8561e7ca49d505'){
				row_list += '<td id="edit_'+slist[i]._id+'">';
				row_list += '<a href="javascript:void(0);" onclick="return edit_leave('+"'"+slist[i]._id+"'"+');">Edit</a>';
				row_list += '</td><td>';
				row_list += '<a href="javascript:void(0);" onclick="return delete_leave('+emp_id+','+"'"+slist[i]._id+"'"+');">Delete</a></td>';
				scheduled += slist[i].total;
			}
			else
				row_list += '<td colspan=2></td>';
			
			row_list += "</tr>";

		};
	}
	else{
		row_list = '<tr><td colspan=8>No Leave History Found!</td></tr>';
	}

	row_list += '<tr id="sform"><td colspan=8><input type="button" value="Schedule" id="add-leave" onclick="return schedule_form('+emp_id+');"></td></tr>';
	$('#leave-history').append(row_list);
	document.getElementById('schedule').innerHTML = scheduled;	
}

function delete_leave(emp_id, id){
	if(confirm("Are you sure?")){
		scheduledb.schedule.remove({_id : id});
		$("#leave-history").find("tr:gt(0)").remove();
		show_leave_history(emp_id);	
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
	
	var query = {
	  _id : id
	};
	
	var uss = {
		status : status	    
	} 
	scheduledb.schedule.update(query, uss);
	var emp_id = document.getElementById('emp_id').value;
	var taken = document.getElementById('taken_'+id).value;
	if(status=="be19a76096f143498b8561e7ca49d505")
		update_leave_balance(emp_id, taken);
	$("#leave-history").find("tr:gt(0)").remove();
	show_leave_history(emp_id);	
	document.getElementById('taken').innerHTML = taken;
}

function update_leave_balance(emp_id, days)
{
	var query = {
	  sn : emp_id
	};
	
	var ul = {
		taken : days	    
	} 
	empdb.employee.update(query, ul);
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

function schedule_form(emp_id) {
	var sform = '<form id="form"><td id="err">&nbsp;</td>'
	sform += '<td><input type="text" id="from" readonly="true" placeholder="Starting Date"></td>';
	sform += '<td><input type="text" id="to" readonly="true" placeholder="Ending Date"></td>';
	sform += '<td>Status '+select_status('')+'</td>';
	sform += '<td><input type="button" value="Submit" id="add_leave" onclick="return schedule_leave('+emp_id+');"></td>';
    sform += '<td><input type="button" onclick="return refresh();" value="Cancel"></td></form>';
	document.getElementById('sform').innerHTML = sform;

    var startDate, endDate, today = new Date();
    var dateRange = [];
    var slist = scheduledb.schedule.find({emp : emp_id});
	

	if(slist.length>0){
		for (var i = 0; i < slist.length; i++) {
			
			startDate = new Date(slist[i].fyear+"-"+slist[i].fmonth+"-"+slist[i].fday);
			endDate = new Date(slist[i].tyear+"-"+slist[i].tmonth+"-"+slist[i].tday);

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

function schedule_leave(emp_id) {
	var start = $('#from').datepicker('getDate');
	var end   = $('#to').datepicker('getDate');
	var days   = ((end - start)/1000/60/60/24) + 1;
	var leave_days = days - (Math.floor(days/7)*2); 
	
	
	if(get_emp(emp_id)['balance'] - leave_days > 0){
		var taken = get_emp(emp_id)['taken'] + leave_days;
		var from = $("#from").val();
		var to = $("#to").val();

		var f = from.split(" - ");
		var	t = to.split(" - ");
		

		var date = $.datepicker.formatDate('dd - mm - yy', new Date());
		var status = $("#select_status").val();
		
		var s = {
			fday : f[0],
			fmonth : f[1],
			fyear : f[2],
		    tday : t[0],
			tmonth : t[1],
			tyear : t[2],
		    status : status,
		    date : date,
		    emp : emp_id,
		    total : leave_days
		}
		
		scheduledb.schedule.save(s);
		if(status=="be19a76096f143498b8561e7ca49d505")
			update_leave_balance(emp_id, taken);
		$("#leave-history").find("tr:gt(0)").remove();
		show_leave_history(emp_id);	
		//document.getElementById('err').innerHTML = "Leave added successfully!";
	}
	else
		alert("Leave cannot be scheduled");
}


function refresh()
{
	$("#emp-details").find("tr:gt(0)").remove();
	emp_details();
	
}

