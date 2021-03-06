var bird;
var birdSprite;
var bg;
var bgX = 0;
var pipeTop;
var pipeBottom;
var scoreW = 30;
var scoreH = 40;

var pipes = [];
function preload() {
    birdSprite = loadImage('Images/bird.png');
    bg = loadImage('Images/bg2.png');
    pipeTop = loadImage('Images/pipeNorth.png');
    pipeBottom = loadImage('Images/pipeSouth.png');
    pipeTopHasHit = loadImage('Images/pipeHitNorth.png');
    pipeBottomHasHit = loadImage('Images/pipeHitSouth.png');

    digitsImage = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
        number => loadImage(`Images/${number}.png`)
    )

}

function setup() {
    console.log("k");
    createCanvas(800, 550);
    bird = new Bird();
    pipes.push(new Pipe());
    currentScore = 0;
}
function draw() {
    background(0);

    image(bg, bgX, 0, bg.width, height);
    bird.update();
    bird.show();

    if (frameCount % 100 == 0) {
        pipes.push(new Pipe());
    }

    for (var i = pipes.length - 1; i >= 0; i--) {
        pipes[i].show();
        pipes[i].update();

        if (pipes[i].hit(bird, height) || bird.y==height) {
            bird.hit=true;
            console.log("hit");
            
        }
        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
            
        }
        if(pipes[i].score()){
            currentScore++;
        }
    }
    if (currentScore < 10) {
        image(digitsImage[currentScore], width / 2 - scoreW / 2, 100, scoreW, scoreH);
    }

    else if (currentScore >= 10 && currentScore <= 99) {
        let firstNumber = floor(currentScore / 10);
        let secondNumber = currentScore % 10;
        image(digitsImage[firstNumber], width / 2 - scoreW, 100, scoreW, scoreH);
        image(digitsImage[secondNumber], width / 2, 100, scoreW, scoreH);

    }

    else if (currentScore >= 100) {
        let firstNumber = floor(currentScore / 100);
        let secondNumber = floor((currentScore - firstNumber * 100) / 10);
        let thirdNumber = floor(currentScore - firstNumber * 100 - secondNumber * 10);

        image(digitsImage[firstNumber], width / 2 - scoreW * 3 / 2, 100, scoreW, scoreH);
        image(digitsImage[secondNumber], width / 2 - scoreW / 2, 100, scoreW, scoreH);
        image(digitsImage[thirdNumber], width / 2 + scoreW / 2, 100, scoreW, scoreH);
    }
}
function keyPressed() {
    if (key == ' ') {
        bird.up();
    }
}