Turns = {};

Turns.log = function (gameId, message) {
	var time = new Date();
	Games.update(gameId, {$push: {"log":{"time":time,"message":message}}});
	console.log(message);
};

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
	if (winner === "tie") {
		Turns.log(gameId, "It's a... tie?!");
		Games.update(gameId, {$set: {"winner": "Nobody"}});
	} else {
		var winnerName = Meteor.users.findOne(winner).username;
		Games.update(gameId, {$set: {"winner": winnerName}});
		Turns.log(gameId, winnerName + " won the game!");
	}
	
	Games.update(gameId, {$set: {"inProgress": false} });

};

Turns.endGameEmptyDeck = function(gameId) {
	var game = Games.findOne(gameId),
		player1 = game.currentTurn[0],
		player2 = game.currentTurn[1],
		player1hand = game.players[player1].hand[0],
		player2hand = game.players[player2].hand[0];

	Turns.log(gameId, "Game over!");
	Turns.log(gameId, Meteor.users[player1].username + " had a " + player1hand.type + ", worth " + player1hand.value + ".");
	Turns.log(gameId, Meteor.users[player2].username + " had a " + player2hand.type + ", worth " + player2hand.value + ".");

	if (player1hand.value > player2hand.value) {
		Turns.endGame(gameId, player1);
	} else if (player1hand.value < player2hand.value) {
		Turns.endGame(gameId, player2);
	} else {
		Turns.endGame(gameId, "tie");
	}
}

Turns.deckEmpty = function (gameId) {
	Turns.log(gameId,"The deck is now empty. Final turn!");
	Games.update(gameId, {$set: {"lastTurn":true}});
}

Turns.removeFromHand = function (gameId, id, card) {
	var game = Games.findOne(gameId),
		hand = game.players[id].hand;
		hand2 = [],
		cardFound = false;

	for (var i = hand.length - 1; i >= 0; i--) {

		if ((hand[i].value == card.value) && (cardFound == false))
		{
			cardFound = true;
		} else {
			hand2.push(hand[i]);
		}
	};

	var object = {};
	object["players." + id + ".hand"] = hand2;
	Games.update(gameId, {$set: object});
};

Turns.discardHandAndDrawNewCard = function (gameId, id) {
	var object = {};
	object["players." + id + ".hand"] = {};
	Games.update(gameId, {$pull: object});

	var game = Games.findOne(gameId),
		newCard = game.deck[0];

	Turns.removeTopOfDeck(gameId);
	Turns.addCardToHand(gameId,id,newCard);

	console.log(id + "'s hand was discarded and they drew a new card.");
	Turns.log(gameId, Meteor.users.findOne(id).username + "'s hand was discarded and they drew a new card.");

}

Turns.swapHands = function (gameId, id, otherPlayerId) {
	var game = Games.findOne(gameId),
		hand1 = game.players[id].hand,
		hand2 = game.players[otherPlayerId].hand;

	var object1 = {};
	object1["players." + id + ".hand"] = hand2;
	Games.update(gameId, {$set: object1});

	var object2 = {};
	object2["players." + otherPlayerId + ".hand"] = hand1;
	Games.update(gameId, {$set: object2});
}



Turns.changeCurrentPlayer = function (gameId) {
	var game = Games.findOne(gameId),
		currentPlayer = game.currentTurn[0],
		newCurrentPlayer = game.currentTurn[1];

	Games.update(gameId, {$pop: {"currentTurn": -1}});
	Games.update(gameId, {$push: {"currentTurn": currentPlayer}});

	//checking if new current player is protected by handmaiden; if so, unprotect them
	var newCurrentPlayerProtected = Turns.isProtected(game,newCurrentPlayer);

	if (newCurrentPlayerProtected == true) {
		var theUsername = Meteor.users.findOne(newCurrentPlayer).username;
		Games.update(gameId, {$pull: {protected:theUsername}});
	}; 
};

Turns.isProtected = function (game, id) {
	var protectedList = game.protected,
		theUsername = Meteor.users.findOne(id).username;

	if (protectedList.indexOf(theUsername) > -1) {
		return true;
	} else {
		return false;
	}

}

Turns.holdingCountess = function (game, id) {
	var hand = game.players[id].hand;

	for (var i = hand.length - 1; i >= 0; i--) {

		if ((hand[i].value == 7))
		{
			console.log("User has the Countess!");
			return true;
		} 
	};
	return false;
}

