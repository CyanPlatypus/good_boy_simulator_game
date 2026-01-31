class LoopAnimator {

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

    constructor(image, frameWidth, imageHeight, msBetweenFrames, isSingleLoop = false, isHorisontalTile = false){
       
        this.image = image;

        this.selectFirstFrame();

        this.height = imageHeight;
        this.width = frameWidth;
        this.frameWidth = frameWidth;

        this.isHorisontalTile = isHorisontalTile;

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

class ImageView {
    constructor(image, isHorisontalTile = false){
        this.image = image;
        this.isHorisontalTile = isHorisontalTile;
    }
}
