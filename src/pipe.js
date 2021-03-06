class Pipe {
    constructor() {
        this.spacing=125;
        this.top = random((height - 55) / 2);
        this.bottom = this.top+this.spacing;
        this.pos= random
        this.x = width;
        this.w = 50;
        this.speed = 2;
        this.hasHit = false;
        this.flag=0;
    }

    show() {
        fill(255);
        if (this.hasHit) {
            image(pipeTopHasHit, this.x, 0, this.w, this.top);
            image(pipeBottomHasHit, this.x, this.bottom, this.w, height);
        } else {
            image(pipeTop, this.x, 0, this.w, this.top);
            image(pipeBottom, this.x, this.bottom, this.w, height);
        }
        
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {

        if (this.x < -this.w)
            return true;
        else
            return false;
    }
    score(){
        if(this.flag==0){
            if(this.x<bird.x){
            this.flag=1;
            return true;    
            }
            
    }
    return false;
    }

    hit(bird, height) {

        if (bird.y < this.top || bird.y > (this.bottom))
            if (bird.x > this.x && bird.x < this.x + this.w) {
                // console.log(bird.y);
                // console.log(height);
                // console.log(this.bottom);
                this.hasHit = true;
                return true;
            }
        this.hasHit = false;
        return false;
    }

}