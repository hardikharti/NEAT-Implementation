class Genome {
  constructor(input_size, output_size, innv) {
    this.input_size = input_size;
    this.output_size = output_size;
    this.node_size = 0;
    this.cg_size = 0;
    this.layer_size = 0;
    this.nodes = []; //INDEX -> node_id VALUE -> node
    this.biases = []; //INDEX -> layer VALUE -> bias
    this.cgs = []; //VALUE -> connectionGene
    this.node_adj = []; //INDEX -> node_id  VALUE -> Array of innovation no.s, the node is connected
    this.layers = []; //INDEX -> layer VALUE -> Array of node_ids
    this.cg_map = {}; //KEY -> innovation_no. VALUE -> connectionGene_index in this.cgs
    this.innov = innv;
  }

  // <=====HELPERS=====> //

  addNode(node) {
    this.nodes[node.id] = node;

    this.node_adj[node.id] = [];

    if (!this.layers[node.layer]) this.layers[node.layer] = [];

    this.layers[node.layer].push(node.id);

    this.node_size++;
    this.layer_size = Math.max(this.layer_size, node.layer + 1);
  }

  addConnection(cg) {
    let i;
    for (i = this.cgs.length - 1; i >= 0; i--) {
      if (this.cgs[i].innov_no > cg.innov_no) {
        this.cgs[i + 1] = this.cgs[i];
        this.cg_map[this.cgs[i + 1].innov_no] = i + 1;
      } else break;
    }
    this.cgs[i + 1] = cg;

    this.cg_map[cg.innov_no] = i + 1;

    this.node_adj[cg.in.id].push(cg.innov_no);
    this.node_adj[cg.out.id].push(cg.innov_no);

    this.cg_size++;
  }

  getCg(innov) {
    if (!(innov in this.cg_map)) return false;
    let i = this.cg_map[innov];
    return this.cgs[i];
  }

  shiftLayer(layer) {
    for (let i = this.layer_size - 1; i >= layer; i--) {
      this.layers[i + 1] = [];
      for (let id of this.layers[i]) {
        this.nodes[id].layer++;
        this.layers[i + 1].push(id);
      }
      if (i == this.layer_size - 1) continue;
      this.biases[i + 1] = this.biases[i];
    }
    this.layers[layer] = [];
    this.biases[layer] = 2 * Math.random() - 1;
    this.layer_size++;
  }

  // <====INITIAL CONNECTIONS====> //
  createInitialNodes() {
    for (let i = 0; i < this.input_size; i++)
      this.addNode(new Node(i, 0, "input"));
    for (let i = this.input_size; i < this.input_size + this.output_size; i++)
      this.addNode(new Node(i, 1, "output"));

    this.biases[0] = 2 * Math.random() - 1;
    this.layer_size = 2;
  }

  createDenseGenome() {
    for (let i = 0; i < this.input_size; i++) {
      for (
        let j = this.input_size;
        j < this.input_size + this.output_size;
        j++
      ) {
        const cg = this.innov.createConnection(
          this.nodes[i],
          this.nodes[j],
          2 * Math.random() - 1,
          true
        );
        this.addConnection(cg);
      }
    }
  }

  fullConnected(){
    let rem_nodes=this.node_size;
    let total_connection=0;
    for(let i=0; i<this.layers.length; i++){
      rem_nodes=rem_nodes-this.layers[i].length;
      total_connection+=rem_nodes*this.layers[i].length;
    }
    return total_connection==this.cg_size;
  }

  connectedNodes(node1, node2){
    for(let i=0; i<this.cgs.length; i++){
      if((this.cgs[i].in==node1 && this.cgs[i].out==node2) 
      || (this.cgs[i].in==node2 && this.cgs[i].out==node1)){
        return true;
      }
    }
    return false;
  }
  // <====MUTATION====> //
  mutate() {}

  mutateWeight() {
    var changeProb = Math.random(1);
    if (changeProb <= 0.8) {
      for (var i = 0; i < this.cgs.length; i++) {
        this.cgs[i].mutateCgWeight();
      }
    }
  }

  mutateNode() {
    let prob=Math.random(1);
    if(prob<=0.01){
      let connectionIndex = Math.floor(Math.random() * this.cgs.length);
      let connectionPicked = this.cgs[connectionIndex];
      connectionPicked.enabled=false;
      if(connectionPicked.out.layer-connectionPicked.in.layer==1)
       this.shiftLayer(connectionPicked.in.layer+1);
      let newNode = new Node(this.nodes.length, connectionPicked.in.layer + 1, "hidden");
      this.addNode(newNode);
      let connection1=this.innov.createConnection(connectionPicked.in, newNode, 1, true);
      let connection2=this.innov.createConnection(newNode, connectionPicked.out, connectionPicked.weight, true );
      this.addConnection(connection1);
      this.addConnection(connection2);
    }
  }

  mutateCg() {
    let prob = Math.random(1);
    if(prob<=0.05){
      if(this.fullConnected())
        return;
      while(true){
        var node1=Math.floor(Math.random()*this.node_size)
        var node2=Math.floor(Math.random()*this.node_size)
        if(this.nodes[node1].layer!=this.nodes[node2].layer && !this.connectedNodes(this.nodes[node1], this.nodes[node2])){
          break;
        }
      }
      
      // switch the values if node1 has higher layer than node 2
      if (this.nodes[node1].layer > this.nodes[node2].layer) {
        let temp = node1;
        node1 = node2;
        node2 = temp;
      }
      let newConnection=this.innov.createConnection(this.nodes[node1], this.nodes[node2], 2*Math.random()-1, true);
      this.addConnection(newConnection);
    }
  }
}
