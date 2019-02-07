const CameraSetupController = function (videoElement, videoSelect) {
    this.createDeviceList = (deviceInfos) => {
        const storedDevice = JSON.parse(localStorage.getItem('camera'));
        deviceInfos.forEach((deviceInfo) => {
            var option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || `device${videoSelect.length}`;
                videoSelect.appendChild(option);
                if(option.value === storedDevice) {
                    videoSelect.value = storedDevice;
                }
            }
        });
    };
    this.setStream = () => {
        if (window.stream) {
            window.stream.getTracks().forEach(function(track) {
              track.stop();
            });
        }
        navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: {exact: videoSelect.value}
            }
        }).then((stream)=>{
            window.stream = stream; // make stream available to console
            videoElement.srcObject = stream;
        }).catch(handleError);
    };
    this.handleError = (error) => (
        console.log('Error: ', error)
    );
    this.setCameraOptions = () => {
        localStorage.setItem('camera', JSON.stringify(videoSelect.value));
        bannerController.showAlert('Success!', 'Camera setting has been saved', "/");
    };
    videoSelect.onchange = this.setStream;
    navigator.mediaDevices.enumerateDevices()
    .then(this.createDeviceList).then(this.setStream).catch(this.handleError);
}


