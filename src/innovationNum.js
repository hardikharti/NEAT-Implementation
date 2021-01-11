class InnovNum{
    constructor()
    {
        this.innovations = 0;
        this.innovations_lookup = {}; // KEY -> from_node_id VALUE -> {KEY->to_node_id VALUE->innovation_no}
    }

    createConnection(from,to,weight,enabled){
        if(this.getInnovNum(from,to) != -1)
            return new connectionGene(from,to,weight,this.getInnovNum(from,to),enabled);
            
        if(!(from.id in this.innovations_lookup))
            this.innovations_lookup[from.id] = {};
        this.innovations_lookup[from.id][to.id] = this.innovations;
        const cg = new connectionGene(from,to,weight,this.innovations,enabled);
        this.innovations++;
        return cg;
    }

    getInnovNum(from,to){
        if(from.id in this.innovations_lookup && to.id in this.innovations_lookup[from.id])
            return this.innovations_lookup[from.id][to.id];
        return -1;
    }

}
