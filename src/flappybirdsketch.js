var bird;
var birdSprite;
var bg; 
var bgX=0;
var pipeTop;
var pipeBottom;
function preload() {
    birdSprite = loadImage('Images/bird.png');
    bg = loadImage('Images/bg2.png');
    pipeTop= loadImage('Images/pipeNorth.png');
    pipeBottom=loadImage('Images/pipeSouth.png');
  }

function setup(){
    console.log("k");
    createCanvas(800, 550);
    bird = new Bird();
}
function draw(){
    background(0);
    image(bg, bgX, 0, bg.width, height);
   
    bird.update();
    bird.show();
}
function keyPressed(){
    if(key ==' '){
        bird.up();
    }
}