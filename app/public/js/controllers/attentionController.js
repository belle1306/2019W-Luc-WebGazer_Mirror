const AttentionController = function(){};
AttentionController.previousTime = -1;
AttentionController.timer = () => {
    if(AttentionController.previousTime === -1) {
        AttentionController.previousTime = Date.now();
    } else {
        if((Date.now() - AttentionController.previousTime) > 500) {
            console.log('play')
            var audio = new Audio('/audio/ding.mp3');
            audio.play();
            AttentionController.previousTime = -1;
        }
    }
};

AttentionController.prototype = {
    checker : (x, y) => {
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;
        if(x < 0 || y < 0 || x > windowWidth || y > windowHeight) {
            AttentionController.timer();
        } else {
            AttentionController.previousTime = -1;
        }
    }
};

const attentionController = new AttentionController();