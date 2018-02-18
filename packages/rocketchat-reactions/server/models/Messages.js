RocketChat.models.Messages.setReactions = function(messageId, reactions) {
	console.log("came here.");
	return this.update({ _id: messageId }, { $set: { reactions }});
};

RocketChat.models.Messages.unsetReactions = function(messageId) {
	return this.update({ _id: messageId }, { $unset: { reactions: 1 }});
};

RocketChat.models.Messages.setLike = function(messageId, username) {
	var likeUsers = this.find({$and: [{_id: messageId}, {"likeList": {$in: [username]}}]}).fetch();
	console.log(likeUsers);
	//this.update({_id: messageId}, {$addToSet: {"likeList": [username]}});
	//var temp = this.find({_id: messageId}, {"likeList": {$in: ["123123"]}}).fetch();
	//console.log(temp);
	//var temp1 = this.find({_id: messageId});
	//console.log(temp1);
	//console.log(this.find({_id: messageId}));
	//console.log(this.find({_id: messageId}).fetch());
	if (likeUsers.length == 0) {
		//console.log(this.find({_id: messageId}).fetch());
		return this.update({_id: messageId}, { $inc: { "like": 1 }, $addToSet: {"likeList": username}});
	} else{
		//console.log(this.find({_id: messageId}).fetch());
		return this.update({_id: messageId}, { $inc: { "like": -1 }, $pull: {"likeList": username}});
	}


}


RocketChat.models.Messages.showLike = function(messageId) {
	return this.find({_id: messageId });
}


