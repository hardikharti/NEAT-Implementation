// Node class
class Node{
  //Add all attributes from paper
  constructor(type){
    this.type=type;
  }
//Make a copy function that returns a deep copy of the object
  deepCopy(type){
    var dCopy=new Node(type);
    return dCopy;
  }
}
