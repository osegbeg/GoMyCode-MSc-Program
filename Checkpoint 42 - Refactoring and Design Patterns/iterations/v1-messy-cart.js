// ITERATION 1: Intentionally messy shopping cart with code smells
// Code smells present: poor naming, magic numbers, dead code, duplicated logic, monolithic function

var arr = [];
var flag = true; // Dead code: never used

function doEverything(a, b, c, d, type) {
  // Dead code block
  if (false) {
    console.log("Legacy debug mode");
  }

  if (a === "add") {
    var obj = { n: b, p: c, q: d, w: false, g: false };
    arr.push(obj);
  } else if (a === "checkout") {
    var t = 0;
    for (var i = 0; i < arr.length; i++) {
      // Duplicated line-item total calculation
      t = t + arr[i].p * arr[i].q;
    }

    // Hardcoded discount conditionals (violates Open/Closed Principle)
    if (type === "VIP") {
      t = t - t * 0.2; // Magic number 0.2
    } else if (type === "BULK") {
      if (t > 100) {
        t = t - 15; // Magic numbers 100 and 15
      }
    }

    // Duplicated tax calculation
    var final = t + t * 0.075; // Magic number 0.075
    console.log("ITEMS:");
    for (var j = 0; j < arr.length; j++) {
      // Same calculation duplicated again
      console.log(arr[j].n + " x" + arr[j].q + " = " + arr[j].p * arr[j].q);
    }
    console.log("TOTAL WITH TAX: " + final.toFixed(2));
  }
}

doEverything("add", "Laptop", 1200, 1);
doEverything("add", "Mouse", 25, 2);
doEverything("checkout", null, null, null, "VIP");