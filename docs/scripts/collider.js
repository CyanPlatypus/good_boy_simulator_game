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

    getPredictedCollisionInfo(colliderBefore, colliderAfter){
        const isColliding = this.isColliding(colliderAfter);
        const crossedLeftSide = colliderBefore.rightSide <= this.leftSide && this.leftSide <= colliderAfter.rightSide;
        const crossedRightSide = colliderAfter.leftSide <= this.rightSide && this.rightSide <= colliderBefore.leftSide;
        const crossedTop = colliderBefore.bottom <= this.top && this.top <= colliderAfter.bottom;
        const crossedBottom = colliderAfter.top <= this.bottom && this.bottom <= colliderBefore.top;

        return new CollosionInfo(isColliding, crossedLeftSide, crossedRightSide, crossedTop, crossedBottom);
    }

    isBetween(target, from, to){
        return from < target && target < to;
    }
}

class CollosionInfo{
    constructor(isColliding, crossedLeftSide, crossedRightSide, crossedTop, crossedBottom){
        this.isColliding = isColliding;
        this.crossedLeftSide = crossedLeftSide;
        this.crossedRightSide = crossedRightSide;
        this.crossedTop = crossedTop;
        this.crossedBottom = crossedBottom;
    }
}
