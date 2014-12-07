var keystone = require('keystone');

exports = module.exports = function(req, res) {
	
	var view = new keystone.View(req, res),
		locals = res.locals;
	
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	
	// Render the view
	view.render('index');
	
};



/*
 * GET home page.
 */
/*
exports.index = function(req, res){
	var view = new keystone.View(req, res),
			locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// Render the view
	view.render('index');
	//res.render('index');
};

exports.partials = function (req, res) {
	var name = req.params.name;
	res.render('/partials/' + name);
};
*/
