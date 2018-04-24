Package.describe({
	name: 'rocketchat-actionlink-integration',
	version: '0.0.1',
	// Brief, one-line summary of the package.
	// summary: '',
	// URL to the Git repository containing the source code for this package.
	// git: '',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md'
});

Package.onUse(function(api) {
	api.use([
		'mongo',
		'ecmascript',
		'templating',
		'rocketchat:lib'
	]);
	api.addFiles('client/register_iframe.js', 'client');

	api.addFiles('client/extractParamsFromQuery.js', 'client');
	api.addFiles('server/actionlink_register.js', 'server');

	api.addFiles('buildParamStr.js', ['server', 'client']);

	// api.addFiles('client/flexTabBar.html', 'client');
	// api.addFiles('client/tabs/membersList.html', 'client');
	// api.addFiles('client/tabs/messageSearch.html', 'client');
	// api.addFiles('client/tabs/uploadedFilesList.html', 'client');
	// api.addFiles('client/tabs/userEdit.html', 'client');
	// api.addFiles('client/tabs/userInfo.html', 'client');
    //
	// api.addFiles('client/flexTabBar.js', 'client');
	// api.addFiles('client/tabs/membersList.js', 'client');
	// api.addFiles('client/tabs/messageSearch.js', 'client');
	// api.addFiles('client/tabs/uploadedFilesList.js', 'client');
	// api.addFiles('client/tabs/userEdit.js', 'client');
	// api.addFiles('client/tabs/userInfo.js', 'client');
	// api.addFiles('client/tabs/keyboardShortcuts.html', 'client');
});
