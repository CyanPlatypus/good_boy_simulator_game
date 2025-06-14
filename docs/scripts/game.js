class Game {

    constructor(){
        this.delta = 3;
        this.imageScale = 2;

        this.sceneObjects = [];
        this.populateSceneObjects();
    }

    populateSceneObjects(){
        var imgC = new Image();
        imgC.src = 'images/scene/sky.png';
        var o = new StaticObject(
            imgC,
            0,
            0,
            0,
            0
        );
        this.sceneObjects.push(o);

        var imgC = new Image();
        imgC.src = 'images/scene/back_cloud.png';
        var o = new StaticObject(
            imgC,
            0.1,
            0,
            0,
            0
        );
        this.sceneObjects.push(o);

        imgC = new Image();
        imgC.src = 'images/scene/front_cloud.png';
        var o = new StaticObject(
            imgC,
            0.2,
            0,
            0,
            0
        );
        this.sceneObjects.push(o);

        imgC = new Image();
        imgC.src = 'images/scene/wheel.png';
        var o = new StaticObject(
            imgC,
            0.9,
            0,
            0,
            3
        );
        this.sceneObjects.push(o);

        imgC = new Image();
        imgC.src = 'images/scene/pier.png';
        const roadCollider = new Collider(0, 297, 1700, 100);
        var o = new StaticObject(
            imgC,
            1,
            0,
            0,
            9,
            new Map([
                [RoleType.Collidable, new CollidableRole(roadCollider)]
            ])
        );
        this.sceneObjects.push(o);

        imgC = new Image();
        imgC.src = 'images/scene/foreground_grass.png';
        var o = new StaticObject(
            imgC,
            1.3,
            0,
            0,
            3
        );
        this.sceneObjects.push(o);

        imgC = new Image();
        imgC.src = 'images/doggo/idle_right_doggo.png';
        var playerIdleRightAnimator = new LoopAnimator(imgC, 19, 400);
        imgC = new Image();
        imgC.src = 'images/doggo/idle_left_doggo.png';
        var playerIdleLeftAnimator = new LoopAnimator(imgC, 19, 400);
        imgC = new Image();
        imgC.src = 'images/doggo/walk_right_doggo.png';
        var playerGoRightAnimator = new LoopAnimator(imgC, 19, 200);
        imgC = new Image();
        imgC.src = 'images/doggo/walk_left_doggo.png';
        var playerGoLeftAnimator = new LoopAnimator(imgC, 19, 200);
        imgC = new Image();
        imgC.src = 'images/doggo/fall_right_doggo.png';
        var playerFallRight = new LoopAnimator(imgC, 19, 200);
        imgC = new Image();
        imgC.src = 'images/doggo/fall_left_doggo.png';
        var playerFallLeft = new LoopAnimator(imgC, 19, 200);
        imgC = new Image();
        imgC.src = 'images/doggo/jump_right_doggo.png';
        var playerJumpRight = new LoopAnimator(imgC, 19, 200);
        imgC = new Image();
        imgC.src = 'images/doggo/jump_left_doggo.png';
        var playerJumpLeft = new LoopAnimator(imgC, 19, 200);
        imgC = new Image();
        imgC.src = 'images/doggo/pickup_right_doggo.png';
        var playerPickupRight = new LoopAnimator(imgC, 19, 400, true);
        imgC = new Image();
        imgC.src = 'images/doggo/pickup_left_doggo.png';
        var playerPickupLeft = new LoopAnimator(imgC, 19, 400, true);


        const playerCollider = new Collider(250, 10, 19 * this.imageScale, 14 * this.imageScale);

        this.player = new Player(
            playerIdleRightAnimator,
            playerIdleLeftAnimator,
            playerGoRightAnimator,
            playerGoLeftAnimator,
            playerFallRight,
            playerFallLeft,
            playerJumpRight,
            playerJumpLeft,
            playerPickupRight,
            playerPickupLeft,
            1, // ParallaxValue
            250, // x
            10, // y
            10, // z
            this.delta,
            0.3,
            7,
            playerCollider,
            this.sceneObjects,
            keyboardController
        );
        this.sceneObjects.push(this.player);

        imgC = new Image();
        imgC.src = 'images/items/ball_highlighted.png';
        const ballInteractiveCollider = new Collider(800, 285, 12 * this.imageScale, 12 * this.imageScale);
        //todo: update ball image
        const interactibleRole = new CollectableItemRole(imgC, ballInteractiveCollider, this, imgC);
        imgC = new Image();
        imgC.src = 'images/items/ball.png';
        var ball = new StaticObject(
            imgC,
            1,
            ballInteractiveCollider.x,
            ballInteractiveCollider.y,
            8,
            new Map([
                [RoleType.Interactable, interactibleRole]
            ])
        );
        this.sceneObjects.push(ball);
    }

    removeObject(objectToRemove){
        const index = this.sceneObjects.indexOf(objectToRemove);
        if (index > -1) {
            this.sceneObjects.splice(index, 1);
        }
    }
}