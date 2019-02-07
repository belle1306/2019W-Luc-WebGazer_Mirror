const ROWS = 8;
const COLUMNS = parseInt(window.outerWidth/150);

const questions = [
    'Are lizards small?',
    'Are apples red fruit?',
    'Are muscles needed to move?',
    'Is ice cream sweet?',
    'Are bananas vegetables?',
    'Do dogs live in the jungle?',
    'Are roses tall trees?',
    'Are wild animals dangerous?',
    'Is coffee a cold drink?',
    'Can you dig with a shovel?',
    'Can books brush your teeth?',
    'Are vegetables healthy?',
    'Are artists creative?',
    'Are markers used to write?',
    'Is Spanish a language?',
    'Can cars drive under water?',
    'Are rattlesnakes poisonous?',
    'Are band-aids used for cuts?',
    'Do umbrellas keep you wet?',
    'Is there a "d" in "dressing"?',
    'Are flies small insects?',
    'Are clocks used to tell time?',
    'Are pianos green?',
    'Is paint used for baths?',
    'Is tylenol a pain reliever?',
    'Are airplanes flown inside?',
    'Are pillows used to sleep on?',
    'Are socks worn over shoes?',
    'Is football a type of food?',
    'Are chips and pretzels salty?',
    'Are houses more than $50?',
    'Is spaghetti a Chinese dish?',
    'Are peanuts made into jam?',
    'Do ovens freeze things?',
    'Are there 80 hours in a day?',
    'Are there 60 days in a month?',
    'Is green a colour?',
    'Is orange a fruit?',
    'Do squids have fins?',
    'Do sharks walk?',
    'Can kittens fly?',
    'Is baseball a sport?',
    'Is red a primary color?',
    'Does 2x8 = 16?',
    'Are sports fun?',
    'Is yellow a fruit?',
    'Can a bar of soap be a pet?',
    'Is black brighter than white?',
    'Do cats like dogs?',
    'Is orange a color?',
    'Do fridges keep things warm?',
    'Are icecubes round?',
    'Can trees talk?',
    'Can birds fly?',
    'Can fish swim?',
    'Is winter cold?',
    'Can fish walk?',
    'Are roses red?',
    'Can birds walk?',
    'Does gravity exist?',
    'Are wheels round?',
    'Does rain fall?',
    'Do sharks talk?',
    'Are bees smart?',
];
var answers = 0; // Number of questions answered

$(document).ready(function () {
    var data;
    var attentionController = new AttentionController();
    console.log("Starting up!");
    
    webgazer.setCameraConstraints({
        video: { deviceId: JSON.parse(localStorage.getItem('camera')) },
        width: { ideal: 320 },
        height: { ideal: 240 }
    });

    webgazer.params.showGazeDot = true;
    webgazer.setRegression("ridge");

    if (storedRegressionData) {
        window.location.href = "/dataCollection";
        return;
    } else {
        attentionController.generateCalibrationDots();
    }
    webgazer.setGazeListener(() => { return }).begin();
});