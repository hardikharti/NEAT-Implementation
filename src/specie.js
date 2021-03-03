// class Specie
//     Attributes
//         rep = member
//         members = []
//     Methods -
//         addClient -> arg -> member if dist < threshold add to specie
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
    }
    addClient(member){
         if(this.representative.genome.distance(member)<this.threshold){
            this.members.push(member);
        }
    }

    changeRep() {
        //picking random element
        var randomRep = members[Math.floor(Math.random() * members.length)];

        //making sure the element isn't the current representative
        while (randomRep == representative) {
            randomRep = members[Math.floor(Math.random() * members.length)];
        }

        //setting representative to the randomly picked randomRep
        representative = randomRep;
    }

    killMembers(n) {
        this.sortmembers()
        if (n > this.members.length) {
            console.log("make sure n is less than or equal to the number of members in the species");
            return;
        }
        while (n > 0) {
            members.pop();
            n--;
        }
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
    }
}