var MyMath = {
  min_2: function(a, b) {
    if(a<b) return a;
    return b;
  },

  min_3: function(a, b, c) {
    if(MyMath.min(a,b) < c) return MyMath.min(a,b);
    return c;
  },

  max: function(a, b) {
    if(a>b) return a;
    return b;
  },

  pow: function(a, b) {
    if(b>1) return a*Math.pow(a, b-1);
    else return a;
  },

  random_ab: function(start, end) {
    return start + Math.random()*(end - start);
  },

  random_range: function(range) {
    return Math.random() * range;
  }

}

var MDP = {
  smoothness: 2,
  // Thresholds which determine cutoffs for different terrain types
  threshold: {
    deepWater: 0.35,
    shallowWater: 0.40,
    desert: 0.45,
    plains: 0.50,
    grassland: 0.60,
    forest: 0.78,
    hills: 0.84,
    mountain: 0.96
  },

  getMap: function(n, wmult, hmult) {
    // Get the dimensions of the Map
    var power = MyMath.pow(2, n);
    var width = wmult * power + 1;
    var height = hmult * power + 1;
    window.alert(width + ' ' + height);

    // initialize arrays to hold values
    var map = [];
    for(var i = 0; i < width; i++) {
      map[i] = [];
      for (var j = 0; j < height; j++) {
         map[i][j] = 0;
      }
    }
    var returnmap = [];
    for(var i = 0; i < width; i++) {
      returnmap[i] = [];
      for (var j = 0; j < height; j++) {
         returnmap[i][j] = 0;
      }
    }

    var step = power / 2;
    var sum;
    var count;

    // h determines the fineness of the scale if it is working on
    // After every step, h is decreased by a factor of "smoothness"
    var h = 1;

    // initialize the grid points
    for(var i = 0; i < width; i+=2*step) {
      for(var j = 0; j < height; j+=2*step) {
        map[i][j] = MyMath.random_range(2*h);
      }
    }

    // Do the rest of the magic
    while(step > 0) {
      // Diamond step
      for(var x = step; x < width-1; x += 2*step) {
        for(var y = step; y < height-1; y += 2*step) {
            sum = map[x-step][y-step] + //down-left
                map[x-step][y+step] + //up-left
                map[x+step][y-step] + //down-right
                map[x+step][y+step];  //up-right
            map[x][y] = sum/4 + MyMath.random_ab(-h,h);
            console.log(x + ' ' + y);
        }
      } // END Diamond step

      // Square step
      for(var x = 0; x < width; x += step) {
        for(var y = step*(1-(x/step)%2); y < height; y += 2*step) {
          sum = 0;
          count = 0;
          if (x-step >= 0) {
            sum+=map[x-step][y];
            count++;
          }
          if (x+step < width) {
            sum+=map[x+step][y];
            count++;
          }
          if (y-step >= 0) {
            sum+=map[x][y-step];
            count++;
          }
          if (y+step < height) {
            sum+=map[x][y+step];
            count++;
          }
          if (count > 0) map[x][y] = sum/count + MyMath.random_ab(-h,h);
          else map[x][y] = 0;
        }
      } // END Square step
      h /= MDP.smoothness;
      step /= 2;
    } // end while

    // Normalize the map
    var max = Number.MAX_VALUE;
    var min = Number.MIN_VALUE;
    var row = new Array();
    for(row in map) {
      for(var d in row) {
        if(d > max) max = d;
        if(d < min) min = d;
      }
    }

    // Use the thresholds to fill in the return map
    for(var row = 0; row < map.length; row++) {
      for(var col = 0; col < map[row].length; col++) {
        map[row][col] = (map[row][col]-min)/(max-min);
        if (map[row][col] < MDP.threshold.deepWater) returnMap[row][col] = 0;
        else if (map[row][col] < MDP.threshold.shallowWater) returnMap[row][col] = 1;
        else if (map[row][col] < MDP.threshold.desert) returnMap[row][col] = 2;
        else if (map[row][col] < MDP.threshold.plains) returnMap[row][col] = 3;
        else if (map[row][col] < MDP.threshold.grassland) returnMap[row][col] = 4;
        else if (map[row][col] < MDP.threshold.forest) returnMap[row][col] = 5;
        else if (map[row][col] < MDP.threshold.hills) returnMap[row][col] = 6;
        else if (map[row][col] < MDP.threshold.mountainsr) returnMap[row][col] = 7;
        else returnMap[row][col] = 8;
      }
    }

    return returnmap;
  }
}
