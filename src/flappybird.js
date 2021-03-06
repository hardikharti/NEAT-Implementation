class Bird {
    constructor() {
        this.y = height / 2;
        this.x = 64;
        this.icon = birdSprite;
        this.width = 50;
        this.height = 50;
        this.gravity = 0.6;
        this.velocity = 0;
        this.lift = -10;
    }
    show() {
        image(this.icon, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        if (this.y > height) {
            this.y = height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
    up() {
        this.velocity = this.lift;
    }
}