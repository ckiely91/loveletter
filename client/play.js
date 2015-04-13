Template.hand.events({
	'click .card': function (evt, template) {
		var game = template.data,
			otherUser = game.currentTurn[game.currentTurn[0] === Meteor.userId() ? 1 : 0],
			otherUserHand = game.players[otherUser].hand[0].type,
			opponentProtected = Turns.isProtected(game,otherUser),
			holdingCountess = Turns.holdingCountess(game,Meteor.userId());

		if (game.yourTurn && Session.get('modal') != true) {
				if (game.players[Meteor.userId()].hand.length <= 1) {
					alert("You need to draw a card first.");
				} else {
					if (this.type === "Guard") {
						if (opponentProtected == true) {
							alert("Opponent is protected by Handmaid. Nothing happens.");
							Meteor.call('playCard', template.data._id, Meteor.userId(), this, 0);
						} else {
							document.getElementById('guardchoice').style.display = 'block';
							Session.set('modal',true);
							return;
						}					
					} else if (this.type === "Priest") {

						if (opponentProtected == true) {
							alert("Opponent is protected by Handmaid");
						} else {
							alert(Meteor.users.findOne(otherUser).username + " has a " + otherUserHand);
						}

						Meteor.call('playCard', template.data._id, Meteor.userId(), this);
					} else if (this.type === "Prince") {
						if (holdingCountess == true) {
							alert("You're holding the Countess, so you have to discard that instead. Sorry buddy");
							var countessCard = {"type":"Countess","value":7};
							Meteor.call('playCard', template.data._id, Meteor.userId(), countessCard);
						} else {
							if (opponentProtected == true) {
								alert("Opponent is protected by Handmaid. You must therefore discard your own hand.");
								Meteor.call('playCard', template.data._id, Meteor.userId(), this, 0, 1);
							} else {
								var which = prompt("Who should discard their hand? Type 1 for you, or 2 for your opponent.");
								if (which === "1" || which === "2") {
									Meteor.call('playCard', template.data._id, Meteor.userId(), this, 0, which);
								} else {
									alert("You have to type 1 or 2 goddammit, stop playing around");
									return;
								}
							}
						}
						
					} else {
						Meteor.call('playCard', template.data._id, Meteor.userId(), this);
					}

					if (template.data.inProgress == true && template.data.lastTurn == true) {
						Meteor.call('endGameEmptyDeck', template.data._id);
					}
				}
			
			
		}
	}
});

Template.deck.events({
	'click .card': function (evt, template) {

		if (template.data.yourTurn) {
			var deck = template.data.deck;
			if (deck.length > 1) {
				if (template.data.players[Meteor.userId()].hand.length <= 1) {
				Meteor.call('takeCard', template.data._id, Meteor.userId());
				} else {
					alert("You've already taken a card this turn.");
				}
			} else {
				Meteor.call('deckEmpty', template.data._id);
				Meteor.call('takeCard', template.data._id, Meteor.userId());
			}
			
		} else {
			alert("It's not your turn!");
		}
	}
});

Template.guardchoice.events({
	'click a': function (evt, template) {
		document.getElementById('guardchoice').style.display = 'none';
		Session.set('modal',false);
		var guess = evt.target.name,
			card = {"type":"Guard","value":1};
		Meteor.call('playCard', template.data._id, Meteor.userId(), card, guess, 0);
	}
});




Template.gamelog.helpers({
	gamelog : function(parentContext) {
		return parentContext.log.slice(-10).reverse();
	},
	friendlytime : function(time) {
		return moment(time).fromNow();
	}
});