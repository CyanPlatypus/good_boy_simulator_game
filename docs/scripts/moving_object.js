class MovingObject extends StaticObject {
    constructor(
        view, parallaxValue, 
        x, y, z,
        width,
        velocityX,
        worldHeight,
        worldWidth,
        roleMap
    ){
        super(view, parallaxValue, x, y, z, roleMap);
        this.idleView = this.view;
        this.width = width;
        this.velocityX = velocityX;
        this.worldHeight = worldHeight;
        this.worldWidth = worldWidth;
    }

    act(){
        this.x += this.velocityX;

        // wrap around
        if (this.x > this.worldWidth) {
            this.x -=  this.width;
        } else if (this.x + this.width < 0) {
            this.x += this.width;
        }
    }
}