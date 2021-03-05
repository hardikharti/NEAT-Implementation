// class Specie
//     Attributes
//         rep = member
//         members = []
//     Methods -
//         addMember -> arg -> member if dist < threshold add to specie
//         changeRep -> change rep to a different member in members
//         normalizeFitness -> total fitness and member.fitness /= totalfitness
//         killMembers -> n -> removes bottom n members
//         nextGen -> n -> return array of members formed through crossover and mutation of existing members

// class member
//     fitness
//     genome
let InputN = 2;
let OutputN = 1;
class Specie {
    constructor(rep) {
        this.representative = rep;
        this.members = [rep];
        this.threshold=3;
        this.matingPool=[];
        this.generation=0;
        // this.startGen = gen
        this.avgFitness = 0;
        this.maxFitness = -Infinity;
        this.bestMember = undefined;
        this.currMaxFitness = -Infinity;
        this.currBestMember = undefined;
        this.totalFitness = 0;
        this.stagnantGens = 0;
    }
    addMember(member){
         if(this.representative.genome.distance(member.genome)<this.threshold){
            this.members.push(member);
            return true;
        }
        return false;
    }

    changeRep() {
        //picking random element
        var randomRep = this.members[Math.floor(Math.random() * this.members.length)];

        //making sure the element isn't the current representative
        while (randomRep == this.representative) {
            randomRep = this.members[Math.floor(Math.random() * this.members.length)];
        }

        //setting representative to the randomly picked randomRep
        this.representative = randomRep;
    }

    setAvgFitness(){
        let sum = 0
        for(let member of this.members){
            sum += member.fitness;
        }
        this.totalFitness = sum;
        this.avgFitness = sum/(this.members.length==0?1:this.members.length);
    }

    killMembers(n) {
        // this.sortmembers()
        // if (n > this.members.length) {
        //     console.log("make sure n is less than or equal to the number of members in the species");
        //     return;
        // }
        // while (n > 0) {
        //     this.members.pop();
        //     n--;
        // }
        if(this.members.length <= 2)return;
        let total = this.members.length/2;
        for(let i = this.members.length-1;i > total;i--)
            this.members.splice(i,1);
    }
    normalizefitness(){
        let totalfitness=0;
        this.members.forEach((member)=>{
            totalfitness+=member.fitness;
        })
        this.members.forEach((member)=>{
            member.fitness/=totalfitness;
        })
    }
    nextGen(n){
        this.normalizefitness();
        this.fillmatingpool();
        let children = [];
        for(let i=0; i<n; i++){
            let first = this.selectMember();
            let second = this.selectMember();
            if (first.fitness>second.fitness){
                children.push(first.crossover(second));
            }
            else{
                children.push(second.crossover(first));
            }
        }
        this.generation++;
        return children;
    }
    fillmatingpool(){
        this.matingPool.splice(0, this.matingPool.length);
        this.members.forEach((member, memberIndex)=>{
            let n =member.fitness*100;
            let i =0;
            while(i<n){
                this.matingPool.push(memberIndex);
                i++;
            }
        })
    }
    selectMember(){
       let random = Math.floor(Math.random() * this.matingPool.length);
       return this.members[this.matingPool[random]]
    }

    sortmembers(){
        this.members.sort(function(a, b) {
            return b.fitness - a.fitness;
          });
          this.currMaxFitness = this.members[0].fitness;
          this.currBestMember = this.members[0];
          if(this.members[0].fitness > this.maxFitness){
              this.bestMember = this.members[0];
              this.maxFitness = this.members[0].fitness;
              this.stagnantGens = 0;
          }
          else{
              this.stagnantGens++;
          }
    }
}