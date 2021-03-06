class Pipe {
    constructor() {
        this.top = random((height - 55) / 2);
        this.bottom = random((height - 55) / 2);
        this.x = width;
        this.w = 50;
        this.speed = 2;
        this.hasHit = false;
    }

    show() {
        fill(255);
        if (this.hasHit) {
            image(pipeTopHasHit, this.x, 0, this.w, this.top);
            image(pipeBottomHasHit, this.x, height - this.bottom, this.w, this.bottom);
        } else {
            image(pipeTop, this.x, 0, this.w, this.top);
            image(pipeBottom, this.x, height - this.bottom, this.w, this.bottom);
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

    hit(bird, height) {

        if (bird.y < this.top || bird.y > (height - this.bottom))
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