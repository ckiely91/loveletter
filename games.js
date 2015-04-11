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
			deck = game.deck;

		var card = deck.shift();
		console.log(playerHand);
		//Games.update({ _id: gameId}, {$push: {players: id: hand: card}});
		playerHand = game.players[id].hand.push(card);

		Games.update(
		    {"_id" : gameId, "players": id},
		    {$push:{"players.$.hand":playerHand}}
		);

		//Turns.dealPlayer(id, game.deck);
		//game.players[id].hand.push(deck.shift());
		console.log(playerHand);
	}
})