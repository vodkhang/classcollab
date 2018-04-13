/* global processWebhookMessage */
import toastr from "toastr";
// var cheerio =  require('cheerio');
import _ from 'underscore';
RocketChat.API.v1.addRoute('chat.delete', { authRequired: true }, {
	post() {
		check(this.bodyParams, Match.ObjectIncluding({
			msgId: String,
			roomId: String,
			asUser: Match.Maybe(Boolean)
		}));

		const msg = RocketChat.models.Messages.findOneById(this.bodyParams.msgId, { fields: { u: 1, rid: 1 }});

		if (!msg) {
			return RocketChat.API.v1.failure(`No message found with the id of "${ this.bodyParams.msgId }".`);
		}

		if (this.bodyParams.roomId !== msg.rid) {
			return RocketChat.API.v1.failure('The room id provided does not match where the message is from.');
		}

		if (this.bodyParams.asUser && msg.u._id !== this.userId && !RocketChat.authz.hasPermission(Meteor.userId(), 'force-delete-message', msg.rid)) {
			return RocketChat.API.v1.failure('Unauthorized. You must have the permission "force-delete-message" to delete other\'s message as them.');
		}

		Meteor.runAsUser(this.bodyParams.asUser ? msg.u._id : this.userId, () => {
			Meteor.call('deleteMessage', { _id: msg._id });
		});

		return RocketChat.API.v1.success({
			_id: msg._id,
			ts: Date.now(),
			message: msg
		});
	}
});

RocketChat.API.v1.addRoute('chat.syncMessages', { authRequired: true }, {
	get() {
		const { roomId, lastUpdate } = this.queryParams;

		if (!roomId) {
			throw new Meteor.Error('error-roomId-param-not-provided', 'The required "roomId" query param is missing.');
		}

		if (!lastUpdate) {
			throw new Meteor.Error('error-lastUpdate-param-not-provided', 'The required "lastUpdate" query param is missing.');
		} else if (isNaN(Date.parse(lastUpdate))) {
			throw new Meteor.Error('error-roomId-param-invalid', 'The "lastUpdate" query parameter must be a valid date.');
		}

		let result;
		Meteor.runAsUser(this.userId, () => {
			result = Meteor.call('messages/get', roomId, { lastUpdate: new Date(lastUpdate) });
		});

		if (!result) {
			return RocketChat.API.v1.failure();
		}

		return RocketChat.API.v1.success({
			result
		});
	}
});

RocketChat.API.v1.addRoute('chat.getMessage', { authRequired: true }, {
	get() {
		if (!this.queryParams.msgId) {
			return RocketChat.API.v1.failure('The "msgId" query parameter must be provided.');
		}

		let msg;
		Meteor.runAsUser(this.userId, () => {
			msg = Meteor.call('getSingleMessage', this.queryParams.msgId);
		});

		if (!msg) {
			return RocketChat.API.v1.failure();
		}

		return RocketChat.API.v1.success({
			message: msg
		});
	}
});

RocketChat.API.v1.addRoute('chat.pinMessage', { authRequired: true }, {
	post() {
		if (!this.bodyParams.messageId || !this.bodyParams.messageId.trim()) {
			throw new Meteor.Error('error-messageid-param-not-provided', 'The required "messageId" param is missing.');
		}

		const msg = RocketChat.models.Messages.findOneById(this.bodyParams.messageId);

		if (!msg) {
			throw new Meteor.Error('error-message-not-found', 'The provided "messageId" does not match any existing message.');
		}

		let pinnedMessage;
		Meteor.runAsUser(this.userId, () => pinnedMessage = Meteor.call('pinMessage', msg));

		return RocketChat.API.v1.success({
			message: pinnedMessage
		});
	}
});

RocketChat.API.v1.addRoute('chat.postMessage', { authRequired: true }, {
	post() {
		console.log(this.bodyParams.channel);
		const messageReturns = processWebhookMessage(this.bodyParams, this.user, undefined, true);

		if (!messageReturns) {
			return RocketChat.API.v1.failure('unknown-error');
		}

		const returnredChannels = _.map(messageReturns, (mess) => { return mess.channel; });
		const returnredMessages = _.map(messageReturns, (mess) => { return mess.message; });

		return RocketChat.API.v1.success({
			ts: Date.now(),
			channel: returnredChannels,
			message: returnredMessages
		});
	}
});

