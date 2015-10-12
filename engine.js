/*
  Game Engine file
*/

/* Const */
var scale = 1/4;
var tile_size = 32*scale;

var moveXAmount = 0,
    moveYAmount = 0,
    isDragging = false,
    prevX = 0,
    prevY = 0;

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
            level:  1,
            cost:   { wood: 0, iron: 0, workers: 0},
            prod:   5
        },
        quarry: {
            level:  1,
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
        map:        null,
        lodge: {
          level: null,
          cost: {
            wood: null, iron: null, workers: null
          },
          prod: null
        },
        quarry: {
          level: null,
          cost: {
            wood: null, iron: null, workers: null
          },
          prod: null
        },
        farm: {
          level: null,
          cost: {
            wood: null, iron: null, workers: null
          },
          prod: null
        }
    },

    // Clickables
    Clickables: {
      zommin: null,
      zoomout: null,
      prodbuildings: null,
      popbuildings: null
    },

    ComputeUpgradeCost: function() {
      // Lodge Cost Per level
      Engine.Buildings.lodge.cost.wood = Math.round(60*Math.pow(1.5, Engine.Buildings.lodge.level)*100)/100;
      Engine.Buildings.lodge.cost.iron = Math.round(15*Math.pow(1.5, Engine.Buildings.lodge.level)*100)/100;
      Engine.Buildings.lodge.cost.wood += 1;

      // quarry Cost Per level
      Engine.Buildings.quarry.cost.wood = Math.round(48*Math.pow(1.6, Engine.Buildings.quarry.level)*100)/100;
      Engine.Buildings.quarry.cost.iron = Math.round(24*Math.pow(1.6, Engine.Buildings.quarry.level)*100)/100;
      Engine.Buildings.quarry.cost.wood += 2;

      // Farm Cost Per level
      Engine.Buildings.farm.cost.wood = Math.round(30*Math.pow(1.6, Engine.Buildings.farm.level)*100)/100;
      Engine.Buildings.farm.cost.iron = Math.round(15*Math.pow(1.6, Engine.Buildings.farm.level)*100)/100;
      Engine.Buildings.farm.cost.wood = 1;
    },

    UpdateScale: function(s) {
      scale = s;
      tile_size = 32*scale;
      Engine.DrawMap();
      console.log('Scale: '+scale);
    },

    DisplayRessources: function() {
        Engine.Display.wood.innerHTML = Engine.Ressources.wood;
        Engine.Display.iron.innerHTML = Engine.Ressources.iron;
        Engine.Display.wheat.innerHTML = Engine.Ressources.wheat;
        Engine.Display.workers.innerHTML = Engine.Ressources.workers;
    },
    DisplayProduction: function() {
      // Level
      Engine.Display.lodge.level.innerHTML = Engine.Buildings.lodge.level;
      Engine.Display.quarry.level.innerHTML = Engine.Buildings.quarry.level;
      Engine.Display.farm.level.innerHTML = Engine.Buildings.farm.level;
      // Cost
        // Lodge
        Engine.Display.lodge.cost.wood.innerHTML = Engine.Buildings.lodge.cost.wood;
        Engine.Display.lodge.cost.iron.innerHTML = Engine.Buildings.lodge.cost.iron;
        Engine.Display.lodge.cost.workers.innerHTML = Engine.Buildings.lodge.cost.workers;
        // Quarry
        Engine.Display.quarry.cost.wood.innerHTML = Engine.Buildings.quarry.cost.wood;
        Engine.Display.quarry.cost.iron.innerHTML = Engine.Buildings.quarry.cost.iron;
        Engine.Display.quarry.cost.workers.innerHTML = Engine.Buildings.quarry.cost.workers;
        // Farm
        Engine.Display.farm.cost.wood.innerHTML = Engine.Buildings.farm.cost.wood;
        Engine.Display.farm.cost.iron.innerHTML = Engine.Buildings.farm.cost.iron;
        Engine.Display.farm.cost.workers.innerHTML = Engine.Buildings.farm.cost.workers;
      // Level
      Engine.Display.lodge.prod.innerHTML = Engine.Buildings.lodge.prod;
      Engine.Display.quarry.prod.innerHTML = Engine.Buildings.quarry.prod;
      Engine.Display.farm.prod.innerHTML = Engine.Buildings.farm.prod;
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

    BuildMap: function(images) {
      var posX = 0, posY = 0;
      var ctx = Engine.Display.map.getContext("2d");
      ctx.clearRect(0, 0, Engine.Display.map.width, Engine.Display.map.height);
      for(var i = 0; i < Engine.map.length; i++) {
        for(var j = 0; j < Engine.map[i].length; j++) {
          if(Engine.map[i][j] < 50) ctx.drawImage(images.deepWater, posX + moveXAmount, posY + moveYAmount, tile_size, tile_size);
          else if(Engine.map[i][j] < 70) ctx.drawImage(images.shallowWater, posX + moveXAmount, posY + moveYAmount, tile_size, tile_size);
          else if(Engine.map[i][j] < 80) ctx.drawImage(images.sand, posX + moveXAmount, posY + moveYAmount, tile_size, tile_size);
          else if(Engine.map[i][j] < 95) ctx.drawImage(images.valley, posX + moveXAmount, posY + moveYAmount, tile_size, tile_size);
          else if(Engine.map[i][j] < 150) ctx.drawImage(images.grassland, posX + moveXAmount, posY + moveYAmount, tile_size, tile_size);
          else if(Engine.map[i][j] < 180) ctx.drawImage(images.forest, posX + moveXAmount, posY + moveYAmount, tile_size, tile_size);
          else if(Engine.map[i][j] < 200) ctx.drawImage(images.desert, posX + moveXAmount, posY + moveYAmount, tile_size, tile_size);
          else if(Engine.map[i][j] < 240) ctx.drawImage(images.hills, posX + moveXAmount, posY + moveYAmount, tile_size, tile_size);
          else ctx.drawImage(images.mountain, posX + moveXAmount, posY + moveYAmount, tile_size, tile_size);

          posX += tile_size;
        }
        posX = 0;
        posY += tile_size;
      }
    },

    DrawMap: function() {
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

      Engine.LoadImages(tiles, function(images) {Engine.BuildMap(images);});
    },

    // Initialize
    Init: function() {
        // Assigning display elements
        Engine.Display.wood = document.getElementById("woodValue");
        Engine.Display.iron = document.getElementById("ironValue");
        Engine.Display.wheat = document.getElementById("wheatValue");
        Engine.Display.workers = document.getElementById("workersValue");

        Engine.Display.lodge.level = document.getElementById("lodgeLevel");
        Engine.Display.lodge.cost.wood = document.getElementById("lodgeWoodCost");
        Engine.Display.lodge.cost.iron = document.getElementById("lodgeIronCost");
        Engine.Display.lodge.cost.workers = document.getElementById("lodgeWorkerCost");
        Engine.Display.lodge.prod = document.getElementById("lodgeProd");

        Engine.Display.quarry.level = document.getElementById("quarryLevel");
        Engine.Display.quarry.cost.wood = document.getElementById("quarryWoodCost");
        Engine.Display.quarry.cost.iron = document.getElementById("quarryIronCost");
        Engine.Display.quarry.cost.workers = document.getElementById("quarryWorkerCost");
        Engine.Display.quarry.prod = document.getElementById("quarryProd");

        Engine.Display.farm.level = document.getElementById("farmLevel");
        Engine.Display.farm.cost.wood = document.getElementById("farmWoodCost");
        Engine.Display.farm.cost.iron = document.getElementById("farmIronCost");
        Engine.Display.farm.cost.workers = document.getElementById("farmWorkerCost");
        Engine.Display.farm.prod = document.getElementById("farmProd");

        Engine.Display.map = document.getElementById("display");
        Engine.Display.map.width = Engine.Display.map.height *
                                    (Engine.Display.map.clientWidth / Engine.Display.map.clientHeight);
        // Hiding elements
        document.getElementById("popHide").style.display = 'none';

        // Assigning Clickables
        Engine.Clickables.zoomin = document.getElementById("zoomin");
        Engine.Clickables.zoomout = document.getElementById("zoomout");
        Engine.Clickables.prodbuildings = document.getElementById("productionHeader");
        Engine.Clickables.popbuildings = document.getElementById("populationHeader");


        // Event listeners
        Engine.Clickables.prodbuildings.addEventListener('click', function() {
          if(document.getElementById("prodHide").style.display == 'none') {
            $("#prodHide").slideDown("slow");
          }
          else {
            $("#prodHide").slideUp("slow");
          }
        });
        Engine.Clickables.popbuildings.addEventListener('click', function() {
          if(document.getElementById("popHide").style.display == 'none') {
            $("#popHide").slideDown("slow");
          }
          else {
            $("#popHide").slideUp("slow");
          }
        });

        Engine.Clickables.zoomin.addEventListener("click", function() {
          // We dont want the scale going higher than 1
          if(scale*2 <= 1) {
            Engine.UpdateScale(scale*2);
          }
          return false;
        });
        Engine.Clickables.zoomout.addEventListener("click", function() {
          // We dont want the scale going lower than 1/8
          if(scale/2 >= 1/8) {
            Engine.UpdateScale(scale/2);
          }
          return false;
        });

        var size = 257,
            variability = 2,
            generator = new Utils.MidpointDisplacementMapGenerator(size, variability);
        Engine.map = generator.generate(255);

        Engine.ComputeUpgradeCost();
        Engine.DisplayRessources();
        Engine.DisplayProduction();
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
    },
};

$("#display").mousedown(function() {
  isDragging = true;
  prevX = 0; prevY = 0;
});

$(window).mouseup(function() {
  isDragging = false;
  prevX = 0; prevY = 0;
});

$(window).mousemove(function() {
  if(isDragging) {
    if(prevX > 0 || prevY > 0) {
      moveXAmount += event.pageX - prevX;
      moveYAmount += event.pageY - prevY;
      Engine.DrawMap();
    }
    prevX = event.pageX;
    prevY = event.pageY;
  }
});

/* onload */
window.onload = function() {
    Engine.Init();
    console.log("Engine Started.");
}
