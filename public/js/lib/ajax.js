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
		console.log("List of Documents:")
		console.log(msg)
				
		var html = "<script src='/js/lib/displaydocument.js'></script>"
		msg.documents.forEach(function(item){
			 html = html //+	"each item in files.documents"
			 + " <div class='btn-group btn-group-xs'> "
			 + "<button id="+item._id+" name="+item.file.filename+" class='btn btn-default btn-xs' type='button'>"
			 + item.name+": "+item.file.filename
			 + "<button id='example' type='button' class='btn btn-default btn-xs' data-toggle='popover' data-content='Add to collection for analysis!'>"
			 + "<span class='glyphicon glyphicon-plus green'>"
			 + "<button type='button' class='btn btn-default btn-xs' data-toggle='popover' data-content='Remove the file'>"
			 + "<span class='glyphicon glyphicon-minus red'>"
			 + "</div><br><br>"
		 })
		 $('.documentlist_buttons').html(html);
				
		
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


/*
//<!-- When a filename is clicked on, the client sends a request to load the pdf file into the canvas-->
$(function() {

	$(document).on('click', '.collectionlist_buttons button',function(e)
			{
				e.preventDefault();
				var filename = this.id;
				loadPdf("documents/"+filename);
			}
	);
});*/
