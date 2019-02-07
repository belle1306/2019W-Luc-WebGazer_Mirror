IntroductionController = function () {
    this.changeSlide = (slideNumber) => {
        $(`#content`).html($(`#slide${slideNumber}`).html());
        $("#next").text("Continue");
        switch(slideNumber){
            case 0:
                $("#back").addClass("hidden");
                break;
            case 1:
                $("#back").removeClass("hidden");
                break;
            case 6:
                $("#next").text("Begin Calibration");
                break;
            case 7:
                window.location.pathname  = "/calibration"
                break;
        }
    
    }
};