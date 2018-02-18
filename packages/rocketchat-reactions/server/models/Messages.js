RocketChat.models.Messages.setReactions = function(messageId, reactions) {
	return this.update({ _id: messageId }, { $set: { reactions }});
};

RocketChat.models.Messages.unsetReactions = function(messageId) {
	return this.update({ _id: messageId }, { $unset: { reactions: 1 }});
};

RocketChat.models.Messages.setLike = function(messageId, username) {
	const likeUsers = this.find({$and: [{_id: messageId}, {'likeList': {$in: [username]}}]}).fetch();
	if (likeUsers.length === 0) {
		return this.update({_id: messageId}, { $inc: { 'like': 1 }, $addToSet: {'likeList': username}});
	} else {
		return this.update({_id: messageId}, { $inc: { 'like': -1 }, $pull: {'likeList': username}});
	}


}


RocketChat.models.Messages.showLike = function(messageId) {
	return this.find({_id: messageId });
}


