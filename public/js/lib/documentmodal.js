/**
 * Created by Maeda on 12/8/2014.
 */
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
