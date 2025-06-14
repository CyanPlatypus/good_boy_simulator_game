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
        else if(this.isSingleLoop){
            this.isFinishedAnimation = true;
        }
        else {
            this.selectFirstFrame();
        }
    }

    constructor(image, frameWidth, msBetweenFrames, isSingleLoop = false){
        this.image = image;

        this.selectFirstFrame();

        // todo pass image info and scale. image.height isn't enough. image.height * imageScale 
        this.height = 28;//Tmp until we load images properly. Before they're loaded image.height is 0
        this.width = frameWidth;

        this.frameWidth = frameWidth;

        this.startWithFirstFrame = true;
        this.previousFrameAt = 0;
        this.msBetweenFrames = msBetweenFrames;
        this.isSingleLoop = isSingleLoop;
        this.isFinishedAnimation = false;
    }

    prepareFrame(){

        if (this.startWithFirstFrame){
            if(this.isSingleLoop === true){
                this.isFinishedAnimation = false;
            }

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