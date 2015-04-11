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
			playerHand = game.players[id].hand,
			mongoPlayerHand = "players." + id + ".hand";
			deck = game.deck;

		var card = deck.shift();
		console.log(mongoPlayerHand);
		playerHand = game.players[id].hand.push(card);

		var object = {};
		object["players." + id + ".hand"] = card;
		Games.update(gameId, {$push: object});
		Games.update(gameId, {$pop: {"deck": -1}});

		console.log(deck);
	}
})