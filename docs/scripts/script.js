window.addEventListener("load", onLoad);

var canvas;
var context;

//var cloud;
var sceneObjects = [];

var delta = 4;

var pressedKeys = {};

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

function onKeyChange(event, keyPressed){
    if (event.defaultPrevented) {
        return; // Do nothing if event already handled
    }

    var consumed = false;

    switch(event.code) {
    case "KeyD":
    case "ArrowRight":
        pressedKeys["r"] = keyPressed;
        consumed = true;
        break;
    case "KeyA":
    case "ArrowLeft":
        pressedKeys["l"] = keyPressed;
        consumed = true;
        break;
    }
    
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
    // life = document.querySelector('.life');
    // screen = document.querySelector('.screen');

    var imgC = new Image();
    //imgC.src = 'images/forest/sky.png';
    imgC.src = 'images/scene/sky.png';
    var o = new StaticObject(
        imgC,
        -0.1,
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
        -0.5,
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
        -1,
        0,
        0,
        9
    );
    sceneObjects.push(o);

    imgC = new Image();
    imgC.src = 'images/doggo.png';
    var player = new Player(
        imgC,
        0, // ParallaxValue
        250, // x
        370, // y
        10 // z
    );
    sceneObjects.push(player);

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

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

    if(pressedKeys["r"] === true && !pressedKeys["l"] === true){
        d = delta;
    }

    if(pressedKeys["l"] === true && !pressedKeys["r"] === true){
        d = -delta;
    }

    sceneObjects.forEach(o => {
        o.X += d * o.ParallaxValue;
    });    
}

function drawObjects() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    sceneObjects.forEach(o => {
        context.drawImage(o.Image, o.X, o.Y, o.Image.width, o.Image.height);
    });
}

function onDraw(){
    updateState();
    drawObjects()
}

function onPlayClick() {
    // event.currentTarget.classList.toggle('is-flipped');
    intervalId = setInterval(onDraw, 15);
}

