class StaticObject {
    constructor(image, parallaxValue, x, y, z, collider){
        this.image = image;
        this.parallaxValue = parallaxValue;
        this.x = x;
        this.y = y;
        this.z = z;

        if(collider != undefined){
            this.collider = collider;
        }
    }
}