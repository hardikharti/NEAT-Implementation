let population;
let population_size = 100;
let input_size = 2;
let output_size = 1;
let innv = new InnovNum()

let x = -100,y = 0,h = 600,w = 1000,scal = 1;

let bestMember;

function setup(){
    createCanvas(800,600); 
    let members = []
    for(let i = 0;i < population_size;i++){
        members[i] = new Member()
    }
    population = new Population(input_size,output_size,members.slice(),innv);
}

function draw(){
    background(50);
    if(bestMember)
        drawGenome(bestMember.genome,x,y,h,w,scal);
    else if(population.bestMember)
        drawGenome(population.bestMember.genome,x,y,h,w,scal);
}
 
function keyPressed(){
    if(keyCode === 69){
        for(let i = 0;i < 50;i++)
            evolve();
    }
    return false;
}

function evolve(){
    for(let member of population.members){
        member.update();
    }
    population.evolve();
}

class Member{
    constructor(genome){
        // this.id = id;
        this.states = [[0,0],[0,1],[1,0],[1,1]];
        this.fitness = 0;
        this.score = 0; 
        this.genome = genome;
    }
    update(){
        for(let i = 0;i < 4;i++){
            let input = this.genome.predict(this.states[i])[0];
            this.score += 1 - Math.pow((this.states[i][0]^this.states[i][1])*1.0 - input,2);
        }
        this.fitness = this.score;
    }
    crossover(member){
        let child = new Member();
        if(member.fitness < this.fitness)
			child.genome = this.genome.crossover(member.genome);
		else
			child.genome = member.genome.crossover(this.genome);
        child.genome.mutate();
        return child;
    }
    deepCopy(){
        return new Member(this.genome.deepCopy());
    }
}
