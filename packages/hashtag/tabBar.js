Meteor.startup(function() {
	RocketChat.TabBar.addButton({
		groups: ['channel', 'group', 'direct'],
		id: 'trending-hashtags',
		i18nTitle: 'Hashtags',
		icon: 'pin',
		template: 'trendingHashtags',
		order: 9
	});
});
