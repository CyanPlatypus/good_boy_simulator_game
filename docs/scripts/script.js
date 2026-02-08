window.addEventListener("load", onLoad);

var canvas;
var context;

var keyboardController;
var camera;

var game;
var intervalId;

var playButton;

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
 
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    context.imageSmoothingEnabled = false;

    game = new Game();

    const worldCollider = new Collider(0, 0, 2000, canvas.height);
    camera = new Camera(100, 370, canvas.width, canvas.height, worldCollider);

    playButton = document.getElementById('playButton');
    playButton.addEventListener('click', onPlayClick);
}

function updateState() {
    for (const o of game.sceneObjects){
        o.act();
    }
    camera.follow(game.player);
}

function drawObjects() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    game.sceneObjects.forEach(o => {

        var image;

        var sourceImageX;
        var sourceImageY;

        var sourceW;
        var sourceH;

        const x = (o.x - (camera.x - camera.width/2.0)) * (o.parallaxValue);
        const y = (o.y - (camera.y - camera.height/2.0));// * (o.ParallaxValue);
        
        if(o.view instanceof LoopAnimator){
            const animator = o.view;
            animator.prepareFrame();

            image = animator.image;

            sourceImageX = animator.sourceImageX;
            sourceImageY = animator.sourceImageY;
 
            sourceW = animator.width;
            sourceH = animator.height;
        }
        else{
            image = o.view.image;

            sourceImageX = 0;
            sourceImageY = 0;

            sourceW = image.width;
            sourceH = image.height;
        }

        w = sourceW * game.imageScale;
        h = sourceH * game.imageScale;
 
        context.drawImage(image, sourceImageX, sourceImageY, sourceW, sourceH, x, y, w, h);

        if (o.view.isHorisontalTile){

            // repeat the image to fill the entire width of the canvas
            let currentX = x;

            // draw to the left
            while (currentX > 0) {
                currentX -= w;
                context.drawImage(image, sourceImageX, sourceImageY, sourceW, sourceH, currentX, y, w, h);
            }

            // reset currentX and draw to the right
            currentX = x + w;
            while (currentX < canvas.width) {
                context.drawImage(image, sourceImageX, sourceImageY, sourceW, sourceH, currentX, y, w, h);
                currentX += w;
            }
        }
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

    for (const o of game.sceneObjects){
        let collider = o.collider;
        if(collider === undefined){
            if (o.hasRole(RoleType.Collidable)){
                collider = o.getRole(RoleType.Collidable).collider;
            }
        }
        if(collider !== undefined){
            const x = (collider.x - (camera.x - camera.width/2.0)) * (o.parallaxValue);
            const y = (collider.y - (camera.y - camera.height/2.0));
            drawRectangle(x, y, collider.width, collider.height, "black");
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
    //drawDebug();
}

function onPlayClick() {
    // event.currentTarget.classList.toggle('is-flipped');
    //let requestId = requestAnimationFrame(callback) // https://javascript.info/js-animation

    playButton.style.display = 'none';

    if (intervalId === undefined) {
        intervalId = setInterval(onDraw, 15);
    }
}
