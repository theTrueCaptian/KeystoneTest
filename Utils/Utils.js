/********************************************************************************
 Misc Functions
 ********************************************************************************/
var jsStringEscape = require('js-string-escape')
var _ = require('lodash');

var isConsoleLog = true

/********************************************************************************
 Functions for logging run time
 ********************************************************************************/
var isLog = true;
var loggedMessages = []
function logMessage(message){

	if(isLog) {
		if(isConsoleLog) {
			console.log(jsStringEscape(message))
		}
		loggedMessages.push(jsStringEscape(message))

	}
}
exports.logMessage = logMessage;

//This function writes the loggedMessages[] into a file and then clears its contents
//It is important to call this function before the program stops running
function writeLogsToFile(){
	writeToFile("loggedmessages.txt", toString(loggedMessages ))
	loggedMessages = []
}
exports.writeLogsToFile = writeLogsToFile

/********************************************************************************
 FileIO for debugging purposes
 ********************************************************************************/


//Make a array of arrays readable in text file
function toString(arrayofarray){
	var str="";
	arrayofarray.forEach(function(array) {
		str = str + JSON.stringify(array) + "\n";
	});
	return str;
}

//For analysing long results, write results to a file
function writeToFile(filename,contents ){
	var fs = require('fs');
	fs.writeFile(__dirname+"/../debug/"+filename, contents, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("The file was saved:"+filename);
		}
	});
}

//Given an array of objects, JSONify them and put newline in between all the keys
function newlineJSON(array){
	var str="";
	array.forEach(function(elem) {
		str=str+'{'
		_.forIn(elem, function(value, key){str=str+" \'"+ key+"\':"+JSON.stringify(value)+"\n"})
		str = str + '}\n'
	});
	return str;
}
