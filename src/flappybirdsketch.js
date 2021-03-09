let TRAINING = 'training';
let PLAYING = 'playing';
let SHOWNN = 'shownn';
let RUNBEST = 'runbest';
let state = TRAINING;
var bird;
var birdSprite;
var bg;
var bgX = 0;
var pipeTop;
var pipeBottom;
var scoreW = 30;
var scoreH = 40;
var pipes = [];

let innv = new InnovNum();
let totalPopulation = 500;
// All active birds (not yet collided with pipe)
let activeBirds = [];
// All birds for any given population
let allBirds = [];
// Pipes
// let pipes = [];
// A frame counter to determine when to add a pipe
let counter = 0;
let dead = false;

let population;

// Interface elements
let speedSlider;
let speedSpan;
let highScoreSpan;
let allTimeHighScoreSpan, statsSpan,tipSpan;

// All time high score
let highScore = 0;

// Training or just showing the current best
let runBest = false;
let playing = false;
let showNN = false;
let runBestButton,playButton, showNNButton, trainButton;
let player;
let savedBird, bestBird;
let showBird;
let gen,stats;
let backgroundImg, birdImg;
let playerGravity = 0.5
// let dead = false;

function preload() {
	gen = loadJSON('best_member2.json');
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
    let canvas = createCanvas(800, 550);
    canvas.parent('canvascontainer');
  // Access the interface elements
    speedSlider = select('#speedSlider');
    speedSpan = select('#speed');
    tipSpan = select('#tip')
    highScoreSpan = select('#hs');
    allTimeHighScoreSpan = select('#ahs');
    statsSpan = select('#stats');
	trainButton = select('#train');
	trainButton.mousePressed(toggleTrain);
    runBestButton = select('#best');
    runBestButton.mousePressed(toggleBest);
    playButton = select('#play');
    playButton.mousePressed(togglePlay);
    showNNButton = select('#showNN');
    showNNButton.mousePressed(toggleShowNN);

	
    // Create a population
    for (let i = 0; i < totalPopulation; i++) {
        let bird = new Bird();
        activeBirds[i] = bird;
    }
    population = new Population(5,2,activeBirds.slice(),innv);
    population.initialPop();
    currentScore = 0;
	let g = population.deserialize(gen);
  	savedBird = new Bird(g);
}

// Toggle the state of the simulation
function toggleTrain() {
	if(dead)loop();
	state = TRAINING;
	nextGeneration();
}

function toggleBest(){
	if(dead)loop();
	state = RUNBEST;
	showBird = savedBird;
}

function togglePlay(){
	if(dead)loop();
  	state = PLAYING
    resetGame();
    speedSlider.value(1)
    tipSpan.html('Press space to jump');
}

function toggleShowNN(){
	if(dead)loop();
	state = SHOWNN;
}

