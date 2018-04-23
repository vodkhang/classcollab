RocketChat.actionLinks.register('call_third_party_action', function (message, params, instance) {
	console.log('call this function.');
	const actionParameters = message.actionParameters;

	const actionParamsKey = 'action_params';
	console.log('action parameters to process: ', actionParameters);
	const messageIDKey = 'message_id';

	let action = '';
	let method = '';

	let param = '';
	const options = {};
	for (param in actionParameters) {
		if (param === 'action') {
			action = actionParameters['action'];
		} else if (param === 'method') {
			method = actionParameters['method'];
		} else {
			options[param] = actionParameters[param];
		}
	}
	options[actionParamsKey] = params;
	options[messageIDKey] = message.id;
	options['action_params'] = params;
	options['message_id'] = message._id;
	options['channel'] = Meteor.user()._id;
	options['username'] = Meteor.user().username;	//console.log('action', action);
	options['email'] = Meteor.user().emails[0]['address'];
	options['name'] = Meteor.user().name;
	var paramsString = '';
	//var actParam = 	extractParamsFromQuery(options.action_params);
	paramsString = buildParamStr('username', options['username'], paramsString);
	paramsString = buildParamStr('feedback_id', options['feedback_id'], paramsString);
	paramsString = buildParamStr('name', options['name']);
	paramsString = buildParamStr('email', options['email']);
	paramsString = buildParamStr('action_params', options.action_params, paramsString);

	console.log('options: ', options);
	console.log('params for further comment: ', paramsString);
	var url = `${actionParameters.action}?${paramsString}`;
	modal.open({
		title: t('Action Link'),
		text: `<iframe src="${url}"></iframe>`,
		//text: '<iframe src="https://www.youtube.com/embed/xA8vlt_U5OA"></iframe>',
		showCancelButton: false,
		//confirmButtonColor: '#DD6B55',
		confirmButtonText: t('Cancel'),
		closeOnConfirm: true,
		html: true
	});
});
