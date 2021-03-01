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

class Specie {
    constructor(rep) {
        this.representative = rep;
        this.members = [rep];
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
        if (n > this.members.length) {
            console.log("make sure n is less than or equal to the number of members in the species");
            return;
        }
        while (n > 0) {
            members.pop();
            n--;
        }
    }
}