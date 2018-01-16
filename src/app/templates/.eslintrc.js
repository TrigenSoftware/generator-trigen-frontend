module.exports = {
	'extends': <% if (projectType == 'reactjs') { %>'trigen'<% } else { %>'trigen/base'<% } %>,
	'env': {
		'browser': true
	}
};
