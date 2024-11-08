let staticRects = [];
let moveRects = [];
let pixelLength = 20;
let yellowRegions = [];
let squares = []
let squaresMode = "homing"
let homingProcess = 0;
class MyRect {
  constructor(x, y, w, h, type) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = type;
  }
  draw() {
    push();
    translate(this.x, this.y);
    noStroke();
    if (this.type == 1) {
      fill(250, 201, 1); 
    } else if (this.type == 2) {
      fill(221, 1, 0); 
    } else if (this.type == 3) {
      fill(200); 
    } else if (this.type == 4) {
      fill(34, 80, 149); 
    }
    rect(0, 0, this.w, this.h);
    pop();
  }
}
class Square {

  constructor(x, y, color) {
    this.seed = random(9999)

    this.col = x / pixelLength;
    this.row = y / pixelLength;

    this.fixedX = this.col * 12 - 300 + width / 2
    this.fixedY = this.row * 12 - 300 + height / 2

    this.currentX = this.col * 12 - 300 + width / 2
    this.currentY = this.row * 12 - 300 + height / 2
    this.initX = this.currentX
    this.initY = this.currentY
    this.s = 12
    this.color = color

    this.spd = random(2, 5)
    this.tail = []

  }

  draw() {
    rectMode(CENTER)

    if (frameCount % 5 == 0) {
      this.tail.push({ x: this.currentX, y: this.currentY, alpha: 255 })
    }

    for (let i = 0; i < this.tail.length; i++) {

      if (this.tail[i].alpha > 0) {

        fill(this.color[0], this.color[1], this.color[2], this.tail[i].alpha)
        rect(this.tail[i].x, this.tail[i].y, this.s);
        this.tail[i].alpha -= 8
      }
    }

    push();
    translate(this.currentX, this.currentY);

    noStroke();
    fill(this.color)
    rect(0, 0, this.s);
    pop();
  }
  flight() {

    let angle = map(noise(this.seed), 0, 1, 0, TWO_PI)
    this.seed += 0.007

    let spdX = cos(angle) * this.spd
    let spdY = sin(angle) * this.spd

    this.currentX += spdX
    this.currentY += spdY

    if (this.currentX < 0) {
      this.currentX = width
    } if (this.currentX > width) {
      this.currentX = 0
    } if (this.currentY < 0) {
      this.currentY = height
    } if (this.currentY > height) {
      this.currentY = 0
    }

    this.initX = this.currentX
    this.initY = this.currentY
  }
  homing() {

    this.currentX = lerp(this.initX, this.fixedX, homingProcess)
    this.currentY = lerp(this.initY, this.fixedY, homingProcess)
  }
  run() {

    if (squaresMode == "homing") {
      this.homing()
    }
    else if (squaresMode == "flight") {
      this.flight()
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

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
  background(0)
  for (let i = 0; i < staticRects.length; i++) {
    staticRects[i].draw();
  }


  if (!yellowRegions.length) {
    detectYellowRegions();
    generateRandomRectangles();
  }

  for (let i = 0; i < moveRects.length; i++) {
    moveRects[i].draw();
  }


  for (let x = 0; x < 1000; x += pixelLength) {
    for (let y = 0; y < 1000; y += pixelLength) {
      let c = get(x, y)
      if (brightness(c) > 0) {
        squares.push(new Square(x, y, c))
      }
    }

  }
  background(0)
}
function mousePressed() {
  if (squaresMode == "homing") {
    squaresMode = "flight"
    homingProcess
  } 
  else if (squaresMode == "flight") {
    squaresMode = "homing"
  }
}
function draw() {
  background(0)
  if (squaresMode == "homing") {
    if (homingProcess < 1) {
      homingProcess += 0.01
    } else {
      homingProcess = 1
    }
  }
  else if (squaresMode == "flight") {
    homingProcess = 0
  }

  for (let i = 0; i < squares.length; i++) {
    squares[i].run();
    squares[i].draw();
  }
}

function detectYellowRegions() {
  loadPixels();
  for (let x = 0; x < width; x += pixelLength) {
    for (let y = 0; y < height; y += pixelLength) {
      let col = get(x, y);
      if (col[0] === 250 && col[1] === 201 && col[2] === 1) {
        yellowRegions.push({ x, y });
      }
    }
  }
  updatePixels();
}

function generateRandomRectangles() {
  for (let i = 0; i < 300; i++) {
    let region = random(yellowRegions);
    let colorIndex = floor(random(3));

    noStroke();
    if (colorIndex == 0) {
      moveRects.push(
        new MyRect(region.x, region.y, pixelLength, pixelLength, 3)
      );
    } else if (colorIndex == 1) {
      moveRects.push(
        new MyRect(region.x, region.y, pixelLength, pixelLength, 2)
      );
    } else if (colorIndex == 2) {
      moveRects.push(
        new MyRect(region.x, region.y, pixelLength, pixelLength, 4)
      );
    }
  }
}