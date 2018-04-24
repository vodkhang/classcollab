RocketChat.actionLinks.register('call_third_party_action', function (message, params, instance) {
	const actionParameters = message.actionParameters;
	const isClientServer = isClientServer(actionParameters);
	const isClient = isClientServer[1];
	if (!isClient) {
		return;
	}

	const actionParamsKey = 'action_params';
	const messageIDKey = 'message_id';
	const channelKey = 'channel';
	const usernameKey = 'username';
	const emailKey = 'email';
	const nameKey = 'name';

	console.log('action parameters to process: ', actionParameters);

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
	options[messageIDKey] = message._id;

	options[channelKey] = Meteor.user()._id;
	options[usernameKey] = Meteor.user().username;
	options[emailKey] = Meteor.user().emails[0]['address'];
	options[nameKey] = Meteor.user().name;

	const paramsString = buildParamString(options);

	console.log('options: ', options);
	console.log('params for further comment: ', paramsString);
	const url = `${ actionParameters.action }?${ paramsString }`;
	modal.open({
		title: t('Action Link'),
		text: `<iframe src="${ url }"></iframe>`,
		//text: '<iframe src="https://www.youtube.com/embed/xA8vlt_U5OA"></iframe>',
		showCancelButton: false,
		//confirmButtonColor: '#DD6B55',
		confirmButtonText: t('Cancel'),
		closeOnConfirm: true,
		html: true
	});
});
