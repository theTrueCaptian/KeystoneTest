
//<!-- When a filename is clicked on, the client sends a request to load the pdf file into the canvas-->
$(function() {
 
	$(document).on('click', '.collectionlist_buttons button',function(e)
 	{
		e.preventDefault();
		var filename = this.id;
 		loadPdf("documents/"+filename);
 	}
	);
 });
 
