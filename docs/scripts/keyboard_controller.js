class KeyboardController {

    constructor(){
        this.pressedKeys = {};
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
        }
        
        return consumed;
    }

    isGoRightPressed(){
        return this.pressedKeys["r"];
    }

    isGoLeftPressed(){
        return this.pressedKeys["l"]
    }
}