function draw() {
    background(0);

    if(state == SHOWNN){
        background(0);
        let g = showBird.genome;
        drawGenome(g,50,50,height-50,width-50);
    }
    else if(state == TRAINING){
		image(bg, bgX, 0, bg.width, height);
		let cycles = speedSlider.value();
		speedSpan.html(cycles);
		for (let n = 0; n < cycles; n++) {
			for (let i = pipes.length - 1; i >= 0; i--) {
				pipes[i].update();
				if (pipes[i].offscreen()) {
					pipes.splice(i, 1);
				}
				if(activeBirds.length > 0 && pipes[i].score(activeBirds[0])){
					currentScore++;
				}
			}
			if (counter % 100 == 0) {
				pipes.push(new Pipe());
			}
			counter++;
			
			for (let i = activeBirds.length - 1; i >= 0; i--) {
				let bird = activeBirds[i];
				bird.think(pipes);
				bird.update();
				for (let j = 0; j < pipes.length; j++) {
					if (pipes[j].hit(activeBirds[i])) {
						activeBirds.splice(i, 1);
						break;
					}
				}
				if (bird.bottomTop()) {
					activeBirds.splice(i, 1);
				}
			}
		}
		for (let i = 0; i < pipes.length; i++) {
			pipes[i].show();
		}
		for (let i = 0; i < activeBirds.length; i++) {
			activeBirds[i].show();
		}
		displayScore(currentScore);
		if(activeBirds.length > 0){
			showBird = activeBirds[0];
			drawGenome(activeBirds[0].genome,0.6*width,0,height,width,0.4);
		}
		if(currentScore > highScore){
			highScore = currentScore;
			bestBird = showBird;
		}
		highScoreSpan.html(currentScore);
  		allTimeHighScoreSpan.html(highScore);
		if (activeBirds.length == 0) {
			currentScore = 0;
			nextGeneration();
		}
    }
	else if(state == PLAYING){
		image(bg, bgX, 0, bg.width, height);
		for (let i = pipes.length - 1; i >= 0; i--) {
			pipes[i].update();
			if (pipes[i].offscreen()) {
				pipes.splice(i, 1);
			}
			if(pipes[i].score(player)){
				currentScore++;
			}
		}
		if (counter % 100 == 0) {
			pipes.push(new Pipe());
		}
		counter++;
		player.update();
		for (let j = 0; j < pipes.length; j++) {
			if (pipes[j].hit(player)) {
				dead = true;
				break;
			}
		}
		if (player.bottomTop()) {
			dead = true;
		}
		for (let i = 0; i < pipes.length; i++) {
			pipes[i].show();
		}
		player.show();
		displayScore(currentScore);
		if(currentScore > highScore){
			highScore = currentScore;
		}
		highScoreSpan.html(currentScore);
  		allTimeHighScoreSpan.html(highScore);
		if(dead){
			textSize(40);
			textAlign(CENTER,CENTER);
			fill(255);
			text('Click to Play',width/2,height/2);
			noLoop();
		}
	}
    else if(state == RUNBEST){
		
		image(bg, bgX, 0, bg.width, height);
		let cycles = speedSlider.value();
		speedSpan.html(cycles);
		for (let n = 0; n < cycles; n++) {
			for (let i = pipes.length - 1; i >= 0; i--) {
				pipes[i].update();
				if (pipes[i].offscreen()) {
					pipes.splice(i, 1);
				}
				if(pipes[i].score(savedBird)){
					currentScore++;
				}
			}
			if (counter % 100 == 0) {
				pipes.push(new Pipe());
			}
			counter++;
			savedBird.think(pipes);
			savedBird.update();
			for (let j = 0; j < pipes.length; j++) {
				if (pipes[j].hit(savedBird)) {
					resetGame();
					break;
				}
			}
			if (savedBird.bottomTop()) {
				resetGame();
			}
		}
		for (let i = 0; i < pipes.length; i++) {
			pipes[i].show();
		}
		savedBird.show();
		displayScore(currentScore);
		if(currentScore > highScore){
			highScore = currentScore;
		}
		highScoreSpan.html(currentScore);
  		allTimeHighScoreSpan.html(highScore);
	}
    
    
}


function mousePressed(){
	if(state == PLAYING && dead){
		dead = false;
		loop();
		resetGame();
	}
}

function keyPressed() {
	if(key == 'S'){
		population.saveMember(activeBirds[0].genome);
	}
	if(state == PLAYING){
		if (key == ' ') {
			player.up();
		}
	}
    return false;
}

function resetGame() {
	// loop();
    counter = 0;
    currentScore = 0;
	// for (let i = 0; i < totalPopulation; i++) {
    //     let bird = new Bird();
    //     activeBirds[i] = bird;
    // }
    // population = new Population(5,2,activeBirds.slice(),innv);
    // population.initialPop();
	player = new Bird();
	player.gravity = playerGravity;
    pipes = [];
  }
  function printStats(){
    statsSpan.html(`
    </br><==== GENERATION : ${stats.gen} ====></br>
      No of Species : ${stats.species}</br>
      Avg Fitness : ${stats.avg_fitness}</br>
      Max score : ${stats.max_score}</br>
    ` + statsSpan.html());
  }

  function normalizeFitness(birds) {
    // Make score exponentially better?
    for (let i = 0; i < birds.length; i++) {
      birds[i].fitness = pow(birds[i].score, 2);
    }
  }

// Create the next generation
function nextGeneration() {
    resetGame();
    // Normalize the fitness values 0-1
    normalizeFitness(population.members);
    // Generate a new set of birds
    stats = population.evolve();
    printStats()
    activeBirds = population.members.slice();
    // Copy those birds to another array
  }
  
  

function displayScore(currentScore){
    output = [],
    numberInStr = currentScore.toString();

  for (var i = 0, len = numberInStr.length; i < len; i += 1) {
    output.push(+numberInStr.charAt(i));
  }

  output.forEach((digit, index) => {
    image(digitsImage[digit], width / 2 - (scoreW * (output.length - index * 2)) / 2, 100, scoreW, scoreH);
  });
}
