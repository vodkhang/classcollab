RocketChat.actionLinks.register('call_third_party_action', function(message, params, instance) {
	// const tempDocument = cheerio.load(message);
	const actionParameters = message.actionParameters;

	const actionParamsKey = 'action_params';
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
	console.log('user info: ', Meteor.user());
	let response = {};
	if (method.toUpperCase() === 'POST') {
		response = HTTP.post(action, {
			params: options});
	} else if (method.toUpperCase() === 'GET') {
		response = HTTP.get(action, {
			params: options
		});
	}

	const deleteAfterSuccess = 'delete_after_success'
	const originalMessage = RocketChat.models.Messages.findOneById(message._id, {
		fields: {
			u: 1,
			rid: 1,
			file: 1,
			ts: 1
		}
	});
	if (response.statusCode === 200) {
		if (options[deleteAfterSuccess] === true) {
			//console.log('deleting');
			//console.log('message id: ', message._id);
			//console.log('message content ', message);
			//RocketChat.deleteMessage(originalMessage, Meteor.user());
			if (Meteor.user().roles.includes('admin'))
				Meteor.call('deleteMessage', { _id: message._id });
			else {
				//console.log('user is not an admin');
				message.actionLinks = null;
				RocketChat.models.Messages.update(message._id, {actionLinks: null});
				const m = RocketChat.models.Messages.findOneById(message._id, {fields : {actionLinks : 1}});
				//console.log('message after delete actionLinks: ', m);
				RocketChat.updateMessage(message, Meteor.user());
			}
		}
	}
});
