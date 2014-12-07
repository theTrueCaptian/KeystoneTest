var mousePos;
$(document).mousemove(function (e) {
	mousePos = {left: e.pageX + 20, top: e.pageY + 20};
});

var selectedText = '';
function getSelectedText(){ 
	if(window.getSelection){ 
		return window.getSelection().toString(); 
	} 
	else if(document.getSelection){ 
		return document.getSelection(); 
	} 
	else if(document.selection){ 
		return document.selection.createRange().text; 
	} 
} 

function checkSelectionChanged() {
	var current = getSelectedText();
	//console.log("Slected:"+current);
	if(current != selectedText) {
		selectedText = current;
		if(selectedText != '') {
			$('#tooltip #text').text(selectedText);
			$('#tooltip').offset(mousePos);
			$('#tooltip').show();
		} else {
			$('#tooltip').hide();
		}
	}
}

//Make sure the tooltip is only shown on selection
$('#tooltip').hide();

setInterval(checkSelectionChanged, 1000);

