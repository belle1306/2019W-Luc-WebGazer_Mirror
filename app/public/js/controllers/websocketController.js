const WebSocketController = function() {
    this.init.apply(this, arguments);
};
WebSocketController.connection = new WebSocket(`wss://${window.location.hostname}:8080`);

WebSocketController.prototype = {
    init : () => {
        WebSocketController.connection.onopen = () => {
            packet = {
                command: "open",
                name: name,
                timestamp: logTimestamp
            };
            WebSocketController.connection.send(JSON.stringify(packet));
        }
        
        WebSocketController.connection.onerror = (error) => {
            console.error(`WebSocket error: ${error}`);
        }
    },
    sendData : (data, timestamp) => {
        if(WebSocketController.connection.readyState === WebSocket.OPEN) {
            packet = {
                command: "append",
                logPath: `${name}/${logTimestamp}`,
                data: data
            };
            WebSocketController.connection.send(JSON.stringify(packet));
    
            if(allowFaceCollect) {
                packet2 = {
                    command: "image",
                    logPath: `${name}/${logTimestamp}`,
                    data: webSocketHelpers.getFrame(),
                    timestamp: timestamp
                };
                WebSocketController.connection.send(JSON.stringify(packet2));
            }
        } else {
            console.error(`Connection not established`);
        }
    },
    storeRegressionData : (data) => {
        if(WebSocketController.connection.readyState === WebSocket.OPEN) {
            packet = {
                command: "storeRegression",
                user: user,
                data: data
            };
            WebSocketController.connection.send(JSON.stringify(packet));
        }
    },
    storeSurveyData : (data) => {
        if(WebSocketController.connection.readyState === WebSocket.OPEN) {
            packet = {
                command: "storeSurvey",
                logPath: `${name}/${logTimestamp}`,
                data: data
            };
            WebSocketController.connection.send(JSON.stringify(packet));
        }
    },
};

const webSocketController = new WebSocketController();

const webSocketHelpers = {
    // returns a canvas frame encoded in base64
    getFrame : () => {
        const faceImageData = webSocketHelpers.getCroppedFaceImageData();
        if(faceImageData) {
            return webSocketHelpers.imageDataToImage(faceImageData);
        }
        return "";
    },
    getFaceBounds : () => {
        cl = webgazer.getTracker().clm;
        pos = cl.getCurrentPosition(); // Array of arrays containing positions corresponding to the face
        return pos.reduce((max, next) => { // Reduce array to an array representing the rectangle bounds of the face
            if(!max[2] && !max[3]) {
                max[2] = next[0];
                max[3] = next[1];
            }
            if(next[0] < max[0]) { // Top
                max[0] = next[0];
            }
            if(next[0] > max[2]) { // Right
                max[2] = next[0];
            }
            if(next[1] < max[1]) { // Left
                max[1] = next[1];
            }
            if(next[1] > max[3]) { // Bottom
                max[3] = next[1];
            }
            return max;
        });
    },
    getCroppedFaceImageData : () => {
        const canvas = document.getElementById('webgazerVideoCanvas');
        if(canvas) {
            const ctx = canvas.getContext('2d');
            const bounds = webSocketHelpers.getFaceBounds();
            const feedbackBoxBounds = webgazer.computeValidationBoxSize() //Get feedbackbox bounds
            return ctx.getImageData(
                bounds[0],
                bounds[1] - 25,
                bounds[2] - bounds[0],
                bounds[3] - (bounds[1] - 25)
            );
        }
        return false;
    },
    imageDataToImage : (imagedata) => {
        if(!imagedata) {
            return;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);
        return canvas.toDataURL('image/png', 0.5).replace(/^data:image\/png;base64,/, "");
    }
};