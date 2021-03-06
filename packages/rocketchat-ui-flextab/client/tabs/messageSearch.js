import _ from 'underscore';
import { Meteor } from 'meteor/meteor'

Meteor.startup(function() {
	RocketChat.MessageAction.addButton({
		id: 'jump-to-search-message',
		icon: 'jump',
		label: 'Jump_to_message',
		context: [
			'search'
		],
		action() {
			const message = this._arguments[1];
			console.log(message);
			if (window.matchMedia('(max-width: 500px)').matches) {
				Template.instance().tabBar.close();

			}
			menu.close();

			FlowRouter.goToRoomById(message.rid);
			menu.close();
			console.log(Template.currentData());
			console.log(RoomHistoryManager.getRoom(message.rid));

			Meteor.setTimeout(function() {
				RoomHistoryManager.getSurroundingMessages(message, 10);
			}, 300);
			// Meteor.setTimeout(RoomHistoryManager.getSurroundingMessages(message, 2), 30000);
		},
		order: 100,
		group: 'menu'
	});
});


Template.messageSearch.helpers({
	tSearchMessages() {
		return t('Search_Messages');
	},

	searchResultMessages() {
		const searchResult = Template.instance().searchResult.get();
		console.log(searchResult);
		if (searchResult) {
			return searchResult.messages;
		}
	},

	hasMore() {
		return Template.instance().hasMore.get();
	},

	currentSearchTerm() {
		return Template.instance().currentSearchTerm.get();
	},

	ready() {
		return Template.instance().ready.get();
	},

	message() {
		return _.extend(this, { customClass: 'search', actionContext: 'search'});
	}
});

Template.messageSearch.events({
	'keydown #message-search'(e) {
		if (e.keyCode === 13) {
			return e.preventDefault();
		}
	},

	'keyup #message-search': _.debounce(function(e, t) {
		const value = e.target.value.trim();
		if ((value === '') && t.currentSearchTerm.get()) {
			t.currentSearchTerm.set('');
			t.searchResult.set(undefined);
			t.hasMore.set(false);
			return;
		} else if (value === t.currentSearchTerm.get()) {
			return;
		}

		t.hasMore.set(true);
		t.limit.set(20);
		return t.search();
	}, 500),

	'click .load-more button'(e, t) {
		t.limit.set(t.limit.get() + 20);
		return t.search();
	},

	'scroll .js-list': _.throttle(function(e, t) {
		if (e.target.scrollTop >= (e.target.scrollHeight - e.target.clientHeight)) {
			t.limit.set(t.limit.get() + 20);
			return t.search();
		}
	}, 200)
});

Template.messageSearch.onCreated(function() {
	this.currentSearchTerm = new ReactiveVar('');
	this.searchResult = new ReactiveVar();
	this.hasMore = new ReactiveVar(true);
	this.limit = new ReactiveVar(20);
	this.ready = new ReactiveVar(true);

	return this.search = () => {
		this.ready.set(false);
		const value = this.$('#message-search').val();
		return Tracker.nonreactive(() => {
			roomList = ChatRoom.find({}, {_id: true}).fetch();
			roomIDs = _.map(roomList, (room) => { return room._id;})
			console.log(roomIDs);
			return Meteor.call('messageSearchMultiRooms', value, roomIDs, this.limit.get(), (error, result) => {
				console.log(result);
				this.currentSearchTerm.set(value);
				this.ready.set(true);
				if ((result != null) && (((result.messages != null ? result.messages.length : undefined) > 0) || ((result.users != null ? result.users.length : undefined) > 0) || ((result.channels != null ? result.channels.length : undefined) > 0))) {
					this.searchResult.set(result);
					if (((result.messages != null ? result.messages.length : undefined) + (result.users != null ? result.users.length : undefined) + (result.channels != null ? result.channels.length : undefined)) < this.limit.get()) {
						return this.hasMore.set(false);
					}
				} else {
					return this.searchResult.set();
				}
			});
		});
	}
});
