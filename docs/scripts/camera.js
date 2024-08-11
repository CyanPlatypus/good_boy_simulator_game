class Camera{

    // Note that x,y for camera are in the centre unlike in other objects
    // that have x,y in top left corner.
    constructor(x, y, width, height, worldCollider){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.worldCollider = worldCollider;

        this.deltaX = 0;
        this.deltaY = 0;
    }

    follow(objectToFollow){
        var attemptedX = this.x + this.deltaX + (objectToFollow.x - this.x);// to make is smooth / 10.0;
        var attemptedY = this.y + this.deltaY + (objectToFollow.y - this.y);// to make it smooth / 10.0;

        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        const leftWorldCoordinate = this.worldCollider.x;
        const rightWorldCoordinate = this.worldCollider.x + this.worldCollider.width;
        const topWorldCoordinate = this.worldCollider.y;
        const bottomtWorldCoordinate = this.worldCollider.y + this.worldCollider.height;

        this.x = this.getCoordinateOfTheCenterWithinBorders(attemptedX, halfWidth, leftWorldCoordinate, rightWorldCoordinate);
        this.y = this.getCoordinateOfTheCenterWithinBorders(attemptedY, halfHeight, topWorldCoordinate, bottomtWorldCoordinate);
    }

    getCoordinateOfTheCenterWithinBorders(
        attemptedCoordinateOfTheCenter,
        distanceFromCenterToSide,
        minBorder,
        maxBorder){
        const attemptedMinSide = attemptedCoordinateOfTheCenter - distanceFromCenterToSide;
        const attemptedMaxSide = attemptedCoordinateOfTheCenter + distanceFromCenterToSide;
        
        if(attemptedMinSide < minBorder){
            return minBorder + distanceFromCenterToSide;
        }

        if(attemptedMaxSide > maxBorder){
            return maxBorder - distanceFromCenterToSide;
        }

        return attemptedCoordinateOfTheCenter;
    }

}
