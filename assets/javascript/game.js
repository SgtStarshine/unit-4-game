$(document).ready(function() {

var victory = new Audio('assets/FFXIV_Level_up.mp3');
var enemyBeaten = new Audio('assets/FFXIV_Limit_Break_Unlocked.mp3');
var startFight = new Audio('assets/FFXIV_Full_Party.mp3');
var lose = new Audio('assets/FFXIV_Instance_Failed.mp3')
var selectSFX = new Audio('assets/FFXIV_Confirm.mp3')
  
let characters = {
    'paladin': {
        name: 'paladin',
        health: 230,
        attack: 8,
        imageUrl: "assets/images/ffxiv_twi05001.png",
        counterAttack: 15
    }, 
    'warrior': {
        name: 'warrior',
        health: 250,
        attack: 6,
        imageUrl: "assets/images/ffxiv_twi05003.png",
        counterAttack: 17
    },
    'dark-knight': {
      name: 'dark-knight',
      health: 200,
      attack: 11,
      imageUrl: "assets/images/ffxiv_twi05012.png",
      counterAttack: 20
    },
    'dragoon': {
      name: 'dragoon',
      health: 90,
      attack: 22,
      imageUrl: "assets/images/ffxiv_twi05004.png",
      counterAttack: 28
    },
    'monk': {
      name: 'monk',
      health: 70,
      attack: 26,
      imageUrl: "assets/images/ffxiv_twi05002.png",
      counterAttack: 32
    },
    'ninja': {
      name: 'ninja',
      health: 80,
      attack: 23,
      imageUrl: "assets/images/ffxiv_twi05010.png",
      counterAttack: 26
    }, 
    
};

var playerChar;
var curDef;
var combatants = [];
var turnCounter = 1;
var killCount = 0;


  var renderOne = function(character, renderArea, makeChar) {

    var charDiv = $("<div class='character' data-name='" + character.name + "'>");
    var charName = $("<div class='character-name'>").text(character.name);
    var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
    var charHealth = $("<div class='character-health'>").text(character.health);

    charDiv.append(charName).append(charImage).append(charHealth);

    $(renderArea).append(charDiv);

    if (makeChar == 'enemy') {

      $(charDiv).addClass('enemy');

    } else if (makeChar == 'defender') {

      curDef = character;

      $(charDiv).addClass('target-enemy');

    }
  };

  var renderMessage = function(message) {

    var gameMesageSet = $("#gameMessage");
    var newMessage = $("<div>").text(message);

    gameMesageSet.append(newMessage);

    if (message == 'clearMessage') {

      gameMesageSet.text('');

    }
  };

  var charRender = function(charObj, areaRender) {

    if (areaRender == '#characters-section') {

      $(areaRender).empty();

      for (var key in charObj) {

        if (charObj.hasOwnProperty(key)) {

          renderOne(charObj[key], areaRender, '');
        }
      }
    }

    if (areaRender == '#selected-character') {

      $('#selected-character').prepend("Your Character");   

      renderOne(charObj, areaRender, '');

      $('#attack-button').css('visibility', 'visible');
    }

    if (areaRender == '#opponent-roster') {

        $('#opponent-roster').prepend("Choose Your Next Opponent"); 

      for (var i = 0; i < charObj.length; i++) {

        renderOne(charObj[i], areaRender, 'enemy');
      }

      $(document).on('click', '.enemy', function() {

        name = ($(this).data('name'));

        if ($('#defender').children().length === 0) {

          charRender(name, '#defender');

          $(this).hide();

          renderMessage("clearMessage");

          startFight.play();
        }
      });
    }

    if (areaRender == '#defender') {

      $(areaRender).empty();

      for (var i = 0; i < combatants.length; i++) {

        if (combatants[i].name == charObj) {

          $('#defender').append("Your selected opponent")
          renderOne(combatants[i], areaRender, 'defender');

        }
      }
    }

    if (areaRender == 'playerDamage') {

      $('#defender').empty();

      $('#defender').append("Your selected opponent")

      renderOne(charObj, '#defender', 'defender');
    }

    if (areaRender == 'enemyDamage') {

      $('#selected-character').empty();

      renderOne(charObj, '#selected-character', '');
    }

    if (areaRender == 'enemyDefeated') {

      $('#defender').empty();

      var gameStateMessage = "You have defated " + charObj.name + ", you can choose to fight another enemy.";
      
      enemyBeaten.play();

      renderMessage(gameStateMessage);
    }
  };

  charRender(characters, '#characters-section');

  $(document).on('click', '.character', function() {

    name = $(this).data('name');

    if (!playerChar) {

      playerChar = characters[name];

      for (var key in characters) {

        if (key != name) {

          combatants.push(characters[key]);
        }
      }

      selectSFX.play();

      $("#characters-section").hide();

      charRender(playerChar, '#selected-character');

      charRender(combatants, '#opponent-roster');
    }
  });

  $("#attack-button").on("click", function() {
    
    if ($('#defender').children().length !== 0) {

      var attackMessage = "You attacked " + curDef.name + " for " + (playerChar.attack * turnCounter) + " damage.";
      renderMessage("clearMessage");

      curDef.health = curDef.health - (playerChar.attack * turnCounter);

      if (curDef.health > 0) {
        
        charRender(curDef, 'playerDamage');
        
        var counterAttackMessage = curDef.name + " attacked you back for " + curDef.counterAttack + " damage.";

        renderMessage(attackMessage);
        renderMessage(counterAttackMessage);

        playerChar.health = playerChar.health - curDef.counterAttack;

        charRender(playerChar, 'enemyDamage');

        if (playerChar.health <= 0) {

          renderMessage("clearMessage");
          restartGame("You have been defeated...GAME OVER!!!");
          $("#attack-button").unbind("click");
          lose.play();
        }
      } else {

        charRender(curDef, 'enemyDefeated');

        

        killCount++;

        if (killCount >= 5) {

          renderMessage("clearMessage");
          restartGame("You Won!!!! GAME OVER!!!");
          victory.play();

        }
      }

      turnCounter++;

    } else {
      renderMessage("clearMessage");
      renderMessage("No enemy here.");
    }
  });

  
  var restartGame = function(inputEndGame) {
    
    var restart = $('<button class="btn">Restart</button>').click(function() {

      location.reload();

    });

    var gameState = $("<div>").text(inputEndGame);

    $("#gameMessage").append(gameState);

    $("#gameMessage").append(restart);
  };

});