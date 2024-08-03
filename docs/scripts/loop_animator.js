class LoopAnimator{

    selectFirstFrame(){
        this.sourceImageX = 0;
        this.sourceImageY = 0;
    }

    selectNextFrame(){
        if (this.sourceImageX + this.frameWidth < this.image.width){
            this.sourceImageX += this.frameWidth;
            this.sourceImageY = 0;
        }
        else {
            this.selectFirstFrame();
        }
    }

    constructor(image, frameWidth, msBetweenFrames){
        this.image = image;

        this.selectFirstFrame();

        this.height = 70;//Tmp until we load images properly. Before they're loaded image.height is 0
        this.width = frameWidth;

        this.frameWidth = frameWidth;

        this.startWithFirstFrame = true;
        this.previousFrameAt = 0;
        this.msBetweenFrames = msBetweenFrames;
    }

    prepareFrame(){

        if (this.startWithFirstFrame){

            this.selectFirstFrame();
            this.startWithFirstFrame = false;
            
            this.previousFrameAt = performance.now()
            return;
        }

        const now = performance.now();
        const sincePreviousFrame = now - this.previousFrameAt;

        // We assume frames won't be skipped
        if (sincePreviousFrame >= this.msBetweenFrames){

            this.selectNextFrame();
            this.previousFrameAt = now;
            return;
        }
    }
}