Turns.playGuard = function (gameId, game, id, otherPlayerId, card, guess) {
	//Guess a player's hand
	var	opponentHand = game.players[otherPlayerId].hand[0].type;

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);

	if (Turns.isProtected(game,otherPlayerId) == true) {
		console.log("Opponent was protected by Handmaid");
		Turns.log(gameId, Meteor.users.findOne(id).username + " played a Guard but the opponent was protected by a Handmaid.");
		Turns.changeCurrentPlayer(gameId);
		return;
	};

	if (opponentHand === guess) {
		console.log("Your opponent has that card!");
		Turns.log(gameId, Meteor.users.findOne(id).username + " played a Guard and guessed " + guess + ", and they were right!");
		Turns.endGame(gameId,id);
		return;
	} else {
    	console.log("Your opponent doesn't have that card!");
    	Turns.log(gameId, Meteor.users.findOne(id).username + " played a Guard and guessed " + guess + ". They were wrong.");
    	Turns.changeCurrentPlayer(gameId);
	};

};

Turns.playPriest = function (gameId, game, id, otherPlayerId, card) {
	//Look at a hand
	//Functionality for this is all client-side currently (play.js)
	console.log("Discarded Priest");
	Turns.log(gameId, Meteor.users.findOne(id).username + " played a Priest to look at the opponent's hand.");
	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);

};

Turns.playBaron = function (gameId, game, id, otherPlayerId, card) {
	// Compare hands, lower hand is out

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);

	if (Turns.isProtected(game,otherPlayerId) == true) {
		console.log("Opponent was protected by Handmaid");
		Turns.log(gameId, Meteor.users.findOne(id).username + " played a Baron but the opponent was protected by Handmaid.");
		Turns.changeCurrentPlayer(gameId);
	} else {
		var	opponentHand = game.players[otherPlayerId].hand[0].value,
		userHand = game.players[id].hand[0].value;

		if (userHand > opponentHand) {
			Turns.log(gameId, Meteor.users.findOne(id).username + " played a Baron and they had the high card.");
			Turns.endGame(gameId,id);
		} else if (userHand < opponentHand) {
			Turns.log(gameId, Meteor.users.findOne(id).username + " played a Baron and the opponent had the high card.");
			Turns.endGame(gameId,otherPlayerId);
		} else {
			console.log("Cards were equal!");
			Turns.log(gameId, Meteor.users.findOne(id).username + " played a Baron but both cards were equal.");
			Turns.changeCurrentPlayer(gameId);
		}
	}
};

Turns.playHandmaid = function (gameId, game, id, otherPlayerId, card) {
	// Protection until next turn
	
	console.log("Discarded Handmaid");
	Turns.log(gameId, Meteor.users.findOne(id).username + " played a Handmaid and is protected until their next turn.");
	var theUsername = Meteor.users.findOne(id).username;

	Games.update(gameId, {$push: {"protected":theUsername}});

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);
};

Turns.playPrince = function (gameId, game, id, otherPlayerId, card, which) {
	// One player discards his or her hand
	// Needs to ask current player if they want to discard their own hand
	// Must discard Countess instead if held
	console.log("Discarded Prince");
	Turns.log(gameId, Meteor.users.findOne(id).username + " played a Prince.");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);

	if (which == 1) {
		//current player discards hand and draws new card
		Turns.discardHandAndDrawNewCard(gameId,id);

	} else {
		//opponent discards hand and draws new card
		Turns.discardHandAndDrawNewCard(gameId,otherPlayerId);
	}
};

Turns.playKing = function (gameId, game, id, otherPlayerId, card) {
	//Trade hands
	//Must discard Countess instead if held
	console.log("Discarded King");
	Turns.log(gameId, Meteor.users.findOne(id).username + " played a King. Players have swapped hands.");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);
	Turns.swapHands(gameId,id,otherPlayerId);
};

Turns.playCountess = function (gameId, game, id, otherPlayerId, card) {
	//Discard if caught with King or Prince
	console.log("Discarded Countess");
	Turns.log(gameId, Meteor.users.findOne(id).username + " played a Countess.");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);
};

Turns.playPrincess = function (gameId, game, id, otherPlayerId, card) {
	// Lose game if discarded
	console.log("Discarded Princess");
	Turns.log(gameId, Meteor.users.findOne(id).username + " played a Princess.");

	Turns.addToDiscard(gameId,card);
	Turns.removeFromHand(gameId,id,card);
	Turns.changeCurrentPlayer(gameId);

	Turns.endGame(gameId,otherPlayerId);
};