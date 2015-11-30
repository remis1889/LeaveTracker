// Load Header File
$(function(){
    $("#header").load("header.html"); 
});

//Validate Numeric Values
function isNumeric(value) 
{
    return /^\d+$/.test(value);
}

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
	cat += '</select>';

	return cat;
}

/***

Returns a values with _id = id based on 'type'
type : 1  =>  category
type : 2  =>  status

***/
function get_categ_stat(id,type)
{
	var sc;

	if(type==1)
		sc = categdb.category.find({_id : id});
	else if(type==2)
		sc = statusdb.status.find({_id : id}); 
	
	return sc[0];
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



