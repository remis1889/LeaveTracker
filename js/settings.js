$(document ).ready(function() {
  load_category();  
  load_status();
});

function load_category(){
	var cat_list = categdb.category.find();
	var row_list = "";

	if(cat_list.length>0){
		for (var i = 0; i < cat_list.length; i++) {
			row_list += "<tr id='cat_"+cat_list[i]._id+"'>";
			row_list += "<td>"+(i+1)+"</td>";
			row_list += "<td id='cat_val_"+cat_list[i]._id+"'>"+cat_list[i].name+"</td>";
			row_list += "<td id='cat_leave_"+cat_list[i]._id+"'>"+cat_list[i].leave+"</td>";
			row_list += '<td id="cat_edit_'+cat_list[i]._id+'"><a href="javascript:void(0);" onclick="return categ_update_form('+"'"+cat_list[i]._id+"'"+');">Edit</a></td>';
			row_list += '<td><a href="javascript:void(0);" onclick="return delete_category('+"'"+cat_list[i]._id+"'"+');">Delete</a></td>';
			row_list += "</tr>";
		};
	}
	else{
		row_list = '<tr><td colspan=5 id="categ404">No Category Data Found!</td></tr>';
	}

	row_list += '<tr id="categ_add_more"><td colspan=5><input type="button" value="Add" id="add_newc" onclick="return categ_add_form();"></td></tr>';
	$('#set-category').append(row_list);	

}

function load_status(){
	var sat_list = statusdb.status.find();
	var row_list = "";

	if(sat_list.length>0){
		for (var i = 0; i < sat_list.length; i++) {
			row_list += "<tr id='sat_"+sat_list[i]._id+"'>";
			row_list += "<td>"+(i+1)+"</td>";
			row_list += "<td id='sat_val_"+sat_list[i]._id+"'>"+sat_list[i].name+"</td>";
			row_list += '<td id="sat_edit_'+sat_list[i]._id+'"><a href="javascript:void(0);" onclick="return stat_update_form('+"'"+sat_list[i]._id+"'"+');">Edit</a></td>';
			if(sat_list[i]._id!='be19a76096f143498b8561e7ca49d505')
				row_list += '<td><a href="javascript:void(0);" onclick="return delete_status('+"'"+sat_list[i]._id+"'"+');">Delete</a></td>';
			else
				row_list += '<td>Delete</td>';
			row_list += "</tr>";
		};
	}
	else{
		row_list = '<tr><td colspan=4 id="status404">No Status Data Found!</td></tr>';
	}

	row_list += '<tr id="stat_add_more"><td colspan=5><input type="button" value="Add" id="add_news" onclick="return status_add_form();"></td></tr>';
	$('#set-status').append(row_list);	
}


function categ_add_form(){
	var cat_form = '<form id="categ_add_form"><td id="cerr">&nbsp;</td><td><input type="text" id="new_categ" placeholder="Category"></td>';
	cat_form += '<td><input type="text" id="annual_leave" placeholder="Annual Leave"></td>';
	cat_form += '<td><input type="button" value="Add New Category" id="add_categ" onclick="return validate(1);"></td>';
    cat_form += '<td><input type="button" onclick="location.reload();" value="Cancel"></td></form>';
	document.getElementById("categ_add_more").innerHTML = cat_form;	         	
}

function status_add_form(){
	var sat_form = '<form id="stat_add_form"><td id="serr">&nbsp;</td><td><input type="text" id="new_status" placeholder="Status"></td>';
	sat_form += '<td><input type="button" value="Add New Status" id="add_status" onclick="return validate(2);"></td>';
    sat_form += '<td><input type="button" onclick="location.reload();" value="Cancel"></td></form>';
	document.getElementById("stat_add_more").innerHTML = sat_form;	         	
}2

function add_category(category,annual_leave){

	var categ = {
	    name : category,
	    leave : annual_leave
	}
	categdb.category.save(categ);
	//document.getElementById('cerr').innerHTML = "Category added successfully!";
	location.reload();
}

function add_status(status){
	var stat = {
	    name : status
	    	}
	statusdb.status.save(stat);
	//document.getElementById('serr').innerHTML = "Status added successfully!";
	location.reload();
}

function update_category(id){

	var c = document.getElementById('upd_categ_'+id).value;
	var l = document.getElementById('upd_leave_'+id).value;


	var query = {
	  _id : id
	};
	
	var ucat = {
	  name : c,
	  leave : l
	}; 

	if(c!='' && l!='' && isNumeric(l))
		categdb.category.update(query, ucat);
	location.reload();

}

function update_status(id){
	var s = document.getElementById('upd_status_'+id).value;
	var query = {
	  _id : id
	};

	var usat = {
		name : s
	};
	if(s!='')
		statusdb.status.update(query, usat);
	location.reload();
}

function delete_category(cid){
	if(confirm("Are you sure?")){
		categdb.category.remove({_id : cid});
		location.reload();
	}
}

function delete_status(sid){
	if(confirm("Are you sure?")){
		statusdb.status.remove({_id : sid});
		location.reload();
	}
}

function validate(f){
	if(f==1){
		var category = document.getElementById('new_categ').value.trim();
		var annual_leave = document.getElementById('annual_leave').value.trim();
		if(category=='')
			document.getElementById('cerr').innerHTML = "Enter a value for category!";	
		else if(annual_leave=='' || !isNumeric(annual_leave))
			document.getElementById('cerr').innerHTML = "Enter a valid value for annual leave!";	
		else
			add_category(category,annual_leave);
	}
	else if(f==2){
		var status = document.getElementById('new_status').value.trim();
		if(status=='')
			document.getElementById('serr').innerHTML = "Enter a value for status!";	
		else
			add_status(status);
	}
}

function categ_update_form(cid){
	var categ = document.getElementById('cat_val_'+cid).innerHTML;
	var leave = document.getElementById('cat_leave_'+cid).innerHTML;
	document.getElementById('cat_val_'+cid).innerHTML = '<input type="text" id="upd_categ_'+cid+'" value="'+categ+'">';
	document.getElementById('cat_leave_'+cid).innerHTML = '<input type="text" id="upd_leave_'+cid+'" value="'+leave+'">';
	document.getElementById('cat_edit_'+cid).innerHTML = '<input type="button" value="Update" onclick="return update_category('+"'"+cid+"'"+');"><input type="button" onclick="location.reload();" value="Cancel">';
}

function stat_update_form(sid){
	var stat = document.getElementById('sat_val_'+sid).innerHTML
	document.getElementById('sat_val_'+sid).innerHTML = '<input type="text" id="upd_status_'+sid+'" value="'+stat+'">';
	document.getElementById('sat_edit_'+sid).innerHTML = '<input type="button" value="Update" onclick="return update_status('+"'"+sid+"'"+');"><input type="button" onclick="location.reload();" value="Cancel">';
}