RocketChat.API.v1.addRoute('chat.search', { authRequired: true }, {
	get() {
		const { roomId, searchText, limit } = this.queryParams;

		if (!roomId) {
			throw new Meteor.Error('error-roomId-param-not-provided', 'The required "roomId" query param is missing.');
		}

		if (!searchText) {
			throw new Meteor.Error('error-searchText-param-not-provided', 'The required "searchText" query param is missing.');
		}

		if (limit && (typeof limit !== 'number' || isNaN(limit) || limit <= 0)) {
			throw new Meteor.Error('error-limit-param-invalid', 'The "limit" query parameter must be a valid number and be greater than 0.');
		}

		let result;
		Meteor.runAsUser(this.userId, () => result = Meteor.call('messageSearch', searchText, roomId, limit));

		return RocketChat.API.v1.success({
			messages: result.messages
		});
	}
});

// The difference between `chat.postMessage` and `chat.sendMessage` is that `chat.sendMessage` allows
// for passing a value for `_id` and the other one doesn't. Also, `chat.sendMessage` only sends it to
// one channel whereas the other one allows for sending to more than one channel at a time.
RocketChat.API.v1.addRoute('chat.sendMessage', { authRequired: true }, {
	post() {
		if (!this.bodyParams.message) {
			throw new Meteor.Error('error-invalid-params', 'The "message" parameter must be provided.');
		}

		let message;
		Meteor.runAsUser(this.userId, () => message = Meteor.call('sendMessage', this.bodyParams.message));

		return RocketChat.API.v1.success({
			message
		});
	}
});

RocketChat.API.v1.addRoute('chat.starMessage', { authRequired: true }, {
	post() {
		if (!this.bodyParams.messageId || !this.bodyParams.messageId.trim()) {
			throw new Meteor.Error('error-messageid-param-not-provided', 'The required "messageId" param is required.');
		}

		const msg = RocketChat.models.Messages.findOneById(this.bodyParams.messageId);

		if (!msg) {
			throw new Meteor.Error('error-message-not-found', 'The provided "messageId" does not match any existing message.');
		}

		Meteor.runAsUser(this.userId, () => Meteor.call('starMessage', {
			_id: msg._id,
			rid: msg.rid,
			starred: true
		}));

		return RocketChat.API.v1.success();
	}
});

RocketChat.API.v1.addRoute('chat.unPinMessage', { authRequired: true }, {
	post() {
		if (!this.bodyParams.messageId || !this.bodyParams.messageId.trim()) {
			throw new Meteor.Error('error-messageid-param-not-provided', 'The required "messageId" param is required.');
		}

		const msg = RocketChat.models.Messages.findOneById(this.bodyParams.messageId);

		if (!msg) {
			throw new Meteor.Error('error-message-not-found', 'The provided "messageId" does not match any existing message.');
		}

		Meteor.runAsUser(this.userId, () => Meteor.call('unpinMessage', msg));

		return RocketChat.API.v1.success();
	}
});

RocketChat.API.v1.addRoute('chat.unStarMessage', { authRequired: true }, {
	post() {
		if (!this.bodyParams.messageId || !this.bodyParams.messageId.trim()) {
			throw new Meteor.Error('error-messageid-param-not-provided', 'The required "messageId" param is required.');
		}

		const msg = RocketChat.models.Messages.findOneById(this.bodyParams.messageId);

		if (!msg) {
			throw new Meteor.Error('error-message-not-found', 'The provided "messageId" does not match any existing message.');
		}

		Meteor.runAsUser(this.userId, () => Meteor.call('starMessage', {
			_id: msg._id,
			rid: msg.rid,
			starred: false
		}));

		return RocketChat.API.v1.success();
	}
});

RocketChat.API.v1.addRoute('chat.update', { authRequired: true }, {
	post() {
		check(this.bodyParams, Match.ObjectIncluding({
			roomId: String,
			msgId: String,
			text: String //Using text to be consistant with chat.postMessage
		}));

		const msg = RocketChat.models.Messages.findOneById(this.bodyParams.msgId);

		//Ensure the message exists
		if (!msg) {
			return RocketChat.API.v1.failure(`No message found with the id of "${ this.bodyParams.msgId }".`);
		}

		if (this.bodyParams.roomId !== msg.rid) {
			return RocketChat.API.v1.failure('The room id provided does not match where the message is from.');
		}

		//Permission checks are already done in the updateMessage method, so no need to duplicate them
		Meteor.runAsUser(this.userId, () => {
			Meteor.call('updateMessage', { _id: msg._id, msg: this.bodyParams.text, rid: msg.rid });

		});

		return RocketChat.API.v1.success({
			message: RocketChat.models.Messages.findOneById(msg._id)
		});
	}
});

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
	//console.log('user info: ', Meteor.user());
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
