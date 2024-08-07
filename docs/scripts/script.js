window.addEventListener("load", onLoad);

var canvas;
var context;

var sceneObjects = [];

var delta = 4;

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

    // life = document.querySelector('.life');
    // screen = document.querySelector('.screen');

    var imgC = new Image();
    //imgC.src = 'images/forest/sky.png';
    imgC.src = 'images/scene/sky.png';
    var o = new StaticObject(
        imgC,
        0.1,
        0,
        0,
        0
    );
    sceneObjects.push(o);

    imgC = new Image();
    //imgC.src = 'images/forest/far_trees.png';
    imgC.src = 'images/scene/far_trees.png';
    var o = new StaticObject(
        imgC,
        0.5,
        0,
        0,
        3
    );
    sceneObjects.push(o);

    imgC = new Image();
    //imgC.src = 'images/forest/road_and_trees.png';
    imgC.src = 'images/scene/main_road.png';
    var o = new StaticObject(
        imgC,
        1,
        0,
        0,
        9
    );
    sceneObjects.push(o);

    imgC = new Image();
    imgC.src = 'images/doggo/idle_right_doggo.png';
    var playerIdleRightAnimator = new LoopAnimator(imgC, 95, 400);
    imgC = new Image();
    imgC.src = 'images/doggo/idle_left_doggo.png';
    var playerIdleLeftAnimator = new LoopAnimator(imgC, 95, 400);
    imgC = new Image();
    imgC.src = 'images/doggo/walk_right_doggo.png';
    var playerGoRightAnimator = new LoopAnimator(imgC, 95, 200);
    imgC = new Image();
    imgC.src = 'images/doggo/walk_left_doggo.png';
    var playerGoLeftAnimator = new LoopAnimator(imgC, 95, 200);

    player = new Player(
        playerIdleRightAnimator,
        playerIdleLeftAnimator,
        playerGoRightAnimator,
        playerGoLeftAnimator,
        1, // ParallaxValue
        250, // x
        370, // y
        10, // z
        delta
    );
    sceneObjects.push(player);
 
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    const worldCollider = new Collider(0, 0, 2750, canvas.height)
    camera = new Camera(100, 370, canvas.width, canvas.height, worldCollider);

    //onPlayClick();
    canvas.addEventListener('click', onPlayClick);

    // var screen = document.querySelector('.screen');
    // var life = document.querySelector('.life');
    // screen.scrollTop = screen.scrollHeight;

	// card.addEventListener('click', onCardClick);
    // onResize();
    
}

function updateState() {
    var input = InputType.No;

    
    if(keyboardController.isGoRightPressed() === true && !keyboardController.isGoLeftPressed() === true){
        input = InputType.Right;
    }

    if(keyboardController.isGoLeftPressed() === true && !keyboardController.isGoRightPressed() === true){
        input = InputType.Left;
    }

    player.act(input);//.x += d;

    camera.follow(player);

    // sceneObjects.forEach(o => {
    //     o.X += d * o.ParallaxValue;
    // });    
}

function drawObjects() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    sceneObjects.forEach(o => {

        var image;

        var sourceImageX;
        var sourceImageY;

        var w;
        var h;

        const x = (o.x - (camera.x - camera.width/2.0)) * (o.parallaxValue);
        const y = (o.y - (camera.y - camera.height/2.0));// * (o.ParallaxValue);

        if(o.animator !== undefined){
            o.animator.prepareFrame();

            image = o.animator.image;

            sourceImageX = o.animator.sourceImageX;
            sourceImageY = o.animator.sourceImageY;
 
            w = o.animator.width;
            h = o.animator.height;
        }
        else{
            image = o.image;

            sourceImageX = 0;
            sourceImageY = 0;

            w = o.image.width;
            h = o.image.height;
        }
        context.drawImage(image, sourceImageX, sourceImageY, w, h, x, y, w, h);
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
