class Population{
    constructor(input_size,output_size,members,innv,constants={}){
        this.members = members;
        this.population_size = members.length;
        this.input_size = input_size;
        this.output_size = output_size;
        this.innv = innv;
        this.species = [];
        this.initialPop();

        //STATS
        this.generation = 1;
        this.avgFitness = 0;
        this.totalFitness = 0;
        this.maxFitness = -Infinity;
        this.bestMember = undefined;
        this.currMaxFitness = -Infinity;
        this.currBestMember = undefined;

    }

    initialPop(){
        for(let member of this.members){
            member.genome = this.randomGenome();
        }
        // this.speciate();
    }

    randomGenome(){
        const g = new Genome(this.input_size,this.output_size,this.innv);
        g.createInitialNodes();
        g.createDenseGenome();
        g.mutate();
        return g
    }

    speciate(){
        for(let specie of this.species)
            specie.members = [];
        for(let member of this.members){
            let found = false;
            for(let specie of this.species){
                if(specie.addMember(member)){
                    found = true;
                    break;
                }
            }
            if(!found){
                this.species.push(new Specie(member,this.generation,this.innv));
            }
        }
        for(let i = this.species.length-1;i >= 0;i--){
            if(this.species[i].members.length == 0)
                this.species.splice(i,1);
        }
        // for(let specie of this.species){
        //     specie.changeRep();
        // }
    }

    evolve(){
        this.speciate();
        this.sortSpecies();
        this.killSpecies();
        this.setAvgFitness();
        this.setBestMember();
        // this.printStats();
        let stats = this.printStats()

        let children = [];

        // children.push(this.bestMember.copy()); //deepCopy and mutate the all time best member into next generation
        // children[0].genome.mutate();

        for(let specie of this.species){
            children.push(specie.bestMember.deepCopy());
            let n = Math.floor(specie.avgFitness / this.totalFitness * this.population_size) - 1;
            children = children.concat(specie.nextGen(n));
        }

        // while(children.length > this.population_size){
        //     children.pop();
        // }
        while(children.length < this.population_size){
            let child = this.species[0].nextGen(1)[0];
            children.push(child);
        }

        this.members = [];
        this.members = children.slice();
        this.generation++;
        // this.speciate();
        return stats;
    }

    sortSpecies(){
        for(let specie of this.species)
            specie.sortmembers();
        this.species.sort((a,b)=>{
            return b.MaxFitness - a.MaxFitness;
        });
    }

    killSpecies(){
        for(let specie of this.species){
            specie.normalizefitness();
            specie.killMembers(Math.floor(specie.members.length/2));
            specie.setAvgFitness()
        }
        this.setAvgFitness();
        let total = this.totalFitness;
        for(let i = this.species.length-1;i >= 0;i--){
            let n = this.species[i].avgFitness/total * this.population_size; 
            if((this.species[i].stagnantGens > 15 || n < 1) && this.species.length > 2){
                this.species.splice(i,1);
            }
        }
    }

    setAvgFitness(){
        let sum = 0;
        for(let specie of this.species){
            sum += specie.avgFitness;
        }
        this.totalFitness = sum;
        this.avgFitness = sum/(this.species.length == 0?1:this.species.length);
    }

    setBestMember(){
        this.currMaxFitness = this.species[0].currMaxFitness;
        this.currBestMember = this.species[0].members[0];
        if(this.currMaxFitness > this.maxFitness){
            this.maxFitness = this.currMaxFitness; 
            this.bestMember = this.currBestMember;
        }
    }

    printStats(n=1){
        if(this.generation%n && this.generation != 1)return;

        console.log(`\n<==== GENERATION : ${this.generation} ====>`);
        console.log(`Max Fitness : ${this.currMaxFitness}`);
        console.log(`Avg Fitness : ${this.avgFitness}`);
        console.log(`No of Species : ${this.species.length}`);
        console.log(`Max score : ${this.bestMember.score}`);

        return {
            gen : this.generation,
            species : this.species.length,
            avg_fitness : this.avgFitness,
            max_score : this.bestMember.score
        }
    }


    // <==== SERIALIZE ====> //
    saveMember(genome,fileName = 'best_member.json'){
        let content = JSON.stringify(genome);
        let a = document.createElement("a");
        let file = new Blob([content], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    
    async loadMember(fileName = 'best_member.json'){
        let res = await fetch(fileName);
        let json = await res.json();
        return this.deserialize(json);
    }

    deserialize(obj){
        const copyGenome = new Genome(obj.input_size,obj.output_size,this.innv);
        for(let node of obj.nodes){
            copyGenome.addNode(new Node(node.id,node.layer));
        }
        copyGenome.biases = obj.biases.slice();
        for (let cg of obj.cgs) {
            let from = copyGenome.nodes[cg.in.id];
            let to = copyGenome.nodes[cg.out.id];
            let copycg = new connectionGene(from,to,cg.weight,cg.innovationNo,cg.enabled);
            copyGenome.addConnection(copycg);
          }
        // for(let link of obj.links){
        //     let from = copyGenome.nodes[link.from.id];
        //     let to = copyGenome.nodes[link.to.id];
        //     let copyLink = new Link(from,to,link.weight,link.enabled,link.innov_no);
        //     copyGenome.addLink(copyLink);
        // }
        return copyGenome;
    }
}

function drawGenome(g, tx = 0, ty = 0, h = 600, w = 800, scal = 1) {
    if (!(g instanceof Genome)) return;
    //Calculate x y
    push();
    translate(tx, ty);
    scale(scal)
    let x_off = 0;
    let y_off = 0;
    let x_space = w / (g.layer_size + 1);
    let node_xy = {};
    for (let i = 0; i < g.layer_size; i++) {
        let y_space = h / (g.layers[i].length + 1);
        for (let j = 0; j < g.layers[i].length; j++) {
            let x = x_off + (i + 1) * x_space;
            let y = y_off + (j + 1) * y_space;
            node_xy[g.layers[i][j]] = [x, y];
        }
    }
    //draw connections
    for (let cg of g.cgs) {
        if (cg.enabled)
            stroke(0, 255, 0);
        else
            stroke(255, 0, 0);
        let x1 = node_xy[cg.in.id][0], y1 = node_xy[cg.in.id][1];
        let x2 = node_xy[cg.out.id][0], y2 = node_xy[cg.out.id][1];
        line(x1, y1, x2, y2);
        fill(255);
        textSize(12);
        textAlign(CENTER);
        text(cg.weight.toFixed(2), (x1 + x2) / 2, (y1 + y2) / 2);
    }
    //draw nodes
    for (let i = 0; i < g.layer_size; i++) {
        for (let j = 0; j < g.layers[i].length; j++) {
            let x = node_xy[g.layers[i][j]][0];
            let y = node_xy[g.layers[i][j]][1];
            noStroke();
            fill(0, 0, 255);
            ellipse(x, y, 40);
            fill(255);
            textSize(18);
            textAlign(CENTER);
            text(g.layers[i][j], x, y);
        }
    }
    pop();
}


/*
 * <====ORDER====>
 * 
 * SETUP
 *  random population
 *  speciate
 * 
 * EVOLVE
 *  calculate fitness
 *  sort species members
 *  species best member
 *  sort species based on max fitness
 *  species fitness sharing
 *  kill species members
 *  species average fitness
 *  kill species
 *  update population stats
 *  get children based on avg fitness of species
 *  set population members to children
 *  speciate
 */