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

Turns.endGame = function (gameId, winner) {
	var winnerName = Meteor.users.findOne(winner).username;
	Games.update(gameId, {$set: {"winner": winnerName}});
	Games.update(gameId, {$set: {"inProgress": false} });
};

Turns.removeFromHand = function (gameId, id, card) {
	var game = Games.findOne(gameId),
		hand = game.players[id].hand;
		hand2 = [],
		cardFound = false;

		for (var i = hand.length - 1; i >= 0; i--) {
			console.log(hand[i]);

			if ((hand[i].value == card.value) && (cardFound == false))
			{
				console.log("Found my needle in my haystack.");
				console.log(card);
				cardFound = true;
			} else {
				hand2.push(hand[i]);
			}
		};
	var object = {};
	object["players." + id + ".hand"] = hand2;
	Games.update(gameId, {$set: object});
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
		Turns.endGame(gameId,otherPlayerId);

	} else {
    	console.log("Your opponent doesn't have that card!")
    	return;
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
		Turns.endGame(gameId,id);
	} else if (userHand < opponentHand) {
		Turns.endGame(gameId,otherPlayerId);
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

	Turns.endGame(gameId,otherPlayerId);
};