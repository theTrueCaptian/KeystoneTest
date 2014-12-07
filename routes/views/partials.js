var keystone = require('keystone');

exports = module.exports = function(req, res) {
	console.log("EXPORTS!!!")
	var view = new keystone.View(req, res),
			locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';

	// Render the view
	//view.render('index');
	var name = req.params.name;
	view.render('/partials/' + name);
};
