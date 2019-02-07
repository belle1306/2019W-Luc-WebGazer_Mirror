$(document).ready(function () {
    var videoElement = document.querySelector('video');
    var videoSelect = document.querySelector('select#cameraSource');
    const cameraSetupController = new CameraSetupController(videoElement, videoSelect);
    $('#btn-back').click(()=>{
        window.location.href = "/";
    });
    $('#btn-setCamera').click(cameraSetupController.setCameraOptions);
});
