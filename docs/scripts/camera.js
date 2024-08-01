class Camera{

    constructor(X, Y, width, height){
        this.X = X;
        this.Y = Y;
        this.width = width;
        this.height = height;

        this.deltaX = 0;
        this.deltaY = 0;
    }

    follow(objectToFollow){
        this.deltaX = (objectToFollow.X - this.X);// to make is smooth / 10.0;
        this.deltaY = (objectToFollow.Y - this.Y);// to make it smooth / 10.0;

        this.X += this.deltaX;
        this.Y += this.deltaY;
    }
}
