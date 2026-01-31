class StaticObject {
    constructor(view, parallaxValue, x, y, z, roleMap){
        this.view = view;
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
    constructor(collider, game, collidableBehaviours){
        this.collider = collider;
        this.game = game;
        this.isCollidable = true;
        this.collidableBehaviours = collidableBehaviours ? collidableBehaviours : [];

        for (const collidableBehaviour of this.collidableBehaviours){
            collidableBehaviour.setRole(this);
        }
    }

    setActor(actor){
        this.actor = actor;
    }

    processCollision(collisionInfo){
        if(!this.isCollidable){
            return PlayerCollisionResultType.Nothing;
        }

        for (const collidableBehaviour of this.collidableBehaviours){
            const result = collidableBehaviour.processCollision(collisionInfo);
            if (result){
                return result;
            }
        }
        return PlayerCollisionResultType.Collided;
    }

    act(){
        for (const collidableBehaviour of this.collidableBehaviours){
            collidableBehaviour.act();
        }
    }
}

class KillableFromTheTopBehaviour {
    constructor( gettingKilledAnimation){
        this.gettingKilledAnimation = gettingKilledAnimation;
    }

    setRole(role){
        this.role = role;
    }

    processCollision(collisionInfo){
        if(collisionInfo.crossedTop){
            this.role.isCollidable = false;
            this.role.actor.view = this.gettingKilledAnimation;
            return PlayerCollisionResultType.JumpBoosted;
        }
    }

    act(){
        // todo: just delete collider, no need for entirely removing an object (when gettingKilledAnimation is finished)
        // if (this.role.actor.view == this.gettingKilledAnimation
        //     && this.gettingKilledAnimation.isFinishedAnimation){
        //     this.role.game.removeObject(this.role.actor);
        // }
    }
}

class SideDamageBehaviour {
    constructor(attackAnimation){
        this.attackAnimation = attackAnimation;
    }

    setRole(role){
        this.role = role;
    }

    processCollision(collisionInfo){
        if(collisionInfo.crossedLeftSide || collisionInfo.crossedRightSide){
            this.attackAnimation.startWithFirstFrame = true;
            this.role.actor.view = this.attackAnimation;
            return PlayerCollisionResultType.Damaged;
        }
    }

    act(){
        if (this.role.actor.view == this.attackAnimation
            && this.attackAnimation.isFinishedAnimation){
            this.role.actor.idleView.startWithFirstFrame = true;
            this.role.actor.view = this.role.actor.idleView;
        }
    }
}

class InteractibleRole {
    constructor(highlightedView, collider, game){
        this.highlightedView = highlightedView;
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
            this.actor.view = this.highlightedView;
        }
        else{
            this.actor.view = this.actor.idleView;
        }
    }
}

// todo refactor
class CollectableItemRole extends InteractibleRole {

    constructor(highlightedView, collider, game, carryableImage){
        super(highlightedView, collider, game);
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
