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
      if (this.cgs[i].innovationNo > cg.innovationNo) {
        this.cgs[i + 1] = this.cgs[i];
        this.cg_map[this.cgs[i + 1].innovationNo] = i + 1;
      } else break;
    }
    this.cgs[i + 1] = cg;

    this.cg_map[cg.innovationNo] = i + 1;

    this.node_adj[cg.in.id].push(cg.innovationNo);
    this.node_adj[cg.out.id].push(cg.innovationNo);

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

  fullConnected() {
    let rem_nodes = this.node_size;
    let total_connection = 0;
    for (let i = 0; i < this.layers.length; i++) {
      rem_nodes = rem_nodes - this.layers[i].length;
      total_connection += rem_nodes * this.layers[i].length;
    }
    return total_connection == this.cg_size;
  }

  connectedNodes(node1, node2) {
    for (let i = 0; i < this.cgs.length; i++) {
      if ((this.cgs[i].in == node1 && this.cgs[i].out == node2)
        || (this.cgs[i].in == node2 && this.cgs[i].out == node1)) {
        return true;
      }
    }
    return false;
  }
  // <====MUTATION====> //
  mutate() {
    let mnr = Math.random(1);
    let mcgr = Math.random(1);
    this.mutateWeight();
    if (mnr <= 0.01) {
      this.mutateNode();
    }
    if (mcgr <= 0.05) {
      this.mutateCg();
    }
  }

  mutateWeight() {

    for (var i = 0; i < this.cgs.length; i++) {
      var changeProb = Math.random(1);
      if (changeProb <= 0.8) {
        this.cgs[i].mutateCgWeight();
      }
    }
  }

  mutateNode() {
    // let prob=Math.random(1);
    // if(prob<=0.01){
    let connectionIndex = Math.floor(Math.random() * this.cgs.length);
    let connectionPicked = this.cgs[connectionIndex];
    connectionPicked.enabled = false;
    if (connectionPicked.out.layer - connectionPicked.in.layer == 1)
      this.shiftLayer(connectionPicked.in.layer + 1);
    let newNode = new Node(this.nodes.length, connectionPicked.in.layer + 1, "hidden");
    this.addNode(newNode);
    let connection1 = this.innov.createConnection(connectionPicked.in, newNode, 1, true);
    let connection2 = this.innov.createConnection(newNode, connectionPicked.out, connectionPicked.weight, true);
    this.addConnection(connection1);
    this.addConnection(connection2);
    // }
  }

  mutateCg() {
    // let prob = Math.random(1);
    // if(prob<=0.05){
    if (this.fullConnected())
      return;
    while (true) {
      var node1 = Math.floor(Math.random() * this.node_size)
      var node2 = Math.floor(Math.random() * this.node_size)
      if (this.nodes[node1].layer != this.nodes[node2].layer && !this.connectedNodes(this.nodes[node1], this.nodes[node2])) {
        break;
      }
    }

    // switch the values if node1 has higher layer than node 2
    if (this.nodes[node1].layer > this.nodes[node2].layer) {
      let temp = node1;
      node1 = node2;
      node2 = temp;
    }
    let newConnection = this.innov.createConnection(this.nodes[node1], this.nodes[node2], 2 * Math.random() - 1, true);
    this.addConnection(newConnection);
    // }
  }

  // <====OUTPUT CALCULATION OF NEURAL NETWORK====> //
  predict(input) {
    let output = [];
    for (let i = 0; i < input.length; i++)
      this.nodes[i].output = input[i];

    for (let i = 1; i < this.layer_size - 1; i++) {
      for (let id of this.layers[i]) {
        this.getNodeOutput(id);
      }
    }
    for (let i = this.input_size; i < this.input_size + this.output_size; i++) {
      output.push(this.getNodeOutput(i));
    }
    for (let i = 0; i < this.node_size; i++)
      this.nodes[i].output = undefined;

    return output;
  }

  getNodeOutput(id) {
    let output = 0;
    for (let innov of this.node_adj[id]) {
      let cg = this.getCg(innov);
      if (cg.enabled && cg.out.id == id) {
        output += cg.weight * this.nodes[cg.in.id].output;
      }
    }
    output += this.biases[this.nodes[id].layer - 1];
    output = this.sigmoid(output);
    this.nodes[id].output = output;
    return output;
  }

  sigmoid(x) {
    return 1 / (1 + Math.exp(-4.9 * x));
  }

  relu(x) {
    return Math.max(0, x);
  }

  // <====GENOME AS OUTPUT OR PARAM====> //
  crossover(g2) {
    let childGenome = new Genome(this.input_size, this.output_size, this.innov);
    for (let node of this.nodes) {
      childGenome.addNode(node.deepCopy());
    }
    childGenome.biases = this.biases.slice();
    for (let cg1 of this.cgs) {
      let innov = cg1.innovationNo;
      let childcg;
      if (innov in g2.cg_map) { //matching genes
        let cg2 = g2.getCg(innov);
        if (Math.random() < 0.5) {
          let from = childGenome.nodes[cg1.in.id];
          let to = childGenome.nodes[cg1.out.id];
          childcg = cg1.deepCopy(from, to);
        }
        else {
          let from = childGenome.nodes[cg2.in.id];
          let to = childGenome.nodes[cg2.out.id];
          childcg = cg2.deepCopy(from, to);
        }
        //childcg.enabled = cg1.enabled; // safer operation

        if (!cg1.enabled || !cg2.enabled) { // <<UNCOMMENT THIS FOR EXACT PAPER IMPLEMENTAION!!>>
          if (Math.random() < 0.75)
            childcg.enabled = false;
          else
            childcg.enabled = true;
        }
      }
      else {
        let from = childGenome.nodes[cg1.in.id];
        let to = childGenome.nodes[cg1.out.id];
        childcg = cg1.deepCopy(from, to);
      }

      childGenome.addConnection(childcg);
    }
    return childGenome;
  }

  distance(other) {
    let i1 = 0, i2 = 0;
    let disjoint = 0, excess, weight_diff = 0, similar = 0;

    let g1 = this, g2 = other; //g1 -> genome with max innov g2 -> genome with min innov
    if (other.cg_size != 0)
      if (this.cg_size == 0 || this.cgs[this.cg_size - 1].innovationNo < other.cgs[other.cg_size - 1].innovationNo) {
        g1 = other;
        g2 = this;
      }

    while (i1 < g1.cg_size && i2 < g2.cg_size) {
      if (g1.cgs[i1].innovationNo == g2.cgs[i2].innovationNo) {
        weight_diff += Math.abs(g1.cgs[i1].weight - g2.cgs[i2].weight);
        similar++;
        i1++;
        i2++;
      }
      else if (g1.cgs[i1].innovationNo < g2.cgs[i2].innovationNo) {
        disjoint++;
        i1++;
      }
      else {
        disjoint++;
        i2++;
      }
    }

    excess = g1.cg_size - i1;
    weight_diff /= similar == 0 ? 1 : similar;
    let N = g2.cg_size - 20;
    N = Math.max(1, N);
    // console.log(excess,disjoint,weight_diff)
    // if(!similar)return 100;
    let species_dist = 1 * excess / N + 1 * disjoint / N + 0.5 * weight_diff; //δ = c1 * E / N + c2 * D / N + c3 * W
    return species_dist;

  }

  deepCopy() {
    const copyGenome = new Genome(this.input_size, this.output_size, this.innov);
    for (let node of this.nodes) {
      copyGenome.addNode(node.deepCopy());
    }
    copyGenome.biases = this.biases.slice();
    for (let cg of this.cgs) {
      let from = copyGenome.nodes[cg.in.id];
      let to = copyGenome.nodes[cg.out.id];
      let copycg = cg.deepCopy(from, to);
      copyGenome.addConnection(copycg);
    }
    return copyGenome;
  }
}
