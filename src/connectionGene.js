//ConnectionGene class
class connectionGene {
    //Add all attributes from paper
    constructor(from, to, w, inno,enbl) {
        this.out = from;
        this.in = to;
        this.weight = w;
        this.enabled = enbl;
        this.innovationNo = inno;
        

    }
    //Make a copy function that returns a deep copy of the object
    deepCopy(from, to) {
        var dCopy = new connectionGene(from, to, this.weight, this.innovationNo, this.enabled);
        
        return dCopy;
    }
}
