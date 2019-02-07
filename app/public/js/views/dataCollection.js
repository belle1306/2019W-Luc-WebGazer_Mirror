$(document).ready(function(){
    document.body.className = "dataCollection";

    webgazer.setCameraConstraints({
        video: { deviceId: JSON.parse(localStorage.getItem('camera')) },
        width: { ideal: 320 },
        height: { ideal: 240 }
    });
    webgazer.params.showGazeDot = true;

    if(storedRegressionData) {
        webgazer.setGlobalData(storedRegressionData);
    }

    $("#surveyContainer").Survey({
        model: survey,
        onComplete: onSurveyComplete,
        showPrevButton: false
    });

    webgazer.setGazeListener((data, elapsedTime) => {
        if (data == null) {
            return;
        }
        webSocketController.sendData(`${elapsedTime},${data.x},${data.y}\n`, elapsedTime);
        attentionController.checker(data.x, data.y);
    }).begin();

});

const onSurveyComplete = (survey) => {
    data = webgazer.getGlobalData();
    webSocketController.storeRegressionData(data);
    webSocketController.storeSurveyData(JSON.stringify(survey.data));
    webgazer.pause();
    $('canvas, video, .toggleVideo, #webgazerGazeDot').remove();
    $('#btn-logout').removeClass("hidden");
}


const toggleWebcamFeed = () => {
    const next = $('.toggleVideo').attr("next");
    const open = next === "Open";
    $('canvas, video, .toggleVideo').toggleClass("hide");
    $('.toggleVideo').text(`${next} webcam feed`);
    $('.toggleVideo').attr("next", open ? "Close" : "Open")
};

$('.toggleVideo').click(toggleWebcamFeed);