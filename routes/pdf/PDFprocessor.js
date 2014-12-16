/********************************************************************************
 PDF processor router and processing function
 ********************************************************************************/
var keystone  = require('keystone');
var Utils = require('../../Utils/Utils.js')
var Document = keystone.list('Document');
//This module is used to solve the serialization of circular jsons
var CircularJSON = require('circular-json');
//AlchemyAPI API key
var APIKey = "37abd9121c9dc242fdd73073c0f68b935e6631a3";
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI(APIKey);

var path = __dirname+"/../../public/uploads/";
var clientPath = "/..//uploads/"
var filename = "" ;	//filename
var pdfAndEntities;

//All information we want to collect from pdf	
var pdfjson;

//Function that processes the PDF
//Inputs are from HTTP request and the response is a JSON with NER info and PDF data
exports.process = function(req, res) {
	var id = req.body.id
	filename = req.body.filename
	Utils.logMessage("A request has been sent to the server to process the following file:"+path+filename)
	
	//Retireve the document
	Document.model.findById(id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		Utils.logMessage("Processing the PDF! ")
		
		//Calling the first function
		parsePDF(res);
	});
	
	
}


//Parses the PDF  and sends it to extractText() 
var parsePDF = function (res ){
	Utils.logMessage("Processing the PDF!")

	var nodeUtil = require("util"),
			fs = require('fs'),
			_ = require('underscore'),
			PDFParser = require("../../node_modules/pdf2json/pdfparser");

	//Using this library we convert PDF to JSON
	var pdfParser = new PDFParser();
	//Once the data is ready we want to get the pure text from the json and then NER on it
	pdfParser.on("pdfParser_dataReady", _.bind(function(data){
		Utils.logMessage("Data is ready!")
		extractText(data, res)
	}));
	pdfParser.on("pdfParser_dataError", _.bind(function(err){
		Utils.logMessage("Error!")
		Utils.logMessage(err)
	}));
	
	pdfParser.loadPDF(path+filename);

};


//Given json data from parsePDF(), it will concatenate all the text and then send it to NER() 
var extractText = function(data, res){
	var totaltext = "";

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
	//Utils.logMessage("Text:"+totaltext);

	NER(totaltext, res)

};

//NER() is invoked by an event emitter set by process() in order to process PDF asynch
var NER = function (totaltext, res){
	
	alchemy.entities(totaltext, {}, function(err, response) {
		if (err){
			Utils.logMessage(err);
			res.send({'data':err})
		}else{
			Utils.logMessage("Processing the NER")

			// See http://www.alchemyapi.com/api/entity/htmlc.html for format of returned object
			var entities = response.entities;

			//Serialize pdfjson, or else circular json error, which in turn causes "maximum call stack exceeded" error will occur
			var serialized = CircularJSON.stringify(pdfjson);

			pdfAndEntities = {
				pdfjson:serialized,
				pdftext:totaltext,
				entities:entities
			};

			Utils.logMessage(entities);
		
			res.send({'data':pdfAndEntities, 'filename':clientPath+filename})
			//res.sendfile( filename );
		}
	});
};
