//AN empty array used to store static square
let staticRects = [];
// An empty array used to store moving square
let moveRects = [];
// Define the size of each square as a 20x20 square
let pixelLength = 20;
// An empty array used to store the coordinates of the yellow area
let yellowRegions = [];
// Empty array, used to store all the small squares
let squares = []
// Define the motion state of the small square, initially as "homing" (returning state)
let squaresMode = "homing"
// The initial background color is white
let backgroundCol = 255
// Define the duration of 'flight mode' as 10 seconds
let flightTime = 10000
// Control the time when the square is in the reset state, 10 seconds
let homingTime = 10000
// Variable, used to store timers
let timer


// MyRect class, used to generate and manage square
class MyRect {
  // Initialize the coordinates (x, y), width (w), height (h), and type of the square
  constructor(x, y, w, h, type) {
    // The x-coordinate, y-coordinate, width, and height of a square
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // The type of square used to determine color
    this.type = type;
  }

  draw() {
    // //Save current state
    push();
    // //Move the origin of the coordinate system to the x and y coordinates of the square
    translate(this.x, this.y);
    // square without border lines
    noStroke();

    // If judgment, set the fill color based on the type of square
    if (this.type == 1) {
      fill(250, 201, 1); // yellow
    } else if (this.type == 2) {
      fill(221, 1, 0); // red
    } else if (this.type == 3) {
      fill(200); // gray
    } else if (this.type == 4) {
      fill(34, 80, 149); // blue
    }

    // Draw a square at the current coordinates
    rect(0, 0, this.w, this.h);
    // Restore the previous state
    pop();
  }
}


// Define a Square class to control moving small squares
class Square {
  //The function of random flight and return is achieved through the small square created after the previous drawing analysis
  constructor(x, y, color) {
    //Generate random seeds for noise function to generate motion speed
    this.seed = random(9999)
    //Calculate the row and column where the square is located
    this.col = x / pixelLength;
    this.row = y / pixelLength;
    //Calculate the coordinates of the entire square centered on the canvas through row and column calculations
    //Fixed represents fixed coordinates  
    this.fixedX = this.col * 12 - 300 + width / 2
    this.fixedY = this.row * 12 - 300 + height / 2
    //Current represents the current coordinates of the square
    this.currentX = this.col * 12 - 300 + width / 2
    this.currentY = this.row * 12 - 300 + height / 2
    this.s = 12 //The size of the square
    this.color = color
    //The speed of randomly generating square
    this.spd = random(2, 4) * 0.7
    // Used to store the motion trajectory of square (trailing effect)
    this.tail = []
  }

  draw() {
    // Set square mode as the center for drawing
    rectMode(CENTER)
    // Add a trailing coordinate every 4 frames (to record the current position of the square)
    if (frameCount % 4 == 0) {
      // Add the position of the current square to the wake array
      this.tail.push({ x: this.currentX, y: this.currentY, alpha: 255, s: this.s })
    }
    //Traverse the trailing array and draw the trailing effect
    for (let i = 0; i < this.tail.length; i++) {
      //Draw each tail of the square and gradually reduce its size and transparency
      fill(this.color[0], this.color[1], this.color[2], this.tail[i].alpha)
      //Draw trailing lines
      rect(this.tail[i].x, this.tail[i].y, this.tail[i].s);
      //The size of the trailing square gradually decreases
      this.tail[i].s *= 0.99
      //The transparency of the tail gradually decreases
      this.tail[i].alpha -= 8
    }
    //Clear the already transparent tail
    for (let i = this.tail.length - 1; i >= 0; i--) {
      //Remove completely transparent trailing
      if (this.tail[i].alpha <= 0) {
        this.tail.splice(i, 1)
      }
    }
    //Save current state
    push();
    //Move the origin of the coordinate system to the current coordinates of the square
    translate(this.currentX, this.currentY);
    //Do not draw borders
    noStroke();
    // Fill color of square
    fill(this.color)
    // Draw square
    rect(0, 0, this.s);
    //Restore the previous state
    pop();
  }

  // Function for implementing square flight
  flight() {
    //Calculate the angle of a square's motion using the noise function
    let angle = map(noise(this.seed), 0, 1, -TWO_PI, TWO_PI)
    //Change the value of seed to change the angle of the square
    // *Here, seed is an argument that is passed to the noise() code to make random numbers that are smooth and steady. 
    // *These random numbers are used to control the block's angle of movement, 
    // *making sure that its path is smooth and natural instead of jumping around like regular random numbers do.
    this.seed += 0.008
    //Calculate the velocity of the square's motion based on this angle using the polar coordinate equation
    let spdX = cos(angle) * this.spd
    let spdY = sin(angle) * this.spd
    //Make the coordinates of the square move according to speed
    this.currentX += spdX
    this.currentY += spdY
    //Let the square come back from the other side after leaving the boundary
    if (this.currentX < 0) {
      this.currentX = width
    } if (this.currentX > width) {
      this.currentX = 0
    } if (this.currentY < 0) {
      this.currentY = height
    } if (this.currentY > height) {
      this.currentY = 0
    }
  }

