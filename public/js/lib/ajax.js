//Maeda Hanafi
//Client side websocket

//Require the pdf rendering js files
$.getScript("/js/lib/pdf/pdf.js" );
$.getScript("/js/lib/pdf/tooltip.js" );
$.getScript("/js/lib/pdf/textlayerbuilder.js" );
$.getScript("/js/lib/pdf/pdfcanvas.js" );
/*
//Initializing the connection with the server via websockets 
socket.on("message",function(message){   
	
	console.log("Message from the server arrived on message")
 	console.log(message); //converting the data into JS object 
	
	//Request for data on pdf (entities and text)
	//socket.emit("pdfinfo", {});
	
	//Grab the pdf file and parse it
	//var pdfFilePath = message.filename;//"../google-proposal-Azza.pdf";//"../MaedaHanafiResume2014.pdf";
    //loadPdf(pdfFilePath);
 });
 
//Keep the connection by ping pong the server multiple times 
socket.on('ping', function(data){
	socket.emit('pong', {beat: 1});
});

socket.on("pdfinfo",function(data){   	
	console.log("Message from the server arrived on pdfinfo")
 	//console.log(data); 
	console.log("File we are processing: "+data.file);
	//displayEntities(data.entities); 
	
	//Display the PDF on canvas, direct to a function in pdfcanvas.js
	loadPdf(data.file);
});
 */
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
			//$('*[containsStringImLookingFor]').tagsinput('refresh');
		});
	});
	
}
