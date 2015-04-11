Template.hand.events({
	'click .card': function (evt, template) {
		if (template.data.yourTurn) {
			Meteor.call('takeTurn', template.data._id, Meteor.userId(), this);
		}
	}
});

Template.deck.events({
	'click .card': function (evt, template) {
		if (template.data.yourTurn) {
			Meteor.call('takeCard', template.data._id, Meteor.userId());
		}
	}
})

