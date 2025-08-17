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
        damagedRightAnimator,
        damagedLeftAnimator,
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
        this.damagedRightAnimator = damagedRightAnimator; 
        this.damagedLeftAnimator = damagedLeftAnimator; 
        this.view = this.idleRightAnimator;

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
        this.finishTakingDamageIfPossible();
        this.interact();
        this.move();
        this.updateState();
    }

    finishTakingDamageIfPossible(){
        if (this.damagingObjectRole !== undefined && this.view.isFinishedAnimation){
            this.damagingObjectRole = undefined;
        }
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
            || this.state === PlayerStateType.Damaged
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
        if(this.view.isFinishedAnimation){
            this.item = this.interactableObjectRole.carryableImage;
            this.interactableObjectRole = undefined;
        }
    }
    
    move(){
        let canMove = this.stateAllowsMovement();

        if (!canMove){
            this.velocityX = 0;
            this.velocityY = 0;
            return;
        }

        let [attemptedDeltaX, attemptedDeltaY] = [0, this.velocityY];

        if(this.stateAllowsMovementInput()){
            [attemptedDeltaX, attemptedDeltaY] = this.getInputVelocity();
        }

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

    stateAllowsMovementInput(){
        // we assume that stateAllowsMovement() was already checked and it's true
        if (this.state === PlayerStateType.Damaged){
            return false;
        }
        return true;
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

        // damaged
        if(this.damagingObjectRole !== undefined){
            this.state = PlayerStateType.Damaged;
        }
        // fall
        else if (this.velocityY > 0){
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
            this.view = this.faceDirection === PlayerFaceDirectionType.Right
                ? this.fallRightAnimator : this.fallLeftAnimator; 
        }
        else if(this.state === PlayerStateType.Jump){
            this.view = this.faceDirection === PlayerFaceDirectionType.Right
                ? this.jumpRightAnimator : this.jumpLeftAnimator; 
        }
        else if (this.state === PlayerStateType.Walk){
            this.view = this.faceDirection === PlayerFaceDirectionType.Right
            ? this.goRightAnimator : this.goLeftAnimator; 
        }
        else if (this.state == PlayerStateType.Interact){
            this.view = this.faceDirection === PlayerFaceDirectionType.Right
            ? this.pickupRightAnimator : this.pickupLeftAnimator; 
        }
        else if (this.state === PlayerStateType.Damaged){
            this.faceDirection = oldfaceDirection;
            this.view = this.faceDirection === PlayerFaceDirectionType.Right
            ? this.damagedRightAnimator : this.damagedLeftAnimator;
        }
        else if (this.state === PlayerStateType.Idle){
            this.view = this.faceDirection === PlayerFaceDirectionType.Right
            ? this.idleRightAnimator : this.idleLeftAnimator; 
        }

        if(oldState != this.state || oldfaceDirection != this.faceDirection){
            this.view.startWithFirstFrame = true;
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
        const objectCollidableRoles = this.sceneObjects
            .filter(o => o != this && o.hasRole(RoleType.Collidable))
            .map(o => o.getRole(RoleType.Collidable));

        for (const colliderRole of objectCollidableRoles){
            const collisionInfo = this.getPredictedCollisionInfo(attemptedVelocityX, attemptedVelocityY, colliderRole.collider);
            if (!collisionInfo.isColliding){
                continue;
            }

            const collisionProcessResult = colliderRole.processCollision(collisionInfo);

            if(collisionProcessResult == PlayerCollisionResultType.Collided){
                [attemptedVelocityX, attemptedVelocityY] = this.getAllowedVelocityWithCollider(
                    colliderRole.collider, collisionInfo, attemptedVelocityX, attemptedVelocityY);
            }
            else if(collisionProcessResult == PlayerCollisionResultType.JumpBoosted){
                [attemptedVelocityX, attemptedVelocityY] = [attemptedVelocityX, -5]; // todo create a const with proper name 
            }
            else if(collisionProcessResult == PlayerCollisionResultType.Damaged){
                [attemptedVelocityX, attemptedVelocityY] = [ attemptedVelocityX * -10, -7]; // todo create a const with proper name
                this.damagingObjectRole = colliderRole;
            }
        }
        return [attemptedVelocityX, attemptedVelocityY];
    }

    getPredictedCollisionInfo(attemptedVelocityX, attemptedVelocityY, collider){
        const attemptedX = this.x + attemptedVelocityX;
        const attemptedY = this.y + attemptedVelocityY;
        const attemptedCollider = new Collider(attemptedX, attemptedY, this.collider.width, this.collider.height);

        return collider.getPredictedCollisionInfo(this.collider, attemptedCollider);
    }

    isColliding(attemptedVelocityX, attemptedVelocityY, collider){
        const attemptedX = this.x + attemptedVelocityX;
        const attemptedY = this.y + attemptedVelocityY;

        return collider.isColliding(new Collider(attemptedX, attemptedY, this.collider.width, this.collider.height));
    }

    getAllowedVelocityWithCollider(collider, collisionInfo, attemptedVelocityX, attemptedVelocityY){
        if(collisionInfo.crossedLeftSide){
            return [collider.leftSide - this.collider.width - this.x, attemptedVelocityY];
        }
        if(collisionInfo.crossedRightSide){
            return [collider.rightSide - this.x, attemptedVelocityY];
        }
        if(collisionInfo.crossedTop){
            return [attemptedVelocityX, collider.top - this.collider.height - this.y];
        }
        if(collisionInfo.crossedBottom){
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
    Interact: Symbol("Interact"),
    Damaged: Symbol("Damaged")
});

const InputType = Object.freeze({
    No: Symbol("No"),
    Right: Symbol("Right"),
    Left: Symbol("Left")
});

const PlayerCollisionResultType = Object.freeze({
    Nothing: Symbol("Nothing"),
    Collided: Symbol("Collided"),
    Damaged: Symbol("Damaged"),
    JumpBoosted: Symbol("JumpBoosted")
});