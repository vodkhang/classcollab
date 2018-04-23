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
	modal.open({
		title: t('Action Link'),
		text: `<iframe src="https://www.youtube.com/embed/xA8vlt_U5OA"></iframe>`,
		showCancelButton: false,
		confirmButtonColor: '#DD6B55',
		confirmButtonText: t('Cancel'),
		closeOnConfirm: true,
		html: true
	});
});
