RocketChat.actionLinks.register('call_third_party_action', function(message, params, instance) {
	const actionParameters = message.actionParameters;
	const isClientServer = RocketChat.isClientServer(actionParameters);
	const isServer = isClientServer[0];
	if (!isServer) {
		return;
	}

	const actionParamsKey = 'action_params';
	const messageIDKey = 'message_id';
	const channelKey = 'channel';
	const usernameKey = 'username';
	const emailKey = 'email';
	const nameKey = 'name';

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

	options[channelKey] = message.rid;
	options[usernameKey] = Meteor.user().username;
	options[emailKey] = Meteor.user().emails[0]['address'];
	options[nameKey] = Meteor.user().name;

	let response = {};
	if (method.toUpperCase() === 'POST') {
		response = HTTP.post(action, {
			params: options});
	} else if (method.toUpperCase() === 'GET') {
		response = HTTP.get(action, {
			params: options
		});
	}

	if (response.statusCode !== 200) {
		console.log('response: ', response);
	}
});
