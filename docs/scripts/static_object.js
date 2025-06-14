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
    constructor(collider){
        this.collider = collider;
    }

    setActor(actor){
        this.actor = actor;
    }

    act(){}
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
