class Player {

    constructor(
        idleRightAnimator,
        idleLeftAnimator,
        goRightAnimator,
        goLeftAnimator,
        fallRightAnimator,
        fallLeftAnimator,
        jumpRightAnimator,
        jumpLeftAnimator,
        pickupRightAnimator,
        pickupLeftAnimator,
        parallaxValue,
        x, y, z,
        speed,
        fallAcceleration,
        jumpAcceleration,
        collider,
        sceneObjects,
        inputController){

        this.idleRightAnimator = idleRightAnimator;
        this.idleLeftAnimator = idleLeftAnimator;
        this.goRightAnimator = goRightAnimator;
        this.goLeftAnimator = goLeftAnimator;
        this.fallRightAnimator = fallRightAnimator;
        this.fallLeftAnimator = fallLeftAnimator;
        this.jumpRightAnimator = jumpRightAnimator;
        this.jumpLeftAnimator = jumpLeftAnimator;
        this.pickupRightAnimator = pickupRightAnimator;
        this.pickupLeftAnimator = pickupLeftAnimator;
        this.animator = this.idleRightAnimator;

        this.parallaxValue = parallaxValue;
        this.x = x;
        this.y = y;
        this.z = z;
        this.speed = speed;
        this.fallAcceleration = fallAcceleration;
        this.jumpAcceleration = jumpAcceleration;
        this.velocityX = 0;
        this.velocityY = 0;
        this.collider = collider;

        this.sceneObjects = sceneObjects;

        this.inputController = inputController;

        this.state = PlayerStateType.Idle;
        this.faceDirection = PlayerFaceDirectionType.Right;
        this.interactableObjectRole = undefined;
    }

    act(){
        this.interact();
        this.move();
        this.updateState();
    }

    move(){
        let canMove = this.stateAllowsMovement();

        if (!canMove){
            this.velocityX = 0;
            this.velocityY = 0;
            return;
        }

        let [attemptedDeltaX, attemptedDeltaY] = this.getInputVelocity();
        [attemptedDeltaX, attemptedDeltaY] = this.addGravityVelocity(attemptedDeltaX, attemptedDeltaY);
        [this.velocityX, this.velocityY] = this.getAllowedVelocity(attemptedDeltaX, attemptedDeltaY);

        this.x += this.velocityX;
        this.y += this.velocityY;
        this.collider.move(this.x, this.y);
    }

    stateAllowsMovement(){
        if (this.state === PlayerStateType.Interact 
            || this.interactableObjectRole !== undefined){
            return false;
        }
        return true;
    }

    interact(){
        this.finishInteractionIfPossible();

        let canInteract = this.stateAllowsInteraction();

        if (!canInteract){
            return;
        }

        if(keyboardController.isInteractPressed() === false){
            return;
        }

        const interactable = this.getInteractable();

        if (interactable === undefined){
            return;
        }

        this.interactWithItem(interactable);
    }

    canInteract(interactableCollider){
        let canInteract = this.stateAllowsInteraction();

        if (!canInteract){
            return false;
        }

        return this.collider.isColliding(interactableCollider);
    }

    stateAllowsInteraction(){
        if (this.state === PlayerStateType.Jump
            || this.state === PlayerStateType.Fall
            || this.interactableObjectRole !== undefined){
            return false;
        }
        return true;
    }

    getInteractable(){
        return this.sceneObjects
        .filter(o => o != this && o.hasRole(RoleType.Interactable) && o.getRole(RoleType.Interactable).isHighlighted)
        .find(o => true);
    }
    
    interactWithItem(interactable){
        let interactableRole = interactable.getRole(RoleType.Interactable)
        if (interactableRole instanceof CollectableItemRole){
            this.collectItem(interactableRole);
        }
    }

    collectItem(interactableRole){
        this.interactableObjectRole = interactableRole;
        interactableRole.processInteraction();
    }

    finishInteractionIfPossible(){
        if (this.interactableObjectRole instanceof CollectableItemRole){
            this.finishPickupIfPossible();
        }
    }

    finishPickupIfPossible(){
        if(this.animator.isFinishedAnimation){
            this.item = this.interactableObjectRole.carryableImage;
            this.interactableObjectRole = undefined;
        }
    }

    updateState(){
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
        // interact
        else if(this.interactableObjectRole !== undefined
            //&& oldState != this.state.Interact
        ){
            this.state = PlayerStateType.Interact;
        }
        // idle
        else{
            this.state = PlayerStateType.Idle;
        }

        if(this.state === PlayerStateType.Fall){
            this.animator = this.faceDirection === PlayerFaceDirectionType.Right
                ? this.fallRightAnimator : this.fallLeftAnimator; 
        }
        else if(this.state === PlayerStateType.Jump){
            this.animator = this.faceDirection === PlayerFaceDirectionType.Right
                ? this.jumpRightAnimator : this.jumpLeftAnimator; 
        }
        else if (this.state === PlayerStateType.Walk){
            this.animator = this.faceDirection === PlayerFaceDirectionType.Right
            ? this.goRightAnimator : this.goLeftAnimator; 
        }
        else if (this.state == PlayerStateType.Interact){
            this.animator = this.faceDirection === PlayerFaceDirectionType.Right
            ? this.pickupRightAnimator : this.pickupLeftAnimator; 
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

    getInputVelocity(){
        // We keep velocityY for jumping
        let [attemptedVelocityX, attemptedVelocityY] = [0, this.velocityY];

        if(keyboardController.isGoRightPressed() === true){
            attemptedVelocityX += this.speed;
        }
    
        if(keyboardController.isGoLeftPressed() === true){
            attemptedVelocityX -= this.speed;
        }
    
        if(keyboardController.isJumpPressed() === true
            && this.state !== PlayerStateType.Jump
            && this.state !== PlayerStateType.Fall){
            attemptedVelocityY -= this.jumpAcceleration;
        }

        return [attemptedVelocityX, attemptedVelocityY];
    }

    addGravityVelocity(attemptedVelocityX, attemptedVelocityY){
        const fallY = attemptedVelocityY + this.fallAcceleration;
        return [attemptedVelocityX, fallY];
    }

    getAllowedVelocity(attemptedVelocityX, attemptedVelocityY){
        const objectColliders = this.sceneObjects
        .filter(o => o != this && o.hasRole(RoleType.Collidable))
        .map(o => o.getRole(RoleType.Collidable).collider);

        for (const collider of objectColliders){
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

        return collider.isColliding(new Collider(attemptedX, attemptedY, this.collider.width, this.collider.height));
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
    Jump: Symbol("Jump"),
    Interact: Symbol("Interact")
});

const InputType = Object.freeze({
    No: Symbol("No"),
    Right: Symbol("Right"),
    Left: Symbol("Left")
});