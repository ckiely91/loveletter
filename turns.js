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

Turns.addToDiscard = function (gameId, card) {
	Games.update(gameId, {$set: {"discard": card}});
};

Turns.removeFromHand = function (gameId, id, card) {
	//BUGGY: currently removes all cards of this type rather than just one
	var object = {};
	object["players." + id + ".hand"] = card;
	Games.update(gameId, {$pull: object});

};

Turns.changeCurrentPlayer = function (gameId) {
	var game = Games.findOne(gameId),
		currentPlayer = game.currentTurn[0];

	Games.update(gameId, {$pop: {"currentTurn": -1}});
	Games.update(gameId, {$push: {"currentTurn": currentPlayer}});
};

Turns.playGuard = function (gameId, game, id, otherPlayerId, card, guess) {
	//Guess a player's hand
	var	opponentHand = game.players[otherPlayerId].hand[0].type;

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);

	if (opponentHand === guess) {
		console.log("Your opponent has that card!")
		//otherPlayerId loses the game
		//trigger endgame

	} else {
    	console.log("Your opponent doesn't have that card!")
    	//continue game
	};


};

Turns.playPriest = function (gameId, game, id, otherPlayerId, card) {
	//Look at a hand
	//Functionality for this is all client-side currently (play.js)
	console.log("Discarded Priest");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);

};

Turns.playBaron = function (gameId, game, id, otherPlayerId, card) {
	// Compare hands, lower hand is out

	console.log("Discarded Baron");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);

	var	opponentHand = game.players[otherPlayerId].hand[0].value,
		userHand = game.players[id].hand[0].value;

	if (userHand > opponentHand) {
		//otherPlayerId is out!
	} else if (userHand < opponentHand) {
		//id (current player) is out!
	} else {
		// cards must be equal, nothing happens
		return;
	}
};

Turns.playHandmaid = function (gameId, game, id, otherPlayerId, card) {
	// Protection until next turn
	// Will implement later
	
	console.log("Discarded Handmaid");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);
};

Turns.playPrince = function (gameId, game, id, otherPlayerId, card) {
	// One player discards his or her hand
	// Needs to ask current player if they want to discard their own hand
	// Must discard Countess instead if held
	console.log("Discarded Prince");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);
};

Turns.playKing = function (gameId, game, id, otherPlayerId, card) {
	//Trade hands
	//Must discard Countess instead if held
	console.log("Discarded King");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);
};

Turns.playCountess = function (gameId, game, id, otherPlayerId, card) {
	//Discard if caught with King or Prince
	console.log("Discarded Countess");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);
};

Turns.playPrincess = function (gameId, game, id, otherPlayerId, card) {
	// Lose game if discarded
	console.log("Discarded Princess");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);
};