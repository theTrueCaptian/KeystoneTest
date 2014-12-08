//Maeda Hanafi
//Client side ajax requests

//Require the pdf rendering js files
$.getScript("/js/lib/pdf/pdf.js" );
$.getScript("/js/lib/pdf/tooltip.js" );
$.getScript("/js/lib/pdf/textlayerbuilder.js" );
$.getScript("/js/lib/pdf/pdfcanvas.js" );

//Requesting data from server once things are loaded such as files
$(document).ready(function () {
	
	//An Ajax request to get a list of documents 
	$.ajax({
		type: "GET",
		url: "/api/document/list"
	})
	.done(function (msg) {
		//List the files under Documents
		//msg is used to populate documentlist.jade, which displays the files based on this list. 
		
		var html = ''
		 msg.documents.forEach(function(item){
		 html = html //+	"each item in files.documents"
		 + "<script src='/js/lib/documentmodal.js'></script>"		 
		 + " <div class='btn-group btn-group-xs'> "
		 + "<button id="+item.id+" name="+item.file.filename+" class='btn btn-default btn-xs' type='button'>"
		 + item.name+": "+item.file.filename
		 + "<button id='example' type='button' class='btn btn-default btn-xs' data-toggle='popover' data-content='Add to collection for analysis!'>"
		 + "<span class='glyphicon glyphicon-plus green'>"
		 + "<button type='button' class='btn btn-default btn-xs' data-toggle='popover' data-content='Remove the file'>"
		 + "<span class='glyphicon glyphicon-minus red'>"
		 + "</div><br><br>"
		 })
		 $('.documentlist_buttons').html(html)
	});

	//An Ajax request to get a list of Documents in the User's Collection
	//First check if user is logged in
	/*$.ajax({
		type: "GET",
		url: "/api/collection/list"
	})
	.done(function (msg) {
		//List the files under Collection
		console.log(msg)
		//msg is used to populate collectionlist.jade, which displays the files based on this list. 

		var html = ''
		msg.documents.forEach(function(item){
			html = html //+	"each item in files.documents" 
			+ " <div class='btn-group btn-group-xs'> "
			+ " <button id="+item.name+" class='btn btn-default btn-xs' type='button'>"
			+ item.name
			+ "<button id='example' type='button' class='btn btn-default btn-xs' data-toggle='popover' data-content='Add to collection for analysis!'>"
			+ "<span class='glyphicon glyphicon-plus green'>"
			+ "<button type='button' class='btn btn-default btn-xs' data-toggle='popover' data-content='Remove the file'>"
			+ "<span class='glyphicon glyphicon-minus red'>"
			+ "<br><br>"
		})
		$('.collectionlist_buttons').html(html)
	});*/
});


function displayEntities(entities){
	//For each entity in the array, add it to the list of values to display 
	
 	$('#entities').empty(); 	
	$('#entities').append("<div ><p>Entities<p><select id=\"entityList\" multiple data-role=\"tagsinput\">"+"</select></div>"); 
 	entities.forEach(function(entry) {		
 		$('#entityList').append("<option value=\""+entry.text+"\">\""+entry.text+"\"</option>");
	});
	console.log(entities); 
	 
	//Referesh to make the tagsinput work
	$('#entities').tagsinput('refresh');
	
	//Find the entities on the pdf and place popovers over them	 
	$(function() {
 		
		entities.forEach(function(entry) {	
			//First wrap the text in an element like so.
			$('*:contains('+entry.text+')').each(function(){
			if($(this).children().length < 1) 
				$(this).html( 
				   $(this).text().replace(
						entry.text
						,'<span containsStringImLookingFor=/"true/"><a href=/"#/" data-toggle=/"popover/" title=/"Example popover/"> '+entry.text+'</a></span>' //'<span containsStringImLookingFor=/"true/"> '+entry.text+' </span>' //
				   )  
				) 
			});
			
			//thenAdd the css
			$('*[containsStringImLookingFor]').css("border","solid 2px blue");
		});
	});
	
}
