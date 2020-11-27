'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fusion Bolt + Fusion Flare', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should boost the second move used by an ally in Doubles', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Zekrom', ability: 'teravolt', moves: ['fusionbolt']}, {species: 'Reshiram', item: 'laggingtail', ability: 'teravolt', moves: ['fusionflare']}],
			[{species: 'Dragonite', ability: 'Multiscale', moves: ['roost']}, {species: 'Lugia', ability: 'Multiscale', moves: ['roost']}],
		]);

		battle.commitDecisions();

		let bpModifiers = new Map();
		battle.onEvent('BasePower', battle.getFormat(), -100, function (bp, attacker, defender, move) {
			bpModifiers.set(move.id, this.event.modifier);
		});
		battle.p1.chooseMove('fusionbolt', 1).chooseMove('fusionflare', 1);
		battle.commitDecisions();

		assert.strictEqual(bpModifiers.get('fusionbolt'), 1);
		assert.strictEqual(bpModifiers.get('fusionflare'), 2);
	});

	it.skip('should boost the second move used by the same Pokémon in Doubles', function () {
		battle = common.createBattle({gameType: 'doubles'}, [
			[{species: 'Victini', item: 'laggingtail', ability: 'victorystar', moves: ['fusionbolt', 'fusionflare']}, {species: 'Oranguru', ability: 'telepathy', moves: ['calmmind', 'instruct']}],
			[{species: 'Dragonite', ability: 'Multiscale', moves: ['roost']}, {species: 'Lugia', ability: 'Multiscale', moves: ['roost']}],
		]);

		battle.commitDecisions();

		let bpModifiers = new Map();
		battle.onEvent('BasePower', battle.getFormat(), -100, function (bp, attacker, defender, move) {
			bpModifiers.set(move.id, this.event.modifier);
		});
		battle.commitDecisions();
		battle.p1.chooseMove('fusionflare', 2).chooseMove('instruct', -1).foe.chooseDefault();

		assert.strictEqual(bpModifiers.get('fusionbolt'), 1);
		assert.strictEqual(bpModifiers.get('fusionflare'), 2);
	});
});
