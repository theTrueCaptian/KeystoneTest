
//Handler for buttons in collectionlist.ejs
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
 

//Convert the text into a JSON format given by Schema language
//Get the text from user and give it color
 /*
//Handler for text selection on div where id=pdfContainer (that's where the pdf is located)
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
$(document).ready(function (){
   $('#pdfContainer').mouseup(function (e){
       //alert(getSelectionText())
   })
});

var outputSchemaJSON = { 
	'Seq':{'color':'green', 																//Sequence of green
			'Struct':{																		//Struct containing orange and yellow
				'SampleID' : {'color':'orange', 'type': 'String'},							//Atomic field type orange in the Struct
				'Intensities' : {
								'Seq':{'color':'yellow',									//Sequence of yellows
									'Struct':{												//Struct containing magenta, voilet, and blue
										'Analyte' : {'color':'magenta', 'type': 'String'},	//Atomic field type magenta in the Struct
										'Mass' : {'color':'voilet', 'type': 'Int'},			//Atomic field type voilet in the Struct
										'CMean' : {'color':'blue', 'type': 'Float'}			//Atomic field type blue in the Struct
									}
								}
				}
			}
	}
};
console.log("outputSchemaJSON:"+JSON.stringify(outputSchemaJSON))

//Document object
function Document(FileContents){
	this.FileContents = FileContents;
}
Document.prototype = {
	constructor: Document,
	getFileContents(){
		return this.FileContents;
	}
}


//Algorithm 1
//
function Run(Q, M, D){
	var CR = {};
	
	//Traverse each field in M
	foreach field f in M do	
		//ListR is a list of f-regions 
		ListR = RunOnField(Q(f), D, CR)
		//Updates the document highlighting CR using the returned list of f-regions from ListR
		CR.add(f.color, R element of ListR)
	
	if CR isInConsistent() return theAncestor of every field
	else return Fill(M, D.Region)

}

function RunOnField(extraction program (f', P) of field f, D, CR){
	ListR' = {}
	//Find a the set of regions ListR' determined by the ancestor f'
	if(f' == theAncestor of every field)
		ListR' = D.Region
	else
		ListR' = CR[f'.color]	//CR[c] returns all regions whose color is c x
	
	//Execute P on R', R' is an element of ListR'
	f-regions = P(R')
	return f-regions;
}

//From Definition 3
//Given
function isInConsistent(){

}

//Algorithm 2
//ListR1', ListR2' are negative instances
function SynthesizeFieldExtractionProg(D, M, CR, f, ListR1', ListR2'){
	foreach ancestor field f' of f in M
		if f' isNotMaterialized() && f' != theAncestor of every field
			continue;
		

}
*/


