$(document ).ready(function() {
	var elist = empdb.employee.find();
	var row_list = "";

	if(elist.length>0){
		for (var i = 0; i < elist.length; i++) {
			category = get_category(elist[i].category).name;
			general = +get_category(elist[i].category).leave;
			coff = +elist[i].coff;
			carry = +elist[i].carry;
			total = general + coff + carry;
			taken = +elist[i].taken;
			balance = total - taken;

			row_list += "<tr id='e_"+elist[i]._id+"'>";
			row_list += "<td id='eid_"+elist[i]._id+"'>"+elist[i].sn+"</td>";
			row_list += "<td id='ename_"+elist[i]._id+"'>"+elist[i].ename+"</td>";
			row_list += "<td id='cat_"+elist[i]._id+"'>"+category+"</td>";
			row_list += "<td id='leave_"+elist[i]._id+"'>"+general+"</td>";
			row_list += "<td id='coff_"+elist[i]._id+"'>"+coff+"</td>";
			row_list += "<td id='carry_"+elist[i]._id+"'>"+carry+"</td>";
			row_list += "<td id='total_"+elist[i]._id+"'>"+total+"</td>";
			row_list += "<td id='taken_"+elist[i]._id+"'>"+taken+"</td>";
			row_list += "<td id='balance_"+elist[i]._id+"'>"+balance+"</td>";
			row_list += '<td id="edit_'+elist[i]._id+'"><a href="javascript:void(0);" onclick="return update('+"'"+elist[i]._id+"'"+');">Edit</a></td>';
			row_list += '<td><a href="javascript:void(0);" onclick="return edelete('+"'"+elist[i]._id+"'"+');">Delete</a></td>';
			row_list += "</tr>";
		};
	}
	else{
		row_list = '<tr><td colspan=11 id="emp404">No Employee Data Found!</td></tr>';
	}

	row_list += '<tr id="add_more"><td colspan=11><input type="button" value="Add" id="add_new" onclick="return add_form();"></td></tr>';
	$('#emp-view').append(row_list);	
});

function select_category(select){
	var clist = categdb.category.find();
	var cat = '<select name="category" id="select_category">';
	for(var i=0; i<clist.length; i++)
	{
		if(clist[i].name==select)
			cat += '<option value="'+clist[i]._id+'" selected>'+clist[i].name+'</option>';
		else
			cat += '<option value="'+clist[i]._id+'">'+clist[i].name+'</option>';      
	}
	cat += '</td>';

	return cat;
}

function add_form(){

	var emp_form = '<td id="err">&nbsp;</td>';
	emp_form += '<td><input type="text" maxlength=5 id="emp_id" placeholder="Staff No."></td>';
	emp_form += '<td><input type="text" id="emp_name" placeholder="Name"></td>';
	emp_form += '<td>Category '+select_category('')+'</td>';
	emp_form += '<td><input type="text" id="emp_carry" placeholder="Carry"></td>';
	emp_form += '<td><input type="button" value="Add New Employee" id="add_emp" onclick="return validate();"></td>';
    emp_form += '<td><input type="button" onclick="location.reload();" value="Cancel"></td>';
	document.getElementById("add_more").innerHTML = emp_form;	         	
}

function add_emp(emp_id, emp_name, category, carry){

	var emp = {
		sn : emp_id,
	    ename : emp_name,
	    category : category,
	    coff : 0,
	    carry : carry,
	    taken : 0
	    
	}
	empdb.employee.save(emp);
	//document.getElementById('cerr').innerHTML = "Category added successfully!";
	location.reload();
}

function update_emp(id){

	var uemp_id = document.getElementById('upd_eid_'+id).value;
	var uemp_name = document.getElementById('upd_ename_'+id).value;
	var ucategory = document.getElementById('select_category').value;
	var ucoff = document.getElementById('upd_coff_'+id).value;
	
	var query = {
	  _id : id
	};
	
	var uemp = {
		sn : uemp_id,
	    ename : uemp_name,
	    category : ucategory,
	    coff : ucoff	    
	} 

	if(uemp_name!='' && uemp_id!='' && isNumeric(uemp_id) && uemp_id.length==5 && ucoff!='' && isNumeric(ucoff))
		empdb.employee.update(query, uemp);
	location.reload();

}

function edelete(eid){
	if(confirm("Are you sure?")){
		empdb.employee.remove({_id : eid});
		location.reload();
	}
}

function validate(){

	var emp_id = document.getElementById('emp_id').value.trim();
	var emp_name = document.getElementById('emp_name').value.trim();
	var category = document.getElementById('select_category').value;
	var carry = document.getElementById('emp_carry').value.trim();
	
	 if(carry=='' || !isNumeric(carry))
		carry = 0;

	if(emp_name=='')
		document.getElementById('err').innerHTML = "Enter employee name!";	
	else if(emp_id=='' || !isNumeric(emp_id) || emp_id.length<5)
		document.getElementById('err').innerHTML = "Enter a valid value for staff number!";	
	else
		add_emp(emp_id, emp_name, category, carry);
}

function update(eid){
	var emp_id = document.getElementById('eid_'+eid).innerHTML;
	var emp_name = document.getElementById('ename_'+eid).innerHTML;
	var category = document.getElementById('cat_'+eid).innerHTML;
	var coff = document.getElementById('coff_'+eid).innerHTML;
	
	document.getElementById('eid_'+eid).innerHTML = '<input type="text" id="upd_eid_'+eid+'" value="'+emp_id+'" maxlength=5>';
	document.getElementById('ename_'+eid).innerHTML = '<input type="text" id="upd_ename_'+eid+'" value="'+emp_name+'">';
	document.getElementById('cat_'+eid).innerHTML = select_category(category);
	document.getElementById('coff_'+eid).innerHTML = '<input type="text" id="upd_coff_'+eid+'" value="'+coff+'">';
	document.getElementById('edit_'+eid).innerHTML = '<input type="button" value="Update" onclick="return update_emp('+"'"+eid+"'"+');"><input type="button" onclick="location.reload();" value="Cancel">';
	f = 'change_leave(this.value,"'+eid+'")';
	document.getElementById('select_category').setAttribute('onchange', f);	
}

function change_leave(cat,id){
	c = get_category(cat);
	document.getElementById('leave_'+id).innerHTML = c.leave;
}