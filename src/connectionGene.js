//ConnectionGene class
class connectionGene {
  //Add all attributes from paper
  constructor(from, to, w, inno, enbl) {
    this.out = to;
    this.in = from;
    this.weight = w;
    this.enabled = enbl;
    this.innovationNo = inno;
  }
  //helper function to mutate
  mutateCgWeight() {
    var changeProb = Math.random(1);

    if (changeProb < 0.1) {
      this.weight = random(-1, 1);
    } else {
      var plusOrMinus = [-1, 1][(Math.random() * 2) | 0];
      var changeValue = (Math.random() * 0.1);

      this.weight = this.weight + (plusOrMinus * changeValue * this.weight);

      if (this.weight > 1) {
        this.weight = 1;
      }
      if (this.weight < -1) {
        this.weight = -1;
      }
    }
  }
  //Make a copy function that returns a deep copy of the object
  deepCopy(from, to) {
    var dCopy = new connectionGene(
      from,
      to,
      this.weight,
      this.innovationNo,
      this.enabled
    );

    return dCopy;
  }
}
