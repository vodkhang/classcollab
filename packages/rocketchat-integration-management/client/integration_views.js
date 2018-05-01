const VIEW_SECTION = 'Create_new';
const ICON = 'video';

RocketChat.inCorrectRoom = function(roomId, botId) {
	const regexStr = `(^${botId}(.)*)|((.)*${botId}$)`;
	const regex = new RegExp(regexStr);
	let result;
	if (roomId != null)
		result = roomId.match(regex) != null;
	else
		result = false;
	return result;
}

RocketChat.display_view = function(name, command, obj) {
	Tracker.autorun(() => {
		var roomId = Session.get('openedRoom');
		if (RocketChat.inCorrectRoom(Session.get('openedRoom'), obj.userId) === true) {
			RocketChat.messageBox.actions.add(VIEW_SECTION, name, {
				id: name,
				icon: ICON,
				condition: () => (navigator.getUserMedia || navigator.webkitGetUserMedia),
				action(event, element) {
					console.log('call sendMessage.');
					console.log('message to be sent ', obj.triggerWords[0]);
					Meteor.call('sendMessage', {
						_id: Random.id(),
						msg: obj.triggerWords[0],
						rid: roomId,
						action: true
					}
					);
				}
			});
		}
	});
}
