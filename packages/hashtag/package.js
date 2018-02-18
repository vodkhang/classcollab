Package.describe({
  name: 'hashtag',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6');
  api.use(['mongo',
	  		'ecmascript',
	  		'rocketchat:lib']);
  api.use('templating', 'client');
  api.addFiles(['hashtag.js'], 'server');
  api.addFiles(['tabBar.js', 'trendingHashtags.js', 'trendingHashtags.html'], 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('hashtag');
  api.mainModule('hashtag-tests.js');
});


