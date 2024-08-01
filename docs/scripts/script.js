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
    imgC.src = 'images/idle_doggo.png';
    var playerIdleAnimator = new LoopAnimator(imgC, 90, 400);
    player = new Player(
        playerIdleAnimator,
        1, // ParallaxValue
        250, // x
        370, // y
        10 // z
    );
    sceneObjects.push(player);
 
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    camera = new Camera(100, 370, canvas.width, canvas.height);

    //onPlayClick();
    canvas.addEventListener('click', onPlayClick);

    // var screen = document.querySelector('.screen');
    // var life = document.querySelector('.life');
    // screen.scrollTop = screen.scrollHeight;

	// card.addEventListener('click', onCardClick);
    // onResize();
    
}

function updateState() {
    var d = 0;

    
    if(keyboardController.isGoRightPressed() === true && !keyboardController.isGoLeftPressed() === true){
        d = delta;
    }

    if(keyboardController.isGoLeftPressed() === true && !keyboardController.isGoRightPressed() === true){
        d = -delta;
    }

    player.X += d;

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

        const x = (o.X - (camera.X - camera.width/2.0)) * (o.ParallaxValue);
        const y = (o.Y - (camera.Y - camera.height/2.0)) * (o.ParallaxValue);

        if(o.Animator !== undefined){
            o.Animator.PrepareFrame();

            image = o.Animator.Image;

            sourceImageX = o.Animator.SourceImageX;
            sourceImageY = o.Animator.SourceImageY;
 
            w = o.Animator.Width;
            h = o.Animator.Height;
        }
        else{
            image = o.Image;

            sourceImageX = 0;
            sourceImageY = 0;

            w = o.Image.width;
            h = o.Image.height;
        }
        context.drawImage(image, sourceImageX, sourceImageY, w, h, x, y, w, h);
    });
}

function drawDebug(){

    const xInScene = (camera.X - (camera.X - camera.width/2.0));
    const yInScene = (camera.Y - (camera.Y - camera.height/2.0));

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
