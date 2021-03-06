class Member{
    constructor(id){
        this.id = id;
        this.fitness;
        this.genome= new Genome(InputN, OutputN, id);
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
}