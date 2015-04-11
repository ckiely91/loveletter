Turns = {};

Turns.otherId = function (game) {
	return game.currentTurn[game.currentTurn[0] === Meteor.userId() ? 1 : 0];
};


Turns.addCardToHand = function (gameId, id, card) {
		var object = {};
		object["players." + id + ".hand"] = card;
		Games.update(gameId, {$push: object});
};

Turns.removeTopOfDeck = function (gameId) {
	Games.update(gameId, {$pop: {"deck": -1}});
};

Turns.playGuard = function (gameId, game, id, otherPlayerId, guess) {
	var	opponentHand = game.players[otherPlayerId].hand[0].type;

	console.log(opponentHand);

	if (opponentHand === guess) {
		console.log("Your opponent has that card!")
	} else {
    	console.log("Your opponent doesn't have that card!")
	};

};







Turns.playPriest = function () {
	console.log("Thou hast Priest");
};

Turns.playBaron = function () {
	console.log("Thou hast Baron");
};

Turns.playHandmaid = function () {
	console.log("Thou hast Handmaid");
};

Turns.playPrince = function () {
	console.log("Thou hast Prince");
};

Turns.playKing = function () {
	console.log("Thou hast King");
};

Turns.playCountess = function () {
	console.log("Thou hast Countess");
};

Turns.playPrincess = function () {
	console.log("Thou hast Princess");
};