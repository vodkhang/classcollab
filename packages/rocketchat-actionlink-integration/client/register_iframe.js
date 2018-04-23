RocketChat.actionLinks.register('call_third_party_action', function (message, params, instance) {
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
});
