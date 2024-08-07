class Player {

    constructor(
        idleRightAnimator,
        idleLeftAnimator,
        goRightAnimator,
        goLeftAnimator,
        parallaxValue,
        x, y, z,
        speed){
        this.idleRightAnimator = idleRightAnimator;
        this.idleLeftAnimator = idleLeftAnimator;
        this.goRightAnimator = goRightAnimator;
        this.goLeftAnimator = goLeftAnimator;
        this.animator = this.idleRightAnimator;

        this.parallaxValue = parallaxValue;
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed; 

        this.state = PlayerStateType.IdleRight;
    }

    act(input){
        if(input === InputType.Right){

            if(this.state != PlayerStateType.GoRight){
                this.goRightAnimator.startWithFirstFrame = true;
            }
            this.state = PlayerStateType.GoRight;
            this.animator = this.goRightAnimator;
            this.x += this.speed;

            return;
        }

        if(input === InputType.Left){

            if(this.state != PlayerStateType.GoLeft){
                this.goLeftAnimator.startWithFirstFrame = true;
            }
            this.state = PlayerStateType.GoLeft;
            this.animator = this.goLeftAnimator;
            this.x -= this.speed;

            return;
        }

        if(input === InputType.No){

            if(this.state === PlayerStateType.GoRight){
                this.state = PlayerStateType.IdleRight;
                this.idleRightAnimator.startWithFirstFrame = true;
                this.animator = this.idleRightAnimator;

                return;
            }

            if(this.state === PlayerStateType.GoLeft){
                this.state = PlayerStateType.IdleLeft;
                this.idleLeftAnimator.startWithFirstFrame = true;
                this.animator = this.idleLeftAnimator;

                return;
            }
        }
    }
}

const PlayerStateType = Object.freeze({
    IdleRight: Symbol("IdleRight"),
    IdleLeft: Symbol("IdleLeft"),
    GoRight: Symbol("GoRight"),
    GoLeft: Symbol("GoLeft")
});

const InputType = Object.freeze({
    No: Symbol("No"),
    Right: Symbol("Right"),
    Left: Symbol("Left")
});