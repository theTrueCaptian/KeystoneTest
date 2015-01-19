/**
 * Javascript for the documentmodal.jade, which lists the documents that are not in the 
 * User's collection 
 */
//Disables and renable with the documentmodal buttons
$('#documentmodel').on('hidden', function () {
	//Disable buttons
	$("#documentmodel .panel-body").find(".button").button("disable");
	alert("disabling buttons");
})
$('#documentmodel').on('show', function () {
	//Renable buttons
	$("#documentmodel .panel-body").find(".button").button("enable");
	alert("renabling buttons");
})

//Respond to document button clicks
$(function() {
	$(".documentlist_buttons  button").click( function()
		{
			var id = this.id;
			var filename = this.name
			//alert("click!"+filename);
			$.ajax({
				type: "POST",
				url: "/pdf",
				data:{'id':id, 'filename':filename}
			}).done(function (msg) {
				console.log(msg)
				//Given to pdfCanvas.js, a path to the client's storage of the PDF
				loadPdf(msg.filename);

				//Display entities
				displayEntities(msg.data.entities)
			})

		}
	);
});


function displayEntities(entities){
	//For each entity in the array, add it to the list of values to display 

	$('#entities').empty();
	$('#entities').append("<div ><p>Entities<p><table class=\"table table-striped\" id=\"entityTable\" >"+"</table></div>");
	$('#entityTable').append("<tr><td >Entity</td><td >Types</td></tr>");
	entities.forEach(function(entry) {
		$('#entityTable').append("<tr><td>\""+entry.text+"\"</td><td>\""+entry.type+"\"</td></tr>");
	});
	$('#EntitiesAndLabels').collapse('show');

	/*$('#entities').append("<div ><p>Entities<p><select id=\"entityList\" multiple data-role=\"tagsinput\">"+"</select></div>");
	entities.forEach(function(entry) {
		//$('#entityList').append("<option value=\""+entry.text+"\">\""+entry.text+"\"</option>");
	});
	console.log(entities);

	//Referesh to make the tagsinput work
	//$('#entities').tagsinput('refresh');

	//Find the entities on the pdf and place popovers over them	 
	/*$(function() {

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
	});*/

}
	
