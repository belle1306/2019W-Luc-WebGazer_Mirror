$(document).ready(function(){
    introductionController = new IntroductionController();
    introductionController.changeSlide(0);
    $( "#back" ).click(function() {
        if(currentSlide > 0) {
            currentSlide--;
            introductionController.changeSlide(currentSlide);
        }
    });
    
    $( "#next" ).click(function() {
        currentSlide++;
        introductionController.changeSlide(currentSlide);
    });
});