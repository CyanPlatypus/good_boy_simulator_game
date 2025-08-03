class StaticObject {
    constructor(image, parallaxValue, x, y, z, roleMap){
        this.view = image;
        this.idleView = this.view;
        this.parallaxValue = parallaxValue;
        this.x = x;
        this.y = y;
        this.z = z;

        this.roleMap = roleMap;

        if(this.roleMap !== undefined){
            for (const role of this.roleMap.values()){
                role.setActor(this);
            }
        }
    }

    hasRole(roleType){
        if(this.roleMap === undefined){
            return false;
        }
        return this.roleMap.has(roleType);
    }

    getRole(roleType){
        return this.roleMap.get(roleType);
    }

    act(){
        if(this.roleMap === undefined){
            return;
        }

        for (const role of this.roleMap.values()){
            role.act();
        }
    }
}

class PhysicallyCollidableRole {
    constructor(collider, game){
        this.collider = collider;
        this.game = game;
    }

    setActor(actor){
        this.actor = actor;
    }

    processCollision(collisionInfo){
        return PlayerCollisionResultType.Collided;
    }

    act(){}
}

class KillableFromTheTop extends PhysicallyCollidableRole {
    constructor(collider, game, gettingKilledAnimation){
        super(collider, game);
        this.gettingKilledAnimation = gettingKilledAnimation;
        this.isCollidable = true;
    }

    processCollision(collisionInfo){
        if(!this.isCollidable){
            return PlayerCollisionResultType.Nothing;
        }
        if(collisionInfo.crossedTop){
            this.isCollidable = false;
            this.actor.view = this.gettingKilledAnimation;
            return PlayerCollisionResultType.JumpBoosted;
        }
        else{
            return super.processCollision(collisionInfo);
        }
    }

    act(){
        // delete itself ftom the world when gettingKilledAnimation is finished
        if (this.gettingKilledAnimation.isFinishedAnimation){
            this.game.removeObject(this.actor);
        }
    }
}

// todo change PhysicallyCollidableRole to work with a list of collidable extensions
class Enemy extends KillableFromTheTop {
    constructor(collider, game, gettingKilledAnimation, attackAnimation){
        super(collider, game, gettingKilledAnimation);
        this.attackAnimation = attackAnimation;
    }

    processCollision(collisionInfo){
        if(!this.isCollidable){
            return PlayerCollisionResultType.Nothing;
        }
        if(collisionInfo.crossedLeftSide || collisionInfo.crossedRightSide){
            this.attackAnimation.startWithFirstFrame = true;
            this.actor.view = this.attackAnimation;
            return PlayerCollisionResultType.Damaged;
        }
        else{
            return super.processCollision(collisionInfo);
        }
    }

    act(){
        if (this.attackAnimation.isFinishedAnimation){
            this.actor.idleView.startWithFirstFrame = true;
            this.actor.view = this.actor.idleView;
        }
        super.act();
    }
}


class InteractibleRole {
    constructor(highlightedImage, collider, game){
        this.highlightedImage = highlightedImage;
        this.collider = collider;
        this.game = game;

        this.isHighlighted = false;
    }

    setActor(actor){
        this.actor = actor;
        //this.actorRegularImage = actor.view;
    }

    act(){
        this.isHighlighted = this.game.player.canInteract(this.collider);

        if (this.isHighlighted){
            this.actor.view = this.highlightedImage;
        }
        else{
            this.actor.view = this.actor.idleView;
        }
    }
}

// todo refactor
class CollectableItemRole extends InteractibleRole {

    constructor(highlightedImage, collider, game, carryableImage){
        super(highlightedImage, collider, game);
        this.carryableImage = carryableImage;
    }

    processInteraction(){
        this.game.removeObject(this.actor);
    }
}

class Person{
    interact(){
        //display dialog
    }
}


const RoleType = Object.freeze({
    Collidable: Symbol("Collidable"),
    Interactable: Symbol("Interactable")
});
