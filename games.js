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
		var gameId = Games.insert(game);
		Turns.log(gameId, "Game started. One card was removed from the deck face down, and three cards were removed face up.")
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
	playCard: function (gameId, id, card, guess, which) {
		var game = Games.findOne(gameId),
			type = card.type;

		var otherPlayerId = Turns.otherId(game);

		if (type === "Guard") {
			Turns.playGuard(gameId,id,otherPlayerId,card,guess);
		} else if (type === "Priest") {
			Turns.playPriest(gameId,id,otherPlayerId,card);
		} else if (type === "Baron") {
			Turns.playBaron(gameId,id,otherPlayerId,card);
		} else if (type === "Handmaid") {
			Turns.playHandmaid(gameId,id,otherPlayerId,card);
		} else if (type === "Prince") {
			Turns.playPrince(gameId,id,otherPlayerId,card,which);
		} else if (type === "King") {
			Turns.playKing(gameId,id,otherPlayerId,card);
		} else if (type === "Countess") {
			Turns.playCountess(gameId,id,otherPlayerId,card);
		} else if (type === "Princess") {
			Turns.playPrincess(gameId,id,otherPlayerId,card);
		} else {
			console.log ("Wut");
			return;
		};
	},
	deckEmpty: function (gameId) {
		Turns.deckEmpty(gameId);
	},
	endGameEmptyDeck: function (gameId) {
		Turns.endGameEmptyDeck(gameId);
	}
})