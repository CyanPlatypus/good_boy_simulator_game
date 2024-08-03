class Camera{

    // Note that x,y for camera are in the centre unlike in other objects
    // that have x,y in top left corner.
    constructor(X, Y, width, height, worldCollider){
        this.X = X;
        this.Y = Y;
        this.width = width;
        this.height = height;

        this.worldCollider = worldCollider;

        this.deltaX = 0;
        this.deltaY = 0;
    }

    follow(objectToFollow){
        var attemptedX = this.X + this.deltaX + (objectToFollow.X - this.X);// to make is smooth / 10.0;
        var attemptedY = this.Y + this.deltaY + (objectToFollow.Y - this.Y);// to make it smooth / 10.0;

        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;
        const leftWorldCoordinate = this.worldCollider.x;
        const rightWorldCoordinate = this.worldCollider.x + this.worldCollider.width;
        const topWorldCoordinate = this.worldCollider.y;
        const bottomtWorldCoordinate = this.worldCollider.y + this.worldCollider.height;

        this.X = this.getCoordinateOfTheCenterWithinBorders(attemptedX, halfWidth, leftWorldCoordinate, rightWorldCoordinate);
        this.Y = this.getCoordinateOfTheCenterWithinBorders(attemptedY, halfHeight, topWorldCoordinate, bottomtWorldCoordinate);
    }

    getCoordinateOfTheCenterWithinBorders(
        attemptedCoordinateOfTheCenter,
        distanceFromCenterToSide,
        minBorder,
        maxBorder){
        const attemptedMinSide = attemptedCoordinateOfTheCenter - distanceFromCenterToSide;
        const attemptedMaxSide = attemptedCoordinateOfTheCenter + distanceFromCenterToSide;
        
        if(attemptedMinSide < minBorder){
            return minBorder + 1 + distanceFromCenterToSide;
        }

        if(attemptedMaxSide > maxBorder){
            return maxBorder - 1 - distanceFromCenterToSide;
        }

        return attemptedCoordinateOfTheCenter;
    }

}
