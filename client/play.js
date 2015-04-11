Template.hand.events({
	'click .card': function (evt, template) {
		if (template.data.yourTurn) {
			if (this.type === "Guard") {
				var guess = prompt("What card does your opponent have?");
				if (guess === "Guard") {
					alert("You can't choose the guard!!!");
					return;
				}
				Meteor.call('playCard', template.data._id, Meteor.userId(), this, guess);
			} else {
				Meteor.call('playCard', template.data._id, Meteor.userId(), this);
			}
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

