Games = new Meteor.Collection('games');

if (Meteor.isServer) {
	Meteor.publish('games', function () {
        return Games.find({ currentTurn: this.userId });
    });

    Meteor.publish('users', function () {
        return Meteor.users.find();
    });
}

if (Meteor.isClient) {
	Meteor.subscribe('games');
	Meteor.subscribe('users');
}


Meteor.methods({
	createGame: function (otherPlayerId) {
		var game = GameFactory.createGame([Meteor.userId(), otherPlayerId]);
		Games.insert(game);
	},
	takeCard: function (gameId, id) {
		var game = Games.findOne(gameId),
			deck = game.deck;
		if (game.currentTurn[0] !== id) return;
		if (game.players[id].hand.length > 1) return;

		var card = deck.shift();
		Turns.addCardToHand(gameId, id, card);
		Turns.removeTopOfDeck(gameId);
	},
	playCard: function (gameId, id, card, guess) {
		var game = Games.findOne(gameId),
			type = card.type;

		var otherPlayerId = Turns.otherId(game);
		
		if (type === "Guard") {
			Turns.playGuard(gameId,game,id,otherPlayerId,guess);
		} else if (type === "Priest") {
			Turns.playPriest();
		} else if (type === "Baron") {
			Turns.playBaron();
		} else if (type === "Handmaid") {
			Turns.playHandmaid();
		} else if (type === "Prince") {
			Turns.playPrince();
		} else if (type === "King") {
			Turns.playKing();
		} else if (type === "Countess") {
			Turns.playCountess();
		} else if (type === "Princess") {
			Turns.playPrincess();
		} else {
			console.log ("Wut");
			return;
		};
	}
})