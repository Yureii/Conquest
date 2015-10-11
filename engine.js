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

    // Display
    Display: {
        wood:       null,
        iron:       null,
        wheat:      null,
        workers:    null
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

        Engine.DisplayRessources();
        Engine.IdleTimer();
    }
};


/* onload */
window.onload = function() {
    Engine.Init();
    console.log("Engine Started.");

    var ctx = display.getContext('2d');
    var width = display.width = window.innerWidth;
    var height = display.height = window.innerHeight;
    var terrain = new Terrain(9);
    terrain.generate(0.7);
    terrain.draw(ctx, width, height);
}
