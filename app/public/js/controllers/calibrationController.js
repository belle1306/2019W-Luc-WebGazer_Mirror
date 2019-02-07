const AttentionController = (function () {
    this.generateCalibrationDots = () => {
        var trainDot, row, i, j;
        const windowWidth = document.documentElement.clientWidth;
        const windowHeight = document.documentElement.clientHeight;
        for (i = 0; i < ROWS; i++) {
            row = document.createElement('div');
            row.setAttribute('class', 'row');
            document.getElementById("rowContainer").appendChild(row);
            for (j = 0; j < COLUMNS; j++) {
                const questionNum = (i * COLUMNS) + j;
                row.appendChild(this.generateQuestion(questions[questionNum], questionNum));
            }
        }
    };
    this.generateQuestion = (question, num) => {
        const container = document.createElement('div');
        const questionText = document.createElement('div');
        const answerContainer = document.createElement('div');
        var yes = document.createElement('input');
        var no = document.createElement('input');
        yes.setAttribute("type", "button");
        yes.setAttribute('questionNumber', num);
        yes.setAttribute("id", `yes${num}`);
        yes.setAttribute("value", "Yes");
        yes.setAttribute("class", "question");
        yes.onclick = this.onAnswerClick;
        no.setAttribute("type", "button");
        no.setAttribute("id", `no${num}`);
        no.setAttribute('questionNumber', num);
        no.setAttribute("value", "No");
        no.setAttribute("class", "question");
        no.onclick = this.onAnswerClick;
    
        questionText.innerText = question;
        container.appendChild(questionText);
        answerContainer.appendChild(yes);
        answerContainer.appendChild(no);
        container.appendChild(answerContainer);
        answerContainer.setAttribute("class", "answerContainer");
        container.setAttribute("class", "questionContainer");
        return container;
    };
    this.onAnswerClick = (e) => {
        var data;
        const questionNumber = e.currentTarget.getAttribute('questionNumber')
        const yes = document.getElementById(`yes${questionNumber}`);
        const no = document.getElementById(`no${questionNumber}`);
        yes.disabled = true;
        no.disabled = true;
        answers++;
        if (answers === (ROWS * COLUMNS)) {
            this.completeCalibration();
        }
    },
    this.completeCalibration = () => {
        data = webgazer.getGlobalData();
        webSocketController.storeRegressionData(data);
        $("#spinner").removeClass("hidden");
        setTimeout(() => {
            window.location.href = "/dataCollection";
        }, 3000);
    }
});