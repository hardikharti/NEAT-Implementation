class Genome{
    constructor(input_size,output_size,neat){
        this.input_size = input_size;
        this.output_size = output_size;
        this.node_size = 0;
        this.cg_size = 0;
        this.layer_size = 0;
        this.nodes = []; //INDEX -> node_id VALUE -> node 
        this.biases = [];//INDEX -> layer VALUE -> bias
        this.cgs = []; //VALUE -> connectionGene
        this.node_adj = []; //INDEX -> node_id  VALUE -> Array of innovation no.s, the node is connected
        this.layers = []; //INDEX -> layer VALUE -> Array of node_ids
        this.cg_map = {}; //KEY -> innovation_no. VALUE -> connectionGene_index in this.cgs
        this.innov = neat;
    }

    // <=====HELPERS=====> //

    addNode(node){
        this.nodes[node.id] = node;

        this.node_adj[node.id] = [];

        if(!this.layers[node.layer])
            this.layers[node.layer] = [];
            
        this.layers[node.layer].push(node.id);

        this.node_size++;
        this.layer_size = Math.max(this.layer_size,node.layer+1);
    }

    addConnection(cg){
        let i;
        for(i = this.cgs.length-1;i >= 0;i--){
            if(this.cgs[i].innov_no > cg.innov_no){
                this.cgs[i+1] = this.cgs[i];
                this.cg_map[this.cgs[i+1].innov_no] = i+1;
            }
            else break;
        }
        this.cgs[i+1] = cg;

        this.cg_map[cg.innov_no] = i+1;

        this.node_adj[cg.in.id].push(cg.innov_no);
        this.node_adj[cg.out.id].push(cg.innov_no);

        this.cg_size++;
    }

    getCg(innov){
        if(!(innov in this.cg_map))
            return false;
        let i = this.cg_map[innov];
        return this.cgs[i];
    }

    shiftLayer(layer){
        for(let i = this.layer_size-1;i >= layer;i--){
            this.layers[i+1] = [];
            for(let id of this.layers[i]){
                this.nodes[id].layer++;
                this.layers[i+1].push(id);
            }
            if(i == this.layer_size-1)continue;
            this.biases[i+1] = this.biases[i];
        }
        this.layers[layer] = [];
        this.biases[layer] = 2*Math.random()-1;
        this.layer_size++;
    }

    // <====INITIAL CONNECTIONS====> //
    createInitialNodes(){
        for(let i = 0;i < this.input_size;i++)
            this.addNode(new Node(i,0,'input'));
        for(let i = this.input_size;i < this.input_size + this.output_size;i++)
            this.addNode(new Node(i,1,'output'));

        this.biases[0] = 2*Math.random()-1;
        this.layer_size = 2;
    }

    createDenseGenome(){
        for(let i = 0;i < this.input_size;i++){
            for(let j = this.input_size;j < this.input_size+this.output_size;j++){
                const cg = this.innov.createConnection(this.nodes[i],this.nodes[j],2*Math.random()-1,true);
                this.addConnection(cg);
            }
        }
    }

    // <====MUTATION====> //
    mutate(){
        
    }

    mutateWeight(){
        
    }

    mutateNode(){
        
    }

    mutateCg(){ 
        
    }
}