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

    isColliding(collider){
        return this.isIntersecting(collider) || collider.isIntersecting(this);
    }

    isIntersecting(collider){
        const intersectsSides = this.isBetween(this.rightSide, collider.leftSide, collider.rightSide)
            ||  this.isBetween(this.leftSide, collider.leftSide, collider.rightSide);
        const intersectsTopOrBottom = this.isBetween(this.bottom, collider.top, collider.bottom)
            || this.isBetween(this.top, collider.top, collider.bottom);
        return intersectsSides && intersectsTopOrBottom;
    }

    isBetween(target, from, to){
        return from <= target && target <= to;
    }
}
