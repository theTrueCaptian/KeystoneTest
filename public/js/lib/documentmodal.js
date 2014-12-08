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
			})
		}
	);
});
	
