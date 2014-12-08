/********************************************************************************
 PDF processor router and processing function
 ********************************************************************************/
var keystone  = require('keystone');
var Utils = require('../../Utils/Utils.js')
var Document = keystone.list('Document');
/**
 * Process the pdf
 */
var filename = "" ;	//filename
var pdfAndEntities;

//All information we want to collect from pdf	
var  pdfjson;
var totaltext = "";

//Event emitter to control the flow of pdf processing
		//First we configure it to do the PDF processing first, and then followed by the NER
var events = require('events');
var eventEmitter = new events.EventEmitter();

//Function that processes the PDF
//Inputs are from HTTP request and the response is a JSON with NER info and PDF data
exports.process = function(req, res) {
	var id = req.body.id
	filename = req.body.filename
	Utils.logMessage("A request has been sent to the server to process the following file:"+filename)
	
	//Retireve the document
	Document.model.findById(id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		Utils.logMessage("Processing the PDF!")

		//Create an event emitter listener
		eventEmitter.on('processPDF_done', sendDataToClient );
		eventEmitter.on('NER_done', putInDatabase )
		
		//Once parsePDF is done, an event is emitted to call the NER function
		//Once the NER fuunction is done, another event is emitted, but this time to the connection of the client
		eventEmitter.on('parsePDF_done', NER);

		//Calling the first function
		parsePDF();
	});
	
	
}


//Parses the PDF  and sends it to extractText() 
var parsePDF = function ( ){
	Utils.logMessage("Processing the PDF!")

	var nodeUtil = require("util"),
			fs = require('fs'),
			_ = require('underscore'),
			PDFParser = require("../../node_modules/pdf2json/pdfparser");

	//Using this library we convert PDF to JSON
	var pdfParser = new PDFParser();
	//Once the data is ready we want to get the pure text from the json and then NER on it
	pdfParser.on("pdfParser_dataReady", _.bind(extractText));

	
	pdfParser.loadPDF(filename);

};


//Given json data from parsePDF(), it will concatenate all the text and then send it to NER() 
var extractText = function(data){

	pdfjson = data.PDFJS;
	var pages = pdfjson.pages;

	//Concatenating all text from the json result		
	pages.forEach(function(page) {
		page["Texts"].forEach(function(textinfo) {
			textinfo["R"].forEach(function(text) {
				totaltext = totaltext+"%20"+text["T"];
			});
		});
	});

	totaltext = decodeURIComponent(totaltext);

	Utils.logMessage("Extracting the text done!");
	Utils.logMessage("Text:"+totaltext);

	eventEmitter.emit('parsePDF_done');

	return;
};

//NER() is invoked by an event emitter set by process() in order to process PDF asynch
var NER = function (){
	Utils.logMessage("Processing the pdf")
	/*var AlchemyAPI = require('alchemy-api');
	var alchemy = new AlchemyAPI(APIKey);
	alchemy.entities(totaltext, {}, function(err, response) {
		if (err){
			Utils.logMessage(err);
			return ;
		}else{

			// See http://www.alchemyapi.com/api/entity/htmlc.html for format of returned object
			var entities = response.entities;

			//Serialize pdfjson, or else circular json error, which in turn causes "maximum call stack exceeded" error will occur
			var serialized = CircularJSON.stringify(pdfjson);

			pdfAndEntities = {
				pdfjson:serialized,
				pdftext:totaltext,
				entities:entities
			};

			//Utils.logMessage(pdfAndEntities);
			Utils.logMessage(entities);

			//Signal the websocket to send the data over to 
			eventemittersocket.emit('processPDF_done', socket, handler, pdfAndEntities);
			//Signal to start storing NER into database
			eventemittersocket.emit('NER_done', entities);
			return;
		}
	});
	return;*/
};

//Sends the result of PDF processing to client
var sendDataToClient = function(jsonMessage){
	//Utils.logMessage(jsonMessage);
	//Respond with NER data, PDF data, etc
	res.apiResponse({

	});
	
	//Write the results to the file
	Utils.writeLogsToFile()
};

//Put the entities from NER into database
var putInDatabase = function(entities){
	
};
