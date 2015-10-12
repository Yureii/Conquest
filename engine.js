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
    idleSpeed: 1000,

    // Map
    map: null,

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
      ressources: null,
      mapArray: null
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

    LoadImages: function(sources, callback) {
      var images = {};
      var loadedImages = 0;
      var numImages = 0;

      // Get number of sources
      for(var src in sources) { numImages++; }
      for(var src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
          if(++loadedImages >= numImages) {
            callback(images);
          }
        };
        images[src].src = sources[src];
      }
    },

    DrawMap: function() {
      var ctx = Engine.Display.map.getContext("2d");
      var tiles = {
        deepWater: "Images/hex_0.png",
        shallowWater: "Images/hex_1.png",
        sand: "Images/hex_2.png",
        valley: "Images/hex_3.png",
        grassland: "Images/hex_4.png",
        forest: "Images/hex_5.png",
        desert: "Images/hex_6.png",
        hills: "Images/hex_7.png",
        mountain: "Images/hex_8.png",
        template: "Images/hex_template.png"
      };

      var img = new Image();
      img.src = "Images/hex_1.png";

      var posX = 0, posY = 0;

      Engine.LoadImages(tiles, function(images) {
        for(var i = 0; i < Engine.map.length; i++) {
          for(var j = 0; j < Engine.map[i].length; j++) {
            if(Engine.map[i][j] < 50) ctx.drawImage(images.deepWater, posX, posY, 16, 16);
            else if(Engine.map[i][j] < 70) ctx.drawImage(images.shallowWater, posX, posY, 16, 16);
            else if(Engine.map[i][j] < 80) ctx.drawImage(images.sand, posX, posY, 16, 16);
            else if(Engine.map[i][j] < 95) ctx.drawImage(images.valley, posX, posY, 16, 16);
            else if(Engine.map[i][j] < 150) ctx.drawImage(images.grassland, posX, posY, 16, 16);
            else if(Engine.map[i][j] < 180) ctx.drawImage(images.forest, posX, posY, 16, 16);
            else if(Engine.map[i][j] < 200) ctx.drawImage(images.desert, posX, posY, 16, 16);
            else if(Engine.map[i][j] < 240) ctx.drawImage(images.hills, posX, posY, 16, 16);
            else ctx.drawImage(images.mountain, posX, posY, 16, 16);

            posX += 16;
          }
          posX = 0;
          posY += 16;
        }
      });
    },

    // Initialize
    Init: function() {
        // Assigning display elements
        Engine.Display.wood = document.getElementById("woodValue");
        Engine.Display.iron = document.getElementById("ironValue");
        Engine.Display.wheat = document.getElementById("wheatValue");
        Engine.Display.workers = document.getElementById("workersValue");
        Engine.Display.map = document.getElementById("display");
        Engine.Display.map.width = Engine.Display.map.height *
                                    (Engine.Display.map.clientWidth / Engine.Display.map.clientHeight);


        var size = 65,
            variability = 2,
            generator = new Utils.MidpointDisplacementMapGenerator(size, variability);
        Engine.map = generator.generate(255);

        Engine.DisplayRessources();
        Engine.IdleTimer();
        window.setInterval(Engine.Save, 15000);
        if(window.localStorage.getItem("Savefile")) Engine.Load();

        Engine.DrawMap();

    },

    /* Save function */
    Save: function() {
      Engine.Player.buildings = Engine.Buildings;
      Engine.Player.ressources = Engine.Ressources;
      Engine.Player.mapArray = Engine.map;
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
        Engine.map = Engine.Player.mapArray;
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
}
