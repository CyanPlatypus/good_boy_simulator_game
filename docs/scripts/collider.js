class Collider{

    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.setComputed();
    }

    setComputed(){
        this.rightSide = this.x + this.width;
        this.leftSide = this.x;
        this.top = this.y;
        this.bottom = this.y + this.height;
    }

    move(newX, newY){
        this.x = newX;
        this.y = newY;

        this.setComputed();
    }
}
