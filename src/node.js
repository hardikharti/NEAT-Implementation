// Node class
class Node{
  //Add all attributes from paper
  constructor(id,layer,type){
    this.id = id;
    this.type=type;
    this.layer = layer;
    this.output = undefined;
  }
//Make a copy function that returns a deep copy of the object
  deepCopy(type){
    var dCopy=new Node(this.id, this.layer,type);
    return dCopy;
  }
}
