class KeyboardController {

    constructor(){
        this.PressedKeys = {};
    }

    consumeKey(keyCode, keyPressed){

        var consumed = false;
    
        switch(keyCode) {
        case "KeyD":
        case "ArrowRight":
            this.PressedKeys["r"] = keyPressed;
            consumed = true;
            break;
        case "KeyA":
        case "ArrowLeft":
            this.PressedKeys["l"] = keyPressed;
            consumed = true;
            break;
        }
        
        return consumed;
    }

    isGoRightPressed(){
        return this.PressedKeys["r"];
    }

    isGoLeftPressed(){
        return this.PressedKeys["l"]
    }
}