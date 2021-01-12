let innov = new InnovNum();
let genome = new Genome(5,2,innov);
// let g2 = new Genome(5,2,innov);
// g2.createInitialNodes();
// g2.createDenseGenome()
genome.createInitialNodes();
genome.createDenseGenome();

let x = -100,y = 0,h = 600,w = 1000,scal = 1;

function setup(){
    createCanvas(800,600);
}

function draw(){
    background(0);
    drawGenome(genome,x,y,h,w,scal);
}

function drawGenome(g,tx=0,ty=0,h = 600,w = 800,scal=1){
    if(!(g instanceof Genome))return;
    //Calculate x y
    push();
    translate(tx,ty);
    scale(scal)
    let x_off = 0;
    let y_off = 0;
    let x_space = w/(g.layer_size+1);
    let node_xy = {};
    for(let i = 0;i < g.layer_size;i++){
        let y_space = h/(g.layers[i].length+1);
        for(let j = 0;j < g.layers[i].length;j++){
            let x = x_off+(i+1)*x_space;
            let y = y_off+(j+1)*y_space;
            node_xy[g.layers[i][j]] = [x,y];
        }
    }
    //draw connections
    for(let cg of g.cgs){
        if(cg.enabled)
            stroke(0,255,0);
        else
            stroke(255,0,0);
        let x1 = node_xy[cg.in.id][0], y1 = node_xy[cg.in.id][1];
        let x2 = node_xy[cg.out.id][0], y2 = node_xy[cg.out.id][1];
        line(x1,y1,x2,y2);
        fill(255);
        textSize(12);
        textAlign(CENTER);
        text(cg.weight.toFixed(2),(x1+x2)/2,(y1+y2)/2);
    }
    //draw nodes
    for(let i = 0;i < g.layer_size;i++){
        for(let j = 0;j < g.layers[i].length;j++){
            let x = node_xy[g.layers[i][j]][0];
            let y = node_xy[g.layers[i][j]][1];
            noStroke();
            fill(0,0,255);
            ellipse(x,y,40);
            fill(255);
            textSize(18);
            textAlign(CENTER);
            text(g.layers[i][j],x,y);
        }
    }
    pop(); 
}