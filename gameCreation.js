GameFactory = {};

GameFactory.createGame = function (playerIds) {

	var deck = createLLDeck(),
		players = createPlayers(playerIds);

	GameFactory.dealPlayers(players, deck);

	return {
		deck: deck,
		players: players,
		currentTurn: playerIds,
		inProgress: true,
		protected: [],
		started: new Date()
	};

};

GameFactory.dealPlayers = function (players,deck) {
	for (var i = 0; i < 1; i++) {
		Object.keys(players).forEach(function (id) {
			players[id].hand.push(deck.shift());
		});
	}
};

function createPlayers(ids) {
	var o = {};

	ids.forEach(function (id) {
		o[id] = {
			hand: [],
			score: 0
		};
	});

	return o;
}

function createLLDeck () {
	var cards = [
			{ type: 'Guard', value: 1 },
			{ type: 'Guard', value: 1 },
			{ type: 'Guard', value: 1 },
			{ type: 'Guard', value: 1 },
			{ type: 'Guard', value: 1 },
			{ type: 'Priest', value: 2 },
			{ type: 'Priest', value: 2 },
			{ type: 'Baron', value: 3 },
			{ type: 'Baron', value: 3 },
			{ type: 'Handmaid', value: 4 },
			{ type: 'Handmaid', value: 4 },
			{ type: 'Prince', value: 5 },
			{ type: 'Prince', value: 5 },
			{ type: 'King', value: 6 },
			{ type: 'Countess', value: 7 },
			{ type: 'Princess', value: 8 }
			];
	return _.shuffle(cards);
}