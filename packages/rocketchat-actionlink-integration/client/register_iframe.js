RocketChat.actionLinks.register('call_third_party_action', function (message, params, instance) {
	const actionParameters = message.actionParameters;
	const isClientServer = RocketChat.isClientServer(actionParameters);
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

	let action = '';

	let param = '';
	const options = {};
	for (param in actionParameters) {
		if (param === 'action') {
			action = actionParameters['action'];
		} else if (param !== 'method') {
			options[param] = actionParameters[param];
		}
	}
	options[actionParamsKey] = params;
	options[messageIDKey] = message._id;

	options[channelKey] = message.rid;
	options[usernameKey] = Meteor.user().username;
	options[emailKey] = Meteor.user().emails[0]['address'];
	options[nameKey] = Meteor.user().name;

	const paramsString = RocketChat.buildParamString(options);

	console.log('options: ', options);
	console.log('params for further comment: ', paramsString);
	const url = `${ action }?${ paramsString }`;
	modal.open({
		title: t('Action Link'),
		text: `<iframe src="${ url }" width="100%" height="100%"></iframe>`,
		//text: '<iframe src="https://www.youtube.com/embed/xA8vlt_U5OA"></iframe>',
		showCancelButton: false,
		//confirmButtonColor: '#DD6B55',
		confirmButtonText: t('Done'),
		closeOnConfirm: true,
		html: true
	});
});
