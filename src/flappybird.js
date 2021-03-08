class Bird{
    constructor(genome = undefined) {
        this.y = height / 2;
        this.x = 64;
        this.r = 20
        this.icon = birdSprite;
        this.icon.resize(this.r*2, this.r*2)
        this.width = 50;
        this.height = 50;
        this.gravity=0.6;
        this.velocity=0;
        this.lift = -10;
        this.hit=false;
        
        this.genome = genome
    
        // Score is how many frames it's been alive
        this.score = 0;
        // Fitness is normalized version of score
        this.fitness = 0;
        
    }
    show(){
        // this.icon.resize(this.r*2, this.r*2)
        image(this.icon, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    update(){
        this.velocity+=this.gravity;
        this.y+=this.velocity;
        if(this.y>height){
            this.y=height;
            this.velocity=0;
        }
        if(this.y<0){
            this.y=0;
            this.velocity=0;
        }
        this.score++;
    }
    up(){
        this.velocity= this.lift;
    }

    bottomTop() {
        // Bird dies when hits bottom?
        return (this.y > height || this.y < 0);
    }

    think(pipes) {
        // First find the closest pipe
        let closest = null;
        let record = Infinity;
        for (let i = 0; i < pipes.length; i++) {
          let diff = pipes[i].x+pipes[i].w - this.x;
          if (diff > 0 && diff < record) {
            record = diff;
            closest = pipes[i];
          }
        }
    
        if (closest != null) {
          // Now create the inputs to the neural network
          let inputs = [];
          // x position of closest pipe
          inputs[0] = map(closest.x, this.x, width, 0, 1);
          // top of closest pipe opening
          inputs[1] = map(closest.top, 0, height, 0, 1);
          // bottom of closest pipe opening
          inputs[2] = map(closest.bottom, 0, height, 0, 1);
          // bird's y position
          inputs[3] = map(this.y, 0, height, 0, 1);
          // bird's y velocity
          inputs[4] = map(this.velocity, -5, 5, 0, 1);
    
          // Get the outputs from the network
          let action = this.genome.predict(inputs);
          // Decide to jump or not!
          if (action[1] > action[0]) {
            this.up();
          }
        }
      }

    crossover(member){
        let child = new Bird();
        if(member.fitness < this.fitness)
			child.genome = this.genome.crossover(member.genome);
		else
			child.genome = member.genome.crossover(this.genome);
        child.genome.mutate();
        return child;
    }
    deepCopy(){
        return new Bird(this.genome.deepCopy());
    }

}