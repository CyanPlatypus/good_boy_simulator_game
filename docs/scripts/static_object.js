class StaticObject {
    constructor(image, parallaxValue, x, y, z, roleMap){
        this.image = image;
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

class CollidableRole {
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

class KillableFromTheTop extends CollidableRole {
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
            this.actor.animator = this.gettingKilledAnimation; // todo solve issue with image and animator
            return PlayerCollisionResultType.JumpBoosted;
        }
        else{
            return PlayerCollisionResultType.Collided;
        }
    }

    act(){
        // delete itself ftom the world when gettingKilledAnimation is finished
        if (this.gettingKilledAnimation.isFinishedAnimation){
            this.game.removeObject(this.actor);
        }
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
        this.actorRegularImage = actor.image;
    }

    act(){
        this.isHighlighted = this.game.player.canInteract(this.collider);

        if (this.isHighlighted){
            this.actor.image = this.highlightedImage;
        }
        else{
            this.actor.image = this.actorRegularImage;
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
