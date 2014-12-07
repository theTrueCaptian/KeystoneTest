var DEST = 'C:/KeystoneTest/public/uploads'

var keystone = require('keystone'),
	Types = keystone.Field.Types;
	
var Document = new keystone.List('Document')

Document.add({
		file: {type:Types.LocalFile, 
				initial:false, 
				required:true, 
				dest: DEST,
				format: function(item, file){
					return '<img src="/public/'+file.filename+'" style="max-width: 300px">'
				}},
		name: {type:Types.Text}
		
})	

Document.register()