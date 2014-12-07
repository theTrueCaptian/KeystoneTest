var async = require('async'),
		keystone = require('keystone');

var Document = keystone.list('Document');

/**
 * List Documents
 */
exports.list = function(req, res) {
	Document.model.find(function(err, items) {

		if (err) return res.apiError('database error', err);

		res.apiResponse({
			documents: items
		});

	});
}

/**
 * Get Document by ID
 */
exports.get = function(req, res) {
	Document.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		res.apiResponse({
			documents: item
		});

	});
}


/**
 * Create a Document
 */
exports.create = function(req, res) {

	var item = new Document.model(),
			data = (req.method == 'Document') ? req.body : req.query;

	item.getUpdateHandler(req).process(data, function(err) {

		if (err) return res.apiError('error', err);

		res.apiResponse({
			documents: item
		});

	});
}

/**
 * Get Document by ID
 */
exports.update = function(req, res) {
	Document.model.findById(req.params.id).exec(function(err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		var data = (req.method == 'Document') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function(err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				documents: item
			});

		});

	});
}

/**
 * Delete Document by ID
 */
exports.remove = function(req, res) {
	Document.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		item.remove(function (err) {
			if (err) return res.apiError('database error', err);

			return res.apiResponse({
				success: true
			});
		});

	});
}
