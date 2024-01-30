class LoopAnimator{

    PrepareFirstFrame(){
        this.SourceImageX = 0;
        this.SourceImageY = 0;
    }

    PrepareNextFrame(){
        if (this.SourceImageX + this.FrameWidth < this.Image.width){
            this.SourceImageX += this.FrameWidth;
            this.SourceImageY = 0;
        }
        else {
            this.PrepareFirstFrame();
        }
    }

    constructor(image, frameWidth, msBetweenFrames){
        this.Image = image;

        this.PrepareFirstFrame();

        this.Height = 70;//Tmp until we load images properly. Before they're loaded image.height is 0
        this.Width = frameWidth;

        this.FrameWidth = frameWidth;

        this.StartWithFirstFrame = true;
        this.PreviousFrameAt = 0;
        this.MsBetweenFrames = msBetweenFrames;
    }

    PrepareFrame(){

        if (this.StartWithFirstFrame){

            this.PrepareFirstFrame();
            this.StartWithFirstFrame = false;
            
            this.PreviousFrameAt = performance.now()
            return;
        }

        const now = performance.now();
        const sincePreviousFrame = now - this.PreviousFrameAt;

        // We assume frames won't be skipped
        if (sincePreviousFrame >= this.MsBetweenFrames){

            this.PrepareNextFrame();
            this.PreviousFrameAt = now;
            return;
        }
    }
}