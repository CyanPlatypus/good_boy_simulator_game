class Player {

    constructor(
        idleRightAnimator,
        idleLeftAnimator,
        goRightAnimator,
        goLeftAnimator,
        fallRightAnimator,
        fallLeftAnimator,
        parallaxValue,
        x, y, z,
        speed,
        fallAcceleration,
        collider,
        sceneObjects){
        this.idleRightAnimator = idleRightAnimator;
        this.idleLeftAnimator = idleLeftAnimator;
        this.goRightAnimator = goRightAnimator;
        this.goLeftAnimator = goLeftAnimator;
        this.fallRightAnimator = fallRightAnimator;
        this.fallLeftAnimator = fallLeftAnimator;
        this.animator = this.idleRightAnimator;

        this.parallaxValue = parallaxValue;
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed;
        this.fallAcceleration = fallAcceleration;
        this.velocityX = 0;
        this.velocityY = 0;
        this.collider = collider;

        this.objectColliders = sceneObjects.filter(o => o.collider !== undefined).map(o => o.collider);

        this.state = PlayerStateType.Idle;
        this.faceDirection = PlayerFaceDirectionType.Right;
    }

    act(input){
        let [attemptedDeltaX, attemptedDeltaY] = this.getInputVelocity(input);
        [attemptedDeltaX, attemptedDeltaY] = this.addGravityVelocity(attemptedDeltaX, attemptedDeltaY);
        [this.velocityX, this.velocityY] = this.getAllowedVelocity(attemptedDeltaX, attemptedDeltaY);

        this.x += this.velocityX;
        this.y += this.velocityY;
        this.collider.move(this.x, this.y);

        const oldState = this.state;
        const oldfaceDirection = this.faceDirection;

        if(this.velocityX > 0){
            this.faceDirection = PlayerFaceDirectionType.Right;
        }
        else if (this.velocityX < 0){
            this.faceDirection = PlayerFaceDirectionType.Left;
        }


        // fall
        if (this.velocityY > 0){
            this.state = PlayerStateType.Fall;
        }
        // jump
        else if (this.velocityY < 0){
            this.state = PlayerStateType.Jump;
        }
        // go right or left
        else if(this.velocityX != 0){
            this.state = PlayerStateType.Walk;
        }
        // idle
        else{
            this.state = PlayerStateType.Idle;
        }

        if(this.state === PlayerStateType.Fall){
            this.animator = this.faceDirection === PlayerFaceDirectionType.Right
                ? this.fallRightAnimator : this.fallLeftAnimator; 
        }
        else if (this.state === PlayerStateType.Walk){
            this.animator = this.faceDirection === PlayerFaceDirectionType.Right
            ? this.goRightAnimator : this.goLeftAnimator; 
        }
        else if (this.state === PlayerStateType.Idle){
            this.animator = this.faceDirection === PlayerFaceDirectionType.Right
            ? this.idleRightAnimator : this.idleLeftAnimator; 
        }

        if(oldState != this.state || oldfaceDirection != this.faceDirection){
            this.animator.startWithFirstFrame = true;
        }
    }

    getAttemptedCoordinates(input){
        if(this.state === PlayerStateType.FallLeft || this.state === PlayerStateType.FallRight){
            const fallY = this.y + this.fallSpeed;
            return [this.x, fallY];
        }

        if(input === InputType.Right){
            const moveForward = this.x + this.speed;
            return [moveForward, this.y];
        }

        if(input === InputType.Left){
            const moveBackward = this.x - this.speed;
            return [moveBackward, this.y];
        }

        return [0, 0];
    }

    getInputVelocity(input){
        if(input === InputType.Right){
            return [this.speed, this.velocityY];
        }

        if(input === InputType.Left){
            return [-this.speed, this.velocityY];
        }

        return [0, this.velocityY];
    }

    addGravityVelocity(attemptedVelocityX, attemptedVelocityY){
        const fallY = attemptedVelocityY + this.fallAcceleration;
        return [attemptedVelocityX, fallY];
    }

    getAllowedVelocity(attemptedVelocityX, attemptedVelocityY){
        for (const collider of this.objectColliders){
            const isColliding = this.isColliding(attemptedVelocityX, attemptedVelocityY, collider);
            if (!isColliding){
                continue;
            }
            [attemptedVelocityX, attemptedVelocityY] = this.getAllowedVelocityWithCollider(
                attemptedVelocityX, attemptedVelocityY, collider);
        }
        return [attemptedVelocityX, attemptedVelocityY];
    }

    isColliding(attemptedVelocityX, attemptedVelocityY, collider){
        const attemptedX = this.x + attemptedVelocityX;
        const attemptedY = this.y + attemptedVelocityY;
        const rightSide = attemptedX + this.collider.width;
        const leftSide = attemptedX;
        const top = attemptedY;
        const bottom = attemptedY + this.collider.height;

        const intersectsSides = this.isBetween(rightSide, collider.leftSide, collider.rightSide)
            ||  this.isBetween(leftSide, collider.leftSide, collider.rightSide);
        const intersectsTopOrBottom = this.isBetween(bottom, collider.top, collider.bottom)
            || this.isBetween(top, collider.top, collider.bottom);
        return intersectsSides && intersectsTopOrBottom;
    }

    isBetween(target, from, to){
        return from <= target && target <= to;
    }

    getAllowedVelocityWithCollider(attemptedVelocityX, attemptedVelocityY, collider){
        const attemptedX = this.x + attemptedVelocityX;
        const attemptedY = this.y + attemptedVelocityY;
        const rightSide = attemptedX + this.collider.width;
        const leftSide = attemptedX;
        const top = attemptedY;
        const bottom = attemptedY + this.collider.height;

        const crossedLeftSide = this.collider.rightSide <= collider.leftSide && collider.leftSide <= rightSide;
        if(crossedLeftSide){
            return [collider.leftSide - this.collider.width - this.x, attemptedVelocityY];
        }

        const crossedRightSide = leftSide <= collider.rightSide && collider.rightSide <= this.collider.leftSide;
        if(crossedRightSide){
            return [collider.rightSide - this.x, attemptedVelocityY];
        }

        const crossedTop = this.collider.bottom <= collider.top && collider.top <= bottom;
        if(crossedTop){
            return [attemptedVelocityX, collider.top - this.collider.height - this.y];
        }

        const crossedBottom = top <= collider.bottom && collider.bottom <= this.collider.top;
        if(crossedBottom){
            return [attemptedVelocityX, collider.bottom - this.y];
        }

        return [attemptedVelocityX, attemptedVelocityY];
    }
}

const PlayerFaceDirectionType = Object.freeze({
    Right: Symbol("Right"),
    Left: Symbol("Left")
});

const PlayerStateType = Object.freeze({
    Idle: Symbol("Idle"),
    Walk: Symbol("Walk"),
    Fall: Symbol("Fall"),
    Jump: Symbol("Jump")
});

const InputType = Object.freeze({
    No: Symbol("No"),
    Right: Symbol("Right"),
    Left: Symbol("Left")
});