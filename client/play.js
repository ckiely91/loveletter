Template.hand.events({
	'click .card': function (evt, template) {
		if (template.data.yourTurn) {
			if (template.data.players[Meteor.userId()].hand.length <= 1) {
				alert("You need to draw a card first.");
			} else {
				if (this.type === "Guard") {
					var guess = prompt("What card does your opponent have?");
					if (guess === "Guard") {
						alert("You can't choose the guard!!!");
						return;
					}
					Meteor.call('playCard', template.data._id, Meteor.userId(), this, guess);
				} else if (this.type === "Priest") {
					var game = template.data,
						otherUser = game.currentTurn[game.currentTurn[0] === Meteor.userId() ? 1 : 0],
						otherUserHand = game.players[otherUser].hand[0].type;
					alert(Meteor.users.findOne(otherUser).username + " has a " + otherUserHand);
					Meteor.call('playCard', template.data._id, Meteor.userId(), this);
				} else {
					Meteor.call('playCard', template.data._id, Meteor.userId(), this);
				}
			}
			
		} else {
			alert("It's not your turn");
		}
	}
});

Template.deck.events({
	'click .card': function (evt, template) {

		if (template.data.yourTurn) {
			if (template.data.players[Meteor.userId()].hand.length <= 1) {
				Meteor.call('takeCard', template.data._id, Meteor.userId());
			} else {
				alert("You've already taken a card this turn.");
			}
		} else {
			alert("It's not your turn!");
		}
	}
})

