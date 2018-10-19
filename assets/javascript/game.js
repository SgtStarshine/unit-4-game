$(document).ready(function() {

    let char = {
        'paladin': {
            name: 'paladin',
            health: 500,
            attack: 6,
            imageUrl: 'assets/images/ffxiv_twi05001.png',
            counterAttack: 13
        },
        'warrior': {
            name:'warrior',
            health: 490,
            attack: 8,
            imageUrl: 'assets/images/ffxiv_twi05003.png',
            counterAttack: 15
        },
        'dark-knight': {
            name:'dark-knight',
            health: 470,
            attack: 10,
            imageUrl: 'assets/images/ffxiv_twi05012.png',
            counterAttack: 18
        }
    };

    var playerCh;
    var enemyCh;
    var fighters = [];
    var turnCount = 1;
    var winAmount = 0;



})