  // Function for achieving square repositioning
  homing() {
    //Using the lerp function to return the square to a fixed position
    this.currentX = lerp(this.currentX, this.fixedX, 0.05)
    this.currentY = lerp(this.currentY, this.fixedY, 0.05)
  }
  //Make square move differently according to different states
  run() {
    //The square returns to its fixed position
    if (squaresMode == "homing") {
      this.homing()
    }
    //Free flying square
    else if (squaresMode == "flight") {
      this.flight()
    }
  }
}


function setup() {
  // Create a full screen canvas
  createCanvas(windowWidth, windowHeight);
  //Create a static square and restore the artwork
  staticRects.push(new MyRect(0, 20, 1000, pixelLength, 1));
  staticRects.push(new MyRect(0, 140, 1000, pixelLength, 1));
  staticRects.push(new MyRect(0, 320, 1000, pixelLength, 1));
  staticRects.push(new MyRect(0, 380, 1000, pixelLength, 1));
  staticRects.push(new MyRect(0, 500, 1000, pixelLength, 1));
  staticRects.push(new MyRect(0, 560, 1000, pixelLength, 1));
  staticRects.push(new MyRect(0, 620, 60, pixelLength, 1));
  staticRects.push(new MyRect(60, 660, 460, pixelLength, 1));
  staticRects.push(new MyRect(0, 700, 60, pixelLength, 1));
  staticRects.push(new MyRect(0, 760, 1000, pixelLength, 1));
  staticRects.push(new MyRect(0, 800, 60, pixelLength, 1));
  staticRects.push(new MyRect(0, 860, 1000, pixelLength, 1));
  staticRects.push(new MyRect(0, 960, 1000, pixelLength, 1));

  staticRects.push(new MyRect(20, 0, pixelLength, 320, 1));
  staticRects.push(new MyRect(60, 0, pixelLength, 1000, 1));
  staticRects.push(new MyRect(120, 0, pixelLength, 860, 1));
  staticRects.push(new MyRect(240, 0, pixelLength, 1000, 1));
  staticRects.push(new MyRect(480, 0, pixelLength, 1000, 1));
  staticRects.push(new MyRect(520, 0, pixelLength, 320, 1));
  staticRects.push(new MyRect(520, 380, pixelLength, 620, 1));
  staticRects.push(new MyRect(600, 380, pixelLength, 180, 1));
  staticRects.push(new MyRect(800, 0, pixelLength, 1000, 1));
  staticRects.push(new MyRect(860, 0, pixelLength, 320, 1));
  staticRects.push(new MyRect(900, 0, pixelLength, 380, 1));
  staticRects.push(new MyRect(900, 560, pixelLength, 220, 1));
  staticRects.push(new MyRect(960, 0, pixelLength, 1000, 1));

  staticRects.push(new MyRect(120, 60, 120, pixelLength * 2, 1));
  staticRects.push(new MyRect(120, 240, 120, pixelLength * 3, 1));
  staticRects.push(new MyRect(800, 420, 160, pixelLength * 3, 1));
  staticRects.push(new MyRect(800, 660, 160, pixelLength * 2, 1));
  staticRects.push(new MyRect(120, 700, 120, pixelLength * 3, 1));
  staticRects.push(new MyRect(160, 320, pixelLength * 3, 80, 1));
  staticRects.push(new MyRect(300, 380, pixelLength * 3, 120, 1));
  staticRects.push(new MyRect(400, 320, pixelLength * 3, 200, 1));

  staticRects.push(new MyRect(80, 180, pixelLength * 3, 60, 4));
  staticRects.push(new MyRect(80, 600, pixelLength * 3, 60, 4));
  staticRects.push(new MyRect(300, 420, pixelLength * 3, 80, 4));
  staticRects.push(new MyRect(600, 160, pixelLength * 5, 160, 4));
  staticRects.push(new MyRect(880, 100, pixelLength * 4, 40, 4));
  staticRects.push(new MyRect(820, 600, pixelLength * 4, 60, 4));

  staticRects.push(new MyRect(160, 40, pixelLength * 3, 100, 2));
  staticRects.push(new MyRect(140, 440, pixelLength * 5, 60, 2));
  staticRects.push(new MyRect(280, 40, pixelLength * 4, 100, 2));
  staticRects.push(new MyRect(400, 860, pixelLength * 3, 140, 2));
  staticRects.push(new MyRect(600, 200, pixelLength * 5, 80, 2));
  staticRects.push(new MyRect(860, 180, pixelLength * 3, 60, 2));
  staticRects.push(new MyRect(640, 400, pixelLength * 5, 160, 2));
  staticRects.push(new MyRect(880, 420, pixelLength, 60, 2));
  staticRects.push(new MyRect(820, 700, pixelLength * 4, 60, 2));

  staticRects.push(new MyRect(160, 100, pixelLength * 3, 20, 3));
  staticRects.push(new MyRect(160, 260, pixelLength * 3, 20, 3));
  staticRects.push(new MyRect(180, 340, pixelLength, 40, 3));
  staticRects.push(new MyRect(180, 720, pixelLength * 2, 20, 3));
  staticRects.push(new MyRect(300, 60, pixelLength * 2, 40, 3));
  staticRects.push(new MyRect(280, 120, pixelLength * 4, 20, 3));
  staticRects.push(new MyRect(400, 380, pixelLength * 3, 20, 3));
  staticRects.push(new MyRect(400, 420, pixelLength * 3, 60, 3));
  staticRects.push(new MyRect(400, 900, pixelLength * 3, 60, 3));
  staticRects.push(new MyRect(660, 420, pixelLength * 3, 60, 3));
  staticRects.push(new MyRect(640, 540, pixelLength * 5, 20, 3));

  //Set the background color to black
  background(0)
  //Draw each static square
  for (let i = 0; i < staticRects.length; i++) {
    staticRects[i].draw();
  }

  //If the yellow area array is empty, detect the yellow area and generate a moving square
  if (!yellowRegions.length) {
    //Detect the yellow area
    detectYellowRegions();
    //Generate a random square in the yellow area
    generateRandomRectangles();
  }

  //Draw all moving square
  for (let i = 0; i < moveRects.length; i++) {
    moveRects[i].draw();
  }

  //After drawing the square created by the previous program onto the canvas, use nested for loops to traverse the canvas
  //Create small squares with corresponding colors and positions based on the content of the screen
  for (let x = 0; x < 1000; x += pixelLength) {
    for (let y = 0; y < 1000; y += pixelLength) {
      //Get pixel color
      let c = get(x, y)
      //If the brightness is greater than 0, it indicates that the pixel has color
      if (brightness(c) > 0) {
        //Create square and add them to an array
        squares.push(new Square(x, y, c))
      }
    }
  }

  //Reset background to black
  background(0)
  //Record the start time of the program
  // *The millis here is a built-in function of p5. js, because I don't want to start my animation through interaction, 
  // I used this function to record the time that has passed since the program started running, 
  // so that after a certain period of time, the program will automatically start running
  timer = millis()-7000
}

