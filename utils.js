var MyMath = {
  rand: Math.random(),

  min_2: function(a, b) {
    if(a<b) return a;
    return b;
  },

  min_3: function(a, b, c) {
    if(MyMath.min(a,b) < c) return MyMath.min(a,b);
    return c;
  },
}

var MidPointDisplacement = {
  smoothness: 2,
  threshold: {
    deepWater: 0.35,
    shallowWater: 0.40,
    desert: 0.45,
    plains: 0.50,
    grass: 0.60,
    forest: 0.78,
    hills: 0.84,
    mountain: 0.96
  },

  getMap: function(n, wmult, hmult) {
    // Get the dimensions of the Map
    var power = math.power(2, n);
    var width = wmult * power + 1;
    var height = hmult * power + 1;

    // initialize arrays to hold values
    var map = new Array(height);
    for (var i = 0; i < height; i++) {
       map[i] = new Array(width);
    }

    var step = power / 2;
    var sum;
    var count;

    // h determines the fineness of the scale if it is working on
    // After every step, h is decreased by a factor of "smoothness"
    var h = 1;

    // initialize the grid points
    for(var i = 0; i < width; i+=2*step) {
      for(var j = 0; j<height; j+=2*step) {
        map[i][j] = 0; // TO COMPLETE
      }
    }
  },
}
