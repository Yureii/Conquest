/*
  Game Engine file
*/

/* Const */
var TICKS_PER_SEC = 1;
var SKIP_TICKS = 1000 / TICKS_PER_SEC;
var FILTER_PER_SECOND = 3600;
var FILTER_PER_MINUTE = 60;

/* Engine */
var Engine = {
    timeThen: new Date().getTime(),
    timeNow:  new Date().getTime(),
    ticks: 0,
    idleSpeed: 3000,

    // Ressources
    Ressources: {
        wood:     50,
        iron:     25,
        wheat:    50,
        workers:  0
    },

    // Buildings
    Buildings: {
        lodge: {
            level:  0,
            cost:   { wood: 0, iron: 0, workers: 0},
            prod:   5
        },
        quarry: {
            level:  0,
            cost:   { wood: 0, iron: 0, workers: 0},
            prod:   1
        },
        farm: {
            level:  0,
            cost:   { wood: 0, iron: 0, workers: 0},
            prod:   2.5
        },
        house: {
            number: 0,
            cost:   { wood: 0, iron: 0, workers: 0},
            prod:   0
        }
    },

    // Player
    Player: {
      buildings: null,
      ressources: null
    },

    // Display
    Display: {
        wood:       null,
        iron:       null,
        wheat:      null,
        workers:    null,
        map:        null
    },

    DisplayRessources: function() {
        Engine.Display.wood.innerHTML = Engine.Ressources.wood;
        Engine.Display.iron.innerHTML = Engine.Ressources.iron;
        Engine.Display.wheat.innerHTML = Engine.Ressources.wheat;
        Engine.Display.workers.innerHTML = Engine.Ressources.workers;
    },

    IdleTimer: function() {
        Engine.timeNow = new Date().getTime();
        // This is a quick sum to calculate the difference in times.
        var timeDiff = Engine.timeNow - Engine.timeThen - Engine.ticks;

        while(timeDiff >= Engine.idleSpeed) {
            Engine.DisplayRessources();
            timeDiff -= Engine.idleSpeed;
            // Finally we set the totalTicks
            Engine.ticks += Engine.idleSpeed;
        }
        var idleTime = Engine.idleSpeed - timeDiff;

        Engine.Ressources.wood += Engine.Buildings.lodge.prod;
        Engine.Ressources.iron += Engine.Buildings.quarry.prod;
        Engine.Ressources.wheat += Engine.Buildings.farm.prod;
        Engine.Ressources.house += Engine.Buildings.house.prod;

        setTimeout(Engine.IdleTimer, idleTime);
    },

    // Initialize
    Init: function() {
        // Assigning display elements
        Engine.Display.wood = document.getElementById("woodValue");
        Engine.Display.iron = document.getElementById("ironValue");
        Engine.Display.wheat = document.getElementById("wheatValue");
        Engine.Display.workers = document.getElementById("workersValue");
        Engine.Display.map = document.getElementById("display");

        Engine.DisplayRessources();
        Engine.IdleTimer();
        window.setInterval(Engine.Save, 15000);
        if(window.localStorage.getItem("Savefile")) Engine.Load();
    },

    /* Save function */
    Save: function() {
      Engine.Player.buildings = Engine.Buildings;
      Engine.Player.ressources = Engine.Ressources;
      var tmpSaveFile = JSON.stringify(Engine.Player);
      // Create the save file.
      window.localStorage.setItem("Savefile", tmpSaveFile);
      // Use the SetStatus function to make a quick notification tha the game is saved
      console.log("Game saved.");
    },

    /* Load funciton */
    Load: function() {
      // Check to see if the savefile exists
      if(!window.localStorage.getItem("Savefile")) Engine.SetStatus("No save file present.");
      else {
        // Grab and parse the Savefile
        var tmpSaveFile = window.localStorage.getItem("Savefile");
        Engine.Player = JSON.parse(tmpSaveFile);
        Engine.Buildings = Engine.Player.buildings;
        Engine.Ressources = Engine.Player.ressources;
        Engine.DisplayRessources();
        console.log("Game loaded successfully.")
      }
    },
    // Delete
    Delete: function() {
      if(!window.localStorage.getItem("Savefile")) {
        console.log("No savefile present.");
      }
      else {
        window.localStorage.removeItem("Savefile");
        console.log("Savefile removed.");
      }
    }
};


/* onload */
window.onload = function() {
    Engine.Init();
    console.log("Engine Started.");

    var ctx = Engine.Display.map.getContext("2d");
    var size = 513,
        variability = 1.5,
        generator = new Utils.MidpointDisplacementMapGenerator(size, variability),
        map = generator.generate(255);

}
