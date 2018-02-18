import _ from 'underscore';

Template.trendingHashtags.helpers({
	getHashtag(msg) {
		var hashTags = msg.match(/#[a-z 0-9]+/gi);
		return hashTags;
	},

	hasHashTags() {
		return !(_.isEmpty(hashTags()));
	},
	hashTags() {
		return ChatMessage.find().fetch();
	},
	message() {
		return _.extend(this, { customClass: 'starred', actionContext: 'starred'});
	},
	hasMore() {
		return Template.instance().hasMore.get();
	}
});

Template.trendingHashtags.onCreated(function() {
	this.hasMore = new ReactiveVar(true);
	this.limit = new ReactiveVar(50);
	//this.autorun(() => {
	//	const sub = this.subscribe('starredMessages', this.data.rid, this.limit.get());
	//const findStarredMessage = StarredMessage.find({ rid: this.data.rid });
	//if (sub.ready()) {
	//	if (findStarredMessage.count() < this.limit.get()) {
	//		return this.hasMore.set(false);
	//	}
	//}
//});
	return true;
});

Template.trendingHashtags.events({
	'scroll .js-list': _.throttle(function(e, instance) {
		if (e.target.scrollTop >= e.target.scrollHeight - e.target.clientHeight) {
			return instance.limit.set(instance.limit.get() + 50);
		}
	}, 200)
});
