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
		started: new Date()
	};

};

GameFactory.dealPlayers = function (players,deck) {
	for (var i = 0; i < 2; i++) {
		Object.keys(players).forEach(function (id) {
			players[id].hand.push(deck.shift());
		});
	}
};

/*
function dealTable(deck) {
	var c = deck.shift.bind(deck);
	return [c(), c(), c(), c()];
}*/

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

/*
function createDeck () {
	var suits = ['Cups', 'Coins', 'Swords', 'Clubs'],
	cards = [];

	suits.forEach(function (suit) {
		for (var i = 1; i <= 10; i++) {
			var name = i;
			if (i === 1) name = 'A';
			if (i === 8) name = 'N';
			if (i === 9) name = 'Q';
			if (i === 10) name = 'K';
			cards.push({
				suit: suit,
				value: i,
				name: name
			});
		}
	});

	return _.shuffle(cards);

	} */