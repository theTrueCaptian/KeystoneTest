//Minimal PDF rendering and text-selection example using pdf.js by Vivin Suresh Paliath (http://vivin.net)
//This fiddle uses a built version of pdf.js that contains all modules that it requires.
//
//For demonstration purposes, the PDF data is not going to be obtained from an outside source. I will be
//storing it in a variable. Mozilla's viewer does support PDF uploads but I haven't really gone through
//that code. There are other ways to upload PDF data. For instance, I have a Spring app that accepts a
//PDF for upload and then communicates the binary data back to the page as base64. I then convert this
//into a Uint8Array manually. I will be demonstrating the same technique here. What matters most here is
//how we render the PDF with text-selection enabled. The source of the PDF is not important; just assume
//that we have the data as base64.
//
//The problem with understanding text selection was that the text selection code has heavily intertwined
//with viewer.html and viewer.js. I have extracted the parts I need out of viewer.js into a separate file
//which contains the bare minimum required to implement text selection. The key component is TextLayerBuilder,
//which is the object that handles the creation of text-selection divs. I have added this code as an external
//resource.
//
//This demo uses a PDF that only has one page. You can render other pages if you wish, but the focus here is
//just to show you how you can render a PDF with text selection. Hence the code only loads up one page.
//
//The CSS used here is also very important since it sets up the CSS for the text layer divs overlays that
//you actually end up selecting.
//
//For reference, the actual PDF document that is rendered is available at:
//http://vivin.net/pub/pdfjs/TestDocument.pdf

var scale = 1.5; //Set this to whatever you want. This is basically the "zoom" factor for the PDF.
//Required to highlight entities on the PDF
$.getScript("/js/lib/pdf/hilitor.js" );
var myHilitor;  
var GLentities;
 
function loadPdf(pdfData, entities) {
	GLentities = entities;
	myHilitor = new Hilitor("pdfContainer");
	setHighlight();

	console.log("Loading pdf "+pdfData);
	
	PDFJS.disableWorker = true; //Not using web workers. Not disabling results in an error. This line is
	//missing in the example code for rendering a pdf.
	
	var $pdfContainer = jQuery("#pdfContainer");
	$pdfContainer.empty();
	
	var pdf = PDFJS.getDocument(pdfData);
	pdf.then(renderPdf);

}

var count = 0;
function setHighlight(){
	if(count<20) {
		//if($("#pdfContainer").is(':empty') ) {
 		setTimeout(setHighlight, 100);
		highlightEntities(GLentities);
 		count++;
	}
}

function renderPdf(pdf) {
	var total = pdf.numPages;
	for (i = 1; i <= total; i++){
		pdf.getPage(i).then(renderPage);
	}

	
	
}

function renderPage(page) {
	var $canvas = jQuery("<canvas></canvas>");
 
 	var canvas = $canvas.get(0);
	
	var viewport =  page.getViewport(scale); //page.getViewport(canvas.width / page.getViewport(1.0).width);//
	
	//Set the canvas height and width to the height and width of the viewport
	var context = canvas.getContext("2d");
	canvas.height = viewport.height;
	canvas.width = viewport.width;

	
	//Append the canvas to the pdf container div
	var $pdfContainer = jQuery("#pdfContainer");
	$pdfContainer.css("height", canvas.height + "px").css("width", canvas.width + "px");

	//Create a second page div and attach it pdf container to it
	var $pageContainer = jQuery("<div></div>");
	
	//Readjust the canvas so the borders show
	canvas.width = canvas.width - 3;
	canvas.height = canvas.height - 3;
	
	$pageContainer.append($canvas);

	//The following few lines of code set up scaling on the context if we are on a HiDPI display
	var outputScale = getOutputScale();
	if (outputScale.scaled) {
		var cssScale = 'scale(' + (1 / outputScale.sx) + ', ' +
			(1 / outputScale.sy) + ')';
		CustomStyle.setProp('transform', canvas, cssScale);
		CustomStyle.setProp('transformOrigin', canvas, '0% 0%');

		if ($textLayerDiv.get(0)) {
			CustomStyle.setProp('transform', $textLayerDiv.get(0), cssScale);
			CustomStyle.setProp('transformOrigin', $textLayerDiv.get(0), '0% 0%');
		}
	}

	context._scaleX = outputScale.sx;
	context._scaleY = outputScale.sy;
	if (outputScale.scaled) {
		context.scale(outputScale.sx, outputScale.sy);
	}

	var canvasOffset = $canvas.offset();
	console.log(canvas.height);
	var $textLayerDiv = jQuery("<div />")
		.addClass("textLayer")
		.css("height", viewport.height + "px")
		.css("width", viewport.width + "px")
		.offset({
			top: (canvas.height * (page.pageNumber-1)/*+5*/),
			left: canvasOffset.left
			//top:  $canvas.top,
			//left:  $canvas.left
		});

	$pageContainer.append( $textLayerDiv );
	
	$pageContainer.css( "overflow", "auto");
	
	//Append the page container div to the pdf container
	$pdfContainer.append( $pageContainer );
 	 
	page.getTextContent().then(function (textContent) {
		var textLayer = new TextLayerBuilder($textLayerDiv.get(0), 0); //The second zero is an index identifying
		//the page. It is set to page.number - 1.
		textLayer.setTextContent(textContent);

		var renderContext = {
			canvasContext: context,
			viewport: viewport,
			textLayer: textLayer
		};

		page.render(renderContext);
		
		var layers = {};        
		
		//we must concatenate the text, since it comes in the form of array
		if( null != textContent.bidiTexts ){
			var page_text = "";
			var last_block = null;
			for( var k = 0; k < textContent.bidiTexts.length; k++ ){
				var block = textContent.bidiTexts[k];
				if( last_block != null && last_block.str[last_block.str.length-1] != ' '){
					if( block.x < last_block.x )
						page_text += "\r\n"; 
					else if ( last_block.y != block.y && ( last_block.str.match(/^(\s?[a-zA-Z])$|^(.+\s[a-zA-Z])$/) == null ))
						page_text += ' ';
				}
				page_text += block.str;
				last_block = block;
			}

		 
		}

		
		
	});
	
}

function highlightEntities(entities){

	var concat = ""
	entities.forEach(function(entry){
		concat = concat +" "+ entry.text;
	})
	myHilitor.apply(concat);
 
}


