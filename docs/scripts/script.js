window.addEventListener("load", onLoad);

var canvas;
var context;

var sceneObjects = [];

var delta = 3;
const imageScale = 2;

var keyboardController;
var player;
var camera;

function onKeyChange(event, keyPressed){

    if (event.defaultPrevented) {
        // Do nothing if event already handled
        return; 
    }

    var consumed = keyboardController.consumeKey(event.code, keyPressed);

    // Consume the event so it doesn't get handled twice
    if (consumed){
        event.preventDefault();
    }
}

function onKeyDown(event) {
    onKeyChange(event, true);
}

function onKeyUp(event) {
    onKeyChange(event, false);
}


// window.addEventListener("resize", onResize);

// function onResize(){
// 	var positionInfo = document.querySelector('.pixel').getBoundingClientRect();
// 	var width = positionInfo.width;

// 	var card = document.querySelector('.card');
// 	card.style.width = width + "px";
// }


function onLoad() {

    keyboardController = new KeyboardController();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
 
    var imgC = new Image();
    imgC.src = 'images/scene/sky.png';
    var o = new StaticObject(
        imgC,
        0,
        0,
        0,
        0
    );
    sceneObjects.push(o);

    var imgC = new Image();
    imgC.src = 'images/scene/back_cloud.png';
    var o = new StaticObject(
        imgC,
        0.1,
        0,
        0,
        0
    );
    sceneObjects.push(o);

    imgC = new Image();
    imgC.src = 'images/scene/front_cloud.png';
    var o = new StaticObject(
        imgC,
        0.2,
        0,
        0,
        0
    );
    sceneObjects.push(o);

    imgC = new Image();
    imgC.src = 'images/scene/wheel.png';
    var o = new StaticObject(
        imgC,
        0.9,
        0,
        0,
        3
    );
    sceneObjects.push(o);

    imgC = new Image();
    imgC.src = 'images/scene/pier.png';
    const roadCollider = new Collider(0, 297, 1700, 100);
    var o = new StaticObject(
        imgC,
        1,
        0,
        0,
        9,
        roadCollider
    );
    sceneObjects.push(o);

    imgC = new Image();
    imgC.src = 'images/scene/foreground_grass.png';
    var o = new StaticObject(
        imgC,
        1.3,
        0,
        0,
        3
    );
    sceneObjects.push(o);

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
    var playerjumpRight = new LoopAnimator(imgC, 19, 200);
    imgC = new Image();
    imgC.src = 'images/doggo/jump_left_doggo.png';
    var playerJumpLeft = new LoopAnimator(imgC, 19, 200);

    const playerCollider = new Collider(250, 10, 19 * imageScale, 14 * imageScale);

    player = new Player(
        playerIdleRightAnimator,
        playerIdleLeftAnimator,
        playerGoRightAnimator,
        playerGoLeftAnimator,
        playerFallRight, // tmp, update to fall
        playerFallLeft, // tmp, update to fall
        playerjumpRight, // tmp, update to jump
        playerJumpLeft, // tmp, update to jump
        1, // ParallaxValue
        250, // x
        10, // y
        10, // z
        delta,
        0.3,
        8,
        playerCollider,
        sceneObjects,
        keyboardController
    );
    sceneObjects.push(player);
 
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;

    const worldCollider = new Collider(0, 0, 2000, canvas.height);
    camera = new Camera(100, 370, canvas.width, canvas.height, worldCollider);

    //onPlayClick();
    canvas.addEventListener('click', onPlayClick);
}

function updateState() {
    player.act();
    camera.follow(player);
}

function drawObjects() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    sceneObjects.forEach(o => {

        var image;

        var sourceImageX;
        var sourceImageY;

        var sourceW;
        var sourceH;

        const x = (o.x - (camera.x - camera.width/2.0)) * (o.parallaxValue);
        const y = (o.y - (camera.y - camera.height/2.0));// * (o.ParallaxValue);

        if(o.animator !== undefined){
            o.animator.prepareFrame();

            image = o.animator.image;

            sourceImageX = o.animator.sourceImageX;
            sourceImageY = o.animator.sourceImageY;
 
            sourceW = o.animator.width;
            sourceH = o.animator.height;
        }
        else{
            image = o.image;

            sourceImageX = 0;
            sourceImageY = 0;

            sourceW = o.image.width;
            sourceH = o.image.height;
        }

        w = sourceW * imageScale;
        h = sourceH * imageScale;
 
        context.drawImage(image, sourceImageX, sourceImageY, sourceW, sourceH, x, y, w, h);
    });
}

function drawDebug(){

    const xInScene = (camera.x - (camera.x - camera.width/2.0));
    const yInScene = (camera.y - (camera.y - camera.height/2.0));

    drawFilledRectangle(xInScene-2, yInScene-2, 4, 4, "black");

    drawRectangle(
        xInScene - camera.width/2.0,
        yInScene  - camera.height/2.0,
        camera.width,
        camera.height,
        "black");

    for (const o of sceneObjects){
        if(o.collider !== undefined){
            const x = (o.collider.x - (camera.x - camera.width/2.0)) * (o.parallaxValue);
            const y = (o.collider.y - (camera.y - camera.height/2.0));
            drawRectangle(x, y, o.collider.width, o.collider.height, "black");
        }
    }
}

function drawFilledRectangle(x, y, w, h, color) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.fillStyle = color;
    context.closePath();
    context.fill();
}

function drawRectangle(x, y, w, h, color) {
    context.beginPath();
    context.rect(x, y, w, h);
    context.strokeStyle = color;
    context.closePath();
    context.stroke();
}

function onDraw(){
    updateState();
    drawObjects();
    drawDebug();
}

function onPlayClick() {
    // event.currentTarget.classList.toggle('is-flipped');
    //let requestId = requestAnimationFrame(callback) // https://javascript.info/js-animation
    intervalId = setInterval(onDraw, 15);
}