function draw() {
  //Set background color
  background(backgroundCol)

  //Under different motion states, the background color will gradually change to black or white
  if (squaresMode == "homing") {
    backgroundCol = lerp(backgroundCol, 255, 0.03)
    //If the corresponding time is reached to switch states
    if (millis() - timer > homingTime) {
      //Reset timer
      timer = millis()
      // Switch Mode
      squaresMode = "flight"
    }
  }
  //Check if it is currently in flight mode
  else if (squaresMode == "flight") {
    backgroundCol = lerp(backgroundCol, 0, 0.03)
    //If the corresponding time is reached to switch states
    if (millis() - timer > flightTime) {
      //Reset timer
      timer = millis()
      // Switch Mode
      squaresMode = "homing"
    }
  }
  // Draw and update the status of each square
  for (let i = 0; i < squares.length; i++) {
    //Update the motion status of the square
    squares[i].run();
    //Draw square
    squares[i].draw();
  }
}

//Function for detecting yellow areas
function detectYellowRegions() {
  //Load pixel data of canvas
  // *The loadPixels() function was used here because in the original group code, the yellow rectangle was fixed, 
  // *but I wanted to achieve the effect of completely scattering the graphics and then combining them, 
  // *so I used this function to load the pixel information of the current canvas into the pixels [] array
  loadPixels();
  for (let x = 0; x < width; x += pixelLength) {
    for (let y = 0; y < height; y += pixelLength) {
      //Obtain the color at the (x, y) coordinates
      let col = get(x, y);
      //If the color is yellow
      if (col[0] === 250 && col[1] === 201 && col[2] === 1) {
        //Add the coordinates of the yellow area to the array
        yellowRegions.push({ x, y });
      }
    }
  }
  //Update canvas pixels
  // *The reason for using updatePixels() here is the same as above. 
  // *This function is used to apply the modified pixel information to the canvas
  updatePixels();
}

//Function for generating random square in the yellow area
function generateRandomRectangles() {
  for (let i = 0; i < 300; i++) {
    //Randomly select a region from the yellow area
    let region = random(yellowRegions);
    //Randomly generate a color index (0, 1, 2)
    let colorIndex = floor(random(3));
    
    //Do not draw borders
    noStroke();
    if (colorIndex == 0) {
      moveRects.push(
        //Generate gray square
        new MyRect(region.x, region.y, pixelLength, pixelLength, 3)
      );
    } else if (colorIndex == 1) {
      moveRects.push(
        //Generate a red square
        new MyRect(region.x, region.y, pixelLength, pixelLength, 2)
      );
    } else if (colorIndex == 2) {
      moveRects.push(
        //Generate a blue square
        new MyRect(region.x, region.y, pixelLength, pixelLength, 4)
      );
    }
  }
}