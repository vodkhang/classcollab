import { Session } from 'meteor/session'
var handle = Meteor.subscribe('integrations');
let key;
Tracker.autorun(() => {
	let roomId = Session.get('openedRoom');
	if (handle.ready()) {
		RocketChat.messageBox.actions = RocketChat.setDefaultActions();
		//console.log(integrationsCollections.find().fetch());
		const integrations = integrationsCollections.find().fetch();
		for (key in integrations) {
			const obj = integrations[key];
			RocketChat.display_view(obj.name, obj.triggerWords, obj);
		}
	}
});
