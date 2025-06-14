class KeyboardController {

    constructor(){
        this.pressedKeys = {};
        this.pressedKeys["r"] = false;
        this.pressedKeys["l"] = false;
        this.pressedKeys["j"] = false;
        this.pressedKeys["i"] = false;
    }

    consumeKey(keyCode, keyPressed){

        var consumed = false;
    
        switch(keyCode) {
        case "KeyD":
        case "ArrowRight":
            this.pressedKeys["r"] = keyPressed;
            consumed = true;
            break;
        case "KeyA":
        case "ArrowLeft":
            this.pressedKeys["l"] = keyPressed;
            consumed = true;
            break;
        case "KeyW":
        case "ArrowUp":
            this.pressedKeys["j"] = keyPressed;
            consumed = true;
            break;
        case "Enter":
            this.pressedKeys["i"] = keyPressed;
            consumed = true;
            break;
        }
        
        return consumed;
    }

    isGoRightPressed(){
        return this.pressedKeys["r"];
    }

    isGoLeftPressed(){
        return this.pressedKeys["l"];
    }

    isJumpPressed(){
        return this.pressedKeys["j"];
    }

    isInteractPressed(){
        return this.pressedKeys["i"];
    }
}