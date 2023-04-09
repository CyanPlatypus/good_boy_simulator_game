window.addEventListener("load", onLoad);

var canvas;
var context;

//var cloud;
var sceneObjects = [];
var player;
var camera;

var delta = 10;

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
    imgC.src = 'images/forest/sky.png';
    var o = {
        Image : imgC,
        ParallaxValue: 0.1,
        localX : 0,
        localY: 0,
        Z : 0
    }
    sceneObjects.push(o);

    imgC = new Image();
    imgC.src = 'images/forest/far_trees.png';
    var o = {
        Image : imgC,
        ParallaxValue: 0.5,
        localX : 0,
        localY: 0,
        Z : 3
    }
    sceneObjects.push(o);

    imgC = new Image();
    imgC.src = 'images/forest/road_and_trees.png';
    var o = {
        Image : imgC,
        ParallaxValue: 1,
        localX : 0,
        localY: 0,
        Z : 9
    }
    sceneObjects.push(o);

    imgC = new Image();
    imgC.src = 'images/animated_cloud.gif';
    player = {
        Image : imgC,
        ParallaxValue: 1,
        localX : 350,
        localY: 370,
        Z : 10
    }
    sceneObjects.push(player);

    camera = new Camera(100, 370, width = 700, height = 500);

    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');

    //onPlayClick();
    //todo uncomment below
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

    player.localX += d;

    camera.follow(player);

    // sceneObjects.forEach(o => {
    //     o.X += d * o.ParallaxValue;
    // });    
}

function drawObjects() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // sceneObjects.forEach(o => {
    //     context.drawImage(o.Image, o.X, o.Y, o.Image.width, o.Image.height);
    // });

    sceneObjects.forEach(o => {
        context.drawImage(
            o.Image,
            //o.localX,
            (o.localX - (camera.localX - camera.width/2.0)) * (o.ParallaxValue),
            o.localY,
            o.Image.width,
            o.Image.height);
    });

    context.beginPath();
    // context.rect(
    //     (camera.localX - camera.width/2.0) - (camera.localX - camera.width/2.0),
    //     camera.localY  - camera.height/2.0,
    //     camera.width-10,
    //     camera.height-10);
    //     context.stroke();
}

function onDraw(){
    updateState();
    drawObjects();
}

function onPlayClick() {
    // event.currentTarget.classList.toggle('is-flipped');
    intervalId = setInterval(onDraw, 30);
}

// todo camera's XY are centered, but it's not like that or the rest of the objects
//todo we need to move to centered cooddinates?
class Camera{

    constructor(localX, localY, width, height){
        this.localX = localX;
        this.localY = localY;
        this.width = width;
        this.height = height;

        this.deltaX = 0;
        this.deltaY = 0;
    }

    follow(objectToFollow){
        this.deltaX = (objectToFollow.localX - this.localX);// to make is smooth / 10.0;
        this.deltaY = (objectToFollow.localY - this.localY);// to make it smooth / 10.0;

        this.localX += this.deltaX;
        this.localY += this.deltaY;
    }

} 

// issues after adding camera: lower player speed